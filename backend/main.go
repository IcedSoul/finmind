package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"finmind-backend/config"
	"finmind-backend/database"
	"finmind-backend/routes"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	cfg := config.Load()

	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	if err := database.Migrate(db); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	if err := database.SeedData(db); err != nil {
		log.Fatal("Failed to seed database:", err)
	}

	r := gin.Default()

	routes.SetupRoutes(r, db, cfg)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}