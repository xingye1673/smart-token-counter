# 图标说明

## icon.svg
项目包含了一个SVG格式的图标文件 `images/icon.svg`。

## 转换为PNG
VSCode插件需要PNG格式的图标。请按以下步骤转换：

1. 打开 `images/icon.svg` 文件
2. 使用以下任一工具转换为PNG：
   - 在线工具：https://convertio.co/svg-png/
   - GIMP、Photoshop等图像编辑软件
   - 命令行工具：inkscape、imagemagick等

3. 生成以下尺寸的PNG文件：
   - `icon-128.png` (128x128) - 主图标
   - `icon-64.png` (64x64) - 小图标
   - `icon-32.png` (32x32) - 更小图标

4. 将生成的PNG文件放在 `images/` 目录下

5. 在 `package.json` 中添加图标配置：
```json
{
  "icon": "images/icon-128.png"
}
```

## 图标设计说明
- 主色调：蓝色渐变 (#4FC3F7 到 #29B6F6)
- 主要元素：字母"T"代表Token
- 辅助元素：数字"123"代表计数
- 装饰元素：圆点增加视觉效果
- 整体风格：现代、简洁、专业

## 图标使用场景
- VSCode扩展市场显示
- 状态栏图标（会自动缩放）
- 命令面板图标
- 设置页面图标
