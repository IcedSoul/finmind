# FinMind 开发环境启动脚本

Write-Host "启动 FinMind 开发环境..." -ForegroundColor Green

# 检查 Docker 是否运行
Write-Host "检查 Docker 状态..." -ForegroundColor Yellow
try {
    docker version | Out-Null
    Write-Host "Docker 运行正常" -ForegroundColor Green
} catch {
    Write-Host "错误: Docker 未运行，请先启动 Docker Desktop" -ForegroundColor Red
    exit 1
}

# 启动 Docker Compose 服务
Write-Host "启动数据库服务..." -ForegroundColor Yellow
docker-compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "数据库服务启动成功!" -ForegroundColor Green
    
    # 等待数据库启动
    Write-Host "等待数据库初始化..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    # 显示服务状态
    Write-Host "服务状态:" -ForegroundColor Cyan
    docker-compose ps
    
    Write-Host ""
    Write-Host "开发环境已启动!" -ForegroundColor Green
    Write-Host "数据库管理: http://localhost:8081" -ForegroundColor Cyan
    Write-Host "PostgreSQL: localhost:5432" -ForegroundColor Cyan
    Write-Host "Redis: localhost:6379" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "现在可以启动后端服务:" -ForegroundColor Yellow
    Write-Host "cd backend && go run main.go" -ForegroundColor White
    Write-Host ""
    Write-Host "启动前端应用:" -ForegroundColor Yellow
    Write-Host "cd app && npm run expo:android" -ForegroundColor White
    
} else {
    Write-Host "启动失败，请检查错误信息" -ForegroundColor Red
    exit 1
}