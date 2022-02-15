## 如何引入全局的静态依赖

```js
// src\pages\document.ejs
<script src="<%= context.config.publicPath %>xlsx.full.min.js"></script>
// 并将静态文件放至public\xlsx.full.min.js
```
