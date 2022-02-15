# Array 对象

## 概述

数组对于程序语言的重要性自不必多说，而在使用 JS 的时候难免也会需要用到数组操作,主要**用于封装多个任意类型的数据，并对它们进行管理**，在 JS 中，数组可以使用 Array 构造函数来创建，或使用[]快速创建，这也是首选的方法。

数组是值的有序集合，由于弱类型的原因，JS 中数组十分灵活、强大，不像是 Java 等强类型高级语言数组只能存放同一类型或其子类型元素，JS**在同一个数组中可以存放多种类型的元素，而且是长度也是可以动态调整的，可以随着数据增加或减少自动对数组长度做更改**。

## 创建数组方式

### 构造函数

- **作用：** `Array`是 JavaScript 的原生对象，同时也是一个构造函数，可以用它生成新的数组。

```javascript
var arr = new Array(2);
arr.length; // 2
arr; // [ empty x 2 ]
```

上面代码中，`Array()`构造函数的参数`2`，表示生成一个两个成员的数组，每个位置都是空值。

- **规则：**
  - 如果没有使用`new`关键字，运行结果也是一样的。考虑到语义性，以及与其他构造函数用户保持一致，建议总是加上`new`。
  - `Array()`构造函数有一个很大的缺陷，不同的参数会导致行为不一致。

```javascript
// 【1】
var arr = new Array(2);
// 等同于
var arr = Array(2);
```

```javascript
// 【2】
// 无参数时，返回一个空数组
new Array(); // []

// 单个正整数参数，表示返回的新数组的长度
new Array(1); // [ empty ]
new Array(2); // [ empty x 2 ]

// 非正整数的数值作为参数，会报错
new Array(3.2); // RangeError: Invalid array length
new Array(-3); // RangeError: Invalid array length

// 单个非数值（比如字符串、布尔值、对象等）作为参数，
// 则该参数是返回的新数组的成员
new Array("abc"); // ['abc']
new Array([1]); // [Array[1]]

// 多参数时，所有参数都是返回的新数组的成员
new Array(1, 2); // [1, 2]
new Array("a", "b", "c"); // ['a', 'b', 'c']
```

可以看到，`Array()`作为构造函数，行为很不一致。因此，不建议使用它生成新数组，直接使用数组字面量是更好的做法。

```javascript
// bad
var arr = new Array(1, 2);

// good
var arr = [1, 2];
```

- **注意：** 注意，如果参数是一个正整数，返回数组的成员都是空位。虽然读取的时候返回`undefined`，但实际上该位置没有任何值。虽然这时可以读取到`length`属性，但是取不到键名。

```javascript
var a = new Array(3);
var b = [undefined, undefined, undefined];

a.length; // 3
b.length; // 3

a; // [empty × 3]
a[0]; // undefined
b[0]; // undefined

0 in a; // false
0 in b; // true
```

上面代码中，`a`是`Array()`生成的一个长度为 3 的空数组，`b`是一个三个成员都是`undefined`的数组，这两个数组是不一样的。读取键值的时候，`a`和`b`都返回`undefined`，但是`a`的键名（成员的序号）都是空的，`b`的键名是有值的。

### 字面量

- **对比：**
  - 单个数字参数时两者不同：**构造函数会创建一个长度为参数的空数组，而字面量是无论几个参数，都作为数组成员**

```javascript
var a = new Array(3);
var b = [3];
var c = new Array("3");

a.length; // 3
b.length; // 1

a; // [empty × 3]
b; // [3]
```

- **注意：** 字面量创建数组时，最好最后不要带多余的逗号`,`，在不同的浏览器下对此处理方式不一样

```js
var a = [1, 2, 3];

a.length; // 3
a; // [1, 2, 3]
```

这段代码在现代浏览器上运行结果和我们设想一样，长度是 3，但是在低版本 IE 下确实长度为 4 的数组，最后一条数据是 undefined。

## 静态方法

### Array.isArray()

- **作用：** `Array.isArray`方法返回一个布尔值，表示参数是否为数组。它可以弥补`typeof`运算符的不足。

```javascript
var arr = [1, 2, 3];

typeof arr; // "object"
Array.isArray(arr); // true
```

上面代码中，`typeof`运算符只能显示数组的类型是`Object`，而`Array.isArray`方法可以识别数组。

## 实例方法

### valueOf()，toString()

`valueOf`方法是一个所有对象都拥有的方法，表示对该对象求值。不同对象的`valueOf`方法不尽一致，**数组的`valueOf`方法返回数组本身**。

```javascript
var arr = [1, 2, 3];
arr.valueOf(); // [1, 2, 3]
```

`toString`方法也是对象的通用方法，**数组的`toString`方法返回数组的字符串形式**。

```javascript
var arr = [1, 2, 3];
arr.toString(); // "1,2,3"

var arr = [1, 2, 3, [4, 5, 6]];
arr.toString(); // "1,2,3,4,5,6"
```

### 增删改元素

#### push()，pop()：队

- **`push`作用：** `push`方法用于在数组的末端添加一个或多个元素，并返回添加新元素后的数组长度。注意，该方法会改变原数组。

```javascript
var arr = [];

arr.push(1); // 1
arr.push("a"); // 2
arr.push(true, {}); // 4
arr; // [1, 'a', true, {}]
```

上面代码使用`push`方法，往数组中添加了四个成员。

- **`pop`作用：** `pop`方法用于删除数组的最后一个元素，并返回该元素。注意，该方法会改变原数组。

```javascript
var arr = ["a", "b", "c"];

arr.pop(); // 'c'
arr; // ['a', 'b']
```

对空数组使用`pop`方法，不会报错，而是返回`undefined`。

```javascript
[].pop(); // undefined
```

`push`和`pop`结合使用，就构成了“后进先出”的栈结构（stack）。

```javascript
var arr = [];
arr.push(1, 2);
arr.push(3);
arr.pop();
arr; // [1, 2]
```

上面代码中，`3`是最后进入数组的，但是最早离开数组。

#### shift()，unshift()：栈

- **`shift`作用：** `shift()`方法用于删除数组的第一个元素，并返回该元素。注意，该方法会改变原数组。

```javascript
var a = ["a", "b", "c"];

a.shift(); // 'a'
a; // ['b', 'c']
```

上面代码中，使用`shift()`方法以后，原数组就变了。

`shift()`方法可以遍历并清空一个数组。

```javascript
var list = [1, 2, 3, 4];
var item;

while ((item = list.shift())) {
  console.log(item);
}

list; // []
```

上面代码通过`list.shift()`方法每次取出一个元素，从而遍历数组。它的前提是数组元素不能是`0`或任何布尔值等于`false`的元素，因此这样的遍历不是很可靠。

`push()`和`shift()`结合使用，就构成了“先进先出”的队列结构（queue）。

- **`unshift`作用：** `unshift()`方法用于在数组的第一个位置添加元素，并返回添加新元素后的数组长度。注意，该方法会改变原数组。

```javascript
var a = ["a", "b", "c"];

a.unshift("x"); // 4
a; // ['x', 'a', 'b', 'c']
```

`unshift()`方法可以接受多个参数，这些参数都会添加到目标数组头部。

```javascript
var arr = ["c", "d"];
arr.unshift("a", "b"); // 4
arr; // [ 'a', 'b', 'c', 'd' ]
```

#### slice()：提取

- **作用：** `slice()`方法用于提取目标数组的一部分，返回一个新数组，原数组不变。（浅拷贝）

```javascript
arr.slice(start, end);
```

- **规则：**
  - 它的第一个参数为起始位置，第二个参数为终止位置（但该位置的元素本身不包括在内）`即[start, end) = [start, end - 1]`。
  - 如果省略第二个参数，则一直返回到原数组的最后一个成员。
  - 如果`slice()`方法的参数是负数，则表示倒数计算的位置。（`-1`下标表示最后一个元素）
  - 如果第一个参数大于等于数组长度，或者第二个参数小于第一个参数，则返回空数组`[]`

```javascript
var a = ["a", "b", "c"];

// 【1、2】
a.slice(); // ["a", "b", "c"]
// `slice()`没有参数，实际上等于返回一个原数组的浅拷贝。
a.slice(0); // ["a", "b", "c"]
a.slice(1); // ["b", "c"]
a.slice(1, 2); // ["b"]
a.slice(2, 6); // ["c"]

// 【3】
a.slice(-2); // ["b", "c"]
a.slice(-2, -1); // ["b"]
// `-2`表示倒数计算的第二个位置，`-1`表示倒数计算的第一个位置。

// 【4】
a.slice(2, 1); // []
a.slice(-1, -2); // []
a.slice(-2, -1); // ['b']
a.slice(4); // []
```

- **用途：**
  - `slice()`方法的一个重要应用，是将类似数组的对象转为真正的数组。

```javascript
Array.prototype.slice.call({ 0: "a", 1: "b", length: 2 });
// ['a', 'b']

Array.prototype.slice.call(document.querySelectorAll("div"));
Array.prototype.slice.call(arguments);
```

上面代码的参数都不是数组，但是通过`call`方法，在它们上面调用`slice()`方法，就可以把它们转为真正的数组。

#### splice()：插入、删除、替换

- **作用：** `splice()`方法用于**删除原数组的一部分成员，并可以在删除的位置添加新的数组成员，返回值是被删除的元素**。注意，该方法会改变原数组。

- **用法：**
  - 删除：`splice(起始下标，要删除的项数)`
  - 插入：`splice(起始下标，0，要插入的项)`
  - 替换：`splice(起始下标，要删除的项数，要插入的项)`

```javascript
arr.splice(start, count, addElement1, addElement2, ...);
```

- **规则：**
  - `splice`的第一个参数是删除的起始位置（从 0 开始），第二个参数是被删除的元素个数。如果后面还有更多的参数，则表示这些就是要被插入数组的新元素。
  - 起始位置如果是负数，就表示从倒数位置开始删除。
  - 如果只是单纯地插入元素，`splice`方法的第二个参数可以设为`0`。
  - 如果只提供第一个参数，等同于将原数组在指定位置拆分成两个数组。

```javascript
// 【1】
var a = ["a", "b", "c", "d", "e", "f"];
a.splice(4, 2); // ["e", "f"]
a; // ["a", "b", "c", "d"]
// 上面代码从原数组4号位置，删除了两个数组成员。

var a = ["a", "b", "c", "d", "e", "f"];
a.splice(4, 2, 1, 2); // ["e", "f"]
a; // ["a", "b", "c", "d", 1, 2]
// 上面代码除了删除成员，还插入了两个新成员。

// 【2】
var a = ["a", "b", "c", "d", "e", "f"];
a.splice(-4, 2); // ["c", "d"]
// 上面代码表示，从倒数第四个位置`c`开始删除两个成员。

// 【3】
var a = [1, 1, 1];
a.splice(1, 0, 2); // []
a; // [1, 2, 1, 1]

// 【4】
var a = [1, 2, 3, 4];
a.splice(2); // [3, 4]
a; // [1, 2]
```

```jsx
const list = [
  {
    name: "a",
  },
  {
    name: "b",
  },
  {
    name: "c",
  },
];
const aIndex = list.findIndex((v) => v.name === "a");
const bIndex = list.findIndex((v) => v.name === "b");
const cIndex = list.findIndex((v) => v.name === "c");

console.log(aIndex, bIndex, cIndex); // 0 1 2
list.splice(aIndex, 1);
console.log(
  "latest bIndex",
  list.findIndex((v) => v.name === "b")
); // 0
console.log(
  "latest cIndex",
  list.findIndex((v) => v.name === "c")
); // 1
list.splice(bIndex - 1, 1);
list.splice(cIndex - 2, 1);
console.log("list", list); // []
```

#### concat()：合并

- **作用：** `concat`方法用于多个数组的合并。它将新数组的成员，添加到原数组成员的后部，然后返回一个新数组，原数组不变。`a.concat(b)返回一个a和b共同组成的新数组，不会修改任何一个原始数组`

```javascript
['hello'].concat(['world'])
// ["hello", "world"]

['hello'].concat(['world'], ['!'])
// ["hello", "world", "!"]

[].concat({a: 1}, {b: 2})
// [{ a: 1 }, { b: 2 }]

[2].concat({a: 1})
// [2, {a: 1}]


```

- **规则：**
  - 除了数组作为参数，`concat`也接受其他类型的值作为参数，添加到目标数组尾部。
  - 如果数组成员包括对象，`concat`方法返回当前数组的一个浅拷贝。所谓“浅拷贝”，指的是新数组拷贝的是对象的引用。

```javascript
// 【1】
[1, 2, 3].concat(4, 5, 6);
// [1, 2, 3, 4, 5, 6]

// 【2】
var obj = { a: 1 };
var oldArray = [obj];

var newArray = oldArray.concat();

obj.a = 2;
newArray[0].a; // 2

// 先对原数组浅拷贝之后再合并的，所以修改原数组引用类型数据的时候，返回的数组也会受到影响

var a = [1, 2, 3];
var b = [4, 5];
var c = a.concat(b);
console.log(c); //[1, 2, 3, 4, 5]
console.log(a); //[1, 2, 3]
console.log(b); //[4, 5]

var a = [{ value: 1 }];
var b = [{ value: 2 }, { value: 3 }];
var c = a.concat(b);
console.log(JSON.parse(JSON.stringify(c)));
// [{value: 1}, {value: 2}, {value: 3}]
a[0].value = "a[0]value";
b[0].value = "b[0]value";

console.log(JSON.parse(JSON.stringify(c)));
// [{value: 'a[0]value'}, {value: 'b[0]value'}, {value: 3}]

console.log(a);
// [{value: 'a[0]value'}]

console.log(b);
// [{value: 'b[0]value'}, {value: 3}]
```

上面代码中，原数组包含一个对象，`concat`方法生成的新数组包含这个对象的引用。所以，改变原对象以后，新数组跟着改变。

#### delete 元素

```js
var arr = [1, 2, 3, 4];
delete arr[2]; // true
arr; //  [1, 2, empty, 4]
// {
//   0: 1,
//   1: 2,
//   3: 4,
// }
```

### 查询

#### indexOf()，lastIndexOf()

- **作用：** `indexOf`方法返回给定元素在数组中第一次出现的位置，如果没有出现则返回`-1`。`indexOf`方法还可以接受第二个参数，表示搜索的开始位置。

- **作用：** `lastIndexOf`方法返回给定元素在数组中最后一次出现的位置，如果没有出现则返回`-1`

```javascript
var a = ["a", "b", "c"];
a.indexOf("b"); // 1
a.indexOf("y") // -1
  [("a", "b", "c")].indexOf("a", 1); // -1

var a = [2, 5, 9, 2];
a.lastIndexOf(2); // 3
a.lastIndexOf(7); // -1
```

- **注意：** 注意，这两个方法不能用来搜索`NaN`的位置，即它们无法确定数组成员是否包含`NaN`。这是因为这两个方法内部，使用严格相等运算符（`===`）进行比较，而`NaN`是唯一一个不等于自身的值。

```javascript
[NaN]
  .indexOf(NaN) // -1
  [NaN].lastIndexOf(NaN); // -1
```

### 其它

#### join()：连接成员为字符串

- **作用：** `join()`方法以指定参数作为分隔符，将所有数组成员连接为一个字符串返回。如果不提供参数，**默认用逗号分隔**。

```javascript
var a = [1, 2, 3, 4];

a.join(" "); // '1 2 3 4'
a.join(" | "); // "1 | 2 | 3 | 4"
a.join(); // "1,2,3,4"
```

- **规则：**
  - 如果数组成员是`undefined`或`null`或空位，会被转成空字符串。
  - 通过`call`方法，这个方法也可以用于字符串或类似数组的对象。

```javascript
// 【1】
[undefined, null].join('#')
// '#'

['a',, 'b'].join('-')
// 'a--b'


// 【2】
Array.prototype.join.call('hello', '-')
// "h-e-l-l-o"

var obj = { 0: 'a', 1: 'b', length: 2 };
Array.prototype.join.call(obj, '-')
// 'a-b'
```

#### reverse()：逆序

- **作用：** `reverse`方法用于颠倒排列数组元素，返回改变后的数组。注意，该方法将改变原数组。

```javascript
var a = ["a", "b", "c"];

a.reverse(); // ["c", "b", "a"]
a; // ["c", "b", "a"]

// 当数组索引不是连续或以0开始，结果需要注意
var b = [];
b[2] = 2;
b[3] = 3;
b[7] = 4;
b[8] = 5;
b; // [empty × 2, 2, 3, empty × 3, 4, 5]
// {
//   2: 2,
//   3: 3,
//   7: 4,
//   8: 5,
// }
b.reverse(); // [5, 4, empty × 3, 3, 2, empty × 2]
// {
//   0: 5,
//   1: 4,
//   5: 3,
//   6: 2,
// }
```

```js
// 注意带有0的字符串数组reverse之后'0'的位置不对
["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].reverse(); // ["0", "9", "8", "7", "6", "5", "4", "3", "2", "1"]
```

#### sort()：排序

- **作用：** `sort`方法对数组成员进行排序，默认是按照字典顺序排序。排序后，原数组将被改变。

- **规则：**
  - `sort()`方法不是按照大小排序，而是按照字典顺序(ASCII 字符顺序进行排序, undefined 会被排到最后面)。也就是说，数值会被先转成字符串，再按照字典顺序进行比较，所以`101`排在`11`的前面。
  - sort 内部使用快速排序，如果想让`sort`方法按照自定义方式排序，可以传入一个函数作为参数。
  - `sort`的参数函数本身接受两个参数，表示进行比较的两个数组成员。如果该函数的返回值大于`0`，表示第一个成员排在第二个成员后面；其他情况下，都是第一个元素排在第二个元素前面。
  - 不能用比较函数比较一个不能转化为数字的字符串与数字的顺序，此时会比较 ASCII 值。

```javascript
// 【1】
["d", "c", "b", "a"].sort()[
  // ['a', 'b', 'c', 'd']

  (4, 3, 2, 1)
].sort();
// [1, 2, 3, 4]

var strArr = ["a", "b", "A", "B"];
strArr
  .sort() // ["A", "B", "a", "b"]
  [
    // 因为字母A、B的ASCII值分别为65、66，
    // 而a、b的值分别为97、98，所以上面输出的结果是 ["A", "B", "a", "b"]

    // 如果数组元素是数字，sort方法会调用每个数组项的toString()方法，
    // 得到字符串，然后再对得到的字符串进行排序。
    (11, 101)
  ].sort()
  [
    // [101, 11]

    (10111, 1101, 111)
  ].sort()
  [
    // [10111, 1101, 111]

    // 【2】
    (10111, 1101, 111)
  ].sort(function (a, b) {
    return a - b;
  });
// [111, 1101, 10111]

// @【3】
const test = [
  { name: "张三", age: 30, test: "abc" },
  { name: "李四", age: 24, test: "b" },
  { name: "王五", age: 28, test: "abcd" },
];

test.sort((a, b) => a.age - b.age);
// [
//   { name: "李四", age: 24, test: 'b' },
//   { name: "王五", age: 28, test: 'abcd' },
//   { name: "张三", age: 30, test: 'abc' }
// ]

test.sort((a, b) => (a.test > b.test ? 1 : -1));
// [
//   { name: "张三", age: 30, test: "abc" },
//   { name: "王五", age: 28, test: "abcd" },
//   { name: "李四", age: 24, test: "b" }
// ]

test.sort((a, b) => a.name.localeCompare(b.name));
// [
//   { name: "李四", age: 24, test: "b" }
//   { name: "王五", age: 28, test: "abcd" },
//   { name: "张三", age: 30, test: "abc" },
// ]

// 【4】
var arr = ["b", undefined, 5];
arr.sort(); // [5, "b", undefined]
// 比较函数在比较时，会把先把字符串转化为数字，然后再比较，
// 字符串b不能转化为数字，所以就不能比较大小。
// 然而，当不用比较函数时，会比较ASCII值，所以结果是 [5, "b"] 。
```

```javascript
// bad
[1, 4, 2, 6, 0, 6, 2, 6]
  .sort((a, b) => a > b)

  [
    // good
    (1, 4, 2, 6, 0, 6, 2, 6)
  ].sort((a, b) => a - b);
```

上面代码中，前一种排序算法返回的是布尔值，这是不推荐使用的。后一种是数值，才是更好的写法。

##### Tips

- 数组根据某个中文字段排序
  ```js
  list?.sort((a: any, b: any) => a?name?.localeCompare(b?.name, "zh"));
  ```
- 数组根据某个时间日期字段来排序

```JS
// 日期字段为 '2020-09-04' 格式

const dataSource = arr.sort(
  (a, b) => moment(a.date).valueOf() - moment(b.date).valueOf()
);

// 日期字段为 '2020-09-04T11:02:09.596' 格式
const dataSource = arr.sort(
  (a, b) =>
    moment(moment(b.createdAt).format('YYYY-MM-DD')).valueOf() -
    moment(moment(a.createdAt).format('YYYY-MM-DD')).valueOf(),
);
```

- 数组按照指定的顺序排序：实例一（简单版）

```js
// 如下，将arr数组的元素根据pageId按照pageIds的顺序来排序
var pageIds = [125, 123, 124];
var arr = [{ pageId: 123 }, { pageId: 124 }, { pageId: 125 }];
```

```js
// 只需要遍历两次，但是需要耗费一个对象和数组存储数据
const arrObj = arr.reduce((t, v) => {
  t[v.pageId] = v;
  return t;
}, {});
const res = pageIds.reduce((t, v) => {
  const item = arrObj[v];
  if (item) {
    t.push(item);
  }
  return t;
}, []);
```

- 数组按照指定的顺序排序：实例二（复杂版）
  指定的顺序是从接口：一个二维数组（阶段和子阶段属性）里面获取的，如下。而里程碑节点的 list 是以节点为维度一维的，需要按照这个二维数组的顺序来给 list 排序。

  ```jsx
  // milestonePhaseMappingList 数据接口如下
  [
    {
      children: [
        {
          key: "requirement",
          name: "需求",
          order: 0,
        },
        {
          key: "design",
          name: "设计",
          order: 1,
        },
        {
          key: "plan",
          name: "计划",
          order: 2,
        },
      ],
      key: "establish",
      name: "立项",
      order: 0,
    },
    {
      children: [
        {
          key: "develop",
          name: "开发",
          order: 3,
        },
        {
          key: "test",
          name: "测试",
          order: 4,
        },
      ],
      key: "implementation",
      name: "实施",
      order: 1,
    },
    {
      children: [
        {
          key: "publish",
          name: "发布",
          order: 5,
        },
        {
          key: "finish",
          name: "结束",
          order: 6,
        },
      ],
      key: "finish",
      name: "结项",
      order: 2,
    },
  ];
  ```

  ```jsx
  import produce from 'immer'

  // 获取里程碑节点的阶段、子阶段字典数据
  const fetchMilestonePhaseMappingInfo = useCallback(async () => {
    const { success, result } = await getMilestonePhaseMappingInfo()
    if (success) {
      setMilestonePhaseMappingList(result || [])
    }
  }, [])

  useEffect(() => {
    fetchMilestonePhaseMappingInfo()
  }, [fetchMilestonePhaseMappingInfo])

  // 节点list按照阶段-子阶段字典的顺序排序
  const orderListByStage = useCallback(
    (list: IMilestone[]) => {
      const latestmMappingList = milestonePhaseMappingList as Array<
        IMilestonePhaseMappingItem & {
          milestones: IMilestone[]
        }
      >
      const handledMappingList = produce(latestmMappingList || [], (draft) => {
        draft?.forEach((stageItem) => {
          stageItem.milestones = []
          if (stageItem?.children?.length) {
            stageItem?.children?.forEach((subStageItem) => {
              const filteredItems = list?.filter(
                (milestoneItem) =>
                  milestoneItem?.stage === stageItem?.key &&
                  milestoneItem?.subStage === subStageItem?.key,
              )
              if (filteredItems?.length) {
                stageItem.milestones = stageItem.milestones.concat(filteredItems)
              }
            })
          }
        })
      })
      console.log(`handledMappingList`, handledMappingList)
      console.log(`milestonePhaseMappingList`, milestonePhaseMappingList)
      const orderedList = handledMappingList.reduce(
        (total: IMilestone[], item) => total.concat(item?.milestones || []),
        [],
      )
      console.log(`orderedList`, orderedList)
      return orderedList
    },
    [milestonePhaseMappingList],
  )
  ```

### 迭代方法

- **语法：**

```js

array.方法.(function (value[, index[, array]]) {
  // ...
}[, thisArg])

// callback：数组中每个元素执行的回调函数，该函数接收一至三个参数：
//   currentValue：数组中正在处理的当前元素。
//   index 可选：数组中正在处理的当前元素的索引。
//   array 可选：forEach() 方法正在操作的数组。

// thisArg 可选：运行回调函数时的作用域对象，用来绑定回调函数内部的`this`变量。
```

- **特性：**
  - 迭代方法不一定改变自身数组（只有引用类型元素可以改变， 且适用于所有迭代方法）

```js
var arr1 = [
  { name: "鸣人", age: 16 },
  { name: "佐助", age: 17 },
];
var arr2 = [1, 2, 3];

arr1.forEach((item) => {
  item.age = item.age * 2;
});
arr1; // [{ name: "鸣人", age: 32 }, { name: "佐助", age: 34 }]

arr2.forEach((item) => {
  item = item * 2;
});
arr2; // [1, 2, 3]

arr1.map((item) => {
  item.age = item.age * 2;
}); // [undefined, undefined]
arr1; // [{ name: "鸣人", age: 64 }, { name: "佐助", age: 68 }]

arr2.map((item) => {
  item = item * 2;
}); // [undefined, undefined, undefined]
arr2; // [1, 2, 3]
```

- **对比：**

| 方法    | 返回值     | 作用                                                                                                   |
| :------ | :--------- | :----------------------------------------------------------------------------------------------------- |
| forEach | 无         | 原数组每个元素执行回调函数。                                                                           |
| map     | 新数组     | 原数组每个元素执行回调函数的结果组成的新数组。                                                         |
| filter  | 新数组     | 原数组每个元素执行回调函数，结果为 true 的元素组成的新数组。                                           |
| some    | boolean 值 | 原数组每个元素执行回调函数，**有任意一项**元素执行回调函数的结果为 true，则返回 true，否则返回 false。 |
| every   | boolean 值 | 原数组每个元素执行回调函数，**每一项**元素执行回调函数的结果为 true，则返回 true，否则返回 false。     |

- **参考资料：**
  - [forEach、map、filter、find、sort、some 等易错点整理](https://juejin.im/post/5ca96c76f265da24d5070563)

#### map()

- **作用：** `map`方法将数组的所有成员依次传入参数函数，然后把每一次的执行结果组成一个新数组返回。

```javascript
var numbers = [1, 2, 3];
numbers.map(function (n) {
  return n + 1;
});
// [2, 3, 4]
numbers[
  // [1, 2, 3]

  (1, 2, 3)
].map(function (elem, index, arr) {
  return elem * index;
});
// [0, 2, 6]

var arr = ["a", "b", "c"];
[1, 2].map(function (e) {
  return this[e];
}, arr);
// ['b', 'c']
// 上面通过`map`方法的第二个参数，将回调函数内部的`this`对象，指向`arr`数组。
```

- **规则：**
  - `map`方法不会跳过`undefined`和`null`，但是会跳过空位。如果数组有空位，`map`方法的回调函数在这个位置不会执行，会跳过数组的空位。

```javascript
var f = function (n) { return 'a' };

[1, undefined, 2].map(f) // ["a", "a", "a"]
[1, null, 2].map(f) // ["a", "a", "a"]
[1, , 2].map(f) // ["a", , "a"]

```

- **实例：**

```js
// map不能过滤数组
[1, 2, 3, 4, 5].map((item) => {
  if (item > 3) return item;
});
// => [undefined, undefined, undefined, 4, 5]

// map数据返回jsx
arr.map((v, i) => {
  if (i === 2) {
    return <Button></Button>;
  }
  return <View></View>;
});
```

#### forEach()

- **作用：** `forEach`方法与`map`方法很相似，也是对数组的所有成员依次执行参数函数。但是，`forEach`方法不返回值，只用来操作数据。这就是说，如果数组遍历的目的是为了得到返回值，那么使用`map`方法，否则使用`forEach`方法。

```javascript
function log(element, index, array) {
  console.log("[" + index + "] = " + element);
}

[2, 5, 9].forEach(log);
// [0] = 2
// [1] = 5
// [2] = 9

var out = [];
[1, 2, 3].forEach(function (elem) {
  this.push(elem * elem);
}, out);

out; // [1, 4, 9]
```

- **注意：**
  - 注意，`forEach`方法无法中断执行，总是会将所有成员遍历完。如果希望符合某种条件时，就中断遍历，要使用`for`循环。
  - `forEach`方法不会跳过`undefined`和`null`，但会跳过数组的空位。
  - 后续不支持链式操作，因为 forEach 返回的是`undefined`

```javascript
// 【1】
var arr = [1, 2, 3];

for (var i = 0; i < arr.length; i++) {
  if (arr[i] === 2) break;
  console.log(arr[i]);
}
// 1

// 上面，执行到数组的第二个成员时，就会中断执行。`forEach`方法做不到这一点。


// 【2】
var log = function (n) {
  console.log(n + 1);
};

[1, undefined, 2].forEach(log)
// 2
// NaN
// 3

[1, null, 2].forEach(log)
// 2
// 1
// 3

[1, , 2].forEach(log)
// 2
// 3


// 【3】
[1, 2, 3, 4, 5]
  .forEach(item => console.log(item))
  .filter(item => {
    return item > 2;
  });
// Uncaught TypeError: Cannot read property 'filter' of undefined
```

#### filter()

- **作用：** `filter`方法用于过滤数组成员，满足条件的成员组成一个新数组返回。

```javascript
var mixedArr = [0, "blue", "", NaN, 9, true, undefined, "white", false];
mixedArr.filter((v) => v); // ["blue", 9, true, "white"]
mixedArr
  .filter(Boolean) // ["blue", 9, true, "white"]
  [(1, 2, 3, 4, 5)].filter(function (elem) {
    return elem > 3;
  });
// [4, 5]

var arr = [0, 1, "a", false];
arr.filter(Boolean)[
  // [1, "a"]

  (1, 2, 3, 4, 5)
].filter(function (elem, index, arr) {
  return index % 2 === 0;
});
// [1, 3, 5]

var obj = { MAX: 3 };
var myFilter = function (item) {
  if (item > this.MAX) return true;
};
var arr = [2, 8, 3, 4, 1, 3, 2, 9];
arr.filter(myFilter, obj); // [8, 4, 9]
```

#### some()，every()

- **作用：**
  - `some`方法是只要一个成员的返回值是`true`，则整个`some`方法的返回值就是`true`，否则返回`false`。只要有一个满足即返回 true，之后的不再执行(对性能比较好！)
  - `every`方法是所有成员的返回值都是`true`，整个`every`方法才返回`true`，否则返回`false`。

```javascript
var arr = [1, 2, 3, 4, 5];
arr.some(function (elem, index, arr) {
  return elem >= 3;
});
// true

var arr = [1, 2, 3, 4, 5];
arr.every(function (elem, index, arr) {
  return elem >= 3;
});
// false
```

- **注意：** 注意，对于空数组，`some`方法返回`false`，`every`方法返回`true`，回调函数都不会执行。

```javascript
function isEven(x) { return x % 2 === 0 }

[].some(isEven) // false
[].every(isEven) // true
```

#### reduce()，reduceRight()

- **定义：** 对数组中的每个元素执行一个自定义的累计器，将其结果汇总为单个返回值

- **用法：**

  - 形式：`array.reduce((t, v, i, a) => { ... }[, initValue])`
  - 实质： [x1, x2, x3, x4].reduce(f) = f(f(f(x1, x2), x3), x4)
  - 参数
    - callback：回调函数(必选)
    - initValue：初始值(可选, 若未填初始值为数组第一个元素)
  - 回调函数的参数
    - total(t)：累计器完成计算的返回值(必选)
    - value(v)：当前元素(必选)
    - index(i)：当前元素的索引(可选)
    - array(a)：当前元素所属的数组对象(可选)

- **规则：**
  - `reduce`是从左到右处理（从第一个成员到最后一个成员），`reduceRight`则是从右到左（从最后一个成员到第一个成员），其他完全一样。

```javascript
[1, 2, 3, 4, 5].reduce(function (a, b) {
  console.log(a, b);
  return a + b;
});
// 1 2
// 3 3
// 6 4
// 10 5
//最后结果：15
```

上面代码中，`reduce`方法求出数组所有成员的和。第一次执行，`a`是数组的第一个成员`1`，`b`是数组的第二个成员`2`。第二次执行，`a`为上一轮的返回值`3`，`b`为第三个成员`3`。第三次执行，`a`为上一轮的返回值`6`，`b`为第四个成员`4`。第四次执行，`a`为上一轮返回值`10`，`b`为第五个成员`5`。至此所有成员遍历完成，整个方法的返回值就是最后一轮的返回值`15`。

```javascript
[1, 2, 3, 4, 5].reduce(function (a, b) {
  return a + b;
}, 10);
// 25

function subtract(prev, cur) {
  return prev - cur;
}
[3, 2, 1]
  .reduce(subtract) // 0
  [(3, 2, 1)].reduceRight(subtract); // -4
```

上面代码中，`reduce`方法相当于`3`减去`2`再减去`1`，`reduceRight`方法相当于`1`减去`2`再减去`3`。

由于这两个方法会遍历数组，所以实际上还可以用来做一些遍历相关的操作。比如，找出字符长度最长的数组成员。

```javascript
function findLongest(entries) {
  return entries.reduce(function (longest, entry) {
    return entry.length > longest.length ? entry : longest;
  }, "");
}

findLongest(["aaa", "bb", "c"]); // "aaa"
```

上面代码中，`reduce`的参数函数会将字符长度较长的那个数组成员，作为累积值。这导致遍历所有成员之后，累积值就是字符长度最长的那个成员。

##### 高级应用

- [1] 累加累乘
  ```js
  const arr = [1, 2, 3, 4, 5];
  arr.reduce((t, v) => t + v); // 15
  arr.reduce((t, v) => t * v); // 120
  ```
- [2] 字符串转数字
  ```js
  const s = "12345";
  s.split("")
    .map((x) => {
      //['1','2','3','4','5']
      return x.charCodeAt(0) - 48; //[1,2,3,4,5]
    })
    .reduce((x, y) => {
      return x * 10 + y; //12345
    });
  ```
- [3] 字符串翻转

  ```js
  function reverseStr(str = "") {
    return str.split("").reduceRight((t, v) => t + v);
  }
  const str = "reduce最牛逼";
  reverseStr(str); // "逼牛最ecuder"
  ```

- [4] 代替 reverse
  ```js
  const arr = [1, 3, 5, 7];
  arr.reduceRight((t, v) => {
    t.push(v);
    return t;
  }, []); // [7,5,3,1]
  // 简洁写法：arr.reduceRight((t,v) => (t.push(v),t),[]) // [7,5,3,1]
  ```
- [5] 代替 map 和 filter

  ```js
  const arr = [0, 1, 2, 3];

  // 代替map：[0, 2, 4, 6]
  const a = arr.map((v) => v * 2);
  const b = arr.reduce((t, v) => [...t, v * 2], []);

  // 代替filter：[2, 3]
  const c = arr.filter((v) => v > 1);
  const d = arr.reduce((t, v) => (v > 1 ? [...t, v] : t), []);

  // 代替map和filter：[4, 6]
  const e = arr.map((v) => v * 2).filter((v) => v > 2);
  const f = arr.reduce((t, v) => (v * 2 > 2 ? [...t, v * 2] : t), []);
  ```

- [6] 代替 some 和 every

  ```JS
  const scores = [
    { score: 45, subject: "chinese" },
    { score: 90, subject: "math" },
    { score: 60, subject: "english" }
  ];

  // 代替some：至少一门合格
  const isAtLeastOneQualified = scores.reduce((t, v) => t || v.score >= 60, false); // true

  // 代替every：全部合格
  const isAllQualified = scores.reduce((t, v) => t && v.score >= 60, true); // false
  ```

- [7] 数组分割

  ```JS
  function Chunk(arr = [], size = 1) {
    return arr.length ? arr.reduce((t, v) => (t[t.length - 1].length === size ? t.push([v]) : t[t.length - 1].push(v), t), [[]]) : [];
  }

  const arr = [1, 2, 3, 4, 5];
  Chunk(arr, 2); // [[1, 2], [3, 4], [5]]
  ```

- [8] 数组过滤

  ```JS
  function Difference(arr = [], oarr = []) {
      return arr.reduce((t, v) => (!oarr.includes(v) && t.push(v), t), []);
  }
  const arr1 = [1, 2, 3, 4, 5];
  const arr2 = [2, 3, 6]
  Difference(arr1, arr2); // [1, 4, 5]
  ```

- [9] 数组扁平

  ```js
  function Flat(arr = []) {
    return arr.reduce((t, v) => t.concat(Array.isArray(v) ? Flat(v) : v), []);
  }
  // 简洁写法
  /* function Flat(arr = []) {
    return arr.reduce((t, v) => (t=t.concat(Array.isArray(v) ? Flat(v) : v),t), [])
  } */
  const arr = [0, 1, [2, 3], [4, 5, [6, 7]], [8, [9, 10, [11, 12]]]];
  Flat(arr); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  ```

- [10] 数组去重
  ```JS
  function Uniq(arr = []) {
    return arr.reduce((t, v) => t.includes(v) ? t : [...t, v], []);
  }
  const arr = [2, 1, 0, 3, 2, 1, 2];
  Uniq(arr); // [2, 1, 0, 3]
  ```
- [11] 数组最大最小值

  ```js
  function Max(arr = []) {
    return arr.reduce((t, v) => (t > v ? t : v));
  }

  function Min(arr = []) {
    return arr.reduce((t, v) => (t < v ? t : v));
  }
  const arr = [12, 45, 21, 65, 38, 76, 108, 43];
  Max(arr); // 108
  Min(arr); // 12
  ```

- [12] 数组成员个数

  ```js
  function Count(arr = []) {
    return arr.reduce((t, v) => ((t[v] = (t[v] || 0) + 1), t), {});
  }
  const arr = [0, 1, 1, 2, 2, 2];
  Count(arr); // { 0: 1, 1: 2, 2: 3 }

  /* 此方法是字符统计和单词统计的原理，入参时把字符串处理成数组即可 */
  ```

- [13] 数组成员特性分组

  在实际业务开发中，经常有这样的情况，后台接口返回的对象数组类型，你需要将它转化为一个根据成员某个字段值作为 key 来为数组进行分类。

  如果你用过 lodash 这个库，使用\_.keyBy 这个方法就能进行转换，但用 reduce 也能实现这样的需求。

  ```js
  function Group(arr = [], key) {
    return key
      ? arr.reduce(
          (t, v) => (!t[v[key]] && (t[v[key]] = []), t[v[key]].push(v), t),
          {}
        )
      : {};
  }

  const arr = [
    { area: "GZ", name: "YZW", age: 27 },
    { area: "GZ", name: "TYJ", age: 25 },
    { area: "SZ", name: "AAA", age: 23 },
    { area: "FS", name: "BBB", age: 21 },
    { area: "SZ", name: "CCC", age: 19 },
  ]; // 以地区area作为分组依据
  Group(arr, "area"); // { GZ: Array(2), SZ: Array(2), FS: Array(1) }
  ```

- [14] 筛选对象的属性

  跟 lodash 的 `_.pick(object, keysArr)` 一样效果

  ```js
  function GetKeys(obj = {}, keys = []) {
    return Object.keys(obj).reduce(
      (t, v) => (keys.includes(v) && (t[v] = obj[v]), t),
      {}
    );
  }

  const target = { a: 1, b: 2, c: 3, d: 4 };
  const keyword = ["a", "d"];
  GetKeys(target, keyword); // { a: 1, d: 4 }
  ```

- **参考资料**
  - [[1]25 个你不得不知道的数组 reduce 高级用法](https://juejin.im/post/6844904063729926152)
  - [js 中数组的 reduce 方法](https://juejin.im/post/6844903630756134926)

### Tips

- filter 等迭代方法处理函数中若修改元素，也会生效

```jsx
const list = [
  {
    id: "1",
    type: "man",
  },
  {
    id: "2",
    type: "woman",
  },
  {
    id: "3",
    type: "man",
  },
  {
    id: "4",
    type: "man",
  },
  {
    id: "5",
    type: "woman",
  },
  {
    id: "6",
    type: "man",
  },
];

const filteredList = list?.filter((v) => {
  if (v?.type === "woman") {
    v.home = "henan";
    return true;
  }
  return false;
});

filteredList.map((item) => item?.home); // [("henan", "henan")];
list.map((item) => item?.home); // [undefined, 'henan', undefined, undefined, 'henan', undefined]
```

### 链式使用

上面这些数组方法之中，有不少返回的还是数组，所以可以链式使用。

```javascript
var users = [
  { name: "tom", email: "tom@example.com" },
  { name: "peter", email: "peter@example.com" },
];

users
  .map(function (user) {
    return user.email;
  })
  .filter(function (email) {
    return /^t/.test(email);
  })
  .forEach(function (email) {
    console.log(email);
  });
// "tom@example.com"
```

上面代码中，先产生一个所有 Email 地址组成的数组，然后再过滤出以`t`开头的 Email 地址，最后将它打印出来。

## Tips

### 判断是否为数组

```js
Array.isArray([]) // true

[] instanceof Array // true

[].constructor === Array // true

({}).toString.apply([]) === '[object Array]' // true

Object.prototype.toString.call([]) === "[object Array]" // true
```

### 判断是否为数组元素

```js
// ES5用indexof、some; ES6用find、findIndex、includes
[1, 2, 3]
  .indexOf(2) // 1
  [(1, 2, 3)].indexOf(4) // -1
  [(1, 2, 3)].some((item) => item === 2) // true
  [(1, 2, 3)].some((item) => item === 4) // false

  [(1, 2, 3)].find((v) => v === 2) // 2
  [(1, 2, 3)].find((v) => v === 4) // undefined
  [(1, 2, 3)].findIndex((v) => v === 3) // 2
  [(1, 2, 3)].findIndex((v) => v === 4) // -1
  [(1, 2, 3)].includes(2) // true
  [(1, 2, 3)].includes(4); // false
// in不能用来判断
1 in [1, 2, 3]; // true
2 in [1, 2, 3]; // true
3 in [1, 2, 3]; // false  最后一个元素就返回false
```

### 初始化数组

```js
// let a =[...Array(n)] : n项元素都为undefined的数组
let a = [...Array(3)]; // [undefined, undefined, undefined]
let b = [...Array(5).keys()]; // [0, 1, 2, 3, 4]
let c = [...Array(5)].map((v, i) => i); // [0, 1, 2, 3, 4]
let d = new Array(5).fill("1"); // ["1", "1", "1", "1", "1"]
```

### 清空数组

- splice
- length 赋值为 0
- 赋值为[] (效率最好)

```js
// 【1】
var a = [1, 2, 3, 4];
a.splice(0, a.length); // [1, 2, 3, 4]
a; // []

// 【2】
var a = [1, 2, 3, 4];
a.length = 0;
a; // []

// 【3】
var a = [1, 2, 3, 4];
a; // []
```

### 数组遍历方法

- **用法：**

  - `for (let i = 0; i < arr.length; ++i) { }`
  - `arr.forEach((v, i) => { })`
  - `for (let i in arr) { } // i为字符串`
  - `for (const v of arr) { }`

- **规则：**
  - 使用 for 和 for/in，可以访问下标（通过 `array[下标]` 就能访问元素）；使用 for/of，只能访问元素；使用 forEach()，可以同时访问数组的下标与元素；
  - 为数组添加非数字属性，只有 `for/in` 不会忽略非数字属性。
  - `forEach 和 for/in` 会跳过空元素，而 `for` 和 `for/of` 则不会跳过。

```js
var arr = ["a", "b", , "c"];
arr.test = "test";

// [1] for循环
for (let i = 0; i < arr.length; i += 1) {
  console.log(i, arr[i]); //
}
// 0 'a'
// 1 'b'
// 2  undefined
// 3 'c'

// [2] forEach
arr.forEach((v, i) => {
  console.log(i, v);
});
// 0 'a'
// 1 'b'
// 3 'c'

// [3] for/in
for (let i in arr) {
  console.log(i, arr[i]);
}
// '0' 'a'
// '1' 'b'
// '3' 'c'
// 'test' 'test'

// [4] for/of
for (const v of arr) {
  console.log(v);
}
// 'a'
// 'b'
// undefined
// 'c'
```

### 数组遍历如何提前退出循环

- **作用：** 可以提高性能：校验数组时某个 record 不满足直接退出，减少不必要的后续遍历。

- **对比：**

  下表是 JS 中常用的实现循环遍历的方法的跳出/结束遍历的办法，经过测试后的总结

| 序号 | 方法            | break  | continue     | return       | return true  | return false | 结论 |
| :--- | :-------------- | :----- | :----------- | :----------- | :----------- | :----------- | :--- |
| 1    | for 循环        | 成功   | 跳出本次循环 | 不合法       | 不合法       | 不合法       | √    |
| 2    | for...in        | 成功   | 跳出本次循环 | 不合法       | 不合法       | 不合法       | √    |
| 3    | Array.forEach() | 不合法 | 不合法       | 跳出本次循环 | 跳出本次循环 | 跳出本次循环 | ×    |
| 4    | Array.map()     | 不合法 | 不合法       | 跳出本次循环 | 跳出本次循环 | 跳出本次循环 | ×    |
| 5    | Array.filter()  | 不合法 | 不合法       | 跳出本次循环 | 跳出本次循环 | 跳出本次循环 | ×    |
| 6    | Array.some()    | 不合法 | 不合法       | 跳出本次循环 | 成功         | 跳出本次循环 | √    |
| 7    | Array.every()   | 不合法 | 不合法       | 成功         | 跳出本次循环 | 成功         | √    |

- **注意：**

  下面实例都是循环是主体代码，如果循环是在函数中，是可以`return`提前退出的。(函数体内部的`return`语句，表示停止执行并返回值)

  ```js
  function testFor(show = []) {
    var arr = ["a", "b", "c", "d", "e"];
    for (var i = 0; i < arr.length; i++) {
      if (i === 2) {
        // break;      // console.log(a) : ['a', 'b']
        // continue;   // console.log(a) : ['a', 'b', 'd', 'e']
        return; // console.log(a) : ['a', 'b']
        // return true;    // console.log(a) : ['a', 'b']
        // return false;   // console.log(a) : ['a', 'b']
      }
      show.push(arr[i]);
    }
  }
  let a = [];
  testFor(a);
  console.log(a);
  ```

- **实例：**

  - for 循环 和 for...in 效果相同

  ```js
  var arr = ["a", "b", "c", "d", "e"];
  var show = [];

  for (var i = 0; i < arr.length; i++) {
    if (i === 2) {
      break; // ['a', 'b'] 成功跳出循环
      // continue;// ['a', 'b', 'd', 'e'] 只能跳出本次循环
      // return;// Uncaught SyntaxError: Illegal return statement
      // return true;// Uncaught SyntaxError: Illegal return statement
      // return false;// Uncaught SyntaxError: Illegal return statement
    }
    show.push(arr[i]);
  }

  for (var item in arr) {
    if (item === "2") {
      break; // ["a", "b"] 跳出循环成功
      // continue;// ["a", "b", "d", "e"] 只能跳出本次循环
      // return;// Uncaught SyntaxError: Illegal return statement
      // return true;// Uncaught SyntaxError: Illegal return statement
      // return false;// Uncaught SyntaxError: Illegal return statement
    }
    show.push(arr[item]);
  }
  ```

  - Array.forEach() 和 Array.map()、Array.filter() 效果相同

  ```js
  var arr = ["a", "b", "c", "d", "e"];
  var show = [];

  arr.forEach((item, index) => {
    if (index === 2) {
      // break;// Uncaught SyntaxError: Illegal break statement
      // continue;// Uncaught SyntaxError: Illegal continue statement: no surrounding iteration statement
      // return;// ["a", "b", "d", "e"] 只能跳出本次循环
      // return true;// ["a", "b", "d", "e"] 只能跳出本次循环
      // return false;// ['a', 'b', 'd', 'e'] 只能跳出本次循环
    }
    show.push(item);
  });
  ```

  - Array.some()

  ```js
  var arr = ["a", "b", "c", "d", "e"];
  var show = [];

  arr.some((item, index) => {
    if (index === 2) {
      // break;// Uncaught SyntaxError: Illegal break statement
      // continue;// Uncaught SyntaxError: Illegal continue statement: no surrounding iteration statement
      // return;// ["a", "b", "d", "e"] 只能跳出本次循环
      return true; // ["a", "b"] 成功跳出循环
      // return false;// ["a", "b", "d", "e"] 只能跳出本次循环
    }
    show.push(item);
  });
  ```

  - Array.every()

  ```js
  var arr = ["a", "b", "c", "d", "e"];
  var show = [];

  arr.every((item, index) => {
    if (index === 2) {
      // break;// Uncaught SyntaxError: Illegal break statement
      // continue;// Uncaught SyntaxError: Illegal continue statement: no surrounding iteration statement
      // return;// ["a", "b"] 成功跳出循环
      // return true;// ["a", "b", "d", "e"] 只能跳出本次循环
      return false; // ["a", "b"] 成功跳出循环
    }
    return show.push(item);
  });
  ```

- **参考资料：** [JS 中如何跳出循环/结束遍历](https://segmentfault.com/a/1190000020176190)

### 数组复制

- **规则：** （浅拷贝）
  - 数组是引用数据类型，直接赋值的话，只是复制了指针，而不是克隆一个全新的数组。
  - ES5 通过 concat 实现， ES6 通过`...`展开符实现

```js
// 【1】
const a1 = [1, 2];
const a2 = a1;
a2[0] = 2;
a1; // [2, 2]

// 【2】
const a1 = [1, 2];
const a2 = a1.concat();
a2[0] = 2;
a1; // [1, 2]

const a1 = [1, 2];
const a2 = [...a1];
// const [...a2] = a1;
```

### 数组合并

- **规则：** （浅拷贝）
  - ES5 通过 concat 实现， ES6 通过`...`展开符实现

```js
const arr1 = ['a', 'b'];
const arr2 = ['c'];
const arr3 = ['d', 'e'];

// ES5 的合并数组
arr1.concat(arr2, arr3); // [ 'a', 'b', 'c', 'd', 'e' ]
arr1 // ['a', 'b']

// ES6 的合并数组
[...arr1, ...arr2, ...arr3]
// [ 'a', 'b', 'c', 'd', 'e' ]


const a1 = [{ foo: 1 }];
const a2 = [{ bar: 2 }];

const a3 = a1.concat(a2);
const a4 = [...a1, ...a2];

a3[0] === a1[0] // true
a4[0] === a1[0] // true
```

### 数组元素分组

```jsx
const sprintTypeMap: Record<string, ISprintItem> = {
  start: {
    id: "start",
    label: sprintStatusMap.start,
    children: [],
  },
  doing: {
    id: "doing",
    label: sprintStatusMap.doing,
    children: [],
  },
  done: {
    id: "done",
    label: sprintStatusMap.done,
    children: [],
  },
};
sprintsData?.forEach((item) => {
  const mapItem = sprintTypeMap[item.sprintStatus];
  if (mapItem) {
    mapItem.children.push(item);
  } else {
    sprintTypeMap[item.sprintStatus] = {
      id: item.sprintStatus,
      label: sprintStatusMap[item.sprintStatus],
      children: [item],
    };
  }
});
setSprintList(Object.values(sprintTypeMap) || []);
```

### 数组去重

- **规则：** 只能去重基础数据类型元素数组
- **方法：**
  - 遍历原数组，用 indexof/includes
  - 原数组.filter，用 indexof
  - `[...new Set(array)]`
  - `Array.from(new Set(array))`

```js
// 【1】
var arr = ["a", "b", "a", "d", "b"];

function loopOne(array) {
  var res = [array[0]];
  for (var i = 1; i < array.length; i++) {
    //如果当前数组的第i项在当前数组中第一次出现的位置不是i，那么表示第i项是多余的，忽略掉，否则存入结果数组
    if (array.indexOf(array[i]) == i) {
      res.push(array[i]);
    }
  }
  return res;
}

function loopTwo(array) {
  var res = [array[0]];
  for (let i = 0; i < array.length; i++) {
    //如果当前数组的第i项不在在新数组中，则存入新数组
    if (res.indexOf(array[i]) === -1) {
      res.push(array[i]);
    }
  }
  return res;
}

function loopThree(array) {
  var res = [array[0]];
  for (let i = 0; i < array.length; i++) {
    //如果当前数组的第i项不在在新数组中，则存入新数组
    if (!res.includes(array[i])) {
      res.push(array[i]);
    }
  }
  return res;
}

// 【2】
const filterQC = (array) => {
  return array.filter((v, i, arr) => array.indexOf(v) === i);
};

// 【3】
const setQC = (array) => [...new Set(array)];
// set是ES6新出来的一种定义不重复数组的数据类型

// 【4】
const arrayFromQC = (array) => Array.from(new Set(array));
// Array.from是将类数组转化为数组

console.log(loopOne(arr)); // ['a', 'b', 'd']
console.log(loopTwo(arr)); // ['a', 'b', 'd']
console.log(loopThree(arr)); // ['a', 'b', 'd']
console.log(filterQC(arr)); // ['a', 'b', 'd']
console.log(setQC(arr)); // ['a', 'b', 'd']
console.log(arrayFromQC(arr)); // ['a', 'b', 'd']
```

### 数组最大值

- `Math.max.apply()`
- `Math.max(...array)`
- `Array.sort()`
- `Array.reduce()`

```js
const arr = [3, 5, 9, 2, 4]

Math.max.apply(null,arr) // 9
Math.max(...arr) // 9
[...arr].sort((a, b) => b-a)[0] // 9
arr.reduce((t, v) => v > t ? v : t) // 9
```

### 数组中随机获取成员

```js
const arr = [12, 548, "a", 2, 5478, "foo", 8852, 119];

function getRandowItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
```

### 扁平化 n 维数组

- **方法：**
  - 利用递归和数组合并方法 concat 实现扁平
  - Array.flat(n)是 ES10 扁平数组的 api，n 表示维度， n 值为 Infinity 时维度为无限大

```js
// 【1】
var arr = [].concat(...[1, [2, 3, 4, [2, 3, 4]]]) // [1, 2, 3, 4, [2, 3, 4]]
[].concat(...arr) // [1, 2, 3, 4, 2, 3, 4]


function flatten(arr) {
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}

console.log(flatten([1, [2, 3]])) // [1,2,3]
console.log(flatten([1, [2, 3, [4, 5]]])) // [1,2,3,4,5]

// 【2】
[1, [2, 3]].flat(2) //[1,2,3]
[1, [2, 3, [4, 5]].flat(3) //[1,2,3,4,5]
// [1[2, 3, [4, 5[...]].flat(Infinity) //[1,2,3,4...n]

[1, [2, 3, [4, 5]]].toString()  //'1,2,3,4,5'
[1, [2, 3, [4, 5]]].toString().split(',')  // ["1", "2", "3", "4", "5"]
```

### 类数组转化

```js
Array.prototype.slice.call(arguments) // arguments是类数组(伪数组)
Array.prototype.slice.apply(arguments)

Array.from(arguments)

[...arguments]
```

### 数组转换

- **数组与字符串的转换：**

  - **规则：**
    - 数组转字符串： `Array.prototype.join`
    - 字符串转数组： `String.prototype.split` （注意容错）

  ```js
  // 【1】
  var a = [0, 1, 2, 3, 4];
  b = a.join(); // "0,1,2,3,4"
  b = a.join("-"); // "0-1-2-3-4"
  b = a.join(""); // "01234"
  // 【2】
  var str = "";
  var res = str.split(","); //   [""]
  res = str ? str.split(",") : []; // []
  var s = "abc,abcd,aaa";
  s.split(","); // ["abc", "abcd", "aaa"]
  ```

- **数组与对象的转换：**

```js
const arr = [1, 2, 3, 4];
const newObj = { ...arr }; // {0: 1, 1: 2, 2: 3, 3: 4}
const obj = { 0: 0, 1: 1, 2: 2, length: 3 };
// 对象转数组不能用展开操作符，因为展开操作符必须用在可迭代对象上
let newArr = [...obj]; // Uncaught TypeError: object is not iterable...
// 可以使用Array.form()将类数组对象转为数组
let newArr = Array.from(obj); // [0, 1, 2]
```

### 数组交、并、补、差集

```js
const arrOne = [1, 2, 3, 4, 5];
const arrTwo = [5, 6, 7, 8, 9];

// 交集
const intersection = arrOne.filter((v) => arrTwo.includes(v));

// 并集
const union = arrOne.concat(arrTwo.filter((v) => !arrOne.includes(v)));

// 补集 两个数组各自没有的并的集合
const complement = arrOne
  .filter((v) => !arrTwo.includes(v))
  .concat(arrTwo.filter((v) => !arrOne.includes(v)));

// 差集 数组arrOne相对于arrTwo所没有的
const diff = arrOne.filter((v) => !arrTwo.includes(v));

// 交集
// intersection = [5]

// 并集
// union = [1, 2, 3, 4, 5, 6, 7, 8, 9]

// 补集
// complement = [6, 7, 8, 9, 1, 2, 3, 4]

// 差集
// diff = [1, 2, 3, 4]
```

## 其它

- 数组中间元素的下标

```js
const arrOne = ["一", "二", "三", "四", "五"];
const arrOneMidEleIndex = Math.floor(arrOne.length / 2); // 2

const arrTwo = ["一", "二", "三", "四"];
const arrTwoMidEleIndex = Math.floor(arrTwo.length / 2); // 2

const getArrMidEleIndex = (list) => {
  const len = list.length;
  if (!len) {
    return -1;
  }
  const midEleIndex = Math.floor(len / 2);
  // 偶数长度
  if (len % 2 === 0) {
    return [midEleIndex - 1, midEleIndex];
  }
  // 奇数长度
  return midEleIndex;
};
```
