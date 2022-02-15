# 类
## 介绍
传统的JavaScript程序**使用函数和基于原型的继承来创建可重用的组件**，但对于熟悉使用面向对象方式的程序员来讲就有些棘手，因为他们用的是**基于类的继承并且对象是由类构建出来的**。 从ECMAScript 2015，也就是ECMAScript 6开始，JavaScript程序员将能够使用基于类的面向对象的方式。 使用TypeScript，我们允许开发者现在就使用这些特性，并且编译后的JavaScript可以在所有主流浏览器和平台上运行，而不需要等到下个JavaScript版本。

## 类
```typescript
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

let greeter = new Greeter("world");
```
我们声明一个Greeter类。这个类有3个成员：一个叫做greeting的属性，一个构造函数和一个 greet方法。

在引用任何一个类成员的时候都用了 this。 它表示我们访问的是类的成员。

我们使用 new构造了 Greeter类的一个实例。 它会调用之前定义的构造函数，创建一个 Greeter类型的新对象，并执行构造函数初始化它。

## 继承
在TypeScript里，我们可以使用常用的面向对象模式。 基于类的程序设计中一种最基本的模式是允许**使用继承来扩展现有的类**。

```typescript
class Animal {
    move(distanceInMeters: number = 0) {
        console.log(`Animal moved ${distanceInMeters}m.`);
    }
}

class Dog extends Animal {
    bark() {
        console.log('Woof! Woof!');
    }
}

const dog = new Dog();
dog.bark();
dog.move(10);
dog.bark();
```

这个例子展示了最基本的继承：类从基类中继承了属性和方法。 这里， Dog是一个 **派生类**，它派生自 **Animal 基类**，通过 **extends 关键字**。 **派生类通常被称作子类，基类通常被称作超类**。

因为 Dog 继承了 Animal 的功能，因此我们可以创建一个 Dog 的实例，它能够 bark()和 move()。


下面我们来看个更加复杂的例子。
```typescript
class Animal {
    name: string;
    constructor(theName: string) { this.name = theName; }
    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}

class Snake extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters = 5) {
        console.log("Slithering...");
        super.move(distanceInMeters);
    }
}

class Horse extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters = 45) {
        console.log("Galloping...");
        super.move(distanceInMeters);
    }
}

let sam = new Snake("Sammy the Python");
let tom: Animal = new Horse("Tommy the Palomino");

sam.move();
tom.move(34);
```

这个例子展示了一些上面没有提到的特性。 这一次，我们使用 extends关键字创建了 Animal的两个子类： Horse 和 Snake。

与前一个例子的不同点是，派生类包含了一个构造函数，它**必须调用 super()，它会执行基类的构造函数**。 而且，**在构造函数里访问 this 的属性之前，我们一定要调用 super()**。 这个是TypeScript强制执行的一条重要规则。

这个例子演示了如何在子类里可以重写父类的方法。 Snake 类和 Horse 类都创建了 move 方法，它们重写了从 Animal 继承来的 move 方法，使得 move 方法根据不同的类而具有不同的功能。 注意，即使 tom 被声明为 Animal 类型，但因为它的值是 Horse，调用 tom.move(34) 时，它会调用 Horse 里重写的方法：
```typescript
Slithering...
Sammy the Python moved 5m.
Galloping...
Tommy the Palomino moved 34m.
```

## 公共，私有与受保护的修饰符
|  | 含义 |  访问
| -- | -- | --
| public(默认) | 公共 | 在类里面、子类里面、类外面都可以访问
| private | 私有 | 在类里面可以访问、子类和类外面都不能访问
| protected | 受保护 | 在类里面、子类里面可以访问、类外面不能访问

### 默认为 public
> 类外面如何访问：实例.属性/实例.方法

TypeScript 中，默认为标记的属性为公有属性，外部可以自由访问

你也可以明确的将一个成员标记成 public。 我们可以用下面的方式来重写上面的 Animal类：
```typescript
class Animal {
    public name: string;
    public constructor(theName: string) { this.name = theName; }
    public move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}
```

### private
当成员被标记成 private时，它就不能在声明它的类的外部访问。比如：
```typescript
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

new Animal("Cat").name; // 错误: 'name' 是私有的.
```

TypeScript使用的是结构性类型系统。 当我们比较两种不同的类型时，并不在乎它们从何处而来，如果所有成员的类型都是兼容的，我们就认为它们的类型是兼容的。

然而，当我们比较带有 private 或 protected 成员的类型的时候，情况就不同了。 如果其中一个类型里包含一个 private 成员，那么**只有当另外一个类型中也存在这样一个 private 成员， 并且它们都是来自同一处声明时，我们才认为这两个类型是兼容的**。 对于 protected同理。
```typescript
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

class Rhino extends Animal {
    constructor() { super("Rhino"); }
}

class Employee {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

let animal = new Animal("Goat");
let rhino = new Rhino();
let employee = new Employee("Bob");

animal = rhino;
animal = employee; // 错误: Animal 与 Employee 不兼容.
```

这个例子中有 `Animal` 和 `Rhino` 两个类， `Rhino` 是 `Animal` 类的子类。还有一个 `Employee` 类，其类型看上去与 `Animal` 是相同的。我们创建了几个这些类的实例，并相互赋值来看看会发生什么。因为 `Animal` 和 `Rhino` 共享了来自 `Animal` 里的私有成员定义 `privatename` : `string` ，因此它们是兼容的。然而 `Employee` 却不是这样。当把 `Employee` 赋值给 `Animal` 的时候，得到一个错误，说它们的类型不兼容。尽管 `Employee` 里也有一个私有成员 `name` ，但它明显不是 `Animal` 里面定义的那个。

### protected
protected 修饰符与 private 修饰符的行为很相似，但有一点不同， protected成员在派生类中仍然可以访问。例如：
```typescript
class Person {
    protected name: string;
    constructor(name: string) { this.name = name; }
}

class Employee extends Person {
    private department: string;

    constructor(name: string, department: string) {
        super(name)
        this.department = department;
    }

    public getElevatorPitch() {
        return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
}

let howard = new Employee("Howard", "Sales");
console.log(howard.getElevatorPitch());
console.log(howard.name); // 错误
```

注意，我们不能在 Person 类外使用 name，但是我们仍然可以通过 Employee 类的实例方法访问，因为 Employee 是由 Person 派生而来的。

**构造函数也可以被标记成 protected。 这意味着这个类不能在包含它的类外被实例化，但是能被继承**。比如：
```typescript
class Person {
    protected name: string;
    protected constructor(theName: string) { this.name = theName; }
}

// Employee 能够继承 Person
class Employee extends Person {
    private department: string;

    constructor(name: string, department: string) {
        super(name);
        this.department = department;
    }

    public getElevatorPitch() {
        return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
}

let howard = new Employee("Howard", "Sales");
let john = new Person("John"); // 错误: 'Person' 的构造函数是被保护的.
```

### readonly
readonly 关键字将属性设置为只读的。 只读属性**必须在声明时或构造函数里被初始化**。
```typescript
class Octopus {
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor (theName: string) {
        this.name = theName;
    }
}
let dad = new Octopus("Man with the 8 strong legs");
dad.name = "Man with the 3-piece suit"; // 错误! name 是只读的.
```

**参数属性**
在上面的例子中，我们必须在Octopus类里定义一个只读成员 name 和一个参数为 theName 的构造函数，并且立刻将 theName 的值赋给 name，这种情况经常会遇到。 参数属性可以方便地让我们在一个地方定义并初始化一个成员。 下面的例子是对之前 Octopus 类的修改版，使用了参数属性：
```typescript
class Octopus {
    readonly numberOfLegs: number = 8;
    constructor(readonly name: string) {
    }
}
```

注意看我们是如何舍弃了 theName，仅在构造函数里使用 `readonly name: string` 参数来创建和初始化 name 成员。 我们把声明和赋值合并至一处。

参数属性通过给构造函数参数前面添加一个访问限定符来声明。 使用 private 限定一个参数属性会声明并初始化一个私有成员；对于 public 和 protected 来说也是一样。

## 存取器


## 静态属性和方法
到目前为止，我们只讨论了**类的实例成员，那些仅当类被实例化的时候才会被初始化的属性**。 我们也可以创建**类的静态成员，这些属性存在于类本身上面而不是类的实例上**。 在这个例子里，我们使用 static 定义 origin，因为它是所有网格都会用到的属性。 每个实例想要访问这个属性的时候，都要在 origin 前面加上类名。 如同在实例属性上使用 this.前缀 来访问属性一样，这里我们使用 `Grid.` 来访问静态属性。
```typescript
class Grid {
    static origin = {x: 0, y: 0};
    calculateDistanceFromOrigin(point: {x: number; y: number;}) {
        let xDist = (point.x - Grid.origin.x);
        let yDist = (point.y - Grid.origin.y);
        return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
    }
    constructor (public scale: number) { }
}

let grid1 = new Grid(1.0);  // 1x scale
let grid2 = new Grid(5.0);  // 5x scale

console.log(grid1.calculateDistanceFromOrigin({x: 10, y: 10}));
console.log(grid2.calculateDistanceFromOrigin({x: 10, y: 10}));
```

**静态方法**
实例方法必须得根据构造函数新建实例通过实例来调用，而静态方法不需要新建实例，直接通过类就可以调用。如：`Person.getInfo()`
```typescript
function Person() {
  this.name = 'lisi';
  this.age = 20;
}
Person.sayInfo = function() {
  console.log('这是静态方法');
};
```

## 抽象类：abstract
> 抽象类和抽象方法是用来定义标准的

抽象类做为其它派生类的基类使用。 它们一般不会直接被实例化。 不同于接口，**抽象类可以包含成员的实现细节**。 **abstract 关键字是用于定义抽象类和在抽象类内部定义抽象方法**。
```typescript
abstract class Animal {
    abstract makeSound(): void;
    move(): void {
        console.log('roaming the earch...');
    }
}
```

**抽象类中的抽象方法不包含具体实现并且必须在派生类中实现**。 抽象方法的语法与接口方法相似。 两者都是定义方法签名但不包含方法体。 然而，抽象方法必须包含 abstract关键字并且可以包含访问修饰符。
```typescript
abstract class Department {

    constructor(public name: string) {
    }

    printName(): void {
        console.log('Department name: ' + this.name);
    }

    abstract printMeeting(): void; // 必须在派生类中实现
}

class AccountingDepartment extends Department {

    constructor() {
        super('Accounting and Auditing'); // 在派生类的构造函数中必须调用 super()
    }

    printMeeting(): void {
        console.log('The Accounting Department meets each Monday at 10am.');
    }

    generateReports(): void {
        console.log('Generating accounting reports...');
    }
}

let department: Department; // 允许创建一个对抽象类型的引用
department = new Department(); // 错误: 不能创建一个抽象类的实例
department = new AccountingDepartment(); // 允许对一个抽象子类进行实例化和赋值
department.printName();
department.printMeeting();
department.generateReports(); // 错误: 方法在声明的抽象类中不存在
```

### 实践
抽象类InputBase在多处控件调用
```typescript
export interface IInputBaseProps {
    autoSelect?: boolean;
    value?: any;
    onChange?: (...args: any[]) => any;
    onValueChange?: (...args: any[]) => any;
    editing?: boolean;
  }
  
  export abstract class InputBase<P = any, S = any> extends React.PureComponent<
    P & IInputBaseProps,
    S
  > {
    public abstract renderEditing(): any;
  public abstract renderRendering(): any;
  
  public render() {
      if (this.props.editing === undefined ? true : this.props.editing) {
        return this.renderEditing();
      }
      return this.renderRendering();
    }
  }
```

## 高级技巧
### 构造函数
当你在TypeScript里声明了一个类的时候，实际上同时声明了很多东西。 首先就是类的实例的类型。
```typescript
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

let greeter: Greeter;
greeter = new Greeter("world");
console.log(greeter.greet());
```
`let greeter: Greeter`，意思是 Greeter类的实例的类型是Greeter。

我们也创建了一个叫做构造函数的值。 这个函数会在我们使用new创建类实例的时候被调用。 上面的class代码被编译成JavaScript后：
```typescript
var Greeter = /** @class */ (function () {
    function Greeter(message) {
        this.greeting = message;
    }
    Greeter.prototype.greet = function () {
        return "Hello, " + this.greeting;
    };
    return Greeter;
}());

var greeter;
greeter = new Greeter("world");
console.log(greeter.greet());
```

上面的代码里， `let Greeter` 将被赋值为构造函数。 当我们调用 new 并执行了这个函数后，便会得到一个类的实例。 这个构造函数也包含了类的所有静态属性。 换个角度说，我们可以认为类具有实例部分与静态部分这两个部分。

稍微改写一下这个例子，看看它们之间的区别，[见官网](https://www.tslang.cn/docs/handbook/classes.html)

### 把类当做接口使用
类定义会创建两个东西：类的实例类型和一个构造函数。 因为类可以创建出类型，所以你能够在允许使用接口的地方使用类。
```typescript
class Point {
    x: number;
    y: number;
}

interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
```
