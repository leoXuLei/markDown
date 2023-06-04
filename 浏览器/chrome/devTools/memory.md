`chrome-三点-更多工具-性能监视器`可以实时展示 JS 堆大小、DOM 节点、CPU 使用情况。

# B 站视频介绍内存泄漏

- 【内存泄漏常见情形】

  - 1.全局变量
  - 2.存在分离的 DOM 节点
    - DOM 节点回收要满足两点：节点从 DOM 树中被移除，并且代码中没有对它的引用。**内存泄漏发生在 DOM 节点被删除了，但是代码中留存着对它的 JS 引用，我们称这种为分离的 DOM 节点**。
  - 3.闭包
    - 因为函数实例上的隐式指针会留存实例创建环境下的作用域对象，闭包会带来内存占用，但不一定造成内存泄漏，**不合理的内存占用才被定性为内存泄漏**。
  - 4.控制台打印

- 【chrome 开发者工具排查内存泄漏问题流程/思路】
  - 一般先在`Performance面板`录制内存占用随时间变化的图像，对`是否存在内存泄漏`先有个直观的判断。然后再在`Memory面板`定位问题发生的位置。
  - [1-1]首先进入`Performance面板`，勾选上方的`Memory`（Show memory timeline：显示内存时间轴）。其旁边的垃圾桶图标（Collect garbage），作用是`手动强制垃圾回收（GC）`，JS 运行时，垃圾回收的时机是引擎自动控制的，代码无法触发，为了让调试结果有说服力和可信度，适当的时候可以点击该图标，强制触发垃圾回收。**可以刷新页面+强制垃圾回收，从一个干净的状态开始**。（？在每次开始前和结束前都要点击垃圾回收）
  - [1-2]点击左上角的`录制图标`（Record），然后进行页面操作，最后再执行一次 GC，再停止录制，稍等片刻即可获得分析图像，`蓝色线条即为JS堆内存占用的变化趋势`。若观察到每次操作 JS 堆内存走势一直在上升却下降很少，就能基本确定操作存在内存泄漏。
  - [2-1]为了定位问题位置，跳转到`Memory`面板，首先看到面板中部有一个实时变化的数字，他是`JS堆内存的实时占用量`。刷新页面+强制垃圾回收，让内存占用恢复成初始值，`Memory`面板可以对堆内存拍摄快照，还可以在时间线上观察内存的分配情况，我们可以在两次堆快照间执行可疑操作，然后对比内存中对象的变化情况，
  - [2-2]选择第一项`Heap snapshot`（堆快照），点击 `Take snapshot`，堆快照在拍摄前会自动执行强制垃圾回收，可以看到内存中的对象在`Summary`视图下按类型也就是构造器分类，括号（）中的构造器和引擎实现的细节相关，开发者可以先忽略它们，执行可疑操作后，再执行快照拍摄，发现内存占用增加了 xxM，
    - 在快照 2 的`Summary`视图下的右侧选择`Objects allocated between Snapshot1 and Snapshot2`（过滤显示出在快照 1 和快照 2 拍摄点之间创建的对象）。
    - 此外，还可以切换到快照 2 的`Comparison`视图，并和快照 1 对比，界面将显示出两次快照的内存增减情况，我们发现两次快照新增的对象中，数组类型和 largeObj 类型的留存大小，它们的数值和占比都很大，
    - 点击 largeObj 的箭头，选中一个实例对象，可以在下方的`Retainers`中看到该对象是数组的第 0 个元素，并且数组被全局变量 X 引用着。
  - [2-3]为了定位内存分配在代码中的位置，可以借助`Memory`面板的另外一个功能，首先清空调试，选中第二项`Allocation instrumentation on timeline`（时间轴上的分配插桩），并勾选`Record allocation stacks(extra performance overhead)`（ 录制各项分配的堆栈轨迹（会产生额外的性能开销））
    - 刷新页面，点击左上角圆点，开始检测内存分配，然后进行可疑操作，然后再手动回收一次 GC，然后停止检测，可以发现面板上出现蓝色竖条，表示该时刻分配了内存，如果内存后续被回收则会变成灰色，当停止检测后，那些任然保持蓝色的竖条，表示截止到检测停止时，当时分配的内存任然没有被回收，那么这个功能可以让我们看到`内存分配和回收的时机以及频率`，垃圾回收太频繁也可能带来问题，因为垃圾回收器执行时，JS 主线程是会暂停的，这可能导致交互的卡顿，可以点击竖条，观察该时刻附近的一小段区间，下方构造器给出选中区间段内分配的对象类型，同样我们锁定到了 LargeObj 和 Array，选中一个 LargeObj 实例，下面除了可以看到`Retainers`，还可以看到分配栈：`Allocation stack`并可以去到代码的位置，
- 【全局变量】
- 【游离的 DOM 节点】这种情况可以使用堆快照进行排查，

  - 刷新页面来到`Memory`面板，选择堆快照`Heap snapshot`，点击`Take snapshot`，进行可疑操作，再次拍摄快照，默认选中快照 2，堆快照可以直接告诉我们是否存在分离的 DOM 节点，只需要在顶部的过滤框中输入`Detached`。如果过滤出东西，说明存在分离的 DOM 节点，对于上例，改进的方法是把 list 的赋值放在点击事件的回调中，这样当回调函数返回后，局部变量会被销毁。分离的 DOM 节点造成的内存泄漏可能出人意料，例如 Table 元素，如果代码中存在对某个单元格 td 引用，则会导致整个 Table 元素无法被回收，因为每个 DOM 节点都存在对其父元素的引用，通过 td 最终可以访达上层的 Table 元素。

- 【闭包】
  - 在 devTools 中观察内存分配，选择第二项`Allocation instrumentation on timeline`，刷新页面，强制回收，点击底部的`Start`，进行可疑操作，再强制回收一次，然后停止记录，点击第二个蓝条，发现构造器中出现了`system/Context`，这表示存在函数导致的闭包留存，展开箭头，点击第一个实例，它其实就是我们说的作用域对象，在`Retainers`中看到，它是 inner 函数留存的一个上下文对象，inner 后面的一对括号()表示 inner 是一个函数，然后下一行向右缩进，表示 inner 这个函数实例在数组中下标为 1 的位置上，而这个数组被全局变量 funcs 引用。这里有个小建议：代码中尽量不要使用匿名函数，这样调试工具中才会出现函数名，如果是匿名函数，那么只会出现一对括号，给调试带来不便。
  - 另外，`setInterval`的回调函数，以及其它的 DOM 事件监听器函数，也是利用闭包机制访问外层作用域中的变量，在不需要的时候记得 clearInterval 解除事件绑定。

# Chrome devTools

## memory

### 性能分析

- `Select profiling type`：选择性能分析类型
- `Heap snapshot`：堆快照
  - 堆快照性能分析会显示您网页的 JS 对象和相关 DOM 节点中的内存分配情况。
  - [ ] `Include numerical values in capture`
- `Allocation instrumentation on timeline`：时间轴上的分配插桩
  - 分配时间轴显示了插桩的 JS 内存分配随时间变化的情况。记录分析后，您可选择一个时间间隔，以查看已在其中分配且到录制结束时仍保持活跃状态的对象。使用此分析类型隔离内存泄漏。
  - [ ] `Record stack traces of allocations(extra performance overhead)`：录制各项分配的堆栈轨迹（会产生额外的性能开销）
- `Allocation sampling`：分配采样
  - 采用采样方法录制内存分配情况，此性能分析类型的性能开销最低，可用于长时间运行的操作。此工具能非常可靠地估计分配情况，并按 JS 执行堆栈细分结果。

### 术语解释

- `Heap snapshot`：堆快照
- `Retainers`：保留器
- `Summary`: 摘要视图
- `Comparison`: 对比视图，与其他快照对比，看增、删、Delta 数量及内存大小
  - 【顶部】
  - `constructor`：构造函数
  - `New`：新对象数
  - Deleted：已删除#项
  - Delta：#增量
  - `Alloc.Size`: 分配大小，新分配的内存
  - `Freed Size`: 已释放的大小，释放的内存
  - `Size Delta`：大小增量
  - 【底部】
  - `Distance`: 当前对象到根的引用层级距离
  - `Shallow Size`: 浅层大小，对象本身占用的内存
  - `Retained Size`: 保留的大小，`对象本身及其引用`总共占用的内存
- `Containment`: 俯瞰视图，自顶向下看堆的情况，根节点包括 window 对象，GC root 原生对象等

- 列头

- 其他
  - `detached`：分离的、游离的
  - `User object reachable from window`：可通过窗口访问的用户对象
  - `Detached from DOM tree`：

## 注意事项

- 重新编译/重启 chrome/刷新浏览器，都可能对内存占用产生影响。所以可以在本机自测内存泄漏时统一下拍摄快照前的操作：不重新编译，chrome 没崩溃就不重开，也不点刷新，（如果重新编译后先操作一遍后再开始拍摄快照）。

- 尽量不用本地开发编译实时预览模式，而是用打包后的文件去测，可能可以排除在开发模式下给内存分析带来的一些影响。

## 其它

- 内存泄漏问题的复现最开始是在 10 楼拍摄的快照，然后下载，然后再本机加载分析，但是这样看不到来源， 只有自己本地跑，本次快照才能看出来问题出自哪里？（比如依赖库）
- 【问 chatGpt: chrome Memory 面板，拍出来的堆快照中的 retainer 是什么，要怎么来分析】

回答如下：

> 在 Chrome Memory 面板中拍摄内存堆快照后，可以通过查看 retainer（保留器）信息来了解对象在内存中的引用情况。retainer 是指直接或间接地持有某个对象的其他对象，也就是该对象的引用者。
>
> 分析 retainer 可以帮助我们找到造成内存泄漏或者不必要的内存占用的根本原因，下面是一些关于如何分析 retainer 的建议：
>
> 1. 找到一个占用内存较大的对象，点击它并选择 "Retainers"（保留器）视图，查看所有直接或间接引用该对象的其他对象。
> 2. 找到占用内存较大的 retainer 对象，再次点击它并选择 "Retainers" 视图，查看所有直接或间接引用该对象的其他对象，重复这个过程直到找到引用链的顶部。
> 3. 根据引用链的信息，定位并修复问题代码，比如移除不必要的引用、优化内存使用等等。
> 4. 在搜索框中输入 "@@" 或者 "#", 可以快速筛选出占用内存较大的对象，方便进行分析。

# 实例

## webClient 新建批次批次运行跑长期漏内存

### 已知的 antd 下的 rc-picker 内存泄漏问题

除了要手动改本项目下的`var scrollIds = new Map();`代码外，位置是`D:\Users\gitlabProjects\vxbatch-web-client\node_modules\rc-picker\es\utils\uiUtil.js`。

还需要改如下地址下的源码（看 antd 依赖版本，确定 rc-picker 依赖版本，在`D:\yarn_cache\v6\`下找到该版本的 rc-picker 依赖，）不然后面每次 yarn 都会覆盖修改过的`var scrollIds = new WeakMap();`。
`D:\yarn_cache\v6\npm-rc-picker-2.5.19-73d07546fac3992f0bfabf2789654acada39e46f-integrity\node_modules\rc-picker\es\utils\uiUtil.js`。

`yarn config`命令查看到`cache-folder`目录为`D:\\yarn_cache`。

# 参考资料

- [前端内存优化知多少？内存泄露只是冰山一角](https://juejin.cn/post/7197025946918502456)
- [使用 chrome 工具进行内存泄漏排查](https://segmentfault.com/a/1190000039886452)
- [前端性能监控实践（二）chrome devtools](https://juejin.cn/post/6844904094033788941)
- [使用 chrome 的 devtools 查找内存溢出问题](https://juejin.cn/post/7054545859065118756)
- [Chrome 控制台使用手册专栏【九】Memory Panel](https://juejin.cn/post/7064778114177433636)
- [使用 chrome-devtools Memory 面板](https://zhuanlan.zhihu.com/p/80792297?utm_source=wechat_session&utm_medium=social&s_r=0)
