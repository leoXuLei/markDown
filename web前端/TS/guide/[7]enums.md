# 简介

## 解释

> 随着计算机的不断普及，程序不仅只用于数值计算，还更广泛的用于处理非数值的数据。例如：`性别、月份、星期几、颜色、单位名、学历、职业`等等，都不是数值类型。在其他程序设计语言中，一般用一个数值来代表某一个状态，这种处理方法不直观，易读性差，如果能在程序中用自然语言中有相应含义的单词来代表某一状态，则程序就很容易阅读和理解。也就是说，`事先考虑到某一变量可能取得值，尽量用自然语言中含义清楚的单词来表示它的每个值`，这种方法称为枚举方法`，用这种方法定义的类型称为枚举类型。

## 语法

```typescript
enum 枚举名 {
  标识符[=整型常数]，
  标识符[=整型常数]，
  ...
}
```

## 编译前后文件对比

```typescript
enum Flag {
  success = 1,
  failed,
}
// Flag {1: "success", 2: "failed", success: 1, failed: 2}
// Flag.1  // Uncaught SyntaxError: Unexpected number
// Flag[1] "success"

enum FlagBoolean {
  success = true,
  failed = false,
}
// FlagBoolean {success: true, true: "success", failed: false, false: "failed"}
// FlagBoolean.success  true
// FlagBoolean.true  "success"
enum FlagNU {
  N = null,
  U = undefined,
}
```

```typescript
var Flag;
(function (Flag) {
  Flag[(Flag["success"] = 1)] = "success";
  Flag[(Flag["failed"] = 2)] = "failed";
})(Flag || (Flag = {}));

var FlagBoolean;
(function (FlagBoolean) {
  FlagBoolean[(FlagBoolean["success"] = true)] = "success";
  FlagBoolean[(FlagBoolean["failed"] = false)] = "failed";
})(FlagBoolean || (FlagBoolean = {}));

var FlagNU;
(function (FlagNU) {
  FlagNU[(FlagNU["N"] = null)] = "N";
  FlagNU[(FlagNU["U"] = undefined)] = "U";
})(FlagNU || (FlagNU = {}));
```

# 枚举将 `number` 类型字段的值映射中文

```tsx
// 实例一：
export enum EProjectStatus {
  NORMAL = 1,
  RISKY = 2,
  URGENT = 3,
}

export const ProjectStatusMap = {
  [EProjectStatus.NORMAL]: "进度正常",
  [EProjectStatus.RISKY]: "存在风险",
  [EProjectStatus.URGENT]: "进度失控",
};
```

```tsx
// 实例二（详细）：
export enum EnumRecipeStatus {
  /** 编辑 */
  edit = 0,
  /** 生效 */
  effective = 1,
  /** 已废弃 */
  expired = 2,
  /** 待审核 */
  toAudit = 3,
}

export const RECIPE_STATUS_ZHCH_MAP = {
  [EnumRecipeStatus.edit]: "编辑",
  [EnumRecipeStatus.effective]: "生效",
  [EnumRecipeStatus.expired]: "已废弃",
  [EnumRecipeStatus.toAudit]: "待审核",
};

export const recipeStatusOptions = Object.entries(RECIPE_STATUS_ZHCH_MAP)?.map(
  ([key, value]) => ({
    label: value,
    value: key,
  })
);

const columns = [
  {
    dataIndex: "RecipePower",
    title: "recipe.recipePower",
    render(text: EnumRecipeStatus, record: any, idx: number) {
      return <div className="text">{RECIPE_STATUS_ZHCH_MAP[text]}</div>;
    },
  },
];
```

# Enum 规范 Map

- 实例一

```tsx
export enum DocType {
  PICTURE = "PICTURE",
  TEXT = "TEXT",
  LINK = "LINK",
  GROUPING = "GROUPING",
  FILE = "FILE",
}

export enum DocShareType {
  INVALID = 0,
  SHARING = 1,
  CLOSED = 2,
}

export const DocTypeMap = new Map([
  [DocType.GROUPING, "文件夹"],
  [DocType.TEXT, "文档"],
  [DocType.LINK, "链接"],
  [DocType.PICTURE, "图片"],
]);

export const DocShareTypeMap = new Map([
  [DocShareType.INVALID, "分享失效"],
  [DocShareType.SHARING, "分享中"],
  [DocShareType.CLOSED, "分享关闭"],
]);

const title = useMemo(() => {
  if (props.type === DocType.FILE && !props.directory) {
    return "上传文件";
  }
  if (props.type === DocType.FILE && props.directory) {
    return "上传文件夹";
  }
  return `创建${DocTypeMap.get(props.type! || DocType.TEXT)}`;
}, [props.type, props.directory, DocType.TEXT]);
```

- 实例二

```ts
// 定义枚举
export enum TaskChartLoadType {
  WorkHours = "workHours",
  TaskNum = "taskNum",
}

export type TaskLoadData = {
  staffWorkSaturationEightyPer: number;
  staffWorkSaturationHundredPer: number;
  details: any[];
  charts: {
    // [P in TaskChartLoadType] 标识key的类型是TaskChartLoadType枚举的其中一个值
    [P in TaskChartLoadType]: Array<{
      staffName: string;
      itemNum: number;
      workHours: number;
    }>;
  };
};

// 使用枚举
const [loadData, setLoad] = useState<TaskLoadData>({
  staffWorkSaturationEightyPer: 0,
  staffWorkSaturationHundredPer: 0,
  charts: {
    [TaskChartLoadType.TaskNum]: [],
    [TaskChartLoadType.WorkHours]: [],
  },
  details: [],
});

setLoad({
  staffWorkSaturationHundredPer,
  staffWorkSaturationEightyPer,
  charts: {
    [TaskChartLoadType.TaskNum]: memberTaskItemNumLoadRankTop5,
    [TaskChartLoadType.WorkHours]: memberWorkHourLoadRankTop5,
  },
  details: allMemberLoadRankItems,
});

type ChartFilterProps = {
  list: Array<{ key: TaskChartLoadType; label: string }>;
  onChange: (value: TaskChartLoadType) => void;
};

const loadFilterList = [
  { label: "按任务工时(h)", key: TaskChartLoadType.WorkHours },
  { label: "按工作项数(个)", key: TaskChartLoadType.TaskNum },
];

//如下state的类型即为枚举类型，值为枚举类型的值
const [type, setType] = useState<TaskChartLoadType>(
  TaskChartLoadType.WorkHours
);

setChartData({
  data: (charts[type] || [])
    .map((item) => {
      return {
        name: item.staffName,
        value:
          type === TaskChartLoadType.WorkHours ? item.workHours : item.itemNum,
      };
    })
    .reverse(),
});
```

## 枚举 vs Map

```jsx
export enum ITransformTypeEnum {
  workItem = 'workItem', // 工作项
  originalTask = 'originalTask', // 原始需求
  approvalItem = 'approvalItem', // 审批项
  owner = 'owner', // 负责人
}

export const TRANSFORM_TYPE_ZHCH_MAP = {
  [ITransformTypeEnum.workItem]: '工作项',
  [ITransformTypeEnum.originalTask]: '原始需求',
  [ITransformTypeEnum.approvalItem]: '审批项',
  [ITransformTypeEnum.owner]: '负责人',
}

// export const TRANSFORM_TYPE_MAP = {
//   workItem: 'workItem',
//   originalTask: 'originalTask',
//   approvalItem: 'approvalItem',
//   owner: 'owner',
// }
// export const TRANSFORM_TYPE_ZHCH_MAP = {
//   [TRANSFORM_TYPE_MAP.workItem]: '工作项',
//   [TRANSFORM_TYPE_MAP.originalTask]: '原始需求',
//   [TRANSFORM_TYPE_MAP.approvalItem]: '审批项',
//   [TRANSFORM_TYPE_MAP.owner]: '负责人',
// }


```

# Tips

## 使用 `Boolean` 类型作为数值会报错

```typescript
enum FlagBoolean {
  success = true,
  failed = false,
}
// 只有数字枚举可具有计算成员，但此表达式的类型为“true”。如果不需要全面性检查，请考虑改用对象文本。ts(18033)
```
