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