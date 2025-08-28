package config

import (
	"os"
	"strconv"
)

type Config struct {
	DatabaseURL    string
	JWTSecret      string
	Port           string
	Environment    string
	CORSOrigins    []string
	UploadPath     string
	MaxUploadSize  int64
}

func Load() *Config {
	maxUploadSize, _ := strconv.ParseInt(getEnv("MAX_UPLOAD_SIZE", "10485760"), 10, 64)

	return &Config{
		DatabaseURL:   getEnv("DATABASE_URL", "finmind.db"),
		JWTSecret:     getEnv("JWT_SECRET", "your-secret-key"),
		Port:          getEnv("PORT", "8080"),
		Environment:   getEnv("ENVIRONMENT", "development"),
		CORSOrigins:   []string{getEnv("CORS_ORIGINS", "*")},
		UploadPath:    getEnv("UPLOAD_PATH", "./uploads"),
		MaxUploadSize: maxUploadSize,
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}