# protobuf

protobuf 是 Google 开发的一个序列化框架，类似 XML，JSON，基于二进制，比传统的 XML 表示同样一段内容要短小得多。通过 protobuf，可以很轻松的调用相关方法来完成业务数据的序列化与反序列化。

**【优点】：**

- 性能好/效率高
  　　现在，俺就来说说 Google 公司为啥放着好端端的 XML 不用，非要另起炉灶，重新造轮子。一个根本的原因是 XML 性能不够好。
  　　先说时间开销：XML 格式化（序列化）的开销倒还好；但是 XML 解析（反序列化）的开销就不敢恭维啦。俺之前经常碰到一些时间性能很敏感的场合，由于不堪忍受 XML 解析的速度，弃之如敝履。
  　　再来看空间开销：熟悉 XML 语法的同学应该知道，XML 格式为了有较好的可读性，引入了一些冗余的文本信息。所以空间开销也不是太好（不过这点缺点，俺不常碰到）。
  　　由于 Google 公司赖以吹嘘的就是它的海量数据和海量处理能力。对于几十万、上百万机器的集群，动不动就是 PB 级的数据量，哪怕性能稍微提高 0.1%也是相当可观滴。所以 Google 自然无法容忍 XML 在性能上的明显缺点。再加上 Google 从来就不缺造轮子的牛人，所以 protobuf 也就应运而生了。

- 代码生成机制
- 支持“向后兼容”和“向前兼容”
- 支持多种编程语言

**【缺点】：**

- 应用不够广
- 二进制格式导致可读性差
  　　为了提高性能，protobuf 采用了二进制格式进行编码。这直接导致了可读性差的问题（严格地说，是没有可读性）。虽然 protobuf 提供了 TextFormat 这个工具类（文档在“这里 ”），但终究无法彻底解决此问题。
  　　可读性差的危害，俺再来举个例子。比如通讯双方如果出现问题，极易导致扯皮（都不承认自己有问题，都说是对方的错）。俺对付扯皮的一个简单方法就是直接抓包并 dump 成 log，能比较容易地看出错误在哪一方。但是 protobuf 的二进制格式，导致你抓包并直接 dump 出来的 log 难以看懂。
- 缺乏自描述
  　　一般来说，XML 是自描述的，而 protobuf 格式则不是。给你一段二进制格式的协议内容，如果不配合相应的 proto 文件，那简直就像天书一般。
  　　由于“缺乏自描述”，再加上“二进制格式导致可读性差”。所以在配置文件方面，protobuf 是肯定无法取代 XML 的地位滴。
  **【参考链接】：**

- [Google 的开源技术 protobuf 简介与例子](https://blog.csdn.net/caisini_vc/article/details/5599468)

# 安装配置

**【参考链接】：**

- [Go 语言环境安装：命令行工具](https://learnku.com/go/wikis/26457)
- [Go 语言 GOPROXY 设置](https://blog.csdn.net/qq2942713658/article/details/112915326)
- [Go 设置 Proxy](http://events.jianshu.io/p/7de56dc78b63)

# 参考链接

- [Golang 官网](https://golang.google.cn/)
- [go 语言中文网](https://studygolang.com/)
- [Go 社区文档](https://learnku.com/go/docs)
- [@@@《Go 入门指南》](https://learnku.com/docs/the-way-to-go/origin-and-development/3562)
- [C 语言中文网-Go 语言教程](http://c.biancheng.net/golang/intro/)
- [阮一峰文章-Go 语言学习资料包](https://www.ruanyifeng.com/blog/2022/06/weekly-issue-211.html)
