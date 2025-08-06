# 智能Token计数器 - VSCode插件发布说明

## 插件标识信息
- **插件ID**: `xingye1673.smart-token-counter`
- **显示名称**: 智能Token计数器 (Smart Token Counter)
- **版本**: 1.2.0
- **发布者**: xingye1673
- **类别**: Other
- **许可证**: MIT
- **仓库地址**: https://github.com/xingye1673/smart-token-counter

## 插件描述

一个专为AI辅助编程设计的VSCode插件，在状态栏实时显示当前文件或选择区域的Token数量，支持多种主流LLM分词方案。v1.2.0版本引入了可配置的颜色提醒、动态图标显示和选择对比功能，帮助开发者更好地管理和控制AI对话的Token使用。

## 核心功能

### 🔢 智能Token计数
- 自动计算当前文件的Token数量
- 支持选择区域的Token计数，同时显示与文件总数的对比
- 异步计算，不阻塞编辑器性能
- 智能数量格式化（K/M单位）

### 🎨 动态界面显示
- **文件模式**: `$(file-code) 1.2K T` - 使用文件图标
- **选择模式**: `$(selection) 0.5K / 1.2K T` - 使用选择图标，显示对比
- **可选颜色提醒**: 可开启/关闭超过阈值时的颜色变化
- **友好提示**: 提醒/关注阈值，替代原有的警告/危险表述

### 🤖 多模型支持
- **GPT-3.5 Turbo**: 使用cl100k_base编码器，与API计费一致
- **GPT-4**: 使用cl100k_base编码器，支持GPT-4系列模型
- **Claude**: 基于Anthropic Claude的分词规则
- **LLaMA**: 基于Meta LLaMA的分词算法
- **中文分词**: 专门优化的中文分词算法
- **简单分词**: 基于空格和标点的通用分词

### 🌍 完整国际化支持
- 简体中文界面（中国大陆用户优化）
- 英文界面（国际用户）
- 自动检测系统语言
- 配置项和消息完全本地化

### 💡 智能提醒系统
- **正常状态**: 默认显示，无特殊标识
- **提醒状态**: 💡 超过提醒阈值时的友好提醒
- **关注状态**: 🔥 超过关注阈值时的特别关注
- **可配置颜色**: 可选择是否启用颜色变化提醒
- **悬停详情**: 鼠标悬停显示详细信息和配置状态

### ⚙️ 丰富的配置选项
- **基础配置**: 启用/禁用插件功能，控制状态栏显示
- **分词器选择**: 6种不同的分词方案适应不同需求
- **阈值设置**: 自定义提醒阈值(4000)和关注阈值(8000)
- **颜色提醒**: 可选择启用/禁用超过阈值时的颜色变化
- **更新模式**: 实时更新/保存时更新/手动更新三种模式

## 使用场景

### 🤖 AI编程助手用户
- 与ChatGPT、Claude等AI对话时精确控制Token使用
- 避免超出模型的Token限制
- 优化提示词长度

### 内容创作者
- 控制文章长度
- 管理文档复杂度
- 优化内容结构

### 开发团队
- 代码审查时评估复杂度
- 文档管理
- API文档长度控制

## 安装和使用

1. 在VSCode扩展市场搜索"智能Token计数器"
2. 点击安装并重启VSCode
3. 状态栏右下角将显示Token计数
4. 通过设置页面配置个性化选项

## 配置说明

通过 `文件 > 首选项 > 设置` 搜索 "Smart Token Counter" 进行配置：

```json
{
  "smartTokenCounter.enabled": true,
  "smartTokenCounter.tokenizerType": "gpt-3.5-turbo",
  "smartTokenCounter.warningThreshold": 4000,
  "smartTokenCounter.dangerThreshold": 8000,
  "smartTokenCounter.showInStatusBar": true,
  "smartTokenCounter.updateMode": "realtime"
}
```

## 系统要求

- VSCode 1.74.0 或更高版本
- 支持 Windows、macOS、Linux

## 性能特性

- 轻量级设计，内存占用小
- 异步计算，不影响编辑器响应
- 智能缓存，提高计算效率
- 支持大文件处理

## 隐私和安全

- 所有计算在本地完成
- 不上传任何代码内容
- 不收集用户数据
- 开源代码，透明可信

## 反馈和支持

- GitHub Issues: [项目地址](https://github.com/Josh/smart-token-counter)
- 评分和评论: VSCode扩展市场
- 功能建议: 通过Issue提交

## 更新日志

查看完整的[更新日志](CHANGELOG.md)了解版本变更详情。

## 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情。

---

**让AI编程更智能，让Token使用更精确！**
