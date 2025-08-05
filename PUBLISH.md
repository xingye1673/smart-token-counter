# 智能Token计数器 - VSCode插件发布说明

## 插件标识信息
- **插件ID**: `xingye1673.smart-token-counter`
- **显示名称**: 智能Token计数器 (Smart Token Counter)
- **版本**: 1.0.0
- **发布者**: Xingye1673
- **类别**: Other

## 插件描述

一个专为AI辅助编程设计的VSCode插件，在状态栏实时显示当前文件或选择区域的Token数量，支持多种主流LLM分词方案，帮助开发者更好地管理和控制AI对话的Token使用。

## 核心功能

### 🔢 实时Token计数
- 自动计算当前文件的Token数量
- 支持选择区域的Token计数
- 异步计算，不阻塞编辑器性能

### 🤖 多模型支持
- **GPT-3.5 Turbo**: 使用cl100k_base编码器
- **GPT-4**: 使用cl100k_base编码器  
- **Claude**: 基于Claude的分词规则
- **LLaMA**: 基于SentencePiece的分词
- **中文分词**: 专门优化的中文分词算法
- **简单分词**: 基于空格和标点的基础分词

### 🌍 国际化支持
- 简体中文界面
- 英文界面
- 自动检测系统语言

### ⚠️ 智能警示系统
- 绿色：Token数量正常
- 黄色：接近警告阈值
- 红色：超过危险阈值
- 可自定义阈值设置

### ⚙️ 丰富的配置选项
- 启用/禁用插件功能
- 选择分词器类型
- 设置警告和危险阈值
- 控制状态栏显示
- 选择更新频率（实时/保存时/手动）

## 使用场景

### AI编程助手用户
- 与ChatGPT、Claude等AI对话时控制Token使用
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
