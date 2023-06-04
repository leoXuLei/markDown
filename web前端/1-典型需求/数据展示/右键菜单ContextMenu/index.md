# 右键自定义菜单功能

- Modal 下的 children 使用右键菜单的话，注意不能使用 destroyOnClose，不然没法触发右键，因为 containerRef 获取不到，或者通过`{visible && <Modal />}`来解决

**【实现原理】** ToDo

**【使用实例】**

```tsx
import ContextMenu, {
  ContextMenuItem,
} from "@/components/contextMenu/ContextMenu";

const ParamList = (props) => {
  // 右键菜单相关
  const containerRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef({ show: (e: any) => {} });

  const handleContextMenu = useMemoizedFn((e: any) => {
    contextMenuRef.current.show(e);
  });

  useEffect(() =
  > {
    containerRef.current?.addEventListener("contextmenu", handleContextMenu);
    return () => {
      containerRef.current?.removeEventListener(
        "contextmenu",
        handleContextMenu
      );
    };
  }, [handleContextMenu]);

  return (
    <div ref={containerRef} className={styles.ParamListWrapper}>
      <ContextMenu
        ref={contextMenuRef}
        contextMenuNode={
          <>
            <ContextMenuItem
              disabled={operateDisabled}
              onClick={onClickMenuAdd}
            >
              新增
            </ContextMenuItem>
            <ContextMenuItem
              disabled={operateDisabled || !selectedItem}
              onClick={onClickMenuDel}
            >
              删除
            </ContextMenuItem>
          </>
        }
      >
        <EditTable
          isSelectedTable
          rowKey="paramId"
          columns={ParamColumns}
          dataSource={paramDataSource || []}
        />
      </ContextMenu>
    </div>
  );
};
```

# 参考链接

- [(2022-01-05)react 自定义鼠标右键菜单](https://blog.csdn.net/muge1161105403/article/details/122318231)
- [(2020-07-05)前端小技巧：实现自定义右键菜单（Context Menu）](https://segmentfault.com/a/1190000023098787)
- [(2020-09-09)js 实现右键弹出自定义的菜单](https://blog.csdn.net/HaiRong_21/article/details/108492230)
