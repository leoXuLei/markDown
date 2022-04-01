
# 接口 vs 类型别名

类型别名可以像接口一样；然而，仍有一些细微差别。

##  `Objects / Functions`

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
type PartialPointX = { x: number; };
type PartialPointY = { y: number; };

// union
type PartialPoint = PartialPointX | PartialPointY;

// tuple
type Data = [number, string];

// dom
let div = document.createElement('div');
type B = typeof div;
```

## `Extend`语法

两者都可以扩展，但是语法又有所不同。此外，请注意接口和类型别名不是互斥的。接口可以扩展类型别名，反之亦然。


```ts
//  interface 继承 interface
interface PartialPointX { x: number; }

interface Point extends PartialPointX { 
  y: number;
}


// type 继承 type
type PartialPointX = { x: number; };

type Point = PartialPointX & { y: number; };


// interface 继承 type
type PartialPointX = { x: number; };

interface Point extends PartialPointX { 
  y: number;
}


// type 继承 interface
interface PartialPointX { x: number; }

type Point = PartialPointX & { y: number; };
```

## `class Implements`
类可以以相同的方式实现接口或类型别名。**但是请注意，类和接口被认为是静态的。因此，它们不能实现/扩展命名联合类型的类型别名**。


类可以实现interface 以及 type(除联合类型外)。


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

type PartialPoint = { x: number; } | { y: number; };

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
interface Point { x: number; }
interface Point { y: number; }

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
type Keys = "firstname" | "surname"

type DudeType = {
  [key in Keys]: string
}

const test: DudeType = {
  firstname: "Pawel",
  surname: "Grzybek"
}

// 报错
//interface DudeType2 {
//  [key in keys]: string
//}
```


type 在这方面就表现得更强大，它可以使用计算属性，可以限制属性包含某几个。

下面这个例子中， X 就只包含 小王 和 小文 两个属性。

```ts
type Keys = "小王" | "小文"

type X = {
  [key in Keys]: string
}

const test: X = {
    '小王': '肌肉男',
    '小文': '也是肌肉男'
}


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
  name: string
}

// export default type Config1 = {
//   name: string
// }
// 会报错

type Config2 = {
    name: string
}
export default Config2
```
## 索引签名问题
如果你经常使用TypeScript, 一定遇到过相似的错误：

```ts
Type 'xxx' is not assignable to type 'yyy'
Index signature is missing in type 'xxx'.
```

```ts
interface propType{
  [key: string] : string
}

let props: propType

type dataType = {
    title: string
}
interface dataType1 {
    title: string
}
const data: dataType = {title: "订单页面"}
const data1: dataType1 = {title: "订单页面"}


props = data

// Error:类型“dataType1”不可分配给类型“propType”; 类型“dataType1”中缺少索引签名 
props = data1
```

我们发现dataType和dataType1对应的类型一样，但是interface定义的就赋值失败，是什么原因呢？刚开始百思不解，最后我在 stack overflow上找到了一个相似的问题：见链接



就是说interface定义的类型是不确定的， 成员中再加一个即可：
```ts
interface propType{
  [key: string] : string
  title:number
}
```

## 总结
总结interface 和 type 很像，很多场景，两者都能使用。

但也有细微的差别：
- 类型：对象、函数两者都适用，但是 type 可以用于基础类型、联合类型、元祖。
- 同名合并：interface 支持，type 不支持。
- 计算属性：type 支持, interface 不支持。

总的来说，公共的用 interface 实现，不能用 interface 实现的再用 type 实现。是一对互帮互助的好兄弟。


**官方推荐用 interface，其他无法满足需求的情况下用 type。但其实，因为 联合类型 和 交叉类型 是很常用的，所以避免不了大量使用 type 的场景，一些复杂类型也需要通过组装后形成类型别名来使用**。

所以，如果想保持代码统一，还是可选择使用 type。通过上面的对比，`类型别名其实可涵盖 interface 的大部分场景`。

对于 React 组件中 props及 state，使用 type ，这样能够保证使用组件的地方不能随意在上面添加属性。如果有自定义需求，可通过 HOC二次封装。

编写三方库时使用interface，其更加灵活自动的类型合并可应对未知的复杂使用场景。
# 参考链接
- [TypeScript 中 interface 和 type 使用区别介绍](https://juejin.cn/post/6844904114925600776#heading-15)
- [type 与 interface 的区别，你真的懂了吗？](https://juejin.cn/post/7072945053936648200)