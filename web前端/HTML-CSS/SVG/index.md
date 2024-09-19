# 路径

如上一章所说，`<path>`元素是 SVG 基本形状中最强大的一个。**你可以用它创建线条，曲线，弧形**等等。

另外，**path 只需要设定很少的点，就可以创建平滑流畅的线条（比如曲线）**。虽然 polyline 元素也能实现类似的效果，但是必须设置大量的点（点越密集，越接近连续，看起来越平滑流畅），并且这种做法不能够放大（放大后，点的离散更明显）。**所以在绘制 SVG 时，对路径的良好理解很重要**。虽然不建议使用 XML 编辑器或文本编辑器创建复杂的路径，但了解它们的工作方式将有助于识别和修复 SVG 中的显示问题。

上一章提到过，**path 元素的形状是通过属性 d 定义的，属性 d 的值是一个“命令 + 参数”的序列**，我们将讲解这些可用的命令，并且展示一些示例。

**每一个命令都用一个关键字母来表示**，比如，**字母“M”表示的是“Move to”命令，当解析器读到这个命令时，它就知道你是打算移动到某个点。跟在命令字母后面的，是你需要移动到的那个点的 x 和 y 轴坐标**。比如移动到 (10,10) 这个点的命令，应该写成“M 10 10”。这一段字符结束后，解析器就会去读下一段命令。**每一个命令都有两种表示方式，一种是用大写字母，表示采用绝对定位。另一种是用小写字母，表示采用相对定位**（例如：从上一个点开始，向上移动 10px，向左移动 7px）。

因为属性 d 采用的是用户坐标系统，所以不需标明单位。在后面的教程中，我们会学到如何让变换路径，以满足更多需求。

## 直线命令

`<path>`元素里有 5 个画直线的命令，顾名思义，**直线命令就是在两个点之间画直线**。首先是“Move to”命令，M，前面已经提到过，它需要两个参数，分别是需要移动到的点的 x 轴和 y 轴的坐标。假设，你的画笔当前位于一个点，在使用 M 命令移动画笔后，只会移动画笔，但不会在两点之间画线。**因为 M 命令仅仅是移动画笔，但不画线。所以 M 命令经常出现在路径的开始处，用来指明从何处开始画**。

```svg
M x y
(or)
m dx dy
```

能够真正画出线的命令有三个（M 命令是移动画笔位置，但是不画线），**最常用的是“Line to”命令，L**，L 需要两个参数，分别是一个点的 x 轴和 y 轴坐标，**L 命令将会在当前位置（L 前面画笔所在的点）和新位置之间画一条线段**。

```svg
L x y
(or)
l dx dy
```

**另外还有两个简写命令，用来绘制水平线和垂直线。H，绘制水平线。V，绘制垂直线**。这两个命令**都只带一个参数，标明在 x 轴或 y 轴移动到的位置，因为它们都只在坐标轴的一个方向上移动**。

```svg
H x
(or)
h dx
V y
(or)
v dy
```

现在我们已经掌握了一些命令，可以开始画一些东西了。先从简单的地方开始，画一个简单的矩形（同样的效果用`<rect/>`元素可以更简单的实现），矩形是由水平线和垂直线组成的，所以这个例子可以很好地展现前面讲的画线的方法。

<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">

  <path d="M 10 10 H 90 V 90 H 10 L 10 10" />

  <!-- Points -->
  <circle cx="10" cy="10" r="2" fill="red"/>
  <circle cx="90" cy="90" r="2" fill="red"/>
  <circle cx="90" cy="10" r="2" fill="red"/>
  <circle cx="10" cy="90" r="2" fill="red"/>

</svg>

最后，我们可以通过一个“闭合路径命令”Z 来简化上面的 path，**Z 命令会从当前点画一条直线到路径的起点，尽管我们不总是需要闭合路径，但是它还是经常被放到路径的最后。另外，Z 命令不用区分大小写**。

```svg
Z
(or)
z
```

所以上面例子里用到的路径，可以简化成这样：

```XML
<path d="M 10 10 H 90 V 90 H 10 Z" fill="transparent" stroke="black"/>
```

<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">

  <path d="M 10 10 H 90 V 90 H 10 Z" fill="transparent" stroke="black"/>

  <!-- Points -->
  <circle cx="10" cy="10" r="2" fill="red"/>
  <circle cx="90" cy="90" r="2" fill="red"/>
  <circle cx="90" cy="10" r="2" fill="red"/>
  <circle cx="10" cy="90" r="2" fill="red"/>

</svg>

你也可以使用这些命令的相对坐标形式来绘制相同的图形，如之前所述，**相对命令使用的是小写字母，它们的参数不是指定一个明确的坐标，而是表示相对于它前面的点需要移动多少距离**。例如前面的示例，画的是一个 80\*80 的正方形，用相对命令可以这样描述：

```XML
<path d="M 10 10 h 80 v 80 h -80 Z" fill="transparent" stroke="black"/>
```

<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">

  <path d="M 10 10 h 80 v 80 h -80 Z" fill="transparent" stroke="purple"/>

  <!-- Points -->
  <circle cx="10" cy="10" r="2" fill="red"/>
  <circle cx="90" cy="90" r="2" fill="red"/>
  <circle cx="90" cy="10" r="2" fill="red"/>
  <circle cx="10" cy="90" r="2" fill="red"/>

</svg>

上述路径是：画笔移动到 (10,10) 点，由此开始，向右移动 80 像素构成一条水平线，然后向下移动 80 像素，然后向左移动 80 像素，然后再回到起点。

你可能会问这些命令有什么用，因为 `<polygon>` 和 `<polyline>` 可以做到画出一样的图形。答案是，这些命令可以做得更多。**如果你只是画直线，那么其他元素可能会更好用，但是，path 却是众多开发者在 SVG 绘制中经常用到的**。据我所知，它们之间不存在性能上的优劣。但是通过脚本生成 path 可能有所不同，因为另外两种方法只需要指明点，而 path 在这方面的语法会更复杂一些。

## 曲线命令

**绘制平滑曲线的命令有三个，其中两个用来绘制贝塞尔曲线，另外一个用来绘制弧形或者说是圆的一部分**。如果你在 Inkscape、Illustrator 或者 Photoshop 中用过路径工具，可能对贝塞尔曲线有一定程度的了解。欲了解贝塞尔曲线的完整数学讲解，请阅读这份 Wikipedia 的文档。在这里不用讲得太多。**贝塞尔曲线的类型有很多，但是在 path 元素里，只存在两种贝塞尔曲线：三次贝塞尔曲线 C，和二次贝塞尔曲线 Q**。

### 贝塞尔曲线

#### 三次贝塞尔曲线 C S

我们从稍微复杂一点的三次贝塞尔曲线 C 入手，**三次贝塞尔曲线需要定义一个点和两个控制点**，所以用 C 命令创建三次贝塞尔曲线，**需要设置三组坐标参数**：

```XML
C x1 y1, x2 y2, x y
(or)
c dx1 dy1, dx2 dy2, dx dy
```

这里的**最后一个坐标 (x,y) 表示的是曲线的终点，另外两个坐标是控制点，(x1,y1) 是起点的控制点，(x2,y2) 是终点的控制点**。如果你熟悉代数或者微积分的话，会更容易理解控制点，**控制点描述的是曲线起始点的斜率**，曲线上各个点的斜率，是从起点斜率到终点斜率的渐变过程。（文字描述不好，维基百科上有图示，更直观。）

<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">

  <path d="M 10 10 C 20 20, 40 20, 50 10" stroke="black" fill="transparent"/>
  <!-- Points -->
  <circle cx="10" cy="10" r="2" fill="red"/>
  <path d="M 10 10 L 20 20" fill="transparent" stroke="red"/>
  <circle cx="20" cy="20" r="2" fill="red"/>
  <circle cx="40" cy="20" r="2" fill="red"/>
  <path d="M 40 20 L 50 10" fill="transparent" stroke="red"/>
  <circle cx="50" cy="10" r="2" fill="red"/>

  <path d="M 70 10 C 70 20, 110 20, 110 10" stroke="black" fill="transparent"/>
  <!-- Points -->
  <circle cx="70" cy="10" r="2" fill="red"/>
  <path d="M 70 10 L 70 20" fill="transparent" stroke="red"/>
  <circle cx="70" cy="20" r="2" fill="red"/>
  <circle cx="110" cy="20" r="2" fill="red"/>
  <path d="M 110 20 L 110 10" fill="transparent" stroke="red"/>
  <circle cx="110" cy="10" r="2" fill="red"/>

  <path d="M 130 10 C 120 20, 180 20, 170 10" stroke="black" fill="transparent"/>
  <!-- Points -->
  <circle cx="130" cy="10" r="2" fill="red"/>
  <path d="M 130 10 L 120 20" fill="transparent" stroke="red"/>
  <circle cx="120" cy="20" r="2" fill="red"/>
  <circle cx="180" cy="20" r="2" fill="red"/>
  <path d="M 180 20 L 170 10" fill="transparent" stroke="red"/>
  <circle cx="170" cy="10" r="2" fill="red"/>

  <path d="M 10 60 C 20 80, 40 80, 50 60" stroke="black" fill="transparent"/>
  <!-- Points -->
  <circle cx="10" cy="60" r="2" fill="red"/>
  <path d="M 10 60 L 20 80" fill="transparent" stroke="red"/>
  <circle cx="20" cy="80" r="2" fill="red"/>
  <circle cx="40" cy="80" r="2" fill="red"/>
  <path d="M 40 80 L 50 60" fill="transparent" stroke="red"/>
  <circle cx="50" cy="60" r="2" fill="red"/>

  <path d="M 70 60 C 70 80, 110 80, 110 60" stroke="black" fill="transparent"/>
  <!-- Points -->
  <circle cx="70" cy="60" r="2" fill="red"/>
  <path d="M 70 60 L 70 80" fill="transparent" stroke="red"/>
  <circle cx="70" cy="80" r="2" fill="red"/>
  <circle cx="110" cy="80" r="2" fill="red"/>
  <path d="M 110 80 L 110 60" fill="transparent" stroke="red"/>
  <circle cx="110" cy="60" r="2" fill="red"/>

  <path d="M 130 60 C 120 80, 180 80, 170 60" stroke="black" fill="transparent"/>
  <!-- Points -->
  <circle cx="130" cy="60" r="2" fill="red"/>
  <path d="M 130 60 L 120 80" fill="transparent" stroke="red"/>
  <circle cx="120" cy="80" r="2" fill="red"/>
  <circle cx="180" cy="80" r="2" fill="red"/>
  <path d="M 180 80 L 170 60" fill="transparent" stroke="red"/>
  <circle cx="170" cy="60" r="2" fill="red"/>

  <path d="M 10 110 C 20 140, 40 140, 50 110" stroke="black" fill="transparent"/>
  <!-- Points -->
  <circle cx="10" cy="110" r="2" fill="red"/>
  <path d="M 10 110 L 20 140" fill="transparent" stroke="red"/>
  <circle cx="20" cy="140" r="2" fill="red"/>
  <circle cx="40" cy="140" r="2" fill="red"/>
  <path d="M 40 140 L 50 110" fill="transparent" stroke="red"/>
  <circle cx="50" cy="110" r="2" fill="red"/>

  <path d="M 70 110 C 70 140, 110 140, 110 110" stroke="black" fill="transparent"/>
  <!-- Points -->
  <circle cx="70" cy="110" r="2" fill="red"/>
  <path d="M 70 110 L 70 140" fill="transparent" stroke="red"/>
  <circle cx="70" cy="140" r="2" fill="red"/>
  <circle cx="110" cy="140" r="2" fill="red"/>
  <path d="M 110 140 L 110 110" fill="transparent" stroke="red"/>
  <circle cx="110" cy="110" r="2" fill="red"/>

  <path d="M 130 110 C 120 140, 180 140, 170 110" stroke="black" fill="transparent"/>
  <!-- Points -->
  <circle cx="130" cy="110" r="2" fill="red"/>
  <path d="M 130 110 L 120 140" fill="transparent" stroke="red"/>
  <circle cx="120" cy="140" r="2" fill="red"/>
  <circle cx="180" cy="140" r="2" fill="red"/>
  <path d="M 180 140 L 170 110" fill="transparent" stroke="red"/>
  <circle cx="170" cy="110" r="2" fill="red"/>

</svg>

上面的例子里，创建了 9 个三次贝塞尔曲线。~~有一点比较遗憾，标记控制点的代码会比较庞大，所以在这里舍弃了。（之前所有点都用 circle 标记，此处一样，只不过没把代码列出来）~~。**如果你想更准确地控制它们，可以自己动手把他们画出来**。**图例上的曲线从左往右看，控制点在水平方向上逐渐分开，图例上的曲线从上往下看，控制点和曲线坐标之间离得越来越远**。这里要注意观察，曲线沿着起点到第一控制点的方向伸出，逐渐弯曲，然后沿着第二控制点到终点的方向结束。

**你可以将若干个贝塞尔曲线连起来，从而创建出一条很长的平滑曲线。通常情况下，一个点某一侧的控制点是它另一侧的控制点的对称（以保持斜率不变）**。这样，你可以使用一个简写的贝塞尔曲线命令 S，如下所示：

```XML
S x2 y2, x y
(or)
s dx2 dy2, dx dy
```

**S 命令可以用来创建与前面一样的贝塞尔曲线，但是，如果 S 命令跟在一个 C 或 S 命令后面，则它的第一个控制点会被假设成前一个命令曲线的第二个控制点的中心对称点。如果 S 命令单独使用，前面没有 C 或 S 命令，那当前点将作为第一个控制点**。下面是 S 命令的语法示例，图中左侧红色标记的点对应的控制点即为蓝色标记点。

<svg width="190" height="160" xmlns="http://www.w3.org/2000/svg">
  <path d="M 10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80" stroke="green" fill="transparent"/>

  <!-- Points -->
  <circle cx="10" cy="80" r="2" fill="red"/>
  <path d="M 10 80 L 40 10" fill="transparent" stroke="red"/>
  <circle cx="40" cy="10" r="2" fill="red"/>
  <circle cx="65" cy="10" r="2" fill="red"/>
  <path d="M 65 10 L 95 80" fill="transparent" stroke="red"/>
  <circle cx="95" cy="80" r="2" fill="red"/>

  <path d="M 95 80 L 125 150" fill="transparent" stroke="blue"/>
  <circle cx="125" cy="150" r="2" fill="blue"/>

  <circle cx="150" cy="150" r="2" fill="red"/>
  <path d="M 150 150 L 180 80" fill="transparent" stroke="red"/>
  <circle cx="180" cy="80" r="2" fill="red"/>
</svg>

#### 二次贝塞尔曲线 Q T

另一种可用的贝塞尔曲线是**二次贝塞尔曲线 Q，它比三次贝塞尔曲线简单，只需要一个控制点，用来确定起点和终点的曲线斜率。因此它需要两组参数，控制点和终点坐标**。

```XML
Q x1 y1, x y
(or)
q dx1 dy1, dx dy
```

（如下，控制点离终点 Y 轴距离越长，圆坡山头越抖）

<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <path d="M 10 80 Q 95 10 180 80" stroke="black" fill="transparent"/>
  <circle cx="10" cy="80" r="2" fill="red"/>
  <path d="M 10 80 L 95 10" fill="transparent" stroke="red"/>
  <circle cx="95" cy="10" r="2" fill="red"/>
  <path d="M 95 10 L 180 80" fill="transparent" stroke="red"/>
  <circle cx="180" cy="80" r="2" fill="red"/>

  <path d="M 10 180 Q 95 80 180 180" stroke="black" fill="transparent"/>
  <circle cx="10" cy="180" r="2" fill="purple"/>
  <path d="M 10 180 L 95 80" fill="transparent" stroke="purple"/>
  <circle cx="95" cy="80" r="2" fill="purple"/>
  <path d="M 95 80 L 180 180" fill="transparent" stroke="purple"/>
  <circle cx="180" cy="180" r="2" fill="purple"/>

  <path d="M 10 280 Q 95 120 180 280" stroke="black" fill="transparent"/>
  <circle cx="10" cy="280" r="2" fill="green"/>
  <path d="M 10 280 L 95 120" fill="transparent" stroke="green"/>
  <circle cx="95" cy="120" r="2" fill="green"/>
  <path d="M 95 120 L 180 280" fill="transparent" stroke="green"/>
  <circle cx="180" cy="280" r="2" fill="green"/>

  <!-- 下面俩个二次贝塞尔曲线，是为了放一起对比的 -->
  <path d="M 10 380 Q 95 220 180 380" stroke="black" fill="transparent"/>
  <circle cx="10" cy="380" r="2" fill="green"/>
  <path d="M 10 380 L 95 220" fill="transparent" stroke="green"/>
  <circle cx="95" cy="220" r="2" fill="green"/>
  <path d="M 95 220 L 180 380" fill="transparent" stroke="green"/>
  <circle cx="180" cy="380" r="2" fill="green"/>

  <path d="M 10 380 Q 145 270 180 380" stroke="#CC3399" fill="transparent"/>
  <circle cx="10" cy="380" r="2" fill="green"/>
  <path d="M 10 380 L 145 270" fill="transparent" stroke="#CC3399"/>
  <circle cx="145" cy="270" r="2" fill="#CC3399"/>
  <path d="M 145 270 L 180 380" fill="transparent" stroke="#CC3399"/>
  <circle cx="180" cy="380" r="2" fill="green"/>
</svg>

**就像三次贝塞尔曲线有一个 S 命令，二次贝塞尔曲线有一个差不多的 T 命令，可以通过更简短的参数，延长二次贝塞尔曲线**。

```XML
T x y
(or)
t dx dy
```

和之前一样，**快捷命令 T 会通过前一个控制点，推断出一个新的控制点。这意味着，在你的第一个控制点后面，可以只定义终点，就创建出一个相当复杂的曲线。需要注意的是，T 命令前面必须是一个 Q 命令，或者是另一个 T 命令，才能达到这种效果。如果 T 单独使用，那么控制点就会被认为和终点是同一个点，所以画出来的将是一条直线**。

<svg width="190" height="160" xmlns="http://www.w3.org/2000/svg">
  <path d="M 10 80 Q 52.5 10, 95 80 T 180 80" stroke="black" fill="transparent"/>

  <circle cx="10" cy="80" r="2" fill="red"/>
  <path d="M 10 80 L 52.5 10" fill="transparent" stroke="red"/>
  <circle cx="52.5" cy="10" r="2" fill="red"/>
  <path d="M 52.5 10 L 95 80" fill="transparent" stroke="red"/>
  <circle cx="95" cy="80" r="2" fill="red"/>

  <path d="M 95 80 L 137.5 150" fill="transparent" stroke="blue"/>
  <circle cx="137.5" cy="150" r="2" fill="blue"/>
  <path d="M 137.5 150 L 180 80" fill="transparent" 
  stroke="blue"/>
  <circle cx="180" cy="80" r="2" fill="red"/>

</svg>

**虽然三次贝塞尔曲线拥有更大的自由度，但是两种曲线能达到的效果总是差不多的。具体使用哪种曲线，通常取决于需求，以及对曲线对称性的依赖程度**。

### 弧形

弧形命令 A 是另一个创建 SVG 曲线的命令。基本上，弧形可以视为圆形或椭圆形的一部分。假设，已知椭圆形的长轴半径和短轴半径，并且已知两个点（在椭圆上），根据半径和两点，可以画出两个椭圆，在每个椭圆上根据两点都可以画出两种弧形。所以，仅仅根据半径和两点，可以画出四种弧形。为了保证创建的弧形唯一，A 命令需要用到比较多的参数：

# 填充和边框

# SVG 实例

## 平行四边形实例

```js
{
    // 图元路径数据，使用 SVG 路径语法表示组件的形状
    pathData: "M360,205 l185.90679,194.00902 h136.09321 l-185.90679,-194.00902 z",
}
```

- `M360,205`：表示起始点坐标为 (360,205)。
- `l185.90679,194.00902`：表示将会在当前位置和新位置之间画一条线段，新位置采用相对定位，x 坐标右移 185.90679，y 坐标下移 194.00902。
- `h136.09321`：表示将在当前位置和新位置之间画一条水平线，新位置为当前位置 x 坐标右移 136.09321。
- `l-185.90679,-194.00902`：表示将会在当前位置和新位置之间画一条线段，新位置采用相对定位，x 坐标左移 185.90679，y 坐标上移 194.00902。
- `z`：表示从当前位置点画一条直线到路径的起点，即 (360,205)

## 矢量扇形图元实例

```js
{
// 图元路径数据，使用 SVG 路径语法表示图元的形状
  pathData: "M795,229.00069l21.9152,119.99931l73.0848,-97.47352c-27.13923,-20.5063 -61.58898,-28.67481 -95,-22.52579z",
},
```

- `M795,229.00069`：表示起始点坐标为 (795,229.00069)。
- `l21.9152,119.99931`：表示将会在当前位置和新位置之间画一条线段，新位置采用相对定位，x 坐标右移 21.9152，y 坐标下移 119.99931。
- `l73.0848,-97.47352`：表示将会在当前位置和新位置之间画一条线段，新位置采用相对定位，x 坐标右移 73.0848，y 坐标上移 97.47352。
- `c-27.13923,-20.5063 -61.58898,-28.67481 -95,-22.52579`：c 代码 curveto 命令，表示使用三次贝塞尔曲线定义路径
