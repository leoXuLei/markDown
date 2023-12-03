# 字体属性：font-

- **`font-family`：字体名称**
  属性值：`"Courier New", Courier, monospace, "Times New Roman", Times, serif, Arial, Helvetica, sans-serif, Verdana`
- **`font-size`：字体大小**
  单位：px，同一行内，文本的 `font-size` 如果不同，底部还是在对齐的。

- **`font-style`：字体样式**

  - normal 默认值。正常显示文本。
  - italic 斜体。以斜体字显示的文字。
  - inherit 规定应该从父元素继承字体样式。

- **`font-weight`：字体粗细**
  取值 100-900 。
  - bold:粗体(=700)
  - lighter:细体
  - normal:正常(=400)

# 文本属性： text-

## **`text-align`：水平对齐方式**

- left 把文本排列到左边。默认值。
- right 把文本排列到右边。
- center 把文本排列到中间。
- justify 实现两端对齐文本效果。
- inherit 规定应该从父元素继承 text-align 属性的值。

## **`vertical-align`：垂直对齐方式**

## **`line-height`：行高（行与行之间的距离）**

## **`white-space`：元素内的空白（空格、回车换行符）怎样处理**

- normal 默认。空白会被浏览器忽略。
- pre 空白会被浏览器保留。其行为方式类似 HTML 中的 `<pre>` 标签。
- nowrap 文本不会换行，文本会在在同一行上继续，直到遇到 `<br>` 标签为止。
- pre-wrap 保留空白符序列，但是正常地进行换行。（空白符序列即空格）
- pre-line 合并空白符序列，但是保留换行符。
- inherit 规定应该从父元素继承 white-space 属性的值。

- 【其它】
  - pre-wrap 和 pre 的区别就是会自适应容器的边界进行换行

## **`text-overflow`：文本溢出**

- text-clip 修剪文本。
- ellipsis 显示省略符号来代表被修剪的文本。

## **`text-shadow`：文本阴影**

值格式：`h-shadow v-shadow blur color;`

- h-shadow 必需。水平阴影的位置。允许负值。
- v-shadow 必需。垂直阴影的位置。允许负值。
- blur 可选。模糊的距离。
- color 可选。阴影的颜色

## **`text-indent`：首行文本缩进**

- **`letter-spacing`：字母/汉字之间的间隔**

  - 0：正常
  - 正值:有间隔
  - 负值：字母/汉字有重叠

- **`text-decoration`：文本装饰**

  - none 默认。定义标准的文本。
  - underline 定义文本下的一条线。
  - overline 定义文本上的一条线。
  - line-through 定义穿过文本下的一条线。
  - blink 定义闪烁的文本。
  - inherit 规定应该从父元素继承该属性
  - 子属性
    - text-decoration-color // 文本装饰下划线颜色
    - text-decoration-style // 文本装饰线条如何显示
      - solid 默认值。线条将显示为单线。
      - double 线条将显示为双线。
      - dotted 线条将显示为点状线。
      - dashed 线条将显示为虚线。
      - wavy 线条将显示为波浪线。

- **`text-transform`字母大小写**
  - capitalize 文本中的每个单词以大写字母开头。
  - uppercase 定义仅有大写字母。
  - lowercase 定义仅有小写字母。

# 背景： background-

简写：`background: color img repeat attachment position`

- **`background-color`：背景颜色**
  - 若 DOM 元素本身没有设置背景色，那么其使用的背景色是从`离其最近的且设置了背景色的祖先元素`那里继承的。
- **`background-image`：要使用的背景图片**
  把图像设置为背景平铺重复显示，以覆盖整个元素实体.
- **`background-repeat`：设置背景图像是否及如何重复。**

  - repeat 背景图像将向垂直和水平方向重复。默认
  - repeat-x 只有水平位置会重复背景图像
  - repeat-y 只有垂直位置会重复背景图像
  - no-repeat `background-image` 不会重复

- **`background-attachment`：背景图像是否固定或者随着页面的其余部分滚动。**
  - scroll 背景图片随页面的其余部分滚动。这是默认
  - fixed 背景图像是固定的
  - local 背景图片随滚动元素滚动
  - inherit 从父元素继承属性
- **`background-position`：改变图像在背景中的位置:(以左上角为基准)**
  - center center（默认在左上角：left top）
  - 50% 50%（默认在左上角：0% 0%）
  - 长度值
- **`background-origin`：指定 background-position 属性应该是相对位置**

  - padding-box 背景图像填充框的相对位置
  - border-box 背景图像边界框的相对位置
  - content-box 背景图像的相对位置的内容框

- **`background-size`：指定背景图片尺寸。**

  - length 设置背景图片高度和宽度。第一个值设置宽度，第二个值设置的高度。如果只给出一个值，第二个是设置为"auto(自动)"
  - percentage 将计算相对于背景定位区域的百分比。第一个值设置宽度，第二个值设置的高度。如果只给出一个值，第二个是设置为"auto(自动)"
  - cover 此时会保持图像的纵横比并将图像缩放成将完全覆盖背景定位区域的最小大小。
  - contain 此时会保持图像的纵横比并将图像缩放成将适合背景定位区域的最大大小。

- **`background-clip`：属性指定背景绘制区域。**
  - border-box 默认值。背景绘制在 border 内。
  - padding-box 背景绘制在 padding 内。
  - content-box 背景绘制在 content 内。

```css
// 不知道为什么简写`background-size`必须得单独写，写在background后面会报错。
.box {
  background: url(https://i.loli.net/2020/06/26/QEh8aDSv2UZtIGq.jpg) no-repeat
    center center;
  .background-size: cover;
}
```

# 透明度：opacity

0-1：0 是全白，1 是正常

> **如何只改变背景透明度，不改变子元素透明度**

- 如果是颜色：完全可以用背景色透明 rgba 来代替 opacity，
  opacity 这个属性指定的透明是包括里面的元素的，不可能只有外面透明，里面不透明
  `background-color: rgba(0,0,0,0.4)`

# 层叠顺序：z-index

> **规则**

- 首先，z-index 属性值并不是在任何元素上都有效果。==它仅在定位元素（定义了 position 属性，且属性值为非 static 值的元素）上有效果==。

- 判断元素在 Z 轴上的堆叠顺序，不仅仅是直接比较两个元素的 z-index 值的大小，==这个堆叠顺序实际由元素的层叠上下文、层叠等级共同决定==。

> **公式**

- 1、首先先看要比较的两个元素是否处于同一个层叠上下文中：
  - 1.1 如果是，谁的层叠等级大，谁在上面（怎么判断层叠等级大小呢？——看“层叠顺序”图）。
  - 1.2 如果两个元素不在统一层叠上下文中，请先比较他们所处的层叠上下文的层叠等级。
- 2、当两个元素层叠等级相同、层叠顺序相同时，在 DOM 结构中后面的元素层叠等级在前面元素之上。

> **链接**

- [彻底搞懂 CSS 层叠上下文、层叠等级、层叠顺序、z-index](https://juejin.cn/post/6844903667175260174)
- [深入理解 CSS 属性 z-index](https://zhuanlan.zhihu.com/p/33984503)
- [关于 z-index 那些你不知道的事](https://webdesign.tutsplus.com/zh-hans/articles/what-you-may-not-know-about-the-z-index-property--webdesign-16892)

# 鼠标光标类型：cursor

> **属性值**

- auto 默认。浏览器设置的光标（通常是一个箭头）。
- default 默认光标（通常是一个箭头）。
- crosshair 光标呈现为十字线。
- help 带有问号的箭头，指示可用的帮助。
- move 交叉箭头，指示某对象可被移动。
- pointer 光标呈现为指示链接的指针（一只手）。

# 替换元素：object-

> **概念**

- 替换元素：
  其内容不受 CSS 视觉格式化模型控制的元素，比如 image, 嵌入的文档(iframe 之类)或者 applet。比如，img 元素的内容通常会被其 src 属性指定的图像替换掉。替换元素通常有其固有的尺寸：一个固有的宽度，一个固有的高度和一个固有的比率。比如一幅位图有固有用绝对单位指定的宽度和高度，从而也有固有的宽高比率。

> **object-fit**

- **属性值**
  每个属性值的具体含义如下（自己理解的白话文，官方释义见官网）：

  - fill: 中文释义“填充”。默认值。==替换内容拉伸填满整个 content box, 不保证保持原有的比例==。
  - contain: 中文释义“包含”。==保持原有尺寸比例。保证替换内容尺寸一定可以在容器里面放得下。因此，此参数可能会在容器内留下空白==。
  - cover: 中文释义“覆盖”。==保持原有尺寸比例。保证替换内容尺寸一定大于容器尺寸，宽度和高度至少有一个和容器一致==。因此，此参数可能会让替换内容（如图片）部分区域不可见。
  - none: 中文释义“无”。保持原有尺寸比例。同时保持替换内容原始尺寸大小。
  - scale-down: 中文释义“降低”。就好像依次设置了 none 或 contain, 最终呈现的是尺寸比较小的那个。

- **链接**
  - [object-fit 在线 Demo](https://www.zhangxinxu.com/study/201503/css3-object-fit.html)

> **object-position**

object-position 要比 object-fit 单纯的多，就是控制替换内容位置的。默认值是 50% 50%，也就是居中效果，

> **object-position/object-fit 其他应用**

CSS 真是个很奇怪的东西，发明它的目的可能是为了实现 A 效果，结果，为了实现 A 效果所外挂的一些特性往往被用来做其他事情。比方说 float 被大肆用来块状布局，我觉得 object-position/object-fit 也有这种趋势。

上一节提到了水平垂直居中实现，直接一行 CSS 声明就搞定，简单快捷，以后说不定会热。

- **链接**
  - [object-position/object-fit img sprites 与数字翻动效果](https://www.zhangxinxu.com/study/201503/css3-object-fit.html)

> **链接**

- [半深入理解 CSS3 object-position/object-fit 属性](https://www.zhangxinxu.com/wordpress/2015/03/css3-object-position-object-fit/)

# overflow

其设置了元素溢出时所需的行为——即当元素的内容太大而无法适应它的块级格式化上下文时。

- **属性值**

  - visible
    默认值。内容不能被裁减，所以可能渲染到填充框（padding）的外部。
  - hidden
    如果需要，内容将被剪裁以适合填充框（padding）。 不提供滚动条。
  - scroll
    如果需要，内容将被剪裁以适合填充框（padding）。 浏览器显示滚动条，无论是否实际剪切了任何内容。 （这可以防止滚动条在内容更改时出现或消失。）打印机仍可能打印溢出的内容。
  - auto
    取决于用户代理。 如果内容适合填充框（padding）内部，则它看起来与可见内容相同，但仍会建立新的块格式化上下文。 如果内容溢出，桌面浏览器会提供滚动条。

- 常用 auto: 设置元素最大高度，超出高度滚动条显示，`overflow-y`值需要设置成`auto`（浏览器决定），如果设置成`scroll`（总是显示滚动条），则没有超出元素最大高度时也会有滚动条，不美观。

# 单词内断行: word-break

若不设置长数字`123213212421342132142134213232130`这种或者长字母字符串都没法正显示。

- **属性值**
  - break-all 允许在单词内换行。即任意字符间断行，即行尾的单词没有显示完分行显示
  - break-word 即行尾的单词没有显示完就不显示了，留白，下一行再显示。

# 其它

## `user-select` 控制选择文本

`user-select`属性用于控制用户是否可以选择文本。这不会对作为浏览器用户界面（即 chrome）的一部分的内容加载产生任何影响，除非是在文本框中。
