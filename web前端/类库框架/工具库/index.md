## CSS 库

## JS 库

### Moment.js

[在线时间戳转年月日时分秒](http://www.metools.info/code/c31.html)
[官网](http://momentjs.cn/docs/)

```js
import moment, { isMoment } from 'moment';

moment().format('YYYY-MM-DD HH:mm:ss'))


if (isMoment(val)) {
  return val.format('YYYY-MM-DD');
}


moment(createTime?.[0])?.valueOf?.() // 1633059682016 // moment转时间戳


const diffSeconds = moment().diff(moment(lastNodeFirstPhase?.gmtModified), 'seconds') > 30 // 获取当前时间与xx时间的秒数差

```

```jsx
// 比较时间前后，更多api见 【TS/guide/advancedType.md/字符串字面量类型
useEffect(() => {
  console.log(
    "1：错误格式比较 :>> ",
    moment("2021年09月24日").isAfter("2021年09月25日")
  );
  console.log(
    "2：错误格式比较 :>> ",
    moment("2021年09月25日").isAfter("2021年09月25日")
  );
  console.log(
    "3：错误格式比较 :>> ",
    moment("2021年09月26日").isAfter("2021年09月25日")
  );

  console.log(
    "4：正确格式比较 :>> ",
    moment("2021-09-24").isAfter("2021-09-25")
  );
  console.log(
    "5：正确格式比较 :>> ",
    moment("2021-09-25").isAfter("2021-09-25")
  );
  console.log(
    "6：正确格式比较 :>> ",
    moment("2021-09-26").isAfter("2021-09-25")
  );

  // 1：错误格式比较 :>>  false
  // 2：错误格式比较 :>>  false
  // 3：错误格式比较 :>>  false

  // 4：错误格式比较 :>>  false
  // 5：错误格式比较 :>>  false
  // 6：错误格式比较 :>>  true
}, []);
```

### bignumber.js: 处理数据运算

```js
import BigNumber from "bignumber.js";

new BigNumber(null).decimalPlaces(4).toNumber(); // NaN
new BigNumber(undefined).decimalPlaces(4).toNumber(); // NaN
new BigNumber(NaN).decimalPlaces(4).toNumber(); // NaN
new BigNumber(0).decimalPlaces(4).toNumber(); // 0
new BigNumber("").decimalPlaces(4).toNumber(); // NaN

new BigNumber(arr[0]).plus(step).toNumber(), // 加：plus
  new BigNumber(arr[1]).minus(step).toNumber(), // 减: minus
  new BigNumber(text).multipliedBy(100).toNumber(); // 乘: multipliedBy
// import { multiply } from 'mathjs';
// render: (val) => `${formatNumber(multiply(val, 100), 4)}%`,
new BigNumber(arr[0] + arr[1]).div(2).toNumber(); // 除：div
```

```js
new BigNumber(10000).div(1000).toNumber(); // 10  number
new BigNumber(10000).div(1000).toFormat(); // '10'  string
new BigNumber(10000).div(1000).toFormat().toNumber(); //toNumber is not a function
new BigNumber(3945.205479452055).toFormat(2); // '3,945.21' string
new BigNumber(3.456).toFixed(2); // '3.46'

moment.isMoment(); // 检查变量是否为 moment 对象
```

```js
/**
 *
 *
 * @param {*} value
 * @param {*} decimalPlaces 小数位数
 * @param {*} roundingMode
 * @param {*} config
 * @return {*}
 */
export const formatNumber = (value, decimalPlaces, roundingMode, config) => {
  if (!Number.isFinite(Number(value)) || _.isNull(value)) {
    return "";
  }
  return new BigNumber(value).toFormat(decimalPlaces, roundingMode, config);
};
```

```js
{
  title: '收益率(%)',
  dataIndex: 'yield',
  key: 'yield',
  // render: val => formatNumber(val * 100, 4), 此时若val为null，也会显示 0
  render: val => (val || val === 0 ? formatNumber(val * 100, 4) : ''),
},
```

**加法 plus：**

- 语法
  `.plus(n [, base])`
  - 参数值
    - n (必需): `number|string|BigNumber` 参与计算的数字
    - base: number 进制 (默认为十进制)

```js
0.1 + 0.2; // 0.30000000000000004
x = new BigNumber(0.1);
y = x.plus(0.2); // '0.3'
BigNumber(0.7).plus(x).plus(y); // '1'
x.plus("0.1", 8); // '0.225'
```

**减法 minus：**

- 语法
  `.minus(n [, base])`
  - 参数值
    - n (必需): `number|string|BigNumber` 参与计算的数字
    - base: number 进制 (默认为十进制)

```js
0.3 - 0.1; // 0.19999999999999998
x = new BigNumber(0.3);
x.minus(0.1); // '0.2'
x.minus(0.6, 20); // '0'
```

**乘法 multipliedBy：**

- 语法
  `.times(n [, base])`
  - 参数值
    - n (必需): `number|string|BigNumber` 参与计算的数字
    - base: number 进制 (默认为十进制)

```js
0.6 * 3; // 1.7999999999999998
x = new BigNumber(0.6);
y = x.multipliedBy(3); // '1.8'
BigNumber("7e+500").times(y); // '1.26e+501'
x.multipliedBy("-a", 16); // '-6'
```

**除法 dividedBy：**

- 语法
  `.div(n [, base])`
  - 参数值
    - n (必需): `number|string|BigNumber` 参与计算的数字
    - base: number 进制 (默认为十进制)

```js
x = new BigNumber(355);
y = new BigNumber(113);
x.dividedBy(y); // '3.14159292035398230088'
x.div(5); // '71'
x.div(47, 16); // '5'
```

**四舍五入 toFixed：**

- 语法
  `.toFixed([dp [, rm]])`
  - 参数值
    - dp (必需): number 保留小数位数
    - rm: number

```js
x = 3.456;
y = new BigNumber(x);
x.toFixed(); // '3'
y.toFixed(); // '3.456'
y.toFixed(0); // '3'
x.toFixed(2); // '3.46'
y.toFixed(2); // '3.46'
y.toFixed(2, 1); // '3.45'  (ROUND_DOWN)
x.toFixed(5); // '3.45600'
y.toFixed(5); // '3.45600'
```

**参考：**

- [bignumber.js API](https://www.jianshu.com/p/f5d3e379744c?rjxgcFrom=http%3A%2F%2Frjxgc.com&fromSiteName=190Tech)

### path-to-regexp: url 的正则表达式

```js
//  "path-to-regexp": "^2.4.0",
import pathToRegexp from "path-to-regexp";
```

**参考：**

- [url 的正则表达式：path-to-regexp](https://www.jianshu.com/p/7d2dbfdd1b0f)

### react-helmet: 管理文档头

```js
//  "react-helmet": "^5.2.1",
import React from "react";
import { Helmet } from "react-helmet";

class Application extends React.Component {
  render() {
    return (
      <div className="application">
        <Helmet>
          <meta charSet="utf-8" />
          <title>My Title</title>
          <link rel="canonical" href="http://mysite.com/example" />
        </Helmet>
        ...
      </div>
    );
  }
}
```

### qs: url 中参数 <=> 对象 （互转）

将 url 中的参数转为对象；将对象转为 url 参数形式

```js
import qs from 'qs';
const url = 'method=query_sql_dataset_data&projectId=85&appToken=7d22e38e-5717-11e7-907b-a6006ad3dba0';
// 转为对象
console.log(qs.parse(url));
const a = {name:'hehe',age:10};
// 转为url参数形式
console.log(qs.stringify(a))

{
  method: 'query_sql_dataset_data',
  projectId: '85',
  appToken: '7d22e38e-5717-11e7-907b-a6006ad3dba0',
}

'name=hehe&age=10'
```

### react-json-view

RJV 是一个 React 组件，用于显示和编辑 javascript 数组和 JSON 对象。

### xlsx

导出 excel 表格工具的库

#### 前端实现导出 excel 单元格合并

优点：有很多实用方便的方法和格式转换
缺点：调整样式只有付费版可以修改

```js
工具方法：
aoa_to_sheet 将JS数据数组转换为工作表。
json_to_sheet 将JS对象数组转换为工作表。
table_to_sheet 将DOM TABLE元素转换为工作表。
sheet_add_aoa 将JS数据数组添加到现有工作表中。
sheet_add_json 将JS对象数组添加到现有工作表中。

sheet_to_json 将工作表对象转换为JSON对象数组。
sheet_to_csv 生成定界符分隔值输出。
sheet_to_txt 生成UTF16格式的文本。
sheet_to_html 生成HTML输出。
sheet_to_formulae 生成公式列表（具有值后备）。
```

**链接：**

- [前端实现导出 excel 单元格合并](https://www.jianshu.com/p/990d178fa2fc)
- [sheetJS--github](https://github.com/sheetjs/sheetjs)
- [纯前端利用 js-xlsx 之合并单元格(3)](https://www.jianshu.com/p/5c131c27841c)

# JS 数据操作库

- [immer —— 提高 React 开发效率的神器](https://zhuanlan.zhihu.com/p/146773995)

## immmer: 处理`immutable data`

> **好处：Immer 简化了对不可变数据结构的处理**

Immer 可用于需要使用不可变数据结构的任何上下文。例如与 React 状态、React 或 Redux 减速器或配置管理相结合。不可变数据结构允许（高效）更改检测：如果对对象的引用没有更改，则对象本身也不会更改。此外，它使克隆相对便宜：数据树的未更改部分不需要复制，并且与相同状态的旧版本共享在内存中。

一般来说，这些好处可以通过确保永远不会更改对象、数组或映射的任何属性来实现，而是始终创建一个更改过的副本。在实践中，这会导致代码编写起来非常麻烦，并且很容易意外违反这些约束。Immer 将通过解决这些痛点来帮助您遵循不可变数据范式：

- Immer 将检测到意外突变并抛出错误。
- Immer 将消除对创建不可变对象的深度更新时所需的典型样板代码的需要：如果没有 Immer，需要在每个级别手动制作对象副本。通常通过使用大量...传播操作。使用 Immer 时，会对 draft 对象进行更改，记录更改并负责创建必要的副本，而不会影响原始对象。
- 使用 Immer 时，您无需学习专用 API 或数据结构即可从范式中受益。借助 Immer，您将使用纯 JavaScript 数据结构，并安全地使用众所周知的可变 JavaScript API。

```jsx
// project项目使用实例
const [localValue, setLocalValue] = useState<ITaskField[]>([])

const onClick = useCallback((column: ITaskField) => {
    if (isProtectedField(column)) return

    setLocalValue?.(
      produce((draft) => {
        const target = draft.find((col) => col.fieldId === column.fieldId)

        if (!target) return

        target.hidden = !target.hidden
      }),
    )
  }, [])
```

```jsx
import produce from "immer";

const lastest = produce(subCards, (draft) => {
  draft.splice(index, 1);
  draft.splice(atIndex, 0, card);
});
```

## immutability-helper

```jsx
const moveCard = useCallback(
  (id: string, atIndex: number) => {
    const { card, index } = findCard?.(id);
    const lastest = update(subCards, {
      $splice: [
        [index, 1],
        [atIndex, 0, card],
      ],
    });
    console.log(
      "lastest",
      lastest?.map((v) => v.name)
    );
    setSubCards(lastest);
  },
  [findCard, subCards, setSubCards]
);
```

[使用 immutability-helper 更好的更新复杂数据](https://www.jianshu.com/p/5f749e90a6a2)
[使用 immutability-helper 的经验教训](https://www.jianshu.com/p/5d44a831fad1)
