<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# 智能Token计数器 - GitHub Copilot 自定义指令

这是一个VS Code扩展项目，用于在状态栏显示当前文件或选择区域的token数量。

## 项目特点

- **语言**: TypeScript
- **框架**: VS Code Extension API
- **目标**: 为AI编程辅助提供token计数功能

## 代码规范

### 注释规范
- 所有类、方法、重要变量都必须有详细的中文注释
- 使用JSDoc格式编写方法注释
- 每个文件开头要有文件功能说明注释

### 命名规范
- 类名使用PascalCase：`TokenCounter`
- 方法名使用camelCase：`countTokens`
- 常量使用UPPER_SNAKE_CASE：`DEFAULT_THRESHOLD`
- 私有成员以下划线开头：`_privateMethod`

### TypeScript特定规范
- 优先使用明确的类型定义，避免使用`any`
- 使用接口定义复杂对象结构
- 善用泛型提高代码复用性
- 使用枚举定义常量集合

### VS Code扩展特定要求
- 所有扩展API调用都要有错误处理
- 使用Disposable模式管理资源
- 配置项要有完整的JSON Schema定义
- 状态栏项目要有合适的图标和工具提示

## 功能模块

1. **TokenCounter**: 核心分词算法，支持多种LLM模型
2. **StatusBarManager**: 状态栏显示管理
3. **ConfigManager**: 配置项管理
4. **I18nProvider**: 国际化支持

## 开发提示

- 使用VS Code Extension API时请参考最新文档
- 注意异步操作的错误处理
- 性能敏感的token计算要避免阻塞主线程
- 国际化字符串统一通过I18nProvider管理

This is a VS Code extension project. Please use the get_vscode_api with a query as input to fetch the latest VS Code API references.
