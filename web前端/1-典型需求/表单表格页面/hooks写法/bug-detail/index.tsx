import React, {
  memo,
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
  useMemo,
} from "react";
import {
  Table,
  Input,
  Select,
  Button,
  Avatar,
  Cascader,
  Radio,
} from "@com/sun";
import styled from "@emotion/styled";
import { DataContext } from "@/blocks/common/report-form/data";
import { Container, Header } from "@/blocks/resource/style";
import useAppLocales from "@/hooks/use-app-locales";
import { ESorter } from "@/blocks/common/report-form/config";
import { bugPriorityOptions, downloadFile } from "@/utils/common";
import { useDialog } from "@/hooks/use-dialog";
import { SearchOutlined, ExportOutlined } from "@ant-design/icons";
import { genStaffs } from "@/blocks/common/report-form/utils";
import { DoubleInputNumber } from "@/components/double-input-number";
import { Tasks } from "@com/omps-ui";
import {
  getBusinessLineTestPlan,
  getBusinessLineProjects,
  getBusinessLineSprints,
  getTaskGlobal,
  IProjectSimpleItem,
  IBusinessLineSprintItem,
  IProjectTaskRqOv,
  IProjectTaskItem,
} from "@/ekko/services/team-member";
import StaffSearchSelect from "client/components/staff-org-staff-select";
import { getBugDetailColumns, bugStateOptions } from "./config";

const FormContainer = styled.div`
  .field-item {
    width: 280px;
    margin: 20px 30px 0 0;
  }
`;
const ProjectItemContainer = styled.div`
  color: #8c8c8c;
  .ant-avatar {
    margin-right: 8px;
  }
`;

const ReopenContainer = styled.div`
  max-width: 300px;
  margin: 20px 30px 0 0;
  height: 32px;
  display: inline-block;
  .wrap {
    display: flex;
    align-items: center;
    .label {
      min-width: 84px;
      color: rgb(89, 89, 89);
      flex-shrink: 0;
    }
    .content {
      cursor: pointer;
      color: rgb(140, 140, 140);
      padding: 0 8px;
    }
  }
`;
const ButtonContainer = styled.div`
  display: inline-block;
  margin-top: 20px;
  .export {
    margin-left: 30px;
  }
`;

interface ILinkPlans {
  label: string;
  value: string;
  children: Array<{
    label: string;
    value: number;
  }>;
}

type TaskDetailData = {
  projectId: string;
  taskId: string;
  // onlyRead: boolean
};

const { Option } = Select;

const paramRefInitial = {
  pageIndex: 1,
  limit: 10,
  sortFields: [],
  creator: [],
  executor: [],
  involvers: [],
  identifiers: [],
  taskTitle: "",
  taskFlowStateIds: [],
  linkPlans: [],
  projectIdList: [],
  sprintIdList: [],
  sprintRecords: [],
  priority: "",
  taskTypeId: "tasktype3",
  onlineExp: undefined,
};

const onlineExpMap = {
  0: false,
  1: true,
};

const SprintQuality = memo((props) => {
  const { overview: i18n } = useAppLocales();
  const { state, dispatch } = useContext(DataContext);
  const { params, loading } = state ?? {};
  const { bizLineId, startTime, endTime } = params ?? {};

  const [sprintData, setSprintData] = useState<{
    list?: IProjectTaskItem[];
    pagination?: {
      pageSize: number;
      current: number;
      total: number;
    };
  }>({});
  const [taskDetailData, taskDetailAction] = useDialog<TaskDetailData>();

  const [tableLoading, setTableLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const [executor, setExecutor] = useState<string[]>([]); // 经办人
  const [involver, setInvolver] = useState<string[]>([]); // 参与人
  const [creator, setCreator] = useState<string[]>([]); // 创建人
  const [taskTitle, setTaskTitle] = useState(""); // bug标题
  const [taskFlowStateIds, setTaskFlowStateIds] = useState<string[]>([]); // bug状态
  const [linkPlans, setLinkPlans] = useState<string[]>([]); // 关联计划
  const [projectIdList, setProjectIdList] = useState<string[]>([]); // 项目
  const [sprintIdList, setSprintIdList] = useState<string[]>([]); // 迭代
  const [priority, setPriority] = useState<string | undefined>(); // 优先级
  const [reopen, setReopen] = useState<Array<number | undefined>>([]); // reopen次数
  const [onlineExp, setOnlineExp] = useState<string | undefined>(undefined); // 是否线上问题
  const [identifier, setIdentifier] = useState<string[]>([]); // 验证人
  const [sprintRecords, setSprintRecords] = useState<string[]>([]); // 历经迭代

  const [linkPlansOptions, setLinkPlansOptions] = useState<ILinkPlans[]>([]);
  const [projectOptions, setProjectOptions] = useState<IProjectSimpleItem[]>(
    []
  );

  const sprintSourceRef = useRef<IBusinessLineSprintItem[]>([]); // 迭代接口数据
  const linkPlansRef = useRef<ILinkPlans[]>([]); // // 关联计划接口数据
  const paramRef = useRef<
    IProjectTaskRqOv & {
      onlineExp?: string;
    }
  >(paramRefInitial);

  useEffect(() => {
    if (bizLineId) {
      produceTestPlanOptions(bizLineId!);
      produceProjectOptions(bizLineId!);
      produceSprintOptions(bizLineId!);
    }
  }, [bizLineId]);

  const handleExecutorChange = useCallback((v) => {
    setExecutor(v);
    updateParamRef("executor", v);
  }, []);

  const handleInvolverChange = useCallback((v) => {
    setInvolver(v);
    updateParamRef("involvers", v);
  }, []);

  const handleCreatorChange = useCallback((v) => {
    setCreator(v);
    updateParamRef("creator", v);
  }, []);

  const handleIdentifierChange = useCallback((v) => {
    setIdentifier(v);
    updateParamRef("identifiers", v);
  }, []);

  const handleBugTitleChange = useCallback((e) => {
    const value = e?.target?.value;
    setTaskTitle(value);
    updateParamRef("taskTitle", value);
  }, []);

  const handleBugStateChange = useCallback((v) => {
    setTaskFlowStateIds(v);
    updateParamRef("taskFlowStateIds", v);
  }, []);

  const handleLinkedPlanChange = useCallback((v) => {
    setLinkPlans(v);
    updateParamRef("linkPlans", v);
  }, []);

  const handleProjectChange = useCallback((v) => {
    setProjectIdList(v);
    updateParamRef("projectIdList", v);
  }, []);

  const handleSprintChange = useCallback((v) => {
    setSprintIdList(v);
    updateParamRef("sprintIdList", v);
  }, []);

  const handleSprintRecordChange = useCallback((v) => {
    setSprintRecords(v);
    updateParamRef("sprintRecords", v);
  }, []);

  const handlePriorityChange = useCallback((v) => {
    setPriority(v);
    updateParamRef("priority", v);
  }, []);

  const handleOnlineExpChange = useCallback((v) => {
    setOnlineExp(v);
    updateParamRef("onlineExp", v);
  }, []);

  const handleReopenChange = (
    key: string,
    value: Array<number | undefined>
  ) => {
    setReopen(value);
    updateParamRef(key, value);
  };

  const updateParamRef = (key: string, value) => {
    paramRef.current = { ...paramRef.current, [key]: value };
  };

  const handleSearch = () => {
    fetchTableData();
  };

  const handleReset = () => {
    setExecutor([]);
    setInvolver([]);
    setCreator([]);
    setIdentifier([]);
    setTaskTitle("");
    setTaskFlowStateIds([]);
    setLinkPlans([]);
    setProjectIdList([]);
    setSprintIdList([]);
    setSprintRecords([]);
    setPriority(undefined);
    setReopen([]);
    setOnlineExp(undefined);
    paramRef.current = paramRefInitial;
    fetchTableData();
  };

  const handleExport = useCallback(async () => {
    const {
      creator,
      executor,
      involvers,
      identifiers,
      taskTitle,
      taskFlowStateIds,
      linkPlans,
      projectIdList,
      sprintIdList,
      sprintRecords,
      priority,
      taskTypeId,
      onlineExp,
    } = paramRef.current;
    const handledLinkPlans = linkPlans?.[1] ? [linkPlans?.[1]] : [];
    setExportLoading(true);
    await downloadFile(
      "/api/task/global/bugs/excel",
      {
        businessLineId: bizLineId!,
        leftCreateTime: Number(startTime),
        rightCreateTime: Number(endTime),
        creator,
        executor,
        involvers,
        identifiers,
        taskTitle,
        taskFlowStateIds,
        linkPlans: handledLinkPlans,
        projectIdList,
        sprintIdList,
        sprintRecords,
        priority,
        taskTypeId,
        reopenTimesMin: reopen?.[0],
        reopenTimesMax: reopen?.[1],
        onlineExp: onlineExp && onlineExpMap[onlineExp],
      },
      "post"
    );
    setExportLoading(false);
  }, [reopen, bizLineId, startTime, endTime]);

  const fetchTableData = useCallback(
    async (current?: number, pageSize?: number) => {
      const {
        pageIndex,
        limit,
        sortFields,
        creator,
        executor,
        involvers,
        identifiers,
        taskTitle,
        taskFlowStateIds,
        linkPlans,
        projectIdList,
        sprintIdList,
        sprintRecords,
        priority,
        taskTypeId,
        onlineExp,
      } = paramRef.current;
      const handledLinkPlans = linkPlans?.[1] ? [linkPlans?.[1]] : [];
      setTableLoading(true);

      const { success, result } = await getTaskGlobal({
        businessLineId: bizLineId!,
        leftCreateTime: Number(startTime),
        rightCreateTime: Number(endTime),
        pageIndex: current ?? pageIndex,
        limit: pageSize ?? limit,
        sortFields,
        creator,
        executor,
        involvers,
        identifiers,
        taskTitle,
        taskFlowStateIds,
        linkPlans: handledLinkPlans,
        projectIdList,
        sprintIdList,
        sprintRecords,
        priority,
        taskTypeId,
        reopenTimesMin: reopen?.[0],
        reopenTimesMax: reopen?.[1],
        onlineExp: onlineExp && onlineExpMap[onlineExp],
      }).finally(() => {
        setTableLoading(false);
        dispatch({
          type: "fetch-data",
          payload: false,
        });
      });
      if (success) {
        const current = result?.pageIndex ?? 1;
        const pageSize = result?.limit ?? 10;
        const total = result?.total ?? 0;
        setSprintData({
          list: result?.content || [],
          pagination: {
            pageSize,
            current,
            total,
          },
        });
      }
    },
    [bizLineId, startTime, endTime, reopen, dispatch]
  );

  useEffect(() => {
    if (loading) {
      fetchTableData();
    }
  }, [loading, fetchTableData]);

  const handleTableChange = useCallback(
    (info) => {
      const { pagination, sorter } = info;
      const SORTER_MAP = {
        planBugFixTime: "extendProperties.planBugFixTime",
        taskFlowState: "taskFlowStateId",
        yanzhongchengdu: "extendProperties.yanzhongchengdu",
      };
      updateParamRef(
        "sortFields",
        ESorter[sorter?.order]
          ? [
              {
                fieldName: SORTER_MAP[sorter?.field] || sorter?.field,
                sortType: ESorter[sorter?.order],
              },
            ]
          : []
      );
      const { current, pageSize } = pagination;
      fetchTableData(current, pageSize);
    },
    [fetchTableData]
  );

  const produceTestPlanOptions = useCallback(async (businessId: string) => {
    const { result, success } = await getBusinessLineTestPlan(businessId);
    if (success) {
      const handledLinkPlansOptions =
        result?.map((v) => ({
          label: v?.projectName!,
          value: v?.projectId!,
          children:
            v?.testPlans?.map((item) => ({
              label: item?.taskName!,
              value: item?.taskId!,
            })) || [],
        })) || [];
      setLinkPlansOptions(handledLinkPlansOptions);
      linkPlansRef.current = handledLinkPlansOptions;
    }
  }, []);

  const produceProjectOptions = useCallback(async (businessId: string) => {
    const { result, success } = await getBusinessLineProjects(businessId);
    if (success) {
      setProjectOptions(result || []);
    }
  }, []);

  const produceSprintOptions = useCallback(async (businessId: string) => {
    const { result, success } = await getBusinessLineSprints(businessId);
    if (success) {
      const sprintOriginList =
        result?.map((item) => ({
          projectId: item?.projectId!,
          name: item?.name!,
          id: item?.id!,
        })) || [];
      sprintSourceRef.current = sprintOriginList;
    }
  }, []);

  const handledSprintOptions = useMemo(() => {
    const filteredSprintOptions = projectIdList?.length
      ? sprintSourceRef.current?.filter((item) =>
          projectIdList?.includes(item?.projectId!)
        )
      : [];

    const handledSprintOptions = [
      {
        label: "未规划",
        value: "unplanned",
      },
      ...(filteredSprintOptions?.map((item) => ({
        label: item?.name!,
        value: item?.id!,
      })) || []),
    ];
    const handledSprintIds = handledSprintOptions.map((v) => v?.value);
    const sprintFilterFun = (v) => handledSprintIds?.includes(v);

    setSprintIdList((prev) => {
      const latest = [...prev.filter(sprintFilterFun)];
      updateParamRef("sprintIdList", latest);
      return latest;
    });
    setSprintRecords((prev) => {
      const latest = [...prev.filter(sprintFilterFun)];
      updateParamRef("sprintRecords", latest);
      return latest;
    });
    return handledSprintOptions;
  }, [projectIdList]);

  useEffect(() => {
    const filteredLinkPlansOptions = projectIdList?.length
      ? linkPlansRef.current?.filter((item) =>
          projectIdList?.includes(item?.value)
        )
      : linkPlansRef.current;
    setLinkPlansOptions(filteredLinkPlansOptions);

    const handledProjectIds = filteredLinkPlansOptions.map((v) => v?.value);
    setLinkPlans((prev) => {
      const find = prev?.[0] && handledProjectIds?.includes(prev?.[0]);
      const latest = find ? prev : [];
      updateParamRef("linkPlans", latest);
      return latest;
    });
  }, [projectIdList]);

  const filterLinkPlans = (inputValue, path) => {
    return path?.some(
      (option) =>
        option?.label?.toLowerCase?.()?.indexOf(inputValue?.toLowerCase?.()) >
        -1
    );
  };

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

  return (
    <Container>
      <Header style={{ paddingBottom: "4px" }}>
        <div className="title">{i18n.bugDetail}</div>
      </Header>
      <div
        className="card-header"
        style={{
          paddingBottom: "30px",
        }}
      >
        <FormContainer>
          <Input
            className="field-item"
            placeholder="请输入bug标题"
            allowClear
            value={taskTitle}
            onChange={handleBugTitleChange}
          />
          <Select
            className="field-item"
            placeholder="请选择bug状态"
            allowClear
            mode="multiple"
            maxTagCount={3}
            value={taskFlowStateIds}
            options={bugStateOptions}
            optionFilterProp="label"
            onChange={handleBugStateChange}
          />
          <StaffSearchSelect
            className="field-item"
            placeholder="请搜索经办人"
            value={executor}
            onChange={handleExecutorChange}
          />
          <StaffSearchSelect
            className="field-item"
            placeholder="请搜索创建人"
            value={creator}
            onChange={handleCreatorChange}
          />
          <Select
            className="field-item"
            placeholder="请选择空间"
            allowClear
            mode="multiple"
            maxTagCount={3}
            value={projectIdList}
            optionFilterProp="label"
            onChange={handleProjectChange}
          >
            {projectOptions?.map((item) => {
              return (
                <Option key={item?.id!} value={item?.id!} label={item?.name}>
                  <ProjectItemContainer>
                    <Avatar shape="square" size="small" src={item?.icon} />
                    {item?.name}
                  </ProjectItemContainer>
                </Option>
              );
            })}
          </Select>
          <Cascader
            className="field-item"
            placeholder="请选择关联计划"
            allowClear
            value={linkPlans}
            options={linkPlansOptions}
            onChange={handleLinkedPlanChange}
            showSearch={{ filter: filterLinkPlans }}
          />
          <Select
            className="field-item"
            placeholder="请选择迭代"
            allowClear
            mode="multiple"
            maxTagCount={3}
            value={sprintIdList}
            options={handledSprintOptions}
            optionFilterProp="label"
            onChange={handleSprintChange}
          />
          <Select
            className="field-item"
            placeholder="请选择历经迭代"
            allowClear
            mode="multiple"
            maxTagCount={3}
            value={sprintRecords}
            options={handledSprintOptions?.filter(
              (v) => v?.value !== "unplanned"
            )}
            optionFilterProp="label"
            onChange={handleSprintRecordChange}
          />
          <Select
            className="field-item"
            placeholder="请选择优先级"
            allowClear
            value={priority}
            options={bugPriorityOptions}
            optionFilterProp="label"
            onChange={handlePriorityChange}
          />
          <StaffSearchSelect
            className="field-item"
            placeholder="请搜索参与人"
            value={involver}
            onChange={handleInvolverChange}
          />
          <StaffSearchSelect
            className="field-item"
            placeholder="请搜索验证人"
            value={identifier}
            onChange={handleIdentifierChange}
          />
          <Select
            className="field-item"
            placeholder="请选择是否线上问题"
            allowClear
            value={onlineExp}
            options={[
              {
                label: "是",
                value: "1",
              },
              {
                label: "否",
                value: "0",
              },
            ]}
            optionFilterProp="label"
            onChange={handleOnlineExpChange}
          />
          <ReopenContainer>
            <div className="wrap">
              <div className="label">reopen次数:</div>
              <div className="content">
                <DoubleInputNumber
                  propKey={"reopen"}
                  value={reopen}
                  onChange={handleReopenChange}
                />
              </div>
            </div>
          </ReopenContainer>

          <ButtonContainer>
            <Button onClick={handleReset}>重置</Button>

            <Button
              type="primary"
              icon={<SearchOutlined />}
              loading={tableLoading}
              style={{ marginLeft: "30px" }}
              onClick={handleSearch}
            >
              搜索
            </Button>
            <span style={{ marginLeft: "30px" }}>
              bug总数：{sprintData?.pagination?.total || 0}
            </span>
            <Button
              icon={<ExportOutlined />}
              shape="round"
              type="primary"
              loading={exportLoading}
              onClick={handleExport}
              className="export"
            >
              导出
            </Button>
          </ButtonContainer>
        </FormContainer>
      </div>

      <Table
        rowKey="id"
        columns={tableColumns}
        dataSource={sprintData?.list}
        loading={tableLoading}
        scroll={{ x: 1300, y: 900 }}
        pagination={{
          ...sprintData?.pagination,
          showSizeChanger: true,
        }}
        onChange={(pagination, filters, sorter, extra) => {
          handleTableChange?.({ pagination, filters, sorter, extra });
        }}
      />

      <Tasks.TasksDetailsDialog
        visible={taskDetailData.visible}
        onCancel={taskDetailAction.hideDialog}
        {...taskDetailData.data}
        onlyRead
      />
    </Container>
  );
});
export default SprintQuality;
