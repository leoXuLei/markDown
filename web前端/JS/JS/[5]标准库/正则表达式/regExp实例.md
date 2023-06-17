# `String.prototype.replace()`使用实例

```tsx
const inputStr = 'PARAM("[U03.OP02].参数001.ST")';

// `参数001` 改为 `参数001xg` 后期望得到'PARAM("[U03.OP02].参数001xg.ST")'

inputStr.match(/(\])(\.)(.+)(\.)([A-Z]+)/g); // ['].参数001.ST']

inputStr.replace(/(\])(\.)(.+)(\.)([A-Z]+)/g, ""); // 'PARAM("[U03.OP02")'

inputStr.replace(/(\])(\.)(.+)(\.)([A-Z]+)/g, "$&");
// 'PARAM("[U03.OP02].参数001.ST")'
// $&：匹配的子字符串

inputStr.replace(/(\])(\.)(.+)(\.)([A-Z]+)/g, "$1");
// 'PARAM("[U03.OP02]")'
// $1：匹配成功的第n组内容(n=1) 即 ']'
// $2：匹配成功的第n组内容(n=2) 即 '.'
// $3：匹配成功的第n组内容(n=3) 即 一个或多个字符：参数001
// $4：匹配成功的第n组内容(n=4) 即 '.'
// $5：匹配成功的第n组内容(n=5) 即 一个或多个字母'ST'

inputStr.replace(/(\])(\.)(.+)(\.)([A-Z]+)/g, "$1$2");
// 'PARAM("[U03.OP02].")'

inputStr.replace(/(\])(\.)(.+)(\.)([A-Z]+)/g, "$1$2$3");
// 'PARAM("[U03.OP02].参数001")'

inputStr.replace(/(\])(\.)(.+)(\.)([A-Z]+)/g, "$1$2$3$4");
// 'PARAM("[U03.OP02].参数001.")'

inputStr.replace(/(\])(\.)(.+)(\.)([A-Z]+)/g, "$1$2$3$4$5");
// 'PARAM("[U03.OP02].参数001.ST")'
```

最终实现如下。

```tsx
// 被复制节点A及其后代节点的表达式相关属性（字符串属性，如sfc，param.expSrc）需要替换表达式中A的名称为复制后的节点的名称
const replaceStepItemPartsProperty = (property: string) => {
  return oldFormattedParam && latestFormattedParam
    ? property?.replace(
        new RegExp(`(\])(\.)(${oldFormattedParam})(\.)`, "g"),
        `$1$2${latestFormattedParam}$4`
      )
    : property;
};
```

# 匹配邮箱

```js
var reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
// 分析过程
//   ^[a-zA-Z0-9_.-]+  ：字母/数字/下划线/./横杠 至少一个
//   @
//   [a-zA-Z0-9-]+   ： 字母/数字/横杠 至少一个
//   (\.[a-zA-Z0-9-]+)*    ：.+字母/数字/横杠（多个）  整体0个或多个
//   \.[a-zA-Z0-9]{2,6}$   ： 结尾是  .+字母/数字（2个到6个）

console.log(reg.test("1611928589@qq.com")); // true
console.log(reg.test("_.@test.test.com")); // true
console.log(reg.test("_.@.test.com")); // false
console.log(reg.test("_.@qq.c")); // false
```

# 匹配电话

- 国内电话格式

  0555-6581752、021-86128488

- 分析

  - 拆成（取值范围+量词）这样的组合

    这里拆成两个组合
    `（数字0，1个）+（数字0~9，3个）+("-"，1个)+（数字1~9，1个）+（数0~9，6个）`
    `（数字0，1个）+（数字0~9，2个）+("-"，1个)+（数字1~9，1个）+（数0~9，7个）`

  - 根据正则表达式规则翻译（取值范围+量词）

    `([0],{1})+([0-9],{3})+"-"+([1-9],{1})+([0,9],{6})`
    `([0],{1})+([0-9],{2})+"-"+([1-9],{1})+([0,9],{7})`

  - 将翻译好的（取值范围+量词）组合进行拼接
    `/(^0[0-9]{3}-[1-9][0-9]{6}$)|(^0[0-9]{2}-[1-9][0-9]{7}$)/`

# 匹配包含中文

```js
var reg = /[\u4e00-\u9fa5]/;
// \u4e00是Unicode中汉字的开始，\u9fa5则是Unicode中汉字的结束

console.log(reg.test("23dasd哦")); // true
console.log(reg.test("test.test.com")); // false
```

# 匹配只包含数字和字母的 8-16 位字符串

```js
var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
//  分析： (?![0-9]+$)表示该位置以后不全是数字，(?![a-zA-Z]+$)表示该位置以后不全是字母
console.log(reg.test("1234567a")); // true
console.log(reg.test("1234567")); // false
console.log(reg.test("12345678")); // false
console.log(reg.test("123456a@")); // false
```

# input 输入框只能输入正整数

```js
<InputNumber parser={value => value.replace(/^(0+)|[^\d]+/g, '')}
```

# 文件内所有下划线变量名替换成驼峰

- vscode 安装 `change-case` 插件
- vscode 文件内 `ctrl+f` 输入正则 `([a-z]+_)+\w+`, 且支持手动选择大小写
- `ctrl+shift+L` 全选匹配项，`ctrl+shift+P` 搜索`change case`, `change case camel`转为驼峰，`change case constant`转为常量

```js
//  'participation_rate_2', 经过替换后变成 'participationRate_2'
//  如需要将最后面数字前面下划线去掉，再 `ctrl+f` 输入正则 ([a-z]{1,})_([0-9])，加上替换 $1$2，即可解决
```

# 数字控件每隔三位加个`,`

```js
export const formatNum = (num) => {
  return String(num).indexOf(".") === -1
    ? num.replace(/(\d)(?=(?:\d{3})+$)/g, "$1,")
    : num.replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
};

// 22,310
// 22,310.0
// 23,220.36513
```

# 数字去掉末尾无效的零

```js
export const formatYieldRate = (num) =>
  String(num).replace(/(\.\d*[1-9]?)0+$/g, "$1");

formatYieldRate(2.99088375); // "2.99088375"
formatYieldRate(2.0); // "2"
formatYieldRate(2.01); // "2.01"
formatYieldRate(2000.0); // "2000"
formatYieldRate(2000.1); // "2000.1"
```

# 数据中的长 `number` 精度丢失需加引号

接口返回数据中的长 `number` 精度丢失需要加引号。
详细见`浏览器-chrome-联调`。

# 文本不允许使用中文或特殊字符

**【需求】**： Name 和 Version 不允许使用中文或特殊字符，长度不超过 32 个字符

```js
// 参考链接中的常见特殊字符都测过了，经测试能通过的字符有【_/;:\|】，此外版本还支持【.】

const nameReg = /^[a-zA-Z0-9_/;:\|]{1,32}$/;
const versionReg = /^[a-zA-Z0-9_/;:\|.]{1,32}$/; // 版本多支持一个.
// 如上，仅支持输入字母、数字、某些特殊字符

const isNameOrVersionCharacterQualified =
  nameReg.test(trimmedName) && versionReg.test(trimmedVersion);
if (
  isNameAndVersionRepeated ||
  isNameOrVersionNull ||
  !isNameOrVersionCharacterQualified
) {
  const warnText = formatMessage({
    id: "recipe.addWarnNameAndVersionRepeated",
  });
  message.warn(warnText);
}
```

```jsx
// 参考链接中的常见特殊字符例子
const testReg =
  /[a-zA-Z0-9_.,\\-()/=+?!*;@#:%\\[\\]‘\\\\${}^|~\\n\\r\\t ]{1,35}/;
```

**【参考链接】**：

- [Java 正则——不允许中文，只允许数字+字母+部分特殊符号](https://cloud.tencent.com/developer/article/1764738?ivk_sa=1024320u)

# 校验字段输入/不能输入特殊字符

```tsx
// 配方编辑器客户端特殊字符   ~!@#$%^&*)({[]}\'\",<>?\\=+-

// 英文输入法下各种字符如下：`~!@#$%\^&*)(  _+=-  []{}\|  ;':"  ,./<>?
// 中文输入法下各种字符如下：·~！@#￥%……&*（）——+-=  【】{}、|  ；‘’：“”  ，。、《》？
//    ……和——比较特殊，重复两次，用一半即可

// 允许使用英文、数字、英文特殊字符，长度不超过 32 个字符！
//      字符组内需要转义的字符：[ ] \ - ^
// (但是-加了转义字符后 \- Reg中颜色没有发生变化，可能-不需要加转义字符)
export const canUseCNAndNumberAndENSpecialCharactersReg =
  /^[a-zA-Z0-9`~!@#$%\^&*)(_+=\-\[\]{}\\|;':",./<>?]{1,32}$/;

// 允许使用英文、数字、中文特殊字符，长度不超过 32 个字符！
export const canUseCNAndNumberAndCNSpecialCharactersReg =
  /^[a-zA-Z0-9·~！@#￥%…&*（）—+-=【】{}、|；‘’：“”，。、《》？]{1,32}$/;
```

# 学以致用

## md 文件中每一层级标题都缩进一次

**【需求】**

md 文件由于一级标题跟文件名有重复，且层级太多了。期望非一级标题都减少一级。

md 文件中的标题 N 个`#`变成 (N-1)个`#`。比如 `#` 变为 空字符串，`##` 变为 `#`，`### 变为 `##`，以此类推。

**【解决方法】**

vscode md 文件中`ctrl + F`。`Alt + R`匹配字符串，匹配框输入正则表达式`(#)(#*)`，替换输入框输入`$2`。即可实现需求，然后把替换之前的一级标题，即替换之后的那个纯文本删除即可。

# 问题

## 字符串字段输入引号导致 sfc 渲染不出来

**【问题描述】**：没有处理之前，输入引号后，sfc 程序渲染不出来，控制台报错`cannot read data from undefined`，应该是 x6 内部解析时数据有问题又没有做容错。

**【解决方法】**：处理如下，修改时通过正则替换双引号为`"&quot;"`。问题解决。

```tsx
// 更新转换描述
operateTargetNode.attributes.description = (
  param?.transitionDescription || ""
)?.replace(/\"/g, "&quot;");
```

同时需要注意，读的时候，即获取值展示在界面之前还要反向转换一下。不然界面上引号都会变成`&quot;`

```tsx
setFormValues((prev) => ({
  ...prev,
  transitionDescription: (description || "")?.replace(/&quot;/g, '"'),
}));
```

# 参考链接

- [你是如何学会正则表达式的](https://www.zhihu.com/question/48219401/answer/742444326)
- [learn-regex](https://github.com/ziishaned/learn-regex)
- [在线练习](https://regex101.com/r/xc9GkU/1)
- [JS 正则可视化的工具](https://regexper.com/#%28%5Ba-z%5D%2B_%29%2B%5Cw%2B)
- [@@JS 正则表达式在线测试工具](http://tools.jb51.net/regex/javascript)
- [url 的正则表达式：path-to-regexp](https://www.jianshu.com/p/7d2dbfdd1b0f)
