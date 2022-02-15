# 概览

web 前端三层来说：

- 结构层 HTML 从语义的角度，描述页面结构
- 样式层 CSS 从审美的角度，美化页面
- 行为层 JavaScript 从交互的角度，提升用户体验

# 学习步骤

## 一、认清学习的要求

1、弄清目的，首先要认识为什么要学习 CSS？
2、心态不能急，如果你很急躁，否则会很快丧失兴趣。
3、坚持，这个不是一到两天的事情，是一个漫长的过程（至少两个月）。

## 二、基础学习

1、了解 CSS 作用是什么？（即 CSS、html 和 js 的关系是什么，html 结构重要性）
2、css 基础知识、css 属性样式
3、html
上面几点，一般都是很快的掌握了，也不需要做到精通，了解大概就可以。
差不多时候，开始在网上找一些 psd 设计稿，自己做做看，做完之后发现问题，并把他们进行总结。

## 三、学会分析别人网页布局

当你做 psd 设计的代码，发现问题，可能找不到答案或没有人帮你回答，也不要急，这时最好看看别人网页的布局结构，主要看 html 布局框架，进行借鉴（当然网上还有很多结构代码很槽糕）。然后了解美工图如何分析、如何使用 PS 工具切出需要的素材、如何使用这些切出的图片素材进行布局、布局技巧、兼容性解决与避免等。
总之：就是让自己布局时候能知道大的布局结构如何布局，建立布局思想与技巧。

## 四、代码的规范

当你看完很多别人的网页代码之后，你会发现，他们都有规范，这些规范网上有很多，你需要总结和背诵，当然不是死记硬背，主要在切图上多做多实践，熟了就能记住。

## 五、大量练习

练习是从始到终的，不要断，即使找一些简单的网页进行布局实践，开始可能开发很慢，会遇到很多小问题，也不急。

# Tips

## logo 优化问题

```html
<head>
  <style>
    .logo {
      width: 140px;
      height: 60px;
    }
    .logo a {
      display: block;
      width: 100%;
      height: 100%;
      background: url(logo.png) no-repeat;
      text-indent: -2000em;
    }
  </style>
</head>
<body>
  <div class="column left">
    <div class="logo">
      <h1>
        <a href="http://www.itcast.cn" title="前端与移动学院">传智播客</a>
      </h1>
    </div>
    <div class="column right"></div>
  </div>
</body>
```

# 参考链接

- [w3c school 详细全面](https://www.w3cschool.cn/html5/html5-intro.html)
- [W3 school](https://www.w3school.com.cn/h.asp)
- [MDN - HTML](https://developer.mozilla.org/zh-CN/docs/Web/HTML)
- [CSS3新特性](https://segmentfault.com/a/1190000010780991)
