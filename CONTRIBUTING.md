# 贡献指南

感谢你对智能Token计数器项目的关注！我们欢迎各种形式的贡献。

## 🚀 如何贡献

### 报告Bug
1. 检查 [Issues](../../issues) 确认问题尚未被报告
2. 创建新的Issue，包含：
   - 详细的问题描述
   - 重现步骤
   - 预期行为和实际行为
   - 环境信息（VSCode版本、操作系统等）

### 提出新功能
1. 先创建Issue讨论你的想法
2. 等待维护者反馈
3. 获得批准后开始开发

### 提交代码
1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

## 📋 开发规范

### 代码规范
- 使用TypeScript开发
- 遵循项目的ESLint配置
- 保持代码风格一致
- 添加适当的注释（中文）

### 提交信息规范
使用[约定式提交](https://www.conventionalcommits.org/zh-hans/v1.0.0/)格式：

```
<类型>[可选 范围]: <描述>

[可选 正文]

[可选 脚注]
```

类型包括：
- `feat`: 新功能
- `fix`: 修复问题  
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建或配置相关

示例：
```
feat(tokenizer): 添加Claude分词支持

- 实现Claude模型的Token计算逻辑
- 添加相关配置选项
- 更新文档说明

Closes #123
```

### 测试要求
- 为新功能添加测试
- 确保现有测试通过
- 测试覆盖率不低于80%

## 🏗️ 开发环境设置

1. **克隆项目**
   ```bash
   git clone https://github.com/xingye1673/smart-token-counter.git
   cd smart-token-counter
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **编译项目**
   ```bash
   npm run compile
   ```

4. **启动调试**
   - 按 `F5` 启动扩展宿主窗口
   - 或使用 "启动扩展" 调试配置

## 📁 项目结构

```
smart-token-counter/
├── src/                    # 源代码
│   ├── extension.ts        # 插件入口
│   ├── tokenCounter.ts     # Token计数核心
│   ├── statusBarManager.ts # 状态栏管理
│   ├── configManager.ts    # 配置管理
│   └── i18nProvider.ts     # 国际化
├── .vscode/               # VSCode配置
├── .github/               # GitHub配置
├── images/                # 图片资源
├── out/                   # 编译输出
├── package.json           # 包配置
├── tsconfig.json          # TypeScript配置
└── README.md              # 项目说明
```

## 🌍 国际化

### 添加新语言支持
1. 创建语言文件 `package.nls.<locale>.json`
2. 在 `I18nProvider` 中添加语言映射
3. 更新 `getSupportedLocales()` 方法

### 翻译指南
- 保持术语一致性
- 注意上下文语境
- 遵循目标语言的习惯表达

## 🔧 架构说明

### 核心模块
- **TokenCounter**: 分词算法实现
- **StatusBarManager**: 状态栏显示逻辑
- **ConfigManager**: 配置读写管理
- **I18nProvider**: 多语言支持

### 设计原则
- 单一职责原则
- 依赖注入
- 错误隔离
- 性能优先

## 📝 文档贡献

### 文档类型
- API文档：代码中的JSDoc注释
- 用户文档：README.md
- 开发文档：CONTRIBUTING.md
- 更新日志：CHANGELOG.md

### 文档风格
- 使用简体中文
- 结构清晰
- 包含示例
- 保持更新

## ❓ 获取帮助

- 查看 [Issue](../../issues) 寻找答案
- 创建新Issue询问问题
- 参考VSCode插件开发文档

## 📄 许可证

通过贡献代码，你同意你的贡献将在[MIT许可证](LICENSE)下授权。
