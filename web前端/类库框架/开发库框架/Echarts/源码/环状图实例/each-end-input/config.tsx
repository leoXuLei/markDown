export type IRadioType = "all" | "self" | "other";

export type IInputViewType = "staff" | "workDays";

// 环图data映射Map
export const EACH_END_PIE_DATA_MAP = {
  all: "totalEndpointCostResourceList",
  self: "selfEndpointCostResourceList",
  other: "othersEndpointCostResourceList",
};

// 环图弹窗data映射Map
export const EACH_END_MODAL_DATA_MAP = {
  all: "totalInputStaffIds",
  self: "selfStaffIds",
  other: "othersStaffIds",
};

// 各端投入导出
export const EACH_END_EXPORT_MAP = {
  all: "ALL",
  self: "SELF_BUSINESS_LINE",
  other: "OTHER_BUSINESS_LINE",
};

export const INPUT_VIEW_TYPE_MAP = {
  staff: {
    value: "staffNumProportion",
    number: "staffNum",
    unit: "人",
    centerText: "投入人数",
    centerKeyMap: {
      all: "totalInputStaffNum",
      self: "selfStaffNum",
      other: "othersStaffNum",
    },
    optionConfig: {
      legend: {
        top: "10",
        left: "0%",
        height: "30%",
      },
      center: ["55%", "65%"],
    },
  },
  workDays: {
    value: "workHoursProportion",
    number: "workDays",
    unit: "人日",
    centerText: "投入工作量",
    centerKeyMap: {
      all: "totalStaffWorkDays",
      self: "selfStaffWorkDays",
      other: "othersStaffWorkDays",
    },
    optionConfig: {
      legend: {
        top: "10",
        right: "0%",
        height: "30%",
      },
      center: ["45%", "65%"],
    },
  },
};

export const sprintIntervalWorkloadColumns = [
  {
    dataIndex: "staffName",
    title: "人员名称",
    sorter: (a, b) =>
      (a?.staffName || "").localeCompare(b?.staffName || "", "zh"),
  },
  {
    dataIndex: "endpointName",
    title: "所属端",
    sorter: (a, b) =>
      (a?.endpointName || "").localeCompare(b?.endpointName || "", "zh"),
  },
  {
    dataIndex: "totalWorkHours",
    title: "区间投入总工作量（h）",
    sorter: (a, b) => a?.totalWorkHours - b?.totalWorkHours,
  },
  {
    dataIndex: "workHoursForSelfBizLine",
    title: "本业务线/本团队投入工作量（h）",
    sorter: (a, b) => a?.workHoursForSelfBizLine - b?.workHoursForSelfBizLine,
  },
  {
    dataIndex: "workHoursForOtherBizLine",
    title: "其它投入工作量（h）",
    sorter: (a, b) => a?.workHoursForOtherBizLine - b?.workHoursForOtherBizLine,
  },
  {
    dataIndex: "orgName",
    title: "所属团队",
    sorter: (a, b) => (a?.orgName || "").localeCompare(b?.orgName || "", "zh"),
  },
];
