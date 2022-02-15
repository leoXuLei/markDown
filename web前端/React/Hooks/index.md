# 自定义 Hook

## 实例一

## 实例二

```jsx
import { getOriginalTaskInitInfo } from 'client/ekko/services/original-task'
import { useCallback, useEffect, useState } from 'react'

export function useOriginalStateFlow() {
  const [info, setInfo] = useState<IOriginalTaskInit>()
  const refresh = useCallback(async () => {
    const response = await getOriginalTaskInitInfo()
    if (response.success) setInfo(response.result)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return info?.flow
}


const flow = useOriginalStateFlow()
// 这种自定义hook的请求，只要使用该hook的组件挂载都会触发重新请求（甚至是更新渲染的时候）
```

# 基本 Hook

## useState 【维护状态】

setSprintIdList 之前做一些同步操作

```jsx
const sprintFilterFun = (v) => handledSprintIds?.includes(v);

setSprintIdList((prev) => {
  const latest = [...prev.filter(sprintFilterFun)];
  updateParamRef("sprintIdList", latest);
  return latest;
});
```

### Tips

- 一个 state 受另一个 state 影响用 useEffect 去监听去处理，一个值受另一个 state 影响用 useMemo 去监听去处理，（state 是会有主动更新的，值是只有被动更新的）

- **一个 state 状态：B 只有某些情况才随着另一个 state 状态：A 的变化而变化:**
  使用 setState 的`(prev) => {... return xxx}`形式去更新 A，并在其中判断情况去更新 B

```jsx
// 重置右侧文件夹的各种状态
const resetFolderState = useCallback(() => {
  setActiveFolderItems([]);
  setSelectedFolderItem(projectDefaultFolder);
  // setFolderColumnList只能在这里，若在监听selectProject的useEffect中写，
  // 上个选择的空间下展开了几列文件夹，最新选择的空间下就会请求这几列文件夹的详情数据，
  // 但是显然刚切换空间，只希望请求第一列root根文件夹
  setFolderColumnList([projectDefaultFolder]);
}, []);

const onSelectProject = useCallback(
  (project) => {
    setSelectProject((prev) => {
      // 切换不同空间、重置状态
      if (project.id !== prev?.id) {
        resetFolderState();
      }
      return project;
    });
  },
  [resetFolderState]
);

const retSelectProject = useCallback(() => {
  if (context.project) {
    onSelectProject(context.project);
  }
}, [context.project, onSelectProject]);
```

## useEffect【完成副作用操作】

# 额外的 Hook

## useCallback【缓存函数】

```js
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

返回一个 memoized 回调函数。==把内联回调函数及依赖项数组作为参数==传入 useCallback，它将返回该回调函数的 memoized 版本，==该回调函数仅在某个依赖项改变时才会更新==。当你把回调函数传递给经过优化的并使用引用相等性去避免非必要渲染（例如 shouldComponentUpdate）的子组件时，它将非常有用。

==`useCallback(fn, deps)` 相当于 `useMemo(() => fn, deps)`==。

### 实例一

```js
const prevDef = useCallback((e) => {
  e.stopPropagation();
  e.preventDefault();
}, []);

// 恢复空间
const recoverProject = useCallback(
  (e) => {
    prevDef(e);
    // 删除空间和恢复空间的权限保持一致
    canDel && handleRecover?.({ id, name });
  },
  [prevDef, id, canDel, name, handleRecover]
);
```

### 实例二

```jsx
const loadData = useCallback(
    async (selectedOptions: IOption[]) => {
      console.log(
        '！！！！！！！！！selectedOptions :>> ',
        JSON.parse(JSON.stringify(selectedOptions)),
      )
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true

      let sprintsRes
      if (modeIsEdit) {
        // 当前空间下当前迭代可以去关联的迭代列表
        const canBeRelatedSprintsRess: IBasicApi<
          CanBeRelatedSprintItemVO[]
        > = await getCanBeRelatedSprintList(targetOption.value!, sprintId!)
        sprintsRes = canBeRelatedSprintsRess
      } else {
        // 空间列表下的迭代列表
        const allSprintsRess: IBasicApi<IPageApi<ISprintListItem[]>> = await getSprintList(
          targetOption.value!,
        )
        sprintsRes = allSprintsRess
      }
      const sprintsContent = (modeIsEdit ? sprintsRes?.result : sprintsRes?.result?.content) || []

      const sprintsData = sprintsRes?.success! ? sprintsContent : []

      // const projectSprintsOptions: IOption[] = content?.map((projectItem, index) => {
      //   const { id, name } = projectItem
      //   return {
      //     value: id,
      //     label: name,
      //   }
      // })
      targetOption.children = sprintsData?.map((sprintItem) => ({
        value: sprintItem?.id,
        label: sprintItem?.name,
      }))
      console.log('loadData targetOption:>> ', JSON.parse(JSON.stringify(targetOption)))
      console.log('loadData  options :>> ', JSON.parse(JSON.stringify(options)))
      setOptions([...options])
    },
    [modeIsEdit, sprintId, options],
    // 如果依赖项里面不加options ，那么 setOptions([...options]) 取得options不是 最新的useState的options，而是初始化时候的值 []

    // 由此可见，只要useCallBack里面用到的所有变量（当然包含含函数）都需要加入依赖项，state值也不除外，不然就是第一次初始化时候的值，取不到最新值
  )
```

## useMemo 【缓存值】

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

> **定义：**
> 返回一个 memoized 值。==把“创建”函数和依赖项数组作为参数传入 useMemo==，它==仅会在某个依赖项改变时才重新计算 memoized 值==。这种优化==有助于避免在每次渲染时都进行高开销的计算==。

> **规则：**

- 记住，==传入 useMemo 的函数会在渲染期间执行。请不要在这个函数内部执行与渲染无关的操作==，诸如副作用这类的操作属于 useEffect 的适用范畴，而不是 useMemo。
- ==如果没有提供依赖项数组，useMemo 在每次渲染时都会计算新的值==。

- 你可以把 useMemo 作为性能优化的手段，但不要把它当成语义上的保证。==将来，React 可能会选择“遗忘”以前的一些 memoized 值，并在下次渲染时重新计算它们==，比如为离屏组件释放内存。先编写在没有 useMemo 的情况下也可以执行的代码 —— 之后再在你的代码中添加 useMemo，以达到优化性能的目的。

### 实例一

```jsx
// 收藏空间
  const starProject = useMemo(() => {
    if (project?.detail?.isCollectionItems) {
      return (
        <Tooltip title={i18n.cancelColleation}>
          <div
            className="star-project be-collection"
            onClick={() => addOrRemoveColleactionProject(project?.detail!, false)}
          >
            <StarFilled />
          </div>
        </Tooltip>
      )
    } else {
      return (
        <Tooltip title={i18n.colleaction}>
          <div
            className="star-project"
            onClick={() => addOrRemoveColleactionProject(project?.detail!, true)}
          >
            <StarOutlined />
          </div>
        </Tooltip>
      )
    }
  }, [addOrRemoveColleactionProject, i18n.cancelColleation, i18n.colleaction, project])
```

### 实例二

```jsx
const handledData = useMemo(
  () =>
    (data || [])?.reduce((t: any[], item) => {
      const { executor, executorId, orgName, requirementDevelopDetailList } =
        item;
      const summaryItem = {
        executor,
        orgName,
        executorId,
        ...(requirementDevelopDetailList?.shift() || {}),
        date: "汇总",
      };
      return t.concat(
        summaryItem,
        requirementDevelopDetailList?.map((detailItem) => ({
          ...detailItem,
          executorId: `${executorId}${detailItem.date}`,
        }))
      );
    }, []),
  [data]
);
```

## useRef 【访问 DOM/存数据】

> **定义：**
> useRef 返回一个可变的 ref 对象，==其 .current 属性被初始化为传入的参数（initialValue）==。返回的 ref 对象在组件的整个生命周期内持续存在。

```js
const refContainer = useRef(initialValue);
```

一个常见的用例便是命令式地访问子组件：

```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` 指向已挂载到 DOM 上的文本输入元素
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

==本质上，useRef 就像是可以在其 .current 属性中保存一个可变值的“盒子”==。

你应该熟悉 ref 这一种[访问 DOM](https://zh-hans.reactjs.org/docs/refs-and-the-dom.html) 的主要方式。如果你将 ref 对象以 `<div ref={myRef} />` 形式传入组件，则无论该节点如何改变，React 都会将 ref 对象的 .current 属性设置为相应的 DOM 节点。

然而，useRef() 比 ref 属性更有用。它可以很方便地保存任何可变值，其类似于在 class 中使用实例字段的方式。

这是因为它创建的是一个普通 Javascript 对象。==而 useRef() 和自建一个 {current: ...} 对象的唯一区别是，useRef 会在每次渲染时返回同一个 ref 对象==。

请记住，==当 ref 对象内容发生变化时，useRef 并不会通知你。变更 .current 属性不会引发组件重新渲染==。如果想要在 React 绑定或解绑 DOM 节点的 ref 时运行某些代码，则需要使用回调 ref 来实现。

### 实例一

Ref 改变更新.current 属性不会引发组件重新渲染，但是某些用到 ref 的 useCallback 或者 useMemo 中若使用到了 ref.current 对象中的某些属性（假设为属性 A），也需要在依赖数组中加入属性 A，不然的话 A 变了没发触发 useCallback 和 useMemo 的更新
==【出现这种情况，说明 state 设置或者管理的有问题，优化一下代码】==

```jsx
const searchTypeRef = useRef < any > null; // 搜索类型ref

// 渲染树
const treeData = useMemo(() => {
  if (!businessLineTree.businessLine) return [];
  // 在新建时保持原先展开的节点
  const newExpandedKeys = !searchValue ? [...expandedKeys] : [];
  console.log("newExpandedKeys :>> ", !searchValue, newExpandedKeys);
  console.log("根节点object :>> ", businessLineTree?.businessLine);
  setLoading(true);
  const treeData =
    searchTypeRef.current === "staff" // 这里使用到了searchTypeRef.current，所以需要监听这个ref，且.current是个基础类型就直接监听searchTypeRef.current
      ? [
          transformBusinessTreeForStaff(
            businessLineTree?.businessLine,
            newExpandedKeys,
            null
          ),
        ]
      : [
          transformBusinessTreeForLine(
            businessLineTree?.businessLine,
            newExpandedKeys,
            null
          ),
        ];
  setExpandedKeys([...newExpandedKeys, "com_root"]);
  setTimeout(() => {
    setLoading(false);
  }, 100);
  return treeData.filter(Boolean);
}, [
  businessLineTree.businessLine,
  transformBusinessTreeForLine,
  transformBusinessTreeForStaff,
  setExpandedKeys,
  searchValue,
  searchTypeRef.current, // 不加这个监听，searchTypeRef.current变了之后该useMemo不会触发更新
]);
```

ref 作为 props 传递给子组件也是同理，不会引起子组件重新渲染（跟子组件用没用 memo 包裹也没关系），根本原因是父组件都没有重新渲染，即 Ref 改变更新.current 属性不会引发组件重新渲染

```jsx
<WorkTypeFilter
  workTypeConfigs={approvalTypeList}
  // value={approvalTypeIds}
  value={[...(paramRef.current?.commonApprovalType || [])]}
  onChange={(value) => {
    // setApprovalTypeIds
    console.log("value", value);
    paramRef.current = {
      ...paramRef.current,
      commonApprovalType: value,
    };
  }}
/>
```

### 实例二： 非受控 input 输入框获取值、设置值

- ref 获取 input 值： `inputRef.current?.state?.value`
- ref 设置 input 值： `inputRef.current?.setValue?.('')`

```jsx
const inputRef = useRef<any>(null) // 搜索内容或贴入内容inputRef


const handleInputChange = useCallback(
    useDebounce(() => {
      searchContentLinkMatch(inputRef.current?.state?.value)
    }, 300),
    [],
  )

const handleLinkContent = async (item, type: string) => {
  const params = {
    type,
    contentId: item?.id!,
    detail: item,
  }
  props?.handlePasteURLLinkContent?.(params)
  inputRef.current?.setValue?.('') // 关联后将input框清空
  setMatchResult(undefined)
}

render (
  <Input
    // autoFocus
    ref={inputRef}
    bordered={false}
    allowClear
    placeholder={placeholder}
    onChange={handleInputChange}
    onPressEnter={handleInputChange}
  />
)

```

### 实例三： 实例二 结合 useDebounce

需求如下：

- 两个输入框其中一个输入有值，另一个清空

如下，注释的代码表面之前两个 inputSearch 值读写用的是 useState，虽然使用了`handleSearch`这个防抖方法，但是不起作用，因为 onChange 有`// setLineSearchValue(value)`这种更新 state 的操作，防抖就不会生效，而换成下面这种 input 的 ref 的写法，防抖就能生效（即使`handleSearch`方法中也有 setState 的操作）。

```jsx
// 搜索业务线/空间
const handleSearch = useDebounce((value, searchType) => {
  // searchTypeRef.current = searchType
  setSearchType(searchType); // 更新搜索类型
  // 用refMap去更新麻烦，没必要，直接 setSearchValue(value?.trim?.()) 更简单
  // const refMap = {
  //   line: lineSearchInputRef,
  //   project: projectSearchInputRef,
  // };
  // setSearchValue(refMap?.[searchType]?.current?.state?.value?.trim?.());
  setSearchValue(value?.trim?.());
  console.log("value :>> searchType ", value, searchType); // 防抖生效，最多500ms打印一次
}, 500);

return (
  <div className="search-wrapper">
    <Input.Search
      placeholder="搜索业务线"
      // loading={loading && searchTypeRef.current === 'line'}
      // value={lineSearchValue}
      loading={loading && searchType === "line"}
      ref={lineSearchInputRef}
      onChange={(e) => {
        const value = e?.target?.value;
        // setLineSearchValue(value)
        // setProjectSearchValue('')
        projectSearchInputRef.current?.setValue?.(""); // 将空间输入框清空

        console.log("冲冲冲 :>> "); // 这里每次onChange都会触发
        handleSearch(value, "line");
      }}
      className="businessline-input"
    />

    <Input.Search
      placeholder="搜索空间"
      // loading={loading && searchTypeRef.current === 'project'}
      // value={projectSearchValue}
      loading={loading && searchType === "project"}
      ref={projectSearchInputRef}
      onChange={(e) => {
        const value = e?.target?.value;
        // setProjectSearchValue(value)
        // setLineSearchValue('')
        lineSearchInputRef.current?.setValue?.(""); // 将业务线输入框清空
        handleSearch(value, "project");
      }}
    />
  </div>
);
```

### Tips

- useRef 用来保存值的话只能在本组件用，如果传递给子组件，子组件都不会更新，因为父组件都没有更新就更不提子组件了，因为`useState 值的更新会触发组件重新渲染，而 useRef 的 current 不会触发重新渲染。`，所以在本组件用作保存表单控件的值是蛮好的。

## useContext 【使用共享状态】

> **为什么使用**
> 考虑到组件有可能层层嵌套 ，在传 props 的过程中，如果书写大量的 `...props 或 propName={this.props.propValue}` 会导致代码灰常丑陋
> Context 提供了一个无需不必显式地通过组件树 的逐层传递 props，就能在组件树间进行数据传递的方法。

### 实例一：文件夹功能完整实例

```jsx
// ./contexts/resource-action-context.tsx
import { createContext, useContext } from 'react'

export interface IResourceActionContext {
  createFolder: () => Promise<IResource | undefined>
  remove: (args: { list: IResource[] }) => Promise<boolean>
  rename: (args: { resourceId: string; fileName: string }) => Promise<boolean>
  upload: (args?: { resourceId?: string; multiple?: boolean }) => Promise<boolean>
}

// @ts-ignore // 没有这个creteContext没有默认参数会报错
export const ResourceActionContext = createContext<IResourceActionContext>()


// useContext使用 context
export function useResourceAction() {
  return useContext(ResourceActionContext)
}
```

```jsx
// index.tsx
// 根组件中使用生产者提供属性/方法
function Index() {

/** 删除文件 */
  const remove = useCallback<IResourceActionContext['remove']>(
    async ({ list }) => {
      if (!projectId) return false

      const notEmptyFolders = list.filter(
        // 判断是不是空文件夹逻辑的字段取错了，没有subResources，只有hasSubResources，后面会修改
        (item) => item.subResources && item.subResources?.length > 0,
      )

      if (notEmptyFolders.length > 0) {
        confirm({
          title: '移到回收站',
          icon: <ExclamationCircleOutlined />,
          content: `无法删除以下非空文件夹：\n${notEmptyFolders
            .map((item) => item.name)
            .join('\n')}`,
          okText: '确定',
          cancelText: '取消',
        })

        return false
      }

      const fileInfo = handledSelectedFilesInfo(list)

      confirm({
        title: '移到回收站',
        icon: <ExclamationCircleOutlined />,
        content: `你确定要把 ${fileInfo.join(' 和 ')}移到回收站吗？`,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          const keys = list.map((item) => item.id)
          const res = await removeBatchResources(projectId, keys)
          if (!res.success) {
            await refresh()
            return
          }

          setResourceList((prevList) => (prevList as any).filter((res) => !keys.includes(res.id)))
        },
      })
      return true
    },
    [projectId, refresh, setResourceList],
  )


   /** 创建文件夹 */
  const handleCreateFolder = useCallback<IResourceActionContext['createFolder']>(async () => {
    if (!projectId) return

    const res = await createFolder(projectId, '新建文件夹', parentId)
    if (!res.success) return

    setResourceList((prevList) => [...prevList, res.result] as any)

    return res.result
  }, [projectId, parentId, setResourceList])

  /** 文件重命名 */
  const rename = useCallback<IResourceActionContext['rename']>(
    async ({ resourceId, fileName }) => {
      if (!projectId) {
        return false
      }

      const res = await renameResource(projectId, resourceId, fileName)

      if (!res.success) return false

      setResourceList((prevList) => {
        return prevList.map((item) => ({
          ...item,
          name: item.id === resourceId ? fileName : item.name,
        }))
      })
      // await refresh()
      notification.success({ message: '重命名成功' })

      return true
    },
    [projectId, setResourceList],
  )


  const handleUpload = useCallback<IResourceActionContext['upload']>(
    async ({ resourceId, multiple = false } = {}) => {
      const destination = await getDestination()

      if (!projectId || !destination) return false

      const options: CreateOptions = {
        destination,
        formatServerResponse: (response) =>
          resolveUpload({ response, projectId, parentId, resourceId }),
      }

      // 批量上传
      // 这里可能需要重新
      if (multiple) {
        // showFileUpload(options)
      } else {
        const files = await selectFiles({ multiple: false })
        if (files?.length === 0) return false
        setNewLoading(true)
        const bizUrl = await fileUploadWithKong(files[0])
        // 保存文件到项目
        if (bizUrl) {
          const result = await createBatchResources(projectId, [
            {
              parentId,
              resourceId,
              contentType: files[0].type,
              fileId: bizUrl,
              name: files[0].name,
              size: files[0].size.toString(),
            },
          ]).finally(() => setNewLoading(false))
          if (result.success) {
            notification.success({
              message: '上传成功',
              placement: 'bottomRight',
            })
            await refresh()
          }
        }
      }
      return true
    },
    [parentId, projectId, refresh],
  )

  const actions = useMemo(
    () => ({
      rename,
      createFolder: handleCreateFolder,
      remove,
      upload: handleUpload,
    }),
    [handleCreateFolder, handleUpload, remove, rename]
  );

  return (
    <ResourceActionContext.Provider
      value={actions}
    ></ResourceActionContext.Provider>
  );
}
export default Index;
```

```jsx
// 消费者通过useContext使用属性/方法
import { useResourceAction } from '../contexts/resource-action-context'


export const ResourceItem = React.memo(
  ({ resource, selected, viewType, onSelect }: IResourceItemProps) => {
    const { rename, remove, upload } = useResourceAction()

    const handleDelete = useCallback(() => {
      remove({ list: [resource] })
    }, [remove, resource])

    const handleUpdate = useCallback(async () => {
      upload({ multiple: false, resourceId: resource.id })
    }, [upload, resource.id])

    return(
      // ...
    )
  }
）
```

### 实例二：依赖数组监听 context 某个属性

如下图代码，context 生产者返回的是一个对象，每次渲染更新返回的对象一定是新的，但是里面的属性如`context?.staffList`可能任然是旧的对象，也就是如下写法的时候是能够比监听`context`范围更小更精确的，能避免 staffList 没变而其它属性变了导致这个 useMemo 重新计算渲染的问题产生。但是由于依赖提示插件问题，依赖数组任然会警告如下：没关系，插件的问题。

```text
React Hook useMemo has a missing dependency: 'context'. Either include it or remove the dependency array.eslint(react-hooks/exhaustive-deps)
```

```jsx
const context = useContext(MembersContext)

// 员工列表
  const staffList = useMemo<IStaffInfo[]>(() => {
    const items =
      context?.staffList?.map((i, idx) => ({
        key: `${idx}-${i.staffId}`,
        name: {
          realName: i.name,
          comName: i.comName,
        },
        staffId: i.staffId,
        roles: i.roleList,
      })) || []
    return items.filter(
      (v) =>
        v?.name?.comName?.toLowerCase?.()?.includes?.(searchValue) ||
        v?.name?.realName?.toLowerCase?.()?.includes?.(searchValue),
    )
  }, [context?.staffList, searchValue])
```

context 生产者如下

```jsx
<MembersContext.Provider
  value={{
    node: beSelectedBus,
    staffList,
    loading: fetchStaffLoading,
    handleDel: delStaff,
    handleBatchDel: batchDelStaff,
    handleBatchMoveTo,
    changeRole,
  }}
>
  <Drawer
    width={"45vw"}
    destroyOnClose
    title={<BusinessLineHeader addStaff={addStaff} node={beSelectedBus} />}
    visible={drawerVisible}
    closable={false}
    onClose={() => setDrawerVisible(false)}
    maskClosable
  >
    <StaffTable />
  </Drawer>
</MembersContext.Provider>
```

### 实例三：两个 context 同时使用

```jsx
const obj = {
  value: 1,
};
const obj2 = {
  value: 2,
};

const ObjContext = React.createContext(obj);
const Obj2Context = React.createContext(obj2);

const App = () => {
  return (
    <ObjContext.Provider value={obj}>
      <Obj2Context.Provider value={obj2}>
        <ChildComp />
      </Obj2Context.Provider>
    </ObjContext.Provider>
  );
};
// 子级
const ChildComp = () => {
  return <ChildChildComp />;
};
// 孙级或更多级
const ChildChildComp = () => {
  const obj = useContext(ObjContext);
  const obj2 = useContext(Obj2Context);
  return (
    <>
      <div>{obj.value}</div>
      <div>{obj2.value}</div>
    </>
  );
};
```

### 实例四：

```jsx
import React, { useMemo } from 'react'

export interface IColumnDataType extends ITaskItemListDetail {
  code: string
  title: string
  isSub: boolean
  index: string
  task?: ITaskItemListDetail
}

type IContextType = {
  onTriggerDetail: (taskId: string, taskTypeId?: string) => void
  onTriggerSub: (task: IColumnDataType) => void
  onRefresh: () => void
  onUpdateFiled: (taskId: string, data: any, remoteKey?: string) => Promise<boolean>
  onAddTask: (parentCode: string, data?: ITaskItemListDetail) => void
  taskIdPrefix: string
  classifyTree?: IClassifyType
  curSprintStatusIsFinished?: boolean // 当前迭代的状态是已完成
}

export const TableContext = React.createContext<IContextType | null>(null)


export const TableContextProvider: React.FC<IContextType> = (props) => {
  const {
    onTriggerDetail,
    onTriggerSub,
    onUpdateFiled,
    onAddTask,
    taskIdPrefix,
    onRefresh,
    classifyTree,
    curSprintStatusIsFinished,
  } = props;
  const value = useMemo(() => {
    return {
      onTriggerDetail,
      onTriggerSub,
      onAddTask,
      taskIdPrefix,
      onUpdateFiled,
      onRefresh,
      classifyTree,
      curSprintStatusIsFinished,
    };
  }, [
    onTriggerDetail,
    onTriggerSub,
    onAddTask,
    taskIdPrefix,
    onUpdateFiled,
    onRefresh,
    classifyTree,
    curSprintStatusIsFinished,
  ]);
  return (
    <TableContext.Provider value={value}>
      {props.children}
    </TableContext.Provider>
  );
};


//使用如下
return (
    <div css={styles.tableCss}>
      <TableContextProvider
        onAddTask={props.onAddTask as any}
        onTriggerDetail={props.onEditTask}
        onTriggerSub={onTriggerSub}
        onUpdateFiled={props.onUpdateFiled}
        onRefresh={props.onRefresh}
        classifyTree={props.classifyTree}
        taskIdPrefix={project.detail?.taskIdPrefix || ''}
        curSprintStatusIsFinished={props.curSprintStatusIsFinished}
      >
        <FlexTable/>
      </TableContextProvider>
    </div>
  )
```

## useReducer【类似 redux】

> **为什么使用**
> 在某些场景下，useReducer 会比 useState 更适用，当 state 逻辑较复杂。我们就可以用这个钩子来代替 useState，它的工作方式犹如 Redux，看一个例子：

```jsx
//暴露出去的 type 可以让我们更加的了解，当下我们正在做什么事。

const initialState = [
  { id: 1, name: "张三" },
  { id: 2, name: "李四" },
];

const reducer = (state: any, { type, payload }: any) => {
  switch (type) {
    case "add":
      return [...state, payload];
    case "remove":
      return state.filter((item: any) => item.id !== payload.id);
    case "update":
      return state.map((item: any) =>
        item.id === payload.id ? { ...item, ...payload } : item
      );
    case "clear":
      return [];
    default:
      throw new Error();
  }
};

const List = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      List: {JSON.stringify(state)}
      <button
        onClick={() =>
          dispatch({ type: "add", payload: { id: 3, name: "周五" } })
        }
      >
        add
      </button>
      <button onClick={() => dispatch({ type: "remove", payload: { id: 1 } })}>
        remove
      </button>
      <button
        onClick={() =>
          dispatch({ type: "update", payload: { id: 2, name: "李四-update" } })
        }
      >
        update
      </button>
      <button onClick={() => dispatch({ type: "clear" })}>clear</button>
    </>
  );
};
```

## useImperativeHandle【使用子组件暴露的值/方法】

## useLayoutEffect【完成副作用操作，会阻塞浏览器绘制】

## 其它

### useState 和 useRef 的区别

- useRef: 在函数组件中保存一个

关于他们的区别，除了 useRef 可以获取 dom 之外：他们都可以声明一个数据，并在 render 中不被重置。

> **区别：**

- useState 的值在每个 rernder 中都是独立存在的。而 useRef.current 则更像是相对于 render 函数的一个全局变量，每次他会保持 render 的最新状态。这种关系更像是 js 一个经典的案例：for 循环中异步打印 i 的值，let 声明的 i 就相当于每个都是独立作用域，互相之间不会干扰。var 则反之。

- ==useState 值的更新会触发组件重新渲染，而 useRef 的 current 不会触发重新渲染==。
- 它们之间的共同点是两者，useState 并且 useRef 在重新渲染后可以记住它们的数据。因此，如果您的变量是决定视图图层渲染的变量，请使用 useState。其他用途 useRef

> **参考链接：**

- [@@@React 入门 useState,useRef,useContent 等 API 讲解](https://segmentfault.com/a/1190000023098947)
- [关于 useState 和 useRef 的区别
  ](https://coding.imooc.com/learn/questiondetail/194075.html)
- [反应：useState 或 useRef？](https://codingdict.com/questions/78928)

# 实战

## Tips

### useCallBack/useMemo 的依赖

- useCallBack 包着的函数 A 被别的 useCallBack 包着的函数 B 中使用到时，需要监听 A，即 B 的依赖项也必须含有 A，不然会有错误：数据时好时坏，且坏的时候是之前某次渲染时候用到的数据
  - 如何排查？：==一般都是触发事件的依赖项, 且 render 里打印是对的，函数里面打印就不对了==
- **实例：**

  ```jsx
    const tableSearch = useCallback(
    async (params = {}) => {
      if (!bizLineId) return

      sourceAction.setLoading(true)
      const result = await getAllRequirementDetail({
        bizLineId: bizLineId!,
        limit: paginationData?.pageSize,
        pageIndex: paginationData?.current,
        title: keyword || '',
        requirementIds: requirementIds || [],
        ...params,
      })
      sourceAction.setLoading(false)

      if (result?.success) {
        sourceAction.setData(result?.result?.content!)
        paginationAction.setTotal(result?.result?.total!)
      }
    },
    [
      bizLineId,
      paginationData,
      keyword,
      requirementIds,
    ],

    const onSearch = useCallback(
    (name?: string) => {
      paginationAction.setPage(1, paginationData.pageSize)
      const searchName = name ?? keyword
      tableSearch({
        title: searchName,
        pageIndex: 1,
      })
    },
    [keyword, tableSearch], // 此处若不加tableSearch 就会产生上述问题
  )
  ```

- **实例：**

  ```jsx

  const fetchProjectList = useCallback(async () => {
    if (!myProjectList.length) setFetchProjectLoading(true)
    const res = await Promise.all([
      getProjectBasicInfoList({ staffId: user?.user?.staffId }),
      getMyCollectionProject(),
    ])
    setMyProjectList(res?.[0]?.result?.content || [])
    setStarProjectList(res?.[1] || [])
    setTaskSource((prev) =>
      prev.map((v) => {
        if (v.key === 'myCollection') {
          return {
            ...v,
            projectList: (res?.[1] || []) as IProjectInfo[],
          }
        }
        return v
      }),
    )
    if (!myProjectList.length) setFetchProjectLoading(false)
  }, [myProjectList, user, getMyCollectionProject])


    // 获取项目列表
  useEffect(() => {
    if (user) fetchProjectList()
  }, [user])
  // useEffect的依赖若不加 `fetchProjectList` 则Eslint会警告如下:
  React Hook useEffect has a missing dependency: 'fetchProjectList'. Either include it or remove the dependency array.eslint(react-hooks/exhaustive-deps)
  ```

- **实例：**

  - 没加 hooks 依赖提醒的插件时这样写的

  ```jsx
  const onClickTaskTitle = (record) => {
    taskDetailAction.showDialog({
      projectId: record.projectId,
      taskId: record.taskId,
    });
  };

  const tableColumns = useMemo(() => getBugDetailColumns(onClickTaskTitle), []);

  // tableColumns的依赖项悬浮上去会提示：React Hook useMemo has a missing dependency: 'onClickTaskTitle'. Either include it or remove the dependency array.eslintreact-hooks/exhaustive-deps

  // 是因为 tableColumns用useMemo包着，且依赖数组为空，则传给列的是第一次渲染时候的onClickTaskTitle：A，后面每次render onClickTaskTitle 都重新生成了，但是tableColumns传给列的还是A
  ```

  - 于是给 tableColumns 的依赖项数组新增一个 `onClickTaskTitle`，如下，但是还是警告了如下

  ```jsx
  const onClickTaskTitle = (record) => {
    taskDetailAction.showDialog({
      projectId: record.projectId,
      taskId: record.taskId,
    });
  };

  const tableColumns = useMemo(
    () => getBugDetailColumns(onClickTaskTitle),
    [onClickTaskTitle]
  );

  // onClickTaskTitle整个函数提示：The 'onClickTaskTitle' function makes the dependencies of useMemo Hook (at line 432) change on every render. Move it inside the useMemo callback. Alternatively, wrap the definition of 'onClickTaskTitle' in its own useCallback() Hook.eslintreact-hooks/exhaustive-deps

  // 是因为 tableColumns的依赖项数组已经有了onClickTaskTitle，但是每次render onClickTaskTitle 都重新生成了，就会导致tableColumns每次render都重新生成，所以需要把onClickTaskTitle用useCallBack包一下
  ```

  - 于是给 onClickTaskTitle 用 useCallBack 包一下，此时没有任何警告了

  ```jsx
  const onClickTaskTitle = useCallback(
    (record) => {
      taskDetailAction.showDialog({
        projectId: record.projectId,
        taskId: record.taskId,
      });
    },
    [taskDetailAction]
  );

  const tableColumns = useMemo(
    () => getBugDetailColumns(onClickTaskTitle),
    [onClickTaskTitle]
  );
  ```

### 效果时对时不对

基本上就是依赖项没添加，或者初始化用的数据变了之后用的地方没有再取最新的。

### Hooks 依赖项提醒插件

```jsx
// package.json
 "eslint-plugin-react-hooks": "^4.2.0",
```

```diff
// .eslintrc
- "react-hooks/exhaustive-deps": "off",
+ "react-hooks/exhaustive-deps": "warn",
```

```

```

# 报错

## Warning: Maximum update depth exceeded

### 实例

bug 现象：页面 在接口报错时来回切换路由回来的时候页面卡死，
报错如下：

```text
Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render

// 警告：已超出最大更新深度。 当组件在 useEffect 中调用 setState 时会发生这种情况，
// 但 useEffect 要么没有依赖项数组，要么依赖项之一在每次渲染时发生变化
```

![](./imgs/hooks-problem-1.png)

如警告内容，导致的原因是 【==要么没有依赖项数组，要么依赖项之一在每次渲染时发生变化：A==】。

首先根据上图 react 报错提示，是在`./development-input/index.tsx`文件的第 70 行， 而 70 行的代码是`<PMTable {...setSprintIntervalData} />`，所以可以断定是 PMTable 组件出了问题，且是 A，即是 useEffect 的依赖数组导致的问题。

经过试验分析，加 console 之后发现是 useEffect 内调用的函数一直在执行，发现将 data 的 默认值 `[]`去掉之后就不会再死循环了。

组件如下，解决方法为【==去掉 data 的默认值，改为父组件兜底==】

```diff
// 子组件
- const { data = [], bizLineId, setRankingModalVisible, loading } = props
+ const { data, bizLineId, setRankingModalVisible, loading } = props

+const handleDataSource = useCallback(
+  (origin = data) => {
+    setDataSource(radioVal === 'pm' ? origin?.filter((item) => item?.pm) : origin)
+  },
+  [radioVal, data],
+)

// 报错出处的effect，useeffect监听handleDataSource并调用handleDataSource的目的是为了
// 确保初始化后，父组件掉接口后传来的data更新之后子组件用到data的 state: dataSource 能拿
// 到最新数据
+useEffect(() => {
+  handleDataSource()
+}, [handleDataSource])

+const handleStaffFilterClick = useCallback(() => {
+  handleDataSource(
+    data?.filter((item) => {
+      return item?.executorId?.includes(staff || '')
+    }) || [],
+  )
+}, [staff, data, handleDataSource])

```

```diff
// 父组件

const setSprintIntervalData = {
  functionalBizLine: overviewData?.functionalBizLine,
+  data: overviewData?.pmRequirements,
+  data: overviewData?.pmRequirements || [],
  bizLineId: bizLineId!,
  loading: loading!,
  setDevelopInputRankingParams,
  setRankingModalVisible,
}

return (
    <Container>
      <Content style={{ marginLeft: -8, marginRight: -8 }}>
        <PMTable {...setSprintIntervalData} />
      </Content>
    </Container>
  )
```

```jsx
// 修改后的
const ProductDevelopmentInputDetail = memo<IProps>((props) => {
  const { data, bizLineId, setRankingModalVisible, loading } = props
  const [dataSource, setDataSource] = useState<IPMRequirementsItem[]>(data!)
  const [staff, setStaff] = useState<string>()
  const [options, setOptions] = useState<Array<{ label: string; value: string }>>()
  const [radioVal, setRadioVal] = useState('pm')

  const handleRadioChange = useCallback((e?) => {
    const val = e.target.value
    setRadioVal(val)
  }, [])

  const handleDataSource = useCallback(
    (origin = data) => {
      setDataSource(radioVal === 'pm' ? origin?.filter((item) => item?.pm) : origin)
    },
    [radioVal, data],
  )

  useEffect(() => {
    handleDataSource()
  }, [handleDataSource])

  const handleStaffFilterClick = useCallback(() => {
    handleDataSource(
      data?.filter((item) => {
        return item?.executorId?.includes(staff || '')
      }) || [],
    )
  }, [staff, data, handleDataSource])

  const produceStaffOptions = useCallback(async () => {
    if (bizLineId) {
      const { result, success } = await getStaffsByBusinessId(true, { businessLineId: bizLineId })
      if (success) {
        setOptions(genStaffs([result], bizLineId))
      } else {
        setOptions([])
      }
    }
  }, [bizLineId])

  useEffect(() => {
    if (bizLineId) {
      produceStaffOptions()
    }
  }, [bizLineId])

  const handleStaffChange = useCallback((v) => {
    setStaff(v)
  }, [])


  return (
    <Col >
        <ChartContainer>
          <div >
            <div className="title-header">
              <div className="title">各产品经理的需求研发工作量</div>
            </div>
            <div className="filter">
              <Radio.Group onChange={handleRadioChange} value={radioVal}>
                <Radio value="all">全部</Radio>
                <Radio value="pm">只看产品经理</Radio>
              </Radio.Group>
              <Select
                style={{ margin: '0 5px', width: 300 }}
                placeholder="请选择员工"
                value={staff}
                options={options}
                onChange={handleStaffChange}
              />
              <Button
                type="primary"
                shape="circle"
                icon={<SearchOutlined />}
                onClick={handleStaffFilterClick}
              />
            </div>
          </div>
          <div className="card-body">
            <div className="chart-body">
              <Table
                dataSource={dataSource}
                rowKey={(record) => record?.executorId!}
                columns={columns}
              />
            </div>
          </div>
        </ChartContainer>
    </Col>
  )
})

export default ProductDevelopmentInputDetail
```

### 示例分析

问题代码如下：

```jsx
export default (props) => {
  const [detail, option = {}] = props.data;
  const [info, setInfo] = useState({});

  useEffect(() => {
    setInfo({ ...detail, ...option });
  }, [option]);
};
```

当 props.data 的值中没有 option 的时候，option 就是给的默认值`{}`,就死循环了

**原因：**

- 每次 state 更新，页面就会重新渲染。
- 由于在 useEffect 中使用了 setState，执行 useEffect 就会重新渲染。
- 执行到 useEffect 时候，会比对依赖数组，获取 detail 和 option 的值没有依赖，所以页面渲染就会重新取值。
- 由于给 option 值赋了默认值，每次 render 时重新取值就会重新赋值一个空对象
- 但是由于空对象 {} !== {}
- useEffect 依赖于 option, option 更新就会重新执行 useEffect 中的代码
- 所以每次页面重新渲染，option 的值就会变化，导致再次执行 useEffect 中的代码，然后再次重新渲染，进入死循环。页面从而卡死失去响应

**解决方案：**

- 方案一：option 不设置默认值，在使用时进行为空判断
- 方案二：父组件传过来的时候就给默认值，在父组件完成兜底

**参考链接：**

- [UseEffect 死循环问题记录](https://blog.csdn.net/qq_22836769/article/details/110139490)

# 参考链接

- [umi-hooks](https://hooks.umijs.org/zh-CN/hooks/state/use-controllable-value)
