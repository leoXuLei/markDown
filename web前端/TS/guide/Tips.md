
# **容易忽略的关键字**
[TypeScript 进阶手册](https://zhuanlan.zhihu.com/p/455451829)
## `keyof`
> **定义**
> The keyof operator takes an object type and produces a string or numeric literal union of its keys
> `keyof` 操作符会将一个对象类型(注意这里是类型并不是值)的key组成联合类型返回。

```ts
interface IProps {
  name: string;
  count: number;
}
type Ikey = keyof IProps; // Ikea = 'name' | 'count'

function testKeyof(props: Ikey): void { }
```
## `extends`
> **定义**
Ts中extends除了用在继承上，还可以表达泛型约束，通过extends关键字可以约束泛型具有某些属性。
其实extends关键字表示约束的时候，就是**表示要求泛型上必须实现(包含)约束的属性**。

> **示例**
```ts
function loggingIdentity<T>(arg: T): T {
  console.log(arg.length) // Ts语法错误 T可以是任意类型，并不存在length属性
  return arg
}
```

我们定义一个接口来描述约束条件，创建一个包含` .length` 属性的接口，使用这个接口和 extends 关键字来实现约束：


```ts
interface Lengthwise {
  length: number
}

// 表示传入的泛型T接受Lengthwise的约束
// T必须实现Lengthwise 换句话说 Lengthwise这个类型是完全可以赋给T
function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length) // OK
  return arg
}
```

现在这个泛型函数被定义了约束，因此它不再是适用于任意类型：
```ts
loggingIdentity(3);  // Error
```

我们需要传入符合约束类型的值，必须包含必须的属性：
```ts
loggingIdentity({length: 10, value: 3}) // OK
```
> **日常用法**

你可以声明一个类型参数，且它被另一个类型参数所约束。 比如，现在我们想要用属性名从对象里获取这个属性。 并且我们想要确保这个属性存在于对象 obj 上，因此我们需要在这两个类型之间使用约束。

```ts
// 表示传入的两个参数，第二个参数被约束成为只能传入obj的key类型。
function getProperty<T, K extends keyof T> (obj: T, key: K ) {
  return obj[key]
}

let x = {a: 1, b: 2, c: 3, d: 4}

getProperty(x, 'a') // okay
getProperty(x, 'm') // error
```

同样 `extends` 还可以用在类型判断语句上，比如这样：
```ts
type Env<T> = T extends 'production' ? 'production' : 'development';
```
## `new`
new 关键字用在类型上，表示构造函数的类型。ts中 `new()` 表示构造函数类型。

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
counter(Star)
```

## `infer`

> **定义**
infer表示在 extends 条件语句中待推断的类型变量，必须联合extends类型出现。


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

其实碰到==infer关键字简单的将它理解为一个等待推断的类型(我现在不知道，得根据条件( extends )来判断)就可以了==。

重点是:
- 1.infer跟随extends成双出现。
- 2.`infer P`表示类型P是一个待推断的类型。(不使用infer直接P会报错)



# 字符串数组元素作为联合类型的值
```ts
declare const ModeOptions: ["default", "multiple", "tags", "combobox"];
type ModeOption = (typeof ModeOptions)[number];
// type ModeOption = "default" | "multiple" | "tags" | "combobox"
```



# 参考链接
- [TypeScript 进阶手册](https://zhuanlan.zhihu.com/p/455451829)