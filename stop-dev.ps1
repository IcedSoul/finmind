# FinMind 开发环境停止脚本

Write-Host "停止 FinMind 开发环境..." -ForegroundColor Yellow

# 停止 Docker Compose 服务
docker-compose down

if ($LASTEXITCODE -eq 0) {
    Write-Host "开发环境已停止" -ForegroundColor Green
} else {
    Write-Host "停止失败，请检查错误信息" -ForegroundColor Red
    exit 1
}

# 询问是否删除数据
$response = Read-Host "是否删除所有数据? (y/N)"
if ($response -eq "y" -or $response -eq "Y") {
    Write-Host "删除数据卷..." -ForegroundColor Yellow
    docker-compose down -v
    docker volume prune -f
    Write-Host "数据已删除" -ForegroundColor Green
} else {
    Write-Host "数据已保留" -ForegroundColor Cyan
}