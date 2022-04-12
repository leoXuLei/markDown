# useState

## **实例：组内成员增删查改**

```jsx
const allUserList = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const Test = () => {
  // 从员工列表添加人员到当前activeGroup的成员列表中
  const onClickAddUser = (item) => {
    setGroupList((prev) =>
      prev?.map((v) => {
        if (v?.key === activeGroupKey) {
          return {
            ...v,
            userList: [...(v?.userList || []), item],
          };
        }
        return v;
      })
    );
  };

  // 翻转当前activeGroup的组名
  const onReverseGroupName = () => {
    setGroupList((prev) =>
      prev?.map((v) => {
        if (v?.key === activeGroupKey) {
          return {
            ...v,
            title: v?.title?.split("")?.reverse?.()?.join(""),
          };
        }
        return v;
      })
    );
  };

  const activeGroup = useMemo(
    () => groupList?.find((v) => v?.key === activeGroupKey),
    [groupList, activeGroupKey]
  );

  // 员工列表中可以添加到当前activeGroup组内成员列表中的员工
  const addUserList = useMemo(
    () =>
      allUserList.filter((v) =>
        activeGroup?.userList ? !activeGroup?.userList?.includes?.(v) : true
      ),
    [activeGroup]
  );

  console.log("groupList", JSON.parse(JSON.stringify(groupList)));

  return (
    <Fragment>
      <div className="wrapper">
        <div className="group-list-container">
          <div className="title">组列表</div>
          <div className="list">
            {groupList?.map((v) => (
              <div
                key={v.title}
                className={`list-item ${
                  activeGroupKey === v?.key ? "active" : ""
                }`}
                onClick={() => setActiveGroupKey(v?.key)}
              >
                {v.title}
              </div>
            ))}
          </div>
        </div>

        <div className="group-item-container">
          <div className="title">当前选中组详情</div>
          <div className="reverse-group-name" onClick={onReverseGroupName}>
            翻转组名
          </div>
          <div>组成员</div>
          <div className="list">
            {activeGroup?.userList?.map((v) => (
              <div className="list-item" key={v}>
                <div className="text-content">{v}</div>
                <div className="btn" onClick={() => onClickDeleteUser(v)}>
                  移除
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="staff-container">
          <div className="title">成员列表</div>
          <div className="list">
            {addUserList?.map((v) => (
              <div className="list-item" key={v}>
                <div className="text-content">{v}</div>
                {activeGroup && (
                  <div className="btn" onClick={() => onClickAddUser(v)}>
                    添加到小组
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Test;
```

```css
.wrapper {
  display: flex;
  border: 1px solid #ccc;

  > [class*="-container"] {
    .title {
      font-size: 18px;
      font-weight: 600;
    }
    .list {
      .active {
        color: #fff;
        background-color: #1890ff;
      }
      .list-item {
        padding: 5px 20px;
        display: flex;
        .text-content {
          flex: 1;
        }
        .btn {
          flex: 0 0 auto;
          cursor: pointer;
          display: none;
          color: #000000d9;
          background: #fff;
          padding: 0 5px;
        }
        &:hover {
          color: #fff;
          background-color: #1890ff;
          .btn {
            display: block;
          }
        }
      }
    }
  }
  .group-list-container {
    flex: 0 0 200px;
    border-right: 1px solid #ccc;
    .list-item {
      cursor: pointer;
    }
  }
  .group-item-container {
    flex: 0 0 300px;
    border-right: 1px solid #ccc;
    .reverse-group-name {
      cursor: pointer;
      margin-bottom: 20px;
    }
  }
  .staff-container {
    flex: 1;
  }
}
```

# useContext

## 实例一：文件夹功能完整实例

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

## 实例二：依赖数组监听 context 某个属性优化性能

如下图代码，context 生产者返回的是一个对象，每次渲染更新返回的对象一定是新的，但是里面的属性如`context?.staffList`可能任然是旧的对象，也就是如下写法的时候是能够比监听`context`范围更小更精确的，**能避免用到的属性 staffList 没变而其它属性变了导致这个 useMemo 重新计算渲染的问题产生**。但是由于依赖提示插件问题，依赖数组任然会警告如下：没关系，插件的问题。

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

## 实例三：两个 context 同时使用

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

## 实例四：Context.provide 抽离成组件

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

# useRef

## 实例一：父子组件使用 Ref 实例

方便父组件调用子组件方法

```jsx
// 父组件
const Parent = () => {
  const $gourpLists = useRef(null);
  const fetchList = async () => {
    if ($gourpLists && $gourpLists.current) {
      $gourpLists.current.handleMenber(dataList[0]);
    }
  };

  return (
    <AuditGourpLists
      current={(node) => {
        $gourpLists.current = node;
      }}
      approveGroupList={approveGroupList} // handleEdit={param => {}}
      handleMenber={handleMenber}
      handleGroupList={handleGroupList}
    />
  );
};
```

```jsx
// 子组件
interface AuditListsType {
  current: (node) => void;
  approveGroupList: any[];
  handleGroupList: any;
  handleMenber: any;
}

const AuditLists = memo<AuditListsType>(props => {
  const { current } = props;
  // 父组件希望可以调的子组件方法放在meta下
  const meta = {
    handleMenber: param => {
      console.log('11111');
      if (!param) return;
      setActiveGroupId(param.approveGroupId);
      props.handleMenber(param);
    },
  };
  current(meta);
  return <div></div>
}
```

# useReducer

## 实例一：2.0 报表顶部公共表单 `useReducer + useContext + immmer`

```jsx
// olympos-analytics\client\blocks\common\report-form\data.tsx
import React, { createContext, useReducer, useMemo } from 'react'
import produce from 'immer'

interface IDataContext {
  state?: {
    params?: {
      orgId?: number
      bizLineId?: string
      startTime?: number
      endTime?: number
      queryOptionName?: string
      queryOptionValues?: string[]
    }
    loading?: boolean
  }
  dispatch?: any
}

const initState = {
  params: {
    bizLineId: '',
    startTime: null,
    endTime: null,
    queryOptionName: null,
    queryOptionValues: [],
  },
  loading: false,
}

const reducer = (state, action) => {
  const { type, payload } = action
  switch (type) {
    case 'change-query-params':
      state.params = payload
      break
    case 'fetch-data':
      state.loading = payload
      break
    default:
      break
  }
}

export const DataContext = createContext<IDataContext>({})


// Data只在报表项目根路径文件中被引用一次，用于包裹传递context
export const Data = (props) => {
  const [state, dispatch] = useReducer(produce(reducer), initState)
  return useMemo(
    () => <DataContext.Provider value={{ state, dispatch }}>{props.children}</DataContext.Provider>,
    [props.children, state],
  )
}
```

```jsx
// olympos-analytics\client\components\report-form-filter\index.tsx
/* eslint-disable react-hooks/exhaustive-deps */
/**
 * 处理查询和路由逻辑
 * 查询：抛出参数，具体页面处理请求
 * 路由：1.根据路由参数，处理ui，初始化请求参数；2.点击查询后，更新路由
 */

const options = [
  {
    label: '迭代负责人',
    value: 'OWNER',
  },
  {
    label: '技术负责人',
    value: 'TEC_PM',
  },
  {
    label: '产品经理',
    value: 'PM',
  },
]

enum TeamType {
  REQ = 'req',
  RES = 'res',
}

const teamTypeMap = new Map([
  [TeamType.REQ, '提出方'],
  [TeamType.RES, '承接方'],
])

function ReportFormFilter({ showQueryOption = true }) {
  const context = useContext(MainProjectContext)!
  const { businessLines = [] } = context.user?.olymposUser!
  const dataContext = useContext(DataContext)
  const { dispatch, state } = dataContext

  const router = useLink()
  const { path = '', pathname: href } = router

  const as = splitQueryFromPath(path)

  const { businessLine, endTime, startTime, filterValue } = initQuery(
    getQueryString(window.location.href),
  )

  const { isNotNeedPermissionCurPage } = useReportsPermission()

  const [teamType, setTeamType] = useState()
  const [teamId, setTeamId] = useState(businessLine)
  const [timeRange, setTimeRange] = useState<number[]>([startTime, endTime])
  const [fValue, setFilterValue] = useState<string[]>(filterValue || []) // 0 = 全部
  const [isSprint, setIsSprint] = useState(true)

  /**
   * url没有参数时的兜底
   * @param query url参数
   */
  function initQuery(query) {
    const { businessLine, startTime, endTime, filterValue } = query
    const defaultQuery = Object.assign(query, {
      businessLine: businessLine || generateDefaultBL(businessLines),
      endTime: endTime ? Number(endTime) : moment().subtract(1, 'day').endOf('day').valueOf(),
      startTime: startTime ? Number(startTime) : moment().startOf('quarter').valueOf(),
      filterValue: filterValue ? filterValue.split(',') : [],
    })
    return defaultQuery
  }

  const handleRouterPush = (info?) => {
    let query = {
      _tyPathMap,
      businessLine: teamId,
      startTime: timeRange?.[0],
      endTime: timeRange?.[1],
      filterValue: fValue,
    }
    query = info ? Object.assign(query, info) : query
    router.push(
      {
        query,
        href,
      },
      // as,
      `/${window.location.pathname.split('/').slice(2, 10).join('/')}`,
      {
        shallow: true,
      },
    )
  }

  const handleDateChange = useCallback(
    (startTime, endTime?) => {
      setTimeRange([startTime, endTime || moment().subtract(1, 'days').endOf('day').valueOf()])
      dispatch({
        type: 'change-query-params',
        payload: {
          ...state?.params,
          startTime,
          endTime: endTime || moment().subtract(1, 'days').endOf('day').valueOf(),
        },
      })
    },
    [state?.params],
  )

  const handleBLChange = useCallback(
    (val) => {
      setTeamId(val)
      dispatch({
        type: 'change-query-params',
        payload: { ...state?.params, bizLineId: val },
      })
    },
    [state?.params],
  )

  const handleFilterChange = useCallback(
    (val) => {
      setFilterValue(val)
      dispatch({
        type: 'change-query-params',
        payload: { ...state?.params, queryOptionValues: val },
      })
    },
    [state?.params],
  )

  const handleSearch = () => {
    dispatch({
      type: 'fetch-data',
      payload: true,
    })
    handleRouterPush()
  }

  useEffect(() => {
    dispatch({
      type: 'change-query-params',
      payload: {
        bizLineId: businessLine,
        startTime,
        endTime,
        queryOptionName: 'SPRINT_ROLE',
        queryOptionValues: filterValue
          ? Array.isArray(filterValue)
            ? filterValue
            : filterValue.split()
          : [],
      },
    })
    dispatch({
      type: 'fetch-data',
      payload: true,
    })
    handleRouterPush()
  }, [])

  useEffect(() => {
    function genFilterByUrl() {
      const isSprint = window.location.pathname.split('/')[3] === 'sprint'
      setIsSprint(isSprint)
      dispatch({
        type: 'change-query-params',
        payload: {
          bizLineId: businessLine,
          startTime,
          endTime,
          queryOptionName: 'SPRINT_ROLE',
          queryOptionValues: isSprint
            ? filterValue
              ? Array.isArray(filterValue)
                ? filterValue
                : filterValue.split()
              : []
            : [],
        },
      })
    }
    genFilterByUrl()
    dispatch({
      type: 'fetch-data',
      payload: true,
    })
  }, [window.location.pathname])

  const onTeamTypeChange = (e) => {
    setTeamType(e.target.value)
  }

  return (
    <Wrapper>
      <TeamSelector
        value={teamId}
        onBusinessLineChange={handleBLChange}
        classname="team-selector"
      />
      <QuickDateRangePicker className="date-picker" value={timeRange} onChange={handleDateChange} />
      <ConditionComponent isShow={showQueryOption && isSprint}>
        <Select
          mode="multiple"
          maxTagCount={1}
          placeholder="团队主导，默认全部"
          className="filter-selector"
          optionFilterProp="label"
          options={options as any}
          value={fValue}
          onChange={handleFilterChange}
        />
      </ConditionComponent>

      <Button
        shape="round"
        type="primary"
        onClick={handleSearch}
        loading={context?.reportsPermission || isNotNeedPermissionCurPage ? state?.loading : false}
        disabled={context?.reportsPermission || isNotNeedPermissionCurPage ? state?.loading : true}
      >
        查询
      </Button>
      <Tooltip title="报表数据会有一天的延迟（每天凌晨更新）">
        <InfoCircleOutlined style={{ marginLeft: 5 }} />
      </Tooltip>
    </Wrapper>
  )
}

export default ReportFormFilter
```

```jsx
// 各个页面使用context的数据
const { state, dispatch } = useContext(DataContext);
const { params, loading } = state ?? {};
const { bizLineId, startTime, endTime, queryOptionName, queryOptionValues } =
  params ?? {};

const paramRef = {
  pageIndex: 1,
  limit: 20,
  queryByStaff: false,
  bizLineId: bizLineId || "",
  startTime: Number(startTime),
  endTime: Number(endTime),
  queryOptionName,
  queryOptionValues,
  title: "",
  sortFields: [],
};

const getTeamRequirementsOverview = async (queryByStaff) => {
  const response = await getRequirementOverview({
    bizLineId: bizLineId || "",
    startTime: Number(startTime),
    endTime: Number(endTime),
    queryByStaff,
    queryOptionName,
    queryOptionValues,
  }).finally(() => {
    dispatch({
      type: "fetch-data",
      payload: false,
    });
  });
};
```

# useImperativeHandle

## 实例一：报表公共 table 弹窗

参考`olympos-organization\client\blocks\group-project\components\task-list-modal\index.tsx`

# 自定义 hook

## 实例一：Hook复用状态逻辑的方式，不复用状态
```jsx
import React, { useLayoutEffect, useEffect, useState } from "react";

function useNumber() {
  const [number, setNumber] = useState(0);
  useEffect(() => {
    setInterval(() => {
      setNumber((number) => number + 1);
    }, 3000);
  }, []);
  return [number, setNumber];
}
// 每个组件调用同一个 hook，只是复用 hook 的状态逻辑，并不会共用一个状态
function Counter1() {
  const [number, setNumber] = useNumber();
  return (
    <div>
      <button
        onClick={() => {
          setNumber(number + 1);
        }}
      >
        {number}
        <span>点击手动+1</span>
      </button>
    </div>
  );
}
function Counter2() {
  const [number, setNumber] = useNumber();
  return (
    <div>
      <button
        onClick={() => {
          setNumber(number + 1);
        }}
      >
        {number}
        <span>点击手动+1</span>
      </button>
    </div>
  );
}
const Test = () => {
  return (
    <>
      <Counter1 />
      <Counter2 />
    </>
  );
};

export default Test;
```
