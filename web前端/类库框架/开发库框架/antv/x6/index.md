## X6 设置 scroll 滚动条后页面崩溃

**【问题描述】**

`Uncaught DOMException: Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.`

chrome 控制台报错如下：

```js
// const umijs =  http://localhost:8001/batch-sfc/umi.js
react-dom.development.js:7591 Uncaught DOMException: Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.
    at insertBefore (umijs:277023:18)
    at insertOrAppendPlacementNode (umijs:289807:7)
    at insertOrAppendPlacementNode (umijs:289815:7)
    at commitPlacement (umijs:289768:5)
    at commitMutationEffects (umijs:292180:11)
    at HTMLUnknownElement.callCallback (umijs:269620:14)
    at Object.invokeGuardedCallbackDev (umijs:269669:16)
    at invokeGuardedCallback (umijs:269724:31)
    at commitRootImpl (umijs:291941:9)
    at unstable_runWithPriority (umijs:301323:16)
    at runWithPriority$1 (umijs:280471:10)
    at commitRoot (umijs:291813:3)
    at finishSyncRender (umijs:291239:3)
    at performSyncWorkOnRoot (umijs:291225:7)
    at umijs:280521:24
    at unstable_runWithPriority (umijs:301323:16)
    at runWithPriority$1 (umijs:280471:10)
    at flushSyncCallbackQueueImpl (umijs:280516:7)
    at flushSyncCallbackQueue (umijs:280504:3)
    at scheduleUpdateOnFiber (umijs:290631:9)
    at dispatchAction (umijs:285092:5)
    at ResizeObserver.<anonymous> (umijs:307404:7)
```

页面报错页如下：

```tsx
ResizeObserver.<anonymous>
./src/hooks/useNode.tsx:39


  36 |     }, {});
  37 |     console.log('ResizeObserver :>> _obj :>> ', _obj);
  38 |     _refElemnt.current = _obj;
> 39 |     _setV(Date.now());
     | ^  40 |   });
  41 | }, []);
  42 | const ref: _setNodeFunc = node => {
```

**【父组件和画布子组件代码结构】**

```tsx
const SFCEditor: FC<SFCEditorPropsOmit> = (props) => {
  const [rendered, setRendered] = useState(false);
  const _graphRef = useRef<Graph>(null as any);
  const _sfcInfo = useRef<RootInfo>(null as any);

  // 画布组件<EditorGraphView /> 异步渲染完成后会触发_renderWatch回调函数，传入画布实例和sfc数据。
  // 然后`setRendered(status);`，会开始渲染props.children即：SFC 区域的按钮操作组。
  const _renderWatch = useCallback(
    (status, graph, sfcInfo) => {
      if (status !== rendered) {
        setRendered(status);
      }
      _graphRef.current = graph;
      _sfcInfo.current = sfcInfo;
    },
    [rendered]
  );

  useEffect(() => {
    return () => {
      _graphRef.current = null as any;
      _sfcInfo.current = null as any;
    };
  }, []);
  return (
    <>
      {rendered
        ? props.children
          ? props.children(_graphRef.current, _sfcInfo.current)
          : ""
        : ""}
      <EditorGraphView {...props} rendered={_renderWatch} />
    </>
  );
};

export default SFCEditor;
```

**【分析过程】**

- 1.由于页面报错页显示`./src/hooks/useNode.tsx:39`，便认为是 useNode 自定义 Hook 的问题，但是通过注释 useNode，发现页面奔溃报错不变，于是排除 useNode 的问题。
- 2.由于是加了设置 scroll 滚动条的配置才出现的奔溃报错，猜测是新增的 scroll 配置与已有的 Graph 配置出现冲突，于是控制变量，依次把之前就存在的配置（如`graphRef.current.xx()`）注释，看跟哪个已有配置冲突。发现如下：

  - 2.1 注释掉`graphRef.current.setAsync(true);`后，发现页面奔溃和报错消失，**scroll 滚动条功能正常，但是 SFC 区域的按钮操作组没有渲染出来**。这个配置的意思是设置画布为异步渲染。于是猜测：设置 scroll 滚动条的配置后会导致画布渲染变成同步的。果然如下代码，在`graphRef.current.on("render:done")`异步渲染完成的回调中打印，发现并没有打印，也就是没有走异步渲染。

  ```tsx
  console.log("graphRef.current.isAsync() :>> ", graphRef.current.isAsync());
  // graphRef.current.setAsync(true);
  graphRef.current.disableMouseWheel();
  graphRef.current.cleanSelection();
  graphRef.current.on("render:done", (some) => {
    // if (renderRef.current === true) return;
    // if (renderDone === true) return;
    console.log("render:done :>> some :>> ", some);

    setRenderDone(true);

    const toBeSelectedNodeId = sfcDataStore.current?.toBeSelectedNodeId;
    // 如果有需要自动选中的节点则设置选中
    if (toBeSelectedNodeId) {
      graphRef.current.resetSelection(toBeSelectedNodeId);
      setCurSelected(toBeSelectedNodeId);
      // 选中后清空
      sfcDataStore.current.setToBeSelectedNodeId(null);
    }
  });
  ```

  - 2.2 恢复`graphRef.current.setAsync(true);`后，发现页面依旧奔溃和报错，在`graphRef.current.on("render:done")`异步渲染完成的回调中注释掉` setRenderDone(true);`，发现**scroll 滚动条功能正常，但是 SFC 区域的按钮操作组没有渲染出来**，`graphRef.current.on("render:done")`异步渲染完成的回调也走了，那这说明`已有的画布异步渲染逻辑`即使再加上新的 scroll 滚动条配置，也是能正确显示滚动条的，且页面不奔溃不报错。那就跟异步渲染完成的回调中的`setRenderDone(true);`有关了。
    `setRenderDone(true);`是 setState 更新一个 state 状态，然后触发【父组件和画布子组件代码结构】中描述的父组件里的回调函数，然后开始渲染`SFC 区域的按钮操作组`。
    猜测如下：
    （1）画布子组件画布渲染完成后，在渲染完成的回调`graphRef.current.on("render:done")`中执行`setRenderDone(true);`即更新画布子组件 state，
    （2）renderDone 状态发生改变，画布子组件重新 render 后，执行监听 renderDone 的 useEffect，从中触发父组件的渲染完成监听函数`_renderWatch`开始渲染 SFC 区域的按钮操作组（通过执行 props.children()来渲染）。
    （3）但是由于{props.children()}在父组件 return jsx 中的位置在画布子组件`<EditorGraphView />`上方。导致 react 渲染子组件 jsx 时候出现了`Uncaught DOMException: Failed to execute 'insertBefore' on 'Node'`。可能是虚拟 DOM 比对时的发生了错误。具体原因未知？

**【尝试解决】**
期间试过如下解决方法，但都失败。

- 1. 在渲染完成的回调`graphRef.current.on("render:done")`中执行`rendered?.(true, graphRef.current, sfcInfo.current)`;
- 2. 渲染完成的回调`graphRef.current.on("render:done")`中将`setRenderDone(true);`和自动选中逻辑都放在 setTimeOut 中。
- 3. 尝试修改异步渲染的画布的冻结状态

  ```tsx
  graphRef.current.on("render:done", (some) => {
    if (graphRef.current.isFrozen()) {
      graphRef.current.unfreeze?.({
        before: (graph) => {
          setRenderDone(true);
          const toBeSelectedNodeId = sfcDataStore.current?.toBeSelectedNodeId;
          // 如果有需要自动选中的节点则设置选中
          if (toBeSelectedNodeId) {
            // graphRef.current.resetSelection(toBeSelectedNodeId);
            graph.resetSelection(toBeSelectedNodeId);
            setCurSelected(toBeSelectedNodeId);
            // 选中后清空
            sfcDataStore.current.setToBeSelectedNodeId(null);
          }
        },
      });
    }
  });
  ```

**【解决方法】**
CB 尝试调整父组件 return 中子组件的先后顺序。问题解决。

```tsx
const SFCEditor: FC<SFCEditorPropsOmit> = (props) => {
  // xxx

  // <EditorGraphView />移到props.children前面，问题解决。
  return (
    <>
      <EditorGraphView {...props} rendered={_renderWatch} />
      {rendered
        ? props.children
          ? props.children(_graphRef.current, _sfcInfo.current)
          : ""
        : ""}
    </>
  );
};

export default SFCEditor;
```

## X6 设置 scroll 滚动条后画布与视口偏移异常

**【问题描述】**

antv/X6 设置 scroll 滚动条后页面正常，按钮操作组也正常，但是画布偏移有问题：第一次进工序-sfc，默认是选中 recipe 根节点，能够发现类`·x6-graph`元素`{ top: 0, left: 565px }`，再选中到 unit 节点，能够发现类`·x6-graph`元素`{ top: 669px, left: 565px }`，再选中到 operation 节点，类`·x6-graph`元素的 top 和 left 没有变了，再选中 recipe 根节点，能够发现类`·x6-graph`元素`{ top: 669px, left: 565px }`。

此时再选中到 Phase 节点，即会彻底卸载画布组件，然后再来回的切换前三层级节点，会发现`·x6-graph`元素的 top 和 left 一直为 0，不再改变，`{ top: 0, left: 0 }`。

详细记录如下：

- 第一次进入工序页面-SFC-选中 Recipe 根节点：

  ```css
  .x6-graph-scroller x6-graph-scroller-pannable
  { width: 1073px, height: 777px }

  .x6-graph-scroller-content
  { width: 1938px, height: 304px }

  <!-- 565 + 1373 = 1938px -->
  .x6-graph
  { width: 1373px, height: 304px, left: 565px, top: 0 }
  ```

- 然后选中 Unit 节点：

  ```css
  .x6-graph-scroller x6-graph-scroller-pannable
  { width: 1073px, height: 777px }

  .x6-graph-scroller-content
  { width: 2203px, height: 2368px }

  <!-- 565 + 1373 = 1938px -->
  <!-- 669 + 1030px = 1699px  !== 上面的height -->
  .x6-graph
  { width: 1373px, height: 1030px, left: 565px, top: 669px }
  ```

- 切换到 Phase 节点即卸载，然后再选中 Recipe 节点：

  ```css
  .x6-graph-scroller x6-graph-scroller-pannable
  { width: 1073px, height: 777px }

  .x6-graph-scroller-content
  { width: 1073px, height: 769px }

  .x6-graph
  { width: 1073px, height: 304px, left: 0, top: 0 }
  ```

**【解决思路】**

在如下代码区域，多次测试`graphRef.current?.setScrollbarPosition(0, 0)`，即设置滚动条的位置，但是都没有解决。

```tsx
// EditorGraphView.tsx

// 获取滚动位置
const position = graphRef.current?.translate() || { tx: 0, ty: 0 };

// 获取滚动条位置
const graphScrollPosition = graphRef.current?.getScrollbarPosition();

// 左侧Tree选择的节点发生改变才还原滚动位置
if (baseKeyChangedRef.current) {
  // 如果画布已滚动,则还原至0
  // if (position.tx !== 0 || position.ty !== 0) {
  //   // 设置画布平移
  //   // graphRef.current?.translate(0, 0);
  // }
  // 上面画布平移好像没用了，先注释

  // 如果滚动条已滚动,则还原至0
  if (graphScrollPosition.left !== 0 || graphScrollPosition.top !== 0) {
    graphRef.current?.setScrollbarPosition(0, 0);
  }
  baseKeyChangedRef.current = false;
}
```

**【解决方法】**
测试几个小时，没有一点思路之后，回到官网文档，发现设置 scroll 滚动条的 api 中有个 padding 设置。设置之后，问题解决。发现不管切换各层节点还是卸载后再挂载，`·x6-graph`元素 left 和 top 都始终为 0。（不知道能不能这么理解：scroll.padding 就是设置`·x6-graph`元素的 left 和 top 的）

官网上的 api（`scroll.padding`） 说明是：设置画布四周的 padding 边距。默认根据 `minVisibleWidth` 和 `minVisibleHeight` 自动计算得到，保证画布滚动时，在宽度和高度方向至少有 `minVisibleWidth` 和 `minVisibleHeight` 大小的画布可见。

```tsx
graphRef.current = new Graph({
  container: containerRef.current,
  scroller: {
    enabled: true,
    autoResize: true, // 不设置为true，sfc程序渲染不出来
    // 是否启用画布平移
    pannable: false,
    minVisibleHeight: size?.height,
    minVisibleWidth: size?.width,

    padding: 0,
  },
  interacting: false,
  selecting: {
    enabled: true,
    multiple: false,
    showNodeSelectionBox: true,
    className: "selecting",
    movable: false,
  },
  mousewheel: {
    enabled: false,
    modifiers: "",
  },
  connecting: {
    allowBlank: true,
  },
  scaling: {
    min: 0.4,
    max: 2,
  },
});
```

### gpt QA

> **【QA1】**

Q：antv/X6 设置 scroll 滚动条后，graphRef.current?.translate() 方法还能使用吗

A：
在启用 X6 画布的滚动条后，可以使用 graphRef.current.translate() 方法来实现手动平移画布，但需要注意参数的含义和计算方式可能有所变化。

在默认情况下，graphRef.current?.translate(dx, dy) 方法将会平移画布（而不是视口）的左上角点（原点），使其相对于视口产生一定的偏移。当启用滚动条后，该方法仍然可以使用，只不过需要根据滚动条状态来计算平移距离。

以下是在启用滚动条后，使用 translate() 方法进行画布平移的示例：

```jsx
import { Graph } from "@antv/x6";

const graph = new Graph({
  container: document.getElementById("x6-container"),
  grid: true,
  scroller: {
    enabled: true,
  },
});

// 在启用滚动条后平移画布
graph.batchUpdate(() => {
  const dx = 200; // 水平方向平移距离
  const dy = 100; // 垂直方向平移距离
  const [tx, ty] = graph.getTranslation(); // 获取当前画布平移量
  const [sx, sy] = graph.getScale(); // 获取当前画布缩放比例

  // 计算出平移后的新坐标位置
  const newTx = tx + dx / sx;
  const newTy = ty + dy / sy;

  // 执行画布平移操作
  graph.translate(newTx, newTy);
});
```

在上述代码中，我们通过调用 translate() 方法来实现画布的平移。需要注意的是，由于启用了滚动条，实际上只有滚动视口产生了移动，因此需要根据当前缩放比例和已有的平移量来计算出新的平移量，并传递给 translate() 方法。

> **【QA2】**

Q: antv/X6 中 graphRef.current?.translate(0, 0); 和 graphRef.current?.setScrollbarPosition(0, 0); 有什么区别

A:
graphRef.current?.translate(0, 0) 和 graphRef.current?.setScrollbarPosition(0, 0) 是两个不同的方法，它们在 X6 中分别用于实现画布平移和设置滚动条位置。

- 1. graphRef.current?.translate(0, 0)

  translate() 方法用于将画布平移指定的距离。其中，第一个参数表示水平方向的平移距离，第二个参数表示垂直方向的平移距离。当传入 (0, 0) 参数时，表示将画布平移回原点（左上角）的位置。

```jsx
const graph = new Graph({
  container: document.getElementById("x6-container"),
  grid: true,
});

// 将画布平移回原点位置
graphRef.current?.translate(0, 0);
```

- 2. graphRef.current?.setScrollbarPosition(0, 0)

  setScrollbarPosition() 方法用于设置滚动条的位置。其中，第一个参数表示水平方向的滚动位置，第二个参数表示垂直方向的滚动位置。当传入 (0, 0) 参数时，表示将滚动条位置设置为最左侧和最顶部。

```jsx
const graph = new Graph({
  container: document.getElementById("x6-container"),
  grid: true,
  scroller: {
    enabled: true,
  },
});

// 设置滚动条位置为最左侧和最顶部
graphRef.current?.setScrollbarPosition(0, 0);
```
