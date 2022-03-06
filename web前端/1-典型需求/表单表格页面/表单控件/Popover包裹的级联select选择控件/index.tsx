import React, { memo, useState, useEffect, useCallback, useRef } from "react";
import { Select, Avatar } from "@com/sun";
import styled from "@emotion/styled";
import { Container } from "@/style";
import {
  getTaskGlobal,
  IProjectSimpleItem,
  IProjectTaskRqOv,
  IProjectTaskItem,
  getTestplanList,
} from "@/services/team-member";
import ProjectCascaderSelect from "./components/project-cascader-select";
import ProjectCascaderTreeSelect from "./components/project-cascader-tree-select";

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
  projectIdList: [],
  linkPlans: undefined,
  classify: undefined,
};

const SprintQuality = memo((props) => {
  const [sprintData, setSprintData] = useState<{
    list?: IProjectTaskItem[];
    pagination?: {
      pageSize: number;
      current: number;
      total: number;
    };
  }>({});

  const [projectIdList, setProjectIdList] = useState<string[]>([]); // 项目
  const [linkPlans, setLinkPlans] = useState<any>(); // 关联计划
  const [classify, setClassify] = useState<any>(); // 缺陷分类

  const [linkPlansOptions, setLinkPlansOptions] = useState<any[]>([]);
  const [projectOptions, setProjectOptions] = useState<IProjectSimpleItem[]>(
    []
  );

  const paramRef = useRef<
    IProjectTaskRqOv & {
      linkPlans?: any;
      classify?: any;
    }
  >(paramRefInitial);

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
        projectIdList,
        sprintIdList,
        sprintRecords,
        priority,
        taskTypeId,
        onlineExp,
        linkPlans,
        classify,
      } = paramRef.current;
      const handledLinkPlans = linkPlans?.id ? [linkPlans?.id] : [];
      const classifyIds = classify?.id ? [classify?.id] : [];

      const { success, result } = await getTaskGlobal({
        pageIndex: current ?? pageIndex,
        limit: pageSize ?? limit,
        linkPlans: handledLinkPlans,
        classifyIds,
        projectIdList,
      });
      if (success) {
        const current = result?.pageIndex ?? 1;
        const pageSize = result?.limit ?? 10;
        setSprintData({
          list: result?.content || [],
          pagination: {
            pageSize,
            current,
            total: result?.total ?? 0,
          },
        });
      }
    },
    []
  );

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  const updateParamRef = (key: string, value) => {
    paramRef.current = { ...paramRef.current, [key]: value };
  };

  // 测试计划Options根据所选空间联动
  useEffect(() => {
    const filteredLinkPlansOptions = projectIdList?.length
      ? projectOptions?.filter((item) => projectIdList?.includes(item?.id!))
      : projectOptions;
    setLinkPlansOptions(filteredLinkPlansOptions);

    const curSelectedProjectIds = filteredLinkPlansOptions.map((v) => v?.id);
    setLinkPlans((prev) => {
      const find =
        !!prev?.selectedProjectId &&
        curSelectedProjectIds?.includes(prev?.selectedProjectId);
      const latest = find ? prev : undefined;
      updateParamRef("linkPlans", latest);
      return latest;
    });
    setClassify((prev) => {
      const find =
        !!prev?.selectedProjectId &&
        curSelectedProjectIds?.includes(prev?.selectedProjectId);
      const latest = find ? prev : undefined;
      updateParamRef("classify", latest);
      return latest;
    });
  }, [projectIdList, projectOptions]);

  const handleProjectChange = useCallback((v) => {
    setProjectIdList(v);
    updateParamRef("projectIdList", v);
  }, []);

  const handleProjectCascaderSelectChange = useCallback((v) => {
    setLinkPlans(v);
    updateParamRef("linkPlans", v);
  }, []);

  const handleProjectClassifyTreeSelectChange = useCallback((v) => {
    setClassify(v);
    updateParamRef("classify", v);
  }, []);

  return (
    <Container>
      <FormContainer>
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

        <ProjectCascaderSelect
          className="field-item"
          placeholder="请选择空间下的测试计划"
          value={linkPlans}
          onChange={handleProjectCascaderSelectChange}
          projectList={linkPlansOptions}
          feachRightListService={getTestplanList}
          rightListHandleFun={(item) => ({
            title: item?.taskName,
            id: item?.taskId,
          })}
        />

        <ProjectCascaderTreeSelect
          className="field-item"
          placeholder="请选择空间下的缺陷分类"
          value={classify}
          onChange={handleProjectClassifyTreeSelectChange}
          projectList={linkPlansOptions}
        />
      </FormContainer>
    </Container>
  );
});
export default SprintQuality;
