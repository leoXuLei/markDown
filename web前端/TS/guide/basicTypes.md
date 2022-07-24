# 基础类型

## 介绍

为了让程序有价值，我们需要能够处理最简单的数据单元：数字，字符串，结构体，布尔值等。 TS 支持与 JS 几乎相同的数据类型，此外还提供了实用的枚举类型方便我们使用。

`let 变量名：类型 = 变量值`

```typescript
let temp: string;
temp = 123; // 不能将类型“123”分配给类型“string”。ts(2322)
```

## boolean

布尔值

```typescript
let isDone: boolean = false;
```

## number

数字，和 JavaScript 一样，TypeScript 里的所有数字都是浮点数。 这些浮点数的类型是 number。 除了支持十进制和十六进制字面量，TypeScript 还支持 ECMAScript 2015 中引入的二进制和八进制字面量。

```typescript
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
let binaryLiteral: number = 0b1010;
let octalLiteral: number = 0o744;
```

## string

JavaScript 程序的另一项基本操作是处理网页或服务器端的文本数据。 string 表示文本数据类型。 和 JavaScript 一样，可以使用双引号（ "）或单引号（'）表示字符串。

```typescript
let name: string = "bob";
name = "smith";
```

你还可以使用`模版字符串`，它可以定义多行文本和内嵌表达式。 这种字符串是被反引号包围（ `），并且以\${ expr }这种形式嵌入表达式

```typescript
let name: string = `Gene`;
let age: number = 37;
let sentence: string = `Hello, my name is ${name}. 
I'll be ${age + 1} years old next month.`;
```

这与下面定义 sentence 的方式效果相同：

```typescript
let sentence: string =
  "Hello, my name is " +
  name +
  ".\n\n" +
  "I'll be " +
  (age + 1) +
  " years old next month.";
```

## array

> **灵活性的降低却使得数组元素更加规范**

有下面几种方式可以定义数组：

- **类型[]**

在元素类型后面接上 `[]` ，表示由此类型元素组成的一个数组：

```typescript
let list: number[] = [1, 2, 3];
let arrString: string[] = ["1", "2", "3"];
const arr: object[] = [{ age: 12 }, { age: 13 }];
// 使用Array<object>报错：Array type using 'Array<object>' is forbidden. Use 'object[]'

// 对象数组
const [canBeRelatedSprintList, setCanBeRelatedSprintList] =
  useState<Array<{ value?: string; label?: string }>>();
```

- **Array<类型>**

使用数组泛型，Array<元素类型>：

```typescript
let list: Array<number> = [1, 2, 3];
let arrString: Array<string> = ["1", "2", "3"];
```

- **接口**

```js
interface NumberArr {
  [index: number]: number;
}
let arrNumber: NumberArr = [1, 2, 3];

interface StringArr {
  [index: number]: string;
}
let arrString: StringArr = ["1", "2", "3"];

interface ObjectArr {
  [index: number]: object;
}
let arrObject: ObjectArr = [{ name: "xiao ming" }, { name: "han mei mei" }];

{
  label, value;
}
[];
```

- **any 混合类型**

用 any 表示数组中允许出现任意类型

```typescript
let list: any[] = [1, true, "free", { name: "li" }];
```

参考资料：[ts. 数组的类型相关](https://segmentfault.com/a/1190000019236875)

## object

object 表示非原始类型(引用数据类型)，也就是除 number，string，boolean，symbol，null 或 undefined 之外的类型。

使用 object 类型，就可以更好的表示像 Object.create 这样的 API。例如：

```typescript
declare function create(o: object | null): void;

create({ prop: 0 }); // OK
create(null); // OK

create(42); // Error
create("string"); // Error
create(false); // Error
create(undefined); // Error
```

**实践：**

```typescript
// 【1】
state = {
  propertyDetail: {} as any,
};

// 【2】
let x: { [key: string]: any } = {};

// 【3】
interface PriceValue {
  number?: number;
  currency?: "rmb" | "dollar";
}

interface PriceInputProps {
  value?: PriceValue;
  onChange?: (value: PriceValue) => void;
}
```

## tuple 元祖

**是数组的一种 ，只是各元素类型不必相同**

元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。 比如，你可以定义一对值分别为 string 和 number 类型的元组。

```typescript
// Declare a tuple type
let x: [string, number];
// Initialize it
x = ["hello", 10]; // OK
// Initialize it incorrectly
x = [10, "hello"]; // Error
```

当访问一个已知索引的元素，会得到正确的类型：

```typescript
console.log(x[0].substr(1)); // OK
console.log(x[1].substr(1)); // Error, 'number' does not have 'substr'
```

当访问一个越界的元素，会使用联合类型替代：

```typescript
x[3] = "world"; // OK, 字符串可以赋值给(string | number)类型

console.log(x[5].toString()); // OK, 'string' 和 'number' 都有 toString

x[6] = true; // Error, 布尔不是(string | number)类型
```

## enum 枚举

> 如果没有赋值就是下标，如果赋值了就是赋的值

enum 类型是对 JavaScript 标准数据类型的一个补充。 像 C#等其它语言一样，使用枚举类型可以为一组数值赋予友好的名字。

```typescript
enum Color {
  Red,
  Green,
  Blue,
}
let c: Color = Color.Green;
```

默认情况下，从 0 开始为元素编号。 你也可以手动的指定成员的数值。 例如，我们将上面的例子改成从 1 开始编号：

```typescript
enum Color {
  Red = 1,
  Green,
  Blue,
}
let c: Color = Color.Green;
```

或者，全部都采用手动赋值：

```typescript
enum Color {
  Red = 1,
  Green = 2,
  Blue = 4,
}
let c: Color = Color.Green;
```

枚举类型提供的一个便利是你可以由枚举的值得到它的名字。 例如，我们知道数值为 2，但是不确定它映射到 Color 里的哪个名字，我们可以查找相应的名字：

```typescript
enum Color {
  Red = 1,
  Green,
  Blue,
}
let colorName: string = Color[2];
console.log(colorName); // 显示'Green'因为上面代码里它的值是2
```

**解释**

> 随着计算机的不断普及，程序不仅只用于数值计算，还更广泛的用于处理非数值的数据。例如：`性别、月份、星期几、颜色、单位名、学历、职业`等等，都不是数值类型。在其他程序设计语言中，一般用一个数值来代表某一个状态，这种处理方法不直观，易读性差，如果能在程序中用自然语言中有相应含义的单词来代表某一状态，则程序就很容易阅读和理解。也就是说，`事先考虑到某一变量可能取得值，尽量用自然语言中含义清楚的单词来表示它的每个值`，这种方法称为枚举方法`，用这种方法定义的类型称为枚举类型。

语法

```typescript
enum 枚举名 {
  标识符[=整型常数]，
  标识符[=整型常数]，
  ...
}
```

编译前后文件对比

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

使用 Boolean 类型作为数值会报错

```typescript
enum FlagBoolean {
  success = true,
  failed = false,
}
// 只有数字枚举可具有计算成员，但此表达式的类型为“true”。如果不需要全面性检查，请考虑改用对象文本。ts(18033)
```

### 通过枚举将 number 类型字段的值映射中文

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

### 实战：enum 规范 map

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

```ts
export enum CheckItemType {
  DocumentLike = "FILE_OR_DOCUMENT_LINK",
  Field = "FIELD",
  Form = "FORM",
  SprintDuration = "SPRINT_RANGE",
  ConfirmInfo = "NON_EMPTY_BULLET_FRAME",
}
```

map vs 枚举

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

## any (不清楚类型)

有时候，我们会想要为那些在编程阶段还不清楚类型的变量指定一个类型。 我们**不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查**。 那么我们可以使用 any 类型来标记这些变量：

```typescript
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean
```

在对现有代码进行改写的时候，any 类型是十分有用的，它允许你在编译时可选择地包含或移除类型检查。 你可能认为 Object 有相似的作用，就像它在其它语言中那样。 但是 Object 类型的变量只是允许你给它赋任意值 - 但是却不能够在它上面调用任意的方法，即便它真的有这些方法：

```typescript
let notSure: any = 4;
notSure.ifItExists(); // okay, ifItExists might exist at runtime
notSure.toFixed(); // okay, toFixed exists (but the compiler doesn't check)

let prettySure: Object = 4;
prettySure.toFixed(); // Error: Property 'toFixed' doesn't exist on type 'Object'.
```

当你只知道一部分数据的类型时，any 类型也是有用的。 比如，你有一个数组，它包含了不同的类型的数据：

```typescript
let list: any[] = [1, true, "free"];

list[1] = 100;
```

## void (没有任何类型)

某种程度上来说，void 类型像是与 any 类型相反，它表示没有任何类型。 当一个函数没有返回值时，你通常会见到其返回值类型是 void：

```typescript
function warnUser(): void {
  console.log("This is my warning message");
}
```

声明一个 void 类型的变量没有什么大用，因为你只能为它赋予 undefined 和 null：

```typescript
let unusable: void = undefined;
```

## null 和 undefined

TS 里，undefined 和 null 两者各自有自己的类型分别叫做 undefined 和 null。 和 void 相似，它们的本身的类型用处不是很大：

```typescript
// Not much else we can assign to these variables!
let u: undefined = undefined;
let n: null = null;
```

**默认情况下 null 和 undefined 是所有类型的子类型。 就是说你可以把 null 和 undefined 赋值给 number 类型的变量。**

然而，当你指定了 `--strictNullChecks` 标记，null 和 undefined 只能赋值给 void 和它们各自。 这能避免很多常见的问题。 也许在某处你想传入一个 string 或 null 或 undefined，你可以使用联合类型 `string | null | undefined`。

## never (永不存在的值的类型)

never 类型表示的是那些永不存在的值的类型。 例如，never 类型是那些**总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型**； 变量也可能是 never 类型，当它们被永不为真的类型保护所约束时。

**never 类型是任何类型的子类型，也可以赋值给任何类型；然而，没有类型是 never 的子类型或可以赋值给 never 类型（除了 never 本身之外）。 即使 any 也不可以赋值给 never**。

下面是一些返回 never 类型的函数：

```typescript
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
  throw new Error(message);
}

// 推断的返回值类型为never
function fail() {
  return error("Something failed");
}

// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
  while (true) {}
}
```

## 类型断言

有时候你会遇到这样的情况，你会比 TypeScript 更了解某个值的详细信息。 通常这会发生在你清楚地知道一个实体具有比它现有类型更确切的类型。

通过类型断言这种方式可以告诉编译器，“相信我，我知道自己在干什么”。 类型断言好比其它语言里的类型转换，但是不进行特殊的数据检查和解构。 **它没有运行时的影响，只是在编译阶段起作用**。 TypeScript 会假设你，程序员，**已经进行了必须的检查**。

类型断言有两种形式。 其一是“尖括号”语法：

```typescript
let someValue: any = "this is a string";

let strLength: number = (<string>someValue).length;
```

另一个为 as 语法（**JSX 只允许 as 语法**）：

```typescript
let someValue: any = "this is a string";

let strLength: number = (someValue as string).length;
```

两种形式是等价的。至于使用哪个大多数情况下是凭个人喜好；然而，当你在 TS 里使用 JSX 时，只有 as 语法断言是被允许的。
