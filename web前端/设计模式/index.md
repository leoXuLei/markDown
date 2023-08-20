# class 单例模式

保证一个类仅有一个实例，并提供一个访问它的全局访问点

```ts
// 创建
class Singleton {
  // 声明类型
  private static instance: Singleton;
  // 静态属性，将挂载在类上
  static getIndtance() {
    if (!this.instance) {
      this.instance = new Singleton();
    }
    return this.instance;
  }

  // 将 constructor 设为私有，使外界无法 new
  private constructor() {}
}

// 使用
const singleton = Singleton.getIndtance();
```
