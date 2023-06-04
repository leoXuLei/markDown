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

## sfc 步节点闪烁效果实现

文件路径：`vxbatch-web-client\src\components\batchSfcPlugin\editorSfc.tsx`

使用如下：

```tsx
// 设置跳步状态step闪烁效果
const nodeBlinkHandle = useMemoizedFn((node) => {
  // 设置step为透明
  const handleNodeTransparent = () => {
    if (_tabKey !== "sfc") {
      handleNodeJumpColorTimer.current &&
        clearTimeout(handleNodeJumpColorTimer.current);
      return;
    }
    if (document.hidden === false) {
      node.setAttrByPath(["nodeBody", "fill"], "transparent");
      node.setAttrByPath(["descriptionLabelBody", "fill"], "transparent");
    }
    handleNodeJumpColorTimer.current = setTimeout(() => {
      handleNodeJumpColor();
    }, 800);
  };
  // 设置step为#22B14C
  const handleNodeJumpColor = () => {
    if (_tabKey !== "sfc") {
      handleNodeTransparentTimer.current &&
        clearTimeout(handleNodeTransparentTimer.current);
      return;
    }
    if (document.hidden === false) {
      node.setAttrByPath(["nodeBody", "fill"], "#22B14C");
      node.setAttrByPath(["descriptionLabelBody", "fill"], "#22B14C");
    }
    handleNodeTransparentTimer.current = setTimeout(() => {
      handleNodeTransparent();
    }, 800);
  };
  handleNodeJumpColor();
});
```

```tsx
// node 颜色, 属性更改callback
const _changeNodeColorItem = useCallback(
  // eslint-disable-next-line complexity
  (node, index) => {
    if (!node?.data?.attributes) {
      return;
    }
    const {
      attributes: { elementType, id },
    } = node.data;
    // node.setAttrByPath(['nodeBody', 'fill'], 'transparent');
    // node.setAttrByPath(['nodeBody', 'fill'], 'red'); // 设置节点
    // node.setAttrByPath(['descriptionLabelBody', 'fill'], 'green'); // 设置步
    node.setAttrByPath(["runningStep", "fill"], "transparent"); // 设置运行step

    // 过程管理页面
    if (
      pageType === SFCConst.PAGE_TYPE.PROCEDURE &&
      Number(elementType) === ESFCNodeType.NormalStep
    ) {
      const status = sfcStepToStatus[id];
      let color = _storageColor?.[`${status}`]
        ? _storageColor[`${status}`]
        : SFCUtil.getExecutionStatusColor(status);

      const { procedureList } = _baseData as SFCTypes.ISFCData_Other;

      const curUnitStepInstanceItem =
        curLevelType === SFCTypes.SFC_LEVEL.RECIPE &&
        (procedureList || [])?.find((item) => !!id && item?.sfcStepId === id);

      const { unitEquipBindType, unitEquipId } = curUnitStepInstanceItem || {};

      // unit步是否设备未绑定：未绑定则步节点不设置背景色
      const isUnitEquipNotBound =
        !!curUnitStepInstanceItem &&
        "unitEquipBindType" in curUnitStepInstanceItem &&
        unitEquipBindType !== SFCConf.EquipBindType.UNSPECIFIED &&
        "unitEquipId" in curUnitStepInstanceItem &&
        unitEquipId === "-1";

      if (!isUnitEquipNotBound) {
        // 设置步节点背景色
        node.setAttrByPath(["nodeBody", "fill"], color);
        node.setAttrByPath(["descriptionLabelBody", "fill"], color);
      }

      const runningStepColor =
        SFCUtil.getRunningStepColorByExecutionStatus(status);

      const curPhaseStepInstanceItem =
        curLevelType === SFCTypes.SFC_LEVEL.OPERATION &&
        (procedureList || [])?.find((item) => !!id && item?.sfcStepId === id);
      const { isContPhase, contPhaseFlag } = curPhaseStepInstanceItem || {};

      // phase是否是连续phase且open: 连续phase没有批次运行指示箭头
      const isOpenContPhase = !!isContPhase && contPhaseFlag === 1;

      if (runningStepColor !== "transparent" && !isOpenContPhase) {
        // 设置批次运行指示箭头颜色
        node.setAttrByPath(["runningStep", "fill"], runningStepColor);
      }
      // Todo: 跳步状态判断逻辑未知，先用undefined
      if (!status) {
        nodeBlinkHandle(node);
        node.setAttrByPath(
          ["runningStep", "fill"],
          SFCUtil.getRunningStepColorByExecutionStatus(
            BatchConst.EXECUTION_STATUS.EXECUTING
          )
        );
      }
    }

    if (
      curLevelType === SFCTypes.SFC_LEVEL.OPERATION &&
      Number(elementType) === ESFCNodeType.NormalStep
    ) {
      // 获取phase step步
      let { attributes = {} } = node.data;
      let _replacedHtml = _sfcPhaseForeignObjectContentHtml(
        attributes.description
      );
      if (_replacedHtml !== "") {
        // 修改连续phase 内容
        node.setAttrByPath(["descriptionLabel", "html"], _replacedHtml);
      }
    }
  },
  [
    curLevelType,
    pageType,
    sfcStepToStatus,
    _baseData,
    nodeBlinkHandle,
    _sfcPhaseForeignObjectContentHtml,
    _storageColor,
  ]
);
```

```tsx
const _changeNodeColor = useCallback(
  (nodes) => {
    // 开始执行_changeNodeColor时，清除闪烁背景色定时器
    if (handleNodeJumpColorTimer.current)
      clearTimeout(handleNodeJumpColorTimer.current);
    if (handleNodeTransparentTimer.current)
      clearTimeout(handleNodeTransparentTimer.current);
    // 这里树选中Phase curLevelType为空
    if (_tabKey !== "sfc" && !curLevelType) return;
    (nodes || []).forEach((_itemNode: any, idx: number) => {
      if (
        _itemNode.data?.elementType === "0" ||
        _itemNode.data?.elementType === "3"
      ) {
        _changeNodeColorItem(_itemNode, idx);
      }
    });
  },
  [_changeNodeColorItem, _tabKey]
);
```

## 详情页多页签共存可关闭功能

配方详情页多页签功能涉及到的页面如下。

```jsx
model // src/models/menuTab.ts

退出登录时详情页修改后数据未保存拦截相关 // src/layout/Account.tsx

手动点击页签右侧x，即手动删除页签 // src/layout/Header.tsx

配方管理列表删除配方后删除对应详情页页签逻辑 // src/pages/recipe/index.tsx

修改模板详情后更新opTemplateDetailModified状态，跳转拦截弹窗相关 // src/pages/library/page.tsx

修改配方详情后更新recipeDetailModified状态，跳转拦截弹窗相关，配方类修改过删除对应详情页页签逻辑 // src/pages/recipe-detail/index.tsx
```

```jsx
// 下面是动态路由的菜单栏显示逻辑及列表跳转详情逻辑

const onRowDoubleClick = useMemoizedFn((record: IPlainObject, idx: number) => {
  if (record.ID) {
    history.push({
      pathname: `/recipeDetail/${record.ID}`,
    });
  }
});

  const hasMenu = useMemo(() => {
    return (showRoutes || []).some(
      (item) =>
        item?.key?.toLowerCase?.() === curPage ||
        pathToRegexp?.(item.path!)?.test?.(location.pathname),
    );
  }, [curPage]);
```

最终采用 get 传值来实现。

```jsx
// 下面是get传值的菜单栏显示逻辑及列表跳转详情逻辑

const onRowDoubleClick = useMemoizedFn((record: IPlainObject, idx: number) => {
  const { ID, Name } = record || {};

  if (ID && Name) {
    history.push({
      pathname: `${BASE_PATH}/recipeDetail`,
      query: { id: ID, name: Name },
    });
  }
});

const hasMenu = useMemo(() => {
  // 访问配方详情页面时menu也得展示
  const handledCurPage = curPage?.split("?")?.[0];
  return (showRoutes || []).some((item) => {
    const itemKey = item?.key?.toLowerCase?.();
    return curPage === "" || itemKey === curPage || itemKey === handledCurPage;
  });
}, [curPage]);
```

tabList 遍历 map 出`<TabPane />`的地方，`tab`内容开始用得是`<Link to={tabItem.tabKey} />`，但是 TabPane 点击的时候却出现各种错误，每点击同一个 TabPane 还是会新增一个，一看 tabKey 多了个?，每点击依次都会多一个?，很奇怪，最后换成了`<span onClick={} />`，点击事件里面执行`history.push({ pathname: '/recipeDetail', query: record?.params, });`

## 详情路由（get 传值）之间相互跳转，页面不刷新问题

如下，给详情页传入 key 值，详情页页签之间切换页面能够重新挂载了，但是使用时候 props.key 会报错，只能再传个 activeKey。

```js
function mapStateProps(state: any) {
  return {
    key: state.menuTab.activeKey,
    // getDetail中使用props.key报错，只能再传个activeKey
    activeKey: state.menuTab.activeKey,
  };
}

export default connect(mapStateProps)(RecipeDetail);
```

详情页组件传入 key 后还引起一个问题，即删除最后一个详情页页签时候，跳转到列表页面功能失效。

```js
// history.push('/recipe'); // 失效，且把`mapStateProps`中的`key: state.menuTab.activeKey`注销之后又恢复正常
// history.push('/recipe'); // 同样失效

document?.location?.replace("/recipe"); // 尝试这种原生的跳转，可以实现。
```

**【问题】**
上次加了 key 值之后不知道有没有测试详情页之间来回跳转，关闭的情况，现在是用不用 hash，只有详情页传入了 key 值，就会有以下问题：

- 详情页跳转时候，页面请求的 id 不对，`location.query.id`
- 删除某个详情 tab，url 没有跳转成下一个详情页的
- 删除最后一个详情 tab 也没有跳转到列表页面

key 值不传了之后，这些问题都没有了。

**【原因】**
猜测原因：因为给详情页组件传了 key 值，`key: state.menuTab.activeKey`，所以在 model 中`history.replace`跳转到下一个详情页还没有执行到的时候，详情页组件已经重新挂载了，就导致`history.replace`没有执行成功。

**【说明】**

- 多个详情页看起来是多个，其实就是一个详情页组件实例，只是`history.listen中监听了路由变化数据`映射出了`tabList`和`activeKey`，即映射出多个详情页`TabPane标签`。

**【最终解决方案】**
key 值也不用了，重新刷新没必要，直接监听 model 中的`menuTab.activeKey`。

```tsx
// 获取列表数据
const getDetail = useMemoizedFn(() => {
  // activeKey不存在时说明访问的是非详情页，就不需要请求了
  console.log("activeKey", activeKey);

  if (!query?.id || !props?.activeKey) {
    return;
  }
  const recipeID = props?.activeKey?.split?.("id=")?.[1]?.split?.("&")?.[0];
  if (!recipeID) {
    return;
  }
  getRecipeDetail({ ID: recipeID }).then((res) => {});
});

useEffect(() => {
  getDetail();
}, [getDetail, props?.activeKey]); // 新增个监听props?.activeKey，即当前详情页tab变化后重新请求

function mapStateProps(state: any) {
  return {
    // key: state.menuTab.activeKey, // 加key会造成dispatch调用model中的'menuTab/handleTabs' effects中的 history.replace(newActiveKey);失效
    // getDetail中使用props.key报错，只能再传个activeKey
    activeKey: state.menuTab.activeKey,
    tabList: state.menuTab.tabList,
  };
}

export default connect(mapStateProps)(RecipeDetail);
```

## 详情页修改后数据未保存路由跳转拦截功能

配方详情页修改后数据未保存路由跳转拦截功能涉及到的页面如下。

```jsx
model // src/models/menuTab.ts

退出登录时详情页修改后数据未保存拦截相关 // src/layout/Account.tsx

手动点击页签右侧x，即手动删除页签 // src/layout/Header.tsx

修改模板详情后更新opTemplateDetailModified状态，跳转拦截弹窗相关 // src/pages/library/page.tsx

修改配方详情后更新recipeDetailModified状态，跳转拦截弹窗相关 // src/pages/recipe-detail/index.tsx
```

**【实现原理】**

- react-router-dom 提供了 prompt 组件，在需要进行路由跳转拦截的页面的任意地方加上 Prompt 组件，就能实现根据条件进行路由跳转的拦截

**【源码】**

```tsx
import { useIntl, Prompt, history, useHistory, connect } from "umi";

const RecipeDetail = () => {
  const [isHoldUpRouter, setIsHoldUpRouter] = useState<boolean>(true); // 是否限制路由跳转权限
  const [pathUrlWillTo, setPathUrlWillTo] = useState<any>();
  const [confirmModalVisible, setConfirmModalVisible] =
    useState<boolean>(false);

  const handleAccountExit = useMemoizedFn(() => {
    props?.handleAccountExit?.(true);
  });

  useEffect(() => {
    if (!isHoldUpRouter) {
      // console.log('pathUrlWillTo', pathUrlWillTo);
      if (pathUrlWillTo) {
        // 如果目标路径是登录页面 且 刚刚点击了退出按钮，则走<Account />页面退出登录逻辑，否则手动跳转页面
        if (pathUrlWillTo?.["pathname"] === "/login" && readyToLogout) {
          handleAccountExit();
        } else {
          history.push(pathUrlWillTo); // 手动跳转
        }
      }
      setIsHoldUpRouter(true); // 跳转后限制路由跳转权限，不然会死循环
    }
  }, [isHoldUpRouter, pathUrlWillTo, readyToLogout, handleAccountExit]);

  const handleModalOk = useMemoizedFn(() => {
    setConfirmModalVisible(false);
    setIsHoldUpRouter(false); //  释放路由跳转权限
    // 这里本来应该跟模板管理页面的handleModalOk里面一样去清空tabInfoModifiedMap的，但是因为本页面监听activeKey变化的useEffect中执行了handleIsInfoSaved('all')，也是清空了tabInfoModifiedMap

    if (toDeleteTabKey) {
      dispatch?.({
        type: "menuTab/handleDeleteTab",
        payload: {
          tabKey: toDeleteTabKey,
          jumpToRecipeList: true,
        },
      });
      dispatch({
        type: "menuTab/setMenuTab",
        payload: {
          toDeleteTabKey: "",
        },
      });
    }
  });

  const handleModalCancel = useMemoizedFn(() => {
    setConfirmModalVisible(false);
    // 若是因为点击退出登录而弹出来的拦截弹窗，点击取消后需要重置readyToLogout的值
    if (readyToLogout) {
      dispatch({
        type: "menuTab/setMenuTab",
        payload: {
          readyToLogout: false,
        },
      });
    }
  });

  return (
    <div>
      <RecipeDetailContext.Provider value={contextProviderValue}>
        <div>
          // xxx
          <Button
            type="primary"
            loading={saveLoading}
            onClick={onSaveInfo}
            disabled={disabled || !isRecipeDetailModified}
          >
            保存
          </Button>
        </div>

        <Prompt when={isHoldUpRouter} message={handleRouterHoldUp} />

        <Modal
          title="提示"
          closable={false}
          maskClosable={false}
          open={confirmModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
        >
          <span>数据还没保存，确定离开吗？</span>
        </Modal>
      </RecipeDetailContext.Provider>
    </div>
  );
};
```

## 导入导出 CSV 文件

- 配方编辑器客户端导出的 CSV 文件用`NotePad++`打开，发现格式为`Windows(CR LF)` `GB2312(Simplified)`，而 web 端导出的发现格式为`Windows(CR LF)` `UTF-8-BOM`

- 导入 CSV 文件源码

- 导出 csv 如何设置格式

```jsx
// Blob流方式

// 如果不加"\ufeff"会是utf-8格式，加了变成utf-8-BOM
const blob = new Blob(["\ufeff", data], {
  type: "text/csv",
});
const link = document.createElement("a");
link.href = URL.createObjectURL(blob);

// url方式方式
const url = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(merged);
const link = document.createElement("a");
link.href = url;
```

- 目前，web 端采用`exportCSVTwo`方法来导出编码格式为`UTF-8-BOM`的 csv 文件，

  - 此时 web 导入这个文件，也是能成功识别的，
  - web 导入客户端导出的编码格式为`GB2312(Simplified)`csv 文件，是能正常识别的
  - 问题是 web 端导出的 csv 文件，在客户端导入，会报错`序号1：原料性质属性错误`，如果手动将改文件记事本方式打开另存为选择编码格式为`ANSI`（设置后打开就能发现就是`GB2312(Simplified)`格式）就能够在客户端正常的导入。

- 导出 csv
  - 需要借助一个`shotgun.js.charsets.all.min.js`的库
  - 这个库是编译后的代码，没法 require 引入使用，只能通过设置 script 方式引入，即`umi.headScripts`，既支持文件，也支持代码

```ts
// config/config.ts
{
  headScripts: [
    {
      content: `function __extends(a, b) {
        return undefined;
      }
      window.__extends = __extends;
      window.String.isNullOrEmpty = function (n) {
        return !(n || false);
      };`,
    },
    {
      src: `${
        IS_DEV ? "/" : "/batch-web-recipeeditor/"
      }js/shotgun.js.charsets.all.min.js`,
    },
  ];
}
```

```tsx
// @\components\exportBtn\utils\convert2csv.ts
class JsLibary {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-useless-constructor
  constructor() {}
  public isNullOrEmpty(n: any) {
    return !(n || false);
  }
  public createUint8Array(e: Iterable<number>) {
    return new Uint8Array(e);
  }
}
if ((window as any).Shotgun.Js) {
  (window as any).Shotgun.Js.Library = new JsLibary();
}

function createObjectfromBuffer(
  buffer: BlobPart[],
  type: string,
  endings?: any
) {
  let _blob = new Blob(buffer, {
    type,
    endings,
  });
  let _obj = window.URL.createObjectURL(_blob);
  window.open(_obj);
  setTimeout(() => {
    window.URL.revokeObjectURL(_obj);
  }, 20000);
}

const workSheet = XLSX?.utils?.aoa_to_sheet?.(sheetDataSource);

const workBook = XLSX.utils.book_new();

const csv = XLSX.utils.sheet_to_csv(workSheet, {
  FS: ",",
  RS: "\r\n",
});

const handledCSV = csv + "\r\n"; // 结尾不加"\r\n"，客户端导入会不成功

const _outData = (window as any)?.Shotgun?.Js?.Charsets?.toGB2312Bytes?.(
  handledCSV
);
createObjectfromBuffer([_outData], "text/csv");
```

```tsx
// 三种导出测试实现，一、二可以导出，但是导出的csv只能web端导入，客户端导入不了（报错第一行性质属性有问题），
// 即导出编码格式还有问题，需要手动另存为时修改编码格式
// 最终借助shotgun依赖来解决
const exportCSVFisrt = (data = "") => {
  const merged = data;
  const url = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(merged);
  // const url =
  //   'data:text/csv;charset=gb2312,\ufeff' + encodeURIComponent(merged);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

function exportCSVTwo(data = "") {
  const handledData = data + "\r\n";
  const blob = new Blob(["\ufeff", handledData], {
    // type: 'application/vnd.ms-excel;charset=utf-8;',
    type: "text/csv",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportCSVThree() {
  const testThreeHeader = colTitles.join(",") + "\r\n";

  const testThreeSource = dataSource
    .map(
      (record, index) =>
        colDataIndexs
          .map((dataIndex) => {
            if (["id", "idx"].includes(dataIndex)) {
              return index + 1;
            }
            return record[dataIndex];
          })
          .join(",") + "\r\n"
    )
    .join("");
  const finalStr = testThreeHeader + testThreeSource;
  const blob = new Blob(["\uFEFF" + finalStr], {
    // type: 'text/plain;charset=utf-8;',
    type: "text/csv",
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
```

## phase 程序列表五列的值不是直接返回，而是只返回一个二进制合成值

**【问题描述：】** 有五列都是 checkbox 列，详细列如下。DataSource 中这五列都没有返回相应 key。

五列及自命名的 key 值

- 放弃后释放（`releaseAfterAbandon`）
- 完成后释放（`releaseAfterComplete`）
- 保持后释放（`releaseAfterKeep`）
- 暂停后释放（`releaseAfterPause`）
- 停止后释放（`releaseAfterStop`）。

**【问题询问：】**
询问后端后，`FeedBack:` 只返回一个字段`releaseFlag`，值是个数字，每列对有一个二进制的位数，每列的值对应该位数上的二级制数值，计算后相加得到`releaseFlag`的数字值。例如：21 这个十进制值 = 2^0 + 2^2 + 2^4。

五列及自命名的 key 值、及后端返回的十六进制枚举。

- 放弃后释放（`releaseAfterAbandon`）：0x00
- 完成后释放（`releaseAfterComplete`）：0x01
- 保持后释放（`releaseAfterKeep`）：0x02
- 暂停后释放（`releaseAfterPause`）：0x03
- 停止后释放（`releaseAfterStop`）：0x04

**【Ask: 】**

- 关键咋从`releaseFlag: 21`，反推出来，五个列各自的值呢?
- 异或一下就能知道了，假设一个二进制 10010，你要知道第五位是不是 1，你与上个 10000 就可以了。即：`flag & (1 << 4)`
  - 21 的二进制是 10101，你要取出这几位是否为 1 ，分别移位，加上&运算就行了
  - 设置的时候用或运算，判断用与运算，取消用异或运算
- 想知道二进制数的第 N 位是 0 还是 1，就把 flag 的值右移 N 位，然后 跟 1 & 一下看是 0 还是 1

**【自测分析 】**

假设五列的值依次为 0、1、0、1、1（0 代表 checkBox 是选中 True，1 代表 checkBox 是未选中 false），则 `releaseFlag = 26 = 0*(2^0) + 1*(2^1) + 0*(2^2) + 1*(2^3) + 1*(2^4) = 2 + 8 + 16 = 26`

- 第 1 位值判断：`(26 >> 0) & (0x01) = 0`, 即值为 0
- 第 2 位值判断：`(26 >> 1) & (0x01) = 1`, 即值为 1
- 第 3 位值判断：`(26 >> 2) & (0x01) = 0`, 即值为 0
- 第 4 位值判断：`(26 >> 3) & (0x01) = 1`, 即值为 1
- 第 5 位值判断：`(26 >> 4) & (0x01) = 1`, 即值为 1

```tsx
const isReleaseAfterColumn = [
  "releaseAfterAbandon",
  "releaseAfterComplete",
  "releaseAfterKeep",
  "releaseAfterPause",
  "releaseAfterStop",
]?.includes(item.dataIndex);

if (isReleaseAfterColumn) {
  checkedValue = ((record?.["releaseFlag"] >> item?.binaryIndex) & 0x01) === 1;
}
```

```tsx
const onCheckBoxChange = useMemoizedFn((e: any, item: any, record: any) => {
  const { dataIndex, binaryIndex } = item || {};
  const isChecked = e?.target?.checked;
  let curSelectedNodeId = selectedKey?.split?.("#")?.[1];
  if (typeof isChecked !== "boolean" || !curSelectedNodeId) {
    return;
  }
  // xx后释放等五列编辑时，需要重新计算字段releaseFlag的值
  if (
    releaseAfterColumnDataIndex?.includes(dataIndex) &&
    "binaryIndex" in item
  ) {
    const beforeFiveColumnValues = [0, 1, 2, 3, 4].map(
      (item) => (record?.["releaseFlag"] >> item) & 0x01
    );
    const curReleaseAfterColumnLatestValue = isChecked ? 1 : 0;
    const latestFiveColumnValues = beforeFiveColumnValues.map((item, index) => {
      if (index === binaryIndex) {
        return curReleaseAfterColumnLatestValue;
      }
      return item;
    });
    const latestReleaseFlag = latestFiveColumnValues.reduce(
      (total, item, index) => {
        return total + item * Math.pow(2, index);
      },
      0
    );
    handleUpdateProcedureRecord("releaseFlag", latestReleaseFlag, record);
    return;
  }
  handleUpdateProcedureRecord(dataIndex, isChecked, record);
});
```

**【其它 】**

```tsx
const setBit = (x, y) => (x |= 1 << y); // 将x的第y位置1
const clearBit = (x, y) => (x &= ~(1 << y)); // 将x的第y位清0
const isBitTrue = (x, y) => (x >> y) & 0x01; // x的第y位是否为1
```

## 在事件 A 中手动触发按钮的点击事件 B

**【问题描述】**

最开始的实现是`ImportBtn`组件放在第一个`ContextMenuItem`组件下。但是因为右键菜单组件`ContextMenu`弹出右键菜单 modal 后，点击菜单中的导入按钮时，会触发`ContextMenu`组件内部的事件，导致弹窗关闭且销毁，导致`ImportBtn`组件也销毁了，根本没来得及触发弹出导入文件的文件选择框，且就算文件选择框弹出来了，`ImportBtn`组件都卸载了，无法走处理导入文件的逻辑。

**【最终实现】**

最后改成`ImportBtn`组件放在外面，绝对定位并隐藏。点击右键菜单的导入时，用代码去触发`<input type='file' />`的点击事件。

```tsx
const ProcessParam = () => {
  const onClickImport = useMemoizedFn(() => {
    const processParamImportBtnEle = document?.getElementById?.(
      "processParamImportBtn"
    );
    // 直接点击processParamImportBtnEle.click?.()不行，因为这只是`<input type='file' />父组件。
    if (processParamImportBtnEle) {
      const inputImportBtn = processParamImportBtnEle?.querySelector?.("input");
      inputImportBtn?.click?.();
    }
  });

  return (
    <div ref={containerRef}>
      <ImportBtn
        id="processParamImportBtn"
        ref={importBtnRef}
        style={{
          position: "absolute",
          zIndex: -100,
        }}
        accept={ACCEPT_FILE_TYPE_CSV}
        onImport={handleImport}
      >
        导入
      </ImportBtn>
      <ContextMenu
        ref={contextMenuRef}
        contextMenuNode={
          <>
            <ContextMenuItem onClick={onClickImport}>导入</ContextMenuItem>
            <ContextMenuItem onClick={handleExport}>导出</ContextMenuItem>
          </>
        }
      >
        <EditTable />
      </ContextMenu>
    </div>
  );
};
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

## 打开多个浏览器标签页，退出登录后其它标签页登录状态未同步

**【问题描述】**：
登录后打开两个浏览器标签页 A 和 B，访问页面，B 页面退出登录后，打印`model/user`中的`{ user, userId }`能发现清空了，打开`Application-LocalStorage`同样发现登录信息清空了，但是回到 A 页面，能够发现`Application-LocalStorage`中也没有登录信息，但是路由跳转任然能打印`model/user`中的`{ user, userId }`；若 A 页面此时刷新页面任然会正常跳转到登录页面。

`得到结论：同一域名下多个浏览器标签页LocalStorage是共享的，但是Model却是独立的`。

**【问题原因】**：
`V0`版本登录没有 Token 机制，路由跳转变化时是先判断 model 中的登录状态，如果没有，再从`LocalStorage`取，如果还是没有则跳转到登录页。

**【解决方案】**：

- 1. 登录接口配置`Token`机制，Token 保存在`LocalStorage`，每个接口请求之前都带上，若请求的返回状态码是 401，则清空登录状态并跳转到登录页
- 2. 路由跳转前，不管`Model`中有没有登录状态，只要`LocalStorage`中没有，就跳转登录页（清空`Model`登录状态，如果有的话）

## 刷新页面的时候去重新获取配置信息

**【问题描述】**：

因为页面一刷新 model 中存的数据都清空了，所以想要在页面刷新时候重新获取数据，如何监听页面刷新呢？

**【解决方案】**：

- 方法一: Dva model 中`subscriptions.setup`中 return 之前调用 effects，每次刷新页面都会触发

```tsx
{
subscriptions: {
    setup({ history, dispatch }) {
      // 刷新页面时获取最新权限
      dispatch({
        type: 'getLatestPermission',
      });
      return history.listen(({ pathname }) => {
        dispatch({
          type: 'authUser',
          payload: {
            pathname,
            history,
          },
        });
      });
    },
  }
}
```

- 方法二：入口组件`App`中页面挂载之后去调用 各个 Model 中相应的 effects（目前采用这种）

```tsx
function mapStateProps(state: any) {
  return {
    user: state.user,
  };
}

function mapActionProps(dispatch: any) {
  return {
    // 页面刷新后重新获取某些数据：权限信息、单位配置信息
    refreshGetLatestData: (payload: any) => {
      dispatch({
        type: "user/getLatestPermission",
      });
      dispatch({
        type: "common/fetchUnitConfigs",
        payload,
      });
    },
  };
}

export default connect(mapStateProps, mapActionProps)(App);
```
