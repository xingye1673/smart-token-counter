# 智能Token计数器 (Smart Token Counter)

一个VSCode插件，用于在状态栏显示当前文件或选择区域的token数量，支持多种LLM分词方案。

[![Version](https://img.shields.io/vscode-marketplace/v/xingye1673.smart-token-counter.svg)](https://marketplace.visualstudio.com/items?itemName=xingye1673.smart-token-counter)
[![Downloads](https://img.shields.io/vscode-marketplace/d/xingye1673.smart-token-counter.svg)](https://marketplace.visualstudio.com/items?itemName=xingye1673.smart-token-counter)
[![Rating](https://img.shields.io/vscode-marketplace/r/xingye1673.smart-token-counter.svg)](https://marketplace.visualstudio.com/items?itemName=xingye1673.smart-token-counter)

## 功能特性

- 🔢 **智能Token计数**: 在VSCode状态栏实时显示当前文件或选择区域的token数量
- 📊 **选择对比**: 选择文本时同时显示选择区域和文件总数，便于对比分析
- 🤖 **多模型支持**: 支持GPT-3.5/4、Claude、LLaMA等主流LLM的分词方案
- 🎨 **可选颜色提醒**: 可开启/关闭颜色警示，超过阈值时提供视觉提醒
- 🌍 **国际化支持**: 支持简体中文和英文界面
- ⚙️ **灵活配置**: 提供丰富的配置选项，满足不同使用需求
- 🚀 **高性能**: 异步计算、防抖更新，不阻塞编辑器

## 界面预览

### 文件模式显示
状态栏显示格式：`$(file-code) 1.2K T`
- 使用文件图标 `$(file-code)` 
- 显示简洁的token数量（K/M单位）
- 末尾用 `T` 标识Token

### 选择模式显示
状态栏显示格式：`$(selection) 0.5K / 1.2K T`
- 使用选择图标 `$(selection)`
- 显示选择区域token数 / 文件总token数
- 悬停工具提示显示详细信息

## 安装方法

### 从VS Code扩展市场安装
1. 打开VS Code
2. 按 `Ctrl+Shift+X` 打开扩展面板
3. 搜索"智能Token计数器"或"Smart Token Counter"
4. 点击安装
5. 重启VS Code即可使用

### 手动安装
1. 下载最新的 `.vsix` 文件
2. 在VS Code中按 `Ctrl+Shift+P` 打开命令面板
3. 输入 `Extensions: Install from VSIX...`
4. 选择下载的 `.vsix` 文件

## 使用说明

### 基本使用

安装插件后，VSCode状态栏右下角会显示当前文件的token数量：
- **查看文件**: 显示整个文件的token数量 `$(file-code) 1.2K T`
- **选择文本**: 显示选择区域与文件总数对比 `$(selection) 0.5K / 1.2K T`
- **悬停提示**: 鼠标悬停查看详细信息，包括分词器类型、阈值设置等

### 配置选项

通过 `文件 > 首选项 > 设置` 搜索 "Smart Token Counter" 可以找到以下配置项：

#### 基础配置
- **启用插件** (`smartTokenCounter.enabled`): 是否启用插件功能
- **状态栏显示** (`smartTokenCounter.showInStatusBar`): 是否在状态栏显示token计数

#### 分词器配置
- **分词器类型** (`smartTokenCounter.tokenizerType`): 选择分词方案
  - `gpt-3.5-turbo`: GPT-3.5 Turbo模型分词
  - `gpt-4`: GPT-4模型分词  
  - `claude`: Claude模型分词
  - `llama`: LLaMA模型分词
  - `chinese-word-count`: 中文分词计数
  - `simple-word-count`: 简单单词计数

#### 阈值与提醒配置
- **提醒阈值** (`smartTokenCounter.warningThreshold`): token数量超过此值时提供提醒（默认4000）
- **关注阈值** (`smartTokenCounter.dangerThreshold`): token数量超过此值时提供特别关注提醒（默认8000）
- **启用颜色提醒** (`smartTokenCounter.enableColorWarning`): 是否在超过阈值时改变显示颜色（默认启用）

#### 更新模式
- **更新模式** (`smartTokenCounter.updateMode`): 更新频率
  - `realtime`: 实时更新（默认）- 在文本内容或选择变化时立即更新
  - `onSave`: 保存时更新 - 只在文档保存时更新token计数  
  - `manual`: 手动更新 - 需要手动执行刷新命令才会更新

### 数量显示格式

为了提高可读性，token数量会自动使用合适的单位：
- **小于1000**: 直接显示数字 (例如: `256 T`)
- **1000-999999**: 使用K单位，保留一位小数 (例如: `1.2K T`)
- **1000000及以上**: 使用M单位，保留一位小数 (例如: `1.5M T`)

### 命令面板

按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (Mac) 打开命令面板，输入以下命令：

- `Smart Token Counter: 切换Token计数显示`: 切换token计数显示状态
- `Smart Token Counter: 打开Token计数器设置`: 快速打开插件设置页面
- `Smart Token Counter: 手动刷新Token计数`: 手动刷新当前文件的token计数

## 支持的分词方案

### 🤖 AI模型专用
- **GPT-3.5 Turbo**: 使用cl100k_base编码器，与OpenAI API计费一致
- **GPT-4**: 使用cl100k_base编码器，支持GPT-4系列模型
- **Claude**: 基于Anthropic Claude的分词规则
- **LLaMA**: 基于Meta LLaMA的分词规则

### 📝 通用文本处理
- **中文分词**: 针对中文文本优化的分词方案
- **简单单词计数**: 基于空格和标点符号的通用分词

## 颜色提醒系统

当启用颜色提醒时，状态栏会根据token数量变化颜色：

- 🟢 **正常状态**: token数量在提醒阈值以下
- 🟡 **提醒状态**: token数量超过提醒阈值，需要注意
- 🔴 **关注状态**: token数量超过关注阈值，需要特别关注

> 💡 **提示**: 可以通过设置 `enableColorWarning` 为 `false` 来禁用颜色提醒，保持界面简洁

## 性能优化

为了提供最佳的用户体验，插件采用了多项性能优化措施：

- **🚀 异步计算**: Token计算在后台异步执行，不阻塞UI线程
- **⏱️ 防抖更新**: 状态栏更新采用50ms防抖，避免频繁刷新造成的闪烁
- **💾 智能缓存**: 相同内容不重复计算，提高响应速度
- **🎯 选择性更新**: 根据更新模式智能选择更新时机

## 使用场景

### 📖 文档写作
- 控制文章长度，确保不超过平台限制
- 优化内容密度，提高信息传达效率

### 💬 AI对话
- 精确控制prompt长度，避免超出模型context限制
- 优化token使用，降低API调用成本

### 📝 代码注释
- 控制代码注释长度，保持代码整洁
- 确保文档字符串符合项目规范

### 🌐 多语言内容
- 准确计算不同语言内容的token消耗
- 支持中英文混合文本的精确分词

## 开发与贡献

### 项目结构

```
smart-token-counter/
├── src/
│   ├── extension.ts          # 插件主入口文件
│   ├── tokenCounter.ts       # Token计数器核心逻辑  
│   ├── statusBarManager.ts   # 状态栏管理器
│   ├── configManager.ts      # 配置管理器
│   └── i18nProvider.ts       # 国际化提供器
├── images/                   # 图标资源
├── package.json              # 插件配置文件
├── package.nls.json          # 英文语言包
├── package.nls.zh-cn.json    # 中文语言包
├── tsconfig.json             # TypeScript配置
└── README.md                 # 说明文档
```

### 开发环境搭建

```bash
# 1. 克隆项目
git clone https://github.com/xingye1673/smart-token-counter.git
cd smart-token-counter

# 2. 安装依赖
npm install

# 3. 编译项目
npm run compile

# 4. 启动调试（在VS Code中按F5）
```

### 构建发布

```bash
# 编译项目
npm run vscode:prepublish

# 打包插件
npm run package
```

## 版本历史

### 🎉 v1.2.0 (最新版)
- ✨ 新增：可配置的颜色提醒开关
- 🎨 优化：使用动态图标显示（文件/选择模式）
- 📊 新增：选择时同时显示选择区域和文件总数对比
- 🏷️ 优化：简化显示格式，使用 `T` 作为Token单位标识
- 📝 更新：将"警告/危险"阈值改为"提醒/关注"阈值，降低警示性
- 🛠️ 优化：悬停工具提示显示更详细的信息

### v1.1.1
- 🐛 修复：多语言环境下的显示问题
- ⚡ 优化：提升token计算性能

### 🚀 v1.1.0  
- ✨ 新增：多种更新模式（实时/保存时/手动）
- 🌍 新增：国际化支持（中文/英文）
- ⚡ 优化：异步计算，提升性能

### v1.0.0
- 🎯 初始版本发布
- 📊 支持基本的token计数功能
- 🤖 支持多种分词方案
- 🎨 支持颜色警示

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 作者

**xingye1673**
- GitHub: [@xingye1673](https://github.com/xingye1673)
- Email: xingye1673@example.com

## 反馈与支持

如果你在使用过程中遇到问题或有改进建议，欢迎通过以下方式联系：

- 🐛 **Bug报告**: [GitHub Issues](https://github.com/xingye1673/smart-token-counter/issues)
- 💡 **功能建议**: [GitHub Discussions](https://github.com/xingye1673/smart-token-counter/discussions)  
- ⭐ **项目支持**: 给项目点个Star ⭐
- 📧 **邮件联系**: xingye1673@example.com

## 相关链接

- 📦 [VS Code扩展市场](https://marketplace.visualstudio.com/items?itemName=xingye1673.smart-token-counter)
- 🔗 [GitHub仓库](https://github.com/xingye1673/smart-token-counter)
- 📖 [更新日志](CHANGELOG.md)
- 🤝 [贡献指南](CONTRIBUTING.md)

---

感谢你选择智能Token计数器！🎉 如果这个插件对你有帮助，别忘了给我们一个好评！⭐
