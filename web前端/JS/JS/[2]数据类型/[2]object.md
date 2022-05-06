# 对象

## 概述

### 生成方法

对象（object）是 JavaScript 语言的核心概念，也是最重要的数据类型。

什么是对象？简单说，**`对象就是一组“键值对”（key-value）的集合，是一种无序的复合数据集合`**。

```javascript
var obj = {
  foo: "Hello",
  bar: "World",
};
```

上面代码中，大括号就定义了一个对象，它被赋值给变量`obj`，所以变量`obj`就指向一个对象。该对象内部包含两个键值对（又称为两个“成员”），第一个键值对是`foo: 'Hello'`，其中`foo`是“键名”（成员的名称），字符串`Hello`是“键值”（成员的值）。键名与键值之间用冒号分隔。第二个键值对是`bar: 'World'`，`bar`是键名，字符串`World`是键值。两个键值对之间用逗号分隔。

### 键名

- 对象的所有键名都是字符串（ES6 又引入了 Symbol 值也可以作为键名），所以加不加引号都可以
- 如果键名是数值，会被自动转为字符串。
- 如果键名不符合标识名的条件（比如第一个字符为数字，或者含有空格或运算符），且也不是数字，则必须加上引号，否则会报错。

```javascript
var obj = {
  'foo': 'Hello',
  'bar': 'World'
};


var obj = {
  1: 'a',
  3.2: 'b',
  1e2: true,
  1e-2: true,
  .234: true,
  0xFF: true
};
// 对象`obj`的所有键名虽然看上去像数值，实际上都被自动转成了字符串。
obj
// Object {
//   1: "a",
//   3.2: "b",
//   100: true,
//   0.01: true,
//   0.234: true,
//   255: true
// }

obj['100'] // true


// 报错
var obj = {
  1p: 'Hello World'
};

// 不报错
var obj = {
  '1p': 'Hello World',
  'h w': 'Hello World',
  'p+q': 'Hello World'
};
```

### 对象的引用

- 如果两个变量指向同一个对象，那么它们都是这个对象的引用，也就是说指向同一个内存地址。修改其中一个变量，会影响到其他所有变量。

```javascript
var o1 = {};
var o2 = o1;

o1.a = 1;
o2.a; // 1

o2.b = 2;
o1.b; // 2

// 如果取消某一个变量对于原对象的引用，不会影响到另一个变量。
var o1 = {};
var o2 = o1;

o1 = 1;
o2; // {}
```

- 如果两个变量指向同一个原始类型的值。变量这时都是值的拷贝。不是指向同一个内存地址。修改互不影响。

```javascript
var x = 1;
var y = x;

x = 2;
y; // 1
```

### 表达式还是语句？

## 属性的操作

### 属性的读取：读

读取对象的属性，有两种方法，一种是使用点运算符，还有一种是使用方括号运算符。

```javascript
var obj = {
  p: "Hello World",
};

obj.p; // "Hello World"
obj["p"]; // "Hello World"
obj[p]; // Uncaught ReferenceError: p is not defined
```

规则如下：

- 如果使用方括号运算符，键名必须放在引号里面，否则会被当作变量处理。

```javascript
var foo = "bar";

var obj = {
  foo: 1,
  bar: 2,
};

obj.foo; // 1
obj[foo]; // 2
```

- 方括号运算符内部还可以使用表达式。

```javascript
obj["hello" + " world"];
obj[3 + 3];
```

- 数字键可以不加引号，因为会自动转成字符串。

```javascript
var obj = {
  0.7: "Hello World",
};

obj["0.7"]; // "Hello World"
obj[0.7]; // "Hello World"
```

- 数值键名不能使用点运算符（因为会被当成小数点），只能使用方括号运算符。

```javascript
var obj = {
  123: 'hello world'
};

obj.123 // 报错
obj[123] // "hello world"
```

### 属性的赋值：增

点运算符和方括号运算符，不仅可以用来读取值，还可以用来赋值。

```javascript
const test = "name";
const obj1 = { test: "lisi" }; // 属性名是 "test" { test: "lisi"}
const obj2 = { [test]: "lisi" }; // 属性名是 "name" { name: "lisi" }

// 不加[]：属性名会自动变成字符串
// 加[]：则会当做变量求值，值如果不是字符串，会转成字符串
```

JS 允许属性的“后绑定”，也就是说，你可以在任意时刻新增属性，没必要在定义对象的时候，就定义好属性。

```javascript
var obj = { p: 1 };

// 等价于

var obj = {};
obj.p = 1;
```

### 属性的查看

查看一个对象本身的所有属性，可以使用`Object.keys`方法。

```javascript
var obj = {
  key1: 1,
  key2: 2,
};

Object.keys(obj);
// ['key1', 'key2']
```

### 属性的删除：delete 命令

> `delete`命令：用于删除对象的属性，删除成功后返回`true`。

```javascript
var obj = { p: 1 };
Object.keys(obj); // ["p"]

delete obj.p; // true
obj.p; // undefined
Object.keys(obj); // []
```

规则如下：

- 删除一个不存在的属性，`delete`不报错，而且返回`true`。因此，不能根据`delete`命令的结果，认定某个属性是存在的。

```javascript
var obj = {};
delete obj.p; // true
```

- 只有一种情况，`delete`命令会返回`false`，那就是该属性存在，且不得删除。

```javascript
var obj = Object.defineProperty({}, "p", {
  value: 123,
  configurable: false,
});

obj.p; // 123
delete obj.p; // false
```

- `delete`命令只能删除对象本身的属性，无法删除继承的属性（关于继承参见《面向对象编程》章节）。

```javascript
var obj = {};
delete obj.toString; // true
obj.toString; // function toString() { [native code] }
```

### 属性是否存在：in 运算符

> 作用：用于检查对象是否包含某个属性（注意，检查的是键名，不是键值），如果包含就返回`true`，否则返回`false`。
> 语法：左边是一个字符串，表示属性名，右边是一个对象。

```javascript
var obj = { p: 1 };
"p" in obj; // true
"toString" in obj; // true
```

`in`运算符的一个问题是，它不能识别哪些属性是对象自身的，哪些属性是继承的。就像上面代码中，对象`obj`本身并没有`toString`属性，但是`in`运算符会返回`true`，因为这个属性是继承的。

这时，可以使用对象的`hasOwnProperty`方法判断一下，**是否为对象自身的属性**。

```javascript
var obj = {};
if ("toString" in obj) {
  console.log(obj.hasOwnProperty("toString")); // false
}
```

### 属性的遍历：for...in 循环

`for...in`循环用来遍历一个对象的全部属性。

```javascript
var obj = { a: 1, b: 2, c: 3 };

for (var i in obj) {
  console.log("键名：", i);
  console.log("键值：", obj[i]);
}
// 键名： a
// 键值： 1
// 键名： b
// 键值： 2
// 键名： c
// 键值： 3
```

`for...in`循环有两个使用注意点。

- 它遍历的是对象所有可遍历（enumerable）的属性，会跳过不可遍历的属性。
- 它不仅遍历对象自身的属性，还遍历继承的属性。

举例来说，对象都继承了`toString`属性，但是`for...in`循环不会遍历到这个属性。

```javascript
var obj = {};

// toString 属性是存在的
obj.toString; // toString() { [native code] }

for (var p in obj) {
  console.log(p);
} // 没有任何输出
```

如果继承的属性是可遍历的，那么就会被`for...in`循环遍历到。但是，一般情况下，都是只想遍历对象自身的属性，所以使用`for...in`的时候，应该结合使用`hasOwnProperty`方法，在循环内部判断一下，某个属性是否为对象自身的属性。

```javascript
var person = { name: "老张" };

for (var key in person) {
  if (person.hasOwnProperty(key)) {
    console.log(key);
  }
}
// name
```

## with 语句

`with`语句的格式如下：

```javascript
with (对象) {
  语句;
}
```

它的作用是操作同一个对象的多个属性时，提供一些书写的方便。

```javascript
// 例一
var obj = {
  p1: 1,
  p2: 2,
};
with (obj) {
  p1 = 4;
  p2 = 5;
}
// 等同于
obj.p1 = 4;
obj.p2 = 5;

// 例二
with (document.links[0]) {
  console.log(href);
  console.log(title);
  console.log(style);
}
// 等同于
console.log(document.links[0].href);
console.log(document.links[0].title);
console.log(document.links[0].style);
```

# Tips

## 判断对象是否包含某个属性

[参考资料](https://blog.csdn.net/z327171559/article/details/82152603)

- `!==`
  判断不全面：属性的值为 undefined 的时候，使用 `!==` 就失效了。

  不存在属性 和 存在属性但是属性值为 undefined 都返回 false。

```js
let obj = { x: 1, z: undefined };
obj.x !== undefined; // true 有x属性
obj.y !== undefined; // false 无y属性
obj.z !== undefined; // false 有z属性且值为undefined
obj.toString !== undefined; // true 从Object继承toString属性
```

- `in`
  in 可以区分存在但值为 undefined 的属性。

```js
let obj = { x: undefined };
obj.x !== undefined; // false
"x" in obj; // true
```

- hasOwnProperty()
  in 运算符和 hasOwnProperty() 的区别就在于 in 运算符可以判断来自继承的属性，而 hasOwnProperty() 不能

```javascript
var obj = {};
if ("toString" in obj) {
  console.log(obj.hasOwnProperty("toString")); // false
}
```

- propertyIsEnumerable()
  propertyIsEnumerable() 是 hasOwnProperty() 的增强版，这个方法的用法与 hasOwnProperty()相同，但当检测属性**是自有属性(非继承)且这个属性是可枚举的**，才会返回 true。

  > 可枚举属性： 通俗的讲就是可以通过 for...in 遍历出来的属性就是可枚举属性。通常由 JS 代码创建出来的属性都是可枚举的。

```js
let obj = Object.create({ x: 1 }); //通过create()创建一个继承了X属性的对象obj
obj.propertyIsEnumerable("x"); // false x是继承属性
obj.y = 1; // 给obj添加一个自有可枚举属性y
obj; // { y: 1 }
obj.propertyIsEnumerable("y"); // true
Object.prototype.propertyIsEnumerable("toString"); // false 不可枚举
```

## 对象遍历使用 `for of` 会报错

```js
const obj = { name: "xl", age: 25, home: "hn" };
for (let key in obj) {
  console.log(key, obj[key]);
}
// name xl
// age 25
// home hn

for (let v of obj) {
  console.log(v);
}
// Uncaught TypeError: {(intermediate value)(intermediate value)} is not iterable
```

## `for-in`和`for-of`的区别

> 可枚举属性： 通俗的讲就是可以通过 for...in 遍历出来的属性就是可枚举属性。通常由 JS 代码创建出来的属性都是可枚举的。

> `for-in`

for...in 语句用于遍历数组或者对象的属性。

遍历数组如下：

```js
Array.prototype.method = function () {
  console.log(this.length);
};
let arr = [1, 2, 4, 5, 7];
arr.name = "数组";

for (let index in arr) {
  console.log(arr[index]);
  console.log(typeof index);
}

// 打印如下：
// 1
// string
// 2
// string
// 4
// string
// 5
// string
// 7
// string
// 数组
// string
// ƒ (){
// 　console.log(this.length);
// }
// string
```

使用 for-in 可以遍历数组，但是会存在以下问题：

- 1.索引类型为字符串型（不能直接进行几何运算）。
- 2.遍历顺序有可能不是按照实际数组的内部顺序（可能按照随机顺序）。
- 3.使用 **for-in 会遍历数组所有的可枚举属性**，包括原型。原型方法 method 和 name 属性都会被遍历出来，通常需要配合 hasOwnProperty()方法判断某个属性是否该对象的实例属性，来将原型对象从循环中剔除。

```js
for (let index in arr) {
  if (arr.hasOwnProperty(index)) {
    console.log(arr[index]);
    console.log(typeof index);
  }
}
// 打印如下：
// 1
// string
// 2
// string
// 4
// string
// 5
// string
// 7
```

遍历对象如下：

```js
Object.prototype.method = function () {
  console.log(this);
};
let obj = {
  name: "张三",
  age: 22,
};
for (let key in obj) {
  console.log(key);
  console.log(obj[key]);
}

// 打印如下：
// name
// 张三
// age
// 22
// method
// ƒ () {
//   console.log(this);
// }
```

遍历的索引值即 key 值。

所以 for-in 更适合遍历对象，通常是建议不要使用 for-in 遍历数组。

> for-of

for-of 可以简单、正确地遍历数组（不遍历原型 method 和 name）。

遍历数组：

```js
Array.prototype.method = function () {
  console.log(this.length);
};
let myArray = [1, 2, 4, 5, 6, 7];
myArray.name = "数组";
myArray.getName = function () {
  return this.name;
};
for (let value of myArray) {
  console.log(value);
  console.log(typeof value);
}
// 打印如下：
// 1
// number
// 2
// number
// 4
// number
// 5
// number
// 6
// number
// 7
// number
```

特点：

- 1.这是最简洁、最直接的遍历数组元素的语法。
- 2.这个方法避开了 for-in 循环的所有缺陷。
- 3.**与 forEach()不同的是，它可以正确响应 break、continue 和 return 语句**。

因此建议是使用 for-of 遍历数组，因为 for-of 遍历的只是数组内的元素，而不包括数组的原型属性 method 和索引 name。

> 总结

- for...in 可以遍历对象和数组，for...of 不能遍历对象
- for in 遍历的是数组的索引（即键名），而 for of 遍历的是数组元素值。
- for...in 循环不仅遍历数字键名，还会遍历手动添加的其它键，甚至包括原型链上的键
- for...in 遍历的索引为字符串类型
- for..of 适用遍历数/数组对象/字符串/map/set 等拥有迭代器对象的集合，但是不能遍历对象
- for...of 与 forEach()不同的是，它可以正确响应 break、continue 和 return 语句，具有迭代器对象才可以使用 for...of

> 参考链接

- [@for...in 和 for...of 有什么区别](https://zhuanlan.zhihu.com/p/405155973)
- [js for...in 和 for...of 的区别](https://www.cnblogs.com/zhilu/p/13856912.html)
