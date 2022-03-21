# React 用法

## 扩展名

所有包含 jsx 语法的 ts 文件的扩展名都必须为 .tsx。

## 类型断言

由于尖括号语法于 jsx 语法存在冲突，所以在 .tsx 文件中，尖括号语法是被禁用的，只能使用 as 语法进行类型断言。也更推荐使用 as 语法，因为更加直观，更能体现断言。
组件定义

## 组件定义

> React 的组件可以定义为 函数（React.FC<>）或 class（继承 React.Component） 的形式。

### 函数式组件

```ts
import React, { FC, Component, useState, useEffect, useCallback } from "react";

// 无状态组件
const StatelessComponent: FC = () => {
  return <p>Hello world!</p>;
};

interface FunctionComponentProps {
  value: number;
}

// 有状态函数组件
const FunctionComponent: FC<FunctionComponentProps> = ({ value }) => {
  return <p>this is {value}</p>;
};

// hook
const HookComponent: FC = () => {
  const [count, setCount] = useState(0);

  useEffect((): void => {
    console.log("mount");
  }, []);

  const handleClick = useCallback((): void => {
    setCount(count + 1);
  }, [count]);

  return (
    <div>
      <button>click</button>
      {count}
    </div>
  );
};
```

#### React.FC<>

- `React.FC`是函数式组件，是在 TypeScript 使用的一个泛型，FC 就是 FunctionComponent 的缩写，事实上`React.FC`可以写成`React.FunctionComponent`

```ts
const App: React.FunctionComponent<{ message: string }> = ({ message }) => (
  <div>{message}</div>
);
```

- React.FC 包含了 PropsWithChildren 的泛型，不用显式的声明 props.children 的类型。`React.FC<>`对于返回类型是显式的，而普通函数版本是隐式的（否则需要附加注释）。
- React.FC 提供了类型检查和自动完成的静态属性：displayName，propTypes 和 defaultProps（注意：defaultProps 与 React.FC 结合使用会存在一些[问题](https://github.com/typescript-cheatsheets/react/issues/87)）。

- 我们使用 React.FC 来写 React 组件的时候，是不能用 setState 的，取而代之的是 useState()、useEffect 等 Hook API。

### class 组件

#### React.Component

> class xx extends React.Component

如需定义 class 组件，需要继承 React.Component。React.Component 是类组件，在 TypeScript 中，React.Component 是通用类型（`React.Component<PropType, StateType>`），因此要为其提供（可选）prop 和 state 类型参数：

```ts
interface ClassComponentProps {
  value: number;
  text: string;
}

interface ClassComponentState {
  visible: boolean;
}

// class组件
class ClassComponent extends Component<
  ClassComponentProps,
  ClassComponentState
> {
  readonly state: ClassComponentState = {
    visible: false,
  };

  componentDidMount(): void {
    setTimeout((): void => {
      this.setState({ visible: true });
    }, 2000);
  }

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> {
    const { visible } = this.state;
    const { value, text } = this.props;

    return (
      visible && (
        <div>
          {value}
          {text}
        </div>
      )
    );
  }
}

// 泛型组件，个人推荐使用class组件，原因是表达更清晰，结构更明了
interface SelectProps<S> {
  value: S;
  text: string;
  disabled?: boolean;
}

class Select<U> extends Component<SelectProps<U>> {
  // ...
}

interface SelectProps {
  children: ReactNode; // 函数组件需要自己补上children
}

// 函数表达式
const Select: FC = <P>(props: SelectProps<P>) => {
  // 不要漏掉逗号
  //...
};

// 函数声明
function Select<T>(props: SelectProps<T>): ReactNode {
  //...
}
```

## 高阶组件

```ts
// function hoc
import React, { Component, FC, ReactNode, ComponentType } from "react";

interface SelectTableHOCProps {
  selected: string[];
  onSelect(selected: string[]): void;
  keyField: string;
}

const selectTableHOC =
  <P extends {}>( // 函数表达式
    Table: ComponentType<P>
  ): FC<P & SelectTableHOCProps> =>
  (props): ReactElement => {
    return <Table {...props} />;
  };

function selectTableHOC<P extends {}>( // 函数声明
  Table: ComponentType<P>
): FC<P & SelectTableHOCProps> {
  const SelectTable: FC<P & SelectTableHOCProps> = (props) => {
    return <Table {...props} />;
  };
  SelectTable.displayName = "SelectTable"; // eslint规则，没设置的可以不写
  return SelectTable;
}

// class hoc
function selectTableHOC<P extends {}>( // 函数声明
  Table: ComponentType<P>
): ComponentClass<P & SelectTableHOCProps> {
  return class SelectTable extends Component<P & SelectTableHOCProps> {
    render(): React.ReactNode {
      return <Table {...this.props} />;
    }
  };
}
```

## 组件类型定义

很多人可能在使用 TypeScript 编写 React 应用的时候会对三种不同的函数返回值类型产生困惑，不明白它们之间的区别以及应该什么时候使用哪一种类型才比较严谨。

### 综述

综合下面所述：
`JSX.Element ≈ ReactElement ⊂ ReactNode`

### ReactElement

ReactElement 是一个接口，包含 type，props，key 三个属性值。该类型的变量值只能是两种： null 和 ReactElement 实例

```js
type Key = string | number

interface ReactElement<
  P = any,
  T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>
> {
  type: T;
  props: P;
  key: Key | null;
}
```

### ReactNode

```js
type ReactText = string | number;
type ReactChild = ReactElement | ReactText;

interface ReactNodeArray extends Array<ReactNode> {}
type ReactFragment = {} | ReactNodeArray;

type ReactNode =
  | ReactChild
  | ReactFragment
  | ReactPortal
  | boolean
  | null
  | undefined;
```

==ReactNode 是一种联合类型(Union Types)，可以是 string、number、ReactElement、{}、boolean、ReactNodeArray==。由此可以看出 ReactElement 类型的变量可以直接赋值给 ReactNode 类型的变量，但是反过来是不行的。

### JSX.Element

JSX.Element 通过执行 React.createElement 或是转译 JSX 获得。
==JSX.Element 是 ReactElement 的子类型，并且没有增加属性，二者是兼容的==。也就是说 JSX.Element 类型的变量可以赋值给 ReactElement 类型的变量，反过来赋值也成立。

```js
const jsx = <div>hello</div>
const ele = React.createElement("div", null, "hello");
<p> // <- ReactElement = JSX.Element
  <Custom> // <- ReactElement = JSX.Element
    {true && "test"} // <- ReactNode
  </Custom>
</p>
```

JSX 是一个全局的命名空间，不同的库对 JSX 都可以有自己不同的实现，而 React 的实现方式就是让 JSX.Element 等价于 ReactElement，同时将它的泛型 props 和 type 都设为 any：

```js
declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> { }
  }
}
```

### render 返回值

当 render 被调用时，它会检查 this.props 和 this.state 的变化并返回以下类型之一：

- ==React 元素==。通常通过 JSX 创建。例如，`<div />` 会被 React 渲染为 DOM 节点，`<MyComponent />` 会被 React 渲染为自定义组件，无论是 `<div />` 还是 `<MyComponent />` 均为 React 元素。
- ==数组或 fragments==。 使得 render 方法可以返回多个元素。欲了解更多详细信息，请参阅 fragments 文档。
- ==Portals==。可以渲染子节点到不同的 DOM 子树中。欲了解更多详细信息，请参阅有关 portals 的文档
- ==字符串或数值类型==。它们在 DOM 中会被渲染为文本节点
- ==布尔类型或 null==。什么都不渲染。（主要用于支持返回 test && `<Child />` 的模式，其中 test 为布尔类型。)

### 返回类型的不同

有的同学可能会注意到：类组件渲染方法的返回值类型和函数组件的是不一样的，这是因为目前版本的 TypeScript 类型定义并不能准确地限定 React 实际值的范围：

- 类组件类型定义：通过 render() 返回 ReactNode，比 React 的实际值范围更宽松
- 函数组件类型定义：返回 JSX.Element，也比 React 的实际值范围更宽松

实际上 React 类组件中的 render() 和函数组件的返回类型是一样的，而 TypeScript 只是出于历史原因和向后兼容需要，为不同种类的组件声明了不同的返回值类型。

根据 文档的规定 我们可以为组件返回值给出准确的类型定义：

```js
type ComponentReturnType =
  | ReactElement
  | Array<ComponentReturnType>
  | string
  | number
  | boolean
  | null;
// 注意: 不能传入 undefined
```

### 参考链接

- [@@@ReactElement、ReactNode 以及 JSX.Element](https://www.jianshu.com/p/95ce2266450a)
- [React.Component Render 方法](https://zh-hans.reactjs.org/docs/react-component.html#render)

## Tips

### 如何开始

可以从下面几个方面开始实践 TS

- 定义变量 —— 类型
- 函数参数 —— 接口
- 组件 state、props —— 接口

### 组件的 Props 和 State 接口

class 组件

```ts
import React, { PureComponent } from "react";

interface IProps {
  isShow: boolean;
  title: string;
  content: string;
  btnText: string;
  onClickBtn?: () => void;
  onCloseModal?: () => void;
  [propName: string]: any;
}
interface IStates {
  visible?: boolean;
}

export default class GeneralModal extends PureComponent<IProps, IStates> {
  public state = {};

  public render() {
    return <div></div>;
  }
}
```

memo 组件

```ts
import React, { memo } from "react";

interface AuditListsType {
  current: (node) => void;
  approveGroupList: object[];
  updateGroupList: (list: []) => void;
  handleMenber: (item: object) => void;
  componentFun?: () => React.ReactElement;
  component?: React.ReactElement;
}
const AuditList = memo<AuditListsType>((props) => {
  return <div></div>;
});

const [canBeRelatedSprintList, setCanBeRelatedSprintList] =
  useState<Array<{ value?: string; label?: string }>>();
```

### 常用类型

```jsx
interface StatisticProps {
  style?: React.CSSProperties // css属性
  beginTime?: moment.Moment | undefined // 时间
  dataList: Array<{ businessLineName: string; data: number }> // 对象数组
  refresh: () => Promise<void>  // async 函数
  handleOK: (projectId: string, item: IFolderColumnItem) => Promise<void> // async 函数
}

const [timeRange, setTimeRange] = useState<moment.Moment[]>()


export interface IFilterItemProps<T = any> {
  value?: Array<number | undefined> // 数字/undefined 组成的数组
  propKey: string
  onChange(key: string, value: Array<number | undefined>)
}
```

```jsx
import { ColumnsType } from 'antd/dist/table'

// 表格列
const list: ColumnsType<any> = [
    {
      dataIndex: 'sprintName',
      title: '迭代名称',
      width: 200,
      fixed: true,
      render: (v, record) => (
        <RenderTitle
          sprintName={record.sprintName}
          sprintId={record.sprintId}
          projectId={record.projectId}
        />
      ),
    }
  ]

const tableColumns: ColumnsType<IDataSource> = useMemo(
    () =>
      memberIntervalWorkloadModalColumns?.map((item) => {
        const newItem = { ...item } as any
        // ...
        return newItem
      }),
    [tableData?.list],
  )

```

```jsx
// type的使用
const columns = [
  {
    dataIndex: 'staffName',
    title: '人员名称',
  },
  {
    dataIndex: 'itemNum',
    title: '工时天数',
    detail: 'itemIds',
    ableSort: true,
  },
  {
    dataIndex: 'requirementNum',
    title: '区间工作量（h）',
    detail: 'requirementIds',
    ableSort: true,
  },
]

const [tableColumns, setTableColumns] = useState([] as typeof columns)

// 悬浮显示如下
const columns: ({
    dataIndex: string;
    title: string;
    detail?: undefined;
    ableSort?: undefined;
} | {
    dataIndex: string;
    title: string;
    detail: string;
    ableSort: boolean;
})[]

```

### React 组件默认 props

#### JS 写法

通过组件的 defaultProps 属性可为其 Props 指定默认值。

```TS
import PropTypes from 'prop-types';

BackSellModal.propTypes = {
  modalTitle: PropTypes.string,
  editable: PropTypes.bool,
  value: PropTypes.object,
};
BackSellModal.defaultProps = {
  modalTitle: '回售开放日管理',
  editable: true,
  value: {},
};
```

如果编译过程使用了 Babel 的 `transform-class-properties` 插件，还可以这么写：

```TS
class BackSellModal extends React.Component {
  static propTypes = {
    modalTitle: PropTypes.string,
    editable: PropTypes.bool,
    value: PropTypes.object,
  }

  static defaultProps = {
    modalTitle: '回售开放日管理',
    editable: true,
    value: {},
  }

  render() {
    return (
      ...
    )
  }
}
```

#### TS 写法

```ts
interface Props {
  name?: string;
}

class Greeting extends React.Component<Props, {}> {
  static defaultProps = {
    name: "stranger",
  };

  render() {
    return <div>Hello, {this.props.name}</div>;
  }
}
```

此时不支持直接通过类访问 defaultProps 来赋值以设置默认属性，因为 React.Component 类型上并没有该属性。

```ts
// ?Property 'defualtProps' does not exist on type 'typeof Greeting'.ts(2339)
Greeting.defualtProps = {
  name: "stranger",
};
```

**问题：**

- 上面虽然实现了通过 defaultProps 来指定属性的默认值，但 defaultProps 的类型是不受约束的，和 Props 没有关联上。以至于我们可以在 defaultProps 里面放任何值，显然这是不科学的。
- 同时对于同一字段，我们不得不书写两次代码。一次是定义组件的 Props，另一次是在 defaultProps 里。如果属性有增删或名称有变更，两个地方都需要改。

```ts
// 【1】
class Greeting extends React.Component<Props, {}> {
  static defaultProps = {
    name: "stranger",
    // 并不会报错
+    foo: 1,
+    bar: {},
  };
 // ...
}
```

```ts
// 【2】为了后面演示方便，现在给组件新增一个必填属性 age:number
interface Props {
  age: number;
  name?: string;
}

class Greeting extends React.Component<Props, {}> {
  static defaultProps = {
    name: "stranger",
  };

  render() {
    const { name, age } = this.props;
    return (
      <div>
        Hello, {name}, my age is {age}
      </div>
    );
  }
}
```

**解决方法：**

通过可选属性抽取出来，利用 typeof 获取其类型和必传属性结合来形成组件的 Props 可解决上面提到的两个问题。如下：

```ts
const defaultProps = {
  name: "stranger",
};

type Props = {
  age: number;
} & Partial<typeof defaultProps>;

// 相当于：
/* type Props = {
  age: number;
  name?: string;
}; */

class Greeting extends React.Component<Props, {}> {
  static defaultProps = defaultProps;

  render() {
    const { name, age } = this.props;
    return (
      <div>
        Hello, {name}, my age is {age}
      </div>
    );
  }
}
```

注意我们的 Props 是通过和 `typeof defaultProps` 组合而形成的，可选属性中的 name 字段在整个代码中只书写了一次。

当我们更新了 defaultProps 时整个组件的 Props 也同步更新，所以 defaultProps 中的字段一定是组件所需要的字段。

#### 默认值的判空检查优化

见参考资料

#### 实例

```ts
export default class CreateButton extends PureComponent<{
  isPricing?: boolean;
  env?: string;
}> {
  public static defaultProps = {
    isPricing: false,
  };
}
```

除了上面这种设置组件的 defaultProps 方法外，通过解构设置默认值也是个解决方法，但是在 class 组件中每个函数里面都需要写一遍，而在函数式组件中写一遍就好。

```ts
const { isPricing: false } = this.props;
```

## 屏蔽 TSLint 的错误检查

```js
// @ts-check  // 在 JavaScript 文件中启用语义检查。必须在文件顶部。
// @ts-expect-error // 禁止在文件的下一行显示 @ts-check 错误，预计至少存在一个错误。
// @ts-ignore // 取消文件下一行的 @ts-check 错误提示。
// @ts-nocheck // 在 JavaScript 文件中禁用语义检查。必须在文件顶部。

// eslint-disable-next-line
```

## 参考资料

- [[1]React + TypeScript 默认 Props 的处理](https://blog.csdn.net/sinat_17775997/article/details/102514747)

## 报错

- .js 文件改为.tsx 文件后报错

  报错：找不到.js 文件
  解决方法：重启后解决

### 类型报错实例一

若直接使用 `options={canBeRelatedSprintList}` 会报错如下，改为下面的 `canBeRelatedSprintList.map`去映射出`Select.Option`即不再报错

```jsx
<Select
  placeholder="请选择关联项目"
  bordered={false}
  style={{ width: 250 }}
  mode="multiple"
  value={relatedSprintIds}
  // options={canBeRelatedSprintList}
  onChange={(v) => {
    console.log('关联项目 onchangev :>> ', v)
    // update({ associatedProject: v })
  }}
>
  {canBeRelatedSprintList?.map?.((item) => (
    <Select.Option key={item.value} value={item.value!}>
      {item.label}
    </Select.Option>
  ))}
</Select>
```

```jsx
没有与此调用匹配的重载。
  第 2 个重载(共 2 个)，“(props: SelectProps<SelectValue>, context: any): Select<SelectValue>”，出现以下错误。
    不能将类型“{ value?: string | undefined; label?: string | undefined; }[] | undefined”分配给类型“OptionsType | undefined”。
  第 2 个重载(共 2 个)，“(props: SelectProps<SelectValue>, context: any): Select<SelectValue>”，出现以下错误。
    不能将类型“LinkedSprintVO[]”分配给类型“SelectValue | undefined”。ts(2769)
generate.d.ts(22, 5): 所需类型来自属性 "options"，在此处的 "IntrinsicAttributes & IntrinsicClassAttributes<Select<SelectValue>> & Pick<Readonly<SelectProps<SelectValue>> & Readonly<...>, "value" | ... 113 more ... | "size"> & Partial<...> & Partial<...>" 类型上声明该属性
generate.d.ts(25, 5): 所需类型来自属性 "value"，在此处的 "IntrinsicAttributes & IntrinsicClassAttributes<Select<SelectValue>> & Pick<Readonly<SelectProps<SelectValue>> & Readonly<...>, "value" | ... 113 more ... | "size"> & Partial<...> & Partial<...>" 类型上声明该属性
const canBeRelatedSprintList: {
    value?: string | undefined;
    label?: string | undefined;
}[] | undefined
```

### 类型报错实例二

```jsx
<Cascader
  loadData={loadData}
/>


const loadData = useCallback(
    async (selectedOptions: IOption[]) => {
      console.log('！！！！！！！！！selectedOptions :>> ', selectedOptions)
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
      setOptions([...options])
    },
    [modeIsEdit, sprintId],
  )

```

loadData 函数参数类型和返回类型不一致报错如下

```jsx
不能将类型“(selectedOptions: IOption[]) => Promise<void>”分配给类型“(selectedOptions?: CascaderOptionType[] | undefined) => void”。
  参数“selectedOptions”和“selectedOptions” 的类型不兼容。
    不能将类型“CascaderOptionType[] | undefined”分配给类型“IOption[]”。
      不能将类型“undefined”分配给类型“IOption[]”。ts(2322)
```

解决如下：

```jsx
loadData={(selectedOptions) => {
  loadData(selectedOptions as IOption[])
}}
```

# 其它

- 如何引入 antd 某个组件里面自己的 interface

```jsx
import { CascaderOptionType } from "antd/lib/cascader/index";
```
