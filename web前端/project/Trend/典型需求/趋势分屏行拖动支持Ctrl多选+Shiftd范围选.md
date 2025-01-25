# 趋势分屏行拖动支持 Ctrl 多选、Shift 范围选

```less
// index.less

/* Config */
:root {
  --table-row-selected-background-color: rgba(166, 203, 237, 1);
}

.table-row-dragging {
  z-index: 1200;
  overflow: hidden;
  color: green;
  vertical-align: middle;
  background: #fafafa;
  border: 1px solid #ccc;
  box-shadow: rgba(0, 0, 0, 20%) 0 5px 5px -5px, rgba(0, 0, 0, 20%) 0 -5px 5px -5px;
}

.table-row-dragging td {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;

  &.drag-column {
    padding-left: 16px;
  }

  &:not(.drag-column) {
    padding: 0 16px;
  }

  &.tagName-column {
    width: 200px;
  }

  &.desc-column {
    width: 141px;
    max-width: 141px;
  }

  &.splitId-column {
    width: 160px;
  }

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
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  SortableContainerProps,
  SortEnd,
  SortStart
} from 'react-sortable-hoc';
import classnames from "classnames";
import { MenuOutlined } from '@ant-design/icons';
import './index.less';


const trendSplitRowSelectedClassName = `${prefixCls}-table-row-selected`;

const SortableItem = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr {...props} />
));
const SortableBody = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props} />
));

const TrendSplitModal: React.FC<TrendSplitModalProps> = (props) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const tagList = useAppSelector((state) => state.options.tagList);
  const line = useAppSelector((state) => state.options.chart.line);

  const [inTagList, setInTagList] = React.useState<TagList>(R.clone(tagList));
  const [inLine, setInLine] = React.useState<Options["chart"]["line"]>(
    R.clone(line)
  );

  const { split, splitNum } = inLine;
  const splitNumKey = [...Array(splitNum + 1).keys()].slice(1);

  const [selectTag, setSelectTag] = React.useState<string>("");

  // 高亮选中的records
  const [selectedRecords, setSelectedRecords] = React.useState<TagList>([]);
  // shift多选的开始record
  const shiftStartKey = React.useRef<string | null>(null);

  const selectFocus = React.useRef<boolean>(false);
  // 拖动的位号的名称
  const dragTagName = React.useRef<string | null>(null);
  // 放置到左侧分配list的编号
  const dropKeyRef = React.useRef<number | null>(null);

  const DragHandle = SortableHandle(() => (
    <MenuOutlined style={{ color: "#999", cursor: "grab" }} />
  ));
  const onSortStart = ({ index }: SortStart) => {
    dragTagName.current = dataSource?.[index]?.tagName;
  };

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
    // 当前拖动的行是否在被选中row数组中，若在则加上className
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
    // 表格设置了rowKey="tagName"
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

  const onCancel = () => {
    onShowChange?.(false);
  };

  const onConfirm = () => {
    dispatch(actions.updateTagList(inTagList));
    dispatch(
      actions.updateCharts({
        line: inLine,
      })
    );
    onShowChange?.(false);
  };

  const handleSplitScreenNumberChange = (v: number | null) => {
    // 正整数才继续
    if (v !== null && Math.round(v) === v) {
      // 控制value的值在[1,16]之间
      const handledV = v < 1 ? 1 : v > 16 ? 16 : v;
      if (handledV < splitNum) {
        // 如果最新的分屏数量值v相比较之前变小了，则需要更新位号列表item的区域编号
        //    区域编号等于旧的分屏数量值，则更新为v
        //    区域编号大于v，则更新为1
        //    区域编号小于等于v，不变
        setInTagList(
          inTagList.map((i) => {
            if (i.splitId === splitNum) {
              return {
                ...i,
                splitId: handledV,
              };
            }
            if (i.splitId > handledV) {
              return {
                ...i,
                splitId: 1,
              };
            }
            return i;
          })
        );
      }
      setInLine({
        ...inLine,
        splitNum: handledV,
      });
    }
  };

  const columns = [
    {
      title: "",
      dataIndex: "drag",
      width: 30,
      className: "drag-visible drag-column",
      render: () => <DragHandle />,
    },
    {
      title: "名称",
      dataIndex: "tagName",
      key: "tagName",
      ellipsis: true,
      className: "tagName-column",
      width: 200,
    },
    {
      title: "描述",
      dataIndex: "desc",
      ellipsis: true,
      key: "desc",
      className: "desc-column",
    },
    {
      title: "颜色",
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
    {
      title: "显示区域编号",
      dataIndex: "splitId",
      key: "splitId",
      width: 160,
      className: "splitId-column",
      render: (splitId: number, record: any) => {
        return selectTag === record.tagName ? (
          <Select
            style={{ width: 80 }}
            value={splitId}
            onFocus={() => {
              selectFocus.current = true;
            }}
            onBlur={() => {
              setSelectTag("");
              selectFocus.current = false;
            }}
            onMouseLeave={() => {
              if (!selectFocus.current) {
                setSelectTag("");
              }
            }}
            onChange={(k: number) => {
              const { tagName } = record;
              setInTagList(
                inTagList.map((i) =>
                  i.tagName === tagName ? { ...i, splitId: k } : i
                )
              );
              setSelectTag("");
              selectFocus.current = false;
            }}
          >
            {splitNumKey.map((k) => (
              <Option key={k} value={k}>
                {k}
              </Option>
            ))}
          </Select>
        ) : (
          <div
            style={{
              textAlign: "center",
              color: SPLIT_COLOR[splitId - 1],
              fontWeight: 700,
            }}
            onClick={() => {
              if (!selectFocus.current) {
                setSelectTag(record.tagName);
              }
            }}
          >
            {splitId}
          </div>
        );
      },
    },
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
    <Modal
      width={960}
      open={show}
      destroyOnClose={true}
      title="趋势分屏"
      onOk={onConfirm}
      onCancel={onCancel}
    >
      <div className={`${prefixCls}-left`}>
        <div>
          分屏开关
          <Switch
            checked={split}
            onChange={(checked) => {
              setInLine({
                ...inLine,
                split: checked,
              });
            }}
          />
        </div>
        <div>
          分屏数量
          <InputNumber
            className={`${prefixCls}-left-input`}
            style={{ display: "inline-flex", width: 100 }}
            // @ts-ignore
            controllerHorizontally
            width={100}
            min={1}
            max={8}
            precision={0}
            value={splitNum}
            onBlur={(e) => {
              const numberValue = parseInt(e.target.value);
              handleSplitScreenNumberChange(numberValue);
            }}
            onStep={(value: number) => {
              handleSplitScreenNumberChange(value);
            }}
            onPressEnter={(e: any) => {
              const numberValue = parseInt(e.target.value as string);
              handleSplitScreenNumberChange(numberValue);
            }}
          />
        </div>
        <div className={`${prefixCls}-left-card`}>
          {splitNumKey.map((k) => (
            <div
              key={k}
              onMouseOver={() => {
                dropKeyRef.current = k;
              }}
              onMouseLeave={() => {
                dropKeyRef.current = null;
              }}
            >
              <span
                style={{
                  pointerEvents: "none",
                  backgroundColor: SPLIT_COLOR[k - 1],
                }}
              >
                {k}
              </span>
            </div>
          ))}
        </div>
      </div>
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
