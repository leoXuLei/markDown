# 泛型

> 通俗理解：泛型就是解决类、接口、方法的复用性、以及对不特定数据类型的支持。
>
> TypeScript 泛型是一种工具。**它能让开发者不在定义时指定类型，而在使用时指定类型**。

## 介绍

软件工程中，我们不仅要创建一致的定义良好的 API，同时也要考虑可重用性。 组件不仅能够支持当前的数据类型，同时也能支持未来的数据类型，这在创建大型系统时为你提供了十分灵活的功能。

在像 C#和 Java 这样的语言中，可以使用泛型来创建可重用的组件，一个组件可以支持多种类型的数据。 这样用户就可以以自己的数据类型来使用组件。

## 泛型之 Hello World

使用泛型的例子：identity 函数。 这个函数会返回任何传入它的值。

```ts
// 使用 any 类型缺点：导致丢失传入的类型与返回的类型应该一致的重要信息。
// 当前函数的含义发生变化，变为传入任何类型的值，返回任何类型的值
function identity(arg: any): any {
  return arg;
}
```

我们需要一种方法使返回值的类型与传入参数的类型是相同的。 这里，==我们使用了 `类型变量`，它是一种特殊的变量，只用于表示类型而不是值==。

```ts
// 定义
function identity<T>(arg: T): T {
  // 传入类型=返回类型
  return arg;
}
// 调用方式
// 第一种是，传入所有的参数，包含类型参数：
let output = identity<string>("myString"); // type of output will be 'string'

// 第二种更普遍。利用了类型推论
let output = identity("myString"); // type of output will be 'string'
```

## 使用泛型变量

有时候需要对泛型变量的类型进行一定的约束：

```ts
function identity<T>(arg: T): T {
  console.log(arg.length); // Error: T doesn't have .length
  return arg;
}
```

上面例子中，由于参数类型 T 不一定含有 length 属性，因此需要对 T 进行约束：

```ts
// 写法一
function identity<T>(arg: T[]): T[] {
  console.log(arg.length);
  return arg;
}
```

可以这样理解：泛型函数 identity，接收类型参数 T 和参数 arg，它是个元素类型是 T 的数组，并返回元素类型是 T 的数组。 如果我们传入数字数组，将返回一个数字数组，因为此时 T 的的类型为 number。 这可以让我们把泛型变量 T 当做类型的一部分使用，而不是整个类型，增加了灵活性。

```ts
// 写法二
function identity<T>(arg: Array<T>): Array<T> {
  console.log(arg.length);
  return arg;
}
```

## 泛型函数

上一节，我们创建了 identity 通用函数，可以适用于不同的类型。 在这节，我们研究一下**函数本身的类型，以及如何创建泛型接口**。

泛型函数的类型与非泛型函数的类型没什么不同，只是有一个类型参数在最前面，像函数声明一样：

```ts
// 泛型函数
function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: <T>(arg: T) => T = identity;

// 也可以使用不同的泛型名，只要在数量上和使用方式上能对应上就可以。
let myIdentity: <U>(arg: U) => U = identity;
```

还可以使用带有调用签名的对象字面量来定义泛型函数：

```ts
// 泛型函数
function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: { <T>(arg: T): T } = identity;
```

这引导我们去写第一个泛型接口了。 我们把上面例子里的对象字面量拿出来做为一个接口：

```ts
// 泛型接口
interface GenericIdentityFn {
  <T>(arg: T): T;
}

function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: GenericIdentityFn = identity;
```

一个相似的例子，我们可能想把泛型参数当作整个接口的一个参数。 这样我们就能清楚的知道使用的具体是哪个泛型类型（比如： `Dictionary<string>`而不只是 Dictionary）。 这样接口里的其它成员也能知道这个参数的类型了。

```ts
// 泛型接口(带有泛型类型)
interface GenericIdentityFn<T> {
  (arg: T): T;
}

function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

注意，我们的示例做了少许改动。 不再描述泛型函数，而是把非泛型函数签名作为泛型类型一部分。 当我们使用 GenericIdentityFn 的时候，还得传入一个类型参数来指定泛型类型（这里是：number），锁定了之后代码里使用的类型。 对于描述哪部分类型属于泛型部分来说，理解何时把参数放在调用签名里和何时放在接口上是很有帮助的。

除了泛型接口，我们还可以创建泛型类。 注意，无法创建泛型枚举和泛型命名空间。

### 实例

```ts
function getData4<T>(value: T): T {
  return value;
}

getData4<number>(1);
getData4<string>("123");
// getData4<number>('123') // 错误
```

```ts
// React中的函数组件
import React from "react";

interface DemoComponentProps {}

const DemoComponent: React.FC<DemoComponentProps> = () => {
  // 推荐
  return <p>Hello world</p>;
};

function DemoComponent(props: DemoComponentProps): React.ReactNode {
  return <p>Hello world</p>;
}
```

## 泛型类

泛型类看上去与泛型接口差不多。 泛型类使用（<>）括起泛型类型，跟在类名后面。

```ts
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
  return x + y;
};

let stringNumeric = new GenericNumber<string>();
stringNumeric.zeroValue = "";
stringNumeric.add = function (x, y) {
  return x + y;
};

console.log(stringNumeric.add(stringNumeric.zeroValue, "test"));
```

与接口一样，直接把泛型类型放在类后面，可以帮助我们确认类的所有属性都在使用相同的类型。

类有两部分：静态部分和实例部分。 泛型类指的是实例部分的类型，所以类的静态属性不能使用这个泛型类型。

### 实例

```ts
// 泛型类：比如有个最小堆算法，需要同时支持返回数字和字符串两种类型。通过泛型类来实现

class MinClass {
  public list: number[] = [];

  add(num: number) {
    this.list.push(num);
  }

  min(): number {
    let minnum = this.list[0];
    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i] < minnum) {
        minnum = this.list[i];
      }
    }
    return minnum;
  }
}
const ins = new MinClass();
ins.add(2);
ins.add(5);
ins.add(1);
console.log(ins.min()); // 打印出1，但是目前支持数字类型

class MinClass2<T> {
  public list: T[] = [];

  add(value: T) {
    this.list.push(value);
  }

  min(): T {
    let minvalue = this.list[0];
    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i] < minvalue) {
        minvalue = this.list[i];
      }
    }
    return minvalue;
  }
}

const numInstance = new MinClass2<number>(); // 实例化类，并且指定了类的T代表的类型是number
numInstance.add(23);
numInstance.add(1223);
numInstance.add(21);
console.log(numInstance.min()); // 打印出21

const strInstance = new MinClass2<string>(); // 实例化类，并且指定了类的T代表的类型是string
strInstance.add("b");
strInstance.add("dd");
strInstance.add("z");
console.log(strInstance.min()); // 打印出b
```

我们直接使用 React 的 Class Component 来举例：

```ts
import React, { Component, FC } from "react";

interface SelectProps<T> {
  value: T;
  text: string;
  disabled?: boolean;
}

interface SelectState {
  visible: boolean;
}

class Select<T> extends Component<SelectProps<T>, SelectState> {
  state: SelectState = {
    visible: false,
  };

  render() {
    const { value, text, disabled } = this.props;
    return <p>Hello world</p>;
  }
}

const Demo: FC = () => {
  return <Select value={1} text="demo" />; // 推导出value为number类型
  // return <Select<number> value={1} text='demo' /> 也可以显示定义泛型类型
};
```

## 泛型约束

在 loggingIdentity 例子中，我们想访问 arg 的 length 属性，但是编译器并不能证明每种类型都有 length 属性，所以就报错了。

```ts
function loggingIdentity<T>(arg: T): T {
  console.log(arg.length); // Error: T doesn't have .length
  return arg;
}
```

相比于操作 any 所有类型，**我们想要限制函数去处理任意带有.length 属性的所有类型。 只要传入的类型有这个属性，我们就允许**，就是说至少包含这一属性。 为此，我们需要列出对于 T 的约束要求。

为此，我们定义一个接口来描述约束条件。 创建一个包含 `.length` 属性的接口，使用这个接口和 extends 关键字来实现约束：

```ts
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // Now we know it has a .length property, so no more error
  return arg;
}
```

现在这个泛型函数被定义了约束，因此它不再是适用于任意类型，而是需要传入符合约束类型的值，必须包含必须的属性：

```ts
loggingIdentity(3); // Error, number doesn't have a .length property

loggingIdentity({ length: 10, value: 3 });
```

### 在泛型约束中使用类型参数

你可以声明一个类型参数，且它被另一个类型参数所约束。 比如，现在我们想要用属性名从对象里获取这个属性。 并且我们想要确保这个属性存在于对象 obj 上，因此我们需要在这两个类型之间使用约束。

```ts
function getProperty(obj: T, key: K) {
  return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a"); // okay
getProperty(x, "m"); // error: Argument of type 'm' isn't assignable to 'a' | 'b' | 'c' | 'd'.
```

### 在泛型里使用类类型

# 实例

## 嵌套泛型

```ts
// @types/base.d.ts
interface IBasicApi<T> {
  msg: string;
  result: T;
  success: boolean;
}

interface IPagerResult<M> {
  total: number;
  totalHour?: number;
  projectCount?: number;
  content: M[];
}

type IBasicApiPromise<T = any> = Promise<IBasicApi<T>>;

type IPromisePageResult<M> = IBasicApiPromise<IPagerResult<M>>;
```

```ts
// @types/project.d.ts
interface IProjectInfo {
  accessible?: boolean;
  applications: IApplication[];
  businessId: string;
  businessName: string;
  currentProjectStatus: string;
  desc: string;
  endDate: string;
  icon: string;
  id: string;
  name: string;
  projectId?: string;
  projectName?: string;
  ownerInfo: IOwnerInfo;
  projectStatus: IProjectStatus[];
  projectFlows: IProjectFlows[];
  projectMembers: IStaff[];
  startDate: number;
  taskIdPrefix: string;
  roles: IRoles[];
  isCollectionItems?: number;
  taskCompletionNum?: number;
  allTaskNum?: number;
  taskOverdueNum?: number;
  inProgressSprintNum?: number;
  doneSprintNum?: number;
  averagePeriodOfSprint?: number;
  businessNamePath?: string;
  templateName?: string;
}
```

```ts
// @/ekko/services/project.ts

export const getRecycleProjectList = async (
  data?
): IPromisePageResult<IProjectInfo> => {
  const projectRes = await post(
    `/api/project/recycleBin/basic?limit=${data?.limit || 200}&pageIndex=${
      data?.pageIndex || 1
    }`,
    data
  );

  if (projectRes.success && projectRes.result) {
    await addProjectAccessibleInfo(projectRes.result.content);
  }

  return projectRes;
};
```

## 泛型 + 枚举 的使用

```tsx
import { GlobalMapData } from "../sfc/const";
import { EditorDataContext } from "../sfc/Editor/provider";
import { ISFCDataMap, ITreeNodeItem } from "../sfc/types";
import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { SingleObj } from "@/utils/types";

type _key = "db" | "plainData" | "treeData";
type setContextValFun = (val: SingleObj<any>) => void;
interface AllDataType {
  db: SingleObj<any>;
  plainData: Map<string, ISFCDataMap>;
  treeData: ITreeNodeItem;
}

const useData = <T extends _key>(
  _mapKey: T
): [AllDataType[T] | undefined, setContextValFun, number] => {
  const { data, changeVal, id } = useContext(EditorDataContext);
  const _data = useMemo(() => {
    if (Object.keys(data).length === 0 || !GlobalMapData.has(_mapKey)) {
      return undefined;
    }
    return GlobalMapData.get(_mapKey) as AllDataType[T];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_mapKey, id]); // id 变则data数据变

  const changeContextValue = useCallback(
    (val) => {
      changeVal(val);
    },
    [changeVal]
  );
  return [_data, changeContextValue, id];
};

export default useData;
```

```jsx
// 使用实例
const [_treeDataInfo] = useData("treeData");
const [_plaintMapData] = useData("plainData");
const [_originData, changeContextValue] = useData("db");
```
