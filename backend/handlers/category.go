package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"finmind-backend/middleware"
	"finmind-backend/models"
)

type CategoryHandler struct {
	db *gorm.DB
}

func NewCategoryHandler(db *gorm.DB) *CategoryHandler {
	return &CategoryHandler{db: db}
}

type CreateCategoryRequest struct {
	Name  string `json:"name" binding:"required,min=1"`
	Type  string `json:"type" binding:"required,oneof=income expense"`
	Icon  string `json:"icon" binding:"required"`
	Color string `json:"color" binding:"required"`
}

type UpdateCategoryRequest struct {
	Name  string `json:"name" binding:"omitempty,min=1"`
	Icon  string `json:"icon"`
	Color string `json:"color"`
}

func (h *CategoryHandler) GetCategories(c *gin.Context) {
	categoryType := c.Query("type")

	var categories []models.Category
	query := h.db.Order("is_default DESC, created_at ASC")

	if categoryType != "" {
		query = query.Where("type = ?", categoryType)
	}

	if err := query.Find(&categories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch categories"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"categories": categories})
}

func (h *CategoryHandler) CreateCategory(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var req CreateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var existingCategory models.Category
	if err := h.db.Where("name = ? AND type = ?", req.Name, req.Type).First(&existingCategory).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Category with this name already exists"})
		return
	}

	category := models.Category{
		Name:      req.Name,
		Type:      req.Type,
		Icon:      req.Icon,
		Color:     req.Color,
		IsDefault: false,
		UserID:    &userID,
	}

	if err := h.db.Create(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create category"})
		return
	}

	c.JSON(http.StatusCreated, category)
}

func (h *CategoryHandler) UpdateCategory(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	categoryID, err := middleware.GetUserIDFromParam(c, "id")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category ID"})
		return
	}

	var req UpdateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var category models.Category
	if err := h.db.Where("id = ? AND (user_id = ? OR user_id IS NULL)", categoryID, userID).First(&category).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
		return
	}

	if category.IsDefault {
		c.JSON(http.StatusForbidden, gin.H{"error": "Cannot modify default category"})
		return
	}

	if category.UserID == nil || *category.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Permission denied"})
		return
	}

	if req.Name != "" {
		category.Name = req.Name
	}
	if req.Icon != "" {
		category.Icon = req.Icon
	}
	if req.Color != "" {
		category.Color = req.Color
	}

	if err := h.db.Save(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update category"})
		return
	}

	c.JSON(http.StatusOK, category)
}

func (h *CategoryHandler) DeleteCategory(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	categoryID, err := middleware.GetUserIDFromParam(c, "id")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category ID"})
		return
	}

	var category models.Category
	if err := h.db.Where("id = ? AND (user_id = ? OR user_id IS NULL)", categoryID, userID).First(&category).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
		return
	}

	if category.IsDefault {
		c.JSON(http.StatusForbidden, gin.H{"error": "Cannot delete default category"})
		return
	}

	if category.UserID == nil || *category.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Permission denied"})
		return
	}

	var billCount int64
	if err := h.db.Model(&models.Bill{}).Where("category_id = ?", categoryID).Count(&billCount).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check category usage"})
		return
	}

	if billCount > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "Cannot delete category with existing bills"})
		return
	}

	if err := h.db.Delete(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete category"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Category deleted successfully"})
}