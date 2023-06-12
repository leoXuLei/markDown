# 扩展分支后自动选中的框框变得很小

**【问题描述】**：

- 之前我做了节点点击操作按钮之后自动选中功能（比如选中步节点后新增步节点，自动选中新增的步节点；选中分支后扩展分支，继续选中该分支），chenbao 最近改动`changNodeColor`后，导致点击扩展分支后自动选中的框框很小（但是只要稍微拖动一下画布就能恢复正常），但是新增步节点之后新增的步节点选中框正常。

```tsx
// 设置状态颜色
const _changeNodeColor = useCallback(
  (nodes: any[]) => {
    nodes.forEach((node) => {
      const { elementType } = node?.data || {};
      // 下面这行if return就是新增的逻辑
      if (Number(elementType) > ESFCNodeType.EndStep) return;
      _changeNodeColorItem(node);
    });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [_baseData, _changeNodeColorItem]
);
```

**【问题分析】**：

- 最开始以为是扩大选中区域功能引起的，但是通过控制变量法来注释不同模块功能，发现可能是上面代码中的`if return`引起的。
- 把新增的`if return`注释后，就效果正常了，本想就这么解决的，但是询问 chenbao 后，说这只是表象，就算把`if return`和`_changeNodeColorItem(node);`都注释，还是会不行，试了果然如此。结合只要稍微拖动一下画布就能恢复正常，说明设置最新选中节点的逻辑没有在画布渲染之前执行。

**【解决方法】**

去看`节点点击操作按钮之后自动选中功能`相关逻辑，果然发现问题：如下：`设置选中节点的逻辑`写在 fromJson 之后，但是 fromJSON 很可能是异步的。所以需要确保`设置选中节点的逻辑`在画布渲染完成之后再走。

```tsx
// 更新graph 数据
useEffect(() => {
  // ...
  graphRef.current?.model.fromJSON(graphData);
  const toBeSelectedNodeId = sfcDataStore.current?.toBeSelectedNodeId;
  // 如果有需要自动选中的节点则设置选中
  if (toBeSelectedNodeId) {
    graphRef.current.resetSelection(toBeSelectedNodeId);
    setCurSelected(toBeSelectedNodeId);
    // 选中后清空
    sfcDataStore.current.setToBeSelectedNodeId(null);
  }
}, [
  // 这里只监听sfcData数据变化,变化后,渲染graphData
  _sfcDataStr,
]);
```

如下，把`设置选中节点的逻辑`移到画布渲染完成的回调中。

```tsx
graphRef.current.on("render:done", () => {
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

**【测试】**

将`设置选中节点的逻辑`移动到`render:done`事件中后，即使注释整个`_changeNodeColor`，自动选中功能都是正常的，说明从本质、根本上解决了 bug。

**【收获】**
从以下细节能帮助确定异常不是由于加了个 return 引起的

- `changNodeColor`注释后，重新测试，发现新增步节点和扩展分支之后的新节点的选中框都是异常的。说明跟 return 没关系。
- 注释 return 后，扩展分支之后的选中框就能正常，但是`_changeNodeColorItem`只是修改了`node?.setAttrByPath?.(['runningStep', 'fill'], '#f0f2f5');`，这是专门设置步节点前面的箭头的，但是却能让扩展分支之后的选中框显示正常。说明选中框显示异常是画布没有更新导致的，很可能就是`设置选中节点的逻辑`的执行时机不对导致的。
