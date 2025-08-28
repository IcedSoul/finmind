package database

import (
	"finmind-backend/models"
	"gorm.io/gorm"
	"log"
)

func SeedData(db *gorm.DB) error {
	var count int64
	db.Model(&models.Category{}).Count(&count)
	if count > 0 {
		log.Println("Categories already seeded")
		return nil
	}

	incomeCategories := []models.Category{
		{Name: "Salary", Type: "income", Icon: "briefcase", Color: "#4CD964", IsDefault: true},
		{Name: "Bonus", Type: "income", Icon: "award", Color: "#5AC8FA", IsDefault: true},
		{Name: "Part-time", Type: "income", Icon: "clock", Color: "#007AFF", IsDefault: true},
		{Name: "Investment", Type: "income", Icon: "trending-up", Color: "#34C759", IsDefault: true},
		{Name: "Other Income", Type: "income", Icon: "plus-circle", Color: "#5856D6", IsDefault: true},
	}

	expenseCategories := []models.Category{
		{Name: "Food", Type: "expense", Icon: "coffee", Color: "#FF9500", IsDefault: true},
		{Name: "Shopping", Type: "expense", Icon: "shopping-bag", Color: "#FF3B30", IsDefault: true},
		{Name: "Transport", Type: "expense", Icon: "map", Color: "#FF2D55", IsDefault: true},
		{Name: "Entertainment", Type: "expense", Icon: "film", Color: "#AF52DE", IsDefault: true},
		{Name: "Housing", Type: "expense", Icon: "home", Color: "#FF9500", IsDefault: true},
		{Name: "Travel", Type: "expense", Icon: "map-pin", Color: "#5856D6", IsDefault: true},
		{Name: "Healthcare", Type: "expense", Icon: "activity", Color: "#FF2D55", IsDefault: true},
		{Name: "Education", Type: "expense", Icon: "book", Color: "#5AC8FA", IsDefault: true},
		{Name: "Other Expense", Type: "expense", Icon: "more-horizontal", Color: "#8E8E93", IsDefault: true},
	}

	categories := append(incomeCategories, expenseCategories...)

	result := db.Create(&categories)
	if result.Error != nil {
		return result.Error
	}

	log.Printf("Seeded %d categories", len(categories))
	return nil
}