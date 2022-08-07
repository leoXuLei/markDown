## Tips

```js
// src\utils\utils.tsx
export const getPercentFieldsRenderByNum = (num) => {
  const renderFun = (val) =>
    val || val === 0 ? formatNumber(val * 100, num) : "";
  return renderFun;
};

// src\constants\optionStyle\columnsMap.tsx
import { getPercentFieldsRenderByNum } from '@/utils';

const subsidyRate = {
  title: "补贴费率(%)",
  dataIndex: "subsidyRate",
  key: "subsidyRate",
  render: getPercentFieldsRenderByNum(4),
};

// 如上这种写法会执行getPercentFieldsRenderByNum函数，
// 但是引入后再编译的时候值是undefined，所以getPercentFieldsRenderByNum(4)会报错。
```
