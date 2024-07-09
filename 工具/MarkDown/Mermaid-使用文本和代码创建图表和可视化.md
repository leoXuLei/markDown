# `Mermaid`介绍

> **Mermaid 允许你使用文本和代码创建图表和可视化。**
> 它是一个基于 JavaScript 的图表绘制工具，可渲染 Markdown 启发的文本定义以动态创建和修改图表。

Mermaid 是一种**轻量级的、基于文本的图表绘制语法和工具，它允许开发者和技术专业人员通过简单的文本描述来创建图表，这种方法避开了复杂的图形编辑器，让图表的创建和代码一样容易被版本控制系统管理**。Mermaid 由 Knut Sveidqvist 于 2014 年创立，并迅速在技术社区中获得了广泛的认可，因为它解决了在文档中嵌入可维护图表的痛点问题。

Mermaid **支持多种图表类型，包括流程图（Flowchart）、序列图（Sequence Diagram）、甘特图（Gantt Diagram）、类图（Class Diagram）、状态图（State Diagram）等。这些图表广泛应用于软件设计、项目管理、系统建模等领域。例如，开发者可以使用流程图来描述一个算法的执行流程，或者用序列图来展示系统组件间的交互**。

使用 Mermaid 的一个典型例子是，==**在 Markdown 文件中嵌入图表代码。由于 Markdown 本身支持文本格式，结合 Mermaid，用户可以在同一个文件中编写文档和绘制图表，非常适合编写技术文档和手册。此外，Mermaid 的图表代码简洁明了，易于理解和修改，这对于团队协作和文档维护来说是一个巨大的优势**==。

Mermaid 的**另一个亮点是它可以集成到各种文档工具和平台，如 GitLab、GitHub、Confluence 等，这使得在这些平台上直接渲染 Mermaid 图表成为可能**。此外，Mermaid 还提供了一个在线编辑器，用户可以在不安装任何工具的情况下快速创建和预览图表。

然而，**Mermaid 并不是万能的。它虽然在简单性和易用性方面表现出色，但在复杂图表的定制性和美观性上可能无法与专业的图表绘制工具相媲美**。例如，当图表元素特别多或者需要高度定制风格时，Mermaid 的限制可能就会显现出来。

总的来说，==**Mermaid 为那些希望以代码形式快速生成和维护图表的用户提供了一个非常实用的解决方案。它以其独特的方式降低了制图的门槛，使得不擅长图形设计的技术人员也能轻松创建出清晰的图表来支撑他们的工作**==。

Mermaid 的语法简单直观，对于熟悉 Markdown 的用户来说，学习成本较低。它支持多种图表类型，每种类型都有其特定的语法规则。例如，流程图（Flowchart）的基本语法如下：

# 流程图 (`Flowchart`)

> - **流程图由节点（几何形状）和边（箭头或线）组成**。
> - `Mermaid` 代码**定义了如何创建节点和边，并适应不同的箭头类型、多向箭头以及与子图之间的任何链接**。

## graph 流程图

```mermaid
graph TD
    a1[带文本矩形]
    a2(带文本圆角矩形)
    a3>带文本不对称矩形]
    b1{带文本菱形}
    c1((带文本圆形))
```

```mermaid
graph LR
    A10[A10] --- A11[A11]
    A20[A20] === A21[A21]
    A30[A30] -.- A31[A31]
    B10[B10] --> B11[B11]
    B20[B20] ==> B21[B21]
    B30[B30] -.-> B31[B31]
    C10[C10] --yes--> C11[C11]
    C20[C20] ==yes==> C21[C21]
    C30[C30] -.yes.-> C31[C31]
```

```mermaid
graph LR
	A[开始节点] --> B[结束节点1]
	A --> C[结束节点2]
```

### 实例

```mermaid
flowchart LR
A[Hard] -->|Text| B(Round)
B --> C{Decision}
C -->|One| D[Result 1]
C -->|Two| E[Result 2]
```

```mermaid

graph TD
	start([开始]) --> 赋值arr[赋值arr]
	赋值arr --> 赋值len[len = arr.length]
	赋值len --> 赋值i[i = 0]
	赋值i --> 第一层循环{i < len}
    第一层循环 --yes--> 赋值j[j = 1]
    赋值j --> 第二层循环{"j < len - i ?"}
    第二层循环 --yes--> 判断{"arr[j - 1] < arr[j] ?"}
    判断 --yes--> 定义临时变量["int temp = arr[j - 1]"]
    定义临时变量 --> 交换aj["arr[j - 1] = arr[j]"]
    交换aj --> 交换aj-1["arr[j] = temp"]
    交换aj-1 --> j自增["j++"]
    j自增 --> 第二层循环
    判断 --no--> j自增
    第二层循环 --no--> i自增["i++"]
    i自增 --> 第一层循环
    第一层循环 --no--> endd([结束])
```

## 流程图，时序图

```flow
start=>start: 接收到消息
info=>operation: 读取信息
setCache=>operation: 更新缓存
end=>end: 处理结束

start->info->setCache->end
```

```flow
st=>start: Start
op=>operation: Your Operation
cond=>condition: Yes or No?
e=>end
st->op->cond
cond(yes)->e
cond(no)->op
```

```flow
start=>start: API请求
cache=>operation: 读取Redis缓存
cached=>condition: 是否有缓存？
sendMq=>operation: 发送MQ，后台服务更新缓存info=>operation: 读取信息
setCache=>operation: 保存缓存
end=>end: 返回信息

start->cache->cached
cached(yes)->sendMq
cached(no)->info
info->setCache
setCache->end
sendMq->end
```

```flow
st=>start: Start|past:>http://www.google.com[blank]e=>end: End:>http://www.google.com
op1=>operation: get_hotel_ids|past
op2=>operation: get_proxy|current
sub1=>subroutine: get_proxy|current
op3=>operation: save_comment|current
op4=>operation: set_sentiment|current
op5=>operation: set_record|current

cond1=>condition: ids_remain空?
cond2=>condition: proxy_list空?
cond3=>condition: ids_got空?
cond4=>condition: 爬取成功??
cond5=>condition: ids_remain空?

io1=>inputoutput: ids-remain
io2=>inputoutput: proxy_list
io3=>inputoutput: ids-got

st->op1(right)->io1->cond1
cond1(yes)->sub1->io2->cond2
cond2(no)->op3
cond2(yes)->sub1
cond1(no)->op3->cond4
cond4(yes)->io3->cond3
cond4(no)->io1
cond3(no)->op4
cond3(yes, right)->cond5
cond5(yes)->op5
cond5(no)->cond3
op5->e
```

## 时序图示例

```sequence
Title:时序图示例
客户端->服务端: 我想找你拿下数据 SYN
服务端-->客户端: 我收到你的请求啦 ACK+SYN
客户端->>服务端: 我收到你的确认啦，我们开始通信吧 ACK
Note right of 服务端: 我是一个服务端
Note left of 客户端: 我是一个客户端
Note over 服务端,客户端: TCP 三次握手
participant 观察者
```

## UML 时序图示例

```sequence
客户端->打印机: 打印请求(id)
打印机->数据库:请求数据(id)
Note right of 数据库: 执行SQL获取数据
数据库-->打印机:返回数据信息
Note right of 打印机:使用数据打印
打印机-->>客户端:返回打印结果
客户端->客户端:等待提取结果
```

## 甘特图示例

```mermaid
gantt
dateFormat YYYY-MM-DD

title 软件开发甘特图

section 设计
需求:done,des1, 2019-01-06,2019-01-08
原型:active,des2, 2019-01-09, 3d
UI设计:des3, after des2, 5d
未来任务:des4, after des3, 5d

section 开发
学习准备理解需求:crit, done, 2019-01-06,24h
设计框架:crit, done, after des2, 2d
开发:crit, active, 3d
未来任务:crit, 5d
休息时间:2d

section 测试
功能测试:active, a1, after des3, 3d
压力测试:after a1, 20h
测试报告: 48h
```

```
![Alt text](https://g.gravizo.com/svg?
  digraph G {
    size ="4,4";
    main [shape=box];
    main -> parse [weight=8];
    parse -> execute;
    main -> init [style=dotted];
    main -> cleanup;
    execute -> { make_string; printf}
    init -> make_string;
    edge [color=red];
    main -> printf [style=bold,label="100 times"];
    make_string [label="make a string"];
    node [shape=box,style=filled,color=".7 .3 1.0"];
    execute -> compare;
  }
)
```

## mermaid 和 flow 对比

```flow
paperjs=>start: paperjs（canvas库）
supjexl=>start: supjexl（表达式解析）
suppainter=>condition: suppainter（流程图核心绘制库）
appdev=>operation: appdev 流程图组态工具（基于Electron的组态软件。目前主要实现流程图的绘制。）
appdraw=>end: appdraw（npm包，各种api，挂载到具体Dom）
are-flowchart-web=>end: are-flowchart-web（监控/运行期使用）

paperjs->suppainter
supjexl->suppainter
suppainter(yes)->appdev
suppainter(no)->are-flowchart-web
appdev->appdraw

```

```mermaid
flowchart TB
A[paperjs__Canvas库] -->C(suppainter__流程图核心绘制库)
B[supjexl__表达式解析] -->C
C -->|组态期| D[appdev__流程图组态工具__基于Electron]
C -->|运行期| E[are-flowchart-web]
D -->|打包出| F[appdraw_npm包]
G[supcond_组件库] -->E
G[supcond_组件库] -->D
```

# 参考链接

- [ `Mermaid`中文网-流程图-基本语法](https://mermaid.nodejs.cn/syntax/flowchart.html)
- [⁡⁤⁢‍‌⁣⁢⁢⁤⁣‌‌⁢⁣⁢⁤⁡‌‌⁤⁤⁢⁡⁡⁢‍⁢⁣⁤‌Mermaid 绘图语法介绍-飞书云文档 (larkoffice.com)](https://bytedance.larkoffice.com/docx/CZUPdJAImo6uTsx5oddcaC0kn1d)
- [@Mermaid(1)流程图(flowcharts)使用详解 - OnceDay 的文章 - 知乎](https://zhuanlan.zhihu.com/p/683460723)
- [obsidian 中 Mermaid 语法——流程图（flowchart）](https://blog.csdn.net/harry0936/article/details/135232515)
