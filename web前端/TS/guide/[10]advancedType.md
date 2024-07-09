# 高级类型

## 交叉类型（&：逻辑与）

交叉类型：将多个类型合并为一个类型

```ts
function extend<T, U>(first: T, second: U): T & U {
  let result = <T & U>{};
  for (let id in first) {
    (<any>result)[id] = (<any>first)[id];
  }
  for (let id in second) {
    if (!result.hasOwnProperty(id)) {
      (<any>result)[id] = (<any>second)[id];
    }
  }
  return result;
}

class Person {
  constructor(public name: string) {}
}
interface Loggable {
  log(): void;
}
class ConsoleLogger implements Loggable {
  log() {
    // ...
  }
}
var jim = extend(new Person("Jim"), new ConsoleLogger());
var n = jim.name;
jim.log();
```

## 联合类型（|：逻辑或）

联合类型：一个值可以是几种类型之一，用竖线（|）分隔每个类型，所以 `number | string | boolean` 表示一个值可以是 number， string，或 boolean。

```ts
let num: number | undefined;
// | 表示num变量可能是数字类型，也可能是undefined类型。
```

```ts
function padLeft(value: string, padding: string | number) {
  // ...
}

padLeft("Hello world", 10);
padLeft("Hello world", "left");
let indentedString = padLeft("Hello world", true); // 编译阶段提示padding类型错误
```

如果一个值是联合类型，我们只能访问此联合类型的所有类型里共有的成员。

```ts
interface Bird {
  fly();
  layEggs();
}

interface Fish {
  swim();
  layEggs();
}

function getSmallPet(): Fish | Bird {
  // ...
}

let pet = getSmallPet();
pet.layEggs(); // okay
pet.swim(); // errors, 'swim()' does not exist in type 'Bird'
```

这个例子里， Bird 具有一个 fly 成员。 我们不能确定一个 `Bird | Fish` 类型的变量是否有 fly 方法。 如果变量在运行时是 Fish 类型，那么调用 pet.fly() 就出错了。

解决办法是使用类型断言或者类型谓词：

```ts
// 类型断言
(pet as Fish).swim();

// 类型谓词
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

## 可以为 null 的类型

TypeScript 具有两种特殊的类型， null 和 undefined。

默认情况下，类型检查器认为 null 与 undefined 可以赋值给任何类型。 null 与 undefined 是所有其它类型的一个有效值。 这也意味着，你阻止不了将它们赋值给其它类型，就算是你想要阻止这种情况也不行。

--strictNullChecks 标记可以解决此错误：当你声明一个变量时，它不会自动地包含 null 或 undefined。 你可以使用联合类型明确的包含它们：

```ts
let s = "foo";
s = null; // 错误, 'null'不能赋值给'string'
let sn: string | null = "bar";
sn = null; // 可以

sn = undefined; // error, 'undefined'不能赋值给'string | null'
```

注意，按照 JavaScript 的语义，TypeScript 会把 null 和 undefined 区别对待。 string | null， string | undefined 和 string | undefined | null 是不同的类型。

### 可选参数和可选属性

使用了 --strictNullChecks，可选参数会被自动地加上 | undefined:

```ts
function f(x: number, y?: number) {
  return x + (y || 0);
}
f(1, 2);
f(1);
f(1, undefined);
f(1, null); // error, 'null' is not assignable to 'number | undefined'
```

可选属性也会有同样的处理：

```ts
class C {
  a: number;
  b?: number;
}
let c = new C();
c.a = 12;
c.a = undefined; // error, 'undefined' is not assignable to 'number'
c.b = 13;
c.b = undefined; // ok
c.b = null; // error, 'null' is not assignable to 'number | undefined'
```

### 类型保护和类型断言

## 类型别名（type）

类型别名会给一个类型起个新名字。 类型别名有时和接口很像，但是可以作用于原始值，联合类型，元组以及其它任何你需要手写的类型。

```ts
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
  if (typeof n === "string") {
    return n;
  } else {
    return n();
  }
}
```

```ts
// 同接口一样，类型别名也可以是泛型
type Container<T> = { value: T };

// 可以使用类型别名来在属性里引用自己
type Tree<T> = {
  value: T;
  left: Tree<T>;
  right: Tree<T>;
};

// 与交叉类型一起使用
type LinkedList<T> = T & { next: LinkedList<T> };

interface Person {
  name: string;
}

var people: LinkedList<Person>;
var s = people.name;
var s = people.next.name;
var s = people.next.next.name;
var s = people.next.next.next.name;

// 然而，类型别名不能出现在声明右侧的任何地方。
type Yikes = Array<Yikes>; // error
```

## 字符串字面量类型

字符串字面量类型允许你指定字符串必须的固定值。 在实际应用中，字符串字面量类型可以与联合类型，类型保护和类型别名很好的配合。 通过结合使用这些特性，你可以实现类似枚举类型的字符串。

```ts
import moment from "moment";

type date = moment.Moment | string;

type comparetype =
  | "isAfter"
  | "isNotAfter"
  | "isBefore"
  | "isNotBefore"
  | "isSame"
  | "isNotSame";

interface CompareFunc {
  (firstDate: date, comparetype: comparetype, secondDate: date): boolean;
}

// 比较两个日期
export const compareTwoDates: CompareFunc = (
  firstDate: date,
  comparetype: comparetype,
  secondDate: date
) => {
  const fir = firstDate && moment(firstDate).format("YYYY-MM-DD");
  const sec = secondDate && moment(secondDate).format("YYYY-MM-DD");
  switch (comparetype) {
    case "isAfter":
      return moment(fir).isAfter(sec);
    case "isNotAfter":
      return !moment(fir).isAfter(sec);
    case "isBefore":
      return moment(fir).isBefore(sec);
    case "isNotBefore":
      return !moment(fir).isBefore(sec);
    case "isSame":
      return moment(fir).isSame(sec);
    case "isNotSame":
      return !moment(fir).isSame(sec);
    default:
      return false;
  }
};

compareTwoDates("2014-08-04", "test", "2014-04-21"); // 类型“"test"”的参数不能赋给类型“comparetype”的参数。
compareTwoDates("2014-08-04", "isAfter", "2014-04-21");
```

## 索引类型

使用索引类型，编译器就能够**检查使用了动态属性名的代码**。

例子：一个常见的 JS 模式是从对象中选取属性的子集

```ts
function pluck(o, names) {
  return names.map((n) => o[n]);
}
```

下面是如何在 TS 里使用此函数，通过 `索引类型查询操作符`（`keyof T`） 和 `索引访问操作符` （`T[K]`） ：

```ts
function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {
  return names.map((n) => o[n]);
}

interface Person {
  name: string;
  age: number;
}

let person: Person = {
  name: "Jarid",
  age: 35,
};
const strings: string[] = pluck(person, ["name"]); // ["Jarid"]

const strings = pluck(person, ["name", "age"]); // ["Jarid", 35]

const strings = pluck(person, ["test"]); // 不能将类型“"test"”分配给类型“"name" | "age"”。
```

编译器会检查 name 是否真的是 Person 的一个属性。 本例还引入了几个新的类型操作符。

首先是 `keyof T`， **索引类型查询操作符**。 对于任何类型 T， `keyof T` 的结果为 **`T 上已知的公共属性名的联合`**。 例如：

```ts
let personProps: keyof Person; // 'name' | 'age'

pluck(person, ["age", "unknown"]); // error, 'unknown' is not in 'name' | 'age'
```

第二个操作符是 T[K]， **索引访问操作符**。 只要确保类型变量 K extends keyof T 就可以了。 例如下面 getProperty 函数的例子：

```ts
function getProperty<T, K extends keyof T>(o: T, name: K): T[K] {
  return o[name]; // o[name] is of type T[K]
}
```

getProperty 里的 `o: T` 和 `name: K`，意味着 o[name]: T[K]。 当你返回 T[K]的结果，编译器会实例化键的真实类型，因此 getProperty 的返回值类型会随着你需要的属性改变。

```ts
let name: string = getProperty(person, "name");
let age: number = getProperty(person, "age");
let unknown = getProperty(person, "unknown"); // error, 'unknown' is not in 'name' | 'age'
```

### 索引类型和字符串索引签名

> **keyof 操作符会将一个对象类型(注意这里是类型并不是值)的 key 组成联合类型返回。**

`keyof` 和 `T[K]` 与字符串索引签名进行交互。 如果你有一个带有字符串索引签名的类型，那么 `keyof T` 会是 string。 并且 `T[string]` 为索引签名的类型：

```ts
interface Map<T> {
  [key: string]: T;
}
let keys: keyof Map<number>; // string
let value: Map<number>["foo"]; // number
```

> **实例：**

```jsx
export interface IFilterArgs {
  bugTypes?: IOption[]
  classifyId?: IOption[]
  createTimeRange?: ITimeRange
  creator?: IUser[]
  taskFlowStates?: IOption[]
  yanzhongchengdu?: string[]
  testPlan?: IValue[]
}

export type IPropKey = keyof IFilterArgs | 'reset'

export interface IFilterItemProps<T = any> {
  value?: T
  propKey: IPropKey
  onChange(key: IPropKey, value: any)
}
```

## 映射类型

> 映射类型：从旧类型中创建新类型的方式

一个常见的任务是将一个已知的类型每个属性都变为可选的或者只读的：

```ts
interface PersonPartial {
  name?: string;
  age?: number;
}

interface PersonReadonly {
  readonly name: string;
  readonly age: number;
}
```

在映射类型里，新类型以相同的形式去转换旧类型里每个属性。 例如，你可以令每个属性成为 readonly 类型或可选的。 下面是一些例子：

```ts
interface Person {
  name: string;
  age: number;
}

type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
type Partial<T> = {
  [P in keyof T]?: T[P];
};
// 使用如下：
type PersonPartial = Partial<Person>;
type ReadonlyPerson = Readonly<Person>;
```

下面来看看最简单的映射类型和它的组成部分：

```ts
type Keys = "option1" | "option2";
type Flags = { [K in Keys]: boolean };
```

它的语法与索引签名的语法类型，内部使用了 for .. in。 具有三个部分：

- 类型变量 K，它会依次绑定到每个属性。
- 字符串字面量联合的 Keys，它包含了要迭代的属性名的集合。
- 属性的结果类型。

在个简单的例子里， Keys 是硬编码的的属性名列表并且属性类型永远是 boolean，因此这个映射类型等同于：

```ts
type Flags = {
  option1: boolean;
  option2: boolean;
};
```

在真正的应用里，可能不同于上面的 Readonly 或 Partial。 它们会基于一些已存在的类型，且按照一定的方式转换字段。 这就是 keyof 和索引访问类型要做的事情：

```ts
type NullablePerson = { [P in keyof Person]: Person[P] | null };
type PartialPerson = { [P in keyof Person]?: Person[P] };

// 但它更有用的地方是可以有一些通用版本。
type Nullable<T> = { [P in keyof T]: T[P] | null };
type Partial<T> = { [P in keyof T]?: T[P] };
```

在这些例子里，属性列表是 `keyof T` 且结果类型是 T[P]的变体。 这是使用通用映射类型的一个好模版。 因为这类转换是同态的，映射只作用于 T 的属性而没有其它的。 编译器知道在添加任何新属性之前可以拷贝所有存在的属性修饰符。 例如，假设 `Person.name` 是只读的，那么 `Partial<Person>.name` 也将是只读的且为可选的。

注意 `Readonly<T>` 和 `Partial<T>` 用处不小，因此它们与 Pick 和 Record 一同被包含进了 TypeScript 的标准库里：

```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
type Record<K extends string, T> = {
  [P in K]: T;
};
```

Readonly， Partial 和 Pick 是同态的，但 Record 不是。 因为 Record 并不需要输入类型来拷贝属性，所以它不属于同态：

```ts
type ThreeStringProps = Record<"prop1" | "prop2" | "prop3", string>;
```

### 映射类型 API

以下例子皆以 person 为例

```ts
interface Person {
  name: string;
  age: number;
}
```

#### Partial：属性可选

```ts
/**
 * Make all properties in T optional：将T中的所有属性设为可选
 */
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

可以看出 TS 源码中这样定义 Partial ：它接受传入的一个泛型类型 T ，==使用 in 关键字遍历传入的 T 类型==，重新定义了一个相同的类型，不过新的类型所有的 key 变成了可选类型。

```ts
// 使用如下：
type PersonPartial = Partial<Person>;
// PersonPartial === { name?: string; age?: number }
```

需要==额外注意的是当使用 Partial 时仅仅会将第一层变为可选，当存在多层嵌套时并不会递归转化==。

```ts
interface Person {
  name: string;
  age: number;
  detail: {
    school: string;
    company: string;
  };
}

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

type PartialPerson = DeepPartial<Person>;

const person1: PartialPerson = {
  name: "19Qingfeng",
  age: 24,
  detail: {
    company: "Tencent",
    // 即使我们不输入school也无关紧要
  },
};
```

#### Required：属性必选

```ts
/**
 * Make all properties in T required：将T中的所有属性设为必选
 */
type Required<T> = {
  [P in keyof T]-?: T[P];
};
```

```ts
// 使用如下：
type RequiredPerson = Required<Person>;
// RequiredPerson === { name: string; age: number }
```

同样 Required 表示将传入的类型中的属性全部转为必选，它和 Parital 正好相反，同样不支持嵌套。它仅仅会将 T 的第一层属性转化为必填属性，对于嵌套属性它并不会处理。

我在第一次接触到这个类型源码中的定义时也傻眼了，竟然还有 `-?` 这样的语法...没错，Required 中正是通过在属性名后使用 `-?` 定义属性为必填的。

至于它仅会处理一层的问题，也同样可以使用递归的方式来处理：

```ts
type DeepRequired<T> = {
  [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K];
};
```

#### Readonly：属性只读

```ts
/**
 * Make all properties in T readonly：将T中的所有属性设为只读
 */
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// 使用如下：
type ReadonlyPerson = Readonly<Person>;
// ReadonlyPerson === {
//   readonly name: string;
//   readonly age: number;
// }
```

#### Pick：选取属性

```ts
/**
 * From T, pick a set of properties whose keys are in the union K
 ：从T中，选择一组键在联合K中的属性
 */
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// 使用如下：
type PickPerson = Pick<Person, "name">;
// PickPerson === { name: string }
```

#### Exclude：从联合类型 T 中排除可分配给 U 的那些类型

> **用法含义**
> Exclude 是进行排除联合类型 T 类型中满足 U 的类型从而返回新的类型，
> ==**相对于下面的 Omit 操作符来说 Omit 是针对于 key&value/接口形式的，而 Exclude 是针对于联合类型来操作的**==。
> Exclude 是从联合类型里面排除某一个或几个。
> Omit 是从对象属性里面排除某一个或几个属性。

```ts
/**
 * Exclude from T those types that are assignable to U
 ：从T中排除可分配给U的那些类型
 */

type Exclude<T, U> = T extends U ? never : T;
```

```ts
// 使用如下
let a: string | number;

type CustomType = Exclude<typeof a, string>; // number类型
```

**【分析过程】**

从定义来看，意思是判断 T 是否继承 U，如果是返回 never 否则返回 T，但是这样说其实也不正确，返回的并不是完整的 T，并且这个 Exclude 也不是表面这个意思。

例如下面这个例子：

```ts
type A = "a" | "b" | "c";
type B = "a" | "d";

type C = Exclude<A, B>;
// type C = "b" | "c"
```

你以为的 Exclude 可能是这样的：

```ts
// 你以为的Exclude
type D = "a" | "b" | "c" extends "a" | "d" ? never : "a" | "b" | "c";
// type D = "a" | "b" | "c"
```

实际上的 Exclude

```ts
// 实际上的Exclude
type D =
  | ("a" extends "a" | "d" ? never : "a")
  | ("b" extends "a" | "d" ? never : "b")
  | ("c" extends "a" | "d" ? never : "c");
// type D = "b" | "c"
```

**【参考链接】**

- [TypeScript - 理清 Omit 与 Exclude 的关系与区别](https://juejin.cn/post/7091311285995831304)

- [typescript 之 Exclude 和 Extract](https://juejin.cn/post/7086448143830614023#heading-3)

#### Extract：从联合类型 T 中提取可分配给 U 的那些类型

```ts
/**
 * Extract from T those types that are assignable to U
 ：从T中提取可分配给U的那些类型
 */
type Extract<T, U> = T extends U ? T : never;
```

#### Omit：过滤属性

```ts
/**
 * Construct a type with the properties of T except for those in type K.
 ：构造类型为T的类型，但类型K除外。
 */
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
```

```ts
// 使用如下：
type OmitPerson = Omit<Person, "name">;
// OmitPerson === { age: number }
```

#### `Record<Keys,Type>`: 构建一组具有相同类型的属性构成的类型

> **用法含义** > `Record<Keys,Type>`用于构造一个新的对象类型，其属性键为 Keys，属性值为 Type。此实用程序可用于将一种类型的属性映射到另一种类型。

```ts
/**
 * Construct a type with a set of properties K of type T
 ：构造具有一组（类型T的属性）K的类型
 */
type Record<K extends string, T> = {
  [P in K]: T;
};
// 或者
type Record<K extends keyof any, T> = {
  [P in K]: T;
};

// 使用如下：
type RecordPerson = Record<"name" | "age", string>;
// RecordPerson === { name: string; age: string }
```

看看它的源码本质上很简单，就是==遍历传入的泛型 K 中每一个 key 值 P ，将每一个 P 作为 key 传入的 T 作为值类型重新组成一个对象类型==。

> **实例**

```ts
type keys = "name" | "title" | "hello";

interface values {
  name: string;
  label?: number;
}

// Record内置类型可以将 传入的keys联合类型遍历作为key
// 为每一个key的value赋值为 values从而形成一个全新的对象类型返回
const b: Record<keys, values> = {
  name: {
    name: "wang",
    label: 1,
  },
  title: {
    name: "hellp",
  },
  hello: {
    name: "nihao",
  },
};
```

同样我们常用 Record 类型在遍历上，比如：

```ts
// Record 常用遍历对象返回新的类型时使用
function mapping<K extends string | number | symbol, V, R>(
  obj: Record<K, V>,
  callback: (key: K, value: V) => R
): Record<K, R> {
  const result = {} as Record<K, R>;
  Object.keys(obj).forEach((key) => {
    const parseKey = key as K;
    const value = obj[key];
    result[key] = callback(parseKey, value);
  });
  return result;
}

mapping({ name: "19Qingfeng", company: "Tencent" }, (key, value) => {
  return key + value;
});
```

#### `Parameters<T>`

> **用法含义** > `Parameters<T>`用于获得函数的参数类型组成的元组类型

```ts
// 源码
type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;
```

```ts
// 使用如下
const fn = (a: string, b: number, ...c: number[]) => {};

type c = Parameters<typeof fn>;
```

#### `ResultType`

> **用法含义** > `ResultType<type>`接受传入一个函数类型为泛型，返回值为函数的返回类型。

```ts
type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;
```

ReturnType 源码中的类型定义中使用到了 extends 和 infer 关键字。

==首先使用 extends 约束了传入的泛型类型 T 必须是一个函数，同时使用 infer 关键字推断函数的返回值，当然如果传入的泛型 T 不满足约束则会返回 any==。

#### `ReturnType`

**【描述】**

在 `TypeScript` 中，`ReturnType` 工具类型**用于获取函数的返回值类型。它接受一个函数类型作为参数，并返回这个函数类型的返回值类型**。

例如，假设有一个函数 `function add(a: number, b: number): number`，我们可以使用 ReturnType 工具类型来获取这个函数的返回值类型，如下所示：

```ts
type AddReturnType = ReturnType<typeof add>;
```

在这个例子中，`AddReturnType` 将会被推断为 number，因为这个函数 add 的返回值类型是 number。

ReturnType 工具类型在很多情况下都非常有用，特别是在需要从函数类型中提取返回值类型时。通过使用 ReturnType 工具类型，可以让 TypeScript 在编译时捕获潜在的类型错误，增强代码的类型安全性。

**【实例】**

```ts
// control-shapes-bar\src\projects\store\index.ts

import { configureStore } from "@reduxjs/toolkit";
import attrsReducer from "./Slice/attrs";

export default function configureAppStore(preloadedState = {}) {
  const store = configureStore({
    reducer: {
      attrs: attrsReducer,
    },
    preloadedState,
  });
  return store;
}

type storeType = ReturnType<typeof configureAppStore>;
export type RootState = ReturnType<storeType["getState"]>;
export type AppDispatch = storeType["dispatch"];
```

### 条件类型

```ts
type T00 = Exclude<"a" | "b" | "c" | "d", "a" | "c" | "f">; // "b" | "d"
type T01 = Extract<"a" | "b" | "c" | "d", "a" | "c" | "f">; // "a" | "c"

type T02 = Exclude<string | number | (() => void), Function>; // string | number
type T03 = Extract<string | number | (() => void), Function>; // () => void

type T04 = NonNullable<string | number | undefined>; // string | number
type T05 = NonNullable<(() => string) | string[] | null | undefined>; // (() => string) | string[]

function f1(s: string) {
  return { a: 1, b: s };
}

class C {
  x = 0;
  y = 0;
}

type T10 = ReturnType<() => string>; // string
type T11 = ReturnType<(s: string) => void>; // void
type T12 = ReturnType<<T>() => T>; // {}
type T13 = ReturnType<<T extends U, U extends number[]>() => T>; // number[]
type T14 = ReturnType<typeof f1>; // { a: number, b: string }
type T15 = ReturnType<any>; // any
type T16 = ReturnType<never>; // any
type T17 = ReturnType<string>; // Error
type T18 = ReturnType<Function>; // Error

type T20 = InstanceType<typeof C>; // C
type T21 = InstanceType<any>; // any
type T22 = InstanceType<never>; // any
type T23 = InstanceType<string>; // Error
type T24 = InstanceType<Function>; // Error
```

## 其它

### 类型保护与区分类型

### 可辨识联合

### declare

为了增加人性化程度，在 IDE 编写代码的时候，通常会有智能提示效果。

以 VScode 为例子，截图如下：

![](https://www.softwhy.com/data/attachment/portal/201905/01/001707lakag6mdsg5cj6bl.jpg)

当键入 document.的时候，会自动弹出可能的选项，这是 VScode 内置的功能。

但是当编写 jQuery 或者其他一些库的代码时候，则没有类似的提示，非常的不方便。

不过可以自定义或者使用已经定义好的 d.ts 文件来解决此问题。

**declare 可以向 TypeScript 域中引入一个变量，在编写代码的时候就能够实现智能提示的功能**。

![](https://www.softwhy.com/data/attachment/portal/201905/01/001810m7v3il4vlgl93l4s.jpg)

当输入 func 会出现智能提示效果；通常代码不是直接写在当前 ts 文件，而是集中在.d.ts 文件，然后引入。

## 参考资料

- [[1]typescript 进阶篇之高级类型与条件类型(Readonly, Partial, Pick, Record)](https://www.cnblogs.com/Grewer/p/10973744.html)
- [[2]几个 TypeScript 泛型的使用场景(深度 Partial)](https://segmentfault.com/a/1190000019758521)
- [[3]TS 高级类型 declare 用法](https://www.softwhy.com/article-10172-1.html)
