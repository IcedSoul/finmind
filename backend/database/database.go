package database

import (
	"finmind-backend/models"
	"strings"
	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Connect(databaseURL string) (*gorm.DB, error) {
	var db *gorm.DB
	var err error

	config := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	}

	if strings.HasPrefix(databaseURL, "postgres://") {
		db, err = gorm.Open(postgres.Open(databaseURL), config)
	} else {
		db, err = gorm.Open(sqlite.Open(databaseURL), config)
	}

	if err != nil {
		return nil, err
	}

	return db, nil
}

func Migrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&models.User{},
		&models.Category{},
		&models.Bill{},
	)
}