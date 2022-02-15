# 模块
> **关于术语的一点说明**: 请务必注意一点，TypeScript 1.5里术语名已经发生了变化。 “内部模块”现在称做“命名空间”。 “外部模块”现在则简称为“模块”，这是为了与 ECMAScript 2015里的术语保持一致，(也就是说 `module X {` 相当于现在推荐的写法 `namespace X {` )。

## 介绍
- 背景
  
  从ECMAScript 2015开始，JavaScript引入了模块的概念。TypeScript也沿用这个概念。

- 特点
  - 模块在其自身的作用域里执行，而不是在全局作用域里
  
    这意味着定义在一个模块里的变量，函数，类等等在模块外部是不可见的，除非你明确地使用`export` 形式之一导出它们。 相反，如果想使用其它模块导出的变量，函数，类，接口等的时候，你必须要导入它们，可以使用 `import` 形式之一。

  - 模块是自声明的

    两个模块之间的关系是通过在文件级别上使用imports和exports建立的。

  - 模块使用模块加载器去导入其它的模块

    在运行时，**模块加载器的作用是在执行此模块代码前去查找并执行这个模块的所有依赖**。 大家最熟知的JavaScript模块加载器是**服务于Node.js的 CommonJS和服务于Web应用的Require.js**。

## 导出

### 导出声明
任何声明（比如变量，函数，类，类型别名或接口）都能够通过添加export关键字来导出。
```ts
export interface StringValidator {
    isAcceptable(s: string): boolean;
}
```


```ts
export const numberRegexp = /^[0-9]+$/;

export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}
```

### 导出语句
作用
  
- 导出语句很便利，因为我们可能需要对导出的部分重命名，
```ts
class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}
export { ZipCodeValidator };
export { ZipCodeValidator as mainValidator };
```
### 重新导出
我们经常会去扩展其它模块，并且只导出那个模块的部分内容。 重新导出功能并不会在当前模块导入那个模块或定义一个新的局部变量。
```ts
export class ParseIntBasedZipCodeValidator {
    isAcceptable(s: string) {
        return s.length === 5 && parseInt(s).toString() === s;
    }
}

// 导出原先的验证器但做了重命名
export {ZipCodeValidator as RegExpBasedZipCodeValidator} from "./ZipCodeValidator";
```

或者一个模块可以包裹多个模块，并把他们导出的内容联合在一起通过语法：`export * from "module"`。
```ts
export * from "./StringValidator"; // exports interface StringValidator
export * from "./LettersOnlyValidator"; // exports class LettersOnlyValidator
export * from "./ZipCodeValidator";  // exports class ZipCodeValidator
```


## 导人
可以使用以下 import形式之一来导入其它模块中的导出内容。

### 导入一个模块中的某个导出内容

```ts
import { ZipCodeValidator } from "./ZipCodeValidator";

let myValidator = new ZipCodeValidator();
```
可以对导入内容重命名
```ts
import { ZipCodeValidator as ZCV } from "./ZipCodeValidator";
let myValidator = new ZCV();
```
### 将整个模块导入到一个变量，并通过它来访问模块的导出部分
```ts
import * as validator from "./ZipCodeValidator";
let myValidator = new validator.ZipCodeValidator();
```

### 具有副作用的导入模块
尽管不推荐这么做，一些模块会设置一些全局状态供其它模块使用。 这些模块可能没有任何的导出或用户根本就不关注它的导出。 使用下面的方法来导入这类模块：
```ts
import "./my-module.js";
```

## 默认导出
**特点**：
  - 每个模块都可以有一个default导出。
  - 默认导出使用 default关键字标记；并且一个模块只能够有一个default导出。
  - 需要使用一种特殊的导入形式来导入 default导出。

default导出十分便利。 比如，像JQuery这样的类库可能有一个默认导出 jQuery 或 $。


```ts
// JQuery.d.ts
declare let $: JQuery;
export default $;

// App.ts
import $ from "JQuery";

$("button.continue").html( "Next Step..." );
```

类和函数声明可以直接被标记为默认导出。 标记为默认导出的类和函数的名字是可以省略的。
```ts
// ZipCodeValidator.ts
export default class ZipCodeValidator {
    static numberRegexp = /^[0-9]+$/;
    isAcceptable(s: string) {
        return s.length === 5 && ZipCodeValidator.numberRegexp.test(s);
    }
}

// Test.ts
import validator from "./ZipCodeValidator";

let myValidator = new validator();
```

或者

```ts
// StaticZipCodeValidator.ts
const numberRegexp = /^[0-9]+$/;

export default function (s: string) {
    return s.length === 5 && numberRegexp.test(s);
}

// Test.ts
import validate from "./StaticZipCodeValidator";

let strings = ["Hello", "98052", "101"];

// Use function validate
strings.forEach(s => {
  console.log(`"${s}" ${validate(s) ? " matches" : " does not match"}`);
});
```

default导出也可以是一个值

```ts
// OneTwoThree.ts
export default "123";

// Log.ts
import num from "./OneTwoThree";

console.log(num); // "123"
```

## export = 和 import = require()
- **背景**

  CommonJS和AMD的环境里都有一个exports变量，这个变量包含了一个模块的所有导出内容。

  CommonJS和AMD的exports都可以被赋值为一个对象, 这种情况下其作用就类似于 es6 语法里的默认导出，即 export default语法了。虽然作用相似，但是 export default 语法并不能兼容CommonJS和AMD的exports。

  为了支持CommonJS和AMD的exports, TypeScript提供了 `export =` 语法。

- **定义**

  `export =` 语法定义一个模块的导出对象。 这里的对象一词指的是类，接口，命名空间，函数或枚举。

- **特点**

  若使用 `export =` 导出一个模块，则必须使用TypeScript的特定语法 `import module = require("module")` 来导入此模块。

```ts
// ZipCodeValidator.ts
let numberRegexp = /^[0-9]+$/;
class ZipCodeValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}
export = ZipCodeValidator;




// Test.ts
import zip = require("./ZipCodeValidator");

// Some samples to try
let strings = ["Hello", "98052", "101"];

// Validators to use
let validator = new zip();

// Show whether each string passed each validator
strings.forEach(s => {
  console.log(`"${ s }" - ${ validator.isAcceptable(s) ? "matches" : "does not match" }`);
});
```

## 生成模块代码
## 可选的模块加载和其它高级加载场景







