package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"finmind-backend/middleware"
	"finmind-backend/models"
)

type BillHandler struct {
	db *gorm.DB
}

func NewBillHandler(db *gorm.DB) *BillHandler {
	return &BillHandler{db: db}
}

func (h *BillHandler) GetBills(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var query models.BillsQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if query.Page <= 0 {
		query.Page = 1
	}
	if query.Limit <= 0 || query.Limit > 100 {
		query.Limit = 20
	}

	db := h.db.Model(&models.Bill{}).Where("user_id = ?", userID)

	if query.Type != "" {
		db = db.Where("type = ?", query.Type)
	}
	if query.CategoryID > 0 {
		db = db.Where("category_id = ?", query.CategoryID)
	}
	if query.StartDate != "" {
		if startDate, err := time.Parse("2006-01-02", query.StartDate); err == nil {
			db = db.Where("bill_date >= ?", startDate)
		}
	}
	if query.EndDate != "" {
		if endDate, err := time.Parse("2006-01-02", query.EndDate); err == nil {
			db = db.Where("bill_date <= ?", endDate.Add(24*time.Hour-time.Second))
		}
	}
	if query.Search != "" {
		db = db.Where("merchant ILIKE ? OR description ILIKE ?", "%"+query.Search+"%", "%"+query.Search+"%")
	}

	var total int64
	if err := db.Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count bills"})
		return
	}

	orderBy := "bill_date DESC"
	if query.SortBy != "" {
		switch query.SortBy {
		case "amount":
			orderBy = "amount"
		case "merchant":
			orderBy = "merchant"
		case "created_at":
			orderBy = "created_at"
		default:
			orderBy = "bill_date"
		}
		if query.SortOrder == "asc" {
			orderBy += " ASC"
		} else {
			orderBy += " DESC"
		}
	}

	var bills []models.Bill
	offset := (query.Page - 1) * query.Limit
	if err := db.Preload("Category").Order(orderBy).Offset(offset).Limit(query.Limit).Find(&bills).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch bills"})
		return
	}

	billResponses := make([]models.BillResponse, len(bills))
	for i, bill := range bills {
		billResponses[i] = bill.ToResponse()
	}

	c.JSON(http.StatusOK, gin.H{
		"bills": billResponses,
		"pagination": gin.H{
			"page":       query.Page,
			"limit":      query.Limit,
			"total":      total,
			"total_pages": (total + int64(query.Limit) - 1) / int64(query.Limit),
		},
	})
}

func (h *BillHandler) GetBill(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	billID, err := middleware.GetUserIDFromParam(c, "id")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid bill ID"})
		return
	}

	var bill models.Bill
	if err := h.db.Preload("Category").Where("id = ? AND user_id = ?", billID, userID).First(&bill).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Bill not found"})
		return
	}

	c.JSON(http.StatusOK, bill.ToResponse())
}

func (h *BillHandler) CreateBill(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var req models.CreateBillRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var category models.Category
	if err := h.db.First(&category, req.CategoryID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category"})
		return
	}



	bill := models.Bill{
		UserID:      userID,
		Type:        req.Type,
		Amount:      req.Amount,
		CategoryID:  req.CategoryID,
		Merchant:    req.Merchant,
		Description: req.Description,
		BillTime:    req.BillTime,
	}

	if req.BillTime.IsZero() {
		bill.BillTime = time.Now()
	}

	if err := h.db.Create(&bill).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create bill"})
		return
	}

	if err := h.db.Preload("Category").First(&bill, bill.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load bill details"})
		return
	}

	c.JSON(http.StatusCreated, bill.ToResponse())
}

func (h *BillHandler) UpdateBill(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	billID, err := middleware.GetUserIDFromParam(c, "id")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid bill ID"})
		return
	}

	var req models.UpdateBillRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var bill models.Bill
	if err := h.db.Where("id = ? AND user_id = ?", billID, userID).First(&bill).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Bill not found"})
		return
	}

	updates := make(map[string]interface{})

	if req.CategoryID != 0 {
		updates["category_id"] = req.CategoryID
		// 验证分类是否存在且属于当前用户
		var category models.Category
		if err := h.db.Where("id = ? AND (user_id = ? OR user_id IS NULL)", req.CategoryID, userID).First(&category).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category"})
			return
		}
	}

	if req.Type != "" {
		updates["type"] = req.Type
	}
	if req.Amount != 0 {
		updates["amount"] = req.Amount
	}
	if req.Merchant != "" {
		updates["merchant"] = req.Merchant
	}
	if req.Description != "" {
		updates["description"] = req.Description
	}
	if !req.BillTime.IsZero() {
		updates["bill_time"] = req.BillTime
	}

	if err := h.db.Model(&bill).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update bill"})
		return
	}

	if err := h.db.Preload("Category").First(&bill, bill.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load bill details"})
		return
	}

	c.JSON(http.StatusOK, bill.ToResponse())
}

func (h *BillHandler) DeleteBill(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	billID, err := middleware.GetUserIDFromParam(c, "id")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid bill ID"})
		return
	}

	var bill models.Bill
	if err := h.db.Where("id = ? AND user_id = ?", billID, userID).First(&bill).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Bill not found"})
		return
	}

	if err := h.db.Delete(&bill).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete bill"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Bill deleted successfully"})
}

func (h *BillHandler) GetStatistics(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	period := c.DefaultQuery("period", "month")
	year, _ := strconv.Atoi(c.DefaultQuery("year", strconv.Itoa(time.Now().Year())))
	month, _ := strconv.Atoi(c.DefaultQuery("month", strconv.Itoa(int(time.Now().Month()))))

	var startDate, endDate time.Time
	switch period {
	case "year":
		startDate = time.Date(year, 1, 1, 0, 0, 0, 0, time.UTC)
		endDate = time.Date(year+1, 1, 1, 0, 0, 0, 0, time.UTC).Add(-time.Second)
	case "month":
		startDate = time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
		endDate = startDate.AddDate(0, 1, 0).Add(-time.Second)
	default:
		startDate = time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
		endDate = startDate.AddDate(0, 1, 0).Add(-time.Second)
	}

	type StatResult struct {
		Type   string  `json:"type"`
		Total  float64 `json:"total"`
		Count  int64   `json:"count"`
	}

	var stats []StatResult
	if err := h.db.Model(&models.Bill{}).
		Select("type, SUM(amount) as total, COUNT(*) as count").
		Where("user_id = ? AND bill_time >= ? AND bill_time <= ?", userID, startDate, endDate).
		Group("type").
		Scan(&stats).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch statistics"})
		return
	}

	type CategoryStat struct {
		CategoryID   uint    `json:"category_id"`
		CategoryName string  `json:"category_name"`
		Type         string  `json:"type"`
		Total        float64 `json:"total"`
		Count        int64   `json:"count"`
	}

	var categoryStats []CategoryStat
	if err := h.db.Model(&models.Bill{}).
		Select("bills.category_id, categories.name as category_name, bills.type, SUM(bills.amount) as total, COUNT(*) as count").
		Joins("LEFT JOIN categories ON bills.category_id = categories.id").
		Where("bills.user_id = ? AND bills.bill_time >= ? AND bills.bill_time <= ?", userID, startDate, endDate).
		Group("bills.category_id, categories.name, bills.type").
		Order("total DESC").
		Scan(&categoryStats).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch category statistics"})
		return
	}

	result := gin.H{
		"period":     period,
		"year":       year,
		"month":      month,
		"start_date": startDate.Format("2006-01-02"),
		"end_date":   endDate.Format("2006-01-02"),
		"summary":    stats,
		"categories": categoryStats,
	}

	c.JSON(http.StatusOK, result)
}