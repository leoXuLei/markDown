# 主命令框

- `F1` 或 `Ctrl+Shift+P`： 打开命令面板。在打开的输入框内，可以输入任何命令
  - 按一下 `Backspace` 会进入到 `Ctrl+P` 模式
  - 在 `Ctrl+P` 下输入 `>` 可以进入 `Ctrl+Shift+P` 模式
- 在 `Ctrl+P` 窗口下还可以:
  - 直接输入文件名，跳转到文件
  - `?`： 列出当前可执行的动作
  - `!`： 显示 Errors 或 Warnings，也可以 `Ctrl+Shift+M`
  - `:`： 跳转到行数，也可以 `Ctrl+G` 直接进入
  - `@`： 跳转到 symbol（搜索变量或者函数），也可以 `Ctrl+Shift+O` 直接进入
  - `@`： 根据分类跳转 symbol，查找属性或函数，也可以 `Ctrl+Shift+O` 后输入`:`进入
  - 根据名字查找 symbol，也可以 `Ctrl+T`

# 颜色主题设置

- `ctrl+k` + `ctrl+T`： 选择颜色主题
  - 手动设置：`文件/首选项/颜色主题`
  - 可选项
    - 深色+（默认深色）
    - `Dark + （default dark）`
    - `Monokai`
- 状态栏颜色设置：搜索`workbench.colorCustomizations`

```json
{
  "workbench.colorCustomizations": {
    "statusBar.background": "#1A1A1A", // rgb(0, 122, 204);
    "statusBar.background": "#530f64", // 紫色
    "statusBar.background": "#440f52", // 紫色
    "statusBar.noFolderBackground": "#0A0A0D",
    "statusBar.debuggingBackground": "#511f1f",
    "editor.selectionBackground": "#aa0000" // 选中后的背景色
  }
}
```

- 参考链接
  - [修改 VSCode 状态栏颜色](https://www.jianshu.com/p/b32a8731e55f)
  - [(多图)自定义修改 visual studio code 主题色，附绿色主题](https://blog.csdn.net/dscn15848078969/article/details/107578108)

# 常用快捷键

## 编辑器与窗口管理

- `Ctrl+Shift+N`： 打开一个新的 VsCode 窗口
- `Ctrl+Shift+W`： 关闭所有已保存的窗口
- `Ctrl+W`： 关闭当前的编辑器的当前窗口
- `Ctrl+N`： 新建文件
- `Ctrl+Tab`：
  - 当前编辑器的文件之间切换，松开生效，或者点击生效。
  - 左侧文件目录上方的**当前打开的编辑分组信息**也可快速点击切换
- `Ctrl+\`： 文件复制出一个新的编辑器（类似于`Chrome`中的窗口复制）
- `Ctrl+1 Ctrl+2 Ctrl+3`： 切换左中右 3 个编辑器的快捷键
- `Ctrl+k` 然后按 Left 或 Right： 编辑器换位置，

## 代码编辑

- `Ctrl+S`： 保存当前文件
- `Ctrl+K+S`： 保存所有未保存文件

### 格式调整

- `Tab`： 缩进
- `Tab+Shift`： 反缩进
- `Ctrl+[`、`Ctrl+]`： 代码行向左或向右缩进
- `Ctrl+C`： 复制当前行/当前选中内容
- `Ctrl+X`： 剪切当前行/当前选中内容
- `Ctrl+V`： 粘贴当前行/当前选中内容
- `Shift+Alt+F`： 代码格式化，或 `Ctrl+Shift+P` 后输入 `format code`
- `Alt+Up` 或 `Alt+Down`： 当前行 上/下移动一行
- `Shift+Alt+Up` 或 `Shift+Alt+Down`： 向上/下复制一行
- `Ctrl+Enter`： 在当前行下边插入一行
- `Ctrl+Shift+Enter`： 在当前行上方插入一行

### 光标相关

- `Alt + 左键单击`： 多光标，依次选定多个光标，同时编辑，适合多行光标在不同位置的
- `Alt+Shift+鼠标左键`： 选取区域多行同时编辑，适合多行光标在相同位置的
- `Alt+Shift+I`： 在选定的每一行的末尾插入光标
- `shift + 左右←→`： 移动光标选择字符
- `ctrl + shift + 左右←→`： 移动光标选择字符(一整段落)
- `Shift+Alt+Left` 和 `Shift+Alt+Right`： 扩展/缩小光标选取范围
  - 可以从每一行的最开始开始编辑、结尾开始编辑、复制粘贴也是可以的（需要借助`HOME`和`END`移动到每行选中区域的开始/结束）
- `Home`： 移动光标到行首
- `End`： 移动光标到行尾
- `Ctrl+Home`： 移动光标到文件开头
- `Ctrl+End`： 移动光标到文件结尾
- `Shift+Home`： 选择从行首到光标处
- `Shift+End`： 选择从光标到行尾
- `F12`： 移动到定义处，不如鼠标左键单击方便
- `Alt+F12`： 定义处缩略图（只看一眼而不跳转过去），不如`Alt+悬浮`香

- `双击文本`： 选中当前段落（英文逗号是段落分隔符，中文逗号不是）
- `三击文本`： 选中当前行
- `Ctrl+U`： 回退到上一个光标操作

### 重构代码

- 找到所有的引用： `Shift+F12`
- 同时修改本文件中所有匹配的： `Ctrl+F12`
- 重命名：比如要修改一个方法名，可以选中后按 F2，输入新的名字，回车，会发现所有的文件都修改了
- 跳转到下一个 Error 或 Warning：当有多个错误时可以按 F8 逐个跳转

### 搜索替换@@

- `Ctrl+F`： 当前文件中搜索
- `Ctrl+H`： 当前文件中搜索替换
- `Ctrl+P`： 当前项目工程中搜索文件，选择-回车打开
- `Ctrl+Shift+F`： 整个文件夹中查找

- 按包含文件夹或者排除文件夹来搜索
  - 第一行：搜索的关键词
  - 第二行：包含的文件：想在哪个文件夹中搜索，不填就是全局项目
    - 例子：如`blocks/`
  - 第三行：排除的文件：想排除的文件/文件夹，多个用逗号隔开`,`
    - 例子：排除文件夹如`blocks/teams,,blocks/spaces`
    - 例子：排除文件如`.scss`

### 代码

- `Ctrl+Z`： 撤销上一步操作
- `Ctrl+Y`： 回撤上一步操作，与`Ctrl+Z`相反
- `Ctrl+/`： 单行注释/取消注释
- `Alt+Shift+A`： 多行注释/取消注释

## 显示相关

- `F11`： 全屏
- `Ctrl +/-`： 窗口放大/缩小
- `Ctrl+B`： 侧边栏显/隐
- `Ctrl+Shift+E`： 显示资源管理器
- `Ctrl+Shift+F`： 显示搜索
- `Ctrl+Shift+G`： 显示 Git
- `Ctrl+Shift+D`： 显示 Debug
- `Ctrl+Shift+U`： 显示 Output

## 其它

- `!+Enter`： 新建 html 模板代码
- `Shift+英文引号"`： 给选中内容加引号

## 参考链接

- [VS Code 常用快捷键总结](https://www.cnblogs.com/schut/p/10461840.html)
- [VScode 快捷键（最全）](https://www.cnblogs.com/jpfss/p/10956650.html)

# 插件

## `snippets` 代码片段

- 插件
  - `ES7+ React/Redux/React-Native snippets`：v4.4.3，5.5M
  - `HTML Snippets`：v0.2.1，8.1M
    - HTML Snippets，各种 HTML 标签片段，如果你 Emmet 玩的熟，完全可以忽略这个；
  - `JavaScript (ES6) code snippets`：v1.8.0，8.7M
    - Javascript (ES6) Code Snippets，常用的类声明、ES 模块声明、CMD 模块导入等，支持的缩写不下 20 种；

### Basic Methods

```js
// !!! 导出箭头函数
enf→	export const functionName = (params) => { }
// !!! 箭头函数
nfn→	const functionName = (params) => { }
met→	methodName = (params) => { }
cp→	    const { } = this.props
cs→  	const { } = this.state
```

### React Component

```js
rfce→	// 无状态函数组件
// import React from 'react'

// function index() {
//   return (
//     <div>index</div>
//   )
// }

// export default index


rafce→	// 无状态箭头函数组件
// import React from 'react'

// const index = () => {
//   return (
//     <div>index</div>
//   )
// }

// export default index



rcc→
// import React, { Component } from 'react'

// export default class index extends Component {
//   render() {
//     return (
//       <div>index</div>
//     )
//   }
// }



rpc→

// import React, { PureComponent } from 'react'

// export default class index extends PureComponent {
//   render() {
//     return (
//       <div>index</div>
//     )
//   }
// }
```

### 其它

```js
clo→
// console.log('object :>> ', object);


div.nav
// 创建一个div标签，类名为nav <div class="nav"></div>

```

## 自动补全插件

- 插件
  - `Auto Close Tag`： v0.5.14，7.4M
    - 适用于 JSX、Vue、HTML，在打开标签并且键入 `</` 的时候，能自动补全要闭合的标签；
  - `Auto Rename Tag`： v0.1.10，9.5M
    - 适用于 JSX、Vue、HTML，在修改标签名时，能在你修改开始（结束）标签的时候修改对应的结束（开始）标签，帮你减少 50% 的击键；
  - `Path Intellisense`： v2.8.1，7.3M
    - 文件路径补全，在你用任何方式引入文件系统中的路径时提供智能提示和自动完成；

## @`Git graph` = git lens 图表版

查看存储库的 Git 图表，并从图表执行 Git 操作。

- 经典功能
- File History：文件改动的提交历史记录
- Branches
  - switch: 切换到不同分支/某次 commit
  - create branch from: 从当前分支/commit 节点新建分支
- Stashes: 暂存列表管理
- Search And Compare：搜索 commit、比较不同分支/commit 节点之间的改动/提交变化

## `Code Spell Checker`： 拼写检查
`v2.2.4`
## `MPE`：MD 预览导出插件

- [使用教程](https://shd101wyy.github.io/markdown-preview-enhanced/#/zh-cn/)

## `Markdown All in One`：MD 编辑插件

- 键盘快捷键
  - `ctrl + B` : 文本加粗
- 列表编辑
  - `Enter`
  - `Tab、BackSpace`
- 格式化 : github 风格的 md
  - `Alt + Shift + F`
- 其它
  - `Ctrl + v` : 在所选文本上粘贴链接

## `Doxygen Documentation Generator`：注释

- from: `Christoph Schlosser` `8.2M`

**【实例-函数注释】：**

```jsx
/**
 * 去重List的某一个字段值
 * @param list { Array } 原数组
 * @param key { String } 字段key
 * @returns Array
 */
export const uniqueListFieldValue = (list: IPlainObject[], key: string) => {
  const targetFieldList = (list || [])?.map((v) => v[key])?.filter(Boolean);
  const uniquedFieldList = Array.from(new Set(targetFieldList || []));
  return uniquedFieldList;
};

// 使用函数的地方，悬浮显示函数的入参及其类型、描述信息和返回值类型，如下

// 去重List的某一个字段值
// @param list — 原数组
// @param key — 字段key
// @returns — Array
```

**【参考链接】：**

- [VSCODE 使用插件 Doxygen Documentation Generator](https://blog.csdn.net/my_id_kt/article/details/122852676)
- [vscode 注释汇总](https://blog.csdn.net/weixin_38318244/article/details/115631697)

# MarkDown

- [Markdown 的五大 VSCode 扩展插件](https://www.jdon.com/56553)
- [VSCode 自动格式化 md 文档](https://www.jianshu.com/p/4d5529848104)

# Tip

- 全局搜索和页面内搜索的搜索输入框，支持上下箭头选择历史搜索内容。

# 参考链接

- [vscode 常用快捷键](https://www.cnblogs.com/bindong/p/6045957.html)
