# 安装配置

```json
{
  "dependencies": {
    "@ant-design/compatible": "^1.1.0",
    "@ant-design/icons": "^4.0.6",
    "@babel/plugin-proposal-class-properties": "^7.10.4",
    "@babel/plugin-proposal-decorators": "^7.10.5",
    "@egjs/hammerjs": "^2.0.17",
    "@emotion/core": "^10.0.35", // here
    "@emotion/styled": "^10.0.27", // here
    // "@tuya-fe/ekko": "^0.2.9",
    // "@tuya-fe/i18n": "^3.5.28",
    // "@tuya-fe/medusa": "^0.8.42",
    // "@tuya-fe/next": "^3.6.4",
    // "@tuya-fe/next-log4js": "^0.0.3",
    // "@tuya-fe/olympos-ui": "0.0.24-bate102",
    // "@tuya-fe/slash-hyperscript": "^0.65.4",
    "@types/hammerjs": "^2.0.39",
    "@types/react-dom": "^16.9.5",
    "ahooks": "^2.10.2",
    "antd": "4.6.6",
    "babel-plugin-emotion": "^10.0.33", // here
    "bundle-loader": "^0.5.6",
    "dom-to-image": "^2.6.0",
    "echarts": "^4.9.0",
    "echarts-for-react": "^2.0.16",
    "express": "^4.17.1",
    "fast-deep-equal": "^3.1.3",
    "file-saver": "^2.0.5",
    "hammerjs": "^2.0.8",
    "html2canvas": "^1.0.0-rc.7",
    "immer": "^9.0.1",
    "interactjs": "^1.10.11",
    "isomorphic-fetch": "^2.2.1",
    "js-cookie": "^2.2.1",
    "lodash": "^4.17.11",
    "moment": "^2.24.0",
    "qs": "^6.9.1",
    "query-string": "^6.13.6",
    "querystring": "^0.2.0",
    "react": "16.14.0",
    "react-beautiful-dnd": "^13.1.0",
    "react-dnd": "^11.1.3",
    "react-dnd-html5-backend": "^11.1.3",
    "react-dom": "16.14.0",
    "react-easy-crop": "^3.3.1",
    "react-intl": "^3.9.2",
    "react-redux": "^7.1.3",
    "react-string-clamp": "^0.3.0",
    "react-transition-group": "^4.3.0",
    "react-virtualized": "^9.22.3",
    "react-window": "^1.8.6",
    "scroll-into-view": "^1.15.0",
    "store": "^2.0.12",
    "uuid": "^8.3.2"
  }
}
```

```js
{
  "presets": [
    [
      "@tuya-fe/next/babel",
      {
        "mode": "pc",
        "style": {
          "less": {
            "javascriptEnabled": true,
            "modifyVars": {}
          }
        }
      }
    ]
  ],
  "plugins": [
    "emotion",
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/proposal-class-properties", { "legacy": true }]
  ]
}
```

# 参考链接

- [Emotion 官方文档](https://emotion.sh/docs/introduction)
  - [(2021-06-10)@@@官网解读-在 React 项目中使用 Emotion （CSS in JS）](https://juejin.cn/post/6972160798466506788#heading-17)
- [(2021-04-08)@@React 使用 emotion 写 css 代码](https://www.jb51.net/article/209095.htm#_label4)
  - [思否发表版本](https://segmentfault.com/a/1190000039778793)
- [(2022-05-10)CSS in JS 之 React-Emotion](https://blog.csdn.net/x550392236/article/details/123231299)
- [(2020-05-18)如何在 typescript-react 项目中使用 emotion](https://segmentfault.com/a/1190000022674879)
