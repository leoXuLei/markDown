# 概念

## 内存生命周期

内存也是有生命周期的，不管什么程序语言，一般可以按顺序分为三个周期：

```text
- 分配期: 分配所需要的内存
- 使用期：使用分配到的内存（读、写）
- 释放期：不需要时将其释放和归还
```

内存分配 -> 内存使用 -> 内存释放。

# 定义

> 在计算机科学中，**内存泄漏指由于疏忽或错误造成程序未能释放已经不再使用的内存**。
> 内存泄漏并非指内存在物理上的消失，而是应用程序分配某段内存后，由于设计错误，
> 导致在释放该段内存之前就失去了对该段内存的控制，从而造成了内存的浪费。

> 内存泄漏：程序中己动态分配的堆内存由于某种原因程序未释放或无法释放引发的各种问题。

> 导致结果：系统变慢，崩溃，延迟大等，轻则影响系统性能，重则导致进程崩溃。

如果内存不需要时，没有经过生命周期的释放期，那么就存在内存泄漏。

内存泄漏简单理解：**无用的内存还在占用，得不到释放和归还。比较严重时，无用的内存会持续递增，从而导致整个系统卡顿，甚至崩溃**。

导致内存泄漏的原因：

- 全局变量
- 滥用闭包
- dom 清空时，还存在引用
- 定时器未清理
- 子元素存在引起的内存泄露

避免策略：

- 减少不必要的全局变量，或者生命周期较长的对象，及时对无用的数据进行垃圾回收；
- 注意程序逻辑，避免“死循环”之类的 ；
- 避免创建过多的对象 原则：不用了的东西要及时归还。
- 减少层级过多的引用

## 原因

# 原因

内存泄漏是大型系统中比较容易出现的问题，原因如下：

- 代码本身没有做好处理
- 相关依赖库没有做好处理
- 浏览器 bug

不过日常开发中，最有可能导致问题的还是我们自身代码没有做好处理，如果是成熟的库，不太可能出现内存问题。

# 分析工具

## 分析定位泄漏点

[链接](https://segmentfault.com/a/1190000020231307)

> 第一步：确定是否是内存泄漏问题

访问上面的代码页面，打开谷歌开发者工具，切换至 Performance 选项，勾选 Memory 选项。

在页面上点击运行按钮，然后在开发者工具上面点击左上角的录制按钮，10 秒后在页面上点击停止按钮，5 秒后停止内存录制。得到的内存走势如下：
![](https://segmentfault.com/img/bVbxaaT)

由上图可知，10 秒之前内存周期性增长，10 后点击了停止按钮，内存平稳，不再递增。

我们可以使用内存走势图判断当前页面是否有内存泄漏。

> 第二步：查找内存泄漏出现的位置

上一步确认是内存泄漏问题后，我们继续利用谷歌开发者工具进行问题查找。

访问上面的代码页面，打开谷歌开发者工具，切换至 Memory 选项。

## 分析定位泄漏点

分析定位泄漏点，一般使用 `Chrome` 的 `memory` 面板来进行分析。

![](https://pic4.zhimg.com/v2-4c5078a459be40a372f968984b81720f_r.jpg)

分析步骤

- 准备
  在分析之前，我们必须要知道在页面做了什么操作以后会导致泄漏，比如点了某个按钮。
  一般我们会有**俩种分析方式**：
  - **录制泄漏前的快照，再录制泄漏后的快照，进行对比找到泄漏原因**
  - **在复现泄漏快照的过程中，使用 timeline 追踪回收时机找到泄漏原因**

一般都是用第二种来判断是否有内存问题，然后用第一种方式来找到内存泄漏的原因。

- 在录制之前，有一点非常重要，录制环境。
  - 避免开发环境的热更新造成的影响，因为 GCRoots 以及 hot_map 缓存的影响，我们在查看引用链时可能会链接到 hot_map 上，所以我们需要打包，然后本地起一个 nginx，进行分析。
  - 避免缓存以及其他浏览器插件的影响，可以使用 Chrome 的无痕模式。
  - 避免无关变量，比如你已经知道是某个弹框中的一个文件控件有问题，那么在录制时，弹框中应该只保留该文件控件。因为其他控件保留着，在后面我们查看快照时会造成干扰。
  - 保持录制期间内存相对较小，最好控制在 80M 之内，太大了的话，录制开销会很大，影响效率。

这里只描述对比分析的步骤。

- 对比分析
  对比分析的步骤如下：
  - 在录制之前先点击左侧面板的垃圾桶按钮，强制清除一次，然后点击 TakeSnapshot 录制一次泄漏前的快照
  - 复现泄漏操作
  - 再点击一次清除按钮
  - 这个时候需要注意，有些变量，比如 dom，在使用完后没有置为 null 的话可能会回收的慢一点，这与浏览器有关，所以可以等几秒再点击。
  - 点击录制按钮，记录泄漏后的快照

如下图：
![](https://pic4.zhimg.com/80/v2-0936dcb3f24bb782c1356345a7faab3b_720w.jpg)

现在我们有俩份快照，点击第二个快照，然后查看方式选择 comparison（对比），一般会去搜索 Detached HTMLDivElement，意思是已分离的 div 元素。因为发生泄漏后，dom 也会因为被泄漏源引用而回收不掉，但因为已经从当前 Document 上删除了，所以是已分离的。选择 Div 是因为 div 一般作为容器元素使用，而且使用频次较多，所以查看该属性会比较方便。
右侧会有一些信息，比如 New、Deleted、Delta 包括内存大小，这些信息主要还是帮助我们判断内存有没有泄漏，如果 Delta（净增）大于 0，那么很有可能发生泄漏了。

将分离的 dom 列表展开以后，可以去查看每一个项，如下图：
![](https://pic1.zhimg.com/80/v2-61f0ab62cfeb64a7bb18539e59385878_720w.jpg)

从上到下是一个引用链，需要注意的是，引用链最下方不一定是问题的核心点，这是因为 GCRoots 导致的，我们需要做的是在这条链上找到有用的信息，主要是以下俩点：

- native_bind()

  - 鼠标放上去会提示函数名，我们可以根据函数名去定位函数位置，需要注意的是该函数不一定是问题源，可以去查看一下该函数有没有问题、该函数的调用上下文，或者该函数是不是被事件所绑定的。如果确认该函数没有问题，我们可以尝试把函数内容给注释掉，然后再录制一遍，看看有没有其他的线索。

- InternalNode
  内部节点，可能是原生事件或者浏览器的一些属性，这个鼠标放上去是不会有提示的，需要编译特殊版本的 Chrome 才可以查看。遇到这个提示，大概可以确定是事件绑定出了问题。

去查看引用链的时候，每一层都可以把鼠标放上去，看看有没有什么提示，比如已分离元素的详情。在定位问题的时候，关注点尽量放在上层。

# 实例

## `sup os`一直切换菜单的长期脚本漏内存问题

`sup os`是通过 `web-view` 在 VF 中打开的。
`sup os` 系统菜单最多三层级。

**【分析步骤】**

1. 一共五六个第一层级，分别测试`刷新且回收垃圾后+打开一级菜单下的所有后代菜单`步骤，发现`用户安全管理`一级菜单内存较大（78M 左右，其它一级菜单测试完都是 18M 左右）。
2. 继续测试`用户安全管理`一级菜单下的二级菜单
3. 分别测试`刷新且回收垃圾后+打开用户安全管理的二级菜单下的所有后代菜单`步骤，发现`用户管理`二级菜单内存较大（47M 左右，其他都是 27M 左右）
   1. 一进来 49.2M，然后 x 掉回到主页，然后点垃圾回收，再次快照为 47.4M
   2. 然后再次打开`用户管理`二级菜单，再次快照为 65.8M

**【思路】**

因此我猜测是`用户安全管理-用户管理`这个嵌套 iframe 页面导致的内存泄漏，于是让测试在脚本中去掉这个二级菜单，再跑一晚上看看内存泄漏情况。

同 LD 描述后，他同我去看，操作：`每次关闭用户管理后再新打开`多次，能够很直观的发现`Sources`面板左侧有多个`Auth`模块增加，每操作一次增加一个，即 x 掉这个二级菜单对应的页面后，应该回收的`Auth`模块资源没有回收，所以依次累加，内存泄漏越来越多。

**【后续】**
让`用户管理`相应的开发去解决重复加载`Auth`模块的问题后，再次测试，虽然还会漏内存，但是情况比提 bug 时好一些了，说明重复加载`Auth`模块确实会造成一些内存泄漏。

# 参考链接

- [深入了解 JavaScript 内存泄露](https://segmentfault.com/a/1190000020231307)
- [前端内存泄漏处理 - 阳叔的文章](https://zhuanlan.zhihu.com/p/408482908)
