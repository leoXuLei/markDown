# 继承

### 1.原型链继承

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

### 2.借用构造函数继承

```js
function Parent(name) {
  this.name = name;
  this.sayParent = function () {
    console.log(`Parent:`, this.name);
  };
}

function Child(name, age) {
  this.tempMethod = Parent;
  this.tempMethod(name);
  this.age = age;
  this.sayChild = function () {
    console.log(`Child:${this.name}, age ${this.age}`);
  };
}

const parent = new Parent("江剑臣");
parent.sayParent(); // Parent: 江剑臣
const child = new Child("李铭", 26);
child.sayChild(); // Child:李铭, age 26
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
child1.testFun();

console.log(`child1.name`, child1.name); // ["wuyuchang", "Jack", "Nick", "hello"]
// console.log(`child1.getSuperValue`, child1.getSuperValue()); // child1.getSuperValue is not a function
console.log(`child1.test`, child1.test); // ["h1", "h2", "h3", "h4", "h5"]
console.log(`child1.color`, child1.color); // ["pink", "yellow", "blue"]
console.log(`child1.getSubValue`, child1.getSubValue()); // false

const child2 = new ChildType(["wyc"]);
child2.testFun();
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
