package models

import (
	"time"
	"gorm.io/gorm"
)

type Bill struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	UserID      uint           `json:"user_id" gorm:"not null;index"`
	CategoryID  uint           `json:"category_id" gorm:"not null;index"`
	Type        string         `json:"type" gorm:"not null;check:type IN ('income','expense')"`
	Amount      float64        `json:"amount" gorm:"not null;check:amount > 0"`
	Merchant    string         `json:"merchant" gorm:"not null"`
	Description string         `json:"description"`
	BillTime    time.Time      `json:"bill_time" gorm:"not null;index"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`

	User     User     `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Category Category `json:"category,omitempty" gorm:"foreignKey:CategoryID"`
}

type BillResponse struct {
	ID          uint      `json:"id"`
	Type        string    `json:"type"`
	Amount      float64   `json:"amount"`
	Category    string    `json:"category"`
	Merchant    string    `json:"merchant"`
	Description string    `json:"description"`
	Time        time.Time `json:"time"`
	Synced      bool      `json:"synced"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func (b *Bill) ToResponse() BillResponse {
	return BillResponse{
		ID:          b.ID,
		Type:        b.Type,
		Amount:      b.Amount,
		Category:    b.Category.Name,
		Merchant:    b.Merchant,
		Description: b.Description,
		Time:        b.BillTime,
		Synced:      true,
		CreatedAt:   b.CreatedAt,
		UpdatedAt:   b.UpdatedAt,
	}
}

type CreateBillRequest struct {
	Type        string    `json:"type" binding:"required,oneof=income expense"`
	Amount      float64   `json:"amount" binding:"required,gt=0"`
	CategoryID  uint      `json:"category_id" binding:"required"`
	Merchant    string    `json:"merchant" binding:"required"`
	Description string    `json:"description"`
	BillTime    time.Time `json:"bill_time" binding:"required"`
}

type UpdateBillRequest struct {
	Type        string    `json:"type" binding:"omitempty,oneof=income expense"`
	Amount      float64   `json:"amount" binding:"omitempty,gt=0"`
	CategoryID  uint      `json:"category_id" binding:"omitempty"`
	Merchant    string    `json:"merchant" binding:"omitempty"`
	Description string    `json:"description"`
	BillTime    time.Time `json:"bill_time" binding:"omitempty"`
}

type BillsQuery struct {
	Page       int    `form:"page,default=1" binding:"min=1"`
	Limit      int    `form:"limit,default=20" binding:"min=1,max=100"`
	Type       string `form:"type" binding:"omitempty,oneof=income expense"`
	CategoryID uint   `form:"category_id"`
	StartDate  string `form:"start_date"`
	EndDate    string `form:"end_date"`
	Search     string `form:"search"`
	SortBy     string `form:"sort_by,default=bill_time" binding:"omitempty,oneof=bill_time amount created_at"`
	SortOrder  string `form:"sort_order,default=desc" binding:"omitempty,oneof=asc desc"`
}