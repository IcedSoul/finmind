-- FinMind Database Initialization Script
-- This script will be executed when the PostgreSQL container starts for the first time

-- Create database if not exists (this is handled by POSTGRES_DB environment variable)
-- But we can add any additional setup here

-- Set timezone
SET timezone = 'UTC';

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- You can add any initial data or additional setup here
-- The GORM auto-migration will handle table creation