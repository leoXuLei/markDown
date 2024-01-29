# 问题描述

web-view 之前做了一个功能：从本机注册表里读取监控当前登录用户名，并将值写入到 storage 中。在 Electron 项目中，可以使用 Node.js 提供的 winreg 模块来读取本机注册表信息，该功能就是这样实现的。但是现在发现用户登录监控，如果用户名是中文，那么读取到的登录用户名中中文部分会变成乱码。

> **【测试如下：】**

手动将注册表中目标路径的目标属性`LastUser`的值改成`测试人员Test`，然后在 webview 中打印如下：

- 在`regKey.get`中打印 item 得到：`item 锟斤拷锟斤拷锟斤拷员Test`。

- 在`preload.js`中打印`console.log('VisualField_LastUser', res)`得到：`VisualField_LastUser ������ԱTest`。

即反馈问题确实存在，目标属性值中若包含中文，则中文会变成乱码。

# 解决思路

## 思路一：`使用iconv-lite模块进行字符编码转换`

> **【询问 ChatGpt】**

> Q：使用 Node.js 提供的 winreg 模块来读取本机注册表的某个路径上的某个属性的值，由于该属性值中包含了中文，导致读取到的字符串中的中文部分变成了乱码，如何解决，使得能正常读取包含中文的属性值。

A：

要解决注册表中读取包含中文属性值的乱码问题，可以使用 Node.js 的 `iconv-lite` 模块进行字符编码转换。

以下是一个使用 `winreg` 和 `iconv-lite` 模块读取注册表中包含中文属性值的示例代码：

```tsx
const Registry = require("winreg");
const iconv = require("iconv-lite");

// 读取注册表路径
const regKey = new Registry({
  hive: Registry.HKCU, // 指定注册表的根键
  key: "\\YOUR\\REGISTER\\KEY\\PATH", // 注册表路径
});

// 读取属性值
regKey.get("YOUR_PROPERTY_NAME", function (err, result) {
  if (err) {
    console.error("Error:", err);
    return;
  }

  // 将读取到的值进行字符编码转换
  const decodedValue = iconv.decode(result.value, "GB2312"); // 假设使用GB2312编码，可以根据实际情况进行修改

  console.log("Decoded Value:", decodedValue);
});
```

> **【测试如下】**

尝试对读取到的值进行编码转换，常见编码方式都试一遍。如下。

```tsx
// test.js
regKey.get(key, (err, item) => {
  if (err) {
    console.error("gegistry getKey ::> err", err);
    reject(undefined);
  } else {
    // 打印注册表键的值
    console.log("origin value---------------", item?.value);

    // 将读取到的值进行字符编码转换
    const decodedValue = iconv.decode(item?.value, "utf-8");
    const decodedValue1 = iconv.decode(item?.value, "GBK");
    const decodedValue2 = iconv.decode(item?.value, "UTF-16LE");
    const decodedValue3 = iconv.decode(item?.value, "GB2312");
    const decodedValue4 = iconv.decode(item?.value, "win1252");
    const decodedValue5 = iconv.decode(Buffer.from(item?.value), "utf-8");

    const decodedValue6 = iconv.decode(
      Buffer.concat([Buffer.from(item?.value)]),
      "utf-8"
    );

    var decodedValue7 = Buffer.from(item?.value).toString("utf8"); // 使用UTF-8编码进行解码

    console.log("decodedValue——utf-8              ", decodedValue);
    console.log("decodedValue1——GBK               ", decodedValue1);
    console.log("decodedValue2——UTF-16LE          ", decodedValue2);
    console.log("decodedValue3——GB2312            ", decodedValue3);
    console.log("decodedValue4——win1252           ", decodedValue4);

    console.log("decodedValue5——buffer.from+utf-8 ", decodedValue5);
    console.log("decodedValue6——buffer.concat+utf-8", decodedValue6);
    console.log("decodedValue7——only Buffer.from+toString+utf8", decodedValue7);

    resolve([
      decodedValue,
      decodedValue1,
      decodedValue2,
      decodedValue3,
      decodedValue4,
      decodedValue5,
      decodedValue6,
      decodedValue7,
    ]);
  }
});
```

- 结果：失败，各种编码方式都尝试了，但是都没有解码成功，打印如下。

```tsx
origin value--------------- ������ԱTest

Iconv-lite warning: decode()-ing strings is deprecated. Refer to https://github.com/ashtuchkin/iconv-lite/wiki/Use-Buffers-when-decoding


decodedValue——utf-8               ������1Test

decodedValue1——GBK                1Test

decodedValue2——UTF-16LE           ﷽﷽﷽吱獥

decodedValue3——GB2312             ������1Test

decodedValue4——win1252            ýýýýýý1Test

decodedValue5——buffer.from+utf-8  ������ԱTest

decodedValue6——buffer.concat+utf-8 ������ԱTest

decodedValue7——only Buffer.from+toString+utf8 ������ԱTest
```

## 思路二：`debug依赖winreg源码，查看属性值处理前后分别是什么`

思路二都是 CB 提供的思路。

> **【确认思路】**

目前已知通过`winreg`依赖库读取到的注册表属性值中的中文是乱码，那么问题来了，既然我是通过`winreg`依赖库从系统读取到有乱码，**那么`winreg`从系统读取到的时候就是乱码，还是读取后处理的不对才导致的乱码呢**？

测试如下：注册表目标路径下新建一个`项`（记为`A`），然后右键`修改`，输入包含中文的属性值。然后`test.js`中读取目标路径下的属性`A`，发现读取到的属性值中文部分还是乱码，因此可以确定不是设置注册表属性的问题，**而是`winreg`依赖库从系统读取的属性值的编码格式处理的不对导致的中文变成乱码**。

> **【思路过程】**

在`winreg`依赖库的源码，即`xxx\node_modules\winreg\lib\registry.js`中找寻业务代码中调用的 Api：即`Registry`实例调用的`get`方法。其中发现了返回读取注册表属性结果的代码：`result = new RegistryItem(self.host, self.hive, self.key, name, type, value, self.arch); cb(null, result);`，发现 resut 都是从一个字符串变量`buffer`处理得到的。

打断点到`buffer`变量，悬浮发现其值是`'\r\nHKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\xx\\xx\\HMI\r\n LastUser REG_SZ ������ԱTest\r\n\r\n'`，即`buffer`变量的值中读取到的注册表属性值的中文部分已经是乱码了。

查看`buffer`变量的值是从哪来的，找到`proc.stdout.on('data', function (data) { buffer += data.toString(); });`，在此处打断点，发现`data`是个`Buffer`对象（即二进制数据）。

> - Node 中`Buffer`对象支持的编码有这些：`utf8、ucs2、utf16le、latin1、ascii、base64、hex`
> - `buffer.toString()`：将 `Buffer` 对象转换为字符串。可以指定编码格式进行解码，默认为 `UTF-8`。
> - 测试`buffer.toString()`，若该`buffer`对象描述的数据是包含中文的字符串，那么执行`buffer.toString()`（编码格式是`UTF-8`）后，字符串中文部分会解析为乱码。
> - 测试`buffer.toString('gbk')`，会报错：`Uncaught NodeError TypeError [ERR_UNKNOWN_ENCODING]: Unknown encoding: gbk`。使用 936 也同样。

> **【问题根本原因】**

**由上可以发现，Node 中`Buffer`对象不支持`gbk`编码，即无法直接使用 `buffer.toString('gbk')` 这样的方式将 `Buffer` 对象转换为 `gbk` 编码的字符串。而我本机`PowerShell`中`chcp`查询到的`控制台窗口`的字符编码就是`936`即`gbk` 编码**。

> **【问题如何解决】**

如果想在 `Node` 中处理 `gbk` 编码的字符串（如本需求：读取含有中文的注册表属性值），需要使用第三方库，如 `iconv-lite` 或 `iconv`。这些库提供了将 `Buffer` 对象从一种编码转换为另一种编码的功能。

### 测试：使用`iconv.decode`转码

```tsx
// node_modules\winreg\lib\registry.js

/**
 * Gets a named value from this registry key.
 * @param {string} name - the value name, use {@link Registry.DEFAULT_VALUE} or an empty string for the default value
 * @param {function (err, item)} cb - callback function
 * @param {ProcessUncleanExitError=} cb.err - error object or null if successful
 * @param {RegistryItem=} cb.item - the retrieved registry item
 * @returns {Registry} this registry key object
 */
Registry.prototype.get = function get(name, cb) {
  if (typeof cb !== "function") throw new TypeError("must specify a callback");

  var args = ["QUERY", this.path];
  if (name == "") args.push("/ve");
  else args = args.concat(["/v", name]);

  pushArch(args, this.arch);

  var proc = spawn(getRegExePath(), args, {
      cwd: undefined,
      env: process.env,
      shell: true,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    }),
    buffer = "",
    self = this,
    error = null; // null means no error previously reported.

  var output = captureOutput(proc);

  proc.on("close", function (code) {
    if (error) {
      return;
    } else if (code !== 0) {
      log("process exited with code " + code);
      cb(mkErrorMsg("QUERY", code, output), null);
    } else {
      var items = [],
        result = null,
        lines = buffer.split("\n"),
        lineNumber = 0;

      for (var i = 0, l = lines.length; i < l; i++) {
        var line = lines[i].trim();
        if (line.length > 0) {
          log(line);
          if (lineNumber != 0) {
            items.push(line);
          }
          ++lineNumber;
        }
      }

      //Get last item - so it works in XP where REG QUERY returns with a header
      var item = items[items.length - 1] || "",
        match = ITEM_PATTERN.exec(item),
        name,
        type,
        value;

      if (match) {
        name = match[1].trim();
        type = match[2].trim();
        value = match[3];
        result = new RegistryItem(
          self.host,
          self.hive,
          self.key,
          name,
          type,
          value,
          self.arch
        );
      }

      cb(null, result);
    }
  });

  proc.stdout.on("data", function (data) {
    console.log("handle data by utf8---", iconv.decode(data, "utf8"));
    console.log("handle data by utf16---", iconv.decode(data, "utf16"));
    console.log("handle data by 936---", iconv.decode(data, "936"));
    console.log("handle data by gbk---", iconv.decode(data, "gbk"));
    console.log("handle data by gb2312---", iconv.decode(data, "gb2312"));
    // console.log('iconv', iconv.decode(data,'ansi'));
    buffer += data.toString();
  });

  proc.on("error", function (err) {
    error = err;
    cb(err);
  });

  return this;
};
```

调试控制台输出如下，**可以发现使用`iconv.decod`将`Buffer`对象从指定的中文编码格式`gbk/936/gb2312`解码为字符串，则中文能解析出来**。

```tsx
// 【依赖库node_modules\winreg\lib\registry.js中打印的】

// 各种编码方式解析对比打印如下：路径、属性、属性值
handle data by utf8---
HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\xx\xx\HMI
    LastUser    REG_SZ    ������ԱTest


handle data by utf16--- ਍䭈奅䱟䍏䱁䵟䍁䥈䕎卜䙏坔剁居佗㙗㌴串摯履啓䍐乏噜獩慵䙬敩摬⸳〰䡜䥍਍††慌瑳獕牥††䕒彇婓††퓊쯈뇔敔瑳਍਍


handle data by 936---
HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\xx\xx\HMI
    LastUser    REG_SZ    测试人员Test


handle data by gbk---
HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\xx\xx\HMI
    LastUser    REG_SZ    测试人员Test


handle data by gb2312---
HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\xx\xx\HMI
    LastUser    REG_SZ    测试人员Test


node_modules/winreg/lib/registry.js:682
Uncaught Error Error: Encoding not recognized: 'ansi' (searched as: 'ansi')
    at getCodec (e:\xxx\web-view\node_modules\iconv-lite\lib\index.js:104:23)
    at getDecoder (e:\xxx\web-view\node_modules\iconv-lite\lib\index.js:125:23)
    at decode (e:\xxx\web-view\node_modules\iconv-lite\lib\index.js:38:25)
    at <anonymous> (e:\xxx\web-view\node_modules\winreg\lib\registry.js:683:32)
```

### 解决方法

> **【描述】**

因为要修改依赖库源码（`node_modules\winreg\lib\registry.js`），所以为了避免后续`yarn`安装依赖时，修改的文件被更新或者覆盖，直接复制文件（`node_modules\winreg\lib\registry.js`）到目录（`src\utils\winreg-lib-registry.js`）下，并重命名为`winreg-lib-registry.js`，在此文件基础上进行修改即可。

> **【思路】**

- 1. 获取到系统编码格式。
  - 在子进程中执行`chcp`命令，即可获取系统编码格式。
  - `execSync("chcp").toString()`执行了一个命令 `chcp`，该命令用于显示当前控制台的代码页（字符编码格式）
- 2. 使用`iconv.decode`，将一个 `Buffer` 对象从指定的编码格式(encoding)解码为字符串。如：`iconv.decode(bufferData, encoding);`

```js
// src/index.js

// const Registry = require('winreg');
const Registry = require("./utils/winreg-lib-registry.js");
// 引入了 execSync 函数，该函数用于同步执行子进程的命令。
const execSync = require("child_process").execSync;

// 从本机注册表里读取xx当前登录用户名
const readKeyFromLocalRegistry = async (key) => {
  return new Promise((resolve, reject) => {
    // 注册表键的路径
    const keyAccessPath = `\\SOFTWARE${
      ["x64", "arm64"].includes(os.arch()) ? "\\WOW6432Node" : ""
    }\\xx\\xx\\HMI`;

    const regKey = new Registry({
      hive: Registry.HKLM, // 指定注册表的根键
      key: keyAccessPath,
    });

    // 当前系统（控制台）的字符编码格式
    const curSystemEncoding = execSync("chcp").toString();

    // 改写了require('winreg')原型上的get方法，新增第二个参数：传入当前系统编码格式encoding，从而确保winreg中能够正确解码，否则读取的属性值中的中文会处理成乱码
    regKey.get(key, curSystemEncoding, (err, item) => {
      if (err) {
        console.error("gegistry getKey ::> err", err);
        reject(undefined);
      } else {
        // 打印注册表键的值
        console.log("origin value---------------", item?.value);

        // 将读取到的值进行字符编码转换
        const decodedValue = iconv.decode(item?.value, "utf-8");
        const decodedValue1 = iconv.decode(item?.value, "GBK");
        const decodedValue2 = iconv.decode(item?.value, "UTF-16LE");
        const decodedValue3 = iconv.decode(item?.value, "GB2312");
        const decodedValue4 = iconv.decode(item?.value, "win1252");
        const decodedValue5 = iconv.decode(Buffer.from(item?.value), "utf-8");

        const decodedValue6 = iconv.decode(
          Buffer.concat([Buffer.from(item?.value)]),
          "utf-8"
        );

        var decodedValue7 = Buffer.from(item?.value).toString("utf8"); // 使用UTF-8编码进行解码

        console.log("decodedValue——utf-8              ", decodedValue);
        console.log("decodedValue1——GBK               ", decodedValue1);
        console.log("decodedValue2——UTF-16LE          ", decodedValue2);
        console.log("decodedValue3——GB2312            ", decodedValue3);
        console.log("decodedValue4——win1252           ", decodedValue4);

        console.log("decodedValue5——buffer.from+utf-8 ", decodedValue5);
        console.log("decodedValue6——buffer.concat+utf-8", decodedValue6);
        console.log(
          "decodedValue7——only Buffer.from+toString+utf8",
          decodedValue7
        );

        resolve([
          decodedValue,
          decodedValue1,
          decodedValue2,
          decodedValue3,
          decodedValue4,
          decodedValue5,
          decodedValue6,
          decodedValue7,
        ]);
      }
    });
  });
};
```

```js
// `src\utils\winreg-lib-registry.js`

proc.stdout.on("data", function (data) {
  // console.log('handle data by utf8---', iconv.decode(data,'utf8'));
  // console.log('handle data by utf16---', iconv.decode(data,'utf16'));
  // console.log('handle data by 936---', iconv.decode(data,'936'));
  // console.log('handle data by gbk---', iconv.decode(data,'gbk'));
  // console.log('handle data by gb2312---', iconv.decode(data,'gb2312'));
  if (typeof encoding === "string" && encoding) {
    buffer += iconv.decode(data, encoding);
  } else {
    buffer += data.toString();
  }
});
```

> **【测试结果】**

`web-view` 启动之后，`开发者工具-Console`中打印如下，问题成功解决。

```tsx
[
  "KպXTest",
  "K蘸XTest",
  "핋墺敔瑳",
  "K蘸XTest",
  "KÕºXTest",
  "测试人员Test",
  "测试人员Test",
  "测试人员Test",
];
```

### 后续问题：英文系统

> **【描述】**

读取注册表属性值中中文乱码解决后，给了测试新包，测试装完新包后反馈：中文环境`web-view`能正常打开使用，而英文系统环境打不开有报错，报错信息如下（本地测试）。

```bash
throw new Error("Encoding not recognized: '" + encoding + "' (searched as: '"+enc+"')");
                ^

Error: Encoding not recognized: 'Active code page: 936' (searched as: 'activecodepage936')
    at Object.getCodec (xx\node_modules\iconv-lite\lib\index.js:104:23)
```

如上，英文系统环境下，读取到的系统编码格式`Encoding`是`Active code page: 936`。可以发现，传递这个`Encoding`后，`iconv-lite`源码中报错了，报错编码格式不能识别。而如果手动设置`Encoding`为`活动代码页: 936`或者`936`，则没有报错，能正常解码。

> **【问题原因】**

猜测是由于英文单词之间的空格导致`iconv-lite`源码中解析得到的编码是`'Active code page: 936'`，而不是期望的`936`。

> **【尝试解决】**

不管系统环境是中文还是英文，直接将`execSync("chcp")?.toString?.()`读取到的系统编码格式中的编码值`936`截取出来，并传递给`iconv-lite`的`decode`Api。

```js
// src/index.js

// 从本机注册表里读取xx当前登录用户名
const readKeyFromLocalRegistry = async (key) => {
  return new Promise((resolve, reject) => {
    // 注册表键的路径
    const keyAccessPath = `\\SOFTWARE${
      ["x64", "arm64"].includes(os.arch()) ? "\\WOW6432Node" : ""
    }\\x\\xx\\HMI`;

    const regKey = new Registry({
      hive: Registry.HKLM, // 指定注册表的根键
      key: keyAccessPath,
    });

    // 当前系统（控制台）的字符编码格式，值格式如：'活动代码页: 936'、'Active code page: 936'，中文环境解析没问题，但英文环境由于单词之间有空格会导致读取编码格式报错，所以只处理出编码值，如'936'
    const curSystemEncodingDesc = execSync("chcp")?.toString?.();
    const curSystemEncoding = curSystemEncodingDesc?.split(": ")?.[1];

    // 改写了require('winreg')原型上的get方法，新增第二个参数：传入当前系统编码格式encoding，从而确保winreg中能够正确解码，否则读取的属性值中的中文会处理成乱码
    regKey.get(key, curSystemEncoding, (err, item) => {
      if (err) {
        console.error("gegistry getKey ::> err", err);
        reject(undefined);
      } else {
        // 打印注册表键的值
        // console.log("origin value---------------", item?.value);
        resolve(item?.value);
      }
    });
  });
};
```

```js
proc.stdout.on("data", function (data) {
  if (typeof encoding === "string" && encoding) {
    // buffer += iconv.decode(data, '活动代码页: 936'); // 正常
    // buffer += iconv.decode(data, '936'); // 直接用编码值也正常
    // buffer += iconv.decode(data, 'Active code page: 936'); // 英文操作系统环境下（猜测是由于英文单词之间的空格导致解释编码错误），iconv-lite\lib\index.js 中报错 Error: Encoding not recognized: 'Active code page: 936' (searched as: 'activecodepage936')
    // buffer += iconv.decode(data, '65001'); // 报错 Error: Encoding not recognized: '65001' (searched as: '65001')
    buffer += iconv.decode(data, encoding); // 中文环境正常，英文环境报错：，iconv-lite\lib\index.js 中报错 Error: Encoding not recognized: 'Active code page: 936' (searched as: 'activecodepage936')
  } else {
    buffer += data.toString();
  }
});
```

```js
"活动代码页: 936".split(": ");
// ['活动代码页', '936']

"Active code page: 936".split(": ");
// ['Active code page', '936']
```

> **【结果】**

修改后重新打包，测试替换模块后，英文系统环境下能正常打开`web-view`了，问题解决。

# 知识点

## 字符编码格式

`936` 是一种常见的字符编码格式，也被称为 `GBK` `编码。GBK` 编码是基于国标 `GB2312` 扩展而来的，支持简体中文和繁体中文字符。它是在中国大陆广泛使用的字符编码格式之一。

`65001` 指的是 `UTF-8` 字符编码。`UTF-8` 是一种通用的多字节字符编码，用于表示 `Unicode` 字符集中的字符。通过使用这个编码，我们可以将从 data 中读取的字节序列解码为 `Unicode` 字符。

## `chcp`：查看/切换控制台窗口的字符编码格式

> **【介绍】**

在 Windows 命令行中，chcp（change code page）命令`用于切换控制台窗口的字符编码页（格式）`。以下是常见的 chcp 命令的值及其对应的字符编码页：

- `437` - 美国 MS-DOS
- `936` - 简体中文 GB2312
- `950` - 繁体中文 Big5
- `1252` - 西欧 Windows
- `65001` - UTF-8

> **【Api】**

- `chcp`：查看`控制台窗口`的字符编码页

  - 中文环境会返回类似于以下内容的消息：`活动代码页: 936`
  - 英文环境会返回类似于以下内容的消息：`Active code page: 936`

- `chcp ${code}`：将`控制台窗口`的字符编码页改为`${code}`
  - 注意：只会更改`控制台窗口`的编码设置，并不会影响其他应用程序或文本文件的编码。
  - 示例：`chcp 936` 是用于将`控制台窗口`的编码设置为简体中文的代码页。
  - 如果指定的编码无效，将显示以下错误消息
    - 中文环境：`无效代码页`
    - 英文环境：`Invalid code page`

**【参考链接】**

- [查看 windows 系统默认编码，修改 windows 系统默认编码](https://blog.csdn.net/a320976399/article/details/119793761)

## `Buffer`：Node 中处理二进制数据的类

> **【介绍】**

在 JavaScript 中，`Buffer` 是 Node.js 提供的一个用于处理二进制数据的类。它是一个全局构造函数，用于创建固定长度的缓冲区，类似于字节数组。

Buffer 对象是一个类似于数组的对象，**用于在内存中存储原始的二进制数据。与 JavaScript 中的字符串不同，Buffer 可以存储任意类型的数据，包括 UTF-8 编码的文本、整数、浮点数等**。它在处理网络流、文件系统操作、加密算法等场景中非常有用。

**Buffer 对象可以存储和操作二进制数据**，比如字节、整数、浮点数等。它的操作类似于数组，可以读取和修改缓冲区中的数据，也可以进行切片和拼接等操作。

Buffer 对象可以通过多种方式创建，包括传入指定大小的字节数组、字符串、数组、Buffer 对象、TypedArray 等。也可以使用 Buffer 类的方法来修改和操作缓冲区的内容，比如读取指定位置的字节、写入字节数组等。

在 Node.js 中，Buffer 被广泛用于处理网络数据、文件读写、加密解密等场景。它提供了一系列功能强大的方法和属性，比如比较、拷贝、转换等，方便处理和操作二进制数据。**由于 JavaScript 本身不直接支持二进制操作，Buffer 在 Node.js 中成为了处理二进制数据的标准方式**。

> **【Buffer 支持的编码】**

每种语言都支持字符集的编码解码，Node.js 也同样。Node.js 里面可以通过 `Buffer` 来存储二进制的数据，**而二进制的数据转为字符串的时候就需要指定字符集**，`Buffer` 的 `from、byteLength、lastIndexOf` 等方法都支持指定 encoding。

具体支持的 encoding 有这些：`utf8、ucs2、utf16le、latin1、ascii、base64、hex`

> **【Api】**

下面是一些常用的 Buffer 对象的方法和属性：

- `Buffer.from()`：用于将其他数据类型（例如字符串、数组、数组缓冲区等）转换为 Buffer 对象。
- `Buffer.alloc()`：用于创建一个指定大小的新的 Buffer 对象。分配的内存将被填充为零。
- `Buffer.concat()`：用于将多个 Buffer 对象连接到一个新的 Buffer 对象中。
- `buffer.length`：用于获取 Buffer 对象的字节数。
- `buffer.toString()`：将 Buffer 对象转换为字符串。可以指定编码格式进行解码，默认为 UTF-8。（不知道为啥，指定其它不生效，好像只能是默认的 UTF-8）

以下是一个简单的示例，演示了如何使用 Buffer 对象：

```jsx
// 创建一个Buffer对象
var buffer1 = Buffer.from("Hello");
var buffer2 = Buffer.from("World");

// 将多个Buffer对象连接到一个新的Buffer对象中
var concatenatedBuffer = Buffer.concat([buffer1, buffer2]);

// 将Buffer对象转换为字符串
var str = concatenatedBuffer.toString();

console.log(str); // 输出：HelloWorld
console.log(concatenatedBuffer.length); // 输出：10
```

在这个示例中，我们首先创建了两个 Buffer 对象，然后使用 Buffer.concat()方法将它们连接到一个新的 Buffer 对象中。最后，我们使用 toString()方法将 Buffer 对象转换为字符串，并输出结果。

除了上面提到的方法和属性之外，Buffer 还提供了其他一些方法来读取、写入、修改和比较二进制数据。可以查阅官方文档以了解更多关于 Buffer 对象的详细信息。

> **【参考链接】**

- [@@@深入理解 Node.js Buffer 的 encoding](https://juejin.cn/post/7000610442695426079)
- [[译]一篇帮你彻底弄懂 NodeJs 中的 Buffer](https://juejin.cn/post/6844903688188723208)

## `child_process`：Node 核心模块，创建子进程并通信

> **【背景】**

`Node.js`中的单线程无阻塞性能非常适合单个进程。但是最终，一个 CPU 中的一个进程不足以处理应用程序不断增加的工作量。

无论您的服务器多么强大，一个线程只能支持有限的负载。

`Node.js`在单个线程中运行的事实并不意味着我们不能利用多个进程，当然也不能利用多个计算机。

使用多个进程是扩展 Node 应用程序的最佳方法。 `Node.js`设计用于构建具有多个节点的分布式应用程序。这就是为什么它被命名节点。 可伸缩性已植入平台中，您在应用程序的生命周期后期就不会开始考虑它。

> **【子进程模块】**

`child_process` 是 `Node.js` 提供的一个核心模块，**用于创建子进程并与其进行通信。它的作用是让 `Node.js` 程序能够执行外部命令、调用系统工具、执行 shell 脚本等**。**能够通过在子进程中运行任何系统命令来访问操作系统功能**。

`child_process` 模块提供了几个函数和类，可以用于创建、管理和与子进程进行交互。以下是 `child_process` 模块的一些常用方法：

- `child_process.spawn(command[, args][, options])`：以一个命令作为参数创建一个子进程，并返回一个 ChildProcess 对象。**你可以通过传递命令行参数和选项来指定子进程的行为**。

- `child_process.exec(command[, options][, callback])`：执行一个命令，并返回一个 ChildProcess 对象或者通过回调函数返回执行结果。你可以使用该方法执行简单的命令，但如果命令产生大量的输出，可以使用 spawn 方法。

- `child_process.execFile(file[, args][, options][, callback])`：运行一个可执行文件，并返回一个 ChildProcess 对象或者通过回调函数返回执行结果。

- `child_process.fork(modulePath[, args][, options])`：通过复制当前进程来创建一个新的 Node.js 子进程。该方法用于创建能够进行通信的子进程，一般用于创建多个并发的工作进程。

以下是一个简单的示例，展示如何使用 `child_process.spawn` 执行一个命令并输出结果：

```tsx
const { spawn } = require("child_process");

// 执行 'ls' 命令
const ls = spawn("ls", ["-lh", "/usr"]);

// 监听子进程的 stdout 事件，将输出打印到控制台
ls.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

// 监听子进程的 stderr 事件，将错误输出打印到控制台
ls.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});

// 监听子进程的 close 事件，当子进程退出时打印退出码
ls.on("close", (code) => {
  console.log(`子进程退出，退出码 ${code}`);
});
```

在这个示例中，我们使用 `spawn` 方法执行了 `ls -lh /usr` 命令，并通过监听子进程的 `stdout` 和 `stderr` 事件来分别输出命令执行结果和错误信息。最后，我们还监听了子进程的 `close` 事件，打印子进程的退出码。

通过 `child_process` 模块，你可以在 `Node.js` 程序中与外部命令和工具进行交互，获取它们的输出、输入和错误，并可以控制子进程的行为和生命周期。

## `iconv-lite`：JS 转换字符编码的库

> **【介绍】**

> **【Api】**

```tsx
// Convert from an encoded buffer to a js string.
str = iconv.decode(Buffer.from([0x68, 0x65, 0x6c, 0x6c, 0x6f]), "win1251");

// Convert from a js string to an encoded buffer.
buf = iconv.encode("Sample input string", "win1251");

// Check if encoding is supported
iconv.encodingExists("us-ascii");
```

- `iconv.decode`：`iconv.decode(buffer, encoding, [options])`
  - 用途：将一个 Buffer 或 Uint8Array 对象从指定的编码格式(encoding)解码为字符串。返回解码后的字符串。
  - `buffer`：要解码的数据，可以是 Buffer 对象或者 TypedArray（例如 Uint8Array）。
  - `encoding`：解码的目标编码，例如 "utf-8"。
  - `options`（可选）：一个可选的选项对象，可以用来设置自定义的编码器和解码器。

例如，使用`iconv.decode`函数解码一个 Buffer 对象并指定编码为`'GB2312'`：`iconv.decode(buffer, 'GB2312');`

- `iconv.encode`：`iconv.encode(str, encoding, [options])`

  - 用途：将一个字符串编码为指定的字符编码格式(encoding)的 Buffer。返回编码后的 Buffer 对象。
  - `str`：要编码的字符串。
  - `encoding`：目标编码格式，例如 "utf-8"。
  - `options`（可选）：一个可选的选项对象，可以用来设置自定义的编码器和解码器。

- `iconv.encodingExists`：`iconv.encode(str, encoding, [options])`

  - 用途：用于检查给定的编码格式是否被支持。

- `iconv.decodeStream`：`iconv.decodeStream(encoding, [options])`

  - 用途：返回一个可写流，用于将从指定编码解码为字符串。

- `iconv.encodeStream`：`iconv.encodeStream(encoding, [options])`
  - 用途：返回一个可读流，用于将字符串编码为指定编码格式的 Buffer。

> **【Supported Encodings】**

- `Node.js Native encodings`: utf8, cesu8, ucs2 / utf16le, ascii, binary, base64, hex
- `Unicode`: UTF7, UTF7-IMAP, UTF-16BE, UTF-16 (with BOM), UCS-4/UTF-32 (with BOM), UTF-32LE, UTF-32BE
- `Single-byte`:
  - `Windows codepages`: 874, 1250-1258 (aliases: cpXXX, winXXX, windowsXXX)
  - `ISO codepages`: ISO-8859-1 - ISO-8859-16
  - `IBM codepages`: 437, 720, 737, 775, 808, 850, 852, 855-858, 860-866, 869, 922, 1046, 1124, 1125, 1129, 1133, 1161-1163 (aliases cpXXX, ibmXXX)
  - `Mac codepages`: maccroatian, maccyrillic, macgreek, maciceland, macroman, macromania, macthai, macturkish, macukraine, maccenteuro, macintosh
  - `KOI8 codepages`: koi8-r, koi8-u, koi8-ru, koi8-t
  - `Miscellaneous`: armscii8, rk1048, tcvn, georgianacademy, georgianps, pt154, viscii, iso646cn, iso646jp, hproman8, tis620
- `Multi-byte`:
  - `Japanese`: Shift_JIS, Windows-31j, Windows932, EUC-JP
  - `Chinese`: GB2312, GBK, GB18030, Windows936, EUC-CN
  - `Korean`: KS_C_5601, Windows949, EUC-KR
  - `Taiwan/Hong Kong`: Big5, Big5-HKSCS, Windows950

> **【参考链接】**

- [Github\_\_iconv-lite](https://github.com/ashtuchkin/iconv-lite)
- [Github\_\_iconv-lite\_\_Supported-Encodings](https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings)
- [Github\_\_iconv-lite\_\_Use-Buffers-when-decoding](https://github.com/ashtuchkin/iconv-lite/wiki/Use-Buffers-when-decoding)

## VsCode 中 Debug 依赖库源码

- 1. 点击`运行和调试`（快捷键：`Ctrl+Shift+D`），添加调试文件的配置，配置如下：

  ```tsx
  {
    "version": "0.2.0",
    "configurations": [
        {
            "type": "pwa-node",
            "request": "launch",
            "name": "Launch Program",
            "skipFiles": [
                "<node_internals>/**"
            ],
            // 运行的js文件的入口，在根目录下的test.js
            "program": "${workspaceFolder}\\test.js",
        }
    ]
  }
  ```

- 2. `node_modules`中找到依赖库的 lib 文件夹下的编译后文件，找到目标 api 所在位置，在文件每一行的行号的左侧点击即可新增断点。

- 3. 点击`左上角调试按钮-绿色右指向三角`(快捷键：`F5`)，开始执行入口文件并`调试程序`。

- 4. 左侧底部可看到断点列表，可批量激活/反激活断点。同时可以观察调试控制台，可以输出源码中新增的`console`。

  ```tsx
  proc.stdout.on("data", function (data) {
    console.log("iconv", iconv.decode(data, "utf8"));
    console.log("iconv", iconv.decode(data, "936"));
    console.log("iconv", iconv.decode(data, "utf16"));
    console.log("iconv", iconv.decode(data, "gb2312"));
    console.log("iconv", iconv.decode(data, "ansi"));
    buffer += data.toString();
  });
  ```

## 其它

- 注册表除了`win+s`搜索然后打开外，还能够直接`win+s`搜索`注册表`来打开。
- **命令行界面用 node 加载运行 JS 代码**

  - web-view`src/index.js`文件中想要测试效果，需要起 Electron，比较麻烦且缓慢，不如直接把`src/index.js`复制个测试文件`test.js`出来。然后`node .\test.js`直接运行，方便快捷。
