# FinMind全记账 React Native应用

智能记账应用，支持AI识别和数据分析功能。

## 功能特性

- 📱 用户认证（登录/注册）
- 💰 账单管理（添加/编辑/删除）
- 🤖 AI智能识别账单信息
- 📊 数据统计和可视化
- 🔄 数据同步（本地SQLite + 云端）
- 📤 数据导入导出
- ⚙️ 个性化设置

## 技术栈

- React Native 0.72.6
- TypeScript
- Redux Toolkit + Redux Persist
- React Navigation 6
- SQLite (本地数据库)
- Axios (网络请求)
- Vector Icons

## 项目结构

```
src/
├── components/          # 可复用组件
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Loading.tsx
│   ├── EmptyState.tsx
│   ├── BillItem.tsx
│   ├── StatCard.tsx
│   └── index.ts
├── hooks/              # 自定义Hooks
│   └── index.ts
├── navigation/         # 导航配置
│   └── index.tsx
├── screens/           # 页面组件
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── HomeScreen.tsx
│   ├── BillsScreen.tsx
│   ├── StatisticsScreen.tsx
│   ├── SettingsScreen.tsx
│   ├── AddBillScreen.tsx
│   ├── EditBillScreen.tsx
│   ├── ImportBillScreen.tsx
│   └── index.ts
├── services/          # 服务层
│   ├── authService.ts
│   ├── billService.ts
│   ├── database.ts
│   └── aiService.ts
├── store/             # Redux状态管理
│   ├── slices/
│   │   ├── authSlice.ts
│   │   └── billsSlice.ts
│   └── index.ts
├── types/             # TypeScript类型定义
│   └── index.ts
├── utils/             # 工具函数
│   └── index.ts
└── App.tsx            # 应用入口
```

## 安装和运行

### 环境要求

- Node.js >= 16
- React Native CLI
- Android Studio (Android开发)
- Xcode (iOS开发)

### 安装依赖

```bash
npm install
```

### iOS设置

```bash
cd ios && pod install && cd ..
```

### 运行应用

```bash
# Android
npm run android

# iOS
npm run ios

# 启动Metro服务
npm start
```

### 代码检查

```bash
# 运行ESLint和TypeScript检查
npm run check

# 仅运行ESLint
npm run lint
```

## 开发说明

### 状态管理

使用Redux Toolkit进行状态管理，主要包含：
- `authSlice`: 用户认证状态
- `billsSlice`: 账单数据状态

### 数据存储

- 本地数据库：SQLite（用于离线存储）
- 状态持久化：Redux Persist + AsyncStorage
- 云端同步：通过API与后端服务同步

### AI功能

预留了本地AI模型接口，支持：
- 文本内容解析
- 图片OCR识别
- 账单信息提取

### 导航结构

- 认证流程：Login → Register
- 主应用：底部Tab导航（Home, Bills, Statistics, Settings）
- 账单管理：Stack导航（List → Add/Edit → Import）

## API接口

应用设计为前后端分离架构，需要配合后端API使用：

- 用户认证：`/api/auth/login`, `/api/auth/register`
- 账单管理：`/api/bills/*`
- 数据统计：`/api/statistics/*`
- 数据同步：`/api/sync/*`

## 构建发布

```bash
# Android Release
npm run build:android

# iOS Release
npm run build:ios
```

## 许可证

MIT License