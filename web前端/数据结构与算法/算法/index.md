# 动态规划法

## 经典问题

### 1：硬币找零问题

```js
class MinCoinChange {
  constructor(coins) {
    this.coins = coins; // 可供使用的零钱额度：如 [1、5、10、25]
    this.cache = {}; // 缓存找零的数据：key是目标钱数，value是找零方案：具体零钱组成的数组
  }

  makeChange(amount) {
    if (!amount) return [];
    // 如果缓存找零的数据中求解过目标钱数为amount的找零，直接返回
    if (this.cache[amount]) return this.cache[amount];
    let min = [],
      newMin,
      newAmount;
    // 遍历零钱额度数组，找出目标钱数amount的找零方案最优解：额度最大的放在最前面，这样的找零的个数会是最小的
    this.coins.forEach((coin) => {
      newAmount = amount - coin; // 目标钱数amount与当前额度coin的差
      if (newAmount >= 0) {
        newMin = this.makeChange(newAmount); // 拆分子问题，将makeChange(makeChange) 分解成求解 makeChange(newAmount)
      }
      if (
        newAmount >= 0 &&
        (newMin.length < min.length - 1 || !min.length) &&
        (newMin.length || !newAmount)
      ) {
        min = [coin].concat(newMin);
      }
    });
    return (this.cache[amount] = min); // 目标钱数amount的找零方案存入缓存obj并返回
  }
}

const minCoinChange = new MinCoinChange([1, 5, 10, 25]);
console.log(minCoinChange.makeChange(11));
```

```js
// debugger如下
this.cache = {
  1: [1],
  2: [1, 1],
  3: [1, 1, 1],
  4: [1, 1, 1, 1],
  5: [5], // 本来是[1,1,1,1,1]的，this.coins.forEach(coin)遍历到第一个元素，即coin=1 时计算出来的min 确实是[1,1,1,1,1]，但是继续遍历到第二个元素，即coin=1 时计算出来的 min 确实是[5]，即找零方案被替换了，最新的是按照额度最大的放在最前面，这样的找零的个数会是最小的。
  6：[1,5] // 同理 6的解是在5的基础上的，所以直接[1].concat([5]) === [1,5]
};
```

# 贪心法

## 经典问题

### 1：硬币找零问题
贪心算法版本的这个解法很简单。从最大面额的硬币开始，拿尽可能多的这种硬币找零。当无法 再拿更多这种价值的硬币时，开始拿第二大价值的硬币，依次继续。

```js
class MinCoinChange {
  constructor(coins) {
    this.coins = coins;
  }

  makeChange(amount) {
    const change = [];
    let total = 0;
    this.coins
      .sort((a, b) => b - a)
      .forEach((coin) => {
        while (total + coin <= amount) {
          change.push(coin);
          total += coin;
        }
      });
    return change;
  }
}
const minCoinChange = new MinCoinChange([1, 5, 10, 25]);
console.log(minCoinChange.makeChange(11)); // [10,1]
```
