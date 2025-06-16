# My Vue App

一个基于 Vue 3 + Vite + TypeScript 构建的现代化博客前端。

## ✨ 特性

- 🚀 **现代化技术栈**: Vue 3 + Vite + TypeScript
- 🎨 **美观UI**: 基于 TailwindCSS + Shadcn UI 的现代化界面
- 📱 **响应式设计**: 基于Tailwind CSS，支持多种设备尺寸的自适应布局
- 🔥 **动效丰富**: 集成 GSAP 、motion 和 Auto-Animate 动画库
- 📝 **Markdown编辑**: 支持 Markdown 编辑和预览
- 🗂️ **状态管理**: 使用 Pinia 进行状态管理
- 🛠️ **代码分析**: 内置打包体积分析工具

## 🛠️ 技术栈

### 核心框架
- **Vue 3** - 前端框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具

### UI 组件库
- **TailwindCSS** - 样式框架
- **Shadcn UI** - Vue 组件库

### 功能库
- **Vue Router** - 路由管理
- **Pinia** - 状态管理
- **Axios** - HTTP 客户端
- **VueUse** - Vue 组合式函数库
- **ECharts** - 数据可视化
- **GSAP** - 动画库
- **@kangc/v-md-editor** - Markdown 编辑器

### 开发工具
- **ESLint** - 代码检查
- **vue-tsc** - TypeScript 检查
- **Rollup Bundle Analyzer** - 打包分析

## 📁 项目结构

```
my-vue-app/
├── public/              # 静态资源目录
├── src/
│   ├── api/            # API 接口
│   ├── assets/         # 资源文件
│   ├── components/     # 组件目录
│   │   ├── ui/         # UI 基础组件
│   │   └── myComponents/ # 自定义组件
│   ├── lib/            # 工具库
│   ├── router/         # 路由配置
│   ├── stores/         # Pinia 状态管理
│   ├── utils/          # 工具函数
│   ├── views/          # 页面组件
│   │   ├── Home.vue    # 主页
│   │   ├── Editor.vue  # 编辑器页面
│   │   ├── Report.vue  # 报告页面
│   │   ├── Relax.vue   # 休闲页面
│   │   ├── FriendsLink.vue # 友链页面
│   │   └── ...
│   ├── App.vue         # 根组件
│   └── main.js         # 入口文件
├── package.json        # 项目配置
├── vite.config.ts      # Vite 配置
└── tsconfig.json       # TypeScript 配置
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- pnpm >= 8.0.0

### 安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd my-vue-app

# 安装依赖
pnpm install
```

### 开发服务器

```bash
# 启动开发服务器 (默认端口: 5175)
pnpm dev
```

### 构建项目

```bash
# 构建生产版本
pnpm build

# 构建并分析打包体积
pnpm analyze

# 预览构建结果
pnpm preview
```

## 🔧 配置说明

### 开发代理

项目已配置开发代理，API 请求会自动转发到后端服务:

```typescript
// vite.config.ts
server: {
  port: 5175,
  proxy: {
    '/api': {
      target: 'http://localhost:7001/api',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### 路径别名

已配置 `@` 别名指向 `src` 目录:

```typescript
// vite.config.ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

## 📄 页面功能

- **Home**: 应用主页，展示核心功能
- **Editor**: Markdown 编辑器，支持实时预览
- **Report**: 数据报告页面，集成agent报告助手
- **Relax**: 休闲娱乐页面
- **FriendsLink**: 友情链接、收藏管理
- **Splash**: 启动页面

## 🎨 组件说明

### 自定义组件
- **BlogDialog**: 博客详情弹窗组件，支持 Markdown 渲染

### UI 组件
基于 Reka UI 构建的可复用组件库，包含按钮、对话框、表单等常用组件。

## 📦 打包分析

使用以下命令可以分析打包体积:

```bash
pnpm analyze
```

这将生成一个可视化的打包分析报告，帮助优化应用体积。

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源。

## 🛠️ 故障排除

### 常见问题

1. **端口占用**: 如果 5175 端口被占用，Vite 会自动寻找下一个可用端口
2. **依赖安装失败**: 请确保使用 pnpm 而不是 npm 或 yarn
3. **TypeScript 错误**: 运行 `pnpm build` 前确保所有 TypeScript 错误已修复

### 开发建议

- 使用 VS Code 并安装推荐的扩展程序
- 遵循项目的 ESLint 规则
- 提交前运行 `pnpm build` 确保构建成功
