# 实例

## 原生拖拽实例一

询问 gpt 拖放实例如下：

```tsx
import React, { useState } from "react";
import { useMemoizedFn } from "ahooks";

const TestDragAndDropComponent = () => {
  const [dragging, setDragging] = useState(false);

  const handleDragStart = useMemoizedFn((event) => {
    console.log("event.target.id", event.target.id);
    event.dataTransfer.setData("text/plain", event.target.id);
    setDragging(true);
  });

  const handleDragEnd = useMemoizedFn(() => {
    setDragging(false);
  });

  return (
    <div>
      <div
        id="drag-me"
        draggable="true"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={{ backgroundColor: dragging ? "blue" : "red" }}
      >
        Drag me!
      </div>
      <div
        id="drop-here"
        // eslint-disable-next-line react/jsx-no-bind
        onDrop={(event) => {
          event.preventDefault();
          const data = event.dataTransfer.getData("text/plain");
          const draggedElement = document.getElementById(data);
          (event.target as any)?.appendChild?.(draggedElement);
        }}
        // eslint-disable-next-line react/jsx-no-bind
        onDragOver={(event) => {
          event.preventDefault();
        }}
        style={{
          marginTop: "20px",
          padding: "10px",
          border: "1px solid black",
        }}
      >
        Drop here!
      </div>
    </div>
  );
};

export default TestDragAndDropComponent;
```

# 参考链接

- [原生拖拽太拉跨了，纯 JS 自己手写一个拖拽效果，纵享丝滑](https://juejin.cn/post/7145447742515445791)
- [因为写不出拖拽移动效果，我恶补了一下 Dom 中的各种距离](https://mp.weixin.qq.com/s/1Cc8fhf7kVkQBAKrnRYVvg)
