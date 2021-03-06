# redux

- 新增 reducer 后接口请求了也 set 了但是没有监听到数据更新 （清一下缓存即可）

# 问题

- 更新依赖版本后不生效
  试试看重新编译项目

## 某些依赖配置后不生效

**【`hooks依赖检查：react-hooks/exhaustive-deps`配置了却没有生效】：**

- 解决方法： 关闭所有 vscode 窗口，重启即可。

# Tips

- 项目用 yarn 安装依赖就一直用 yarn，不要 yarn 和 npm 混用

## 类库的 Api 用途/参数不清楚含义

如下：一些类库不知道 api/参数具体含义可以点进依赖的 lib，查看接口及注释。

```jsx
import { TargetType, SourceType } from 'dnd-core';
import { DropTargetMonitor, DragSourceMonitor } from './monitors';
import { DragSourceOptions, DragPreviewOptions } from './options';
export interface DragSourceHookSpec<DragObject extends DragObjectWithType, DropResult, CollectedProps> {
    /**
     * A plain javascript item describing the data being dragged.
     * This is the only information available to the drop targets about the drag
     * source so it's important to pick the minimal data they need to know.
     *
     * You may be tempted to put a reference to the component or complex object here,
     * but you shouldx try very hard to avoid doing this because it couples the
     * drag sources and drop targets. It's a good idea to use something like
     * { id: props.id }
     *
     */
    item: DragObject;
    /**
     * The drag source options
     */
    options?: DragSourceOptions;
    /**
     * DragPreview options
     */
    previewOptions?: DragPreviewOptions;
    /**
     * When the dragging starts, beginDrag is called. If an object is returned from this function it will overide the default dragItem
     */
    begin?: (monitor: DragSourceMonitor) => DragObject | undefined | void;
    /**
     * Optional.
     * When the dragging stops, endDrag is called. For every beginDrag call, a corresponding endDrag call is guaranteed.
     * You may call monitor.didDrop() to check whether or not the drop was handled by a compatible drop target. If it was handled,
     * and the drop target specified a drop result by returning a plain object from its drop() method, it will be available as
     * monitor.getDropResult(). This method is a good place to fire a Flux action. Note: If the component is unmounted while dragging,
     * component parameter is set to be null.
     */
    end?: (draggedItem: DragObject | undefined, monitor: DragSourceMonitor) => void;
    /**
     * Optional.
     * Use it to specify whether the dragging is currently allowed. If you want to always allow it, just omit this method.
     * Specifying it is handy if you'd like to disable dragging based on some predicate over props. Note: You may not call
     * monitor.canDrag() inside this method.
     */
    canDrag?: boolean | ((monitor: DragSourceMonitor) => boolean);
    /**
     * Optional.
     * By default, only the drag source that initiated the drag operation is considered to be dragging. You can
     * override this behavior by defining a custom isDragging method. It might return something like props.id === monitor.getItem().id.
     * Do this if the original component may be unmounted during the dragging and later “resurrected” with a different parent.
     * For example, when moving a card across the lists in a Kanban board, you want it to retain the dragged appearance—even though
     * technically, the component gets unmounted and a different one gets mounted every time you move it to another list.
     *
     * Note: You may not call monitor.isDragging() inside this method.
     */
    isDragging?: (monitor: DragSourceMonitor) => boolean;
    /**
     * A function to collect rendering properties
     */
    collect?: (monitor: DragSourceMonitor) => CollectedProps;
}
/**
 * Interface for the DropTarget specification object
 */
export interface DropTargetHookSpec<DragObject, DropResult, CollectedProps> {
    /**
     * The kinds of dragItems this dropTarget accepts
     */
    accept: TargetType;
    /**
     * The drop target optinos
     */
    options?: any;
    /**
     * Optional.
     * Called when a compatible item is dropped on the target. You may either return undefined, or a plain object.
     * If you return an object, it is going to become the drop result and will be available to the drag source in its
     * endDrag method as monitor.getDropResult(). This is useful in case you want to perform different actions
     * depending on which target received the drop. If you have nested drop targets, you can test whether a nested
     * target has already handled drop by checking monitor.didDrop() and monitor.getDropResult(). Both this method and
     * the source's endDrag method are good places to fire Flux actions. This method will not be called if canDrop()
     * is defined and returns false.
     */
    drop?: (item: DragObject, monitor: DropTargetMonitor) => DropResult | undefined;
    /**
     * Optional.
     * Called when an item is hovered over the component. You can check monitor.isOver({ shallow: true }) to test whether
     * the hover happens over just the current target, or over a nested one. Unlike drop(), this method will be called even
     * if canDrop() is defined and returns false. You can check monitor.canDrop() to test whether this is the case.
     */
    hover?: (item: DragObject, monitor: DropTargetMonitor) => void;
    /**
     * Optional. Use it to specify whether the drop target is able to accept the item. If you want to always allow it, just
     * omit this method. Specifying it is handy if you'd like to disable dropping based on some predicate over props or
     * monitor.getItem(). Note: You may not call monitor.canDrop() inside this method.
     */
    canDrop?: (item: DragObject, monitor: DropTargetMonitor) => boolean;
    /**
     * A function to collect rendering properties
     */
    collect?: (monitor: DropTargetMonitor) => CollectedProps;
}
export interface DragObjectWithType {
    type: SourceType;
}

```

## 依赖放在`dependencies`还是`devDependencies`

- 安装 lodash 放在`dependencies`下，安装 lodash 的`@types/lodash`放在`devDependencies`，只要是依赖的对应类型`@types/xx`都放在开发依赖中，因为只有开发途中会用到 TS 相关功能。

# 参考链接

- [NPM 官网-查询依赖说明、用法、官网链接](https://www.npmjs.com/package/typescript)
