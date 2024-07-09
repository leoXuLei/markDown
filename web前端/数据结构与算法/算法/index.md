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

# 回溯法

搜索问题的解，可以通过 遍历 实现。所以很多教程把「回溯算法」称为**爆搜（暴力解法）**。因此回溯算法用于 **搜索一个问题的所有的解 ，通过深度优先遍历的思想实**现。

## 伪代码模板

**其核心就是 for 循环里面的递归，在递归调用之前「做选择」，在递归调用之后「撤销选择」**，特别简单。

但是必须说明的是，不管怎么优化，都符合回溯框架，**而且时间复杂度都不可能低于 O(N!)，因为穷举整棵决策树是无法避免的。这也是回溯算法的一个特点，不像动态规划存在重叠子问题可以优化，回溯算法就是纯暴力穷举，复杂度一般都很高**。

```bash
result = []

def backtrack(路径, 选择列表):

# 递归出口
    if 满足结束条件:
        result.add(路径)
        return

    for 选择 in 选择列表:（for循环，横向遍历）
# 做选择
      路径.add(选择)
      将该选择从选择列表移除

      # 递归进行下一次选择（进入下一层决策树）（递归，纵向遍历）
      backtrack(路径, 选择列表)

# 撤销选择（即状态重置，比如把原来在记录表中的标记值换成初始未改动的）
      路径.remove(选择)
      将该选择再加入选择列表
```

## 与动态规划的区别

- 共同点
  - 用于求解多阶段决策问题。多阶段决策问题即：
    - 求解一个问题分为很多步骤（阶段）；
    - 每一个步骤（阶段）可以有多种选择。
- 不同点
  - 动态规划只需要求我们评估最优解是多少，最优解对应的具体解是什么并不要求。因此很适合应用于评估一个方案的效
  - 回溯算法可以搜索得到所有的方案（当然包括最优解），但是本质上它是一种遍历算法，时间复杂度很高。

## 参考资料

- [@@@回溯算法入门级详解 + 练习（持续更新）](https://leetcode.cn/problems/permutations/solutions/9914/hui-su-suan-fa-python-dai-ma-java-dai-ma-by-liweiw/)
- [一篇总结带你彻底搞透回溯算法！(20 张树形结构图、14 道精选回溯题目，写了整整 21 天) - 代码随想录的文章 - 知乎](https://zhuanlan.zhihu.com/p/302415065)
- [回溯法套路模板 刷通 leetcode - Tachibana Kanade 的文章 - 知乎](https://zhuanlan.zhihu.com/p/112926891)

# 洗牌算法

## 参考资料

- [世界上有哪些代码量很少，但很牛逼很经典的算法或项目案例？ - 程序员吴师兄的回答 - 知乎](https://www.zhihu.com/question/358255792/answer/974431591)
