# 概述
Next.js 具有同类框架中最佳的“开发人员体验”和许多内置功能。列举其中一些如下：
- 直观的、 基于页面的路由系统（并支持 动态路由）
# 入门

## 页面间导航
- ==pages==
  - 页面是从 pages 目录中的文件导出的 React 组件。
  - 页面与基于其文件名的路由相关联。例如：
    - `pages/index.js` 与 `/` 路由相关联
    - `pages/posts/first-post.js` 与 `/posts/first-post` 路由相关联
  - 组件可以用任何名称，但导出时候必须将其设置为默认导出。
  - 在`pages`目录下新建 js 文件，文件的路径就成为该页面的路由地址。总而言之，这跟使用 HTML 或者 PHP 文件来创建站点很类似，但是你不需要再写 HTML，取而代之的是 JSX 和 React 组件。
- ==Link==
  - 当链接网站上的页面时你会使用a标签，在next中，你使用`next/link`中的Link组件来包裹a标签，<Link>允许你在客户端导航到应用程序中的不同页面。

- ==Client-Side-Navigation: 客户端导航==
  - 客户端导航意味着页面转换使用 JavaScript 进行，这比浏览器执行的默认导航速度更快。
    - 可以验证如下：改变页面html标签的css背景属性，单击链接可在两个页面之间来回切换。您会看到黄色背景在页面转换之间持续存在。这表明浏览器未加载完整页面并且客户端导航正在工作。
    - 如果你使用的是`<a href="" />`，而不是`<Link href="">`重复这个动作，点击链接时背景颜色将被清除，因为浏览器会完全刷新。

  - Code Splitting and Prefetching
    - Next.js 会自动进行代码拆分，因此每个页面只加载该页面所需的内容。 这意味着在呈现主页时，最初不会提供其他页面的代码。
    - 这可确保即使您添加数百个页面，主页也能快速加载。仅加载您请求的页面的代码也意味着页面变得孤立。 如果某个页面抛出错误，应用程序的其余部分仍然可以工作。
    - 此外，在 Next.js 的生产版本中，每当 Link 组件出现在浏览器的视口中时，Next.js 都会在后台自动预取链接页面的代码。 当您单击链接时，目标页面的代码已在后台加载，页面转换将近乎即时！
  - 总结
    - Next.js 通过代码拆分、客户端导航和预取（生产中）自动优化您的应用程序以获得最佳性能。
## 资源、元数据和 CSS
您将在本课中学到什么
- 如何将静态文件（图像等）添加到 Next.js。
- 如何为每个页面自定义 `<head>` 中的内容。
- 如何创建样式使用 CSS 模块化的可重用的React 组件。
- 如何在 `pages/_app.js` 中添加全局 CSS。
- 在 Next.js 中设置样式的一些有用技巧。
### 静态资源
Next.js 可以在顶级公共目录下提供静态文件，如图像。 public 中的文件可以从应用程序的根目录引用，类似于页面。

如果您在应用程序中打开 `pages/index.js` 并查看 `<footer>`，我们会像这样引用徽标图像：
`<img src="/vercel.svg" alt="Vercel Logo" className="logo" />
`
### 元数据
```jsx
import Head from 'next/head'

<Head>
  <title>Create Next App</title>
  <link rel="icon" href="/favicon.ico" />
</Head>
```
请注意，使用了 `<Head>` 而不是小写的 `<head>`。 `<Head>` 是一个内置于 `Next.js` 的 React 组件。 它允许您修改页面的 `<head>`。

==您可以从 `next/head` 模块导入 Head 组件。==
### CSS样式
这是使用一个名为 `styled-jsx` 的库。 它是一个`CSS-in-JS`库——它允许你在 React 组件中编写 CSS，并且 CSS 样式将被限定（其他组件不会受到影响）。
```jsx
<style jsx>{`
  …
`}</style>
```
`Next.js` 内置了对 `styled-jsx` 的支持，但您也可以使用其他流行的 `CSS-in-JS` 库，例如 `styled-components` 或 `emotion`。
### 布局组件
首先，让我们创建一个==将在所有页面之间共享的 Layout 组件==。

创建一个名为 `components` 的顶级目录。在里面，创建一个名为 `layout.js` 的文件，内容如下：
```jsx
export default function Layout({ children }) {
  return <div>{children}</div>
}
```

然后，在 `pages/posts/first-post.js` 中，导入 Layout 并使其成为最外层组件。


```jsx
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../../components/layout'

export default function FirstPost() {
  return (
    <Layout>
      <Head>
        <title>First Post</title>
      </Head>
      <h1>First Post</h1>
      <h2>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </h2>
    </Layout>
  )
}
```

> **添加 CSS**

在 components 目录中创建一个名为 `layout.module.css` 的文件。

要在 `layout.js` 中使用 `container` class，您需要：
- 将文件作为`style`导入
- 使用 `styles.container` 作为 `className`
```jsx
import styles from './layout.module.css'

export default function Layout({ children }) {
  return <div className={styles.container}>{children}</div>
}
```
> **自动生成唯一的类名**

现在，如果您查看浏览器开发工具中的 `HTML`，您会注意到 div 标签的类名看起来像 `layout_container__....`

![](https://www.nextjs.cn/static/images/learn/assets-metadata-css/devtools.png)
这就是 CSS Modules 所做的：它自动生成唯一的类名。 只要你使用 CSS Modules，你就不必担心类名冲突。

此外，Next.js 的代码拆分功能也适用于 CSS 模块。 它确保为每个页面加载最少的 CSS。 这导致较小的包大小。

CSS 模块在构建时从 JavaScript 包中提取，并生成由 Next.js 自动加载的 .css 文件。

### 全局样式
CSS 模块对于组件级样式很有用。 但是如果你希望每个页面都加载一些 CSS，Next.js 也支持它。

要加载全局 CSS 文件，请在 pages 下创建一个名为 `_app.js` 的文件，并添加以下内容：
```jsx
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```
这个 App 组件是顶级组件，它将在所有不同的页面中通用。 例如，您可以使用此 App 组件在页面之间导航时保持状态。

> **添加全局 CSS**

在 Next.js 中，您可以通过从 `pages/_app.js` 导入全局 CSS 文件来添加它们。 您不能在其他任何地方导入全局 CSS。

全局 CSS 不能导入到 `pages/_app.js` 之外的原因是全局 CSS 影响页面上的所有元素。

如果您要从主页导航到 `/posts/first-post` 页面，来自主页的全局样式会无意中影响 `/posts/first-post`。

您可以将全局 CSS 文件放置在任何位置并使用任何名称。 因此，让我们执行以下操作：

- 创建顶级 `styles` 目录并在其中创建 `global.css`。
- 添加以下内容。 它会重置一些样式并更改 a 标签的颜色。
```css
html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,
    Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  line-height: 1.6;
  font-size: 18px;
}

* {
  box-sizing: border-box;
}

a {
  color: #0070f3;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

img {
  max-width: 100%;
  display: block;
}
```
最后，在 pages/_app.js 中导入：
```jsx
import '../styles/global.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```
现在，如果您访问 `http://localhost:3000/posts/first-post`，您将看到应用了样式：


### 完善代码
### 样式Tips
> 使用 `classnames`库来切换样式类

使用示例如下：
```css
.success {
  color: green;
}
.error {
  color: red;
}
```

```jsx
import styles from './alert.module.css'
import cn from 'classnames'

export default function Alert({ children, type }) {
  return (
    <div
      className={cn({
        [styles.success]: type === 'success',
        [styles.error]: type === 'error'
      })}
    >
      {children}
    </div>
  )
}
```
## 预渲染和数据获取
您将在本课中学到什么
- Next.js 的预渲染功能。
- 预渲染的两种形式：静态生成和服务器端渲染。
- 有数据和没有数据的静态生成。
- getStaticProps 以及如何使用它将外部博客数据导入索引页面。
- 关于 getStaticProps 的一些有用信息。

> 预渲染

在我们讨论数据获取之前，让我们先谈谈 Next.js 中最重要的概念之一：预渲染。

默认情况下，Next.js 预渲染每个页面。 这意味着 Next.js 会提前为每个页面生成 HTML，而不是全部由客户端 JavaScript 完成。 预渲染可以带来更好的性能和 SEO。

每个生成的 HTML 都与该页面所需的最少 JavaScript 代码相关联。 当浏览器加载页面时，其 JavaScript 代码会运行并使页面完全交互。 （这个过程称为水合作用。）
## 官网
- [next官网](https://www.nextjs.cn/docs/getting-started)


## 涂芽计划培训感悟
