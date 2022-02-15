## 跨域解决方案

代码实现

```js
function jsonp({ url, params, callback }) {
  return new Promise((resolve, reject) => {
    let script = document.createElement("script");
    window[callback] = function (data) {
      resolve(data);
      document.body.removeChild(script);
    };
    params = {
      ...params,
      callback,
    };
    const list = [];
    for (let key in params) {
      list.push(`${key}=${params[key]}`);
    }
    script.src = `${url}?${list.join("&")}`;
    document.body.appendChild(script);
  });
}

jsonp({
  url: "http://localhost:3000/say",
  params: { wd: "iloveyou" },
  callback: "show",
}).then((data) => {
  console.log("data", data);
});

// 上面这段代码相当于向http://localhost:3000/say?wd=Iloveyou&callback=show这个地址请求数据，然后后台返回show('我不爱你')，最后会运行show()这个函数，打印出'我不爱你'

// server.js
let express = require('express')
let app = express()
app.get('/say', function(req, res) {
  let { wd, callback } = req.query
  console.log(wd) // Iloveyou
  console.log(callback) // show
  res.end(`${callback}('我不爱你')`)
})
app.listen(3000)
```
