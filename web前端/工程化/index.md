# 概念

## 独立立模式应用 vs 集成模式应用

**【独立模式应用】**

"独立模式应用"是指相对于集成模式而言的一种应用部署和开发方式。**在独立模式应用中，每个组件、系统或服务都是独立运行和管理的，它们之间相互独立且没有紧密的耦合关系。每个组件通常具有自己的数据存储、业务逻辑和用户界面，可以单独启动、维护和扩展**。

独立模式应用适用于那些需要独立部署和运行的功能模块或微服务，每个模块可以在不同的进程、容器或服务器上独立运行。这种部署方式使得独立模式应用更加灵活、可伸缩，并且可以独立地进行开发、测试和部署。

与集成模式相比，独立模式应用的优势在于灵活性和解耦。每个模块可以独立进行更新、升级和扩展，而不会影响其他模块的正常运行。同时，独立模式应用也可以更好地支持分布式系统架构和服务化的发展趋势。

**【集成模式应用】**

"集成模式应用"通常指的是将多个独立的组件、系统或服务整合在一起，形成一个统一的应用程序。在集成模式应用中，这些组件、系统或服务可以相互协作、共享资源和信息，并提供更丰富、完整的功能和用户体验。这种集成可以通过不同的方式实现，例如使用 API、插件、中间件或适配器等技术手段来连接和交互各个组件。集成模式应用有助于提高工作效率、减少重复开发和维护成本，并为用户提供一致性和一站式解决方案。



## `manifest.json`

> **【ZenCode 补全】**

- 用于描述一个 Web 应用程序的详细信息，包括它所使用的脚本、样式表和图像等资源。
- 在构建时由浏览器使用来确定如何加载这个应用程序以及在何处获取这些资源。
- manifest 文件是必须存在的，

> **【React 项目根目录 public 下有个 manifest.json 文件：GPT】**

```json
{
  "name": "UIShape",
  "shapeType": "Trend",
  "display": "standalone", // 定义了应用如何被展示，比如全屏展示、独立窗口等。这里是"standalone"表示应用以独立窗口模式展示。
  "description": "趋势控件", // 应用的描述
  "icons": [], // 应用的图标
  "start_url": ".",
  "startUrl": "index.js", // 应用的起始URL，表示应用的入口点是index.js文件。
  "cssUrl": "index.css", // 应用的CSS样式文件
  "shapeboxIcon": "icon.png", // 应用的形状框图标
  "previewIcon": "preview-icon.png", // 应用的预览图标
  "theme_color": "#000000", // 应用的主题颜色
  "background_color": "#ffffff" // 应用的背景颜色
}
```

这个 `manifest.json` 文件是一个 Web App 清单文件，用于描述一个基于 Web 的应用程序的元数据信息。在这个具体的例子中，该清单文件描述的是一个名为 UIShape 的应用程序。


## 图片

### `data:image/png;base64`

`data:image/png;base64`表明：这是一个表示png格式图片的base64编码字符串。

只复制了头两个base64编码串（共133个字符），整个字符串133450 个字符。

```json
{
  "preview": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gAAAPoCAYAAABNo9TkAAAAAXNSR0IArs4c6QAAIABJREFUeF7svQl4G9W5Pv6NJFuyJGeBmC0spUBISIESwg5hhxIKhXLZLpRLSx1CgbYpS
}
```
