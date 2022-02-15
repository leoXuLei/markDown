# 简介

## 定义

styled-components 是一个 React 的第三方库，是 CSS in JS 的优秀实践。

## CSS 的痛点

==它易于上手、却难以精通。它没有变量、函数等概念导致它的表现力要稍弱于其它语言，而它索要解决的问题却又很复杂==。 关于这一点，[为什么 CSS 这么难学？](https://www.zhihu.com/question/66167982)这个问题下的一百多个答案就很能说明问题了。

日常使用中，CSS 的痛点很多，但大多围绕以下两点：

- ==全局污染==：CSS 选择器的作用域是全局的，所以很容易引起选择器冲突；而为了避免全局冲突，又会导致类命名的复杂度上升
- ==复用性低==：CSS 缺少抽象的机制，选择器很容易出现重复，不利于维护和复用

## CSS in JS

随着组件化时代的来临，前端应用开始从组件的层面对 CSS 进行封装：

- 也就是通过 JS 来声明、抽象样式从而提高组件的可维护性；
- 在组件加载时动态的加载样式，
- 动态生成类名从而避免全局污染。

`styled-components`就是其中的佼佼者。

顾名思义， ==`styled-components`以组件的形式来声明样式，让样式也成为组件从而分离逻辑组件与展示组件（这个思路看起来是不是很眼熟）==，来看一下官方的示例：

```jsx
const Button = styled.a`
  /* This renders the buttons above... Edit me! */
  display: inline-block;
  border-radius: 3px;
  padding: 0.5rem 0;
  margin: 0.5rem 1rem;
  width: 11rem;
  background: transparent;
  color: white;
  border: 2px solid white;

  /* The GitHub button is a primary button
   * edit this to target it specifically! */
  ${(props) =>
    props.primary &&
    css`
      background: white;
      color: palevioletred;
    `}
`;

render(
  <div>
    <Button
      href="https://github.com/styled-components/styled-components"
      target="_blank"
      rel="noopener"
      primary
    >
      GitHub
    </Button>

    <Button as={Link} href="/docs" prefetch>
      Documentation
    </Button>
  </div>
);
```

可以看到， `styled-components`通过标记的模板字符来设置组件样式.

它移除了组件和样式之间的映射.当我们通过 `styled-components`定义样式时,我们实际上是创建了一个附加了样式的常规 React 组件.

同时它支持将 `props`以插值的方式传递给组件,以调整组件样式.

官方宣称 `styled-components`的优点如下：

- Automatic critical CSS: styled-components 持续跟踪页面上渲染的组件,并向自动其注入且仅注入样式. 结合使用代码拆分, 可以实现仅加载所需的最少代码.

- 解决了 class name 冲突: styled-components 为样式生成唯一的 class name. 开发者不必再担心 class name 重复,覆盖和拼写错误的问题.

- CSS 更容易移除: 想要确切的知道代码中某个 class 在哪儿用到是很困难的. 使用 styled-components 则很轻松, 因为每个样式都有其关联的组件. 如果检测到某个组件未使用并且被删除,则其所有的样式也都被删除.

- 简单的动态样式: 可以很简单直观的实现根据组件的 props 或者全局主题适配样式,无需手动管理数十个 classes.

- 无痛维护: 无需搜索不同的文件来查找影响组件的样式.无论代码多庞大，维护起来都是小菜一碟。
- 自动提供前缀: 按照当前标准写 CSS,其余的交给 styled-components 处理.

# 中文文档

## 入门

`styled-components` 通过标记的模板字符来设置组件样式.

它移除了组件和样式之间的映射.当我们通过`styled-components`定义样式时,我们实际上是创建了一个附加了样式的常规 React 组件.

以下的例子创建了两个简单的附加了样式的组件, 一个`Wrapper`和一个`Title`:

```jsx
// 创建一个 Title 组件,它将渲染一个附加了样式的 <h1> 标签
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

// 创建一个 Wrapper 组件,它将渲染一个附加了样式的 <section> 标签
const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;

// 就像使用常规 React 组件一样使用 Title 和 Wrapper
render(
  <Wrapper>
    <Title>Hello World!</Title>
  </Wrapper>
);
```

> 注意
>
> styled-components 会为我们自动创建 CSS 前缀

## 基于属性的适配

我们可以将 props 以插值的方式传递给`styled component`,以调整组件样式.

下面这个 `Button` 组件持有一个可以改变`color`的`primary`属性. 将其设置为 ture 时,组件的`background-color`和`color`会交换.

```jsx
const Button = styled.button`
  /* Adapt the colors based on primary prop */
  background: ${(props) => (props.primary ? "palevioletred" : "white")};
  color: ${(props) => (props.primary ? "white" : "palevioletred")};

  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;

render(
  <div>
    <Button>Normal</Button>
    <Button primary>Primary</Button>
  </div>
);
```

> **实例一：**

```jsx
import styled from "@emotion/styled";

const SprintsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  a {
    margin-bottom: 5px;
    color: ${(props: any) => (props?.isColorRed ? "red" : "")};
  }
`;

const columns = [
  {
    dataIndex: "sprints",
    title: "历经迭代", // 标红
    width: 200,
    render: (v, record) => (
      <SprintsWrapper isColorRed={v?.length >= 2}>
        {v?.map((sprint) => (
          <RenderTitle
            sprintName={sprint?.sprintName}
            sprintId={sprint?.sprintId}
            projectId={record.projectId}
          />
        ))}
      </SprintsWrapper>
    ),
  },
];
```

> **实例二：**

```jsx
export const SprintStatusColors = {
  start: { backgroundColor: "#1c9aee", text: "未开始" },
  doing: { backgroundColor: "#04c1b2", text: "进行中" },
  done: {
    backgroundColor: "rgba(38, 38, 38, 0.05)",
    text: "已完成",
    color: "#595959",
  },
  terminate: { backgroundColor: "#ccc", text: "已关闭" },
};

export const SprintStatusContainer = styled.div`
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  color: ${(props: any) => SprintStatusColors[props?.status]?.color || "#fff"};
  background-color: ${(props: any) =>
    SprintStatusColors[props?.status]?.backgroundColor};
  width: ${(props: any) => {
    const textLen = props?.text?.length;
    if (textLen > 3) {
      return `${60 + (textLen - 3) * 10}px`;
    }
    return "60px";
  }};
  text-align: center;
`;

export const RenderTasksStatus = ({ status, text }) => {
  if (!(status in SprintStatusColors)) {
    return null;
  }
  return (
    <SprintStatusContainer status={status} text={text}>
      {text}
    </SprintStatusContainer>
  );
};
```

## 样式继承

可能我们希望某个经常使用的组件,在特定场景下可以稍微更改其样式.当然我们可以通过 props 传递插值的方式来实现,但是对于某个只需要重载一次的样式来说这样做的成本还是有点高.

创建一个继承其它组件样式的新组件,最简单的方式就是用构造函数`styled()`包裹被继承的组件.下面的示例就是通过继承上一节创建的按钮从而实现一些颜色相关样式的扩展:

```jsx
// 上一节创建的没有插值的 Button 组件
const Button = styled.button`
  color: palevioletred;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;

// 一个继承 Button 的新组件, 重载了一部分样式
const TomatoButton = styled(Button)`
  color: tomato;
  border-color: tomato;
`;

render(
  <div>
    <Button>Normal Button</Button>
    <TomatoButton>Tomato Button</TomatoButton>
  </div>
);
```

可以看到,新的`TomatoButton`仍然和`Button`类似,我们只是添加了两条规则.

In some cases you might want to change which tag or component a styled component renders.这在构建导航栏时很常见，例如导航栏中同时存在链接和按钮,但是它们的样式应该相同.

在这种情况下,我们也有替代办法(escape hatch). 我们可以使用多态 ["as" polymorphic prop](https://www.styled-components.com/docs/api#as-polymorphic-prop) 动态的在不改变样式的情况下改变元素:

```jsx
const Button = styled.button`
  display: inline-block;
  color: palevioletred;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;

const TomatoButton = styled(Button)`
  color: tomato;
  border-color: tomato;
`;

render(
  <div>
    <Button>Normal Button</Button>
    <Button as="a" href="/">
      Link with Button styles
    </Button>
    <TomatoButton as="a" href="/">
      Link with Tomato Button styles
    </TomatoButton>
  </div>
);
```

这也完美适用于自定义组件:

```jsx
const Button = styled.button`
  display: inline-block;
  color: palevioletred;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;

const ReversedButton = (props) => (
  <button {...props} children={props.children.split("").reverse()} />
);

render(
  <div>
    <Button>Normal Button</Button>
    <Button as={ReversedButton}>Custom Button with Normal Button styles</Button>
  </div>
);
```

## 给任何组件添加样式: 自定义组件

`styled`方法适用于任何最终向 DOM 元素传递 `className` 属性的组件,当然也包括第三方组件.

> 注意
>
> 在 react-native 中，请使用 style 而不是 className.

```jsx
// 下面是给 react-router-dom  Link 组件添加样式的示例
const Link = ({ className, children }) => (
  <a className={className}>{children}</a>
);

const StyledLink = styled(Link)`
  color: palevioletred;
  font-weight: bold;
`;

render(
  <div>
    <Link>Unstyled, boring Link</Link>
    <br />
    <StyledLink>Styled, exciting Link</StyledLink>
  </div>
);
```

> 注意
>
> 也可以传递标签给`styled()`, 比如:` styled("div")`. 实际上`styled.tagname`的方式就是 styled(tagname)`的别名.

```jsx
import styled from "@emotion/styled";
import { Table } from "@com/sun";

export const StyledTable = styled(Table)`
  .ant-table-column-sorters {
    padding: 9px 16px;
  }

  .ant-table-cell {
    height: 40px;
    padding: 0 12px;
    border-style: solid;
    border-color: rgb(229, 229, 229);
    border-width: 0px 1px 1px 0px;
    font-size: 14px;
    color: #262626;
  }

  .ant-table-thead > tr > .ant-table-cell {
    background-color: white;
    color: #8c8c8c;
    font-weight: 400;
    cursor: pointer;

    &:hover {
      background: rgb(247, 247, 247);
      cursor: pointer;
    }
  }

  .ant-table-tbody > tr.ant-table-row:hover > td {
    background: rgb(247, 247, 247);
  }
`;
```

# 参考链接

- [styled-components 中文文档翻译及不完全指北 - 王亮的文章 - 知乎](https://zhuanlan.zhihu.com/p/50304300)
- [styled-components 中文文档翻译](https://github.com/hengg/styled-components-docs-zh)
