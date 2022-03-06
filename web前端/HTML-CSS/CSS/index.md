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
- 连写选择符号

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
- 伪类选择器：CSS 伪类是用来添加一些选择器的特殊效果。

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

  - nth-child()伪类选择器
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

- 属性选择器

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

- `.X:not(selector)` 取反选择器

```css
div:not(#container) {
} // 把除id为container之外的所有div标签都选中

:not(p) {
} // 把除了p标签之外的所有标签都选中
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
li:not(: last-child) {
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

**解释：**

- content（内容）就是盒子里装的东西
- padding（内边距）就是怕盒子里装的东西损坏而添加的泡沫或者其他抗震防挤压的辅料
- border（边框）就是盒子本身了
- margin（外边距）则说明盒子摆放的时候不能全部堆在一起，要留一定空隙。

**分类：**
分为 W3c 标准盒子（默认）和 IE 盒子模型。通过`box-sizing: `属性设置。

- W3c 标准盒子模型`box-sizing: content-box`（默认）
  宽高分别对应到元素的 content，内边距和边框在宽高之外渲染。
  设置元素的 width 和 height 就是指 content 的高度。
  ==布局所占宽高= boder+padding+content 的宽高决定==

- IE 盒子模型`box-sizing: border-box`
  宽高分别对应到元素的 border，内边距和边框在宽高之内渲染。
  ==布局所占宽高=content 的宽高决定（boder+padding 包含在 content 的宽高里面）==

## 定位

**概念：**

- 定位：定义元素框相对于其正常位置应该出现的位置，或者相对于父元素、另一个元素甚至浏览器窗口本身的位置。
- css 定位机制：有三种基本的定位机制：普通流、浮动和绝对定位。
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
  绝对定位是“相对于”第一个非静态定位（satic）的父元素进行定位，如果不存在已定位的祖先元素，那么“相对于”最初的包含块 HTML，原来的位置空间从文档流删除不再占据空间 。

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

- 参考链接
  - [css position 定位 top 百分比的问题](https://www.imooc.com/article/12794)
  - [CSS 绝对定位 top: 100%和 bottom:0 的区别](https://www.jianshu.com/p/e37e586249f3)

## 同一个选择器使用多次伪类

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

  &:hover:not(.disabled):not(.selected) .folder-item-name {
    color: #1b9aee;
  }
}
```

## 滚动条样式

```css
::-webkit-scrollbar {
  display: none;
}
```

[用 CSS 修改滚动条样式](https://www.cnblogs.com/liulangbxc/p/15200433.html)

## 点击 a 元素 b 元素添加样式

```jsx

.high-light {
  background-color: #fff;
  transition: background-color 0.5s ease-in 0.5s;
  animation: changebackgroundcolor 0.5s ease-in-out 0s 1 alternate running forwards;
}

const onClickFormula = useCallback((ref: React.RefObject<HTMLDivElement>) => {
  ref?.current?.classList?.add("high-light");
  setTimeout(() => {
    ref?.current?.classList?.remove("high-light");
  }, 500);
}, []);
```

## 用纯 CSS 禁止鼠标点击事件

[链接](https://www.cnblogs.com/karajanking/p/5889300.html)

```css
.disabled {
  pointer-events: none;
  cursor: default;
  opacity: 0.6;
}
```

## 其它

- scss 文件悬浮到选择器上可以看到匹配当前选择器的 html 结构

- 若写了结构也有内容但是就是不出来高度占比，给个`font-size`就好了

- css 如何实现点击 a 元素，b 元素改变样式

  ```css
  a:hover .b {
    background: red;
  }
  ```

- styled 组件元素复用的时候如果需要特定修改，通过 style 来修改

- 如何修改 antd 的默认样式

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

- calc

```css
height: calc(100vh - 260px); // 有时候用100%受到父元素影响不如vh方便
```

- [MDN-sticky 定位](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position)

# 属性

## div:focus-within

> :focus-within 是一个 CSS 伪类 ，表示一个元素获得焦点，或，该元素的后代元素获得焦点。换句话说，元素自身或者它的某个后代匹配 :focus 伪类。

```css
.oui-linked-content-add-row-search-container-input-search {
  flex: 1 1 auto;
  color: #979797;
  height: 32px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  margin: 0px 6px;
  font-size: 14px;
  border-radius: 18px;
  border: 1px solid #e5e5e5;
  transition: border-color 0.3s ease;
  background-color: #fff;
  &:hover {
    border-color: #1b9aee;
  }
  &:focus-within {
    .oui-linked-content-add-row-search-container-input-search-result {
      display: block;
    }
  }
  .ant-input-suffix {
    margin-left: 10px;
  }
  &-result {
    width: 100%;
    position: absolute;
    top: 100%;
    left: 0px;
    background-color: #09c;
    display: none;
  }
}
```

# 常见效果

## 文本超出显示省略号

文本显示一行，超出显示省略号，悬浮显示全部

```jsx
<div
  title={value}
  style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
>
  //
  若Tooltip的children为全文本，则必须为div，为span的话，Tooltip没法显示在布局的正中间，而是文本的正中间（即使文本被hidden了），但是这也解决还有一个问题，就是没有超出的时候Tooltip依旧显示在布局的正中间，而不是文本的正中间了
  <div style={{ width: "100%" }}>{value}</div>
</div>
```

```jsx
// 最终解决方法为：设置最大宽度为100%，ToolTip就能始终显示在文本的正中间，文本超出则显示在布局盒子的正中间

// .approval-item-title {
//   max-width: 100%; // 不设置宽度直接flex: 1 1 auto即可
//   display: inline-block;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: nowrap;
// }

<Row>
  <Col span={4}>
    <Tooltip title={approvalItem?.approvalTitle}>
      <span
        className="approval-item-title"
        onClick={() => {
          props?.onClickDetail?.(approvalItem);
        }}
      >
        {approvalItem?.approvalTitle}
      </span>
    </Tooltip>
  </Col>

  <Col span={3} offset={1} className="status">
    {approvalItem?.approvalStatus}
  </Col>
</Row>
```

```jsx
// 解法方案一：flex布局，子项目长度可能很长超出显示省略号，悬浮显示Tooltip，不需要缩小的子项目就设置flex-shrink
const ApprovalITemCss = css`
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  .approval-processing {
    color: #0171c2;
  }
  .no-shrink {
    flex: 0 0 auto;
  }
  .text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .gap {
    margin-right: 16px;
  }
  .project-info {
    margin-left: 6px;
  }
  &:hover {
    background: #f7f7f7;
  }
`;

const ApprovalItem = (props) => {
  const { dashboard: lang } = useAppLocales();

  const { item } = props;
  return (
    <div css={ApprovalITemCss}>
      <Icon type="approval-process" className="gap approval-processing" />
      <div className="no-shrink gap">{lang?.myApproval}</div>
      <Tooltip title={item?.title}>
        <div className="text gap">{item?.title}</div>
      </Tooltip>
      <div className="text no-shrink gap">{item?.reviewDescription}</div>
      <div className="no-shrink">
        <ProjectSvg />
      </div>
      <div className="project-info text">{item?.projectName}</div>
    </div>
  );
};

export default ApprovalItem;
```

# CSS 模块化

## 实例一

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

## 实例二

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

## 参考

- [CSS 知识点及技巧整理](https://juejin.cn/post/6844903567707357197#heading-22)
