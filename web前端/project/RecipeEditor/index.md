# `【自定义Hook】`

## `useInputCursor`，TextArea 指定光标位置并插入文本

详细源码见`recipeeditor\src\hooks\useInputCursor.ts`

**【使用如下】**

```tsx
const EditExpressionModal = (props) => {
  const {
    setInputRef,
    getCursorPosition,
    setCursorPosition,
    insertAt,
    getInputValue,
  } = useInputCursor();

  // 表达式值
  const [expressionValue, setExpressionValue] = useState<string | undefined>();

  // 初始化输入框光标位置
  const initialCursorPosition = useMemoizedFn(() => {
    setCursorPosition(value?.length || 0);
  });

  useEffect(() => {
    if (open) {
      setExpressionValue(value || "");
      initialCursorPosition();
    }
  }, [open, value, initialCursorPosition]);

  const onTextAreaChange = useMemoizedFn((e) => {
    setExpressionValue(e.target?.value);
  });

  // 编辑更新表达式
  const handleEditExpressValue = useMemoizedFn((toInsertStr: string) => {
    // console.log('toInsertStr', toInsertStr);
    const position = getCursorPosition();
    insertAt(position.start, toInsertStr);
    setExpressionValue(getInputValue?.());
  });

  // 清空表达式
  const handleEmptyExpressValue = useMemoizedFn(() => {
    setExpressionValue("");
    setCursorPosition?.(0);
  });

  const contextProviderValue = useMemo(
    () => ({
      expressionValue,
      onEditExpressValue: handleEditExpressValue,
      handleEmptyExpressValue,
      onCancelModal: handleCancel as any,
      onSubmitModal: handleModalSubmit,
      handleExpressionCompile,
    }),
    [
      expressionValue,
      handleEditExpressValue,
      handleEmptyExpressValue,
      handleCancel,
      handleModalSubmit,
      handleExpressionCompile,
    ]
  );

  return (
    <Modal
      title={formatMessage({
        id: "editExpression.editExpression",
      })}
      maskClosable={false}
      open={open}
      onCancel={handleCancel}
    >
      <EditExpressionContext.Provider value={contextProviderValue}>
        <div>
          <TextArea
            ref={setInputRef}
            rows={4}
            disabled={disabled}
            value={expressionValue}
            onChange={onTextAreaChange}
          />
        </div>
        <div className={styles.BottomContainer}>
          <ProcedureParamCascader />
          <LogicSymbolCalculatorOperator />
        </div>
      </EditExpressionContext.Provider>
    </Modal>
  );
};
```

# `【典型需求】`

## `Table` 目标 `Record` 行滚动到视区中央

详细源码见`recipeeditor\src\pages\recipe\index.tsx`

第一版，比较简陋。

```tsx
// 获取列表数据
const getOriginalList = useMemoizedFn(() => {
  getRecipe({ ID: -1 }).then((res) => {
    // console.log('getOriginalList res :>> ', res);

    // xxxx
    setRecipeList(res.sort(sortByNameAndVersion));

    // 是否已经跳转过目标record
    let hasJumped = false;
    // 本页面某些操作后刷新列表后更新待选中配方逻辑
    if (toBeSelectedRecipeItemIDRef.current) {
      handleJumpTableTargetItem(res, toBeSelectedRecipeItemIDRef.current);
      toBeSelectedRecipeItemIDRef.current = undefined;
      hasJumped = true;
    }
    // 从其它页面（配方详情）回到配方列表页面时，更新待选中配方逻辑
    const lastJumpRecipeID = props?.menuTab?.lastRecipeIDJumpToRecipeDetail;
    if (lastJumpRecipeID && !hasJumped) {
      handleJumpTableTargetItem(res, lastJumpRecipeID);
    }
  });
});

// Table跳转到目标record所在页，并自动滚动到视区
const handleJumpTableTargetItem = useMemoizedFn(
  (list: IRecipeItem[], jumpItemId: string) => {
    const findLastJumpRecipeItem = list?.find((item) => item.ID === jumpItemId);
    const selectedRecipeItemIndex = list.findIndex(
      (item) => item.ID === jumpItemId
    );
    if (selectedRecipeItemIndex > -1) {
      // 多减10，不然会滚动到视口的最上方
      const scrollHeight = ((selectedRecipeItemIndex % 30) - 10) * 40;
      setSelectedRecipeItem(findLastJumpRecipeItem);
      setTablePagination({
        current: Math.floor(selectedRecipeItemIndex / 30) + 1,
      });
      const tableEle = document.getElementsByClassName?.("ant-table-body");
      if (tableEle[0]) {
        tableEle[0].scrollTop = scrollHeight;
      }
    }
  }
);
```

第二版。

后续自适应`table-body`高度（即 `antd-table-body` 的 max-height 发生变化）也能滚动到视区中央实现。因为测试的环境都是开了监控的，导致浏览器窗口高度比正常的矮。所以需要自适应`table-body`高度。

```tsx
// 获取列表数据
const getOriginalList = useMemoizedFn(() => {
  getRecipe({ ID: -1 }).then((res) => {
    // xxxxxx
    const recipeClassIDList = recipeClassList.map((item) => item.ID);
    const filteredSorttedRecipeList = handlePowerRecipeList(
      sorttedRecipeList
    )?.filter((item) => {
      // 过滤出配方类被配方类list包含的配方
      return recipeClassIDList.includes(item.RecipeClassID);
    });
    // console.log('filteredSorttedRecipeList :>> ', filteredSorttedRecipeList);

    // 是否已经跳转过目标record
    let hasJumped = false;
    // 本页面某些操作后刷新列表后更新待选中配方逻辑
    if (toBeSelectedRecipeItemIDRef.current) {
      handleJumpTableTargetItem(
        filteredSorttedRecipeList,
        toBeSelectedRecipeItemIDRef.current
      );
      toBeSelectedRecipeItemIDRef.current = undefined;
      hasJumped = true;
    }
    // 从其它页面（配方详情）回到配方列表页面时，更新待选中配方逻辑
    const lastJumpRecipeID = props?.menuTab?.lastRecipeIDJumpToRecipeDetail;
    if (lastJumpRecipeID && !hasJumped) {
      handleJumpTableTargetItem(filteredSorttedRecipeList, lastJumpRecipeID);
    }
  });
});

// Table跳转到目标record所在页，并自动滚动到视区
const handleJumpTableTargetItem = useMemoizedFn(
  (list: IRecipeItem[], jumpItemId: string) => {
    const findLastJumpRecipeItem = list?.find((item) => item.ID === jumpItemId);
    const selectedRecipeItemIndex = list.findIndex(
      (item) => item.ID === jumpItemId
    );

    if (selectedRecipeItemIndex > -1) {
      setSelectedRecipeItem(findLastJumpRecipeItem);
      setTablePagination({
        current: Math.floor(selectedRecipeItemIndex / 30) + 1,
      });
      const tableEle = document.getElementsByClassName?.("ant-table-body");
      if (!tableEle[0]) {
        return;
      }
      const tableRowHeight = 39;
      // 获取antd-table设置的最大高度
      const tableMaxHeight = window
        .getComputedStyle(tableEle[0])
        ?.maxHeight?.slice(0, -2);
      // 表格可视区域record条数
      const tableClientAreaRecords =
        Math.round(Number(tableMaxHeight) / tableRowHeight) || 0;
      if (!tableClientAreaRecords) {
        return;
      }

      // 目标record在所在页的index
      const curPageIndex = selectedRecipeItemIndex % 30;
      // 目标record进入视区中间需要滚动的行数，处理前
      const scrollRowNumber = (Math.floor((curPageIndex + 1) / 5) - 1) * 5;
      // 所在页剩余行数
      const scrollRowRestNumber = 30 - tableClientAreaRecords;
      // 目标record进入视区中间需要滚动的行数，处理后，加个限制在0-scrollRowRestNumber，因为视区高度就是tableClientAreaRecords条
      const handledScrollRowNumber =
        scrollRowNumber > 0 && scrollRowNumber <= scrollRowRestNumber
          ? scrollRowNumber
          : scrollRowNumber > scrollRowRestNumber
          ? scrollRowRestNumber
          : 0;
      // 目标record进入视区中间需要滚动的高度
      const scrollHeight = handledScrollRowNumber * tableRowHeight;

      // console.log('scrollHeight :>> ', scrollHeight);
      if (scrollHeight > 0) {
        tableEle[0].scrollTop = scrollHeight;
      }
    }
  }
);
```

# `【问题】`

## `<EditTable />`列组件的双击编辑事件偶尔会跳过不触发，直接触发 table 的双击跳转详情事件

**【问题描述】**

`EditWrapper`中给包裹`<EditComp />`的 div 设置了双击事件，在 `onDoubleClick` 事件中根据可编辑组件的配置，决定是否阻止冒泡，从而实现某些列双击编辑效果，而不是 table 行双击跳转到详情页。

测试过程中，发现偶现：不触发 `onDoubleClick` 事件，直接触发了 table 行双击事件，同时浏览器控制台警告如下：

```json
List.js:284 [Violation] Added non-passive event listener to a scroll-blocking 'wheel' event. Consider marking event handler as 'passive' to make the page more responsive. See https://www.chromestatus.com/feature/5745543795965952


useTouchMove.js:154 [Violation] Added non-passive event listener to a scroll-blocking 'wheel' event. Consider marking event handler as 'passive' to make the page more responsive. See https://www.chromestatus.com/feature/5745543795965952
```

```tsx
export const EditWrapper: FC<IEditWrapper> = ({
  const handleEdit = useMemoizedFn((e) => {
    // 单元格列双击时只编辑不冒泡到行
    console.log(
      'columnDbOnlyEditNotPropagation',
      columnDbOnlyEditNotPropagation,
    );
    if (columnDbOnlyEditNotPropagation) {
      console.log('阻止了冒泡');
      e?.stopPropagation?.(); // 阻止冒泡
      e.preventDefault();
    }

    if (disabled || onlyRead) {
      return;
    }
    setIsEdit(true);
  });


  return (isEdit && children) || IsShildrenCustomCom ? (
    <div style={{ width: '100%' }} className="EditWrapper">
      {childrenNode}
    </div>
  ) : (
    <div
      onDoubleClick={handleEdit}
      {...(showTooltipTitle ? { title: show } : {})}
      className={classNames(
        disabled && 'text',
        !disabled && 'table-edit-cell',
        showTooltipTitle && 'text-overflow-ellipsis',
      )}
    >
      {show}
    </div>
  );
})
```

**【尝试解决】**

搜索报错信息，得到如下解决方法，但是实际测试无用。

`npm i default-passive-events -S`

```json
+ default-passive-events@2.0.0
added 265 packages from 81 contributors, removed 151 packages and updated 1049 packages in 295.42s

127 packages are looking for funding
  run `npm fund` for details
```

**【解决方法】**
不再使用`<EditTable />`的`onRowDoubleClick`回调，而是通过设置单元格属性 `onCell`来解决。即设置`onCell.onDoubleClick`。如下。

非编辑列双击跳转到详情页签，编辑列双击没有事件，单纯只是触发`<TableEditComp />`的双击编辑。

```tsx
//vxbatch_recipeeditor\src\pages\library\index.tsx

const onCellHandle = useMemoizedFn((dataIndex: string, record: any) => ({
  onDoubleClick: (event: any) => {
    onRowDoubleClick(record);
  },
}));

const columns = useMemo(() => {
  return libraryColumns.map((item) => {
    const title = formatMessage({
      id: item.title,
    });
    return {
      ...item,
      title,
      width: 120,
      render:
        item.render ??
        ((text: any, record: IOpTemplateItem, idx: number) => {
          const afterChange = (val: IPlainObject) => {
            getEditTableRow({ ID: record.ID, ...val });
          };

          return (
            <TableEditComp
              fieldName={item.dataIndex}
              showTooltipTitle={item.showTooltipTitle}
              value={text}
              afterChange={afterChange}
            />
          );
        }),
      ...(item.dataIndex !== "Remark"
        ? {
            onCell: (record: any) => onCellHandle(item.dataIndex, record),
          }
        : {}),
    };
  });
}, [operateDisabled, formatMessage, getEditTableRow, onCellHandle]);
```
