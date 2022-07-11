# CSS

## 简介

> **定义：**
> CSS 指层叠样式表 (Cascading Style Sheets)，
> **特点：**
> 标记语言：css 语言是一种标记语言，它不需要编译，可以直接由浏览器执行(属于浏览器解释型语言)。
> **作用：**
> 样式定义如何显示 HTML 元素，可以改变页面的布局和外观。样式通常存储在样式表中，把样式添加到 HTML 4.0 中，是为了解决内容与表现分离的问题。

## 语法

CSS 规则由两个主要的部分构成：选择器，以及一条或多条声明:

- 选择器通常是您需要改变样式的 HTML 元素。
- 每条声明由一个属性和一个值组成。声明总是以分号(;)结束，声明总以大括号({})括起来；
- 属性（property）是您希望设置的样式属性（style attribute）。每个属性有一个值。属性和值被冒号分开。

```js
选择器 { 属性：值; }

注释如下
/*这是一段注释 */
```

![](./imgs/css-grammar.jpg)

## 如何插入样式表

其中，优先级：内联式 > 嵌入式 > 外联式

> **【1】外部样式表**

- Link

当样式需要应用于很多页面时，外部样式表将是理想的选择。在使用外部样式表的情况下，你可以通过改变一个文件来改变整个站点的外观。每个页面使用标签链接到样式表。 标签在（文档的）头部如下，外部样式表可以在任何文本编辑器中进行编辑。文件不能包含任何的 html 标签。样式表应该以 .css 扩展名进行保存。

```html
<head>
  <link rel="stylesheet" type="text/css" href="mystyle.css" />
</head>
```

- @import

```html
<style type="text/css">
  @import "jisuan.css";
</style>
```

link 和@import 的区别：

> **【2】内部样式表**

当单个文档需要特殊的样式时，就应该使用内部样式表。你可以使用 `<style>` 标签在文档头部定义内部样式表，就像这样:

```html
<head>
  <style>
    body {
      padding: 0;
      margin: 0;
    }
    .test {
      font-size: 13px;
    }
  </style>
</head>
```

> **【3】内联样式表**

由于要将表现和内容混杂在一起，内联样式会损失掉样式表的许多优势。请慎用这种方法，例如当样式仅需要在一个元素上应用一次时。要使用内联样式，你需要在相关的标签内使用样式（style）属性。Style 属性可以包含任何 CSS 属性。本例展示如何改变段落的颜色和左外边距：

```html
<p style="color:sienna;margin-left:20px">这是一个段落。</p>
```

## 选择器

> **多重样式优先级顺序：**
> !important 规则例外大于所有
> ==内联样式>ID 选择器>伪类>属性选择器>类选择器>元素(标签)选择器>通用选择器（\*）==

当 !important 规则被应用在一个样式声明中时，该样式声明会覆盖 CSS 中任何其他的声明，无论它处在声明列表中的哪里。尽管如此，!important 规则还是与优先级毫无关系。==使用 !important 不是一个好习惯，因为它改变了你样式表本来的级联规则，从而使其难以调试==。

> **选择器效率从高到低的排序：**

- 1.id 选择器（#myid）
- 2.类选择器（.myclassname）
- 3.标签选择器（div,h1,p）
- 4.相邻选择器（h1+p）
- 5.子选择器（ul > li）
- 6.后代选择器（li a）
- 7.通配符选择器（\*）
- 8.属性选择器（a[rel="external"]）
- 9.伪类选择器（a:hover,li:nth-child）

> **CSS 优先级法则：**

- A 选择器都有一个权值，权值越大越优先；
- B 当权值相等时，后出现的样式表设置要优于先出现的样式表设置；
- C 创作者的规则高于浏览者：即网页编写者设置的 CSS 样式的优先权高于浏览器所设置的样式；
- D 继承的 CSS 样式不如后来指定的 CSS 样式；
- E 在同一组属性设置中标有"!important"规则的优先级最大；

> **权重计算：**

- 内联样式 1000
- id 选择器 100
- class 类选择器 10
- html 标签选择器 1

### 常见

- 分组和嵌套选择器
  - 分组选择器
  ```css
  h1,h2,p { 
  	color:green; 
  }
  ```
  - 嵌套选择器
  ```css
  .marked p { 
  	color:white; 
  }
  ```
- 连写选择符号（且）

  ```css
  /* 表示 类包含layout和fold时，sider生效 */

  .layout.fold .sider  {
      width: 42px;
  }
  ```

- 组合选择符：四种

  ```
  后代选取器(以空格分隔)  div p { }
  子元素选择器(以大于号分隔）div > p{}
  相邻兄弟选择器（以加号分隔） div + p{}
  普通兄弟选择器（以波浪号分隔）div ~ p{}
  ```

### 伪类选择器

> 伪类选择器：CSS 伪类是用来添加一些选择器的特殊效果。

```css
/* 注意hover必须放在link和visited后面才是有效的，
active必须放在hover之后才是有效的，
即 LoVe HAte */
/* 未访问的链接 */
a:link {
}
/* 已访问的链接 */
a:visited {
}
/* 鼠标划过链接 */
a:hover {
}
/* 已选中的链接 */
a:active {
}

p:before {
}
p:after {
}

/* 匹配class为red的a标签 */
a.red {
}

/* 匹配第一个 <p> 元素 */
p:first-child {
}

/* 匹配所有<p> 元素中的第一个 <i> 元素 */
p > i:first-child {
}

/* 匹配所有作为第一个子元素的<p> 元素中的所有 <i> 元素 */
p:first-child i {
}
/* 选择id为container的元素下面的所有子元素 */

#container * {
}

/* 把包含标题（title）的所有元素变为蓝色 */
[title] {
  color: blue;
}

/* 属性和值选择器  写出包含标题（title且title为hello）的所有元素变为蓝色 */
[title="hello"] {
  color: blue;
}

/* 选择包含title的a标签 */
/* 选择包含title且为‘test’的a标签 */
/* 选择包含href以http开头的a标签 */
/* 选择包含href以.jpg结尾的a标签 */

/* 选择除了id为 container的div标签 */
div:not(#container) {
}

/* 选择除了p标签之外的标签 */
/* 选择第n个li标签 */
/* 每隔三个元素获取一个标签 */
/* 选择奇数个和偶数个li标签的两种写法 */
/* 选择最后一个li标签两种写法 */
/* 选择第一个li标签两种写法 */
/* 选择其父元素的唯一子元素的每个li 元素 */
/* 选择出ul下除了最后一个的li */
/* 选择出ul下除了第一个和最后一个的li */
```

**【`nth-child()`伪类选择器】：**

- 简单数字序号写法（直接匹配第 n 个元素，1 开始）
- 倍数写法
- 倍数分组写法
- 奇偶匹配
  奇数(odd)与(2n+1)结果一样；偶数(even)与(2n)结果一样。

```css
/* 匹配序号为奇数的元素 */
:nth-child(odd) {
}
:nth-child(2n + 1) {
}
/* 匹配序号为偶数的元素 */
:nth-child(even) {
}
:nth-child(2n) {
}
```

**【`:empty`伪类选择器】：**

> 选择没有任何内容的元素，没有内容指的是一点内容都没有，哪怕是一个空格。

如下，antd 的 table 的自有类名`text`，因为`disabled`的列设置了灰白的背景色，且`.text`设置了一个`padding：8px`，导致这一个白色格子中间出现了一条宽度 100%，高度 16px 的灰色条纹，界面大面积出现很不好看。

修复前代码如下：

```css
tr:not(.row-selected) {
  .text {
    background: #f5f5f5;
  }
}
```

```jsx
<td class="ant-table-cell">
  <div class="text"></div>
</td>
```

修复后代码如下：
`.text`元素若没有任何内容，则不设置，有任何内容则加背景色。

```css
tr:not(.row-selected) {
  .text:not(:empty) {
    background: #f5f5f5;
  }
}
```

其它：这么改可以但不完美，完美做法是设置`td`的背景色，因为`td`没有`padding`。

**【`:focus-within`伪类选择器】：**

> :focus-within 是一个 CSS 伪类 ，表示一个元素获得焦点或该元素的后代元素获得焦点。换句话说，元素自身或者它的某个后代匹配 `:focus` 伪类。

```css
.input-search {
  flex: 1 1 auto;
  height: 32px;
  display: flex;
  align-items: center;
  transition: border-color 0.3s ease;
  background-color: #fff;
  &:hover {
    border-color: #1b9aee;
  }
  &:focus-within {
    .input-search-result {
      display: block;
    }
  }
}
```

### 属性选择器

```css
/* 选择所有带有 target 属性元素 */
[target] {
}

/* 选择所有使用 target="-blank" 的元素 */
[target="-blank"] {
}

/* 选择标题属性包含单词 "flower" 的所有元素 */
[title~="flower"] {
}

/* 选择每一个 src 属性的值以 "https" 开头的元素 */
a[src^="https"] {
}

/* 选择每一个 src 属性的值以 ".pdf" 结尾的元素 */
a[src$=".pdf"] {
}

/* 选择每一个 src 属性的值包含子字符串"W3Cschool" 的元素 */
a[src*="W3Cschool"] {
}

/* 选择class名包含'col-'的标签 */
[class*="clo-"] {
}
```

### `.X:not(selector)`取反选择器

```css
/* 把除id为container之外的所有div标签都选中 */
div:not(#container) {
}

/* 把除了p标签之外的所有标签都选中 */
:not(p) {
}
```

### 其它

```css
/* 删除ul下除了第一个和最后一个li */
li:not(":first,:last") {
}

/* 删除ul下除了最后一个li */
li:not(:last-child) {
  margin-bottom: 20px;
}

/* 选择最后一个li标签两种写法 */
li:last-child {
}
li:nth-last-child(1) {
}

/* 选择除了最后一个li标签 */
li:not(:last-child) {
}
```

```html
<!-- 分别选择前三个元素 -->
<ul class="hot_game_list">
  <li class="hot_game_item">
    <span class="hot_game_item_left">1</span>
  </li>
  <li class="hot_game_item">
    <span class="hot_game_item_left">2</span>
  </li>
  <li class="hot_game_item">
    <span class="hot_game_item_left">3</span>
  </li>
</ul>
<style>
  .hot_game_list  li:nth-child(1) .hot_game_item_left  {
      color: rgba(255, 78, 59, 1);
  }
  .hot_game_list  li:nth-child(2) .hot_game_item_left {
      color: rgba(243, 131, 0, 1);
  }
  .hot_game_list  li:nth-child(3) .hot_game_item_left {
      color: rgba(255, 191, 24, 1);
  }
</style>
```

### `nth-chid`和`nth-of-type`的区别

- 链接
  [深入理解 css3 中 nth-child 和 nth-of-type 的区别
  ](https://www.cnblogs.com/peakleo/p/6232384.html)

- 解释

  > 在 css3 中有两个新的选择器可以选择父元素下对应的子元素，一个是:nth-child 另一个是:nth-of-type。 但是它们到底有什么区别呢？
  >
  > 其实区别很简单：:nth-of-type 为什么要叫:nth-of-type？因为它是以"type"来区分的。也就是说：==ele:nth-of-type(n)是指父元素下第 n 个 ele 元素==，
  > ==而 ele:nth-child(n)是指父元素下第 n 个元素且这个元素为 ele==，若不是，则选择失败。
  > 不指定标签类型时，:nth-type-of(2)会选中所有类型标签的第二个。
  > nth-of-type(n)与 nth-child(n)中的 n 可以是数字、关键词或公式。

- 公式
  - 前面有标签
    - `xx:nth-child` 父标签下第几个子标签且是 xx 标签
    - `xx:nth-of-type` 父标签下 xx 这类标签的第几个
  - 前面无标签
    - `:nth-child` 父标签下第几个子标签
    - `:nth-of-type` 父标签下每类子标签的第几个

## 盒子模型

所有 HTML 元素可以看作盒子，在 CSS 中，"box model"这一术语是用来设计和布局时使用。

CSS 盒模型本质上是一个盒子，封装周围的 HTML 元素，它包括：==边距 margin，边框 border，填充 padding，和实际内容 content==。

![](./imgs/css-box-model-1.gif)

> **解释：**

- content（内容）就是盒子里装的东西
- padding（内边距）就是怕盒子里装的东西损坏而添加的泡沫或者其他抗震防挤压的辅料
- border（边框）就是盒子本身了
- margin（外边距）则说明盒子摆放的时候不能全部堆在一起，要留一定空隙。

> **分类：**

分为 W3c 标准盒子（默认）和 IE 盒子模型。通过`box-sizing: `属性设置。

- W3c 标准盒子模型`box-sizing: content-box`（默认）
  宽高分别对应到元素的 content，内边距和边框在宽高之外渲染。
  设置元素的 width 和 height 就是指 content 的高度。
  ==布局所占宽高= boder+padding+content 的宽高决定==

- IE 盒子模型`box-sizing: border-box`
  宽高分别对应到元素的 border，内边距和边框在宽高之内渲染。
  ==布局所占宽高=content 的宽高决定（boder+padding 包含在 content 的宽高里面）==

## 定位

> **概念：**

- 定位：定义元素框相对于其正常位置应该出现的位置，或者相对于父元素、另一个元素甚至浏览器窗口本身的位置。
- css 定位机制：**有三种基本的定位机制：普通流、浮动和绝对定位**。
- 定位属性
  - `position`: 把元素放置到一个静态的、相对的、绝对的、或固定的位置中。
    - static：元素框正常生成。块级元素生成一个矩形框，作为文档流的一部分，行内元素则会创建一个或多个行框，置于其父元素中。
    - relative：
    - absolute：
    - fixed：元素框的表现类似于将 position 设置为 absolute，不过其包含块是视窗本身。
  - `top、bottom、left、right`
  - `overflow`: 设置当元素的内容溢出其区域时发生的事情。
  - `clip`: 设置元素的形状。元素被剪入这个形状之中，然后显示出来。

**`relative`相对定位：**

- 解释
  相对定位是“相对于”元素在文档中的初始位置，==即相对于原来的位置进行上下左右偏移，原来的位置仍占空间==。

**`absolute`绝对定位：**

- 解释
  绝对定位是“相对于”第一个非静态定位（satic）的父元素进行定位，如果不存在已定位的祖先元素，那么“相对于”最初的包含块 HTML。==原来的位置空间从文档流删除不再占据空间==。

### 浮动

> **解释**

浮动：浮动的框可以向左或向右移动，直到它的外边缘碰到包含框或另一个浮动框的边框为止。==不保留原来的位置的，漂浮在标准流的上方==

> **目的**

就是可以让多个块级元素一行内显示从而实现布局效果。
由于浮动框不在文档的普通流中，所以文档的普通流中的块框表现得就像浮动框不存在一样。

[效果链接](https://blog.csdn.net/qq_40894300/article/details/89785279)

> **引起的问题：**

- 父元素的高度无法被撑开（因为浮动元素脱离了标准文档流，所以在父元素中不再占据空间），影响与父元素同级的元素。
- 与父元素同级的非浮动元素（内联元素）会跟随其后
- 如果不是第一个元素浮动，那么浮动元素之前的元素也需要浮动，否则会影响页面显示的结构。

> **解决浮动的方法：**

- **一：加高法：给父元素设置一个高度**

  浮动的元素，只能被有高度的盒子关住。只要浮动在一个有高度的盒子中，那么这个浮动就不会影响后面的浮动元素。所以就是清除浮动带来的影响了。==网页制作中，高度 height 很少出现。所以这种方法很少用，因为网页都是希望高度随内容自适应==。

- **二：空标签清除浮动**

  - 在所有浮动标签后面添加一个空标签，定义样式 `clear：both`,缺点是增加了空标签。不易于加载和 seo。

  - 还有一种是给受浮动元素影响的元素设置 `clear:both`， clear 就是清除，both 指的是左浮动、右浮动都要清除。意思就是:清除别人对我的影响，这个方法有一个非常大的并且致命的问题，margin 失效了！两个 div 之间没有任何的间隙了。

- **三：给浮动元素的父元素加一个 `overflow：auto/hidden`**
  这个属性的本意，就是将所有溢出盒子的内容隐藏掉。但是我们发现这个东西能够用于浮动的清除。
  我们知道，一个父盒子不能被自己浮动的儿子撑出高度，但是，如果这个父亲加上了 `overflow:hidden；`，那么这个父亲就能够被浮动的儿子撑出高度了。==这个现象原理是触发了父元素的 BFC。并且`overflow:hidden;`能够让 margin 生效==。
  <br/>

  让父盒子形成 BFC 解决浮动：
  ==BFC(Block formatting context)直译为”块级格式化上下文”。它是一个独立的渲染区域（区域里面你爱怎么动怎么动，定位也好，浮动也好，正常显示也好，都行，但是不能影响区域外的别人）==，只有 Block-level box 参与， 它规定了内部的 Block-level Box 如何布局，并且与这个区域外部毫不相干.
  overflow 不为 visible 的块框即可触发 BFC。这就是为什么我们经常用 `overflow:hidden` 去清除内部浮动的原因

- **四：给父元素加 clearfix 属性，after 伪对象清除浮动**
  `div:after`：在 div （父元素）内容的后面插入一些内容 。 其实就是==变异的额外标签法==。

  ```css
  .clearfix:after {
    content: "";
    display: block;
    height: 0;
    visibility: hidden;
    overflow: hidden;
    clear: both;
  }

  // 必须在伪对象中设置content属性，属性值可以为空，如“content: "";”。
  // 必须为需要清除浮动的元素伪对象设置“height:0;”样式，否则该元素会比其实际高度高出若干像素。
  ```

## 响应式设计

> **解释：**

页面的设计与开发根据用户行为以及设备环境(系统平台、屏幕尺寸、屏幕定向等)进行相应的响应和调整称之为响应式 Web 设计。

- 响应式 Web 设计让你的网页能在所有设备上友好显示。
- 响应式 Web 设计只使用 HTML 和 CSS。
- 响应式 Web 设计不是一个程序或 JS 脚本

> **原理**

基本原理是==通过媒体查询检测不同的设备屏幕尺寸做相应的样式处理==。

友好的用户体验是网页可以在任何设备上展示和操作，设备包括桌面系统设备，平板电脑，iPhone 等手机等。
网页应该根据设备的大小自动调整内容。

> **viewport**

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

- 解释
  viewport 是用户网页的可视区域。翻译为中文可以叫做"视区"。
  手机浏览器是把页面放在一个虚拟的"窗口"（viewport）中，==通常这个虚拟的"窗口"比屏幕宽，这样就不用把每个网页挤到很小的窗口中（这样会破坏没有针对手机浏览器优化的网页的布局），用户可以通过平移和缩放来看网页的不同部分==。

- 设置 Viewport
  一个常用的针对移动网页优化过的页面的 viewport meta 标签大致如下
  - width：控制 viewport 的大小，可以指定为一个值，如 600，或者特殊的值，如 `device-width` 为设备的宽度。
  - height：和 width 相对应，指定高度。
  - initial-scale：初始缩放比例，也即是当页面第一次 load 的时候缩放比例。
  - maximum-scale：允许用户缩放到的最大比例。
  - minimum-scale：允许用户缩放到的最小比例。
  - user-scalable：用户是否可以手动缩放。

> **媒体查询**

见 CSS3 多媒体查询

> **图片**

不管图片大小尺寸是什么，只要给它设置 width 和 height，就会按照这个宽高显示，（即原图会放大或缩小）
为了满足响应式设计 需要设置 `width 100%，height：auto`

- 如果 width 属性设置为 100%，图片会根据上下范围实现响应式功能

- 如果 max-width 属性设置为 100%，图片永远不会大于其原始大小

  ```css
  img {
    width: 100%;
    height: auto;
  }

  img {
    max-width: 100%;
    height: auto;
  }
  ```

# less 典型选择器写法

**【且选择器结合伪类】**

```less
.FilterLabel {
  flex-shrink: 0;
  margin-right: 10px;
  // 一：某个选择器className有.FilterLabel类和.Colon类的同时，.FilterLabel类的伪类:after才被选择上
  &.Colon:after {
    content: ":";
  }
  // 某个选择器className有.FilterLabel类且没有.Colon类的同时，.FilterLabel类的伪类:after才被选择上
  &:not(.Colon):after {
    content: ":";
  }
}
```

```jsx
const Label = (
  <label
    className={classNames(styles.FilterLabel, !isCheckbox && styles.Colon)}
  >
    {it.label}
  </label>
);
```

**【一个选择器内使用多次伪类】**

```css
.folder-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 16px;
  cursor: pointer;
  &-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  // hover时候且不是.disabled和.selected
  &:hover:not(.disabled):not(.selected) {
    background: #f7f7f7;
  }

  /* 这个放在上面的内部也是可以的 */
  &:hover:not(.disabled):not(.selected) .folder-item-name {
    color: #1b9aee;
  }
}
```

# CSS 模块化

**【参考链接】**

- [CSS 知识点及技巧整理](https://juejin.cn/post/6844903567707357197#heading-22)

**【实例】：**

- 实例一

```css
/* ./index.scss */
.datePickerDropdown {
  :global {
    .ant-picker-footer {
      display: flex;
      flex-direction: row-reverse;
      justify-content: space-between;
      padding-left: 12px;
    }
  }
}
```

```css
/* ./styles */
export const extraFooterContainerCss = css`
  display: flex;
  justify-content: flex-end;
  padding: 6px 0;
`
```

```jsx
import * as styles from "./styles"; // css-in-js 把css当组件玩，问题是拿不到类名
import myStyles from "./index.scss"; // css模块化

<DatePicker
  defaultValue={value ? moment?.(value) : undefined}
  defaultOpen
  open={disabled ? false : visible}
  css={css`
    width: 100%;
  `}
  allowClear={false}
  onChange={(v) => {
    setSelfValue(v?.valueOf?.());
  }}
  dropdownClassName={myStyles.datePickerDropdown}
  renderExtraFooter={() => (
    <div css={styles.extraFooterContainerCss}>
      <Button
        type="primary"
        size="small"
        onClick={() => {
          onChange?.(selfValue);
          setVisible(false);
        }}
      >
        确定
      </Button>
    </div>
  )}
/>;
```

- 实例二

```jsx
/** @jsx jsx */ // 必须加这个不然样式没有效果
import { css, jsx } from "@emotion/core";

import * as styles from "./styles";

return (
  <Modal
    width="100vw"
    css={styles.modalWrapperCss}
    style={{ padding: 0 }}
    centered
    footer={null}
    visible={props.visible}
    title={
      <div className="modal-header">
        {detail?.name || "详情"}
        <div className="modal-header-right">
          <ConditionComponent isShow={!!detail?.desc}>
            <Tooltip title={detail?.desc}>
              <span>
                <InfoCircleOutlined style={{ marginRight: 5 }} />
                如何读此报表
              </span>
            </Tooltip>
          </ConditionComponent>
        </div>
      </div>
    }
    onCancel={() => {
      props.onClose();
    }}
  >
    <LoadingComponent loading={loading}>
      <div className="body-content">
        <div className="graphic-list">
          <LoadingComponent loading={loading2}>
            {detail?.graphData?.map((c) => (
              <Card bordered key={c.name}>
                <Graphic
                  data={c}
                  overviewValue={overviewValue}
                  onOverviewChange={setOverviewValue}
                />
              </Card>
            ))}
            <ConditionComponent
              isShow={!!detail?.graphData.find((c) => c.name === "chart")}
            >
              <OverviewDetail
                overviewValue={overviewValue}
                filterValue={filterValue}
                sectionValue={sectionValue}
              />
            </ConditionComponent>
          </LoadingComponent>
        </div>
        <div className={classnames("graphic-filter", collapse && "collapsed")}>
          <div
            className="graphic-filter-icon"
            onClick={() => setCollapse(!collapse)}
          >
            <IfElseComponent
              if={<DoubleRightOutlined />}
              else={<MenuOutlined />}
              checked={!collapse}
            />
          </div>
          <ConditionComponent isShow={!collapse && !!detail}>
            <Card bordered={!collapse} className="graphic-filter-card">
              {detail && (
                <SectionPage item={detail} onChange={setSectionValue} />
              )}
              <div
                style={{ margin: "18px 0", borderBottom: "1px solid #e5e5e5" }}
              />
              <div className="graphic-filter-options">
                <div
                  className="graphic-filter-label"
                  style={{ marginBottom: 12 }}
                >
                  筛选
                </div>
                <Forms.NormalForm
                  layout="vertical"
                  submit={false}
                  initialValues={initialValues}
                  components={columns || []}
                  onValuesChange={onFilterValueChange}
                />
              </div>
            </Card>
          </ConditionComponent>
        </div>
      </div>
    </LoadingComponent>
  </Modal>
);
```

```ts
import { css } from "@emotion/core";

export const modalWrapperCss = css`
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-right {
      margin-right: 20px;
      color: rgb(140, 140, 140);
      font-weight: normal;
      font-size: 14px;
      cursor: pointer;
      &:hover {
        color: #0171c2;
      }
    }
  }
  .ant-modal-content {
    height: 100vh;
    display: flex;
    flex-direction: column;
    .ant-modal-header {
      flex-shrink: 0;
      box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
      z-index: 1;
    }
    .ant-modal-body {
      flex-grow: 1;
      overflow-y: auto;
      background-color: #f7f7f7;
      overflow-x: hidden;
      padding: 24px 40px;
      .body-content {
        display: flex;
        width: 100%;
        height: 100%;
        .graphic-list {
          flex-grow: 1;
          overflow: auto;
          .ant-card {
            &:nth-of-type(n + 2) {
              margin-top: 20px;
            }
          }
        }
        .graphic-filter {
          width: 320px;
          flex-shrink: 0;
          padding-left: 14px;

          position: relative;
          transition: width 218ms ease;
          font-size: 14px;

          &-options {
            flex-grow: 1;
            overflow: auto;
          }
          &-label {
            display: flex;
            align-items: center;
            height: 40px;
          }

          &-section {
            display: flex;
            align-items: center;
            height: 40px;
            color: #595959;
          }

          &.collapsed {
            width: 0;
            padding-left: 0;
            .graphic-filter-icon {
              /* left: 0px */
            }
          }
          &-card {
            height: 100%;
            overflow: hidden;
            & > .ant-card-body {
              height: 100%;
              display: flex;
              overflow: hidden;
              flex-direction: column;
            }
          }
          &-icon {
            position: absolute;
            top: 26px;
            left: 2px;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            color: #8c8c8c;
            border: 1px solid #e5e5e5;
            background-color: #fff;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1;
            &:hover {
              color: #fff;
              background-color: #1b9aee;
              border-color: #1b9aee;
            }
          }
        }
      }
    }
  }
`;
```

# 实战

## 如何修改 antd 组件的样式

- 通过 `global` 关键字来全局修改样式（不添加选择器限定条件时即为全局生效）。
  - 特点： 虽然你是在当前目录下的 less 或 css 文件修改了，但是全局生效的，建议如果有全局修改的需求，放到 `global.less` 的文件中修改，并做好注释。
- 不影响其它组件小技巧：
  - 因为这里是全局修改样式，会影响其他组件，通过给你需要修改的父级元素加一个包裹，用 `global` 的时候加一个父级选择器（如下面例子的`.m_tabs`）。

**【是否跳过中间层级的选择器】：**

非要选择多层级的类选择时每层都得加上`:global()`。

```css
.MaterialModal {
  :global(.ant-modal-content) {
    color: red;
    :global(.ant-modal-body) {
      font-size: 16px;
      :global(.ant-table-wrapper.EditTable) {
        max-height: 460px;
        overflow-y: scroll;
      }
    }
  }
}
```

跳过中间层选择也是可以生效的。

```css
.MaterialModal {
  :global(.ant-table-wrapper.EditTable) {
    max-height: 460px;
    overflow-y: scroll;
  }
}
```

多层级的类选择写在一个选择器中也是可以生效的。

```css
.MaterialModal {
  :global(.ant-modal-content > .ant-modal-body .ant-table-wrapper.EditTable) {
    max-height: 460px;
    overflow-y: scroll;
  }
}
```

```jsx
import styles from "./index.less";

<Modal className={styles.MaterialModal} visible={materialModalVisible} />;
```

**【实例】：**

- 实例一

```css
/* index.less */
.m_tabs {
  :global(.ant-tabs-nav) {
    padding: 0 !important;
  }
  :global(.ant-tabs-tab) {
    line-height: 2rem !important;
    font-size: 1.333rem !important;
    padding: 0.5rem 1rem !important;
  }
}
```

```jsx
import style from "./index.less";

<Tabs
  onChange={this.handleTabsChange}
  activeKey="cx"
  className={`${style.m_tabs} m-tabs-screen`}
>
  // ...
</Tabs>;
```

- 实例二

只有左右箭头的分页按钮，数字是 `.ant-pagination-simple` 下的 `.ant-pagination-simple-pager`元素。

```css
/* index.less */
.simplePagination {
  /* &表示并列，其实不用加这行直接加里面的也是对的 */
  &:global(.ant-pagination-simple) {
    :global(.ant-pagination-simple-pager) {
      display: none;
    }
  }
}
```

```jsx
import styles from "./index.less";

<Pagination className={`${styles.simplePagination}`} />;
```

- 实例三：用`emotion`好像可以不用 global 直接写就行？

```css
.button-container {
  display: flex;
  align-items: center;
  .ant-switch {
    background-color: #117a65;
  }
  .ant-switch-checked {
    background-color: #1890ff;
  }
}
```

**【参考链接】：**

- [修改 antd 中选择器修改不了的样式](https://blog.csdn.net/qq_43382853/article/details/104476658)
- [修改 antd 组件样式的几种方式](https://blog.csdn.net/qq_43382853/article/details/108324623)

## 某个组件的 disabled 样式如何从外部添加

如下若想给`<ContextMenuItem />`组件添加 disabled 样式，只能引入`styles.类目`来实现。（PS：emotion 好像可以支持外部添加类名？）

```tsx
import contextMenuStyles from "@components/contextMenu/ContextMenu.less";

<ContextMenuItem
  // className={curProductItem ? 'disabled' : ''} //这种没法生效
  className={!curProductItem ? `${contextMenuStyles.disabled}` : ""}
  onClick={onOpenAddModal}
>
  新增
</ContextMenuItem>;
```

```tsx
// src\components\contextMenu\ContextMenu.tsx
import styles from "./ContextMenu.less";

export const ContextMenuItem: FC<IContextMenuItem> = (props) => {
  const { children, className, ...restProps } = props;
  return (
    <div className={`${styles.ContextMenuItem} ${className}`} {...restProps}>
      {children}
    </div>
  );
};
```

```less
// src\components\contextMenu\ContextMenu.less
.ContextMenu {
  .ContextMenuItem {
    padding: 5px 10px;
    border-bottom: 1px solid #ccc;
    cursor: pointer;
    min-width: 100px;
    &:hover {
      background-color: #99ccff;
    }
    &.disabled {
      color: red;
      pointer-events: none;
      opacity: 0.7;
    }
  }
}
```

后面分析得出：以上情况的出现，说明组件设计有问题，应该将`disabled`设置为`ContextMenuItem`的属性，通过外部传入与否来控制里面的`disabled`样式，如下：

```tsx
export const ContextMenuItem: FC<IContextMenuItem> = (props) => {
  const { children, className, disabled, ...restProps } = props;
  return (
    <div
      className={classNames(
        styles.ContextMenuItem,
        disabled && styles.disabled,
        className
      )}
      {...restProps}
    >
      {children}
    </div>
  );
};
```

```tsx
<ContextMenuItem disabled={!curProductItem} onClick={onOpenAddModal}>
  新增
</ContextMenuItem>
```

# 问题

## `visibility: hidden`和`display: none`的区别

几种元素消失的属性：

- `display: none`; 元素消失，不占位；
- `visibility: hidden`; 元素消失，占位；
- `opacity: 0`; 透明度设为 0，元素看不见，占位；
- `width: 0`; 宽度设为 0，元素看不见，不占位。

在使用 CSS 隐藏一些元素时，我们经常用到 `display:none` 和 `visibility:hidden`。两者差别如下：

- 1. **是否占据空间**

  - `display:none`，该元素不占据任何空间，在文档渲染时，该元素如同不存在（但依然存在 DOM 文档对象模型树中）。
  - `visibility:hidden`，该元素空间依旧存在。
  - 即一个（display:none）不会在渲染树中出现，一个（visibility :hidden）会。

- 2. **是否渲染**
  - `display:none`，会触发 reflow（回流），进行渲染。
  - `visibility:hidden`，只会触发 repaint（重绘），因为没有发现位置变化，不进行渲染。
- 3. **是否是继承属性**

  - `display:none`，display 不是继承属性，元素及其子元素都会消失。
  - `visibility:hidden`，visibility 是继承属性，若子元素使用了`visibility:visible`，则不继承，这个子孙元素又会显现出来。

- 4. **读屏器是否读取**
     读屏器不会读取 display：none 的元素内容，而会读取 visibility：hidden 的元素内容。

- 布局应用
  基于 visibility 的可识别性，一些布局上的操作也是优于 display 的。
  - 页面加载。
    通常我们会设置一个加载图片来告诉用户页面正在加载，然后通过回调函数，隐藏加载图片，显示实际页面，如果此时用 display，在图片较少的情况下，问题不大。但正如上面所述，display 会触发重排，所以页面会发生抖动，等于一些元素重新被撑开，图片重新加载显示，尤其图片多的时候，问题更显著；而此时使用 visibility，是不会有这个问题，页面都已加载好，只是显示出来而已，不会触发重排，也不会触发页面抖动。
  - echarts 的 canvas 画布显示是基于其容器大小的，如果 display 控制显隐，元素相当于从 0 扩展到正常大小，虽然时间可以忽略，但对于 echarts 是致命的，它会挤成一团，必须重新调用 resize 方法才能恢复，页面不仅晃动，而且会有卡顿，这种问题通常出现在切换显示 echartsde 的时候，而使用 visibility，将相应的图层利用绝对定位叠在一起，这样切换，完全不会有任何问题，而且 visibility 在 hidden 状态时，是不会遮盖其他元素的，对于 echarts 或者有类似需求的布局，完全可以使用 visibility 来代替 display，并且兼容性无忧。
  - 针对与鼠标移入显示菜单的功能布局，display 可以胜任，但是它总会立刻出现，不能控制延时。原因就是 transition 属性不支持 display，究其原因，就是 display: none 不能识别，它不存在于渲染树中，无法获取对它的相应控制；而 visibility 属性是被支持的，因此利用 transition、visibility，可以实现元素的延时显示和立即消失。

> **链接**

- [display:none 和 visibility:hidden 的区别](https://zhuanlan.zhihu.com/p/37221519)
- [display:none 与 visibility:hidden 的区别](https://zhuanlan.zhihu.com/p/368014069)

# 常用颜色

<div style="background: #1890ff;color: #fff">background: #1890ff;color: #fff</div>

<div style="background: lightblue;color: #fff">background: lightblue;color: #fff （天蓝色）</div>

<div style="background: lightgreen;color: #fff">background: lightgreen;color: #fff （淡绿色）</div>

# Tips

## 设置颜色时的 `currentColor` 关键字

currentColor 关键字代表原始的 color 属性的计算值。它允许让继承自属性或子元素的属性颜色属性以默认值不再继承。

它也能用于那些继承了元素的 color 属性计算值的属性，相当于在这些元素上使用 inherit 关键字，如果这些元素有该关键字的话。
[MDN currentColor](https://developer.mozilla.org/zh-CN/docs/Web/CSS/color_value)

```css
.indicator {
  margin-left: 2px;
  width: 12px;
  height: 12px;
  border: 2px solid currentColor;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover,
  &.is-active {
    background-color: currentColor;
  }

  &:hover {
    transform: scale(1.2);
  }
}
```

## position 定位`top：100%` `bottom: 0`问题

> css 设置绝对定位后 ==top、bottom，设置百分比定位是按父元素的高度来计算的，同样 left、right，设置百分比定位是按父元素的宽度度来计算的==。

> top: 100%的定位是以父元素 border 下界为基线，向下延伸。（定位元素的顶部贴着父元素的底部 border，在边框外边）
> bottom: 0px 的定位是以父元素 border 上界为基线，向上延伸。（定位元素的底部贴着父元素的底部 border，在边框里面）

**【参考链接】**

- [css position 定位 top 百分比的问题](https://www.imooc.com/article/12794)
- [CSS 绝对定位 top: 100%和 bottom:0 的区别](https://www.jianshu.com/p/e37e586249f3)

## 滚动条样式

```css
::-webkit-scrollbar {
  display: none;
}
```

**【参考链接】**

- [用 CSS 修改滚动条样式](https://www.cnblogs.com/liulangbxc/p/15200433.html)

## 实现点击 a 元素 b 元素添加样式

**【最终做法】：** JS 实现

```tsx
// .high-light {
//   background-color: #fff;
//   transition: background-color 0.5s ease-in 0.5s;
//   animation: changebackgroundcolor 0.5s ease-in-out 0s 1 alternate running forwards;
// }

const intervalWorkloadRef = useRef < HTMLDivElement > null;

const onClickFormula = useCallback((ref: React.RefObject<HTMLDivElement>) => {
  ref?.current?.classList?.add("high-light");
  setTimeout(() => {
    ref?.current?.classList?.remove("high-light");
  }, 500);
}, []);

const Page = () => {
  return (
    <CanClickText onClick={() => onClickFormula(intervalWorkloadRef)}>
      {totalWorkDays ?? "-"}
    </CanClickText>
  );
};
```

**【简陋做法】：** CSS 实现，但是只是一瞬间，太短了

```css
a:hover .b {
  background: red;
}
```

## 用纯 CSS 禁止鼠标点击事件

```css
.disabled {
  pointer-events: none;
  cursor: default;
  opacity: 0.6;
}
```

**【参考链接】**

- [用纯 CSS 禁止鼠标点击事件](https://www.cnblogs.com/karajanking/p/5889300.html)

## 组件 className 前缀统一

```jsx
const __prefix_name = "ui-use-case";

const join = (...args) => {
  return [__prefix_name, ...args].join("-");
};

function render() {
  return <div className={join("customer-pop", "bottom")}></div>;
}
```

# 其它

- scss 文件悬浮到选择器上可以看到匹配当前选择器的 html 结构

- 若写了结构也有内容但是就是不出来高度占比，给个`font-size`就好了

- [MDN-sticky 定位](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position)

- 若有更高优先级的 className 把设置的样式覆盖如何处理

  解决方法：通过连写选择符号 或者 多些几个层级 实在不行再`!important`

  ```css
  .ant-form-item.oui-value-evaluation-formItem {
  }
  ```

```

```
