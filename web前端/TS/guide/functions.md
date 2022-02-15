# 函数

## 介绍

函数是 JavaScript 应用程序的基础。 它帮助你实现**抽象层，模拟类，信息隐藏和模块**。 在 TypeScript 里，虽然已经支持类，命名空间和模块，但函数仍然是主要的定义行为的地方。 TypeScript 为 JavaScript 函数添加了额外的功能，让我们可以更容易地使用。

## 函数类型

### 为函数定义类型

```ts
function add(x: number, y: number): number {
  return x + y;
}

let myAdd = function (x: number, y: number): number {
  return x + y;
};
```

我们可以给每个参数添加类型之后再为函数本身添加返回值类型。 **TS 能够根据返回语句自动推断出返回值类型，因此我们通常省略它**。

### 书写完整函数类型

```ts
let myAdd: (x: number, y: number) => number = function (
  x: number,
  y: number
): number {
  return x + y;
};
```

==函数类型包含两部分：参数类型和返回值类型==。 当写出完整函数类型的时候，这两部分都是需要的。 我们以参数列表的形式写出参数类型，为每个参数指定一个名字和类型。 这个名字只是为了增加可读性。 我们也可以这么写：

```ts
let myAdd: (baseValue: number, increment: number) => number = function (
  x: number,
  y: number
): number {
  return x + y;
};
```

**函数的参数名不需要与接口里定义的名字相匹配， 只要对应位置上的参数类型是兼容的就可以**。

第二部分是返回值类型。 对于返回值，我们在函数和返回值类型之前使用( =>)符号，使之清晰明了。 如之前提到的，返回值类型是函数类型的必要部分，如果函数没有返回任何值，你也必须指定返回值类型为 void 而不能留空。

函数的类型只是由参数类型和返回值组成的。 函数中使用的捕获变量不会体现在类型里。 实际上，这些变量是函数的隐藏状态并不是组成 API 的一部分。

### 推断类型

在赋值语句的一边指定了类型但是另一边没有类型的话，TS 编译器会自动识别出类型：

```ts
// myAdd has the full function type
let myAdd = function (x: number, y: number): number {
  return x + y;
};

// The parameters `x` and `y` have the type number
let myAdd: (baseValue: number, increment: number) => number = function (x, y) {
  return x + y;
};
```

这叫做“按上下文归类”，是类型推论的一种。 它帮助我们更好地为程序指定类型。

## 可选参数和默认参数

传递给一个函数的参数个数必须与函数期望的参数个数一致。

```ts
function buildName(firstName: string, lastName: string) {
  return firstName + " " + lastName;
}

let result1 = buildName("Bob"); // error, too few parameters
let result2 = buildName("Bob", "Adams", "Sr."); // error, too many parameters
let result3 = buildName("Bob", "Adams"); // ah, just right
```

JS 里，每个参数都是可选的，可传可不传。 没传参的时候，它的值就是 undefined。

**可选参数**：`参数名?: type`，**可选参数必须跟在必须参数后面**。

```ts
function buildName(firstName: string, lastName?: string) {
  if (lastName) return firstName + " " + lastName;
  else return firstName;
}

let result1 = buildName("Bob"); // works correctly now
let result2 = buildName("Bob", "Adams", "Sr."); // error, too many parameters
let result3 = buildName("Bob", "Adams"); // ah, just right
```

在 TS 里，我们也可以**为参数提供一个默认值当用户没有传递这个参数或传递的值是 undefined 时**。 它们叫做有默认初始化值的参数。 让我们修改上例，把 last name 的默认值设置为"Smith"。

```ts
function buildName(firstName: string, lastName = "Smith") {
  return firstName + " " + lastName;
}

let result1 = buildName("Bob"); // works correctly now, returns "Bob Smith"
let result2 = buildName("Bob", undefined); // still works, also returns "Bob Smith"
let result3 = buildName("Bob", "Adams", "Sr."); // error, too many parameters
let result4 = buildName("Bob", "Adams"); // ah, just right
```

**在所有必须参数后面的带默认初始化的参数都是可选的，与可选参数一样，在调用函数的时候可以省略**。 也就是说可选参数与末尾的默认参数共享参数类型。

```ts
function buildName(firstName: string, lastName?: string) {
  // ...
}
```

和

```ts
function buildName(firstName: string, lastName = "Smith") {
  // ...
}
```

共享同样的类型 `(firstName: string, lastName?: string) => string` 。 默认参数的默认值消失了，只保留了它是一个可选参数的信息。

==与普通可选参数不同的是，带默认值的参数不需要放在必须参数的后面==。 如果带默认值的参数出现在必须参数前面，用户必须明确的传入 undefined 值来获得默认值。 例如，我们重写最后一个例子，让 firstName 是带默认值的参数：

```ts
function buildName(firstName = "Will", lastName: string) {
  return firstName + " " + lastName;
}

let result1 = buildName("Bob"); // error, too few parameters
let result2 = buildName("Bob", "Adams", "Sr."); // error, too many parameters
let result3 = buildName("Bob", "Adams"); // okay and returns "Bob Adams"
let result4 = buildName(undefined, "Adams"); // okay and returns "Will Adams"
```

## 剩余参数

必要参数，默认参数和可选参数有个共同点：它们表示某一个参数。 有时，==你想同时操作多个参数，或者你并不知道会有多少参数传递进来==。 在 JS 里，你可以使用 arguments 来访问所有传入的参数。

在 TypeScript 里，你可以把所有参数收集到一个变量里：

```ts
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}
let employeeName = buildName("Joseph", "Samuel", "Lucas", "MacKinzie");
```

剩余参数会被当做个数不限的可选参数。 可以一个都没有，同样也可以有任意个。 编译器创建参数数组，名字是你在省略号（ ...）后面给定的名字，你可以在函数体内使用这个数组。

这个省略号也会在带有剩余参数的函数类型定义上使用到：

```ts
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}

let buildNameFun: (fname: string, ...rest: string[]) => string = buildName;
```

## this 和箭头函数

## this 参数

## 重载

## Tips

- 函数类型：
  - 定义函数类型
  ```ts
  // 完整函数类型
  let myAdd: (x: number, y: number) => number = function (
    x: number,
    y: number
  ): number {
    return x + y;
  };
  // 推断函数类型
  let myAdd: (baseValue: number, increment: number) => number = function (
    x,
    y
  ) {
    return x + y;
  };
  ```
  - 函数的参数名不需要与接口里定义的名字相匹配， 只要对应位置上的参数类型是兼容的就可以
- 可选参数：`(..., 可选参数名?: type)` ，可选参数必须跟在必须参数后面。
- 默认参数：`(参数名 = 默认值)` ，为参数提供一个默认值当用户没有传递这个参数或传递的值是 undefined 时。
- 剩余参数：把多个参数收集到一个变量里
  ```ts
  interface BuildNameFun {
    (firstName: string, ...rest: string[]): string;
  }
  ```

## 实例

### 一般函数声明

```typescript
// 第一种形式
let c: Function;
c = function (): void {
  console.log("It work");
};

// 第二种形式
function test(): Function {
  return function (): void {
    console.log("it work");
  };
}

let a: Function = test();
a();

// 第三种形式，箭头函数
let d: (para: string) => string;
d = function (param: string): string {
  return param;
};

// 第四种形式，类型别名，箭头函数
type e = (para: string) => string;
const f: e = function (pass: string): string {
  return pass;
};

// 第五种形式，接口
interface g {
  (para: string): string;
}
const h: g = function (pass: string): string {
  return pass;
};
```

### 箭头函数声明

```typescript
let myAdd: (x: number, y: number) => number = function (
  x: number,
  y: number
): number {
  return x + y;
};
```

一个简单的变量声明定义，完整格式如下：

```typescript
let x: number = 10;
// 其上的 number 部分相当于上面函数声明的 (x:number, y:number) => number，这一部分即是类型（或函数类型），只是一种定义
```

同样，一个变量的声明定义也可以是这样：

```typescript
let x = 10;
```

这一点自然是归咎于 TS 自动推导能力了。因此，上面函数声明也可以简化成：

```typescript
const myAdd = (x: number, y: number) => x + y;
```

= 的前部分一样省略了，交由 ts 自动推导；而后，就是一个实际的匿名函数写法了。

参考资料：

- [ts 定义返回函数类型](https://blog.csdn.net/youngsailor/article/details/94284412)

### 实例

```jsx
export const handledSelectedFilesInfo = (list: IResource[]): string[] => {
  const directoryCount =
    list?.filter((item) => item?.directory === true)?.length || 0;
  const fileCount = (list?.length || 0) - directoryCount;
  const fileInfo: string[] = [];

  if (fileCount) {
    fileInfo.push(`${fileCount} 个文件`);
  }

  if (directoryCount) {
    fileInfo.push(`${directoryCount} 个文件夹`);
  }
  return fileInfo;
};
```
