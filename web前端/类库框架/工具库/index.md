# CSS 库

# JS 库

## `Moment.js`

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

## `bignumber.js`: 处理数据运算

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

## `big.js`: 大数值精确计算

"big.js" 是一个用于处理大数值精确计算的 JavaScript 库。它提供了一些常用的 API 来执行高精度计算。以下是一些 big.js 常用的 API：

1. 创建 Big 对象：

`new Big(value)`: 使用字符串、数字或另一个 Big 对象创建一个新的 Big 对象。

2. 基本操作：

- `plus(n)`: 将当前 Big 对象与 n 相加。别名：`add` +
- `minus(n)`: 从当前 Big 对象中减去 n。别名：`sub` -
- `times(n)`: 将当前 Big 对象乘以 n。 别名：`mul` \*
- `div(n)`: 将当前 Big 对象除以 n。
- `mod(n)`: 返回当前 Big 对象对 n 取模的结果。 即`%`，取余数，如`10%3===1`
- `pow(n)`: 将当前 Big 对象提升到指定幂次 n。
- `neg()`：用于获取当前 Big 对象的相反数，并返回结果的新实例。相反数是指与原数值大小相等但符号相反的数。如`Big(5).neg()===-5`

3. 比较和判断：

- `eq(n)`: 判断当前 Big 对象是否等于 n。
- `gt(n)`: 判断当前 Big 对象是否大于 n。
- `gte(n)`: 判断当前 Big 对象是否大于等于 n。
- `lt(n)`: 判断当前 Big 对象是否小于 n。
- `lte(n)`: 判断当前 Big 对象是否小于等于 n。

4. 转换和格式化：

- `toFixed(dp)`: 返回当前 Big 对象的字符串表示，固定小数位数为 dp。
- `toExponential(dp)`: 返回当前 Big 对象的指数表示，小数位数为 dp。
- `toPrecision(sd)`: 返回当前 Big 对象的字符串表示，有效位数为 sd。

这些只是 big.js 提供的一部分 API。你可以参考 big.js 的文档来了解更多关于该库的功能和用法。

## `path-to-regexp`: url 的正则表达式

**【引入方式】：**

```jsx
// 正确引入方式

const pathToRegexp = require('path-to-regexp');

const res = showRoutes.map((v) =>
  pathToRegexp?.(v.path!)?.test?.(location.pathname),
);
```

```jsx
// import pathToRegexp from 'path-to-regexp';
// 这种方式引入能执行成功但是界面TS报错，如下：

// 此表达式不可调用。
//   类型 `typeof import("xxx/node_modules/path-to-regexp/dist/index")` 没有调用签名。ts(2349)

// import { pathToRegexp } from 'path-to-regexp';
// 这种方式引入代码没有TS报错，但是打印函数`pathToRegexp`都是undefined，不对。

// const { pathToRegexp } = require('path-to-regexp');
// 这种方式（官网就是）引入代码没有TS报错，但是打印函数`pathToRegexp`都是undefined，不对。
```

**【使用实例】：**

```js
const pathToRegexp = require("path-to-regexp");

// 获取路由中最后一个/后面的内容
// const id = record?.tabKey?.substring?.(
//   record?.tabKey?.lastIndexOf?.('/') + 1,
// );

const { pathname, search, query } = location;

// 判断当前页面是否批评详情页的动态路由
const isRecipeDetailPage =
  pathToRegexp?.("/recipeDetail/:id")?.test?.(pathname);
```

**【参考链接】：**

- [url 的正则表达式：path-to-regexp](https://www.jianshu.com/p/7d2dbfdd1b0f)

## `qs`: url 中参数 <=> 对象 （互转）

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

# JS 数据操作库

- [immer —— 提高 React 开发效率的神器](https://zhuanlan.zhihu.com/p/146773995)

## `immmer`: 处理`immutable data`

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

### 问题

> （1）报错`Cannot add property 2, object is not extensible`

**【描述】**

详细报错信息如下：

```bash
index.ts:211 Uncaught TypeError: Cannot add property 2, object is not extensible
    at Array.push (<anonymous>)
    at dfs (index.ts:211:1)
    at dfs (index.ts:154:1)
    at dfs (index.ts:245:1)
    at dfs (index.ts:245:1)
    at TeachingSchedulingService.permuteTeachingScheduling (index.ts:273:1)
    at new TeachingSchedulingService (index.ts:52:1)
```

**【产生原因】**

使用 immer 处理数组后，处理后的数组会变成不可扩展（non-extensible）的数组。所以再改变该数组（如新增元素`push`），会报错如上。

**【解决方法】**

使用 immer 处理数组后再将原数组每个元素重新映射。如下。

```js
// 使用 immer 进行深拷贝（并重新映射每个元素的属性），拷贝一份当前排课方案，加入解集res
const deepCopiedPath = produce(path.slice(), (draft) => {
  // 当前排课方案按照courseSchedulingKey属性排序
  return draft.sort((a, b) =>
    a?.courseSchedulingKey?.localeCompare(b?.courseSchedulingKey, "zh")
  );
}).map((item) => ({ ...item }));
```

## `immutability-helper`

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

**【参考链接】：**

- [使用 immutability-helper 更好的更新复杂数据](https://www.jianshu.com/p/5f749e90a6a2)
- [使用 immutability-helper 的经验教训](https://www.jianshu.com/p/5d44a831fad1)

## 比对对象是否修改过

一般用来控制保存按钮是否可点击，修改过了才可点击

```jsx
import deepEqual from "fast-deep-equal";

useEffect(() => {
  setHasModified(!deepEqual(milestones, currentMilestones));
}, [milestones, currentMilestones]);
```

# `Ramda`：函数式编程库

- [Ramda 官网\_\_一款实用的 JavaScript 函数式编程库](https://ramda.cn/docs/#isNil)

# `uuid`

```jsx
"7314c08f-444b-4df1-97eb-a2372f2fb348".replace(/[-a-z]/g, "");
// ("731408444419723722348");
```

# `react-helmet`: 管理文档头

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

# `react-json-view`

RJV 是一个 React 组件，用于显示和编辑 javascript 数组和 JSON 对象。

# `xlsx`

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
-

# `react-color`

- [ReactColor 主页](http://casesandberg.github.io/react-color/)

**【Ask chatGpt】**
Q：如何将 rgba 值转为 hex 值

A:

将 RGBA 颜色表示中的红绿蓝三个分量值转换为十六进制数，并将它们连接在一起形成十六进制颜色表示。具体实现方法如下：

```tsx
function rgbaToHex(r, g, b, a) {
  // 将10进制的RGB值转换为16进制，并使用 padStart 确保每个分量都是两位数
  const hexR = r.toString(16).padStart(2, "0");
  const hexG = g.toString(16).padStart(2, "0");
  const hexB = b.toString(16).padStart(2, "0");
  // 将透明度 a 值乘以255并向下取整，然后转换为16进制数
  const hexA = Math.floor(a * 255)
    .toString(16)
    .padStart(2, "0");
  // 将四个分量的16进制值连接成一个字符串
  return `#${hexR}${hexG}${hexB}${hexA}`;
}

// 示例用法
const { r, g, b, a } = { r: 255, g: 0, b: 128, a: 0.5 }; // 假设这里有一个RGBA颜色表示
const hexColor = rgbaToHex(r, g, b, a); // 转换为十六进制颜色表示
console.log(hexColor); // 输出 "#ff008080"
```

上述代码中，rgbaToHex 函数接收四个参数 r、g、b 和 a，分别代表 RGBA 颜色表示中的红、绿、蓝和透明度分量。函数内部先将每个分量值分别转换为对应的两位数的十六进制数，并将它们连接在一起得到一个带有 # 前缀的字符串。这里的透明度分量需要乘以 255 并向下取整得到对应的 8 位 16 进制数。最后返回这个字符串作为结果。

**【Ask chatGpt】**

Q: react-color 的 ChromePicker 组件 onChange 回调的参数如下，每个属性是什么意思？

```tsx
<ChromePicker
  color={color}
  onChange={(colorResult) => {
    console.log("colorResult", colorResult);
    setColor(colorResult.hex);
    props?.onChange?.(colorResult.hex);
  }}
/>
```

```js
const colorResult = {
    "hsl": {
        "h": 202.17391304347825,
        "s": 0.6272,
        "l": 0.4313,
        "a": 1
    },
    "hex": "#2980b3",
    "rgb": {
        "r": 41,
        "g": 128,
        "b": 179,
        "a": 1
    },
    "hsv": {
        "h": 202.17391304347825,
        "s": 0.7708947885939036,
        "v": 0.70181136,
        "a": 1
    },
    "oldHue": 202.17391304347825,
    "source": "rgb"
}tsx
```

A:

该回调函数的参数对象包含以下属性：

- hsl（HSL 颜色表示），其中 h 表示色相，s 表示饱和度，l 表示明度，a 表示不透明度。
- hex（十六进制颜色表示）。
- rgb（RGB 颜色表示），其中 r 表示红色分量，g 表示绿色分量，b 表示蓝色分量，a 表示不透明度。
- hsv（HSV 颜色表示），其中 h 表示色相，s 表示饱和度，v 表示亮度，a 表示不透明度。
- oldHue（前一个色相值）。
- source（当前颜色选择器的来源）。
