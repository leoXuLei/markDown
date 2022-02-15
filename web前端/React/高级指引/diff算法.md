# React 之 diff 算法

- **定义：**

  > **比对新旧虚拟 DOM 的方式就叫 Diff 算法**
  > (diffrence：即找差异，找这两个新旧 JS 对象的差异)

  > 什么是调和？
  > **将 Virtual DOM 树转换成 actual DOM 树的最少操作的过程 称为调和**

  > 什么是 React diff 算法？
  > **diff 算法是调和的具体实现**

- **作用：**
  > 计算出 Virtual DOM 中真正变化的部分，并只针对该部分进行原生 DOM 操作，而非重新渲染整个页面。

## 传统 diff 算法

**通过循环递归对节点进行依次对比，算法复杂度达到 O(n^3) ，n 是树的节点数**，这个有多可怕呢？——如果要展示 1000 个节点，得执行上亿次比较。。即便是 CPU 快能执行 30 亿条命令，也很难在一秒内计算出差异。

## diff 策略

**React 用 三大策略 将 O(n^3)复杂度 转化为 O(n)复杂度**

- 策略一（tree diff）：
  Web UI 中 DOM 节点跨层级的移动操作特别少，可以忽略不计。

- 策略二（component diff）：
  拥有相同类的两个组件 生成相似的树形结构，
  拥有不同类的两个组件 生成不同的树形结构。

- 策略三（element diff）：
  对于同一层级的一组子节点，通过唯一 id 区分。

### tree diff

（1）React 通过 updateDepth 对 Virtual DOM 树进行层级控制。
（2）**对树分层比较，两棵树只对同一层次节点进行比较。如果该节点不存在时，则该节点及其子节点会被完全删除，不会再进一步比较**。
（3）**只需遍历一次，就能完成整棵 DOM 树的比较**。

![](https://upload-images.jianshu.io/upload_images/5518628-d60043dbeddfce8b.png?imageMogr2/auto-orient/strip|imageView2/2/w/504/format/webp)

- 问题：如果 DOM 节点出现了跨层级操作,diff 会咋办呢？

**diff 只简单考虑同层级的节点位置变换，如果是跨层级的话，只有创建节点和删除节点的操作**。

![](https://upload-images.jianshu.io/upload_images/5518628-41118df156ed8d6e.png?imageMogr2/auto-orient/strip|imageView2/2/w/952/format/webp)

如上图所示，以 A 为根节点的整棵树会被重新创建，而不是移动，因此 官方建议不要进行 DOM 节点跨层级操作，可以通过 CSS 隐藏、显示节点，而不是真正地移除、添加 DOM 节点。

### component diff

React 对不同的组件间的比较，有三种策略

- （1）同一类型的两个组件，按原策略（层级比较）继续比较 Virtual DOM 树即可。

- （2）同一类型的两个组件，组件 A 变化为组件 B 时，可能 Virtual DOM 没有任何变化，**如果知道这点（变换的过程中，Virtual DOM 没有改变）**，可节省大量计算时间，所以 用户 **可以通过 shouldComponentUpdate() 来判断是否需要 判断计算**。

- （3）不同类型的组件，将一个（将被改变的）组件判断为 dirty component（脏组件），从而替换整个组件的所有节点。

注意：如果组件 D 和组件 G 的结构相似，但是 React 判断是**不同类型的组件，则不会比较其结构，而是删除 组件 D 及其子节点，创建组件 G 及其子节点**。

### element diff

当节点处于同一层级时，diff 提供三种节点操作：删除、插入、移动。

- **插入：** 组件 C 不在集合（A,B）中，需要插入

- **删除：**

  - （1）组件 D 在集合（A,B,D）中，但 D 的节点已经更改，不能复用和更新，所以需要删除 旧的 D ，再创建新的。

  - （2）组件 D 之前在 集合（A,B,D）中，但集合变成新的集合（A,B）了，D 就需要被删除。

- **移动：**
  组件 D 已经在集合（A,B,C,D）里了，且集合更新时，D 没有发生更新，只是位置改变，如新集合（A,D,B,C），D 在第二个，无须像传统 diff，让旧集合的第二个 B 和新集合的第二个 D 比较，并且删除第二个位置的 B，再在第二个位置插入 D，而是 （对同一层级的同组子节点） **添加唯一 key 进行区分，移动即可**。

#### 移动的逻辑

##### 情形一

**新旧集合中存在相同节点但位置不同时，如何移动节点**

![](https://upload-images.jianshu.io/upload_images/5518628-89bb3cd6ebdb4296.png?imageMogr2/auto-orient/strip|imageView2/2/w/642/format/webp)

（1）看着上图的 B，React 先从新中取得 B，然后判断旧中是否存在相同节点 B，当发现存在节点 B 后，就去判断是否移动 B。

B 在旧 中的 index=1，它的 lastIndex=0，**不满足 index < lastIndex 的条件，因此 B 不做移动操作**。此时，一个操作是，**lastIndex=(index,lastIndex)中的较大数**=1。

注意：lastIndex 有点像浮标，或者说是一个 map 的索引，一开始默认值是 0，**它会与 map 中的元素进行比较，比较完后，会改变自己的值的（取 index 和 lastIndex 的较大数）**。

（2）看着 A，A 在旧的 index=0，此时的 lastIndex=1（因为先前与新的 B 比较过了），满足 index<lastIndex，因此，对 A 进行移动操作，此时 lastIndex=max(index,lastIndex)=1。

（3）看着 D，同（1），不移动，由于 D 在旧的 index=3，比较时，lastIndex=1，所以改变 lastIndex=max(index,lastIndex)=3

（4）看着 C，同（2），移动，C 在旧的 index=2，满足 index<lastIndex（lastIndex=3），所以移动。

由于 C 已经是最后一个节点，所以 diff 操作结束。

##### 情形二

**新集合中有新加入的节点，旧集合中有删除的节点**

![](https://upload-images.jianshu.io/upload_images/5518628-eb7ef5477ea1a678.png?imageMogr2/auto-orient/strip|imageView2/2/w/601/format/webp)

（1）B 不移动，不赘述，更新 lastIndex=1

（2）新集合取得 E，发现旧不存在，故在 lastIndex=1 的位置 创建 E，更新 lastIndex=1

（3）新集合取得 C，C 不移动，更新 lastIndex=2

（4）新集合取得 A，A 移动，同上，更新 lastIndex=2

（5）新集合对比后，再对旧集合遍历。判断 新集合 没有，但 旧集合 有的元素（如 D，新集合没有，旧集合有），发现 D，删除 D，diff 操作结束。

## diff 的不足与待优化的地方

![](https://upload-images.jianshu.io/upload_images/5518628-aea2bb7e8e843db6.png?imageMogr2/auto-orient/strip|imageView2/2/w/636/format/webp)

看图的 D，此时 D 不移动，但它的 index 是最大的，导致更新 lastIndex=3，从而使得其他元素 A,B,C 的 index<lastIndex，导致 A,B,C 都要去移动。

理想情况是只移动 D，不移动 A,B,C。因此，在开发过程中，**尽量减少类似将最后一个节点移动到列表首部的操作，当节点数量过大或更新操作过于频繁时，会影响 React 的渲染性能**。

## 问题
- 虚拟DOM相比DOM的优势
  - 操作 DOM 太慢，操作 Virtual DOM 对象快
  - 使用 Virtual DOM 可以避免频繁操作 DOM ，能有效减少回流和重绘次数（如果有的话）
  - 有 diff 算法，可以减少没必要的 DOM 操作
  - 跨平台优势，只要有 JS 引擎就能运行在任何地方（Weex/SSR）

[Virtual DOM 认知误区](https://mp.weixin.qq.com/s/Pa26ZlDWaXTlsgmIMv60ug)
## 参考

- [React 之 diff 算法](https://www.jianshu.com/p/3ba0822018cf)
- [React 之 diff 算法](https://blog.csdn.net/weixin_43718291/article/details/103357461)


# Diffing 算法[官网]

当对比两颗树时，React 首先比较两棵树的根节点。不同类型的根节点元素会有不同的形态。

## 比对不同类型的元素
==当根节点为不同类型的元素时，React 会拆卸原有的树并且建立起新的树==。举个例子，当一个元素从 `<a> 变成 <img>，从 <Article> 变成 <Comment>，或从 <Button> 变成 <div> 都会触发一个完整的重建流程`。

当拆卸一棵树时，对应的 DOM 节点也会被销毁。组件实例将执行 componentWillUnmount() 方法。当建立一棵新的树时，对应的 DOM 节点会被创建以及插入到 DOM 中。组件实例将执行 componentWillMount() 方法，紧接着 componentDidMount() 方法。所有跟之前的树所关联的 state 也会被销毁。

==在根节点以下的组件也会被卸载，它们的状态会被销毁==。比如，当比对以下更变时：

```js
<div>
  <Counter />
</div>

<span>
  <Counter />
</span>
```

React 会销毁 Counter 组件并且重新装载一个新的组件。

## 比对同一类型的元素
==当比对两个相同类型的 React 元素时，React 会保留 DOM 节点，仅比对及更新有改变的属性==。比如：

```js
<div className="before" title="stuff" />

<div className="after" title="stuff" />
```

通过比对这两个元素，React 知道只需要修改 DOM 元素上的 className 属性。

当更新 style 属性时，React 仅更新有所更变的属性。比如：

```js
<div style={{color: 'red', fontWeight: 'bold'}} />
<div style={{color: 'green', fontWeight: 'bold'}} />
```

通过比对这两个元素，React 知道只需要修改 DOM 元素上的 color 样式，无需修改 fontWeight。

在处理完当前节点之后，React 继续对子节点进行递归。

## 比对同类型的组件元素

当一个组件更新时，组件实例保持不变，这样 state 在跨越不同的渲染时保持一致。React 将更新该组件实例的 props 以跟最新的元素保持一致，并且调用该实例的 componentWillReceiveProps() 和 componentWillUpdate() 方法。

下一步，调用 render() 方法，diff 算法将在之前的结果以及新的结果中进行递归。

## 对子节点进行递归
在默认条件下，当递归 DOM 节点的子元素时，React 会同时遍历两个子元素的列表；当产生差异时，生成一个 mutation。

在子元素列表末尾新增元素时，更变开销比较小。比如：

```js
<ul>
  <li>first</li>
  <li>second</li>
</ul>

<ul>
  <li>first</li>
  <li>second</li>
  <li>third</li>
</ul>
```

React 会先匹配两个 <li>first</li> 对应的树，然后匹配第二个元素 <li>second</li> 对应的树，最后插入第三个元素的 <li>third</li> 树。

如果简单实现的话，那么在列表头部插入会很影响性能，那么更变开销会比较大。比如：

```js
<ul>
  <li>Duke</li>
  <li>Villanova</li>
</ul>

<ul>
  <li>Connecticut</li>
  <li>Duke</li>
  <li>Villanova</li>
</ul>
```

React 会针对每个子元素 mutate 而不是保持相同的 <li>Duke</li> 和 <li>Villanova</li> 子树完成。这种情况下的低效可能会带来性能问题。

## Keys
为了解决以上问题，React 支持 key 属性。当子元素拥有 key 时，React 使用 key 来匹配原有树上的子元素以及最新树上的子元素。以下例子在新增 key 之后使得之前的低效转换变得高效：

```js
<ul>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>

<ul>
  <li key="2014">Connecticut</li>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>
```

现在 React 知道只有带着 '2014' key 的元素是新元素，带着 '2015' 以及 '2016' key 的元素仅仅移动了。

现实场景中，产生一个 key 并不困难。你要展现的元素可能已经有了一个唯一 ID，于是 key 可以直接从你的数据中提取：

```js
<li key={item.id}>{item.name}</li>
```

当以上情况不成立时，你可以新增一个 ID 字段到你的模型中，或者利用一部分内容作为哈希值来生成一个 key。==这个 key 不需要全局唯一，但在列表中需要保持唯一==。

最后，你也可以使用元素在数组中的下标作为 key。这个策略在元素不进行重新排序时比较合适，但一旦有顺序修改，diff 就会变得慢。

当基于下标的组件进行重新排序时，组件 state 可能会遇到一些问题。由于组件实例是基于它们的 key 来决定是否更新以及复用，如果 key 是一个下标，那么修改顺序时会修改当前的 key，导致非受控组件的 state（比如输入框）可能相互篡改导致无法预期的变动。