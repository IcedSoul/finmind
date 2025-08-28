package models

import (
	"time"
	"gorm.io/gorm"
)

type Category struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	Name      string         `json:"name" gorm:"not null"`
	Type      string         `json:"type" gorm:"not null;check:type IN ('income', 'expense')"`
	Icon      string         `json:"icon" gorm:"not null"`
	Color     string         `json:"color" gorm:"not null"`
	IsDefault bool           `json:"is_default" gorm:"default:false"`
	UserID    *uint          `json:"user_id,omitempty" gorm:"index"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	Bills []Bill `json:"-" gorm:"foreignKey:CategoryID"`
}