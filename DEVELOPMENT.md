# 开发指南

## 项目概述

智能Token计数器是一个VSCode插件，为AI辅助编程提供实时的Token计数功能。本指南将帮助你理解项目结构和开发流程。

## 快速开始

### 1. 环境准备
```bash
# 确保安装了Node.js 16.x或更高版本
node --version

# 确保安装了npm
npm --version

# 推荐使用VSCode进行开发
code --version
```

### 2. 项目设置
```bash
# 克隆项目（如果从Git仓库）
git clone <repository-url>
cd smart-token-counter

# 安装依赖
npm install

# 编译TypeScript
npm run compile

# 启动监视模式（可选）
npm run watch
```

### 3. 调试运行
1. 在VSCode中打开项目
2. 按 `F5` 或选择"启动扩展"调试配置
3. 这将打开一个新的VSCode窗口，插件已加载
4. 在新窗口中测试插件功能

## 项目架构

### 核心类说明

#### `extension.ts` - 插件入口
```typescript
/**
 * 插件的主入口文件
 * 负责初始化各个组件并协调它们的工作
 */
export function activate(context: vscode.ExtensionContext) {
    // 初始化各个组件
    // 注册事件监听器
    // 注册命令
}
```

#### `TokenCounter` - Token计数核心
```typescript
/**
 * 核心分词逻辑
 * 支持多种分词算法
 */
class TokenCounter {
    countTokens(text: string): number;
    // 支持的分词器类型
    // 算法实现
}
```

#### `StatusBarManager` - 状态栏管理
```typescript
/**
 * 管理VSCode状态栏的显示
 * 处理颜色状态和用户交互
 */
class StatusBarManager {
    updateDisplay(text: string, colorState: string): void;
    // 状态栏项目管理
    // 颜色和图标控制
}
```

#### `ConfigManager` - 配置管理
```typescript
/**
 * 处理插件配置的读取和更新
 * 提供配置验证功能
 */
class ConfigManager {
    get<T>(key: string): T;
    update(key: string, value: any): Promise<void>;
    // 配置读写
    // 热更新支持
}
```

#### `I18nProvider` - 国际化
```typescript
/**
 * 提供多语言支持
 * 自动检测语言环境
 */
class I18nProvider {
    getMessage(key: string): string;
    // 语言文件加载
    // 消息格式化
}
```

## 开发工作流

### 1. 功能开发
1. 在相应的类中添加新方法
2. 更新TypeScript类型定义
3. 添加适当的错误处理
4. 更新相关的配置选项（如果需要）
5. 添加国际化支持

### 2. 测试
```bash
# 编译项目
npm run compile

# 在VSCode中按F5启动调试
# 测试新功能是否正常工作
```

### 3. 文档更新
- 更新README.md
- 更新CHANGELOG.md
- 添加代码注释
- 更新配置说明

## 配置系统

### 配置项定义
在`package.json`中定义：
```json
{
  "contributes": {
    "configuration": {
      "properties": {
        "smartTokenCounter.newOption": {
          "type": "boolean",
          "default": true,
          "description": "%config.newOption%"
        }
      }
    }
  }
}
```

### 国际化配置
在`package.nls.json`和`package.nls.zh-cn.json`中添加：
```json
{
  "config.newOption": "新配置选项的描述"
}
```

## 分词算法实现

### 添加新的分词器
1. 在`TokenCounter`类中添加新方法：
```typescript
private countNewModelTokens(text: string): number {
    // 实现分词逻辑
    return tokenCount;
}
```

2. 更新`countTokens`方法的switch语句
3. 在配置中添加新的选项
4. 更新文档说明

### 性能优化建议
- 使用异步计算避免阻塞UI
- 实现计算结果缓存
- 对大文件进行分块处理
- 使用Web Workers进行复杂计算

## 状态栏定制

### 颜色主题
```typescript
// 使用VSCode主题颜色
this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
this.statusBarItem.color = new vscode.ThemeColor('statusBarItem.warningForeground');
```

### 图标使用
```typescript
// 使用Codicon图标
this.statusBarItem.text = `$(symbol-keyword) ${text}`;
```

## 错误处理

### 错误捕获模式
```typescript
try {
    // 业务逻辑
} catch (error) {
    console.error('错误描述:', error);
    // 用户友好的错误提示
    vscode.window.showErrorMessage('发生错误，请查看输出面板');
    // 回退到安全状态
}
```

### 日志记录
```typescript
// 开发时使用console.log
console.log('调试信息:', data);

// 生产环境使用VSCode输出通道
const outputChannel = vscode.window.createOutputChannel('Smart Token Counter');
outputChannel.appendLine('运行信息');
```

## 发布流程

### 1. 版本准备
```bash
# 更新版本号
npm version patch|minor|major

# 更新CHANGELOG.md
# 确保README.md是最新的
```

### 2. 构建检查
```bash
# 清理输出目录
npm run clean

# 重新编译
npm run compile

# 检查编译错误
```

### 3. 打包发布
```bash
# 安装vsce工具
npm install -g vsce

# 打包插件
vsce package

# 发布到市场（需要Personal Access Token）
vsce publish
```

## 调试技巧

### 1. VSCode开发者工具
- 按 `Ctrl+Shift+I` 打开开发者工具
- 查看Console面板的日志输出
- 使用断点调试TypeScript代码

### 2. 输出面板
```typescript
const outputChannel = vscode.window.createOutputChannel('Smart Token Counter');
outputChannel.show(); // 显示输出面板
outputChannel.appendLine('调试信息');
```

### 3. 状态栏调试
- 鼠标悬停查看工具提示
- 点击状态栏项目触发命令
- 观察颜色变化

## 常见问题

### Q: 插件无法激活
A: 检查`package.json`中的`activationEvents`配置，确保触发条件正确。

### Q: Token计数不准确
A: 检查分词算法实现，确保处理了各种边界情况。

### Q: 状态栏不显示
A: 检查配置项`showInStatusBar`是否为true，以及状态栏项目是否正确创建。

### Q: 国际化不生效
A: 确保语言文件存在且格式正确，检查`I18nProvider`的语言检测逻辑。

## 扩展资源

- [VSCode Extension API](https://code.visualstudio.com/api)
- [VSCode Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)

---

祝你开发顺利！如有问题，请查看项目Issue或创建新的Issue。
