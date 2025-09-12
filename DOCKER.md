# FinMind Docker 开发环境

本文档说明如何使用 Docker Compose 启动 FinMind 项目的开发环境。

## 服务说明

### PostgreSQL 数据库
- **端口**: 5432
- **数据库名**: finmind
- **用户名**: finmind
- **密码**: finmind123
- **数据持久化**: 使用 Docker volume `postgres_data`

### Redis 缓存
- **端口**: 6379
- **数据持久化**: 使用 Docker volume `redis_data`
- **配置**: 启用 AOF 持久化

### Adminer 数据库管理
- **端口**: 8081
- **访问地址**: http://localhost:8081
- **用途**: 可视化数据库管理工具

## 快速开始

### 1. 启动所有服务
```bash
docker-compose up -d
```

### 2. 查看服务状态
```bash
docker-compose ps
```

### 3. 查看日志
```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f postgres
docker-compose logs -f redis
```

### 4. 停止服务
```bash
docker-compose down
```

### 5. 停止服务并删除数据
```bash
docker-compose down -v
```

## 数据库连接

### 后端应用连接
后端应用使用 `.env` 文件中的配置连接数据库：
```
DATABASE_URL=postgres://finmind:finmind123@localhost:5432/finmind?sslmode=disable
```

### 使用 Adminer 管理数据库
1. 访问 http://localhost:8081
2. 选择 PostgreSQL
3. 输入连接信息：
   - **服务器**: postgres
   - **用户名**: finmind
   - **密码**: finmind123
   - **数据库**: finmind

## 开发工作流

1. **启动开发环境**
   ```bash
   docker-compose up -d
   ```

2. **启动后端服务**
   ```bash
   cd backend
   go run main.go
   ```

3. **启动前端应用**
   ```bash
   cd app
   npm run expo:android
   ```

## 故障排除

### 端口冲突
如果遇到端口冲突，可以修改 `docker-compose.yml` 中的端口映射：
```yaml
ports:
  - "5433:5432"  # 将 PostgreSQL 映射到 5433 端口
```

### 数据库连接失败
1. 确保 Docker 服务正在运行
2. 检查防火墙设置
3. 验证 `.env` 文件中的数据库连接字符串

### 重置数据库
```bash
docker-compose down -v
docker-compose up -d
```

## 生产环境注意事项

⚠️ **重要**: 此配置仅用于开发环境，生产环境需要：
- 修改默认密码
- 配置 SSL/TLS
- 设置适当的资源限制
- 配置备份策略
- 使用环境变量管理敏感信息