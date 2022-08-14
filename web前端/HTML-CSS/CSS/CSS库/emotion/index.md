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

# 使用实例

## 实例一

- 实例二

```jsx
/** @jsx jsx */ // 必须加这个不然样式没有效果
import { css, jsx } from "@emotion/core";

import * as styles from "./styles";

// 特点：如下，只是在使用样式的最顶层类名，需要通过styles.类名来引入，
// 该类名下面的子类不需要通过styles.类名来引入，直接类名就能生效。`css={styles.modalWrapperCss}`
return (
  <Modal
    width="100vw"
    css={styles.modalWrapperCss}
    style={{ padding: 0 }}
    centered
    footer={null}
    visible={props.visible}
    title={
      <div className="modal-header">
        {detail?.name || "详情"}
        <div className="modal-header-right">
          <ConditionComponent isShow={!!detail?.desc}>
            <Tooltip title={detail?.desc}>
              <span>
                <InfoCircleOutlined style={{ marginRight: 5 }} />
                如何读此报表
              </span>
            </Tooltip>
          </ConditionComponent>
        </div>
      </div>
    }
    onCancel={() => {
      props.onClose();
    }}
  >
    <LoadingComponent loading={loading}>
      <div className="body-content">
        <div className="graphic-list">
          <LoadingComponent loading={loading2}>
            {detail?.graphData?.map((c) => (
              <Card bordered key={c.name}>
                <Graphic
                  data={c}
                  overviewValue={overviewValue}
                  onOverviewChange={setOverviewValue}
                />
              </Card>
            ))}
            <ConditionComponent
              isShow={!!detail?.graphData.find((c) => c.name === "chart")}
            >
              <OverviewDetail
                overviewValue={overviewValue}
                filterValue={filterValue}
                sectionValue={sectionValue}
              />
            </ConditionComponent>
          </LoadingComponent>
        </div>
        <div className={classnames("graphic-filter", collapse && "collapsed")}>
          <div
            className="graphic-filter-icon"
            onClick={() => setCollapse(!collapse)}
          >
            <IfElseComponent
              if={<DoubleRightOutlined />}
              else={<MenuOutlined />}
              checked={!collapse}
            />
          </div>
          <ConditionComponent isShow={!collapse && !!detail}>
            <Card bordered={!collapse} className="graphic-filter-card">
              {detail && (
                <SectionPage item={detail} onChange={setSectionValue} />
              )}
              <div
                style={{ margin: "18px 0", borderBottom: "1px solid #e5e5e5" }}
              />
              <div className="graphic-filter-options">
                <div
                  className="graphic-filter-label"
                  style={{ marginBottom: 12 }}
                >
                  筛选
                </div>
                <Forms.NormalForm
                  layout="vertical"
                  submit={false}
                  initialValues={initialValues}
                  components={columns || []}
                  onValuesChange={onFilterValueChange}
                />
              </div>
            </Card>
          </ConditionComponent>
        </div>
      </div>
    </LoadingComponent>
  </Modal>
);
```

```ts
import { css } from "@emotion/core";

export const modalWrapperCss = css`
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-right {
      margin-right: 20px;
      color: rgb(140, 140, 140);
      font-weight: normal;
      font-size: 14px;
      cursor: pointer;
      &:hover {
        color: #0171c2;
      }
    }
  }
  .ant-modal-content {
    height: 100vh;
    display: flex;
    flex-direction: column;
    .ant-modal-header {
      flex-shrink: 0;
      box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
      z-index: 1;
    }
    .ant-modal-body {
      flex-grow: 1;
      overflow-y: auto;
      background-color: #f7f7f7;
      overflow-x: hidden;
      padding: 24px 40px;
      .body-content {
        display: flex;
        width: 100%;
        height: 100%;
        .graphic-list {
          flex-grow: 1;
          overflow: auto;
          .ant-card {
            &:nth-of-type(n + 2) {
              margin-top: 20px;
            }
          }
        }
        .graphic-filter {
          width: 320px;
          flex-shrink: 0;
          padding-left: 14px;

          position: relative;
          transition: width 218ms ease;
          font-size: 14px;

          &-options {
            flex-grow: 1;
            overflow: auto;
          }
          &-label {
            display: flex;
            align-items: center;
            height: 40px;
          }

          &-section {
            display: flex;
            align-items: center;
            height: 40px;
            color: #595959;
          }

          &.collapsed {
            width: 0;
            padding-left: 0;
            .graphic-filter-icon {
              /* left: 0px */
            }
          }
          &-card {
            height: 100%;
            overflow: hidden;
            & > .ant-card-body {
              height: 100%;
              display: flex;
              overflow: hidden;
              flex-direction: column;
            }
          }
          &-icon {
            position: absolute;
            top: 26px;
            left: 2px;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            color: #8c8c8c;
            border: 1px solid #e5e5e5;
            background-color: #fff;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1;
            &:hover {
              color: #fff;
              background-color: #1b9aee;
              border-color: #1b9aee;
            }
          }
        }
      }
    }
  }
`;
```

# 参考链接

- [Emotion 官方文档](https://emotion.sh/docs/introduction)
  - [(2021-06-10)@@@官网解读-在 React 项目中使用 Emotion （CSS in JS）](https://juejin.cn/post/6972160798466506788#heading-17)
- [(2021-04-08)@@React 使用 emotion 写 css 代码](https://www.jb51.net/article/209095.htm#_label4)
  - [思否发表版本](https://segmentfault.com/a/1190000039778793)
- [(2022-05-10)CSS in JS 之 React-Emotion](https://blog.csdn.net/x550392236/article/details/123231299)
- [(2020-05-18)如何在 typescript-react 项目中使用 emotion](https://segmentfault.com/a/1190000022674879)
