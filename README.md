# 智能Token计数器 (Smart Token Counter)

一个VSCode插件，用于在状态栏显示当前文件或选择区域的token数量，支持多种LLM分词方案。

## 功能特性

- 🔢 **实时Token计数**: 在VSCode状态栏实时显示当前文件或选择区域的token数量
- 🤖 **多模型支持**: 支持GPT-3.5/4、Claude、LLaMA等主流LLM的分词方案
- 🌍 **国际化支持**: 支持简体中文和英文界面
- ⚠️ **智能警示**: 可配置不同阈值的颜色警示
- ⚙️ **灵活配置**: 提供丰富的配置选项

## 安装方法

1. 在VSCode扩展市场搜索"智能Token计数器"或"Smart Token Counter"
2. 点击安装
3. 重启VSCode即可使用

## 使用说明

### 基本使用

安装插件后，VSCode状态栏右下角会显示当前文件的token数量。当你选择文本时，会显示选择区域的token数量。

### 配置选项

通过 `文件 > 首选项 > 设置` 搜索 "Smart Token Counter" 可以找到以下配置项：

- **启用插件** (`smartTokenCounter.enabled`): 是否启用插件功能
- **分词器类型** (`smartTokenCounter.tokenizerType`): 选择分词方案
  - `gpt-3.5-turbo`: GPT-3.5 Turbo模型分词
  - `gpt-4`: GPT-4模型分词
  - `claude`: Claude模型分词
  - `llama`: LLaMA模型分词
  - `chinese-word-count`: 中文分词计数
  - `simple-word-count`: 简单单词计数
- **警告阈值** (`smartTokenCounter.warningThreshold`): token数量超过此值时显示黄色警告
- **危险阈值** (`smartTokenCounter.dangerThreshold`): token数量超过此值时显示红色警告
- **状态栏显示** (`smartTokenCounter.showInStatusBar`): 是否在状态栏显示token计数
- **更新模式** (`smartTokenCounter.updateMode`): 更新频率
  - `realtime`: 实时更新（默认）- 在文本内容或选择变化时立即更新
  - `onSave`: 保存时更新 - 只在文档保存时更新token计数
  - `manual`: 手动更新 - 需要手动执行刷新命令才会更新

### 数量显示格式

为了提高可读性，token数量会自动使用合适的单位：
- 小于1000: 直接显示数字 (例如: `256`)
- 1000-999999: 使用K单位，保留一位小数 (例如: `1.2K`)
- 1000000及以上: 使用M单位，保留一位小数 (例如: `1.5M`)

### 命令面板

按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (Mac) 打开命令面板，输入以下命令：

- `Smart Token Counter: 切换显示`: 切换token计数显示状态
- `Smart Token Counter: 打开设置`: 快速打开插件设置页面
- `Smart Token Counter: 手动刷新`: 手动刷新当前文件的token计数（仅在手动更新模式下有效）

### 性能优化

为了减少界面闪烁和提高性能，插件采用了以下优化措施：
- **防抖更新**: 状态栏更新采用50ms防抖，避免频繁刷新造成的闪烁
- **异步计算**: Token计算在后台异步执行，不阻塞UI
- **智能缓存**: 相同内容不重复计算
- **更新模式**: 可选择不同的更新频率以平衡性能和实时性

## 支持的分词方案

### GPT系列
- **GPT-3.5 Turbo**: 使用cl100k_base编码器
- **GPT-4**: 使用cl100k_base编码器

### Claude系列
- **Claude**: 基于Claude的分词规则

### 开源模型
- **LLaMA**: 基于LLaMA的分词规则

### 通用方案
- **中文分词**: 适合处理中文文本的分词方案
- **简单单词计数**: 基于空格和标点符号的简单分词

## 颜色警示说明

- **绿色**: token数量正常
- **黄色**: token数量接近警告阈值
- **红色**: token数量超过危险阈值

## 开发说明

### 项目结构

```
smart-token-counter/
├── src/
│   ├── extension.ts          # 插件主入口文件
│   ├── tokenizer.ts          # 分词器核心逻辑
│   ├── statusBar.ts          # 状态栏管理
│   ├── config.ts             # 配置管理
│   └── i18n/                 # 国际化文件
│       ├── zh-cn.json        # 简体中文
│       └── en.json           # 英文
├── package.json              # 插件配置文件
├── tsconfig.json             # TypeScript配置
└── README.md                 # 说明文档
```

### 开发环境

1. 克隆项目到本地
2. 运行 `npm install` 安装依赖
3. 运行 `npm run compile` 编译项目
4. 按F5启动调试模式

### 构建发布

1. 运行 `npm run vscode:prepublish` 构建项目
2. 使用 `vsce package` 打包插件

## 版本历史

### v1.0.0
- 初始版本发布
- 支持基本的token计数功能
- 支持多种分词方案
- 国际化支持

## 许可证

MIT License

## 作者

xingye1673

## 反馈与贡献

如果你在使用过程中遇到问题或有改进建议，欢迎：

1. 提交Issue
2. 发起Pull Request
3. 通过邮件联系作者

感谢你的使用和支持！
