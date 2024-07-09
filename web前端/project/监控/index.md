# 监控头时间同步逻辑优化

**【优化前逻辑】**

- 30 分钟请求一次获取服务器时间接口，最新服务器时间赋值给`serverTime.current`
- 第一次请求后，到下一次请求之间，界面显示的时间是用`serverTime.current`往上加的，每隔 1S 就加 1000 毫秒
- 问题：
  - 在 `setInterval` 被推入任务队列时，如果在它前面有很多任务或者某个任务等待时间较长比如网络请求等，那么这个定时器的执行时间和我们预定它执行的时间可能并不一致，即在这个需求环境中，时间往前走的不对。
  - 如果订阅了多个位号，界面一秒绘制一次，很可能来不及执行这个每秒加 1000 毫秒的任务，导致时间往前走的不对，时间过去越久，走的差距越大

```tsx
const SYNC_TIME_INTERVAL = 1800; // 1800s=30Min=0.5H

export default function Home() {
  const timerId = React.useRef<any>(null);
  const serverTime = React.useRef<number>(0);
  const timeCount = React.useRef<number>(-1);

  // 定时获取服务器系统时间
  React.useEffect(() => {
    timerId.current = setInterval(() => {
      if (timeCount.current !== -1 && timeCount.current < SYNC_TIME_INTERVAL) {
        timeCount.current = timeCount.current + 1;
        serverTime.current = serverTime.current + 1000;
        dispatch(setserverTime(serverTime.current));
      } else {
        timeCount.current = 0;
        getCurrentTime()
          .then((res) => {
            if (res.code === 0) {
              serverTime.current = res.result.data.time;
              dispatch(setserverTime(serverTime.current));
            }
          })
          .catch(() => {});
      }
    }, 1000);
    return () => {
      clearInterval(timerId.current);
    };
  }, []);
}
```

---

**【优化后逻辑】**

- 10 分钟请求一次获取获取服务器时间接口，最新服务器时间赋值给`latestServerTime`，获取到最新服务器时间的时候，记录下其与当前系统时间的差值`subTimeServerLocal`，比如快/慢 5000ms。
- 第一次请求后，到下一次请求之间，界面显示的时间是用`showTime.current = latestSystemTime + subTimeServerLocal;`，即当前系统时间+差值`subTimeServerLocal`
- 备注
  - 感觉还能优化，即写个 setTimeout 来替换目前的 setInterval。

```tsx
const SYNC_TIME_INTERVAL = 10 * 60 * 1000; // 600s=10Min

export default function Home() {
  const timerId = React.useRef<any>(null);
  const showTime = React.useRef<number>(0);
  const timeCount = React.useRef<number>(-1);

  // 定时获取服务器系统时间
  React.useEffect(() => {
    // 最新服务器系统时间
    let latestServerTime = 0;
    // 获取到最新服务器时间时候与系统时间的差值，比如快/慢5000ms
    let subTimeServerLocal = 0;

    timerId.current = setInterval(() => {
      const latestSystemTime = new Date().getTime();
      // 最新同步时间的差值
      const latestSubSync =
        latestSystemTime - latestServerTime + subTimeServerLocal;
      if (timeCount.current !== -1 && latestSubSync < SYNC_TIME_INTERVAL) {
        timeCount.current = timeCount.current + 1;
        showTime.current = latestSystemTime + subTimeServerLocal;
        dispatch(setServerSystemTime(showTime.current));
      } else {
        timeCount.current = 0;
        getCurrentTime()
          .then((res) => {
            if (res.code === 0) {
              showTime.current = res.result.data.time;
              latestServerTime = showTime.current;
              const latestSystemTime = new Date().getTime();
              subTimeServerLocal = showTime.current - latestSystemTime;
              dispatch(setServerSystemTime(showTime.current));
            }
          })
          .catch(() => {});
      }
    }, 1000);
    return () => {
      clearInterval(timerId.current);
    };
  }, []);
}
```

# 命令式加载电子签名组件

**【命令式加载的源码】**

```tsx
// src/components/electronicSign.tsx

import ReactDOM from "react-dom";
import React, { useCallback, useState, useMemo } from "react";
import { injectIntl } from "react-intl";
import { ConfigProvider, theme } from "@supcon/supcond2";
import enUS from "@supcon/supcond2/locale/en_US";
import zhCN from "@supcon/supcond2/locale/zh_CN";
import ElectronicSignModal, {
  IEleSignModalParams,
} from "./electronicSignModal";

import { getLocale } from "../utils/api";

const electronicSign = (props: IEleSignModalParams) => {
  return new Promise((resolve, reject) => {
    const nodeWrapper = document.createElement("div");
    nodeWrapper.classList.add("electronic-sign-wrapper");
    const nodeInner = document.createElement("div");
    nodeWrapper.appendChild(nodeInner);
    document.body.appendChild(nodeWrapper);

    const lang = getLocale();

    // 起始这种写法用<ConfigProvider />包裹后也能正常使用，但是用React.createPortal多套了一层，比较麻烦
    // ReactDOM.render(
    //   <div>
    //     {ReactDOM.createPortal(
    //       <ConfigProvider
    //         theme={{
    //           algorithm: theme.compactAlgorithm,
    //         }}
    //         locale={lang !== "zh-CN" ? enUS : zhCN}
    //       >
    //         <ElectronicSignModal
    //           isZHCN={lang === "zh-CN"}
    //           {...props}
    //           onOk={(values) => {
    //             resolve(values);
    //           }}
    //           onSignFailed={(err) => {
    //             reject(err);
    //           }}
    //           onClose={() => {
    //             ReactDOM.unmountComponentAtNode(nodeWrapper);
    //             nodeWrapper.remove();
    //           }}
    //         />
    //       </ConfigProvider>,
    //       nodeInner
    //     )}
    //   </div>,
    //   nodeWrapper
    // );

    ReactDOM.render(
      <ConfigProvider
        theme={{
          algorithm: theme.compactAlgorithm,
        }}
        locale={lang !== "zh-CN" ? enUS : zhCN}
      >
        <ElectronicSignModal
          isZHCN={lang === "zh-CN"}
          {...props}
          onOk={(values) => {
            resolve(values);
          }}
          onSignFailed={(err) => {
            reject(err);
          }}
          onClose={() => {
            ReactDOM.unmountComponentAtNode(nodeWrapper);
            nodeWrapper.remove();
          }}
        />
      </ConfigProvider>,
      nodeWrapper
    );
  });
};

export default electronicSign;
```

**【命令式加载调用如下】**

```ts
class GlobalBasicAPI {
  public static singleton = new GlobalBasicAPI();
  private constructor() {}

  // 打开电子签名（单签）弹窗
  singleSign(params: TEleSignParams): Promise<any> {
    return electronicSign({
      ...params,
      signLevel: 1,
    });
  }

  // 打开电子签名（双签）弹窗
  dualSign(params: TEleSignParams): Promise<any> {
    return electronicSign({
      ...params,
      signLevel: 2,
    });
  }

  // 打开二次确认弹窗
  secConfirm(params: TSecConfirmParams): Promise<any> {
    const { confirmContent, ...rest } = params;
    return electronicSign({
      ...rest,
      isSecondaryConfirm: true,
      signReason: confirmContent,
    });
  }
}
```

**【命令式加载调用实例】**

```tsx
// 调用单签
window.globalBasicAPI?.singleSign({ signReason: "最新规定必须签名" });

// 调用双签
window.globalBasicAPI?.dualSign({
  signReason: "最新规定必须签名",
  isRemarksRequired: false,
});
```
