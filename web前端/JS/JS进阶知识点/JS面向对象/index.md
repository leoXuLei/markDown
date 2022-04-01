# 继承

### 1.原型链继承
> **背景**

ECMAScript中描述了原型链的概念，并将原型链作为实现继承的主要方法。**其基本思想是利用原型让一个引用类型继承另一个引用类型的属性和方法**。简单回顾一下构造函数、原型和实例的关系：每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数的指针，而实例都包含一个指向原型对象的内部指针。**那么，假如我们让原型对象等于另一个类型的实例，结果会怎么样呢？显然，此时的原型对象将包含一个指向另一个原型的指针**，相应地，另一个原型中也包含着一个指向另一个构造函数的指针。假如另一个原型又是另一个类型的实例，那么上述关系依然成立，**如此层层递进，就构成了实例与原型的链条。这就是所谓原型链的基本概念**。

JavaScript中实现继承最简单的方式就是使用原型链，==将子类型的原型指向父类型的实例即可，即==`子类型.prototype = new 父类型();`，实现方法如下：
```js
// 为父类型创建构造函数
function Parent() {
  this.numberList = ["one", "two", "three"];
  this.parProperty = true;
}

// 为父类型添加方法
Parent.prototype.getParentProperty = function () {
  return this.parProperty;
};

// 为子类型创建构造函数
function Son() {
  this.hList = ["h1", "h2", "h3", "h4"];
  this.sonProperty = false;
}

// 实现继承的关键步骤，子类型的原型指向父类型的实例
Son.prototype = new Parent();
Son.prototype.getSonProperty = function () {
  return this.sonProperty;
};

var son1 = new Son();
console.log(`son1`, son1);
son1.numberList.push("four");
son1.hList.push("h5");
console.log(son1.getParentProperty()); // true
console.log(son1.getSonProperty()); // false
console.log(son1.numberList); // one two three four
console.log(son1.hList); // h1,h2,h3,h4,h5

var son2 = new Son();
console.log(son2.numberList); // one two three four
console.log(son2.hList); // h1,h2,h3,h4
console.log(son2.getParentProperty()); // true
console.log(son2.getSonProperty()); // false
```
可以看到如上的代码就是通过原型链实现的一个简单的继承，但看到测试代码示例中还是存在些问题。
> **问题**

- 问题一：**父类引用类型的属性会被所有子类实例所共享**
**第一个问题是由于子类型的原型是父类型的实例，也就是子类型的原型中包含的父类型的属性，从而导致引用类型值的原型属性会被所有实例所共享（参考创建对象的方式中的原型模式）**。以上代码的`son1.numberList.push("four")`，就可以证明此问题的存在。可以看到，`son1.numberList` 改变导致Son类的实例二son2的numberList跟实例1的保持一致。

- 问题二：**实例化子类时无法传参**
而原型链的第二个问题就是：在创建子类型的实例时，不能向超类型的构造函数中传递参数。因此我们在实际开发中，很少单独使用原型链。 
```js
// 实例化子类传参测试如下，好像是可以的，待验证
function Parent(name) {
  this.numberList = ["one", "two", "three"];
  this.parProperty = true;
  this.name = name;
}    
Parent.prototype.getParentProperty = function () {
  console.log("Parent: this.parProperty", this.parProperty, this.name);
};
Son.prototype = new Parent('xu');
Son.prototype.getSonProperty = function () {
  console.log("Son: this.sonProperty", this.sonProperty, this.name);
};

// Parent: this.parProperty true xu
// Son: this.sonProperty false xu
```
> **总结**
原型链继承方法，父类型中的引用类型的属性会被所有子类型的实例所共享
### 2.借用构造函数继承

```js
function Parent(name) {
  this.name = name;
  this.sayParent = function () {
    console.log(`Parent:`, this.name);
  };
}

function Child(name, age) {
  // 对象冒充和通过call/apply实现构造函数继承都可以
  // this.tempMethod = Parent;
  // this.tempMethod(name);
  Parent.call(this, name);
  this.age = age;
  this.sayChild = function () {
    console.log(`Child:${this.name}, age ${this.age}`);
  };
}

const parent = new Parent("江剑臣");
parent.sayParent(); // Parent: 江剑臣
const child = new Child("李铭", 26);
child.sayChild(); // Child:李铭, age 26
child.sayParent(); // Parent: 李铭
```

```js
// 为父类型创建构造函数
function ParentType(name) {
  this.name = name;
  this.color = ["pink", "yellow"];
  this.property = true;
  this.testFun = function () {
    console.log("http://tools.jb51.net/");
  };
}

// 为父类型添加方法
ParentType.prototype.getSuperValue = function () {
  return this.property;
};

// 为子类型创建构造函数
function ChildType(name) {
  ParentType.call(this, name);
  this.test = ["h1", "h2", "h3", "h4"];
  this.subProperty = false;
}
// 在此处给子类型添加方法，一定要在实现继承之后，否则会在将指针指向父类型的实例，则方法为空
ChildType.prototype.getSubValue = function () {
  return this.subProperty;
};

const child1 = new ChildType(["wuyuchang", "Jack", "Nick"]);
child1.name.push("hello");
child1.test.push("h5");
child1.color.push("blue");
child1.testFun(); // http://tools.jb51.net/

console.log(`child1.name`, child1.name); // ["wuyuchang", "Jack", "Nick", "hello"]
// console.log(`child1.getSuperValue`, child1.getSuperValue()); // child1.getSuperValue is not a function
console.log(`child1.test`, child1.test); // ["h1", "h2", "h3", "h4", "h5"]
console.log(`child1.color`, child1.color); // ["pink", "yellow", "blue"]
console.log(`child1.getSubValue`, child1.getSubValue()); // false

const child2 = new ChildType(["wyc"]);
child2.testFun(); // http://tools.jb51.net/
console.log(`child2.name`, child2.name);
// console.log(`child2.getSuperValue`, child2.getSuperValue()); // child2.getSuperValue is not a function
console.log(`child2.test`, child2.test); // ["h1", "h2", "h3", "h4"]
console.log(`child2.color`, child2.color); // ["pink", "yellow"]
console.log(`child2.getSubValue`, child2.getSubValue()); // false
```

### 3.组合继承

```js
// 为父类型创建构造函数
function ParentType(name) {
  this.name = name;
  this.color = ["pink", "yellow"];
  this.property = true;
  this.testFun = function () {
    console.log("http://tools.jb51.net/");
  };
}

// 为父类型添加方法
ParentType.prototype.getSuperValue = function () {
  return this.property;
};

// 为子类型创建构造函数
function ChildType(name) {
  ParentType.call(this, name); // !!!!!!!!!!!!!!!!!
  this.test = ["h1", "h2", "h3", "h4"];
  this.subProperty = false;
}
ChildType.prototype = new ParentType(); // !!!!!!!!!!!!!!!!!
// 在此处给子类型添加方法，一定要在实现继承之后，否则会在将指针指向父类型的实例，则方法为空
ChildType.prototype.getSubValue = function () {
  return this.subProperty;
};

const child1 = new ChildType(["wuyuchang", "Jack", "Nick"]);
child1.name.push("hello");
child1.test.push("h5");
child1.color.push("blue");
child1.testFun();

console.log(`child1.name`, child1.name); // ["wuyuchang", "Jack", "Nick", "hello"]
console.log(`child1.getSuperValue`, child1.getSuperValue()); // true
console.log(`child1.test`, child1.test); // ["h1", "h2", "h3", "h4", "h5"]
console.log(`child1.color`, child1.color); // ["pink", "yellow", "blue"]
console.log(`child1.getSubValue`, child1.getSubValue()); // false

const child2 = new ChildType(["wyc"]);
child2.testFun();
console.log(`child2.name`, child2.name); // ["wyc"]
console.log(`child2.getSuperValue`, child2.getSuperValue()); // true
console.log(`child2.test`, child2.test); // ["h1", "h2", "h3", "h4"]
console.log(`child2.color`, child2.color); // ["pink", "yellow"]
console.log(`child2.getSubValue`, child2.getSubValue()); // false
```

### 4.原型式继承

```js
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}
const person = {
  name: "wuyuchang",
  friends: ["wyc", "Nicholas", "Tim"],
};

const person1 = object(person);
person1.name = "Greg";
person1.friends.push("Bob");

console.log(person1.friends); // wyc,Nicholas,Tim,Bob,
console.log(person1.name); // Greg

const person2 = object(person);
person2.name = "Jack";
person2.friends.push("Rose");
console.log(person2.friends); // wyc,Nicholas,Tim,Bob,Rose
console.log(person2.name); // Jack
console.log(person.friends); // wyc,Nicholas,Tim,Bob,Rose
console.log(person.name); // wuyuchang
```
