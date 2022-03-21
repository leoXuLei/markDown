/** @jsx jsx */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { css, jsx } from "@emotion/core";
import { Button } from "antd";
import {
  DatabaseOutlined,
  LayoutOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  SwapOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useLink } from "client/components/link";
import { confirmModal } from "client/components/confirm-modal";
import PopSelect, { Option, OptionGroup } from "client/components/pop-select";
import IfElseComponent, {
  ConditionComponent,
} from "client/components/conditions";
import { startSprint, updateSprint } from "client/ekko/services/sprint";
import useAppSelector from "client/hooks/use-app-selector";
import { useSprintList } from "client/upark/hooks";

const IconKeyMap = {
  tasks: <CheckMark />,
  requirement: <LightBlue />,
  bug: <Lightning />,
  default: <Spirnt />,
};

interface IStartSprintModalContentProps {
  project?: IProjectDetail;
  sprintDetail?: ISprintListItem;
  sprintText?: string;
}

const StartSprintModalContent: React.FC<IStartSprintModalContentProps> = (
  props
) => {
  const { sprintDetail, sprintText, project } = props;
  const onUpdateFiled = useCallback(async (projectId, sprintId, data: any) => {
    const { success } = await updateSprint(projectId, sprintId, data);
    return success;
  }, []);

  const desc = useMemo(
    () => (project?.sprintNickname === "项目" ? "项目" : "迭代"),
    [project]
  );

  const throttleUpdate = useCallback(throttle(onUpdateFiled, 200), []);
  return (
    <div css={styles?.StartSprintModalContentCss}>
      <div>{`是否开始【${sprintDetail?.name}】?`}</div>
      <div className="item-label">
        <CalendarOutlined className="item-label-icon" />
        {`${desc}周期`}
      </div>
      <div>
        <Picker.WeekAndTimePicker
          value={[
            moment(sprintDetail?.startDate),
            moment(sprintDetail?.endDate),
          ]}
          onChange={(v) => {
            // setTime(v)
            if (v && v[0] && v[1] && sprintDetail?.id && project?.id) {
              throttleUpdate(project?.id, sprintDetail.id, {
                startDate: v[0].valueOf(),
                endDate: v[1].valueOf(),
              });
            }
          }}
        />
      </div>
    </div>
  );
};

const defaultViewOption = {
  0: { value: "board" },
  1: { value: "all" },
} as const;

const Index = () => {
  const project = useAppSelector((state) => state.project);

  const router = useLink();
  const { projectId, sectionId, viewType, start, finish } = router.query;

  const [viewOption, _setViewOption] =
    useState<ITaskViewOption>(defaultViewOption);

  const [taskType, setTaskType] = useState<ITaskType | "default">("default");
  const [storeTaskType, setStoreTaskType] =
    useSprintBoardViewTaskType(projectId);

  const defaultWidth = 300;
  const [collapse, setCollapse] = useState(false); // 左侧是否隐藏
  const [isDragging, setIsDragging] = useState(false);

  const [assignSprintId, setAssignVisible] = useState<string>();
  const [forceRefresh, setForeceRefresh] = useState({});
  const { taskType: hasRequirementType } = useTaskInfo("requirement");
  const { taskType: hasBugType } = useTaskInfo("bug");
  const { taskType: hasTaskType } = useTaskInfo("tasks");

  const [pageTab, setPageTab] = useState<
    "workItem" | "overview" | "statistics"
  >("workItem");

  const [taskList, setTaskList] = useState<IUndoneTask[]>();

  const { data: sprintList = [], run: refreshSprintList } =
    useSprintList(projectId);

  const { data: currentSprint, run: refreshCurrentSprint } = useSprint(
    projectId,
    sectionId
  );

  const desc = project?.detail?.sprintNickname ?? "迭代";

  const viewOptionData = useMemo(() => {
    return {
      suffix: "ViewOption",
      memoKey: `[${projectId}].Sprint`,
      defaultValue: defaultViewOption,
      setup: (value) => {
        if (value && currentSprint) _setViewOption(value);
      },
    };
  }, [currentSprint, projectId]);

  const { setMemoValue: setMemoViewOption } =
    useMemoValue<ITaskViewOption>(viewOptionData);
  const setViewOption = useCallback(
    (value: ITaskViewOption) => {
      _setViewOption(value);
      setMemoViewOption(value);
    },
    [setMemoViewOption]
  );

  useEffect(() => {
    if (storeTaskType && typeof storeTaskType === "string") {
      setTaskType(storeTaskType as ITaskType | "default");
    }
  }, [storeTaskType]);

  const onRefresh = useCallback(() => {
    setForeceRefresh(Object.create(null));
  }, []);

  // 更新迭代信息
  // 在数据流没问题的情况下，用这个函数就足够刷新信息了，不需要强制刷新
  const refresh = useCallback(() => {
    refreshSprintList();
    refreshCurrentSprint();
  }, [refreshCurrentSprint, refreshSprintList]);

  useEffect(() => {
    refresh();
  }, [forceRefresh, refresh]);

  const onStartSprint = useCallback(
    (item: ISprintListItem) => {
      confirmModal({
        title: `是否开始${desc}`,
        okText: "开始",
        content: (
          <StartSprintModalContent
            project={project?.detail as any}
            sprintDetail={item}
          />
        ),
        onOk: async () => {
          const res = await startSprint(projectId, item?.id);
          if (res.success) {
            onRefresh();
          }
        },
      });
    },
    [desc, onRefresh, project, projectId]
  );

  const checkUndone = (unDoneTasks) => {
    setTaskList(unDoneTasks);
  };

  const onFinishSprint = useFinishSprint(onRefresh, checkUndone);

  useEffect(() => {
    if (sectionId === "all" || sectionId === "unplanned") {
      _setViewOption({
        0: { value: "table" },
        1: { value: "all" },
      });
    }
  }, [sectionId]);

  const sprintName = useMemo(() => {
    if (sectionId === "all") {
      return "所有工作项";
    }
    if (sectionId === "unplanned") {
      return "未规划的工作项";
    }
    return currentSprint?.name;
  }, [currentSprint, sectionId]);

  const sprintIsFinished = finishedStatusDescList.includes(
    currentSprint?.sprintStatus as string
  );

  useEffect(() => {
    if (viewType) {
      setPageTab(viewType);
    }
  }, [viewType]);

  useEffect(() => {
    const endStatuses = ["done", "terminate"];
    if (sprintList && sprintList?.length) {
      const startSprint = sprintList?.find((item) => item.id === start)!;
      const endSprint = sprintList?.find((item) => item.id === finish)!;
      start &&
        startSprint?.sprintStatus === "start" &&
        onStartSprint(startSprint);
      finish &&
        !endStatuses.includes(endSprint?.sprintStatus) &&
        onFinishSprint(endSprint);
    }
  }, [finish, onFinishSprint, onStartSprint, sprintList, start]);

  const onDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const onDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <SectionWrapper isDragging={isDragging}>
      <Stretch
        collapse={collapse}
        onCollapse={setCollapse}
        minWidth={300}
        maxWidth={700}
        width={defaultWidth}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <SprintMenu />
      </Stretch>

      <SectionRightWrapper>
        <div
          css={[
            styles.headerCss,
            css`
              height: 50px;
              padding-bottom: 8px;
              background-color: white;

              .left-tools > * {
                flex: 0 0 auto;
              }

              .left-tools
                > div:nth-of-type(2)
                > .option:nth-of-type(3):not(.is-active) {
                background-color: #ddd;
              }
            `,
          ]}
        >
          <div className="left-tools">
            <div
              className="mode-trigger"
              css={styles.labelCss}
              onClick={() => setCollapse(!collapse)}
            >
              <IfElseComponent
                if={<MenuFoldOutlined className="icon" />}
                else={
                  <React.Fragment>
                    <MenuOutlined className="icon icon-normal" />
                    <MenuUnfoldOutlined className="icon icon-arrow" />
                  </React.Fragment>
                }
                checked={!collapse}
              />
              <span className="text">{sprintName}</span>
            </div>

            <ConditionComponent isShow={!!currentSprint}>
              <ButtonToggle
                options={[
                  { label: "看板", value: "workItem" },
                  { label: "概览", value: "overview" },
                  { label: "统计", value: "statistics" },
                ]}
                value={pageTab}
                onChange={setPageTab as (val: string) => void}
              />
              <ConditionComponent isShow={pageTab === "workItem"}>
                <div className="view-option">
                  <PopSelect
                    value={{ 0: { value: taskType } }}
                    onChange={(v) => {
                      if (v[0]?.value) {
                        setTaskType(v[0]?.value);
                        setStoreTaskType(v[0]?.value);
                      }
                    }}
                    withIcon
                  >
                    <OptionGroup groupKey="0">
                      <Option
                        value="default"
                        label="默认"
                        icon={IconKeyMap.default}
                      />
                    </OptionGroup>
                    {hasTaskType && (
                      <OptionGroup groupKey="0" label="任务工作流">
                        <Option
                          value="tasks"
                          label="任务"
                          icon={IconKeyMap.tasks}
                        />
                      </OptionGroup>
                    )}
                    {hasRequirementType && (
                      <OptionGroup groupKey="0" label="需求工作流">
                        <Option
                          value="requirement"
                          label="需求"
                          icon={IconKeyMap.requirement}
                        />
                      </OptionGroup>
                    )}
                    {hasBugType && (
                      <OptionGroup groupKey="0" label="缺陷工作流">
                        <Option
                          value="bug"
                          label="缺陷"
                          icon={IconKeyMap.bug}
                        />
                      </OptionGroup>
                    )}
                  </PopSelect>
                </div>
                <Risk />
                {!sprintIsFinished && (
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => setAssignVisible(router.query.sectionId)}
                    style={{ borderRadius: 4, margin: "0 8px" }}
                  >
                    <SwapOutlined color="white" /> {`规划${desc}`}
                  </Button>
                )}
                {project.detail && currentSprint && !sprintIsFinished && (
                  <CreateTestPlan
                    project={project.detail}
                    sprint={currentSprint}
                  />
                )}
              </ConditionComponent>
            </ConditionComponent>
          </div>

          {pageTab === "workItem" && (
            <div className="scrum-panel">
              <PopSelect
                value={viewOption}
                onChange={setViewOption as any}
                label={viewOption[0].showLabel}
              >
                <OptionGroup groupKey="0">
                  {currentSprint && (
                    <Option
                      value="board"
                      label="看板视图"
                      showLabel="看板"
                      icon={<DatabaseOutlined />}
                    />
                  )}
                  <Option
                    value="table"
                    label="表格视图"
                    showLabel="表格"
                    icon={<LayoutOutlined />}
                  />
                </OptionGroup>
                {
                  // 默认-看板 的数据接口不支持 onlyParent，暂时不开放父子任务筛选
                  !(
                    taskType === "default" && viewOption[0].value === "board"
                  ) && (
                    <OptionGroup groupKey="1" label="工作项层级" topBorder>
                      <Option value="all" label="所有工作项" />
                      <Option value="parent" label="仅父工作项" />
                      <Option value="child" label="仅子工作项" />
                    </OptionGroup>
                  )
                }
              </PopSelect>
            </div>
          )}
        </div>

        {pageTab === "workItem" && (
          <SprintContainer
            taskType={taskType}
            viewLevel={viewOption[1]?.value}
            onAssign={setAssignVisible}
          />
        )}

        {pageTab === "overview" && project?.detail && currentSprint && (
          <SprintOverview
            project={project.detail}
            sprint={currentSprint}
            onRefresh={refresh}
          />
        )}
        {pageTab === "statistics" && project?.detail && currentSprint && (
          <SprintStatistic project={project.detail} sprint={currentSprint} />
        )}
      </SectionRightWrapper>
      <TaskAssignModal
        visible={!!assignSprintId}
        onClose={() => {
          setAssignVisible(undefined);
          onRefresh();
        }}
        targetSprintId={assignSprintId!}
      />
      <TaskModal
        taskList={taskList as any}
        onClose={() => setTaskList(undefined)}
        visible={!!taskList?.length}
      />
    </SectionWrapper>
  );
};

Index.displayName = "Section";

export default Index;
