# 文档

## 进阶实践

【自定义边】
可以设置`pointEvents`，设置边不能选中，就能解决边挡住自定义节点导致自定义节点不能选中的问题。

【使用标签 Labels】

- 标签位置
- 标签样式

```tsx
const Jump = Shape.Edge.define({
  shape: "jump",
  label: {
    position: {
      // 指定标签的位置，默认值为0.5表示标签位于边长度的中心位置。
      distance: 1,
      // 设置指定标签（位置）的偏移量
      offset: {
        x: 25,
        y: -15,
      },
    },
  },
  attrs: {
    text: {
      fill: "#333333",
      fontSize: 14,
      // ref: 'wrap',
      // refX: 25,
      // refY: '100%', // 设置refY无效
      // refY2: -20,
      text: "aaa",
    },
    wrap: {
      connection: true,
      strokeWidth: size * 2,
      strokeLinejoin: "round",
    },
    line: {
      connection: true,
      stroke: "#333333",
      // strokeDasharray: `${size} ${size}`,
      strokeWidth: 2,
      strokeLinejoin: "round",
      targetMarker: {
        name: "block",
        tagName: "path",
        strokeWidth: 2,
        // d: 'M 1 0 -1 0',
        // d: 'M 10 -5 0 0 10 5 Z',
      },
    },
  },
  connector: {
    name: "curve",
  },
  propHooks(metadata) {
    const { desc, target } = metadata;
    // const { y: targetY } = (target || {}) as any;
    if (desc) {
      ObjectExt.setByPath(metadata, "attrs/text/text", desc);
    }
    return metadata;
  },
});
```

# 自定义节点

## `基类Cell`自定义节点

```tsx
// import React from 'react'
import { ObjectExt } from "@antv/x6";
import Base, { fmtEllipsisObjToInLineStyle } from "./base";

const size = 40;
const Transition = Base.define({
  shape: "transition",
  width: size * 4.5,
  height: 18,
  zIndex: 100, // 节点/边在画布中的层级，默认根据节点/边添加顺序自动确定

  // 指定了渲染节点/边时使用的SVG/HTML 片段，使用JSON格式描述
  markup: [
    {
      tagName: "rect",
      selector: "body",
    },
    {
      tagName: "rect",
      selector: "show",
    },
    {
      tagName: "text",
      selector: "label",
    },
    {
      tagName: "foreignObject",
      selector: "description",
    },
  ],
  attrs: {
    body: {
      "fill-opacity": 0,
      "stroke-opacity": 0,
    },
    show: {
      width: size,
      height: 4,
      x: 0,
      "fill-opacity": 1,
      fill: "#ff00ff",
    },
    label: {
      fontSize: 16,
      fill: "#333333",
      refX: -10,
      refY: 3,
      ref: "show",
      // x: -12,
      // y: 3,
      textAnchor: "end",
      textVerticalAnchor: "middle",
    },
    description: {
      fontSize: 12,
      refX: 0,
      refY: 0,
      x: size + 12,
      y: 3,
      textAnchor: "left",
      textVerticalAnchor: "middle",
    },
    empty: {
      width: size * 3.5,
      height: 4,
      x: size,
      fill: "transplant",
      strokeWidth: 0,
      stroke: "orange",
    },
  },
  ports: {
    items: [
      {
        id: "in",
        group: "in",
        args: {
          x: size / 2,
          y: 0,
        },
      },
      {
        id: "out",
        group: "out",
        args: {
          x: size / 2,
          y: 4,
        },
      },
    ],
  },
  propHooks(metadata) {
    const { description, ordinal, condition } = metadata;
    const styleStr = fmtEllipsisObjToInLineStyle(
      {
        width: `${size * 3}px`,
      },
      2
    );

    if (description || condition) {
      const text = description || condition;
      ObjectExt.setByPath(
        metadata,
        "attrs/description/html",
        `
        <body xmlns="http://www.w3.org/1999/xhtml">
          <div style="${styleStr}" title="${text}">${text}</div>
        </body>
      `
      );
    }
    if (ordinal) {
      ObjectExt.setByPath(
        metadata,
        "attrs/label/text",
        `T${Number(ordinal) + 1}`
      );
    }
    return metadata;
  },
});

export default Transition;
```

#### markup

```tsx
interface JSONMarkup {
  // 与tagName对应的元素命名空间，默认使用SVG元素命名空间 `"http://www.w3.org/2000/svg"`，当tagName指定的标签时HTML元素时，需要使用HTML元素的命名空间`"http://www.w3.org/1999/xhtml"`
  ns?: string | null;

  // SVG/HTML元素标签名
  tagName: string;

  // SVG/HTML元素的唯一标识，通过该唯一标识为该元素指定属性样式。
  selector?: string | null;

  // 群组选择器，通过群组选择器可以为该群组对应的多个元素指定样式。
  groupSelector?: string | string[] | null;

  // 该SVG/HTML元素的默认属性键值对，通常用于定义那些不变的通用属性，这些默认样式也可以在实例化节点时被覆盖。markup的attrs属性只支持原生的SVG属性，X6的自定义属性在这里不可用。
  attrs?: Attr.SimpleAttrs;

  // 该SVG/HTML元素的行内样式键值对
  style?: JQuery.PlainObject<string | number>;
  // 该SVG/HTML元素的css样式名
  className?: string | string[];
  children?: JSONMarkup[];
  // 该SVG/HTML元素的文本内容
  textContent?: string;
}
```

#### attrs

attrs 选项是一个复杂对象，该对象的 key 是节点中 SVG 元素的选择器（Selector），对应的值是应用到该 SVG 元素的 SVG 属性值（如 fill 和 stroke）。

选择器（Selector）通过节点的 markup 确定，如 Shape.Rect 节点定义了'body'（代表<rect>元素）和'label'（代表<text>元素）两个选择器。

另外，我们还可以使用 CSS 选择器来指定节点样式，这样我们就不用记住预定的选择器名称，只需要根据渲染后的 DOM 结构来定义样式即可。使用 CSS 选择器时需要注意，指定的 CSS 选择器可能选中多个元素，这时对应的属性样式将同时应用到多个元素中。

# `【问题】`

# X6 设置 scroll 滚动条后页面崩溃

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

# X6 设置 scroll 滚动条后画布与视口偏移异常

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

## gpt QA

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

# 多个模板详情渲染 sfc 后，其中一个 sfc 销毁后会对另一个的 sfc 造成样式影响

**【问题描述】**

从 op 模板列表中双击出来两个 op 模板详情 Tabpane，都点到 op 根节点，然后第一个模板详情切换到 phase 节点后，第二个模板详情的 sfc 流程图中的节点都没有节点名称和转换条件描述了，且通过`chrome-Elements`发现是有 Html 元素的，只是没有渲染成功。

**【问题原因】**

原因是`.x6-node foreignobject {}`这个选择器的样式消失了，SFC 渲染正常时 通过`chrome-Elements` 可以看到 X6 专属全局样式`html-head-style`中有`.x6-graph 等`相关样式，但是在第一个模板详情从 op 根节点切换到 phase 节点时，这整个 style: `html-head-style`都会消失，消失后在任意一个 op 模板详情重新点击回到 op 根节点，又会重新加载`html-head-style`以及`.x6-graph`相关样式，此时 sfc 流程图中的节点名称和转换条件描述就会正常渲染.

**【分析过程】**

- 猜测一：**sfc 重新渲染导致时没有渲染成功**（已排除）
  - 除了 sfc 字符串变化或者 selectKey 变化引起工序页面重新渲染，size 变化也会引起重新渲染，所以把 size 相关逻辑注释，size 写死，重新操作，根据打印，可以发现工序页面没有重新 render，GraphView 也没有重新 render，但是从 op 根节点切换到 phase 节点后，问题依然出现。
  - 所以可以排除是因为 react 数据原因导致的样式加载失败。
- 猜测二：**GraphView 组件内部的 X6 内部变化导致的** （已确定）
  - 第一个模板详情从 op 根节点切换到 phase 节点时，发生了什么？sfc 渲染模块会销毁，即 GraphView 组件会卸载，果然去组件中发现初始化 graph 的 useEffect 中卸载时会执行如下的清除函数。销毁画布以及回收资源。猜测就是因为回收了全局的 X6 样式资源，导致其它模板详情正在渲染的 sfc 的 foreignobject 下的元素样式类没有生效。
  ```jsx
  return () => {
    // 可以调用graph.dispose方法进行画布的销毁以及资源的回收
    graphRef.current?.dispose();
    graphRef.current = null as any;
    sfcInfo.current = null as any;
    containerRef.current = null as any;
  };
  ```
  - 通过注释`graphRef.current?.dispose();`，重新验证，果然 sfc 能够渲染正常了。

**【解决方法】**

- 1. 查找官网 Graph 相关 api，没有发现 dispose 可以传递参数，或者`new Graph({})`时传递 key。
- 2. 官网发现官方的 x6 用户使用交流群，加入后在群里描述了问题，负责人回复：可以升级一个版本试试看能不能解决。

  - 查看 sfc 插件项目中的 x6 版本`@antv/x6: 1.11.3`，在 npm 的 X6 发版历史中看到该版本是两年之前的了。确实版本太旧了。
  - 升级最新版本`2.1.5`发现 api 变化太多，寻找最新的`1.x`版本，是`1.34.6`，官网上也是这个版本，升级`1.34.6`后，在配方编辑器再次测试，发现任一模板详情从 op 根节点切换到 phase 节点时，`chrome-Elements`中`html-head-style`没有消失，**始终是存在的，bug 现象消失，问题解决**。

**【后续影响一】**

发现 sfc 新增、删除节点、扩展分支时，sfc 中的元素都会闪烁一下，（暂未解决）

- 只是闪烁，暂时未发现会影响 sfc 界面的增删改。先不管。

**【后续影响二：画布拖动失效】** （已经解决）

已经设置了画布拖动，但是没有效果，通过对比 131 机器上的之前版本，发现拖动的 class 类名也没有设置到`.x6-graph`这个元素上。

- 2.1 分析问题，在 GraphView 中打印如下

```tsx
useEffect(() => {
  let currentPanning = graphRef.current?.isPannable() || false;
  console.log("panning", panning); // 打印panning值为undefined，因为props没有传入
  // 如下打印值：调用graphapi: 画布是否可以平移，打印值为true
  console.log("graphRef.current?.isPannable()", graphRef.current?.isPannable());
  if (currentPanning !== panning) {
    graphRef.current?.togglePanning(panning);
  }
}, [panning]);
```

- 2.2 打印`graphRef.current?.isPannable()`值是 true，但是 sfc 画布任然不能拖动。
- 2.3 查看官网 api，百度搜索`antv X6 画布设置拖动不生效`问题，查询测试搞了三个小时左右，任然没有进展。
- 2.4 将问题向保哥描述，让我在 Graph 渲染完成的回调中再次打印`graphRef.current?.isPannable()`，发现值是 false，说明开始渲染时候拖动设置为 true 了，但是渲染结束的时候又变成了 false，说明中间某个过程将值从 true 变成了 false。如上面代码，可以发现，有个`if(currentPanning!==panning)`的判断处理，currentPanning 为 true，panning 没有传入值即为 undefined，if 一定会进入，然后执行了`graphRef.current?.togglePanning(panning);`切换画布能否拖动的设置值，传入的 panning 为 false，意思就是将画布设置成不能拖动，所以在下面的 Graph 渲染完成的回调中打印值是 false。

```tsx
graphRef.current.on("render:done", () => {
  setRenderDone(true);
  // 如下打印值：调用graphapi: 画布是否可以平移，打印值为false
  console.log("graphRef.current?.isPannable()", graphRef.current?.isPannable());
});
```

- 2.5 将上上面代码修改如下，画布不能拖动问题即可解决。即 panning 为 undefined 时，togglePanning 函数传入 true，即默认画布是支持拖动的。

```tsx
useEffect(() => {
  let currentPanning = graphRef.current?.isPannable() || false;
  if (currentPanning !== panning) {
    graphRef.current?.togglePanning(panning ?? true);
  }
}, [panning]);
```

- 2.6 那为什么 x6 是`1.11.3`版本时候，`graphRef.current?.togglePanning(panning)`，即传入值为 undefined，也能将画布设置成支持拖动呢，**说明 x6 `1.34.6`版本时，`togglePanning`函数的内部实现已经发生了变化，之前传入 undefined，内部有默认值 true，现在传入 undefined，内部不再有默认值了，undefined 直接当 false 用了，所以才会将初始化 Graph 时设置好的 true 状态再次修改为 false 状态**。
- 2.7 收获，分析问题思路不对
  - 很明显不是 react 数据状态的问题，出题出在 X6 依赖库，所以排查时候，对于调用 X6 拖动相关 api 的地方，要重点注意，很明显有这么一段代码`if(currentPanning!== panning) {graphRef.current?.togglePannin(panning);}`。
  - 对于以上重点代码，如果能够采用控制变量法，依次的去注释掉、修改参数。肯定是可以自己独立快速解决掉这个问题的。
- 3. ~~选中 sfc 中的 `recipe、unit、operation` 文字，会报错如下，（发现 131 机器旧版本也有这个问题，所以不需要管）~~

  ```tsx
  Uncaught Error: 未找到 [801154c4-e413-408b-af14-b175dc3477fe] 操作节点
  at SFCDataStore.getNodeById (index.js:3024)

  // _this.getNodeById(targetId, '操作')
  ```

# 拖拽画布后切换左侧 Tree 节点，重新渲染 sfc 再次定位到刚刚拖拽的区域

**【背景】**
此时 SFC 插件`EditorGraphView`画布只是设置了`panning`: 即画布可以拖动，没有设置`scroll`: 即滚动画布（出现滚动条）

**【`Transform`API】**

- `zoomToRect`：缩放和平移画布，使得 rect 表示的矩形区域充满视口
- `translate`：获取画布平移量。
- `fitToContent`：通过平移和重置画布大小，使其适应画布内容，返回画布的矩形区域。
- `getContentArea`：获取画布内容的矩形区域，使用`画布本地坐标`表示。
- `getContentBBox`：获取画布内容的矩形区域，使用`画布坐标`表示。
- centerPoint

```jsx
// sfc wrapper
<g class="x6-graph-svg-viewport" transform="matrix(1,0,0,1,-65,-53)">
  <g class="x6-graph-svg-primer"></g>
  <g class="x6-graph-svg-stage"></g> // sfc主体
  <g class="x6-graph-svg-decorator"></g>
  <g class="x6-graph-svg-overlay"></g>
</g>
```

```tsx
graphRef.current.getContentArea();
// 返回格式为Rectangle {x: 70, y: 58.5, width: 210, height: 621}
// 其中(x,y)为Rectangle.topLeft的(x,y)值，
//    (width,height)为`class="x6-graph-svg-viewport"`的(width,height)
```

**【实现思路】**

之前每次 sfc 重新渲染时都有个逻辑（如果滚动了，定位到原点），所以这个逻辑执行加个条件即可，即切换左侧 Tree 的 `selectedKey` 才执行。最终实现如下：

```tsx
const baseKeyChangedRef = useRef<boolean>(false); // baseKey是否发生变化ref

// 第一次不执行（不执行didMount），后续每次依赖更新都执行
useUpdateEffect(() => {
  baseKeyChangedRef.current = true;
}, [baseKey]);

useEffect(() => {
  // 获取滚动位置
  const position = graphRef.current?.translate() || { tx: 0, ty: 0 };
  // position: {tx: -30, ty: -743}
  if (baseKeyChangedRef.current) {
    // 如果已滚动,则还原至0
    if (position.tx !== 0 || position.ty !== 0) {
      graphRef.current?.translate(0, 0);
      baseKeyChangedRef.current = false;
    }
  }
}, [
  // 这里只监听sfcData数据变化,变化后,渲染graphData
  _sfcDataStr,
]);
```

# 每个配方详情页签切换左侧 Tree 节点，各层级 SFC 放大/缩小值保存

**【背景】**
此时 SFC 插件`EditorGraphView`画布只是设置了`panning`: 即画布可以拖动，没有设置`scroll`: 即滚动画布（出现滚动条）

**【实现思路】**

```tsx
// batch-sfc\src\sfc\Editor\EditorGraphView.tsx

const EditorGraphView = () => {
  const baseKeyChangedRef = useRef<boolean>(false); // baseKey是否发生变化ref

  useUpdateEffect(() => {
    baseKeyChangedRef.current = true;
  }, [baseKey]);

  // 更新graph 数据
  useEffect(() => {
    graphRef.current?.cleanSelection();
    if (isKeepZoom) {
      if (keepZoomLevel) {
        graphRef.current?.zoom(keepZoomLevel, {
          absolute: true,
          center: { x: 0, y: 0 },
        });
      }
    } else {
      const zoom = graphRef.current?.zoom() || 1;
      // 还原缩放
      if (zoom > 1 || zoom < 1) {
        graphRef.current?.zoom(1, { absolute: true, center: { x: 0, y: 0 } });
      }
    }
    // ....

    graphRef.current?.model.fromJSON(graphData);
  }, [
    // 这里只监听sfcData数据变化,变化后,渲染graphData
    _sfcDataStr,
  ]);
};
```

```tsx
// vxbatch_recipeeditor\src\pages\recipe-detail\process-procedure\index.tsx

type TypeZoomRef = Record<SFC_LEVEL, number>;

const ProcessProcedure = (props, ref) => {
  // 当前配方详情工序-各层级sfc的zoom
  const curRecipeLatestZoomRef = useRef<TypeZoomRef>({
    [SFC_LEVEL.RECIPE]: 1,
    [SFC_LEVEL.UNIT]: 1,
    [SFC_LEVEL.OPERATION]: 1,
    [SFC_LEVEL.PHASE]: 1,
  });

  // Map: 各配方详情工序的各层级sfc的zoom map
  const recipeZoomMapRef = useRef<Record<string, TypeZoomRef>>();

  useEffect(() => {
    if (!recipeDetail.ID) {
      return;
    }
    // 切换配方详情tab之后，根据ID取存储map中的curRecipeLatestZoomRef.current，没有则设置成初始值
    curRecipeLatestZoomRef.current = recipeZoomMapRef.current?.[
      recipeDetail.ID
    ] || {
      [SFC_LEVEL.RECIPE]: 1,
      [SFC_LEVEL.UNIT]: 1,
      [SFC_LEVEL.OPERATION]: 1,
      [SFC_LEVEL.PHASE]: 1,
    };

    return () => {
      if (!recipeDetail.ID) {
        return;
      }
      // 切换配方详情tab之前记住curRecipeLatestZoomRef.current
      recipeZoomMapRef.current = {
        ...recipeZoomMapRef.current,
        [recipeDetail.ID]: curRecipeLatestZoomRef.current,
      };
    };
  }, [recipeDetail]);

  const rememberLatestZoomLevel = useMemoizedFn(() => {
    const latestZoom = editorControllerRef.current?.getZoom();
    const handledLatestZoom = Number(latestZoom.toFixed(1));
    curRecipeLatestZoomRef.current = {
      ...curRecipeLatestZoomRef.current,
      [curLevelType]: handledLatestZoom,
    } as Record<SFC_LEVEL, number>;
  });

  // SFC-放大
  const _zoomOut = useMemoizedFn(() => {
    editorControllerRef.current?.zoom?.(0.2);
    rememberLatestZoomLevel();
  });

  // SFC-缩小
  const _zoomIn = useMemoizedFn(() => {
    editorControllerRef.current?.zoom?.(-0.2);
    rememberLatestZoomLevel();
  });

  // SFC-正常
  const _zoomNormal = useMemoizedFn(() => {
    editorControllerRef.current?.zoom?.(1, { absolute: true });
    rememberLatestZoomLevel();
  });

  return (
    <SFCEditor
      baseKeys={!selectedKeys?.length ? [treeSelectedKey] : selectedKeys}
      isKeepZoom={true}
      keepZoomLevel={
        curRecipeLatestZoomRef.current?.[curLevelType as SFC_LEVEL.RECIPE]
      }
      // ....
    >
      {(graph, sfcInfo) => (
        <SFCEditorController
          ref={editorControllerRef}
          selectKeys={selectedKeys}
          graph={graph}
          sfcInfo={sfcInfo}
        >
          <div>
            <Button.Group>
              <Button
                icon={<ZoomInOutlined />}
                size="middle"
                onClick={_zoomOut}
              >
                放大
              </Button>
              <Button icon={<ZoomOutOutlined />} onClick={_zoomIn}>
                缩小
              </Button>
              <Button icon={<RedoOutlined />} onClick={_zoomNormal}>
                正常
              </Button>
            </Button.Group>
          </div>
        </SFCEditorController>
      )}
    </SFCEditor>
  );
};
```

**【测试】**

配方编辑器测试如下。打开两个配方详情，一个各层级 sfc 层级不断放大，一个各层级 sfc 层级不断缩小，`recipeZoomMapRef.current`打印如下。

且来回切换详情页 tab，及切换各层级，发现都是离开该层级时的缩放值。效果正常。

```tsx
{
    "1332541634600010002": {
        "Recipe": 2,
        "Unit": 1.4,
        "Operation": 1,
        "Phase": 1
    },
    "1332533129800010001": {
        "Recipe": 0.8,
        "Unit": 0.6,
        "Operation": 0.4,
        "Phase": 1
    }
}
```
