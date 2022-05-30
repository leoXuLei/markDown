<!--
 * @Author: xulei
 * @Date: 2020-06-26 12:22:43
 * @LastEditors: xulei
 * @LastEditTime: 2020-10-18 12:10:27
 * @FilePath: \markDown\markdown语法.md
-->

<!-- 生成目录 -->
<!-- @import "[TOC]" {cmd="toc" depthFrom=2 depthTo=3 orderedList=false} -->

<!-- code_chunk_output -->

- [简介](#简介)
- [使用模板](#使用模板)
- [语法](#语法)
  - [二级标题](#二级标题)
    - [三级标题](#三级标题)
  - [列表](#列表)
  - [文本相关样式](#文本相关样式)
  - [分割线](#分割线)
  - [引用](#引用)
  - [代码](#代码)
    - [代码对比效果](#代码对比效果)
  - [链接（文本、图片）](#链接文本图片)
    - [html 实现图片自定义大小](#html-实现图片自定义大小)
  - [表格](#表格)
  - [实践](#实践)
    - [知识体系结构](#知识体系结构)
    - [参考资料](#参考资料)
  - [emoj](#emoj)
  - [任务列表](#任务列表)
  - [注脚](#注脚)
  - [锚点](#锚点)
  - [数学公式](#数学公式)
  - [其它](#其它)
    - [使用方式](#使用方式)
    - [将技术文章转为 MD 格式](#将技术文章转为-md-格式)
  - [HTML](#html)

<!-- /code_chunk_output -->

# 简介

> **是什么：**
> Markdown 是一种轻量级标记语言，创始人是约翰·格鲁伯(John Gruber)。它允许人们 “使用易读易写的纯文本格式编写文档，然后转换成有效的 HTML 文档。

> **为什么学习：**
> 研究过后，Markdown 不仅可以帮助公众号排版之外，也可以给任何文档排版，使之更加有结构，更加好看，只要你喜欢记录和输出，喜欢用电脑去记录一些东西，如果你不想被落伍的话，Markdown 是一个值得学习和掌握的技能。
>
> - 1.简介
>   实现了分离的功能， 可以专心写内容，而不用考虑格式样式问题。
> - 2.容易分享
>   线上/下都可以写作、传至云端（便于分享可以实现版本控制）
> - 3.兼容性好
>   甚至可以转为 word、pdf、ppt

# 使用模板

```

```

> **不推荐全局安装 webpack：**
> 这会将你项目中的 webpack 锁定到指定版本，并且在使用不同的 webpack 版本的项目中，可能会导致构建失败。

**【多重样式优先级顺序】：**

> **CSS 优先级法则：**

- A 选择器都有一个权值，权值越大越优先；

**【解释】：**

- content（内容）就是盒子里装的东西
- border（边框）就是盒子本身了

**【分类】：**
分为 W3c 标准盒子（默认）和 IE 盒子模型。通过`box-sizing: `属性设置。

**【规则】：**

- > [1]**如果你的更新函数返回值与当前 state 完全相同(浅比较)，则随后的重渲染会被完全跳过**。

- > 【2】与 class 组件中的 `this.setState` 方法不同，**`useState`不会将旧值自动“合并”并更新对象，它会使用新值覆盖 state**。

**【安装】**：`npm install typescript -g `

> 目前的主流浏览器还不完全支持 ES6 的语法，所以目前想要在浏览器运行 TS 代码需要 Compiler 编译器来将 TS 代码转换为浏览器支持的 JS 代码

**【编译】**（将 TS 文件 ES6 转为 JS 文件 ES5 代码）：

# 语法

<!-- 标题 -->

没有特殊符号开头的文字就是正文段落。正文段落之间必须有空行。没有空行的换行会被认为仍然是一段话。
分割线：\*\*\*或者---或者\_\_\_
前面空四格的段落被认为是代码段，或者可以认为这个段落内容不会被解释成任何格式

**语法：**

```js
## 二级标题
### 三级标题
```

**效果：**

## 二级标题

### 三级标题

<!-- 四级标题开始在目录中不显示 -->

<!-- 列表 -->

## 列表

**注意：列表紧接着下一行的内容，会跟着列表对齐，视情况选择使用**

**语法：**

```js
* 无序列表项1
* 无序列表项2
  * 二级列表项1
    * 三级列表项
  * 二级列表项1

1. 有序列表项1
2. 有序列表项2

```

**效果：**

- 无序列表项 1
- 无序列表项 2
  - 二级列表项 1
    - 三级列表项
  - 二级列表项 1

1. 有序列表项 1
2. 有序列表项 2

<!-- 文本格式 -->

## 文本相关样式

文本内空格：`&emsp;`

- 2021/07—2022/03&emsp;&emsp;杭州涂鸦信息技术有限公司

英文单词左右留个空格，换行用`<br>`或者空一行

文本之间的单行空白符换行 Git 上显示不起作用，使用`<br>换行符号`即可

| 语法                                                      | 效果                                                    |
| --------------------------------------------------------- | ------------------------------------------------------- |
| `*斜体文本*`                                              | _斜体文本_                                              |
| `**强调文本**`                                            | **强调文本**                                            |
| `__强调文本__`                                            | \__强调文本_                                            |
| `***斜体加强调文本*** `                                   | **_斜体加强调文本_**                                    |
| `~~被删除文本~~`                                          | ~~被删除文本~~                                          |
| `==高亮文本(标记)==`                                      | ==高亮文本(标记)==                                      |
| `空&emsp;格`                                              | 空&emsp;格                                              |
| `换<br>行 `                                               | 换<br>行                                                |
| `<font color=#00ffff size=4>color=#00ffff size=4</font> ` | <font color=#00ffff size=4>color=#00ffff size=4</font>  |
| `<font color=#87CEFA size=4>color=#87CEFA size=4</font>`  | <font color=#87CEFA size=4>color=#87CEFA size=4</font>  |
| `<font color=#FF69B4 size=4 >color=#FF69B4 size=4</font>` | <font color=#FF69B4 size=4 >color=#FF69B4 size=4</font> |
| `<font color=#008000 size=4 >color=#008000 size=4</font>` | <font color=#008000 size=4 >color=#008000 size=4</font> |
| `<font color=#FF0000 size=4 >color=#FF0000 size=4</font>` | <font color=#FF0000 size=4 >color=#FF0000 size=4</font> |
| `<font color=#429cc0 size=4 >color=#429cc0 size=4</font>` | <font color=#429cc0 size=4 >color=#429cc0 size=4</font> |

- **字母高亮：**
<pre>
".ar" => The <a href="#learn-regex"><strong>car</strong></a> <a href="#learn-regex"><strong>par</strong></a>ked in the <a href="#learn-regex"><strong>gar</strong></a>age.
</pre>

## 分割线

**语法：**(三种写法)

```
___
---
***
```

**效果：**

---

---

---

<!-- 模糊背景文本 -->

<!-- 引用 -->

## 引用

> 这是一段引用
>
> > 这是引用里面的引用

<!-- 代码 -->

## 代码

**语法：**

```js
`代码/模糊背景文本 ``function () { console.log('hello world')}`;
```

**效果：**

`代码/模糊背景文本 `

`function () { console.log('hello world')}`

```js
function () { console.log('hello world')}
function () { console.log('hello world')}
function () { console.log('hello world')}
```

### 代码对比效果

```diff
- function testFun() {
-   console.log("北京欢迎你");
- }
+ function testFun() {
+  console.log("hello world");
+}
```

```js
function testFun() {
  console.log("北京欢迎你");
}
function testFun() {
  console.log("hello world");
}
```

<!-- 链接 -->

## 链接（文本、图片）

**语法：**

```js
// [链接文本](链接地址)
[百度链接](http://www.baidu.com)
```

**效果：**
[百度链接](http://www.baidu.com)

**语法：**

```js
// ![图片文本](图片链接地址)
![壁纸](https://i.loli.net/2020/06/26/QEh8aDSv2UZtIGq.jpg)
```

**效果：**
![壁纸](https://i.loli.net/2020/06/26/QEh8aDSv2UZtIGq.jpg)

### html 实现图片自定义大小

**自定义大小且不被压缩（但是会被裁剪）**<br>
**语法：**

```html
<html>
  <div
    style="width:400px;height:200px;background:url(https://i.loli.net/2020/06/26/QEh8aDSv2UZtIGq.jpg) no-repeat center center;background-size: contain;"
  ></div>
</html>
```

**效果：**

<html>
<div
    style="width:400px;height:200px;background:url(https://i.loli.net/2020/06/26/QEh8aDSv2UZtIGq.jpg) no-repeat center center;background-size: contain;">
</div>
</html>

<html>
<div
    style="width:200px;height:200px;background:url(https://i.loli.net/2020/06/26/QEh8aDSv2UZtIGq.jpg) no-repeat center center;background-size: contain;">
</div>
</html>
<!-- 表格 -->
## 表格

[Markdown 表格合并单元格](https://www.pianshen.com/article/3015348076/)

**语法：**

```
左对齐列 | 居中 | 右对齐
:-- | -- | --:
2 | 3 | 5
10 | 100 |1000

|    | 甲 | 乙
| -- | -- | --
| 身高|165 | 178|
| 体重| 60| 70|
```

**效果：**

| 左对齐列 | 居中 | 右对齐 |
| :------- | ---- | -----: |
| 2        | 3    |      5 |
| 10       | 100  |   1000 |

|      | 甲  | 乙  |
| ---- | --- | --- |
| 身高 | 165 | 178 |
| 体重 | 60  | 70  |

## 实践

### 知识体系结构

- **md 文件命名：**
  [1]xxxx.md
  [2]xxxx.md

- **定义：**
- **「背景」：**

  从 ECMAScript 2015 开始，JavaScript 引入了 xxx 的概念。

- **本质：**
- **作用：**：用于 xxx，然后返回一个布尔值
- **API：**
  - api 一
    - 注意一
    - 注意二
  - api 二
- **特点：**
  - 特点一
  - 特点二
  - 特点三
- **规则：**
  - 规则一
  - 规则二
- **应用：**
- **用途：**
- **注意：**

### 参考资料

- [[1] 官网](https://www.tslang.cn/docs/handbook/basic-types.html)
- [[2] xxx](https://www.tslang.cn/docs/handbook/basic-types.html)

## emoj

<!-- emo -->

:smile:
:running:

## 任务列表

<!-- 任务列表 -->

- [x] @mentions, #refs, [links](), **formatting**, and <del>tags</del> supported
- [x] list syntax required (any unordered or ordered list supported)
- [x] this is a complete item
- [ ] this is an incomplete item

<!-- 注脚 -->

## 注脚

**语法：**

```js
我是注脚[^10]，点击会跳转到相应位置
```

**效果：**
我是注脚[^10]，点击会跳转到相应位置

## 锚点

**语法：**

```js
[说明文字](#jump)
<span id="jump">跳转到的位置</span>
```

**效果：**
[说明文字](#jump)
<span id="jump">跳转到的位置</span>

[^10]: 注脚跳转位置

## 数学公式

**参考资料：**

- [Markdown 文档中插入数学公式](https://zhuanlan.zhihu.com/p/158156773)
- [Markdown 中使用数学公式](https://www.jianshu.com/p/7efccfc5f5a2?utm_campaign=haruki&utm_content=note&utm_medium=seo_notes&utm_source=recommendation)
- [极客 Markdown 教程](https://geek-docs.com/markdown/markdown-tutorial/markdown-mathematical-formula.html)

| 名称                | md 公式                             | 效果                          |
| :------------------ | :---------------------------------- | :---------------------------- |
| 单个$               | `$O(n^2)$`                          | $O(n^2)$                      |
| 两个$(独占居中显示) | `$$O(n^2)$$`                        | $$O(n^2)$$                    |
| 加减                | `$\pm$`                             | $\pm$                         |
| 乘                  | `$\times$`                          | $\times$                      |
| 除                  | `$\div$`                            | $\div$                        |
| 大于等于            | `$\geq$`                            | $\geq$                        |
| 小于等于            | `$\leq$`                            | $\leq$                        |
| 约等于              | `$\approx$`                         | $\approx$                     |
| 不等于              | `$\not=$`                           | $\not=$                       |
| 上标                | `$a^b$`                             | $a^b$                         |
| 上标                | `$a_b$`                             | $a_b$                         |
| 上下标              | `$C_n^2$$`                          | $C_n^2$                       |
| 百分号              | `\%` `$\%$`                         | \% $\%$                       |
| 省略号              | `\dots`                             | $\dots$                       |
| 开方号              | `$\sqrt[5]{100}$`                   | $\sqrt[5]{100}$               |
| 分数                | `$\frac{abc}{xyz}$`                 | $\frac{abc}{xyz}$             |
| 平均数              | `$\overline{x}$`                    | $\overline{x}$                |
| 对数                | `$\log{13}$` `$\log_2{18}$` `$\ln$` | $\log{13}$ $\log_2{18}$ $\ln$ |
| 30 度角             | `$30^\circ$`                        | $30^\circ$                    |
| 左箭头              | `$\leftarrow$`                      | $\leftarrow$                  |
| 右箭头              | `$\rightarrow$`                     | $\rightarrow$                 |
| 上箭头              | `$\uparrow$`                        | $\uparrow$                    |
| 下箭头              | `$\downarrow$`                      | $\downarrow$                  |
| 长箭头              | `$\longrightarrow$`                 | $\longrightarrow$             |
| 双向短箭头          | `$\leftrightarrow$`                 | $\leftrightarrow$             |
| 向左双短箭头        | `$\Leftarrow$`                      | $\Leftarrow$                  |
| 双向双短箭头        | `$\Leftrightarrow$`                 | $\Leftrightarrow$             |
| 双向双长箭头        | `$\Longleftrightarrow$`             | $\Longleftrightarrow$         |

**Tips：**

- 单个`$`包着 跟两个`$`包着，后者会居中显示

```
  1<sup>2</sup>
  2<sub>2</sub>
```

$O(n^2)$
$$O(n^2)$$
1<sup>2</sup><br>
2<sub>2</sub>

## 其它

- [Github 做图床](https://www.jianshu.com/p/d51258ef5484)
- [高效且优雅的笔记记录：为知笔记+Typora+图床](https://www.pianshen.com/article/96761222584/)

### 使用方式

- 编辑器：
  - VScode：优先，有实时的输出对比效果
  - Typora
- 图床：PicGo+阿里云
- 笔记源文件存储
  - gitHub
  - 语雀

### 将技术文章转为 MD 格式

如何将技术论坛/网站（如掘金、知乎、CSDN、公众号、博客）上的文章转为 MD 格式。

> **clean-mark：**
> 它可以将博客文章转换为干净的 Markdown 文本文件。

- 安装
  `$ npm install clean-mark --global`

- 使用

  - `$ clean-mark "http://some-website.com/fancy-article"`
    文章将使用 URL 路径名自动命名。 在上面的情况下，名称将是`fancy-article.md`。
  - `$ clean-mark "http://some-website.com/fancy-article" -t html`
    可以指定文件类型，如上，可用的类型有：HTML、TEXT 和 Markdown。
  - `$ clean-mark "http://some-website.com/fancy-article" -o /tmp/article`
    还可以指定输出文件和路径，如上，输出将是 `/tmp/article.md`。 扩展名是自动添加的。

- 使用成功站点
  - 知乎
  - 微信公众号文章
  - ~~掘金文章~~

> **参考链接:**

- [croqaz/clean-mark](https://github.com/croqaz/clean-mark)
- [有什么办法把简书、掘金、CSDN 上一些优秀的文章保存成 markdown 文件呢？](https://www.zhihu.com/question/269930403)

<!-- HTML -->

## HTML

**语法：**

```html
  <html>
    <div style="color: red;font-size:18px">这是一段红色文本<div>

    <p style="text-align:center;color:#1e819e;font-size:1.3em;font-weight: bold;">
      一段居中的蓝色文字
      <br/>
      第二行
    </p>
  </html>
```

**效果：**

<html>
<div style="color: red;font-size:18px">这是一段红色文本<div>
<p style="text-align:center;color:#1e819e;font-size:1.3em;font-weight: bold;">
  一段居中的蓝色文字
  <br/>
  第二行
</p>
</html>
