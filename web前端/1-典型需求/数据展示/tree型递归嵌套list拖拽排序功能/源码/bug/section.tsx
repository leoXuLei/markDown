/* eslint-disable react-hooks/exhaustive-deps */
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import * as styles from './styles'
import {
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  PlusCircleFilled,
} from '@ant-design/icons'
import KanbanView from '../common/kanban'
import TableView from './table'
import IfElseComponent, { ConditionComponent } from 'client/components/conditions'
import ExpandPanel from 'client/components/expand-panel'
import DocTree from 'client/components/doc-tree'
import NewModal from 'client/components/doc-tree/new-category'
import { getClassifyTree } from 'client/ekko/services/task'
import useAppSelector from 'client/hooks/use-app-selector'
import { StoryContext } from '../common/kanban/context'
import LoadingComponent from 'client/components/loading'
import { useLink } from 'client/components/link'
import { IViewItemProps } from 'client/ekko/services/view'
import SpaceBar from '@/components/space-bar'
import useTaskInfo, { useTaskModal, useViewFilterValue } from '../common/use-task-info'
import { TaskTimeFilter, useTaskTimeFilter } from '../common/use-task-filter'
import { useScreenFilter } from '../common/filter/hooks/use-screen-filter'
import { useGetTaskList, useUpdateTaskByCode } from '../common/use-task-list'
import { useTaskViewOption } from '../common/use-task-view'
import { useMenuMore } from '../common/use-menu-more'
import {
  useViewFilter,
  useViewList,
  useTaskScreenFilter,
  useNameAndSprintFilterComponent,
} from '../common/filter'

const buildDocTree = (item: IClassifyType) => ({
  title: `${item.name}`,
  doneCount: item.doneCount,
  count: item.count,
  key: item.id,
  item,
  subClassifies: item.subClassifies || [],
  canDelete: !item.systemTaskClassify,
  deep: item.deep || 0,
  expanded: false,
})

const Index = () => {
  const project = useAppSelector((state) => state.project)

  const router = useLink()

  const [timeSelect, setTimeSelect] = useState<{ label?: string; value: string }>({
    value: 'timeCreate1',
  })

  const [leftShow, setLeftShow] = useState(true)

  const [addVisible, setAddVisible] = useState(false)

  const [docTree, setDocTree] = useState<IClassifyType>()

  const [docRefresh, setDocRefresh] = useState({})

  const [taskList, setTaskList] = useState<ITaskItemListDetail[]>()

  const [loading, setLoading] = useState(false)
  const [finallyLoading, setFinallyLoading] = useState(false)

  const [expanded, setExpanded] = useState(true)

  const [sprintIds, setSprintIds] = useState<string[]>([])

  const { application, taskType, sectionId, taskId } = useTaskInfo('bug')

  const { viewOption, component: optionComponent } = useTaskViewOption('bug')

  const getDocTree = useCallback(async (projectId, type) => {
    const res = await getClassifyTree(projectId, type)
    if (res.success) {
      setDocTree({ ...res.result, id: 'all' })
    }
  }, [])

  // 获取工作项列表
  const getTaskList = useGetTaskList(setTaskList, setLoading, setFinallyLoading)

  // 为什么不把请求返回的数据直接set
  // 而要在原来的数据上set
  const onUpdateTaskByCode = useUpdateTaskByCode({
    taskTypeId: taskType?.id,
    projectId: project.detail?.id,
    taskList,
    setTaskList,
    getDocTree,
  })

  const onInsertTask = useCallback(
    (task: ITaskItemListDetail) => {
      if (taskList && task.taskType.id === taskType?.id) {
        if (sectionId === 'all' || task.classify?.id === sectionId) {
          setTaskList([...taskList, task])
        }
      }
      getDocTree(project.detail!.id, taskType!.id)
    },
    [taskList, taskType, getDocTree, project.detail, sectionId],
  )

  useEffect(() => {
    if (project.detail && taskType) {
      getDocTree(project.detail.id, taskType.id)
      getTaskList(project.detail.id, taskType.id, sectionId, viewOption?.[1]?.value as any)
    }
  }, [project, getDocTree, docRefresh, viewOption, sectionId, taskType, getTaskList])

  const onRefresh = useCallback(() => {
    setDocRefresh(Object.create(null))
  }, [])

  const [tempList, sortables] = useTaskTimeFilter({ timeSelect, taskList })

  const {
    component,
    onChange: setFilterValue, // 因为视图的关系, 这里要让设置过滤值的能力暴露出来
    ...filterArgs
  } = useTaskScreenFilter('bug')

  const { component: nameComponent } = useNameAndSprintFilterComponent({
    memoKey: 'Bug',
    setSprintIds,
    sprintIds,
  })

  const filteredList = useScreenFilter(
    {
      sprintIds,
      ...filterArgs,
    },
    tempList,
  )

  const moreMenu = useMenuMore({
    taskTypeId: taskType?.id,
    filters: filterArgs,
    sprintIds,
    onRefresh,
  })

  // 预览id数组
  const previewList = useMemo(() => {
    return filteredList?.map((c) => c.taskId)
  }, [filteredList])

  const onDocRefresh = useCallback(() => {
    setDocRefresh(Object.create(null))
  }, [])

  const [detailComponent, onShowHideDetail] = useTaskModal({
    previewList,
    onUpdate: onUpdateTaskByCode,
    onRefresh: onDocRefresh,
    mode: 'drawer',
  })

  // 返回视图的过滤值 并设置过滤条件
  const { viewData, getScreenConditionByViewId } = useViewFilterValue(
    setFilterValue,
    setTimeSelect,
    setSprintIds,
  )
  // 新建视图成功后 要进行跳转
  const handleAddViewSuccess = useCallback(
    (viewId?: string) => {
      if (!viewId) return
      router?.toView('bug', viewId)
    },
    [router],
  )

  // 删除视图之后 回到所有分类
  const handleDelSuccess = useCallback(() => {
    router?.toBug('all')
    setFilterValue?.('reset', '') // 重置过滤条件
  }, [router, setFilterValue])

  // 更新之后 再获取一次视图详情
  const handleUpdateSucces = useCallback(
    (viewItem?: IViewItemProps) => {
      if (!viewItem?.id) return
      getScreenConditionByViewId?.(viewItem?.id)
    },
    [getScreenConditionByViewId],
  )
  // 视图列表
  // setRefresh 拥有刷新视图树的能力
  const { ViewListComp, viewList, setRefresh } = useViewList(
    'taskType3',
    handleAddViewSuccess,
    handleDelSuccess,
  )

  // 保存视图按钮
  const ViewBtn = useViewFilter({
    viewInfo: {
      filter: filterArgs,
      sorter: timeSelect,
      sprints: sprintIds,
    },
    viewType: 'taskType3',
    viewDetail: viewData,
    viewList,
    handleAddSuccess: handleAddViewSuccess,
    handleUpdateSuccess: handleUpdateSucces,
    refreshViewTree: setRefresh,
  })

  if (!project.detail || !application || !taskType?.flow) {
    return <h3>数据存在一些问题！</h3>
  }

  return (
    <div
      css={css`
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
      `}
    >
      <StoryContext.Provider
        value={{
          taskList: filteredList,
          taskTypeId: taskType.id,
          classifyId: sectionId === 'all' ? undefined : sectionId,
          sprintId: sprintIds?.length === 1 ? sprintIds?.filter(Boolean)[0] : undefined,
          noCrossProjectTask: true,
          classifyTree: docTree,
          getDocTree,
          onUpdateTaskByCode,
          onInsertTask,
          onShowEditModal: onShowHideDetail,
        }}
      >
        <ExpandPanel show={leftShow} onChange={setLeftShow}>
          <div css={styles.leftPanelCss}>
            <div className="section-group">
              <div className="left-title">缺陷分类</div>
              <div className="left-tree">
                <LoadingComponent loading={!docTree}>
                  <DocTree
                    label="缺陷"
                    activeKey={sectionId}
                    onSelect={(v) => {
                      if (v === sectionId) {
                        return
                      }
                      router.toBug(v)
                    }}
                    treeData={docTree ? buildDocTree(docTree) : undefined}
                    params={{ projectId: project.detail!.id, taskTypeId: taskType.id }}
                    onRefresh={(id?: string) => {
                      if (id === sectionId) {
                        router.toBug('all')
                      }
                      onRefresh()
                    }}
                    expanded={expanded}
                    onExpandClick={() => {
                      setExpanded(!expanded)
                    }}
                  />
                </LoadingComponent>
              </div>
              <div className="create-link" onClick={() => setAddVisible(true)}>
                <div className="icon">
                  <PlusCircleFilled />
                </div>
                <span>创建缺陷分类</span>
              </div>
              <NewModal
                label="缺陷"
                onRefresh={onRefresh}
                visible={addVisible}
                onClose={() => setAddVisible(false)}
                params={{ projectId: project.detail!.id, taskTypeId: taskType.id }}
              />
            </div>
            <SpaceBar />
            {ViewListComp}
          </div>
        </ExpandPanel>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            height: 100%;
            flex-grow: 1;
            overflow: hidden;
          `}
        >
          <div css={styles.headerCss}>
            <div className="left-tools">
              <div
                className="mode-trigger"
                css={styles.labelCss}
                onClick={() => setLeftShow(!leftShow)}
              >
                <IfElseComponent
                  if={<MenuFoldOutlined className="icon" />}
                  else={
                    <React.Fragment>
                      <MenuOutlined className="icon icon-normal" />
                      <MenuUnfoldOutlined className="icon icon-arrow" />
                    </React.Fragment>
                  }
                  checked={leftShow}
                />
                <span>所有缺陷</span>
              </div>
              {nameComponent}
            </div>

            <div className="scrum-panel">
              {ViewBtn}
              {optionComponent}
              <TaskTimeFilter
                memoKey="Bug"
                value={timeSelect}
                onChange={setTimeSelect}
                appId="bug"
              />
              {component}
              {moreMenu}
            </div>
          </div>
          <ConditionComponent isShow={viewOption[0]?.value === 'board'}>
            <KanbanView appId="bug" loading={loading} finallyLoading={finallyLoading} />
          </ConditionComponent>
          <ConditionComponent isShow={viewOption[0]?.value === 'table'}>
            <TableView onRefresh={onRefresh} sortables={sortables} />
          </ConditionComponent>
        </div>
        {detailComponent}
      </StoryContext.Provider>
    </div>
  )
}

export default Index
