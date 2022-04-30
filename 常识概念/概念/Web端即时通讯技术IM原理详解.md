---
link: https://zhuanlan.zhihu.com/p/21573180
title: 新手入门：史上最全Web端即时通讯技术原理详解
keywords: 即时通讯 (IM),Web IM
author: Jack Jiang开源im框架mobileimsdk、beautyeye的作者
date: 2021-05-31T06:58:00.000Z
publisher: 知乎专栏
stats: paragraph=283 sentences=164, words=741
---

有关 IM(InstantMessaging：即时通讯)聊天应用（如：微信，QQ）、消息推送技术（如：现今移动端 APP 标配的消息推送模块）等即时通讯应用场景下，大多数都是桌面应用程序或者 native 应用较为流行，而网上关于原生 IM（相关文章请参见：《[IM 架构篇](https://link.zhihu.com/?target=http%3A//www.52im.net/forum.php%3Fmod%3Dcollection%26action%3Dview%26ctid%3D7)》、《[IM 综合资料](https://link.zhihu.com/?target=http%3A//www.52im.net/forum.php%3Fmod%3Dcollection%26action%3Dview%26ctid%3D10)》、《[IM/推送的通信格式、协议篇](https://link.zhihu.com/?target=http%3A//www.52im.net/forum.php%3Fmod%3Dcollection%26action%3Dview%26ctid%3D18%26fromop%3Dall)》、《[IM 心跳保活篇](https://link.zhihu.com/?target=http%3A//www.52im.net/forum.php%3Fmod%3Dcollection%26action%3Dview%26ctid%3D17%26fromop%3Dall)》、《[IM 安全篇](https://link.zhihu.com/?target=http%3A//www.52im.net/forum.php%3Fmod%3Dcollection%26action%3Dview%26ctid%3D6%26fromop%3Dall)》、《[实时音视频开发](https://link.zhihu.com/?target=http%3A//www.52im.net/forum.php%3Fmod%3Dcollection%26action%3Dview%26ctid%3D4%26fromop%3Dall)》）、消息推送应用（参见：《[推送技术好文](https://link.zhihu.com/?target=http%3A//www.52im.net/forum.php%3Fmod%3Dcollection%26action%3Dview%26ctid%3D11)》）的通信原理介绍也较多，此处不再赘述。

而 web 端的 IM 应用，由于浏览器的兼容性以及其固有的"客户端请求服务器处理并响应"的通信模型，造成了要在浏览器中实现一个兼容性较好的 IM 应用，其通信过程必然是诸多技术的组合，本文的目的就是要详细探讨这些技术并分析其原理和过程。

## **更多资料**

**Web 端即时通讯技术盘点请参见：**

## 一、传统 Web 的通信原理

==**浏览器本身作为一个瘦客户端，不具备直接通过系统调用来达到和处于异地的另外一个客户端浏览器通信的功能**==。这和我们桌面应用的工作方式是不同的，**通常桌面应用通过 socket 可以和远程主机上另外一端的一个进程建立 TCP 连接，从而达到全双工的即时通信**。

==**浏览器从诞生开始一直走的是客户端请求服务器，服务器返回结果的模式**==，即使发展至今仍然没有任何改变。**所以可以肯定的是，要想实现两个客户端的通信，必然要通过服务器进行信息的转发**。例如 A 要和 B 通信，则应该是 A 先把信息发送给 IM 应用服务器，服务器根据 A 信息中携带的接收者将它再转发给 B，同样 B 到 A 也是这种模式，如下所示：

## 二、传统通信方式实现 IM 应用需要解决的问题

我们认识到基于 web 实现 IM 软件依然要走浏览器请求服务器的模式，这这种方式下，针对 IM 软件的开发需要解决如下三个问题：

- **双全工通信：**
  即**达到浏览器拉取（pull）服务器数据，服务器推送（push）数据到浏览器**；
- **低延迟：**
  即浏览器 A 发送给 B 的信息经过服务器要快速转发给 B，同理 B 的信息也要快速交给 A，实际上就是要求任何浏览器能够快速请求服务器的数据，服务器能够快速推送数据到浏览器；
- **支持跨域：**
  通常客户端浏览器和服务器都是处于网络的不同位置，浏览器本身不允许通过脚本直接访问不同域名下的服务器，即使 IP 地址相同域名不同也不行，域名相同端口不同也不行，这方面主要是为了安全考虑。

**即时通讯网注：关于浏览器跨域访问导致的安全问题，有一个被称为 CSRF 网络攻击方式，请看下面的摘录：**

> CSRF（Cross-site request forgery），中文名称：跨站请求伪造，也被称为：one click attack/session riding，缩写为：CSRF/XSRF。

你这可以这么理解 CSRF 攻击：攻击者盗用了你的身份，以你的名义发送恶意请求。CSRF 能够做的事情包括：以你名义发送邮件，发消息，盗取你的账号，甚至于购买商品，虚拟货币转账......造成的问题包括：个人隐私泄露以及财产安全。

CSRF 这种攻击方式在 2000 年已经被国外的安全人员提出，但在国内，直到 06 年才开始被关注，08 年，国内外的多个大型社区和交互网站分别爆出 CSRF 漏洞，如：[http://NYTimes.com](https://link.zhihu.com/?target=http%3A//NYTimes.com)（纽约时报）、Metafilter（一个大型的 BLOG 网站），YouTube 和百度 HI......而现在，互联网上的许多站点仍对此毫无防备，以至于安全业界称 CSRF 为"沉睡的巨人"。

基于以上分析，下面针对这三个问题给出解决方案。

## 三、全双工低延迟的解决办法

### 解决方案 3.1：客户端浏览器轮询服务器（polling）

这是最简单的一种解决方案，**其原理是在客户端通过 Ajax 的方式的方式每隔一小段时间就发送一个请求到服务器，服务器返回最新数据，然后客户端根据获得的数据来更新界面，这样就间接实现了即时通信**。优点是简单，缺点是对服务器压力较大，浪费带宽流量（通常情况下数据都是没有发生改变的）。

**客户端代码如下：**

```js
function createXHR() {
  if (typeof XMLHttpRequest != "undefined") {
    return new XMLHttpRequest();
  } else if (typeof ActiveXObject != "undefined") {
    if (typeof arguments.callee.activeXString != "string") {
      var versions = [
          "MSXML2.XMLHttp.6.0",
          "MSXML2.XMLHttp.3.0",
          "MSXML2.XMLHttp",
        ],
        i,
        len;
      for (i = 0, len = versions.length; i < len; i++) {
        try {
          new ActiveXObject(versions[i]);
          arguments.callee.activeXString = versions[i];
          break;
        } catch (ex) {}
      }
    }
    return new ActiveXObject(arguments.callee.activeXString);
  } else {
    throw new Error("no xhr object available");
  }
}

function polling(url, method, data) {
  method = method || "get";
  data = data || null;
  var xhr = createXHR();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        console.log(xhr.responseText);
      } else {
        console.log("fail");
      }
    }
  };
  xhr.open(method, url, true);
  xhr.send(data);
}
setInterval(function () {
  polling("http://localhost:8088/time", "get");
}, 2000);
```

创建一个 XHR 对象，每 2 秒就请求服务器一次获取服务器时间并打印出来。

**服务端代码（Node.js）：**

```js
var http = require("http");
var fs = require("fs");
var server = http
  .createServer(function (req, res) {
    if (req.url == "/time") {
      //res.writeHead(200, {'Content-Type': 'text/plain','Access-Control-Allow-Origin':'http://localhost'});
      res.end(new Date().toLocaleString());
    }
    if (req.url == "/") {
      fs.readFile("./pollingClient.html", "binary", function (err, file) {
        if (!err) {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(file, "binary");
          res.end();
        }
      });
    }
  })
  .listen(8088, "localhost");
server.on("connection", function (socket) {
  console.log("客户端连接已经建立");
});
server.on("close", function () {
  console.log("服务器被关闭");
});
```

**结果如下：**

### 解决方案 3.2：长轮询（long-polling）

在上面的轮询解决方案中，由于每次都要发送一个请求，**服务端不管数据是否发生变化都发送数据，请求完成后连接关闭。这中间经过的很多通信是不必要的**，于是又出现了长轮询（long-polling）方式。**这种方式是客户端发送一个请求到服务器，服务器查看客户端请求的数据是否发生了变化（是否有最新数据），如果发生变化则立即响应返回，否则保持这个连接并定期检查最新数据，直到发生了数据更新或连接超时**。同时客户端连接一旦断开，则再次发出请求，这样在相同时间内大大减少了客户端请求服务器的次数。代码如下。（详细技术文章请参见《[WEB 端即时通讯：HTTP 长连接、长轮询（long polling）详解](https://link.zhihu.com/?target=http%3A//www.52im.net/thread-224-1-1.html)》）

长轮询和短轮询比起来，**明显减少了很多不必要的 http 请求次数，相比之下节约了资源**。长轮询的缺点在于，连接挂起也会导致资源的浪费。

轮询与长轮询都是基于 HTTP 的，两者本身存在着缺陷：**轮询需要更快的处理速度；长轮询则更要求处理并发的能力；两者都是“被动型服务器”的体现：服务器不会主动推送信息，而是在客户端发送 ajax 请求后进行返回的响应**。而**理想的模型是"在服务器端数据有了变化后，可以主动推送给客户端"**，这种"主动型"服务器是解决这类问题的很好的方案。Web Sockets 就是这样的方案。

**客户端：**

```js
function createXHR() {
  if (typeof XMLHttpRequest != "undefined") {
    return new XMLHttpRequest();
  } else if (typeof ActiveXObject != "undefined") {
    if (typeof arguments.callee.activeXString != "string") {
      var versions = [
          "MSXML2.XMLHttp.6.0",
          "MSXML2.XMLHttp.3.0",
          "MSXML2.XMLHttp",
        ],
        i,
        len;
      for (i = 0, len = versions.length; i < len; i++) {
        try {
          new ActiveXObject(versions[i]);
          arguments.callee.activeXString = versions[i];
          break;
        } catch (ex) {}
      }
    }
    return new ActiveXObject(arguments.callee.activeXString);
  } else {
    throw new Error("no xhr object available");
  }
}
function longPolling(url, method, data) {
  method = method || "get";
  data = data || null;
  var xhr = createXHR();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        console.log(xhr.responseText);
      } else {
        console.log("fail");
      }
      longPolling(url, method, data);
    }
  };
  xhr.open(method, url, true);
  xhr.send(data);
}
longPolling("http://localhost:8088/time", "get");
```

在 XHR 对象的 readySate 为 4 的时候，表示服务器已经返回数据，本次连接已断开，再次请求服务器建立连接。

**服务端代码：**

```js
var http = require("http");
var fs = require("fs");
var server = http
  .createServer(function (req, res) {
    if (req.url == "/time") {
      setInterval(function () {
        sendData(res);
      }, 20000);
    }
    if (req.url == "/") {
      fs.readFile("./lpc.html", "binary", function (err, file) {
        if (!err) {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(file, "binary");
          res.end();
        }
      });
    }
  })
  .listen(8088, "localhost");
//用随机数模拟数据是否变化
function sendData(res) {
  var randomNum = Math.floor(10 * Math.random());
  console.log(randomNum);
  if (randomNum >= 0 && randomNum <= 5) {
    res.end(new Date().toLocaleString());
  }
}
```

在服务端通过生成一个在 1 到 9 之间的随机数来模拟判断数据是否发生了变化，当随机数在 0 到 5 之间表示数据发生了变化，直接返回，否则保持连接，每隔 2 秒再检测。

**结果如下：**

可以看到返回的时间是没有规律的，并且单位时间内返回的响应数相比 polling 方式较少。

### 解决方案 3.3：基于 http-stream 通信

上面的 long-polling 技术为了保持客户端与服务端的长连接**采取的是服务端阻塞（保持响应不返回），客户端轮询的方式**，在 Comet 技术中（详细技术文章请参见《[Comet 技术详解：基于 HTTP 长连接的 Web 端实时通信技术](https://link.zhihu.com/?target=http%3A//www.52im.net/thread-334-1-1.html)》），还存在一种基于 http-stream 流的通信方式。**其原理是让客户端在一次请求中保持和服务端连接不断开，然后服务端源源不断传送数据给客户端，就好比数据流一样，并不是一次性将数据全部发给客户端。它与 polling 方式的区别在于整个通信过程客户端只发送一次请求，然后服务端保持与客户端的长连接，并利用这个连接在回送数据给客户端**。

这种方案有分为几种不同的数据流传输方式。

#### 3.3.1 基于 XHR 对象的 streaming 方式

这种方式的思想是构造一个 XHR 对象，通过监听它的 onreadystatechange 事件，当它的 readyState 为 3 的时候，获取它的 responseText 然后进行处理，readyState 为 3 表示数据传送中，整个通信过程还没有结束，所以它还在不断获取服务端发送过来的数据，直到 readyState 为 4 的时候才表示数据发送完毕，一次通信过程结束。在这个过程中，服务端传给客户端的数据是分多次以 stream 的形式发送给客户端，客户端也是通过 stream 形式来获取的，所以称作 http-streaming 数据流方式，代码如下。

**客户端代码：**

```js
function createStreamClient(url, progress, done) {
  //received为接收到数据的计数器
  var xhr = new XMLHttpRequest(),
    received = 0;
  xhr.open("get", url, true);
  xhr.onreadystatechange = function () {
    var result;
    if (xhr.readyState == 3) {
      //console.log(xhr.responseText);
      result = xhr.responseText.substring(received);
      received += result.length;
      progress(result);
    } else if (xhr.readyState == 4) {
      done(xhr.responseText);
    }
  };
  xhr.send(null);
  return xhr;
}
var client = createStreamClient(
  "http://localhost:8088/stream",
  function (data) {
    console.log("Received:" + data);
  },
  function (data) {
    console.log("Done,the last data is:" + data);
  }
);
```

这里由于客户端收到的数据是分段发过来的，所以最好定义一个游标 received，来获取最新数据而舍弃之前已经接收到的数据，通过这个游标每次将接收到的最新数据打印出来，并且在通信结束后打印出整个 responseText。

**服务端代码：**

```js
var http=require('http');

var fs = require("fs");

var count=0;

var server=http.createServer(function(req,res) {

    if(req.url=='/stream'){

        res.setHeader('content-type', 'multipart/octet-stream');

        var timer=setInterval(function(){

            sendRandomData(timer,res);

        },2000);
    }

    if(req.url=='/'){

        fs.readFile("./xhr-stream.html", "binary", function(err, file) {

            if (!err) {

                res.writeHead(200, {'Content-Type': 'text/html'});

                res.write(file, "binary");

                res.end();
            }

        });
    }

}).listen(8088,'localhost');


function sendRandomData(timer,res){

    var randomNum=Math.floor(10000\*Math.random());

    console.log(randomNum);

    if(count++==10){

    clearInterval(timer);

    res.end(randomNum.toString());

    res.write(randomNum.toString());
    }
}
```

服务端通过计数器 count 将数据分十次发送，每次生成一个小于 10000 的随机数发送给客户端让它进行处理。

**结果如下：**

可以看到每次传过来的数据流都进行了处理，同时打印出了整个最终接收到的完整数据。这种方式间接实现了客户端请求，服务端及时推送数据给客户端。

#### 3.3.2 基于 iframe 的数据流

由于低版本的 IE 不允许在 XHR 的 readyState 为 3 的时候获取其 responseText 属性，为了达到在 IE 上使用这个技术，**又出现了基于 iframe 的数据流通信方式**。具体来讲，就是**在浏览器中动态载入一个 iframe,让它的 src 属性指向请求的服务器的 URL，实际上就是向服务器发送了一个 http 请求，然后在浏览器端创建一个处理数据的函数，在服务端通过 iframe 与浏览器的长连接定时输出数据给客户端**，但是这个返回的数据并不是一般的数据，而是一个类似于脚本执行的方式，浏览器接收到这个数据就会将它解析成 js 代码并找到页面上指定的函数去执行，实际上是服务端间接使用自己的数据间接调用了客户端的代码，达到实时更新客户端的目的。

**客户端代码如下：**

```js
function process(data){

console.log(data);

var dataStream = function (url) {

var ifr = document.createElement("iframe"),timer;

ifr.src = url;

document.body.appendChild(ifr);

dataStream('http://localhost:8088/htmlfile');
```

客户端为了简单起见，定义对数据处理就是打印出来。

**服务端代码：**

```js
var http=require('http');

var fs = require("fs");

var count=0;

var server=http.createServer(function(req,res){

    if(req.url=='/htmlfile'){

        res.setHeader('content-type', 'text/html');

        var timer=setInterval(function(){

            sendRandomData(timer,res);

        },2000)
    }

    if(req.url=='/'){
        fs.readFile("./htmlfile-stream.html", "binary", function(err, file) {

            if (!err) {

            res.writeHead(200, {'Content-Type': 'text/html'});

            res.write(file, "binary");

            res.end();
            }

        });
    }

}).listen(8088,'localhost');

function sendRandomData(timer,res){

var randomNum=Math.floor(10000\*Math.random());

console.log(randomNum.toString());

if(count++==10){

clearInterval(timer);

res.end("");

res.write("");
```

服务端定时发送随机数给客户端，并调用客户端 process 函数。

**在 IE5 中测试结果如下：**

可以看到实现在低版本 IE 中客户端到服务器的请求-推送的即时通信。

#### 3.3.3 基于 htmlfile 的数据流通信

又出现新问题了，在 IE 中，使用 iframe 请求服务端，服务端保持通信连接没有全部返回之前，浏览器 title 一直处于加载状态，并且底部也显示正在加载，这对于一个产品来讲用户体验是不好的，于是谷歌的天才们又想出了一中 hack 方式。就是在 IE 中，动态生成一个 htmlfile 对象，这个对象 ActiveX 形式的 com 组件，它实际上就是一个在内存中实现的 HTML 文档，通过将生成的 iframe 添加到这个内存中的 HTMLfile 中，并利用 iframe 的数据流通信方式达到上面的效果。同时由于 HTMLfile 对象并不是直接添加到页面上的，所以并没有造成浏览器显示正在加载的现象。代码如下。

**客户端：**

```js
function connect_htmlfile(url, callback) {
  var transferDoc = new ActiveXObject("htmlfile");

  transferDoc.open();

  transferDoc.write(
    '<!DOCTYPE html><html><body><script type="text/javascript">' +
      "document.domain='" +
      document.domain +
      "';" +
      "</script></body></html>"
  );

  transferDoc.close();

  var ifrDiv = transferDoc.createElement("div");

  transferDoc.body.appendChild(ifrDiv);

  ifrDiv.innerHTML = "<iframe src='" + url + "'></iframe>";

  transferDoc.callback = callback;

  setInterval(function () {}, 10000);
}

function prograss(data) {
  alert(data);
}

connect_htmlfile("http://localhost:8088/htmlfile", prograss);
```

服务端传送给 iframe 的是这样子：

```js
<script type=\"text/javascript\">callback.process('"+randomNum.toString()+"')</script>
```

这样就在 iframe 流的原有方式下避免了浏览器的加载状态。

### 解决方案 3.4：SSE（服务器推送事件（Server-sent Events）

> SSE 是 HTML5 新增的功能，全称为 Server-Sent Events。它可以允许服务推送数据到客户端。SSE 在本质上就与之前的长轮询、短轮询不同，虽然都是基于 http 协议的，但是轮询需要客户端先发送请求。而 SSE 最大的特点就是不需要客户端发送请求，可以实现只要服务器端数据有更新，就可以马上发送到客户端。

> SSE 的优势很明显，它不需要建立或保持大量的客户端发往服务器端的请求，节约了很多资源，提升应用性能。并且后面会介绍道，SSE 的实现非常简单，并且不需要依赖其他插件。

为了解决浏览器只能够单向传输数据到服务端，**HTML5 提供了一种新的技术叫做服务器推送事件 SSE**（关于该技术详细介绍请参见《[SSE 技术详解：一种全新的 HTML5 服务器推送事件技术](https://link.zhihu.com/?target=http%3A//www.52im.net/thread-335-1-1.html)》），它能够实现客户端请求服务端，然后服务端利用与客户端建立的这条通信连接 push 数据给客户端，客户端接收数据并处理的目的。从独立的角度看，**SSE 技术提供的是从服务器单向推送数据给浏览器的功能，但是配合浏览器主动请求，实际上就实现了客户端和服务器的双向通信**。它的原理是在客户端构造一个 eventSource 对象，该对象具有 readySate 属性，分别表示如下：

- 0：正在连接到服务器；
- 1：打开了连接；
- 2：关闭了连接。

同时 eventSource 对象会保持与服务器的长连接，断开后会自动重连，如果要强制连接可以调用它的 close 方法。可以它的监听 onmessage 事件，服务端遵循 SSE 数据传输的格式给客户端，客户端在 onmessage 事件触发时就能够接收到数据，从而进行某种处理，代码如下。

**客户端：**

```js
var source = new EventSource("http://localhost:8088/evt");

source.addEventListener(
  "message",
  function (e) {
    console.log(e.data);
  },
  false
);

source.onopen = function () {
  console.log("connected");
};

source.onerror = function (err) {
  console.log(err);
};
```

**服务端：**

```js

var http=require('http');

var fs = require("fs");

var count=0;

var server=http.createServer(function(req,res){

if(req.url=='/evt'){

//res.setHeader('content-type', 'multipart/octet-stream');

res.writeHead(200, {"Content-Type":"tex" +

"t/event-stream", "Cache-Control":"no-cache",

'Access-Control-Allow-Origin': '\*',

"Connection":"keep-alive"});

var timer=setInterval(function(){

if(++count==10){

clearInterval(timer);

res.end();

}else{

res.write('id: ' + count + '\n');

res.write("data: " + new Date().toLocaleString() + '\n\n');

},2000);

if(req.url=='/'){

fs.readFile("./sse.html", "binary", function(err, file) {

if (!err) {

res.writeHead(200, {'Content-Type': 'text/html'});

res.write(file, "binary");

res.end();

});

}).listen(8088,'localhost');
```

注意：这里服务端发送的数据要遵循一定的格式，通常是 id:（空格）数据（换行符）data：（空格）数据（两个换行符），如果不遵循这种格式，实际上客户端是会触发 error 事件的。这里的 id 是用来标识每次发送的数据的 id,是强制要加的。

**结果如下：**

以上就是比较常用的客户端服务端双向即时通信的解决方案，下面再来看如何实现跨域。

## 四、跨域解决办法

关于跨域是什么，限于篇幅所限，这里不做介绍，网上有很多详细的文章，这里只列举解决办法。

### 解决方案 4.1：基于 XHR 的 COSR（跨域资源共享）

CORS（跨域资源共享）是一种允许浏览器脚本向出于不同域名下服务器发送请求的技术，它是在原生 XHR 请求的基础上，XHR 调用 open 方法时，地址指向一个跨域的地址，在服务端通过设置'Access-Control-Allow-Origin':'_'响应头部告诉浏览器，发送的数据是一个来自于跨域的并且服务器允许响应的数据，浏览器接收到这个 header 之后就会绕过平常的跨域限制，从而和平时的 XHR 通信没有区别。该方法的主要好处是在于客户端代码不用修改，服务端只需要添加'Access-Control-Allow-Origin':'_'头部即可。适用于 ff,safari,opera,chrome 等非 IE 浏览器。跨域的 XHR 相比非跨域的 XHR 有一些限制，这是为了安全所需要的，主要有以下限制：

- 客户端不能使用 setRequestHeader 设置自定义头部；
- 不能发送和接收 cookie；
- 调用 getAllResponseHeaders()方法总会返回空字符串。

以上这些措施都是为了安全考虑，防止常见的跨站点脚本攻击（XSS）和跨站点请求伪造（CSRF）。

**客户端代码：**

var polling=function(){

var xhr=new XMLHttpRequest();

xhr.onreadystatechange=function(){

if(xhr.readyState==4)

if(xhr.status==200){

console.log(xhr.responseText);

xhr.open('get','http://localhost:8088/cors');

xhr.send(null);

setInterval(function(){

polling();

},1000);

**服务端代码：**

var http=require('http');

var fs = require("fs");

var server=http.createServer(function(req,res){

if(req.url=='/cors'){

res.writeHead(200, {'Content-Type': 'text/plain','Access-Control-Allow-Origin':'http://localhost'});

res.end(new Date().toString());

if(req.url=='/jsonp'){

}).listen(8088,'localhost');

server.on('connection',function(socket){

console.log("客户端连接已经建立");

});

server.on('close',function(){

console.log('服务器被关闭');

});

注意服务端需要设置头部 Access-Control-Allow-Origin 为需要跨域的域名。

**这里为了测试在端口 8088 上监听请求，然后让客户端在 80 端口上请求服务，结果如下：**

### 解决方案 4.2：基于 XDR 的 CORS

对于 IE8-10，它是不支持使用原生的 XHR 对象请求跨域服务器的，它自己实现了一个 XDomainRequest 对象，类似于 XHR 对象，能够发送跨域请求，它主要有以下限制：

- cookie 不会随请求发送，也不会随响应返回；
- 只能设置请求头部信息中的 Content-Type 字段；
- 不能访问响应头部信息；
- 只支持 Get 和 Post 请求；
- 只支持 IE8-IE10。

**客户端请求代码：**

var polling=function(){

var xdr=new XDomainRequest();

xdr.onload=function(){

console.log(xdr.responseText);

xdr.onerror=function(){

console.log('failed');

xdr.open('get','http://localhost:8088/cors');

xdr.send(null);

setInterval(function(){

polling();

},1000);

**服务端代码和同上，在 IE8 中测试结果如下：**

### 解决方案 4.3：基于 JSONP 的跨域

这种方式不需要在服务端添加 Access-Control-Allow-Origin 头信息，其原理是利用 HTML 页面上 script 标签对跨域没有限制的特点，让它的 src 属性指向服务端请求的地址，其实是通过 script 标签发送了一个 http 请求，服务器接收到这个请求之后，返回的数据是自己的数据加上对客户端 JS 函数的调用，其原理类似于我们上面所说的 iframe 流的方式，客户端浏览器接收到返回的脚本调用会解析执行，从而达到更新界面的目的。

**客户端代码如下：**

function callback(data){

console.log("获得的跨域数据为:"+data);

function sendJsonp(url){

var oScript=document.createElement("script");

oScript.src=url;

oScript.setAttribute('type',"text/javascript");

document.getElementsByTagName('head')[0].appendChild(oScript);

setInterval(function(){

sendJsonp('http://localhost:8088/jsonp?cb=callback');

},1000);

**服务端代码：**

var http=require('http');

var url=require('url');

var server=http.createServer(function(req,res){

if(/\/jsonp/.test(req.url)){

var urlData=url.parse(req.url,true);

var methodName=urlData.query.cb;

res.writeHead(200,{'Content-Type':'application/javascript'});

//res.end("");

res.end(methodName+"("+new Date().getTime()+");");

//res.end(new Date().toString());

}).listen(8088,'localhost');

server.on('connection',function(socket){

console.log("客户端连接已经建立");

});

server.on('close',function(){

console.log('服务器被关闭');

});

注意这里服务端输出的数据 content-type 首部要设定为 application/javascript,否则某些浏览器会将其当做文本解析。

**结果如下：**

## 五、WebSocket

> WebSocket 是 Html5 定义的一个新协议，与传统的 http 协议不同，该协议可以实现服务器与客户端之间全双工通信。简单来说，首先需要在客户端和服务器端建立起一个连接，这部分需要 http。连接一旦建立，客户端和服务器端就处于平等的地位，**可以相互发送数据，不存在请求和响应的区别**。

**在上面的这些解决方案中，都是利用浏览器单向请求服务器或者服务器单向推送数据到浏览器这些技术组合在一起而形成的 hack 技术**，在 HTML5 中，为了加强 web 的功能，提供了 websocket 技术，**它不仅是一种 web 通信方式，也是一种应用层协议。它提供了浏览器和服务器之间原生的双全工跨域通信，通过浏览器和服务器之间建立 websocket 连接（实际上是 TCP 连接）,在同一时刻能够实现客户端到服务器和服务器到客户端的数据发送**。关于该技术的原理，请参见：《[WebSocket 详解（一）：初步认识 WebSocket 技术](https://link.zhihu.com/?target=http%3A//www.52im.net/forum.php%3Fmod%3Dviewthread%26tid%3D331%26ctid%3D15)》、《[WebSocket 详解（二）：技术原理、代码演示和应用案例](https://link.zhihu.com/?target=http%3A//www.52im.net/forum.php%3Fmod%3Dviewthread%26tid%3D326%26ctid%3D15)》、《[WebSocket 详解（三）：深入 WebSocket 通信协议细节](https://link.zhihu.com/?target=http%3A//www.52im.net/forum.php%3Fmod%3Dviewthread%26tid%3D332%26ctid%3D15)》，此处就不在赘述了，直接给出代码。在看代码之前，需要先了解 websocket 整个工作过程。

首先是客户端 new 一个 websocket 对象，该对象会发送一个 http 请求到服务端，服务端发现这是个 webscoket 请求，会同意协议转换，发送回客户端一个 101 状态码的 response，以上过程称之为一次握手，经过这次握手之后，客户端就和服务端建立了一条 TCP 连接，在该连接上，服务端和客户端就可以进行双向通信了。这时的双向通信在应用层走的就是 ws 或者 wss 协议了，和 http 就没有关系了。所谓的 ws 协议，就是要求客户端和服务端遵循某种格式发送数据报文（帧），然后对方才能够理解。

**关于 ws 协议要求的数据格式官网指定如下：**

其中比较重要的是 FIN 字段，它占用 1 位，表示这是一个数据帧的结束标志，同时也下一个数据帧的开始标志。opcode 字段，它占用 4 位，当为 1 时，表示传递的是 text 帧，2 表示二进制数据帧，8 表示需要结束此次通信（就是客户端或者服务端哪个发送给对方这个字段，就表示对方要关闭连接了）。9 表示发送的是一个 ping 数据。mask 占用 1 位，为 1 表示 masking-key 字段可用，masking-key 字段是用来对客户端发送来的数据做 unmask 操作的。它占用 0 到 4 个字节。Payload 字段表示实际发送的数据，可以是字符数据也可以是二进制数据。

所以不管是客户端和服务端向对方发送消息，都必须将数据组装成上面的帧格式来发送。

**首先来看服务端代码：**

//握手成功之后就可以发送数据了

var crypto = require('crypto');

var WS = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

var server=require('net').createServer(function (socket) {

var key;

socket.on('data', function (msg) {

if (!key) {

//获取发送过来的 Sec-WebSocket-key 首部

key = msg.toString().match(/Sec-WebSocket-Key: (.+)/)[1];

key = crypto.createHash('sha1').update(key + WS).digest('base64');

socket.write('HTTP/1.1 101 Switching Protocols\r\n');

socket.write('Upgrade: WebSocket\r\n');

socket.write('Connection: Upgrade\r\n');

//将确认后的 key 发送回去

socket.write('Sec-WebSocket-Accept: ' + key + '\r\n');

//输出空行，结束 Http 头

socket.write('\r\n');

} else {

var msg=decodeData(msg);

console.log(msg);

//如果客户端发送的操作码为 8,表示断开连接,关闭 TCP 连接并退出应用程序

if(msg.Opcode==8){

socket.end();

server.unref();

}else{

socket.write(encodeData({FIN:1,

Opcode:1,

PayloadData:"接受到的数据为"+msg.PayloadData}));

});

});

server.listen(8000,'localhost');

//按照 websocket 数据帧格式提取数据

function decodeData(e){

var i=0,j,s,frame={

//解析前两个字节的基本数据

FIN:e[i]>>7,Opcode:e[i++]&15,Mask:e[i]>>7,

PayloadLength:e[i++]&0x7F

//处理特殊长度 126 和 127

if(frame.PayloadLength==126)

frame.length=(e[i++]<

```

```

```

```

```

```

# 参考链接
- [新手入门：史上最全Web端即时通讯技术原理详解](https://zhuanlan.zhihu.com/p/21573180)
- [Web 端即时通讯技术：轮询、长轮询、长连接、websocket](https://blog.csdn.net/qq_26234177/article/details/116008226)
