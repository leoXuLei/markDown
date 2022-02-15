## 判断对象的数据类型

```js
export default const  judgeType = (obj) {
  if (typeof obj !== "object") {
    return typeof obj;
  }
  return Object.prototype.toString
    .call(obj)
    .replace("[object ", "")
    .replace("]", "").toLowerCase();
}

console.log(judgeType(123)); // number
console.log(judgeType("123")); // string
console.log(judgeType(false)); // boolean
console.log(judgeType(NaN)); // number
console.log(judgeType(undefined)); // undefined
console.log(judgeType(Symbol("123"))); // symbol
console.log(judgeType([])); // array
console.log(judgeType({})); // object
console.log(judgeType(function () {})); // function
```
