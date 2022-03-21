# 官网配置项

## color

调色盘颜色列表。如果系列没有设置颜色，则会依次循环从该列表中取颜色作为系列颜色。 默认为：

```jsx
[
    '#409eff',
    '#91cc75',
    '#fac858',
    '#ee6666',
    '#73c0de',
    '#3ba272',
    '#fc8452',
    '#9a60b4',
    '#ea7ccc',
],
```

## Legend：图例：显示 item 的开关

```jsx
// 饼图 图例设置为垂直，超出分页
const legend = {
  type: "scroll",
  orient: "vertical", // 垂直方向
  top: "0%", // 紧贴上方
  height: "50%", // 设置图例高度
  // 图例的formatter
  formatter(name) {
    const objItem = handledLegendData?.[name];
    return `${name}  {valueStyle||  ${objItem?.value ?? ""}%}  ${
      objItem?.number ?? ""
    }${objItem?.unit}`;
  },
  textStyle: {
    rich: {
      valueStyle: {
        color: "#ccc",
      },
    },
  },
  icon: "circle", // 图例的icon
};
```

## Series：内容

### `type: "pie"`

```jsx
// 饼图 series如下
const series = [
  {
    name: "Access From",
    type: "pie",
    radius: ["40%", "70%"], // 配置半径
    center: ["50%", "50%"], // 配置圆心（可以实现图的平移）
    // left: '24%', // 向右移动，且大于24%就开始缩小了
    // left: '-70%', // 不缩小不放大，向左移动，且移到容器边缘超出部分就会被hidden
    // right: '20%', // 向左边移动，且大于24%就开始缩小了
    // right: '-40%', // 不缩小不放大，向右移动，且移到容器边缘超出部分就会被hidden
    avoidLabelOverlap: false,
    label: {
      show: false,
      position: "center",
    },
    emphasis: {
      label: {
        show: true,
        fontSize: "40",
        fontWeight: "bold",
      },
    },
    labelLine: {
      show: false,
    },
    data: [
      { value: 1048, name: "Search Engine" },
      { value: 735, name: "Direct" },
      { value: 580, name: "Email" },
      { value: 484, name: "Union Ads" },
      { value: 300, name: "Video Ads" },
    ],
  },
];
// left: '24%', // 向右移动，且大于24%就开始缩小了
// left: '-70%', // 不缩小不放大，向左移动，且移到容器边缘超出部分就会被hidden
// right: '20%', // 向左边移动，且大于24%就开始缩小了
// right: '-40%', // 不缩小不放大，向右移动，且移到容器边缘超出部分就会被hidden
```

# React

```jsx
import ReactEchartsCore from "echarts-for-react";
import { Empty } from "antd";

export const EmptyText = styled.span`
  color: #8c8c8c;
  font-size: 12px;
`;

return (
  <ReactEchartsCore
    notMerge
    lazyUpdate
    showLoading={loading}
    style={{ height: 280 }}
    option={option}
    theme="walden"
  />
);

return (
  <IfElseComponent
    checked={isNullOrEmptyArr(monthStatistics)}
    if={
      <Empty
        style={{ padding: 10 }}
        description={<EmptyText>暂无需求总览数据</EmptyText>}
      />
    }
    else={
      <ReactEcharts
        showLoading={loading}
        option={options}
        notMerge
        style={{ padding: 10 }}
      />
    }
  />
);
```

> 官网

- [ECharts for React 全网开发者下载量最高的 ECharts 的 React 组件封装](https://git.hust.cc/echarts-for-react/)

# Tips

## 多 Y 轴折柱混合官网实例

[多 Y 轴折柱混合官网实例](https://echarts.apache.org/examples/zh/editor.html?c=multiple-y-axis)

## 堆叠柱状图堆叠后的总量显示在最上面

- [见源码/堆叠柱状图]()
- [echarts 堆叠图添加总量](https://www.bbsmax.com/A/RnJWwOeRJq/)
- [Echarts 为柱状图添加多个 label 与动态调整 position 的方案](https://juejin.cn/post/6844904057958563847)

## 背景色

- [echarts 柱状图 渐变 背景透明](https://www.cnblogs.com/alinelong/p/12192649.html)

# 报错

## echarts 数据对但是图不显示

```js
// 报错如下：
Can't get DOM width or height. Please check dom.clientWidth and dom.clientHeight. They should not be 0.For example, you may need to call this in the callback of window.onload.
```
