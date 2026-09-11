# Floating Todo · 跨网页共享悬浮待办

一个轻量、无服务器、跨网页共享的浏览器待办扩展。待办卡片以 **Shadow DOM** 注入当前页面，不污染网站样式，也不会拦截页面其他区域的操作。

## ✨ 功能特性

- **跨网页共享**：所有标签页使用同一套待办数据
- **实时同步**：新增、完成、删除、折叠状态和位置在标签页间同步
- **自由拖动**：卡片可移动到浏览器窗口任意位置，刷新后保留
- **折叠模式**：收起内容，仅保留紧凑标题栏
- **本地优先**：数据保存在 `chrome.storage.local`，不上传服务器
- **安全隔离**：使用 Shadow DOM 封装 UI/CSS，减少与业务页面冲突
- **零依赖**：纯 HTML/CSS/JavaScript，适用于 Chrome 与 Edge

## 📦 安装

### Chrome / Edge 开发者模式

1. 从 [Releases](https://github.com/1mn0i/floating-todo-browser-extension/releases) 下载最新 ZIP。
2. 解压 ZIP 文件。
3. 打开 `chrome://extensions/`（Edge 使用 `edge://extensions/`）。
4. 开启右上角 **开发者模式**。
5. 点击 **加载已解压的扩展程序**，选择解压后的 `floating-todo-extension` 文件夹。
6. 打开任意网页，右下角即可看到悬浮待办。

> 使用本地 `file://` 页面时，请在扩展详情中开启 **允许访问文件网址**，然后刷新页面。

## 🧭 使用方式

- 在输入框输入内容并按 Enter 或点击 `+` 添加待办
- 点击复选框标记完成
- 点击 `×` 删除待办
- 拖动标题栏移动卡片
- 点击 `− / ＋` 折叠或展开

## 🏗️ 项目结构

```text
floating-todo-extension/
├── manifest.json   # Manifest V3 配置
├── content.js      # 页面注入、Shadow DOM、交互与同步
├── widget.js       # 待办核心逻辑（由 content.js 加载）
├── widget.html     # 独立预览页面
└── icons/          # 扩展图标
```

## 🔧 开发与调试

修改代码后，在扩展管理页点击 **重新加载**，再刷新目标网页。出现异常时，可打开扩展详情中的 **Errors** 查看错误日志。

核心存储键：

- `items`：待办数组
- `collapsed`：折叠状态
- `x / y`：卡片位置

## 🛡️ 隐私说明

本扩展不包含网络请求、不采集用户数据。待办内容仅保存在当前浏览器的扩展本地存储中；清除扩展数据或卸载扩展会删除这些数据。

## 📄 许可证

可按公司内部需求自行使用、修改和分发。
