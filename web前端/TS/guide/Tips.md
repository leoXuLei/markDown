# TypeScript 声明文件写法全解析

**【声明文件的定义】：**
通俗地来讲，在 TypeScript 中以 .d.ts 为后缀的文件，我们称之为 TypeScript 声明文件。它的主要作用是描述 JavaScript 模块内所有导出接口的类型信息。

**【什么时候需要写 TS 声明文件】：**
在日常的开发中，绝大多数时候是不需要我们单独去编写一个 TS 声明文件的。如果我们的文件本身是用 TS 编写的，在编译的时候让 TS 自动生成声明文件，并在发布的时候将 .d.ts 文件一起发布即可。

总结了以下三种情况，需要我们手动定义声明文件：

- 1. 通过 script 标签引入的第三方库
     一些通过 CDN 的当时映入的小的工具包，挂载了一些全局的方法，如果在 TS 中直接使用的话，会报 TS 语法错误，这时候就需要我们对这些全局的方法进行 TS 声明。

- 2. 使用的第三方 npm 包，但是没有提供声明文件
     第三方 npm 包如果有提供声明文件的话，一般会以两种形式存在：一是 @types/xxx，另外是在源代码中提供 .d.ts 声明文件。第一种的话一般是一些使用量比较高的库会提供，可以通过 npm i @type/xxx 尝试安装。如果这两种都不存在的话，那就需要我们自己来定义了。

- 3. 自身团队内比较优秀的 JS 库或插件，为了提升开发体验

## TS 中的两种文件类型

TS 中有两种文件类型。

- .ts 文件：
  既包含类型信息又可执行代码。
  可以被编译成 .js 文件，然后，执行代码。
  用途：编写程序代码的地方。
- .d.ts 文件：
  只包含类型信息的类型声明文件。
  不会生成 .js 文件，仅用于提供类型信息。
  用途：为 JS 提供类型信息。

总结：.ts 是 implementation（代码实现文件）；.d.ts 是 declaration（类型声明文件）。

## 如何编写 TS 声明文件

对于不同形式的声明文件，写法上会有一定的差异。这里需要特别注意一点的是：声明文件中只是对类型的定义，不能进行赋值。

**【全局变量】：**

全局变量的声明文件主要有以下几种语法：

```ts
declare let/const  // 声明全局变量
declare function   // 声明全局方法
declare class      // 声明全局类
declare enum       // 声明全局枚举类型
declare namespace  // 声明（含有子属性的）全局对象
interface/type     // 声明全局类型
```

这里需要注意的是只是定义类型，不能进行赋值。

```ts
// 变量
declare let userName: string;

declare const wx: any;

// 函数、函数重载
declare function getName(uid: number): string;
declare function getName(): string;
declare function getName(cb: () => any): any;

// 类
declare class Course {
  cid: number;
  constructor(cid) {}
  getCoursePrice(): number;
}

// 枚举
declare enum Status {
  Loading,
  Success,
  Failed,
}

// 接口 interface declare 可以不需要
interface CourseInfo {
  cid: number;
  name: string;
}

interface CGIData<T> {
  data: T;
  retcode: 0;
}

// 命名空间
declare namespace User {
  // 局部 Test.User
  interface User {
    name: string;
    age: number;
  }

  function getUserInfo(name: string): User {
    return "";
  }
  namespace fn {
    function extend(obj: any): any;
  }
}

// 声明合并
declare function User(id: number): string;
```

- TS 项目如何新增全局类型声明

```bash
.d.ts 文件中的顶级声明必须以 "declare" 或 "export" 修饰符开头。ts(1046)
```

**【npm 包】：**
对于没有提供声明文件的 npm 包，我们可以创建一个 types 目录，来管理自己写的声明文件，同时需要在配置文件 `tsconfig.json` 中的 paths 和 basrUrl 中配置：

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "baseUrl": "./", // types文件夹的相对路径
    "paths": { "*": ["types/*"] }
  }
}
```

npm 包的声明文件主要有以下几种语法：

```js
export const/let  // 导出变量
export namespace  // 导出（含有自属性的）对象
export default    // ES6 默认导出
export =          // commonjs 导出模块
```

**【拓展原有模块/全局变量】：**
对于已经有声明定义的模块或者全局变量，可以利用 TS 中的声明合并对其进行拓展。

比如在 window 下挂载的一些全局变量:

```ts
interface Window {
  readonly request?: any;
  readonly devToolsExtension?: any;
  readonly wx?: any;
}
```

对已有模块进行拓展：

```ts
declare module "querystring" {
  function escape(str: string): string;
  function unescape(str: string): string;
}
```

还可以使用三斜线的方式对声明文件进行引用：

```ts
/// <reference path=”custom.d.ts" />
```

**【参考链接】：**

- [(2022-06-29)TypeScript 声明文件全解析](https://cloud.tencent.com/developer/article/2033803?from=15425)
- [(2022-07-09)TypeScript 入门之 TS 类型声明文件](https://blog.csdn.net/Svik_zy/article/details/123330236)

# **容易忽略的关键字**

[TypeScript 进阶手册](https://zhuanlan.zhihu.com/p/455451829)

## `keyof`

> **定义**
> The keyof operator takes an object type and produces a string or numeric literal union of its keys
> `keyof` 操作符会将一个对象类型(注意这里是类型并不是值)的 key 组成联合类型返回。

```ts
interface IProps {
  name: string;
  count: number;
}
type Ikey = keyof IProps; // Ikea = 'name' | 'count'

function testKeyof(props: Ikey): void {}
```

```ts
// 国际化资源
const resources = {
  "zh-CN": {
    translation: zhCN,
  },
  "en-US": {
    translation: enUS,
  },
};

type IngType = keyof typeof resources;
// "zh-CN" | "en-US"
```

## `extends`

> **定义**
> Ts 中 extends 除了用在继承上，还可以表达泛型约束，通过 extends 关键字可以约束泛型具有某些属性。
> 其实 extends 关键字表示约束的时候，就是**表示要求泛型上必须实现(包含)约束的属性**。

> **示例**

```ts
function loggingIdentity<T>(arg: T): T {
  console.log(arg.length); // Ts语法错误 T可以是任意类型，并不存在length属性
  return arg;
}
```

我们定义一个接口来描述约束条件，创建一个包含` .length` 属性的接口，使用这个接口和 extends 关键字来实现约束：

```ts
interface Lengthwise {
  length: number;
}

// 表示传入的泛型T接受Lengthwise的约束
// T必须实现Lengthwise 换句话说 Lengthwise这个类型是完全可以赋给T
function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // OK
  return arg;
}
```

现在这个泛型函数被定义了约束，因此它不再是适用于任意类型：

```ts
loggingIdentity(3); // Error
```

我们需要传入符合约束类型的值，必须包含必须的属性：

```ts
loggingIdentity({ length: 10, value: 3 }); // OK
```

> **日常用法**

你可以声明一个类型参数，且它被另一个类型参数所约束。 比如，现在我们想要用属性名从对象里获取这个属性。 并且我们想要确保这个属性存在于对象 obj 上，因此我们需要在这两个类型之间使用约束。

```ts
// 表示传入的两个参数，第二个参数被约束成为只能传入obj的key类型。
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a"); // okay
getProperty(x, "m"); // error
```

同样 `extends` 还可以用在类型判断语句上，比如这样：

```ts
type Env<T> = T extends "production" ? "production" : "development";
```

## `new`

new 关键字用在类型上，表示构造函数的类型。ts 中 `new()` 表示构造函数类型。

> 当我们声明一个类的时候，其实声明的是这个类的实例类型和静态类型两个类型。

```ts
class Star {
  constructor() {
    // init somethings
  }
}

// 此时这里的example参数它的类型为 Star 类类型而非实例类型
// 它表示接受一个构造函数 这个构造函数new后会返回Star的实例类型
function counter(example: new () => Star) {
  // do something
}

// 直接传入类
counter(Star);
```

## `infer`

> **定义**
> infer 表示在 extends 条件语句中待推断的类型变量，必须联合 extends 类型出现。

> **示例**

```ts
type ParamType<T> = T extends (...args: infer P) => any ? P : T;

interface User {
  name: string;
  age: number;
}

type Func = (user: User) => void;

type Param = ParamType<Func>; // Param = User
type AA = ParamType<string>; // string
```

其实碰到==infer 关键字简单的将它理解为一个等待推断的类型(我现在不知道，得根据条件( extends )来判断)就可以了==。

重点是:

- 1.infer 跟随 extends 成双出现。
- 2.`infer P`表示类型 P 是一个待推断的类型。(不使用 infer 直接 P 会报错)

# 字符串数组元素作为联合类型的值

```ts
declare const ModeOptions: ["default", "multiple", "tags", "combobox"];
type ModeOption = (typeof ModeOptions)[number];
// type ModeOption = "default" | "multiple" | "tags" | "combobox"
```

**【TS 如何取出字符串数组每个元素组成的联合类型？】**

**【询问 Gpt，回答是可以的】**

可以使用 TypeScript 中的 "typeof" 和 "keyof" 关键字来取出字符串数组中每个元素组成的联合类型，示例代码如下：

```tsx
const arr = ["foo", "bar", "baz"];

type ArrType = typeof arr[number]; // 'foo' | 'bar' | 'baz'

type ArrKeyType = keyof typeof arr; // number | "length"
```

其中，typeof arr 取得了 arr 变量的类型，而 number 作为索引类型可以获取到数组中的每一个元素类型。keyof typeof arr 则是获取 arr 的属性键名的联合类型，包括 number 类型和 length 属性。

**【实际自测：不可以，】**

```tsx
const RADIO_OPTIONS = ["timeBar", "configuration"];

type RadioOptions = keyof typeof RADIO_OPTIONS; // keyof string[]
type TRadioOptions = typeof RADIO_OPTIONS; // string[]
type RadioValue = TRadioOptions[number]; // string
```

# 问题

## `.d.ts`全局类型文件中声明的枚举，没法当作 map 在运行时使用

**【报错】**：`[@umijs/runtime] load component failed ReferenceError: EnumRecipeStatus is not defined`

**【参考链接】:**

- [TypeScript 中如何使用自己在 d.ts 中定义的 enum？](https://www.zhihu.com/question/464165657)
- [关于 d.ts 文件引入枚举定义的错误](https://zhuanlan.zhihu.com/p/109504167)

# 参考链接

- [TypeScript 进阶手册](https://zhuanlan.zhihu.com/p/455451829)
