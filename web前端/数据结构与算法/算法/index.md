# 动态规划法

## 经典问题

> 【1：硬币找零问题】

```js
class MinCoinChange {
  constructor(coins) {
    this.coins = coins;
    this.cache = {};
  }

  makeChange(amount) {
    if (!amount) return [];
    // 如果{}中金额存在跟amount一样的，直接返回
    if (this.cache[amount]) return this.cache[amount];
    let min = [],
      newMin,
      newAmount;
    //  [1、5、10、25]
    this.coins.forEach((coin) => {
      newAmount = amount - coin;
      if (newAmount >= 0) {
        newMin = this.makeChange(newAmount);
      }
      if (
        newAmount >= 0 &&
        (newMin.length < min.length - 1 || !min.length) &&
        (newMin.length || !newAmount)
      ) {
        min = [coin].concat(newMin);
      }
    });
    return (this.cache[amount] = min);
  }
}
```
