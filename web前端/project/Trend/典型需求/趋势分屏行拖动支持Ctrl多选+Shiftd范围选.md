# 趋势分屏行拖动支持 Ctrl 多选、Shift 范围选

```less
// index.less

/* Config */
:root {
  --table-row-selected-background-color: rgba(166, 203, 237, 1);
}

.table-row-dragging td {
  // ***
  // ***

  &.color-column {
    overflow: visible;
  }

  .color-wrapper {
    width: 68px;
    height: 18px;

    // 下面两行能实现拖动行的样色列垂直居中，本地是好的，放在92上就不行了（会居中偏下一些）
    // display: inline-block;
    // vertical-align: middle;

    transform: translateY(2px);
  }
}

// 按照supcond的样式选择器层级写，不然会权重太低，导致样式被覆盖
.supcon2-table-wrapper
  .supcon2-table-tbody
  > tr.@{prefixCls}-table-row-selected {
  background-color: var(--table-row-selected-background-color);

  > td.supcon2-table-cell-row-hover {
    background: var(--table-row-selected-background-color);
  }
}

// 被选中的行，拖动时也要有背景色
tr.@{prefixCls}-table-row-selected {
  background-color: var(--table-row-selected-background-color);
}
```

```tsx
import classnames from "classnames";

const trendSplitRowSelectedClassName = `${prefixCls}-table-row-selected`;

const TrendSplitModal: React.FC<TrendSplitModalProps> = (props) => {
  // ***
  // ***
  // ***

  // 高亮选中的records
  const [selectedRecords, setSelectedRecords] = React.useState<TagList>([]);
  // shift多选的开始record
  const shiftStartKey = React.useRef<string | null>(null);

  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    // if (oldIndex !== newIndex) {
    // const newData = R.move(oldIndex, newIndex, dataSource.slice()).filter((el: any) => !!el);
    // setDataSource(newData);
    // }

    if (!dragTagName.current) {
      return;
    }

    const selectedRecordsTagNames = selectedRecords?.map?.(
      (item) => item?.tagName
    );
    // 当前拖动的行是否在被选中row数组中
    const curDraggingRowIsSelected =
      !!dragTagName.current &&
      !!selectedRecordsTagNames?.includes?.(dragTagName.current);

    if (dropKeyRef.current) {
      const latestInTagList = inTagList.map((i) => {
        // 若是批量拖动，被选中row数组里面的都要修改splitId
        if (curDraggingRowIsSelected) {
          if (selectedRecordsTagNames?.includes?.(i.tagName)) {
            return { ...i, splitId: dropKeyRef.current as number };
          }
        } else if (i.tagName === dragTagName.current) {
          // 若是单独拖动，只修改当前row的splitId
          return { ...i, splitId: dropKeyRef.current as number };
        }
        return i;
      });
      setInTagList(latestInTagList);
      setSelectedRecords([]);
    }
    dragTagName.current = null;
    dropKeyRef.current = null;
  };

  const DraggableContainer = (props: SortableContainerProps) => {
    // 当前拖动的行是否在被选中row数组中，若在则加  上className
    const curDraggingRowIsSelected =
      !!dragTagName.current &&
      !!selectedRecords?.find?.(
        (item) => item?.tagName === dragTagName.current
      );

    return (
      <SortableBody
        useDragHandle
        disableAutoscroll
        helperClass={classnames(
          "table-row-dragging",
          curDraggingRowIsSelected && trendSplitRowSelectedClassName
        )}
        onSortStart={onSortStart}
        onSortEnd={onSortEnd}
        {...props}
      />
    );
  };

  const DraggableBodyRow: React.FC<any> = ({
    className,
    style,
    ...restProps
  }) => {
    const index = dataSource.findIndex(
      (x) => x.tagName === restProps["data-row-key"]
    );

    // 当前选中的行加上className
    const handledClassName = selectedRecords?.find?.(
      (item) => item?.tagName === restProps["data-row-key"]
    )
      ? trendSplitRowSelectedClassName
      : "";
    return (
      <SortableItem index={index} className={handledClassName} {...restProps} />
    );
  };

  const columns = [
    // ***
    // ***
    // ***
    {
      title: t("trend.basic.color"),
      dataIndex: "color",
      key: "color",
      width: 100,
      className: "color-column",
      render: (color: string) => (
        <div
          className="color-wrapper"
          style={{ backgroundColor: color, height: 18, borderRadius: "4px" }}
        />
      ),
    },
    // ***
    // ***
    // ***
  ];

  const handleTableRow = (record: TagListItem, index: any) => {
    return {
      onClick: (event: React.MouseEvent<HTMLElement>) => {
        const { ctrlKey, shiftKey } = event?.nativeEvent || {};

        // 【多选情况一：】按住Ctrl键，用鼠标挨个选择，最后形成多选
        if (ctrlKey) {
          // 选择后记录下 shiftStartKey
          shiftStartKey.current = record?.tagName;

          setSelectedRecords((prev) => {
            if (prev?.length === 0) {
              return [record];
            }
            const curSelectedRecordsKeys = prev
              ?.map?.((item) => item?.tagName)
              ?.filter?.(Boolean);
            const latest = curSelectedRecordsKeys?.includes(record?.tagName)
              ? prev?.filter?.((item) => item?.tagName !== record?.tagName)
              : prev?.concat?.(record);
            return latest;
          });
          return;
        }

        // 【多选情况二：】按住Shift键，用鼠标只需要点击选择开始和结束数据，中间的数据自动被多选上
        if (shiftKey) {
          if (!shiftStartKey.current) {
            return;
          }
          // 第一次Ctrl+点击选择的位置下标
          const firstSelectIndex = dataSource?.findIndex(
            (item) => item.tagName === shiftStartKey.current
          );
          // 第二次Shift+点击选择的位置下标
          const secondSelectIndex = dataSource?.findIndex(
            (item) => item.tagName === record?.tagName
          );

          // 排序一下，更小的位置下标放前面
          const [smallerIndex, largerIndex] = [
            firstSelectIndex,
            secondSelectIndex,
          ].sort((a, b) => a - b);
          // 截取开始和结束位置之间的数据
          setSelectedRecords(
            dataSource?.slice?.(smallerIndex, largerIndex + 1)
          );
        }
      },
    };
  };

  return (
    <Modal>
      <div className={`${prefixCls}-right`}>
        <Table
          pagination={false}
          stripe={true}
          rowKey="tagName"
          dataSource={dataSource}
          columns={columns}
          scroll={{
            y: "430px",
          }}
          components={{
            body: {
              wrapper: DraggableContainer,
              row: DraggableBodyRow,
            },
          }}
          onRow={handleTableRow}
        />
      </div>
    </Modal>
  );
};
```
