## 简介

### 类的由来

JavaScript 语言中，==生成实例对象的传统方法是通过构造函数==。下面是一个例子。

```js
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () {
  return "(" + this.x + ", " + this.y + ")";
};

var p = new Point(1, 2);
```

#### **背景：**

上面这种写法跟传统的面向对象语言（比如 C++ 和 Java）差异很大，很容易让新学习这门语言的程序员感到困惑。

ES6 提供了更接近传统语言的写法，==引入了 Class（类）这个概念，作为对象的模板。通过 class 关键字，可以定义类==。

#### **本质：**

基本上，==ES6 的 class 可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到，新的 class 写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已==。上面的代码用 ES6 的 class 改写，就是下面这样。

```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return "(" + this.x + ", " + this.y + ")";
  }
}
```

#### **规则：**

- 【1】==constructor()方法，这就是构造方法，而 this 关键字则代表实例对象==

- 【2】==方法名前面不需要加上 function 这个关键字，直接把函数定义放进去了就可以了。另外，方法与方法之间不需要逗号分隔，加了会报错==。

- 【3】==ES6 的类，完全可以看作构造函数的另一种写法==。实例代码表明，==类的数据类型就是函数，类本身就指向构造函数==。使用的时候，也是直接对类使用 new 命令，跟构造函数的用法完全一致。

- 【4】==构造函数的 prototype 属性，在 ES6 的“类”上面继续存在。事实上，类的所有方法都定义在类的 prototype 属性上面。 在类的实例上面调用方法，其实就是调用原型上的方法==。

- 【5】由于类的方法都定义在 prototype 对象上面，==所以类的新方法可以添加在 prototype 对象上面。Object.assign()方法可以很方便地一次向类添加多个方法==。

- 【6】==prototype 对象的 constructor()属性，直接指向“类”的本身，这与 ES5 的行为是一致的==。

- 【7】类的内部所有定义的方法，都是不可枚举的（non-enumerable）。这一点与 ES5 的行为不一致，采用 ES5 的写法内部定义的方法就是可枚举。

上面代码定义了一个“类”，可以看到里面有一个[规则 1]。这种新的 Class 写法，本质上与本章开头的 ES5 的构造函数 Point 是一致的。

Point 类除了构造方法，还定义了一个 toString()方法。注意，定义 toString()方法的时候，[规则 2]

```js
// 【3】
class Point {
  // ...
}

typeof Point; // "function"
Point === Point.prototype.constructor; // true
```

上面代码表明，==类的数据类型就是函数，类本身就指向构造函数==。

```js
class Bar {
  doStuff() {
    console.log("stuff");
  }
}

const b = new Bar();
b.doStuff(); // "stuff"
```

使用的时候，也是直接对类使用 new 命令，跟构造函数的用法完全一致。

```js
class Point {
  constructor() {
    // ...
  }

  toString() {
    // ...
  }

  toValue() {
    // ...
  }
}

// 等同于

Point.prototype = {
  constructor() {},
  toString() {},
  toValue() {},
};
```

上面代码中，==constructor()、toString()、toValue()这三个方法，其实都是定义在 Point.prototype 上面。因此，在类的实例上面调用方法，其实就是调用原型上的方法==。

```js
class B {}
const b = new B();

b.constructor === B.prototype.constructor; // true
```

上面代码中，b 是 B 类的实例，它的 constructor()方法就是 B 类原型的 constructor()方法。

```js
// 【5】
class Point {
  constructor() {
    // ...
  }
}

Object.assign(Point.prototype, {
  toString() {},
  toValue() {},
});
```

```js
Point.prototype.constructor === Point; // true
```

prototype 对象的 constructor()属性，直接指向“类”的本身，这与 ES5 的行为是一致的。

```js
class Point {
  constructor(x, y) {
    // ...
  }

  toString() {
    // ...
  }
}

Object.keys(Point.prototype);
// []
Object.getOwnPropertyNames(Point.prototype);
// ["constructor","toString"]
```

上面代码中，toString()方法是 Point 类内部定义的方法，它是不可枚举的。这一点与 ES5 的行为不一致。

```js
var Point = function (x, y) {
  // ...
};

Point.prototype.toString = function () {
  // ...
};

Object.keys(Point.prototype);
// ["toString"]
Object.getOwnPropertyNames(Point.prototype);
// ["constructor","toString"]
```

上面代码采用 ES5 的写法，toString()方法就是可枚举的。

### constructor 方法

> **规则：**

- 【1】==constructor()方法是类的默认方法，通过 new 命令生成对象实例时，自动调用该方法==。一个类必须有 constructor()方法，==如果没有显式定义，一个空的 constructor()方法会被默认添加==。
- 【2】constructor()方法默认返回实例对象（即 this），完全可以指定返回另外一个对象。

- 【3】==类必须使用 new 调用，否则会报错。这是它跟普通构造函数的一个主要区别，后者不用 new 也可以执行==。

```js
// 【1】
class Point {}

// 等同于
class Point {
  constructor() {}
}
```

上面代码中，定义了一个空的类 Point，JavaScript 引擎会自动为它添加一个空的 constructor()方法。

```js
// 【2】
class Foo {
  constructor() {
    return Object.create(null);
  }
}

new Foo() instanceof Foo;
// false
```

上面代码中，constructor()函数返回一个全新的对象，结果导致实例对象不是 Foo 类的实例。

```js
// 【3】
class Foo {
  constructor() {
    return Object.create(null);
  }
}

Foo();
// TypeError: Class constructor Foo cannot be invoked without 'new'
```

### 类的实例

> **规则：**

- 【1】==与 ES5 一样，实例的属性除非显式定义在其本身（即定义在 this 对象上），否则都是定义在原型上（即定义在 class 上）==。
- 【2】==与 ES5 一样，类的所有实例共享一个原型对象。这也意味着，可以通过实例的**proto**属性为“类”添加方法==。

```js
class Point {
  // ...
}

// 报错
var point = Point(2, 3);

// 正确
var point = new Point(2, 3);
```

生成类的实例的写法，与 ES5 完全一样，也是使用 new 命令。前面说过，如果忘记加上 new，像函数那样调用 Class，将会报错。

```js
// 【1】
//定义类
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return "(" + this.x + ", " + this.y + ")";
  }
}

var point = new Point(2, 3);

point.toString(); // (2, 3)

point.hasOwnProperty("x"); // true
point.hasOwnProperty("y"); // true
point.hasOwnProperty("toString"); // false
point.__proto__.hasOwnProperty("toString"); // true
```

上面代码中，x 和 y 都是实例对象 point 自身的属性（因为定义在 this 对象上），所以 hasOwnProperty()方法返回 true，而 toString()是原型对象的属性（因为定义在 Point 类上），所以 hasOwnProperty()方法返回 false。这些都与 ES5 的行为保持一致。

```js
// 【2】
var p1 = new Point(2, 3);
var p2 = new Point(3, 2);

p1.__proto__ === p2.__proto__;
//true
```

上面代码中，p1 和 p2 都是 Point 的实例，它们的原型都是 Point.prototype，所以**proto**属性是相等的。

这也意味着，可以通过实例的**proto**属性为“类”添加方法。

> **proto** 并不是语言本身的特性，这是各大厂商具体实现时添加的私有属性，虽然目前很多现代浏览器的 JS 引擎中都提供了这个私有属性，==但依旧不建议在生产中使用该属性，避免对环境产生依赖。生产环境中，我们可以使用 Object.getPrototypeOf 方法来获取实例对象的原型，然后再来为原型添加方法/属性==。

```js
var p1 = new Point(2, 3);
var p2 = new Point(3, 2);

p1.__proto__.printName = function () {
  return "Oops";
};

p1.printName(); // "Oops"
p2.printName(); // "Oops"

var p3 = new Point(4, 2);
p3.printName(); // "Oops"
```

上面代码在 p1 的原型上添加了一个 printName()方法，由于 p1 的原型就是 p2 的原型，因此 p2 也可以调用这个方法。而且，此后新建的实例 p3 也可以调用这个方法。这意味着，使用实例的**proto**属性改写原型，必须相当谨慎，不推荐使用，因为这会改变“类”的原始定义，影响到所有实例。

### 取值函数（getter）和存值函数（setter）

### 属性表达式

> **规则：**

- 【1】类的属性名，可以采用表达式。

```js
let methodName = "getArea";

class Square {
  constructor(length) {
    // ...
  }

  [methodName]() {
    // ...
  }
}
```

上面代码中，Square 类的方法名 getArea，是从表达式得到的。

### Class 表达式

> **规则：**

- 【1】与函数一样，类也可以使用表达式的形式定义。

```javascript
// 【1】
const MyClass = class Me {
  getClassName() {
    return Me.name;
  }
};
```

上面代码使用表达式定义了一个类。需要注意的是，这个类的名字是`Me`，==但是`Me`只在 Class 的内部可用，指代当前类。在 Class 外部，这个类只能用`MyClass`引用==。

```javascript
let inst = new MyClass();
inst.getClassName(); // Me
Me.name; // ReferenceError: Me is not defined
```

上面代码表示，`Me`只在 Class 内部有定义。

如果类的内部没用到的话，可以省略`Me`，也就是可以写成下面的形式。

```javascript
const MyClass = class {
  /* ... */
};
```

- 【2】采用 Class 表达式，可以写出立即执行的 Class。

```javascript
let person = new (class {
  constructor(name) {
    this.name = name;
  }

  sayName() {
    console.log(this.name);
  }
})("张三");

person.sayName(); // "张三"
```

上面代码中，`person`是一个立即执行的类的实例。

### 注意点

**（1）严格模式**

类和模块的内部，默认就是严格模式，所以不需要使用`use strict`指定运行模式。只要你的代码写在类或模块之中，就只有严格模式可用。考虑到未来所有的代码，其实都是运行在模块之中，所以 ES6 实际上把整个语言升级到了严格模式。

**（2）不存在提升**

类不存在变量提升（hoist），这一点与 ES5 完全不同。

```javascript
new Foo(); // ReferenceError
class Foo {}
```

上面代码中，`Foo`类使用在前，定义在后，这样会报错，因为 ES6 不会把类的声明提升到代码头部。这种规定的原因与下文要提到的继承有关，必须保证子类在父类之后定义。

```javascript
{
  let Foo = class {};
  class Bar extends Foo {}
}
```

上面的代码不会报错，因为`Bar`继承`Foo`的时候，`Foo`已经有定义了。但是，如果存在`class`的提升，上面代码就会报错，因为`class`会被提升到代码头部，而`let`命令是不提升的，所以导致`Bar`继承`Foo`的时候，`Foo`还没有定义。

**（3）name 属性**

由于本质上，ES6 的类只是 ES5 的构造函数的一层包装，所以函数的许多特性都被`Class`继承，包括`name`属性。

```javascript
class Point {}
Point.name; // "Point"
```

`name`属性总是返回紧跟在`class`关键字后面的类名。

**（4）Generator 方法**

如果某个方法之前加上星号（`*`），就表示该方法是一个 Generator 函数。

```javascript
class Foo {
  constructor(...args) {
    this.args = args;
  }
  *[Symbol.iterator]() {
    for (let arg of this.args) {
      yield arg;
    }
  }
}

for (let x of new Foo("hello", "world")) {
  console.log(x);
}
// hello
// world
```

上面代码中，`Foo`类的`Symbol.iterator`方法前有一个星号，表示该方法是一个 Generator 函数。`Symbol.iterator`方法返回一个`Foo`类的默认遍历器，`for...of`循环会自动调用这个遍历器。

**（5）this 的指向**

类的方法内部如果含有`this`，它默认指向类的实例。但是，必须非常小心，一旦单独使用该方法，很可能报错。

```javascript
class Logger {
  printName(name = "there") {
    this.print(`Hello ${name}`);
  }

  print(text) {
    console.log(text);
  }
}

const logger = new Logger();
const { printName } = logger;
printName(); // TypeError: Cannot read property 'print' of undefined
```

上面代码中，`printName`方法中的`this`，默认指向`Logger`类的实例。但是，如果将这个方法提取出来单独使用，`this`会指向该方法运行时所在的环境（由于 class 内部是严格模式，所以 this 实际指向的是`undefined`），从而导致找不到`print`方法而报错。

一个比较简单的解决方法是，在构造方法中绑定`this`，这样就不会找不到`print`方法了。

```javascript
class Logger {
  constructor() {
    this.printName = this.printName.bind(this);
  }

  // ...
}
```

另一种解决方法是使用箭头函数。

```javascript
class Obj {
  constructor() {
    this.getThis = () => this;
  }
}

const myObj = new Obj();
myObj.getThis() === myObj; // true
```

箭头函数内部的`this`总是指向定义时所在的对象。上面代码中，箭头函数位于构造函数内部，它的定义生效的时候，是在构造函数执行的时候。这时，箭头函数所在的运行环境，肯定是实例对象，所以`this`会总是指向实例对象。

还有一种解决方法是使用`Proxy`，获取方法的时候，自动绑定`this`。

```javascript
function selfish(target) {
  const cache = new WeakMap();
  const handler = {
    get(target, key) {
      const value = Reflect.get(target, key);
      if (typeof value !== "function") {
        return value;
      }
      if (!cache.has(value)) {
        cache.set(value, value.bind(target));
      }
      return cache.get(value);
    },
  };
  const proxy = new Proxy(target, handler);
  return proxy;
}

const logger = selfish(new Logger());
```

## 静态方法

- **定义：** ==类相当于实例的原型==，所有在类中定义的方法，都会被实例继承。==如果在一个方法前，加上 static 关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”==。

- **规则：**
  - 只能通过类来调用静态方法，如果在实例上调用静态方法，会抛出一个错误，表示不存在该方法。
  - 如果静态方法包含 this 关键字，这个 this 指的是类，而不是实例。
  - 父类的静态方法，可以被子类继承。
  - 静态方法也是可以从 super 对象上调用的。

```javascript
// 【1】
class Foo {
  static classMethod() {
    return "hello";
  }
}

Foo.classMethod(); // 'hello'

var foo = new Foo();
foo.classMethod();
// TypeError: foo.classMethod is not a function
```

```js
// 【2】
class Foo {
  static bar() {
    this.baz();
  }
  static baz() {
    console.log("hello");
  }
  baz() {
    console.log("world");
  }
}

Foo.bar(); // hello

// 上面代码中，静态方法bar调用了this.baz，这里的this指的是Foo类，而不是Foo的实例，等同于调用Foo.baz。另外，从这个例子还可以看出，静态方法可以与非静态方法重名。
```

```js
// 【3】
class Foo {
  static classMethod() {
    return "hello";
  }
}

class Bar extends Foo {}

Bar.classMethod(); // 'hello'
```

```js
// 【4】
class Foo {
  static classMethod() {
    return "hello";
  }
}

class Bar extends Foo {
  static classMethod() {
    return super.classMethod() + ", too";
  }
}

Bar.classMethod(); // "hello, too"
```

## 静态属性

- **定义：** 静态属性指的是 Class 本身的属性，即 Class.propName，而不是定义在实例对象（this）上的属性。

```js
// 老写法
class Foo {
  // ...
}
Foo.prop = 1;

// 新写法
class Foo {
  static prop = 1;
}
```
