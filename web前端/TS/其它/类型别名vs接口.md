# 接口 vs 类型别名

类型别名可以像接口一样；然而，仍有一些细微差别。

## `Objects / Functions`

两者都可以用来描述对象或函数的类型，但是语法不同。

```ts
// interface
interface Point {
  x: number;
  y: number;
}

interface SetPoint {
  (x: number, y: number): void;
}

// type alias
type Point = {
  x: number;
  y: number;
};

type SetPoint = (x: number, y: number) => void;
```

另外，说一点，使用 interface 表示函数类型语法有点特殊：

```ts
interface SearchFunc {
  (source: string, subString: string): boolean;
}
```

对比起来还是 type 表示函数更直观：

```ts
type SearchFunc = (source: string, subString: string) => boolean;
```

## 其它类型

与接口不同，类型别名还可以用于其他类型，如基本类型（原始值，如`undefined, null, boolean, string，number`）、联合类型、元组。

```ts
// primitive
type Name = string;

// object
type PartialPointX = { x: number };
type PartialPointY = { y: number };

// union
type PartialPoint = PartialPointX | PartialPointY;

// tuple
type Data = [number, string];

// dom
let div = document.createElement("div");
type B = typeof div;
```

## `Extend`语法

两者都可以扩展，但是语法又有所不同。此外，请注意接口和类型别名不是互斥的。接口可以扩展类型别名，反之亦然。

```ts
//  interface 继承 interface
interface PartialPointX {
  x: number;
}

interface Point extends PartialPointX {
  y: number;
}

// type 继承 type
type PartialPointX = { x: number };

type Point = PartialPointX & { y: number };

// interface 继承 type
type PartialPointX = { x: number };

interface Point extends PartialPointX {
  y: number;
}

// type 继承 interface
interface PartialPointX {
  x: number;
}

type Point = PartialPointX & { y: number };
```

## `class Implements`

类可以以相同的方式实现接口或类型别名。**但是请注意，类和接口被认为是静态的。因此，它们不能实现/扩展命名联合类型的类型别名**。

类可以实现 interface 以及 type(除联合类型外)。

```ts
interface Point {
  x: number;
  y: number;
}

class SomePoint implements Point {
  x: 1;
  y: 2;
}

type Point2 = {
  x: number;
  y: number;
};

class SomePoint2 implements Point2 {
  x: 1;
  y: 2;
}

type PartialPoint = { x: number } | { y: number };

// FIXME: can not implement a union type
class SomePartialPoint implements PartialPoint {
  x: 1;
  y: 2;
}
```

## `extends class`

类定义会创建两个东西：类的实例类型和一个构造函数。 因为类可以创建出类型，所以你能够在允许使用接口的地方使用类。

```ts
class Point {
  x: number;
  y: number;
}

interface Point3d extends Point {
  z: number;
}
```

## `Declaration merging`

与类型别名不同，接口可以定义多次，并将被视为单个接口(合并所有声明的成员)。

```ts
// These two declarations become:
// interface Point { x: number; y: number; }
interface Point {
  x: number;
}
interface Point {
  y: number;
}

const point: Point = { x: 1, y: 2 };
```

## 计算属性，生成映射类型

type 能使用 in 关键字生成映射类型，但 interface 不行。

语法与索引签名的语法类型，内部使用了 `for .. in`。

具有三个部分：

- 类型变量 K，它会依次绑定到每个属性。
- 字符串字面量联合的 Keys，它包含了要迭代的属性名的集合。
- 属性的结果类型。

```ts
type Keys = "firstname" | "surname";

type DudeType = {
  [key in Keys]: string;
};

const test: DudeType = {
  firstname: "Pawel",
  surname: "Grzybek",
};

// 报错
//interface DudeType2 {
//  [key in keys]: string
//}
```

type 在这方面就表现得更强大，它可以使用计算属性，可以限制属性包含某几个。

下面这个例子中， X 就只包含 小王 和 小文 两个属性。

```ts
type Keys = "小王" | "小文";

type X = {
  [key in Keys]: string;
};

const test: X = {
  小王: "肌肉男",
  小文: "也是肌肉男",
};

// 会报错
// interface Y {
//   [key in Keys]: number
// }

// 会报错
// type XX = keyof Keys;
// interface Y {
//     [k: XX]: number
// }
```

总之 interface 中，表示对象的类型方面没 type 灵活。

## 其他细节

```ts
export default interface Config {
  name: string;
}

// export default type Config1 = {
//   name: string
// }
// 会报错

type Config2 = {
  name: string;
};
export default Config2;
```

## 索引签名问题

如果你经常使用 TypeScript, 一定遇到过相似的错误：

```ts
Type 'xxx' is not assignable to type 'yyy'
Index signature is missing in type 'xxx'.
```

```ts
interface propType {
  [key: string]: string;
}

let props: propType;

type dataType = {
  title: string;
};
interface dataType1 {
  title: string;
}
const data: dataType = { title: "订单页面" };
const data1: dataType1 = { title: "订单页面" };

props = data;

// Error:类型“dataType1”不可分配给类型“propType”; 类型“dataType1”中缺少索引签名
props = data1;
```

我们发现 dataType 和 dataType1 对应的类型一样，但是 interface 定义的就赋值失败，是什么原因呢？刚开始百思不解，最后我在 stack overflow 上找到了一个相似的问题：见链接

就是说 interface 定义的类型是不确定的， 成员中再加一个即可：

```ts
interface propType {
  [key: string]: string;
  title: number;
}
```

## 总结

总结 interface 和 type 很像，很多场景，两者都能使用。

但也有细微的差别：

- 类型：对象、函数两者都适用，但是 type 可以用于基础类型、联合类型、元祖。
- 同名合并：interface 支持，type 不支持。
- 计算属性：type 支持, interface 不支持。

总的来说，公共的用 interface 实现，不能用 interface 实现的再用 type 实现。是一对互帮互助的好兄弟。

**官方推荐用 interface，其他无法满足需求的情况下用 type。但其实，因为 联合类型 和 交叉类型 是很常用的，所以避免不了大量使用  type  的场景，一些复杂类型也需要通过组装后形成类型别名来使用**。

所以，如果想保持代码统一，还是可选择使用  type。通过上面的对比，`类型别名其实可涵盖 interface 的大部分场景`。

对于 React 组件中  props 及  state，使用  type ，这样能够保证使用组件的地方不能随意在上面添加属性。如果有自定义需求，可通过 HOC 二次封装。

编写三方库时使用 interface，其更加灵活自动的类型合并可应对未知的复杂使用场景。

# 实例

## 设置了索引类型的 interface 如何扩展其它类型的属性

**【问题描述】**

`interface` `IBaseResField`设置了索引类型，key 是 `string` 类型，value 是 `IFieldItem` 类型。想新写个接口，继承自`IBaseResField`，但是由于新增的属性类型不是`IFieldItem` 类型，导致报 TS 错误。代码及报错如下：

```ts
export interface IFieldItem {
  modifyed: boolean;
  type: string;
  value: number | string | boolean;
  backup?: number | string | boolean;
  dlen?: number;
  hdwproperty?: boolean;
  max?: string; // 100,
  min?: string; // 1,

  disabled?: boolean;
  label: string; // 外层展示的名字
  list?: Array<{ inner: number; display: string }>;
}

export interface IBaseResField {
  TAG_NAME: IFieldItem;
  TAG_ID: IFieldItem;
  TAG_TYPE: IFieldItem;
  MODULE: IFieldItem;
  BUS_SN: IFieldItem;
  MODULE_SN: IFieldItem;
  CHAN_SN: IFieldItem;
  [key: string]: IFieldItem;
}

export interface IResVariatesItem extends IBaseResField {
  DisplayPage: IDisplayPageItem[];
}

// DisplayPage会TS报错：类型“IDisplayPageItem[]”的属性“DisplayPage”不能赋给“string”索引类型“IFieldItem”。ts(2411)
```

**【解决方法】**

使用`type`，即改为`type` 继承 `interface`，然后 TS 报错消失。

```ts
type IResVariatesItem = IBaseResField & {
  DisplayPage: IDisplayPageItem[];
};

// 悬浮到a上提示 let a: IDisplayPageItem[]
let a: IResVariatesItem["DisplayPage"];
```

若使用`let a: IResVariatesItem.DisplayPage;`，则会报错。

```ts
// 无法访问“IResVariatesItem.DisplayPage”，因为“IResVariatesItem”是类型，不是命名空间。是否要使用“IResVariatesItem["DisplayPage"]”检索“IResVariatesItem”中“DisplayPage”属性的类型?ts(2713)

let a: IResVariatesItem.DisplayPage;
```

读取`IBaseResField`中的属性也是如何，只能使用索引属性写法。

```ts
// 无法访问“IResVariatesItem.TAG_NAME”，因为“IResVariatesItem”是类型，不是命名空间。是否要使用“IResVariatesItem["TAG_NAME"]”检索“IResVariatesItem”中“TAG_NAME”属性的类型?ts(2713)

// let a: IResVariatesItem.TAG_NAME

// 悬浮到a上提示 let a: IFieldItem
let a: IResVariatesItem["TAG_NAME"];
```

# 参考链接

- [TypeScript 中 interface 和 type 使用区别介绍](https://juejin.cn/post/6844904114925600776#heading-15)
- [type 与 interface 的区别，你真的懂了吗？](https://juejin.cn/post/7072945053936648200)
