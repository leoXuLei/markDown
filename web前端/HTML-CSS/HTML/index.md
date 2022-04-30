# HTML

## 简介

> **定义：**
> HTML 是指超文本标记语言( Hyper Text Markup Language)
> HTML 不是一种编程语言，而是一种标记语言(标记语言是一套标记标签  (markup tag))
> HTML 使用标记标签来描述网页
> HTML 文档包含了 HTML  标签及文本内容，也叫做  web 页面

## 元素

### 行内元素

行内元素多为描述性标记，行内元素最常使用的就是 `<span>`，还有`<sub>`和`<sup>`这两个标签可以直接做出平方的效果，而不需要类似移动属性的帮助，很实用。

```js
<span>...</span>
<a>...</a>  // 链接
<br/>   // 换行
<strong>...</strong>  // 加粗
<img/>  // 图片
<sup>...</sup> // 上标
<sub>...</sub> // 下标
<i>...</i> // 斜体
<em>...</em> // 斜体
<del>...</del>  // 删除线
<u>...</u>  // 下划线
<input>...</input>  // 文本框
<textarea>...</textarea>  // 多行文本
<select>...</select>  // 下拉列表
```

> **行内元素特征**

- 设置宽高无效
- 只有水平方向存在。垂直方向会被忽略。 尽管 border 和 padding 在 content 周围，但垂直方向上的空间取决于`line-height`
- 水平排列，不会自动进行换行
  如下图，可以看到，文字虽然换行了，但是每一行的 padding 也会起效果，即相当于没换行
  ![](../imgs/页面结构布局-16.png)
  ![](../imgs/页面结构布局-17.png)
  ![](../imgs/页面结构布局-18.png)
  ![](../imgs/页面结构布局-19.png)

### 块级元素

块级元素大多为结构性标记，块状元素代表性的就是 div，其他如 p、nav、aside、header、footer、section、article、ul-li、address 等等，都可以用 div 来实现。不过为了可以方便程序员解读代码，一般都会使用特定的语义化标签，使得代码可读性强，且便于查错。

```js
<address>...</adderss>   
  <center>...</center>  // 地址文字
  <h1>...</h1>  // 标题一级
  <h2>...</h2>  // 标题二级
  <h3>...</h3>  // 标题三级
  <h4>...</h4>  // 标题四级
  <h5>...</h5>  // 标题五级
  <h6>...</h6>  // 标题六级
  <hr />  // 水平分割线
  <p>...</p>  // 段落
  <pre>...</pre> // 预格式化
  <blockquote>...</blockquote>  // 段落缩进   前后5个字符
  <marquee>...</marquee> // 滚动文本
  <ul>...</ul>  // 无序列表
  <ol>...</ol>  // 有序列表
  <dl>...</dl>  // 定义列表
  <table>...</table>  // 表格
  <form>...</form>  // 表单
  <div>...</div>
```

> **块级元素特征**

- 能够识别宽高
- margin 和 padding 的上下左右均对其有效
- 可以自动换行
- 多个块状元素标签写在一起，默认排列方式为从上至下

### 行内块级元素

行内块状元素综合了行内元素和块状元素的特性，但是各有取舍。因此行内块状元素在日常的使用中，由于其特性，使用的次数也比较多。

> **行内块级元素特征**

- 能够识别宽高
- 不自动换行
- 默认排列方式为从左到右
  ![](../imgs/页面结构布局-20.png)

## 标签

### `<meta>`

> **定义:**
> 元数据（metadata）是关于数据的信息。标签提供关于 HTML 文档的元数据。元数据不会显示在页面上，但是对于机器是可读的。典型的情况是，meta 元素被用于规定页面的描述、关键词、文档的作者、最后修改时间以及其他元数据。标签始终位于 head 元素中。元数据可用于浏览器（如何显示内容或重新加载页面），搜索引擎（关键词），或其他 web 服务。

简单总结下就是：<meta> 标签提供关于 HTML 文档的元数据。它不会显示在页面上，但是对于机器是可读的。可用于浏览器（如何显示内容或重新加载页面），搜索引擎（关键词），或其他 web 服务。

> **作用:**
> meta 里的数据是供机器解读的，告诉机器该如何解析这个页面，还有一个用途是可以添加服务器发送到浏览器的 http 头部内容

> **实例:**

我们可以借助<meta>元素的 viewport 来帮助我们设置视口、缩放等，从而让移动端得到更好的展示效果。

```js
<meta name="viewport" content="width=device-width; initial-scale=1; maximum-scale=1; minimum-scale=1; user-scalable=no;">
```

| value         | 可能值                 | 描述                                                  |
| ------------- | ---------------------- | ----------------------------------------------------- |
| width         | 正整数或 device-width  | 以 pixels(像素)为单位，定义布局视口的宽度             |
| height        | 正整数或 device-height | 以 pixels(像素)为单位，定义布局视口的高度             |
| initial-scale | 0.0-10.0               | 定义页面初始缩放比率                                  |
| minimum-scale | 0.0-10.0               | 定义缩放的最小值：必须小于或等于 maximum-scale 的值   |
| maximum-scale | 0.0-10.0               | 定义缩放的最大值：必须大于或等于 minimum-scale 的值   |
| user-scalable | yes/no                 | 如果设置成 no，用户将不能放大或缩小网页，默认值为 yes |

### `<dl>`：描述列表，键值对列表

<dl> 标签代表一个描述列表。该标签的常用用途是实现词汇表或显示元数据（键值对列表）

> **实例:**

如下图，左边的导航菜单和右边的发展历史。也都是`dl`包裹着`dt`和`dd`。
![](../imgs/页面结构布局-21.png)

如下图，
![](../imgs/页面结构布局-22.png)
右边的类型的 dt 是在上层，dd 是在下层，如何让 dd 跑到 dt 的右边呢，
给 dd 设置一个 margin-top: -xx，设置一个 padding-left:xx,如下图
![](../imgs/页面结构布局-23.png)

### `<embed>`：页面中嵌入内容

如下嵌入优酷视频

```html
<div class="video_content">
  <embed src="http://player.youku.com/player.php/sid/XNjkzMDE5MTUy/v.swf" allowFullScreen="true" quality="high" width="220" height="140" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed>
</div>
```

### `<hr>`：水平线

`<hr>`标签的显示上是一条水平线，效果在视觉上将文档分割成各个部分。
`<hr>`标签是单标签（空标签），没有元素内容，只是显示为一条水平线，表示话题的转移。

### `<iframe>`：内联框架

一个内联框架被用来在当前 HTML 文档中嵌入另一个文档。

### `<ul>`：无序列表

首页的导航一般都是 ul

```html
<ul>
  <li>咖啡</li>
  <li>茶</li>
  <li>牛奶</li>
</ul>
```

## 效果

### 1、如何显示小点

```html
<body>
  <li>&middot; <a href="#">腾讯游戏平台首推强加速、LOL助手永久免费</a></li>
</body>
```

![](../imgs/页面结构布局-24.png)

### 2、html 和 css 处理空格符

- html 中空格

|            |          |                            |
| ---------- | -------- | -------------------------- |
| `&nbsp;`   | `&#160`  | 不断行的空白(1 个字符宽度) |
| `&ensp;`   | `&#8194` | 半个空白(1 个字符宽度)     |
| `&emsp;`   | `&#8195` | 一个空白(2 个字符宽度)     |
| `&thinsp;` | `&#8201` | 窄空白(小于 1 个字符宽度)  |

| 实体名称   |         | 显示结果 | 描述 |
| ---------- | ------- | -------- | ---- |
| `&amp;`    | `&#38`  | `&`      | 和号 |
| `&lt;`     | `&#60`  | `<`      |
| `&gt;`     | `&#62`  | `>`      |
| `&quot;`   | `&#34`  | `"`      |
| `&qpos;`   | `&#39`  | `'`      |
| `&copy;`   | `&#169` | `©`      | 版权 |
| `&times;`  | `&#215` | `×`      | 乘号 |
| `&divide;` | `&#247` | `÷`      | 除号 |

- css 的方式空格
  - css 中当 `white-space` 属性取值为 pre 时，浏览器会保留文本中的空格和换行
    `<div style="white-space:pre">AA BB<div>`
    显示效果为： AA   BB
  - CSS 的 `letter-spacing` 属性用于设置文本中字符之间的间隔
    `<div style="letter-spacing:5px;">欢迎光临！</div>`
    显示效果为：  欢     迎    光    临    ！
  - css 的 `word-spacing` 属性用于设置文本中单词之间的间隔
    `<div style="word-spacing:5px">Happy new year!</div>`
    显示效果为： Happy   new   year!

### 3、如何显示平方米

`㎡`
显示面积单位是平方米，如何显示，用`m<sup>2</sup>`: m<sup>2</sup>无效，直接从网页找个例子，复制到代码中就好了
