import React from "react";
import { dateFormat, _tyPathMap } from "@/utils";
import { bugPriorityMap, SprintsWrapper } from "@/utils/common";
import { ConditionComponent } from "client/components/conditions";
import { ClickShowModalWrapper } from "@/blocks/common/report-form/style";
import { Avatar } from "@com/omps-ui";
import {
  RenderTitle,
  RenderProjectTitle,
  RenderMember,
} from "@/blocks/common/report-form/cell-render";

export const getBugDetailColumns = (onClickTaskTitle) => [
  {
    title: "BUG 标题",
    dataIndex: "title",
    sorter: true,
    fixed: true,
    width: 180,
    render(value, record) {
      return (
        <ConditionComponent isShow={!!value}>
          <ClickShowModalWrapper onClick={() => onClickTaskTitle(record)}>
            <div
              title={value}
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {value}
            </div>
          </ClickShowModalWrapper>
        </ConditionComponent>
      );
    },
  },

  {
    title: "BUG 状态",
    dataIndex: "taskFlowState",
    sorter: true,
    width: 180,
    render: (v, record) => record?.taskFlowState?.name || "",
  },
  {
    title: "优先级",
    dataIndex: "yanzhongchengdu",
    sorter: true,
    width: 200,
    render: (v) => bugPriorityMap[v] || "",
  },
  {
    title: "经办人",
    dataIndex: "executor",
    sorter: true,
    width: 200,
    render: (v) => <RenderMember member={v} />,
  },

  {
    title: "所属计划",
    dataIndex: "taskName",
    width: 200,
    render: (v, record) => record?.testInfo?.taskName || "",
  },

  {
    title: "计划状态",
    dataIndex: "taskStatus",
    width: 180,
    render: (v, record) => record?.testInfo?.taskStatus || "",
  },

  {
    title: "预计修复时间",
    dataIndex: "planBugFixTime",
    width: 180,
    sorter: true,
    render: (v) => <span>{v ? dateFormat(v, "YYYY/MM/DD") : ""}</span>,
  },
  {
    title: "截止时间",
    dataIndex: "endTime",
    width: 180,
    sorter: true,
    render: (v) => <span>{v ? dateFormat(v, "YYYY/MM/DD") : ""}</span>,
  },
  {
    title: "所属迭代",
    dataIndex: "sprintId",
    sorter: true,
    width: 200,
    render: (v, record) => (
      <RenderTitle
        sprintName={record?.sprint?.name}
        sprintId={record?.sprint?.id}
        projectId={record?.projectId}
      />
    ),
  },
  {
    title: "所属空间",
    dataIndex: "projectId",
    sorter: true,
    width: 200,
    render: (v, record) => (
      <RenderProjectTitle
        accessible
        // icon={record?.project?.icon}
        projectName={record?.project?.name}
        projectId={record?.project?.id}
      />
    ),
  },
  {
    title: "分类",
    dataIndex: "classify",
    sorter: true,
    width: 200,
    render: (v, record) => record?.classify?.name || "",
  },
  {
    title: "创建人",
    dataIndex: "creatorStaff",
    sorter: true,
    width: 200,
    render: (v) => <RenderMember member={v} />,
  },
  {
    title: "参与人",
    dataIndex: "involverStaffs",
    width: 200,
    render: (v, records) => (
      <Avatar.AvatarUsers value={records?.involverStaffs || []} />
    ),
  },
  {
    title: "验证人",
    dataIndex: "identifier",
    sorter: true,
    width: 200,
    render: (v) => <RenderMember member={v} />,
  },
  {
    dataIndex: "sprints",
    title: "历经迭代",
    width: 200,
    render: (v, record) => (
      <SprintsWrapper>
        {v?.map((sprint) => (
          <RenderTitle
            key={sprint?.sprintId}
            sprintName={sprint?.sprintName}
            sprintId={sprint?.sprintId}
            projectId={record.projectId}
          />
        ))}
      </SprintsWrapper>
    ),
  },
  {
    title: "创建时间",
    dataIndex: "gmtCreate",
    width: 180,
    sorter: true,
    render: (v) => <span>{v ? dateFormat(v, "YYYY/MM/DD") : ""}</span>,
  },
];

export const bugStateOptions = [
  { value: "state1", label: "新增问题" },
  { value: "state3", label: "修复中" },
  { value: "state4", label: "已修复" },
  { value: "state9", label: "暂不处理" },
  { value: "state2", label: "延期处理" },
  { value: "state7", label: "驳回" },
  { value: "state5", label: "重新开启" },
  { value: "state6", label: "关闭" },
  { value: "state8", label: "遗留" },
];
