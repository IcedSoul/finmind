# FinMind Backend API

FinMind 全记账应用的后端 API 服务，基于 Go 和 Gin 框架构建。

## 功能特性

- 用户认证和授权（JWT）
- 账单管理（增删改查）
- 分类管理
- 数据统计分析
- RESTful API 设计
- PostgreSQL 数据库支持
- CORS 跨域支持

## 技术栈

- **框架**: Gin (Go Web Framework)
- **数据库**: PostgreSQL + GORM ORM
- **认证**: JWT (JSON Web Tokens)
- **配置**: godotenv
- **密码加密**: bcrypt

## 项目结构

```
backend/
├── config/          # 配置管理
├── database/        # 数据库连接和迁移
├── handlers/        # HTTP 处理器
├── middleware/      # 中间件
├── models/          # 数据模型
├── routes/          # 路由配置
├── main.go          # 应用入口
├── go.mod           # Go 模块文件
└── .env.example     # 环境变量示例
```

## 快速开始

### 1. 环境要求

- Go 1.21+
- PostgreSQL 12+

### 2. 安装依赖

```bash
go mod download
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env` 并配置相应的环境变量：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置数据库连接等信息。

### 4. 数据库设置

确保 PostgreSQL 服务正在运行，并创建数据库：

```sql
CREATE DATABASE finmind;
```

### 5. 运行应用

```bash
go run main.go
```

应用将在 `http://localhost:8080` 启动。

## API 文档

### 认证接口

- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录

### 用户接口

- `GET /api/v1/user/profile` - 获取用户信息
- `PUT /api/v1/user/profile` - 更新用户信息

### 分类接口

- `GET /api/v1/categories` - 获取分类列表
- `POST /api/v1/categories` - 创建分类
- `PUT /api/v1/categories/:id` - 更新分类
- `DELETE /api/v1/categories/:id` - 删除分类

### 账单接口

- `GET /api/v1/bills` - 获取账单列表
- `POST /api/v1/bills` - 创建账单
- `GET /api/v1/bills/:id` - 获取账单详情
- `PUT /api/v1/bills/:id` - 更新账单
- `DELETE /api/v1/bills/:id` - 删除账单
- `GET /api/v1/bills/statistics` - 获取统计数据

### 健康检查

- `GET /health` - 服务健康检查

## 开发说明

### 数据库迁移

应用启动时会自动执行数据库迁移，创建必要的表结构。

### 默认数据

首次启动时会自动创建默认的收入和支出分类。

### JWT 认证

除了注册和登录接口外，其他接口都需要在请求头中携带 JWT token：

```
Authorization: Bearer <your-jwt-token>
```

### 环境变量说明

- `DATABASE_URL`: PostgreSQL 数据库连接字符串
- `JWT_SECRET`: JWT 签名密钥
- `PORT`: 服务端口（默认 8080）
- `GIN_MODE`: Gin 运行模式（debug/release）
- `CORS_ORIGINS`: 允许的跨域来源
- `UPLOAD_PATH`: 文件上传路径
- `MAX_UPLOAD_SIZE`: 最大上传文件大小

## 构建和部署

### 构建二进制文件

```bash
go build -o finmind-backend main.go
```

### Docker 部署

```dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY . .
RUN go mod download
RUN go build -o main .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
CMD ["./main"]
```

## 许可证

MIT License