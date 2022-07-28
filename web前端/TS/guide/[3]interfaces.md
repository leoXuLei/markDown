# 接口

## 介绍

TypeScript 的核心原则之一是对值所具有的结构进行类型检查。 它有时被称做“鸭式辨型法”或“结构性子类型化”。在 TypeScript 里，**接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。**

> 大地解释：接口是一种规范的定义，定义了行为和动作的规范。（类似于现实生活中的 usb 接口，必须合适大小，宽高，孔数才能正确交互）

## 接口初探

**接口用于定义一个 object 的具体键值对，方便代码复用**：

```typescript
function printLabel(labelledObj: { label: string }): void {
  console.log(labelledObj.label);
}

// 接口重写

interface LabelledValue {
  label: string;
}

function printLabel(labelledObj: LabelledValue): void {
  console.log(labelledObj.label);
}
let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);
```

类型检查器会查看 printLabel 的调用。 **printLabel 有一个参数，并要求这个对象参数有一个名为 label 类型为 string 的属性**。 需要注意的是，我们传入的对象参数实际上会包含很多属性，但是**编译器只会检查那些必需的属性是否存在，并且其类型是否匹配**。 **类型检查器不会去检查属性的顺序，只要相应的属性存在并且类型也是对的就可以**。

## 可选属性

接口里的属性未必都是必须的，可选属性相当于给当前字段添加一个 undefined 的默认值：

```typescript
// 属性名?: 类型

interface DemoOptions {
  label?: string; // 相当于 label: string|undefined
}
```

## 只读属性

用于初始化后就不再允许修改的属性：

```typescript
// readonly 属性名: 类型

interface Point {
  readonly x: number;
  readonly y: number;
}
```

你可以通过赋值一个对象字面量来构造一个 Point。 赋值后， x 和 y 再也不能被改变了。

```typescript
let p1: Point = { x: 10, y: 20 };
p1.x = 5; // error!
```

TypeScript 具有 `ReadonlyArray<T>` 类型，它与 `Array<T> `相似，只是把所有可变方法去掉了，因此可以确保数组创建后再也不能被修改：

```typescript
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; // error!
ro.push(5); // error!
ro.length = 100; // error!
a = ro; // error!
```

上面代码的最后一行，可以看到就算把整个 `ReadonlyArray` 赋值到一个普通数组也是不可以的。 但是你可以用类型断言重写：

```typescript
a = ro as number[];
```

当作为一个变量的时候应该使用 `const` ,作为属性则使用 `readonly`。

## 额外的属性检查

有时候，一个对象的 key 值是动态的，这时候可以用这种方式定义类型：

```typescript
interface DemoOptions {
  [key: string]: any; // key为string类型，value为any类型的object
}
```

我们在第一个例子里使用了接口，TypeScript 让我们传入 `{ size: number; label: string; }` 到仅期望得到 `{ label: string; } `的函数里。 我们已经学过了可选属性，并且知道他们在“option bags”模式里很有用。

然而，天真地将这两者结合的话就会像在 JavaScript 里那样搬起石头砸自己的脚。 比如，拿 createSquare 例子来说：

```typescript
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  // ...
}

let mySquare = createSquare({ colour: "red", width: 100 });
```

注意传入 createSquare 的参数拼写为 `colour` 而不是 `color`。 在 JavaScript 里，这会默默地失败。

你可能会争辩这个程序已经正确地类型化了，因为 width 属性是兼容的，不存在 `color` 属性，而且额外的 `colour`属性是无意义的。

然而，TypeScript 会认为这段代码可能存在 bug。对象字面量会被特殊对待而且会经过 外属性检查，当将它们赋值给变量或作为参数传递的时候。 **如果一个对象字面量存在任何“目标类型”不包含的属性时，你会得到一个错误**。

### 绕开类型检查的三种方法

- 类型断言

绕开这些检查非常简单。 最简便的方法是使用类型断言：

```typescript
let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);
```

- 字符串索引签名

然而，**最佳的方式是能够添加一个字符串索引签名**，前提是你能够确定这个对象可能具有某些做为特殊用途使用的额外属性。 如果 SquareConfig 带有上面定义的类型的 color 和 width 属性，并且还会带有任意数量的其它属性，那么我们可以这样定义它：

```typescript
interface SquareConfig {
  color?: string;
  width?: number;
  [propName: string]: any;
}
```

`SquareConfig 可以有任意数量的属性，并且只要它们不是color和width，那么就无所谓它们的类型是什么`。

- 对象赋值给另一个变量

还有最后一种跳过这些检查的方式，这可能会让你感到惊讶，它就是将这个对象赋值给一个另一个变量： 因为 squareOptions 不会经过额外属性检查，所以编译器不会报错。

```typescript
let squareOptions = { colour: "red", width: 100 };
let mySquare = createSquare(squareOptions);
```

要留意，在像上面一样的简单代码里，你可能不应该去绕开这些检查。 对于包含方法和内部状态的复杂对象字面量来讲，你可能需要使用这些技巧，但是大部额外属性检查错误是真正的 bug。 就是说你遇到了额外类型检查出的错误，比如“option bags”，你应该去审查一下你的类型声明。 在这里，如果支持传入 color 或 colour 属性到 createSquare，你应该修改 SquareConfig 定义来体现出这一点。

## 可索引的类型

> 对数组、对象的约束（不常用）

与使用接口描述函数类型差不多，我们也可以描述那些能够“通过索引得到”的类型，比如 a[10]或 ageMap["daniel"]。可索引类型具有一个索引签名，**它描述了对象索引的类型，还有相应的索引返回值类型**。 让我们看一个例子：

```typescript
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];
```

上面例子里，我们定义了 StringArray 接口，它具有索引签名。 这个索引签名表示了当用 number 去索引 StringArray 时会得到 string 类型的返回值。

**TypeScript 支持两种索引签名：字符串和数字**。 可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型。 这是因为当使用 number 来索引时，JavaScript 会将它转换成 string 然后再去索引对象。 也就是说用 100（一个 number）去索引等同于使用"100"（一个 string）去索引，因此两者需要保持一致。

字符串索引签名能够很好的描述 dictionary 模 式，并且它们也会确保所有属性与其返回值类型相匹配。 因为字符串索引声明了 `obj.property` 和 `obj["property"]` 两种形式都可以。 下面的例子里，name 的类型与字符串索引类型不匹配，所以类型检查器给出一个错误提示：

```typescript
interface NumberDictionary {
  [index: string]: number;
  length: number; // 可以，length是number类型
  name: string; // 错误，`name`的类型与索引类型返回值的类型不匹配
}
```

最后，你可以将索引签名设置为只读，这样就防止了给索引赋值：

```typescript
interface ReadonlyStringArray {
  readonly [index: number]: string;
}
let myArray: ReadonlyStringArray = ["Alice", "Bob"];
myArray[2] = "Mallory"; // error! 不能设置myArray[2]，因为索引签名是只读的。
```

## 函数类型

> 对函数的参数和返回值进行约束

> 目前，TypeScript 只支持函数表达式的定义，暂不支持函数声明的定义

除了描述带有属性的普通对象外，接口也可以描述函数类型。

为了使用接口表示函数类型，我们需要给接口定义一个调用签名。 **它就像是一个只有参数列表和返回值类型的函数定义。参数列表里的每个参数都需要名字和类型**。

```typescript
interface IncludesFunc {
  // (参数：类型, ...): 返回值类型
  (source: string, subString: string): boolean;
}
```

这样定义后，我们可以像使用其它接口一样使用这个函数类型的接口。下例展示了如何创建一个函数类型的变量，并将一个同类型的函数赋值给这个变量。

```typescript
let strIncludes: IncludesFunc;
strIncludes = function (source: string, subString: string) {
  return source.includes(subString);
};
```

对于函数类型的类型检查来说，**函数的参数名不需要与接口里定义的名字相匹配**。 比如，我们使用下面的代码重写上面的例子：

```typescript
let strIncludes: IncludesFunc;
strIncludes = function (src: string, sub: string): boolean {
  return src.includes(sub);
};
```

**函数的参数会逐个进行检查，要求对应位置上的参数类型是兼容的**。 如果你不想指定类型，TypeScript 的类型系统会推断出参数类型，因为函数直接赋值给了 SearchFunc 类型变量。 函数的返回值类型是通过其返回值推断出来的（此例是 false 和 true）。 如果让这个函数返回数字或字符串，类型检查器会警告我们函数的返回值类型与 SearchFunc 接口中的定义不匹配。

```typescript
let strIncludes: IncludesFunc;
strIncludes = function (src, sub) {
  return src.includes(sub);
};
```

### 实例

```typescript
interface IncludesFunc {
  (source: string, subString: string): boolean;
}

const strIncludes: IncludesFunc = (src: string, sub: string) => {
  return src.includes(sub);
};
strIncludes("123", "2"); // true
strIncludes("123", 2); // ture 类型“2”的参数不能赋给类型“string”的参数。ts(2345)
```

## 类类型

> 对类的约束：跟抽象类有点相似

### 实现接口

接口描述了类的公共部分，而不是公共和私有两部分。它不会帮你检查类是否具有某些私有成员。

```typescript
interface animial {
  name: string;
  eat(str: string): void;
}

class Dog implements animial {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  eat() {
    console.log(this.name + "在吃东西");
  }
}
var dog = new Dog("小丑");
dog.eat(); //小丑在吃东西
```

### 类静态部分与实例部分的区别

当你操作类和接口的时候，你要知道类是具有两个类型的：静态部分的类型和实例的类型。你会注意到，当你用构造器签名去定义一个接口并试图定义一个类去实现这个接口时会得到一个错误：

```typescript
interface ClockConstructor {
  new (hour: number, minute: number);
}

class Clock implements ClockConstructor {
  currentTime: Date;
  constructor(h: number, m: number) {}
}
```

这里因为当一个类实现了一个接口时，只对其实例部分进行类型检查。 constructor 存在于类的静态部分，所以不在检查的范围内。

因此，我们应该直接操作类的静态部分。 看下面的例子，我们定义了两个接口， `ClockConstructor` 为构造函数所用和 `ClockInterface` 为实例方法所用。 为了方便我们定义一个构造函数 `createClock` ，它用传入的类型创建实例。

```typescript
interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface;
}
interface ClockInterface {
  tick();
}

function createClock(
  ctor: ClockConstructor,
  hour: number,
  minute: number
): ClockInterface {
  return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log("beep beep");
  }
}
class AnalogClock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log("tick tock");
  }
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);
```

因为 `createClock` 的第一个参数是 `ClockConstructor` 类型，在 `createClock(AnalogClock, 7, 32)` 里，会检查 `AnalogClock` 是否符合构造函数签名。

## 继承接口

和类一样，接口也可以相互继承。 这让我们能够从一个接口里复制成员到另一个接口里，**可以更灵活地将接口分割到可重用的模块里**。

```typescript
interface Shape {
  color: string;
}

interface Square extends Shape {
  sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
```

一个接口可以继承多个接口，创建出多个接口的合成接口。

```typescript
interface Shape {
  color: string;
}

interface PenStroke {
  penWidth: number;
}

interface Square extends Shape, PenStroke {
  sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;
```

### 实例

```jsx
interface IHandledRecord
  extends Omit<IMonthlyRequirementDevelopTrendItem, "data">,
    IRequirementDevelopDetailListItem {}
```

## 混合类型

接口能够描述 JavaScript 里丰富的类型。 因为 JavaScript 其动态灵活的特点，有时你会希望一个对象可以同时具有上面提到的多种类型。

一个例子就是，一个对象可以同时做为函数和对象使用，并带有额外的属性。

```typescript
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function getCounter(): Counter {
  const counter = <Counter>function (start: number): string {
    return "Hello world";
  };
  counter.interval = 123;
  counter.reset = function (): void {};
  return counter;
}

const c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

## 接口继承类

当接口继承了一个类类型时，它会继承类的成员但不包括其实现。 就好像接口声明了所有类中存在的成员，但并没有提供具体实现一样。 接口同样会继承到类的 private 和 protected 成员。 这意味着当你创建了一个接口继承了一个拥有私有或受保护的成员的类时，这个接口类型只能被这个类或其子类所实现（implement）。

当你有一个庞大的继承结构时这很有用，但要指出的是你的代码只在子类拥有特定属性时起作用。 这个子类除了继承至基类外与基类没有任何关系。 例：

```typescript
class Control {
  private state: any;
}

interface SelectableControl extends Control {
  select(): void;
}

class Button extends Control implements SelectableControl {
  select() {}
}

class TextBox extends Control {
  select() {}
}

// 错误：“Image”类型缺少“state”属性。
class Image implements SelectableControl {
  select() {}
}

class Location {}
```

在上面的例子里，`SelectableControl` 包含了 `Control` 的所有成员，包括私有成员 `state` 。 因为 `state` 是私有成员，所以只能够是 `Control` 的子类们才能实现 `SelectableControl` 接口。 因为只有 `Control` 的子类才能够拥有一个声明于 `Control` 的私有成员 `state` ，这对私有成员的兼容性是必需的。

在 `Control` 类内部，是允许通过 `SelectableControl` 的实例来访问私有成员 `state` 的。 实际上， `SelectableControl` 接口和拥有 `select` 方法的 `Control` 类是一样的。 `Button` 和 `TextBox` 类是 `SelectableControl` 的子类（因为它们都继承自 `Control` 并有 `select` 方法），但 `Image` 和 `Location` 类并不是这样的。

## Tip

### 使用接口的某个属性类型

```ts
/** 任务模板-基础类型 */
interface ITaskTemplateItemType {
  stage: {
    name: string;
    taskCollections: Array<ITaskTemplateItemType["collection"]> | null;
  };

  collection: {
    name: string;
    tasks: Array<ITaskTemplateItemType["task"]> | null;
  };

  task: {
    dependencies: string[] | null;
    name: string | null;
    owner: string | null;
    ownerInfo: IStaff | null;
    planHours: number | null;
    remark: string | null;
    workDay: number | null;
  };
}

/** 任务模板-模板数据 */
interface ITaskTemplate {
  id: string | null;
  templateName: string | null;
  projectId: string | null;
  stages: Array<ITaskTemplateItemType["stage"]> | null;
  creator: string | null;
}
```
