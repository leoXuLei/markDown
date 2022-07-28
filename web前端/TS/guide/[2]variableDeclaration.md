# 变量声明

## 变量声明

let 和 const 是 JavaScript 里相对较新的变量声明方式。像我们之前提到过的，let 在很多方面与 var 是相似的，但是可以帮助大家避免在 JavaScript 里常见一些问题。 const 是对 let 的一个增强，它能阻止对一个变量再次赋值。

如果你已经对 var 声明的怪异之处了如指掌，那么你可以轻松地略过这节。

## var 声明

在函数内部定义变量：

```typescript
function f() {
  var message = "Hello, world!";

  return message;
}
```

并且我们也可以在其它函数内部访问相同的变量。

```typescript
function f() {
  var a = 10;
  return function g() {
    var b = a + 1;
    return b;
  };
}

var g = f();
g(); // returns 11;
```

上面的例子里，g 可以获取到 f 函数里定义的 a 变量。 每当 g 被调用时，它都可以访问到 f 里的 a 变量。 即使当 g 在 f 已经执行完后才被调用，它仍然可以访问及修改 a。

```typescript
function f() {
  var a = 1;

  a = 2;
  var b = g();
  a = 3;

  return b;

  function g() {
    return a;
  }
}

f(); // returns 2
```

## 作用域规则

对于熟悉其它语言的人来说，var 声明有些奇怪的作用域规则。 看下面的例子：

```typescript
function f(shouldInitialize: boolean) {
  if (shouldInitialize) {
    var x = 10;
  }

  return x;
}
f(true); // returns '10'
f(false); // returns 'undefined'
```

变量 x 是定义在 if 语句里面，但是却可以在语句的外面访问它。这是因为**var 声明可以在包含它的函数，模块，命名空间或全局作用域内部任何位置被访问（我们后面会详细介绍）**，包含它的代码块对此没有什么影响。 有些人称此为**var 作用域或函数作用域**。 函数参数也使用函数作用域。

这些作用域规则可能会引发一些错误。 其中之一就是，多次声明同一个变量并不会报错：

```typescript
function sumMatrix(matrix: number[][]) {
  var sum = 0;
  for (var i = 0; i < matrix.length; i++) {
    var currentRow = matrix[i];
    for (var i = 0; i < currentRow.length; i++) {
      sum += currentRow[i];
    }
  }

  return sum;
}
```

### 捕获变量怪异之处

```typescript
for (var i = 0; i < 10; i++) {
  setTimeout(function () {
    console.log(i);
  }, 100 * i);
}
// 10 10 10 10 10 10 10 10 10 10
```

> 我们传给 setTimeout 的每一个函数表达式实际上都引用了相同作用域里的同一个 i。

setTimeout 在若干毫秒后执行一个函数，并且是在 for 循环结束后。for 循环结束后，i 的值为 10。 所以当函数被调用的时候，它会打印出 10！

一个通常的解决方法是使用立即执行的函数表达式（IIFE）来捕获每次迭代时 i 的值：

```typescript
for (var i = 0; i < 10; i++) {
  // capture the current state of 'i'
  // by invoking a function with its current value
  (function (i) {
    setTimeout(function () {
      console.log(i);
    }, 100 * i);
  })(i);
}
```

这种奇怪的形式我们已经司空见惯了。 参数 i 会覆盖 for 循环里的 i，但是因为我们起了同样的名字，所以我们不用怎么改 for 循环体里的代码。

## let 声明

现在你已经知道了 var 存在一些问题，这恰好说明了为什么用 let 语句来声明变量。 除了名字不同外，let 与 var 的写法一致。

主要的区别不在语法上，而是语义，我们接下来会深入研究。

### 块作用域

当用 let 声明一个变量，它使用的是**词法作用域或块作用域**。**不同于使用 var 声明的变量那样可以在包含它们的函数外访问，块作用域变量在包含它们的块或 for 循环之外是不能访问的**。

```typescript
function f(input: boolean) {
  let a = 100;

  if (input) {
    // Still okay to reference 'a'
    let b = a + 1;
    return b;
  }

  // Error: 'b' doesn't exist here
  return b;
}
```

这里我们定义了 2 个变量 a 和 b。a 的作用域是 f 函数体内，而 b 的作用域是 if 语句块里。

在 catch 语句里声明的变量也具有同样的作用域规则。

```typescript
try {
  throw "oh no!";
} catch (e) {
  console.log("Oh well.");
}

// Error: 'e' doesn't exist here
console.log(e);
```

拥有块级作用域的变量的另一个特点是，它们**不能在被声明之前读或写**。 虽然这些变量始终“存在”于它们的作用域里，但在直到声明它的代码之前的区域都属于`暂时性死区`。 它只是用来说明我们不能在 let 语句之前访问它们，幸运的是 TypeScript 可以告诉我们这些信息。

```typescript
a++; // illegal to use 'a' before it's declared;
let a;
```

注意一点，我们仍然可以在一个拥有块作用域变量被声明前获取它。 只是我们不能在变量声明前去调用那个函数。 如果生成代码目标为 ES2015，现代的运行时会抛出一个错误；然而，现今 TypeScript 是不会报错的。

```typescript
function foo() {
  // okay to capture 'a'
  return a;
}

// 不能在'a'被声明前调用'foo'
// 运行时应该抛出错误
foo();

let a;
```

[暂时性死区](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let)

### 重定义及屏蔽

我们提过使用 var 声明时，它不在乎你声明多少次；你只会得到 1 个。

```typescript
function f(x) {
  var x;
  var x;

  if (true) {
    var x;
  }
}
```

在上面的例子里，所有 x 的声明实际上都引用一个相同的 x，并且这是完全有效的代码。 这经常会成为 bug 的来源。 好的是，let 声明就不会这么宽松了。

```typescript
let x = 10;
let x = 20; // 错误，不能在1个作用域里多次声明`x`
```

并不是要求两个均是块级作用域的声明 TypeScript 才会给出一个错误的警告。

```typescript
function f(x) {
  let x = 100; // error: interferes with parameter declaration
}

function g() {
  let x = 100;
  var x = 100; // error: can't have both declarations of 'x'
}
```

并不是说块级作用域变量不能用函数作用域变量来声明。 而是块级作用域变量需要在明显不同的块里声明。

```typescript
function f(condition, x) {
  if (condition) {
    let x = 100;
    return x;
  }

  return x;
}

f(false, 0); // returns 0
f(true, 0); // returns 100
```

**在一个嵌套作用域里引入一个新名字的行为称做屏蔽。 它是一把双刃剑，它可能会不小心地引入新问题，同时也可能会解决一些错误**。 例如，假设我们现在用 let 重写之前的 sumMatrix 函数。

```typescript
function sumMatrix(matrix: number[][]) {
  let sum = 0;
  for (let i = 0; i < matrix.length; i++) {
    var currentRow = matrix[i];
    for (let i = 0; i < currentRow.length; i++) {
      sum += currentRow[i];
    }
  }

  return sum;
}
```

这个版本的循环能得到正确的结果，因为内层循环的 i 可以屏蔽掉外层循环的 i。

通常来讲应该避免使用屏蔽，因为我们需要写出清晰的代码。 同时也有些场景适合利用它，你需要好好打算一下。

### 块级作用域变量的获取

在我们最初谈及获取用 var 声明的变量时，我们简略地探究了一下在获取到了变量之后它的行为是怎样的。 直观地讲，**每次进入一个作用域时，它创建了一个变量的环境。 就算作用域内代码已经执行完毕，这个环境与其捕获的变量依然存在**。

```typescript
function theCityThatAlwaysSleeps() {
  let getCity;

  if (true) {
    let city = "Seattle";
    getCity = function () {
      return city;
    };
  }

  return getCity();
}
```

因为我们已经在 city 的环境里获取到了 city，所以就算 if 语句执行结束后我们仍然可以访问它。

回想一下前面 setTimeout 的例子，我们最后需要使用立即执行的函数表达式来获取每次 for 循环迭代里的状态。实际上，我们做的是为获取到的变量创建了一个新的变量环境。这样做挺痛苦的，但是幸运的是，你不必在 TypeScript 里这样做了。

当 let 声明出现在循环体里时拥有完全不同的行为。不仅是在循环里引入了一个新的变量环境，而是**针对每次迭代都会创建这样一个新作用域**。 这就是我们在使用立即执行的函数表达式时做的事，所以在 setTimeout 例子里我们仅使用 let 声明就可以了。

```typescript
for (let i = 0; i < 10; i++) {
  setTimeout(function () {
    console.log(i);
  }, 100 * i);
}
// 0 1 2 3 4 5 6 7 8 9
```

## const 声明

const 声明是声明变量的另一种方式。

```typescript
const numLivesForCat = 9;
```

它们与 let 声明相似，但是就像它的名字所表达的，它们被赋值后不能再改变。 换句话说，它们**拥有与 let 相同的作用域规则，但是不能对它们重新赋值。**

这很好理解，它们引用的值是不可变的。

```typescript
const numLivesForCat = 9;
const kitty = {
  name: "Aurora",
  numLives: numLivesForCat,
};

// Error
kitty = {
  name: "Danielle",
  numLives: numLivesForCat,
};

// all "okay"
kitty.name = "Rory";
kitty.name = "Kitty";
kitty.name = "Cat";
kitty.numLives--;
```

除非你使用特殊的方法去避免，实际上 const 变量的内部状态是可修改的。 幸运的是，TypeScript 允许你将对象的成员设置成只读的。 接口一章有详细说明。

## 解构

```jsx
const {
  minWidth = -Infinity,
  maxWidth = Infinity,
  width: defaultWidth = 0,
  onChange,
  onDragStart,
  onDragEnd,
} = props;
```

[解构](https://www.tslang.cn/docs/handbook/variable-declarations.html)

### 函数声明

解构也能用于函数声明。

```typescript
type C = { a: string; b?: number };
function f({ a, b }: C): void {
  // ...
}
```

但是，通常情况下更多的是指定默认值，解构默认值有些棘手。首先，你需要在默认值之前设置其格式。

```typescript
function f({ a = "", b = 0 } = {}): void {
  // ...
}
f();
```

其次，你需要知道在解构属性上给予一个默认或可选的属性用来替换主初始化列表。要知道 C 的定义有一个 b 可选属性：

```typescript
function f({ a, b = 0 } = { a: "" }): void {
  // ...
}
f({ a: "yes" }); // ok, default b = 0
f(); // ok, default to {a: ""}, which then defaults b = 0
f({}); // error, 'a' is required if you supply an argument
```

要小心使用解构。从前面的例子可以看出，就算是最简单的解构表达式也是难以理解的。 尤其当存在深层嵌套解构的时候，就算这时没有堆叠在一起的重命名，默认值和类型注解，也是令人难以理解的。 解构表达式要尽量保持小而简单。 你自己也可以直接使用解构将会生成的赋值表达式。
