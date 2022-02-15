## 空值合并运算符：`??`

> `??`是一个逻辑运算符。==当左侧操作数为 null 或 undefined 时，其返回右侧的操作数。否则返回左侧的操作数==。
> 即是 `||` 的子集。

ES6 中一个对象里面的属性，如果这个属性没有值，我们会这样给他一个默认值。

```js
let user = {
  name: "Symbol卢",
  age: 18,
};
console.log(user.name); // Symbol卢 name
console.log(user.sex); // undefined
console.log(user.sex || "男人"); // || 符号前面的表达式或者属性的 Boolean值 若为false，则取 ||符号后面的表达式或者属性。
```

```js
// ES2020 的空值合并操作符 `??`
console.log(user.sex ?? "男"); //男  不存在这个sex属性，就会走后面的默认值，如果存在这个sex属性，就不会走后面的默认值

// 验证如下
0 ?? "default"; // 0
false ?? "default"; // false
"" ?? "default"; // ''
NaN ?? "default"; // NaN
undefined ?? "default"; // 'default'
null ?? "default"; // 'default'
```

## `??=`空赋值运算符

??= 也被称为空赋值运算符，与上面的非空运算符相关。看看它们之间的联系：

```jsx
var x = null;
var y = 5;
console.log((x ??= y)); // => 5
console.log((x = x ?? y)); // => 5
```

==仅当值为 null 或 undefined 时，此赋值运算符才会赋值==。上面的例子强调了这个运算符本质上是空赋值的语法糖（译者注，类似的语法糖：a = a + b 可写成 a += b ）。接下来，让我们看看这个运算符与默认参数（译者注，默认参数是 ES6 引入的新语法，仅当函数参数为 undefined 时，给它设置一个默认值）的区别：

```jsx
function gameSettingsWithNullish(options) {
  options.gameSpeed ??= 1;
  options.gameDiff ??= "easy";
  return options;
}
function gameSettingsWithDefaultParams(gameSpeed = 1, gameDiff = "easy") {
  return { gameSpeed, gameDiff };
}
gameSettingsWithNullish({ gameSpeed: null, gameDiff: null }); // => {gameSpeed: 1, gameDiff: 'easy'}
gameSettingsWithDefaultParams(undefined, null); // => {gameSpeed: 1, gameDiff: null}
```

## 可选链操作符：`?.`

减少访问深层对象时判断属性存不存在的问题。

```js
const a = {};

console.log(a.b.c); // 这里会报Err， Uncaught TypeError: Cannot read property 'c' of undefined

console.log(a?.b?.c); // undefined
console.log(a?.b?.c ?? "no Work"); // 'no Work'
console.log(a?.b?.c ?? "default"); //'default'
```

可选链中的 ? 表示如果问号左边表达式有值, 就会继续查询问号后面的字段。根据上面可以看出，==用可选链可以大量简化类似繁琐的前置校验操作，而且更安全==。

## 实例

```jsx
{projectDetail?.configItems?.includes?.('configProjectTemplate')
? lang.approvalFlow
: lang?.mileageCard}


baseLine={overviewData?.[trendChartType]?.baseline}

```
