package routes

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"finmind-backend/config"
	"finmind-backend/handlers"
	"finmind-backend/middleware"
)

func SetupRoutes(r *gin.Engine, db *gorm.DB, cfg *config.Config) {
	r.Use(middleware.CORSMiddleware(cfg))

	if db != nil {
		authHandler := handlers.NewAuthHandler(db, cfg)
		categoryHandler := handlers.NewCategoryHandler(db)
		billHandler := handlers.NewBillHandler(db)

		api := r.Group("/api/v1")
		{
			auth := api.Group("/auth")
			{
				auth.POST("/register", authHandler.Register)
				auth.POST("/login", authHandler.Login)
				auth.POST("/refresh", authHandler.RefreshToken)
			}

			protected := api.Group("/")
			protected.Use(middleware.AuthMiddleware(cfg))
			{
				user := protected.Group("/user")
				{
					user.GET("/profile", authHandler.GetProfile)
					user.PUT("/profile", authHandler.UpdateProfile)
				}

				categories := protected.Group("/categories")
				{
					categories.GET("/", categoryHandler.GetCategories)
					categories.POST("/", categoryHandler.CreateCategory)
					categories.PUT("/:id", categoryHandler.UpdateCategory)
					categories.DELETE("/:id", categoryHandler.DeleteCategory)
				}

				bills := protected.Group("/bills")
				{
					bills.GET("/", billHandler.GetBills)
					bills.POST("/", billHandler.CreateBill)
					bills.GET("/:id", billHandler.GetBill)
					bills.PUT("/:id", billHandler.UpdateBill)
					bills.DELETE("/:id", billHandler.DeleteBill)
					bills.GET("/statistics", billHandler.GetStatistics)
				}
			}
		}
	} else {
		api := r.Group("/api/v1")
		{
			api.GET("/demo", func(c *gin.Context) {
				c.JSON(200, gin.H{"message": "Demo mode - database not connected"})
			})
		}
	}

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "message": "FinMind API is running"})
	})
}