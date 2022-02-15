## 环境搭建

- [python 3.8.7 下载 （选择 Windows installer (64-bit)）](https://www.python.org/downloads/release/python-387/)
- 安装
  - 记得勾选 Add Python 3.6 to PATH。
  - 验证 cmd 中输入 python
  - 开始菜单中搜索 IDLE：

**运行 Python**

- 交互式解释器
  可以通过命令行窗口进入 python 并开在交互式解释器中开始编写 Python 代码。
  以下为 Python 命令行参数：

  ```js
  -d	在解析时显示调试信息
  -O	生成优化代码 ( .pyo 文件 )
  -S	启动时不引入查找Python路径的位置
  -V	输出Python版本号
  -X	从 1.6版本之后基于内建的异常（仅仅用于字符串）已过时。
  -c cmd	执行 Python 脚本，并将运行结果作为 cmd 字符串。
  file	在给定的python文件执行python脚本。
  ```

- 命令行脚本
  在你的应用程序中通过引入解释器可以在命令行中执行 Python 脚本
  ```js
  $ python script.py # Unix/Linux
  或者
  C:>python script.py # Windows/DOS
  ```
- 集成开发环境（IDE：Integrated Development Environment）: PyCharm
  PyCharm 是由 JetBrains 打造的一款 Python IDE，支持 macOS、 Windows、 Linux 系统。
  PyCharm 功能 : 调试、语法高亮、Project 管理、代码跳转、智能提示、自动完成、单元测试、版本控制……

## 基础语法

### 基础

> **标识符**

**规则:**

- 第一个字符必须是字母表中字母或下划线 \_ 。
- 标识符的其他的部分由字母、数字和下划线组成。
- 标识符对大小写敏感。
- 在 Python 3 中，可以用中文作为变量名，非 ASCII 标识符也是允许的了。

> **python 保留字:**

保留字即关键字，我们不能把它们用作任何标识符名称。Python 的标准库提供了一个 keyword 模块，可以输出当前版本的所有关键字：

> **注释:**

```py
#!/usr/bin/python3

# 第一个注释
# 第二个注释

'''
第三注释
第四注释
'''

"""
第五注释
第六注释
"""
```

> **行与缩进:**

python 最具特色的就是使用==缩进来表示代码块，不需要使用大括号 {}== 。
缩进的空格数是可变的，但是==同一个代码块的语句必须包含相同的缩进空格数==。

```py
if True:
    print ("True")
else:
    print ("False")
```

```py
if True:
    print ("Answer")
    print ("True")
else:
    print ("Answer")
  print ("False")    # 缩进不一致，会导致运行错误


# 报错如下
 File "test.py", line 6
    print ("False")    # 缩进不一致，会导致运行错误
                                      ^
IndentationError: unindent does not match any outer indentation level
```

> **多行语句:**

Python 通常是一行写完一条语句，但如果语句很长，我们可以使用反斜杠(\)来实现多行语句。

```py
total = item_one + \
        item_two + \
        item_three
```

在 [], {}, 或 () 中的多行语句，不需要使用反斜杠(\)

```py
total = ['item_one', 'item_two', 'item_three',
        'item_four', 'item_five']
```

> **空行:**

函数之间或类的方法之间用空行分隔，表示一段新的代码的开始。类和函数入口之间也用一行空行分隔，以突出函数入口的开始。

空行与代码缩进不同，空行并不是 Python 语法的一部分。书写时不插入空行，Python 解释器运行也不会出错。但是空行的作用在于分隔两段不同功能或含义的代码，便于日后代码的维护或重构。

记住：空行也是程序代码的一部分。

> **等待用户输入:**

```py
input("\n\n按下 enter 键后退出。")

# "\n\n"在结果输出前会输出两个新的空行。一旦用户按下 enter 键时，程序将退出。
```

> **同一行显示多条语句:**

Python 可以在同一行中使用多条语句，语句之间使用分号(;)分割，

```py
import sys; x = 'runoob'; sys.stdout.write(x + '\n')
```

> **多个语句构成代码组:**

缩进相同的一组语句构成一个代码块，我们称之代码组。

像 if、while、def 和 class 这样的复合语句，首行以关键字开始，以冒号( : )结束，该行之后的一行或多行代码构成代码组。

我们将首行及后面的代码组称为一个子句(clause)。

```py
if expression :
   suite
elif expression :
   suite
else :
   suite
```

> **print 输出:**

print 默认输出是换行的，如果要实现不换行需要在变量末尾加上 end=""：

```py
x="a"
y="b"
# 换行输出
print( x )
print( y )

print('---------')
# 不换行输出
print( x, end=" " )
print( y, end=" " )
print()


# 输出如下
a
b
---------
a b
```

**import 与 from...import:**

在 python 用 import 或者 from...import 来导入相应的模块。

- 将整个模块(somemodule)导入，格式为： import somemodule
- 从某个模块中导入某个函数,格式为： from somemodule import somefunction
- 从某个模块中导入多个函数,格式为： from somemodule import firstfunc, secondfunc, thirdfunc
- 将某个模块中的全部函数导入，格式为： from somemodule import \*

### 条件控制

#### **if 语句：**

Python 中用 elif 代替了 else if，所以 if 语句的关键字为：if – elif – else。

注意：

1. 每个条件后面要使用冒号 :，表示接下来是满足条件后要执行的语句块。
2. 使用缩进来划分语句块，相同缩进数的语句在一起组成一个语句块。
3. 在 Python 中没有 switch – case 语句。

```py
if condition_1:
    statement_block_1
elif condition_2:
    statement_block_2
else:
    statement_block_3
```

**if 嵌套：**
在嵌套 if 语句中，可以把 if...elif...else 结构放在另外一个 if...elif...else 结构中。

```py
if 表达式1:
    语句
    if 表达式2:
        语句
    elif 表达式3:
        语句
    else:
        语句
elif 表达式4:
    语句
else:
    语句
```

### 循环语句

Python 中的循环语句有 for 和 while。
同样需要注意冒号和缩进。

#### **while**

另外，在 Python 中没有 do..while 循环。

```py
while 判断条件(condition)：
    执行语句(statements)……
```

```py
n = 100
sum = 0
counter = 1

while counter <= n:
    sum = sum + counter
    counter += 1

print("1 到 %d 之和为: %d" % (n,sum))
```

**while 循环使用 else 语句**
在 while … else 在条件语句为 false 时执行 else 的语句块。

```py
while <expr>:
    <statement(s)>
else:
    <additional_statement(s)>
```

```py
count = 0
while count < 5:
   print (count, " 小于 5")
   count = count + 1
else:
   print (count, " 大于或等于 5")


# 0  小于 5
# 1  小于 5
# 2  小于 5
# 3  小于 5
# 4  小于 5
# 5  大于或等于 5
```

#### **for 语句**

Python for 循环可以遍历任何序列的项目，如一个列表或者一个字符串。
break 语句用于跳出当前循环体：

```py
for <variable> in <sequence>:
    <statements>
else:
    <statements>
```

```py
sites = ["Baidu", "Google","Runoob","Taobao"]
for site in sites:
    if site == "Runoob":
        print("菜鸟教程!")
        break
    print("循环数据 " + site)
else:
    print("没有循环数据!")
print("完成循环!")

# 循环数据 Baidu
# 循环数据 Google
# 菜鸟教程!
# 完成循环!
```

#### **range()函数**

如果你需要遍历数字序列，可以使用内置 range()函数。它会生成数列。
规则

- 也可以使用 range 指定区间的值
- 也可以使 range 以指定数字开始并指定不同的增量(甚至可以是负数，有时这也叫做'步长'):

```py
>>>for i in range(5):
...     print(i)
...
0
1
2
3
4


>>>for i in range(5,9) :
    print(i)
5
6
7
8


>>>for i in range(0, 10, 3) :
    print(i)
0
3
6
9


>>>for i in range(-10, -100, -30) :
    print(i)


-10
-40
-70
```

**结合 range()和 len()函数以遍历一个序列的索引**

```py
>>>a = ['Google', 'Baidu', 'Runoob', 'Taobao', 'QQ']
>>> for i in range(len(a)):
...     print(i, a[i])
...
0 Google
1 Baidu
2 Runoob
3 Taobao
4 QQ
```

**还可以使用 range()函数来创建一个列表：**

```py
>>>list(range(5))
[0, 1, 2, 3, 4]
```

#### **break 和 continue 语句**

**break 和 continue 语句及循环中的 else 子句**

```py
sites= ['google', 'wiki', 'weibo', 'runoob', 'baidu']

for site in sites:
  if len(site) == 4:
    continue
  print(f'hello,{site}')

  if site == "runoob":
    break

print("Done!")

# 输出如下：
hello,google
hello,weibo
hello,runoob
Done!
```

#### **循环语句可以有 else 子句**

循环语句可以有 else 子句，它在穷尽列表(以 for 循环)或条件变为 false (以 while 循环)导致循环终止时被执行，但循环被 break 终止时不执行。

如下实例用于查询质数的循环例子:

```py
for n in range(2, 10):
    for x in range(2, n):
        if n % x == 0:
            print(n, '等于', x, '*', n//x)
            break
    else:
        # 循环中没有找到元素
        print(n, ' 是质数')

# 输出结果如下：

# 2  是质数
# 3  是质数
# 4  等于 2 * 2
# 5  是质数
# 6  等于 2 * 3
# 7  是质数
# 8  等于 2 * 4
# 9  等于 3 * 3
```

### Tips

**del 语句删除一些对象引用：**

del 语句的语法是：

```py
del var1[,var2[,var3[....,varN]]]

# 您可以通过使用del语句删除单个或多个对象。
del var
del var_a, var_b
```

**end 关键字：**
关键字 end 可以用于将结果输出到同一行，或者在输出的末尾添加不同的字符，实例如下：

```py
# Fibonacci series: 斐波纳契数列
# 两个元素的总和确定了下一个数
a, b = 0, 1
while b < 1000:
    print(b, end=',')
    a, b = b, a+b

# 输出结果为：
# 1,1,2,3,5,8,13,21,34,55,89,144,233,377,610,987,
```
**in：**
in 操作符用于判断键是否存在于字典中，如果键在字典dict里返回true，否则返回false。
```py
tel = {'guido': 4127, 'irv': 4127, 'jack': 4098}

>>> 'guido' in tel
True
>>> 'jack' not in tel
False
```
**其它：**

- 1、Python 可以同时为多个变量赋值，如 a, b = 1, 2。
- 2、一个变量可以通过赋值指向不同类型的对象。
- 3、无限循环你可以使用 CTRL+C 来中断循环

## 基础数据类型

> **标准数据类型:**

Python3 中有六个标准的数据类型：

- Number（数字）
- String（字符串）
- List（列表）
- Tuple（元组）
- Set（集合）
- Dictionary（字典）

Python3 的六个标准数据类型中：

- 不可变数据（3 个）：Number（数字）、String（字符串）、Tuple（元组）；
- 可变数据（3 个）：List（列表）、Dictionary（字典）、Set（集合）。

### **数字类型(Number):**

python 中数字有四种类型：整数、布尔型、浮点数和复数。

- int (整数), 如 1, 只有一种整数类型 int，表示为长整型，没有 python2 中的 Long。
- bool (布尔), 如 True。
- float (浮点数), 如 1.23、3E-2
- complex (复数), 如 1 + 2j、 1.1 + 2.2j

像大多数语言一样，数值类型的赋值和计算都是很直观的。

```py
>>> 5 + 4  # 加法
9
>>> 4.3 - 2 # 减法
2.3
>>> 3 * 7  # 乘法
21
>>> 2 / 4  # 除法，得到一个浮点数
0.5
>>> 2 // 4 # 除法，得到一个整数
0
>>> 17 % 3 # 取余
2
>>> 2 ** 5 # 乘方
32
```

### **字符串(String):**

- python 中单引号和双引号使用完全相同。
- 使用三引号('''或""")可以指定一个多行字符串。
- 转义符 '\'
- 反斜杠可以用来转义，使用 r 可以让反斜杠不发生转义。。 如 r"this is a line with - \n" 则\n 会显示，并不是换行。
- 按字面意义级联字符串，如"this " "is " "string"会被自动转换为 this is string。
- 字符串可以用 + 运算符连接在一起，用 \* 运算符表示复制当前字符串，与之结合的数字为复制的次数。
- Python 中的字符串有两种索引方式，从左往右以 0 开始，从右往左以 -1 开始。
- Python 中的字符串不能改变。
- Python 没有单独的字符类型，一个字符就是长度为 1 的字符串。
- 字符串的截取的语法格式如下：==变量[头下标:尾下标:步长]==

```py
#!/usr/bin/python3

str='Runoob'

print(str)                 # 输出字符串
print(str[0:-1])           # 输出第一个到倒数第二个的所有字符
print(str[0])              # 输出字符串第一个字符
print(str[2:5])            # 输出从第三个开始到第五个的字符
print(str[2:])             # 输出从第三个开始后的所有字符
print(str[1:5:2])          # 输出从第二个开始到第五个且每隔两个的字符
print(str * 2)             # 输出字符串两次
print(str + '你好')         # 连接字符串

print('------------------------------')

print('hello\nrunoob')      # 使用反斜杠(\)+n转义特殊字符
print(r'hello\nrunoob')     # 在字符串前面添加一个 r，表示原始字符串，不会发生转义

# 输出如下：
Runoob
Runoo
R
noo
noob
uo
RunoobRunoob
Runoob你好
------------------------------
hello
runoob
hello\nrunoob

```

这里的 r 指 raw，即 raw string，会自动将反斜杠转义，例如：

```py
>>> print('\n')       # 输出空行

>>> print(r'\n')      # 输出 \n
\n
>>>
```

![](https://static.runoob.com/wp-content/uploads/123456-20200923-1.svg)

### **List（列表）:**

List（列表） 是 Python 中使用最频繁的数据类型。

列表可以完成大多数集合类的数据结构实现。列表中元素的类型可以不相同，它支持数字，字符串甚至可以包含列表（所谓嵌套）。

列表是写在**方括号 [] 之间、用逗号分隔开的元素列表**。

和字符串一样，列表同样可以被索引和截取，列表被截取后返回一个包含所需元素的新列表。

列表截取的语法格式如下：

```py
# 变量[头下标:尾下标]

# 索引值以 0 为开始值，-1 为从末尾的开始位置。
```

![](https://www.runoob.com/wp-content/uploads/2014/08/list_slicing1_new1.png)

### **Tuple（元组）:**

元组（tuple）与列表类似，**不同之处在于元组的元素不能修改**。元组写在小括号 () 里，元素之间用逗号隔开。

元组中的元素类型也可以不相同。

虽然 tuple 的元素不可改变，但它可以包含可变的对象，比如 list 列表。

构造包含 0 个或 1 个元素的元组比较特殊，所以有一些额外的语法规则：

```py
tup1 = ()    # 空元组
tup2 = (20,) # 一个元素，需要在元素后添加逗号
```

string、list 和 tuple 都属于 sequence（序列）。

注意：
1、与字符串一样，元组的元素不能修改。
2、元组也可以被索引和切片，方法一样。
3、注意构造包含 0 或 1 个元素的元组的特殊语法规则。
4、元组也可以使用+操作符进行拼接。

```py
>>> t = 12345, 54321, 'hello!'
>>> t[0]
12345
>>> t
(12345, 54321, 'hello!')
>>> # Tuples may be nested:
... u = t, (1, 2, 3, 4, 5)
>>> u
((12345, 54321, 'hello!'), (1, 2, 3, 4, 5))
```

### **Set（集合）:**

集合是一个无序不重复元素的集，集合（set）是由一个或数个形态各异的大小整体组成的，构成集合的事物或对象称作元素或是成员。

基本功能是**进行成员关系测试和删除重复元素**。

可以使用大括号 { } 或者 set() 函数创建集合，注意：**创建一个空集合必须用 set() 而不是 { }，因为 { } 是用来创建一个空字典**。

创建格式：

```py
parame = {value01,value02,...}
或者
set(value)
```

```py
sites = {'Google', 'Taobao', 'Runoob', 'Facebook', 'Zhihu', 'Baidu'}

print(sites)   # 输出集合，重复的元素被自动去掉

# 成员测试
if 'Runoob' in sites :
    print('Runoob 在集合中')
else :
    print('Runoob 不在集合中')


# set可以进行集合运算
a = set('abracadabra')
b = set('alacazam')

print(a)

print(a - b)     # a 和 b 的差集 在 a 中的字母，但不在 b 中

print(a | b)     # a 和 b 的并集

print(a & b)     # a 和 b 的交集

print(a ^ b)     # a 和 b 中不同时存在的元素
```

```py
# 以上实例输出结果：
{'Zhihu', 'Baidu', 'Taobao', 'Runoob', 'Google', 'Facebook'}
Runoob 在集合中
{'b', 'c', 'a', 'r', 'd'}
{'r', 'b', 'd'}
{'b', 'c', 'a', 'z', 'm', 'r', 'l', 'd'}
{'c', 'a'}
{'z', 'b', 'm', 'r', 'l', 'd'}
```

集合也支持推导式：
```py
>>> a = {x for x in 'abracadabra' if x not in 'abc'}
>>> a
{'r', 'd'}
```

### **Dictionary（字典）:**

字典（dictionary）是 Python 中另一个非常有用的内置数据类型。

列表是有序的对象集合，字典是无序的对象集合。两者之间的区别在于：字典当中的元素是通过键来存取的，而不是通过偏移存取。

- 字典是一种映射类型，字典用 { } 标识，它是一个无序的键(key) : 值(value) 的集合。
- 键(key)必须使用不可变类型。通常用字符串或数值。
- 在同一个字典中，键(key)必须是唯一的。

```py
dict = {}
dict['one'] = "1 - 菜鸟教程"
dict[2]     = "2 - 菜鸟工具"

tinydict = {'name': 'runoob','code':1, 'site': 'www.runoob.com'}


print (dict['one'])       # 输出键为 'one' 的值
print (dict[2])           # 输出键为 2 的值
print (tinydict)          # 输出完整的字典
print (tinydict.keys())   # 输出所有键
print (tinydict.values()) # 输出所有值
```

```py
1 - 菜鸟教程
2 - 菜鸟工具
{'name': 'runoob', 'code': 1, 'site': 'www.runoob.com'}
dict_keys(['name', 'code', 'site'])
dict_values(['runoob', 1, 'www.runoob.com'])
```

### 查询数据类型

内置的 type() 函数可以用来查询变量所指的对象类型。

```py
>>> a, b, c, d = 20, 5.5, True, 4+3j
>>> print(type(a), type(b), type(c), type(d))
<class 'int'> <class 'float'> <class 'bool'> <class 'complex'>
```

此外还可以用 isinstance 来判断：

```py
>>> a = 111
>>> isinstance(a, int)
True
>>>
```

isinstance 和 type 的区别在于：

- type()不会认为子类是一种父类类型。
- isinstance()会认为子类是一种父类类型。

```py
>>> class A:
...     pass
...
>>> class B(A):
...     pass
...
>>> isinstance(A(), A)
True
>>> type(A()) == A
True
>>> isinstance(B(), A)
True
>>> type(B()) == A
False
```

注意：在 Python2 中是没有布尔型的，它用数字 0 表示 False，用 1 表示 True。到 Python3 中，把 True 和 False 定义成关键字了，但它们的值还是 1 和 0，它们可以和数字相加。

## 输入和输出
**输出格式美化:**
Python两种输出值的方式: 表达式语句和 print() 函数。

第三种方式是使用文件对象的 write() 方法，标准输出文件可以用 sys.stdout 引用。

如果你希望输出的形式更加多样，可以使用 str.format() 函数来格式化输出值。

如果你希望将输出的值转成字符串，可以使用 repr() 或 str() 函数来实现。

str()： 函数返回一个用户易读的表达形式。
repr()： 产生一个解释器易读的表达形式。

这里有两种方式输出一个平方与立方的表:
```py
>>> for x in range(1, 11):
...     print(repr(x).rjust(2), repr(x*x).rjust(3), end=' ')
...     # 注意前一行 'end' 的使用
...     print(repr(x*x*x).rjust(4))
...
 1   1    1
 2   4    8
 3   9   27
 4  16   64
 5  25  125
 6  36  216
 7  49  343
 8  64  512
 9  81  729
10 100 1000

>>> for x in range(1, 11):
...     print('{0:2d} {1:3d} {2:4d}'.format(x, x*x, x*x*x))
...
 1   1    1
 2   4    8
 3   9   27
 4  16   64
 5  25  125
 6  36  216
 7  49  343
 8  64  512
 9  81  729
10 100 1000
```
**str.format():**
str.format() 的基本使用如下:
- 括号及其里面的字符 (称作格式化字段) 将会被 format() 中的参数替换。
- 在括号中的数字用于指向传入对象在 format() 中的位置
- 如果在 format() 中使用了关键字参数, 那么它们的值会指向使用该名字的参数。位置及关键字参数可以任意的结合:
```py
>>> print('{0} 和 {1}'.format('Google', 'Runoob'))
Google 和 Runoob
>>> print('{1} 和 {0}'.format('Google', 'Runoob'))
Runoob 和 Google
```

```py
>>> print('{name}网址： {site}'.format(name='菜鸟教程', site='www.runoob.com'))
菜鸟教程网址： www.runoob.com

>>> print('站点列表 {0}, {1}, 和 {other}。'.format('Google', 'Runoob', other='Taobao'))
站点列表 Google, Runoob, 和 Taobao。
```
**`:` **
在 : 后传入一个整数, 可以保证该域至少有这么多的宽度。 用于美化表格时很有用。
```py
>>> table = {'Google': 1, 'Runoob': 2, 'Taobao': 3}
>>> for name, number in table.items():
...     print('{0:10} ==> {1:10d}'.format(name, number))
...
Google     ==>          1
Runoob     ==>          2
Taobao     ==>          3
```
**格式化时通过变量名而非位置：**

如果你有一个很长的格式化字符串, 而你不想将它们分开, 那么在格式化时通过变量名而非位置会是很好的事情。

最简单的就是传入一个字典, 然后使用方括号 [] 来访问键值 :
```py
>>> table = {'Google': 1, 'Runoob': 2, 'Taobao': 3}
>>> print('Runoob: {0[Runoob]:d}; Google: {0[Google]:d}; Taobao: {0[Taobao]:d}'.format(table))
Runoob: 2; Google: 1; Taobao: 3
```
可以通过在 table 变量前使用 ** 来实现相同的功能：
```py
>>> table = {'Google': 1, 'Runoob': 2, 'Taobao': 3}
>>> print('Runoob: {Runoob:d}; Google: {Google:d}; Taobao: {Taobao:d}'.format(**table))
Runoob: 2; Google: 1; Taobao: 3
```

**旧式字符串格式化：**
% 操作符也可以实现字符串格式化。 它将左边的参数作为类似 sprintf() 式的格式化字符串, 而将右边的代入, 然后返回格式化后的字符串。
```py
>>> import math
>>> print('常量 PI 的值近似为：%5.3f。' % math.pi)
常量 PI 的值近似为：3.142。
```
因为 str.format() 是比较新的函数， 大多数的 Python 代码仍然使用 % 操作符。但是因为这种旧式的格式化最终会从该语言中移除, 应该更多的使用 str.format().

### 读取键盘输入
Python提供了 input() 内置函数从标准输入读入一行文本，默认的标准输入是键盘。
input 可以接收一个Python表达式作为输入，并将运算结果返回。
```py
str = input("请输入：");
print ("你输入的内容是: ", str)
```
### 读和写文件
open() 将会返回一个 file 对象，基本语法格式如下:
```py
open(filename, mode)
```
规则：
- filename：包含了你要访问的文件名称的字符串值。
- mode：决定了打开文件的模式：只读，写入，追加等。所有可取值见如下的完全列表。这个参数是非强制的，默认文件访问模式为只读(r)。

**不同模式打开文件的完全列表：**
![](https://www.runoob.com/wp-content/uploads/2013/11/2112205-861c05b2bdbc9c28.png)

### 文件对象的方法
本节中剩下的例子假设已经创建了一个称为 f 的文件对象。
**f.read()**
为了读取一个文件的内容，调用 f.read(size), 这将读取一定数目的数据, 然后作为字符串或字节对象返回。

size 是一个可选的数字类型的参数。 当 size 被忽略了或者为负, 那么该文件的所有内容都将被读取并且返回。

**f.readline()**
f.readline() 会从文件中读取单独的一行。换行符为 '\n'。f.readline() 如果返回一个空字符串, 说明已经已经读取到最后一行。

**f.readlines()**
f.readlines() 将返回该文件中包含的所有行。

如果设置可选参数 sizehint, 则读取指定长度的字节, 并且将这些字节按行分割。


**f.write()**
f.write(string) 将 string 写入到文件中, 然后返回写入的字符数。

**f.tell()**
f.tell() 返回文件对象当前所处的位置, 它是从文件开头开始算起的字节数。

**f.seek()**
如果要改变文件当前的位置, 可以使用 f.seek(offset, from_what) 函数。

**f.close()**
在文本文件中 (那些打开文件的模式下没有 b 的), 只会相对于文件起始位置进行定位。

当你处理完一个文件后, 调用 f.close() 来关闭文件并释放系统的资源，如果尝试再调用该文件，则会抛出异常。

### pickle 模块
python的pickle模块实现了基本的数据序列和反序列化。

通过pickle模块的序列化操作我们能够将程序中运行的对象信息保存到文件中去，永久存储。

通过pickle模块的反序列化操作，我们能够从文件中创建上一次程序保存的对象。
## 迭代器与生成器

**迭代器:**
迭代是 Python 最强大的功能之一，是访问集合元素的一种方式。
迭代器是一个可以记住遍历的位置的对象。
迭代器对象从集合的第一个元素开始访问，直到所有的元素被访问完结束。迭代器只能往前不会后退。
==迭代器有两个基本的方法：iter() 和 next()==。
字符串，列表或元组对象都可用于创建迭代器：

```py
>>> list=[1,2,3,4]
>>> it = iter(list)    # 创建迭代器对象
>>> print (next(it))   # 输出迭代器的下一个元素
1
>>> print (next(it))
2
```

迭代器对象可以使用常规for语句进行遍历：
```py
list=[1,2,3,4]
it = iter(list)    # 创建迭代器对象
for x in it:
    print (x, end=" ")

# 输出结果如下：
1 2 3 4
```

迭代器对象可以使用也可以使用 next() 函数进行遍历：
```py
import sys         # 引入 sys 模块
 
list=[1,2,3,4]
it = iter(list)    # 创建迭代器对象
 
while True:
    try:
        print (next(it))
    except StopIteration:
        sys.exit()

# 输出结果如下：
1
2
3
4
```
**创建一个迭代器:**

**生成器:**

在 Python 中，使用了 yield 的函数被称为生成器（generator）。
跟普通函数不同的是，生成器是一个返回迭代器的函数，只能用于迭代操作，更简单点理解生成器就是一个迭代器。
==在调用生成器运行的过程中，每次遇到 yield 时函数会暂停并保存当前所有的运行信息，返回 yield 的值, 并在下一次执行 next() 方法时从当前位置继续运行==。
调用一个生成器函数，返回的是一个迭代器对象。
以下实例使用 yield 实现斐波那契数列：

```py
import sys
 
def fibonacci(n): # 生成器函数 - 斐波那契
    a, b, counter = 0, 1, 0
    while True:
        if (counter > n): 
            return
        yield a
        a, b = b, a + b
        counter += 1
f = fibonacci(10) # f 是一个迭代器，由生成器返回生成
 
while True:
    try:
        print (next(f), end=" ")
    except StopIteration:
        sys.exit()

# 输出结果如下：

0 1 1 2 3 5 8 13 21 34 55
```


## 函数
函数是组织好的，可重复使用的，用来实现单一，或相关联功能的代码段。
函数能提高应用的模块性，和代码的重复利用率。

**函数定义**
```py
def 函数名（参数列表）:
    函数体
```

规则：
- 函数代码块以 def 关键词开头，后接函数标识符名称和圆括号 ()。
- 任何传入参数和自变量必须放在圆括号中间，圆括号之间可以用于定义参数。
- 函数的第一行语句可以选择性地使用文档字符串—用于存放函数说明。
- 函数内容以冒号 : 起始，并且缩进。
- return [表达式] 结束函数，选择性地返回一个值给调用方，不带表达式的 return 相当于- 返回 None。


```py
def max(a, b):
    if a > b:
        return a
    else:
        return b
 
a = 4
b = 5
print(max(a, b))

# 输出结果如下：
# 5
```

### 可更改(mutable)与不可更改(immutable)对象
在 python 中，strings, tuples, 和 numbers 是不可更改的对象，而 list,dict 等则是可以修改的对象。
- 不可变类型：变量赋值 a=5 后再赋值 a=10，这里实际是新生成一个 int 值对象 10，再让 a 指向它，而 5 被丢弃，不是改变 a 的值，相当于新生成了 a。
- 可变类型：变量赋值 la=[1,2,3,4] 后再赋值 la[2]=5 则是将 list la 的第三个元素值更改，本身la没有动，只是其内部的一部分值被修改了。

python 函数的参数传递：

- 不可变类型：==类似 C++ 的值传递，如 整数、字符串、元组==。如 fun(a)，传递的只是 a 的值，没有影响 a 对象本身。如果在 fun(a)）内部修改 a 的值，则是新生成来一个 a。

- 可变类型：==类似 C++ 的引用传递，如 列表，字典==。如 fun(la)，则是将 la 真正的传过去，修改后 fun 外部的 la 也会受影响

python 中一切都是对象，严格意义我们不能说值传递还是引用传递，我们应该说传不可变对象和传可变对象。

### 参数
以下是调用函数时可使用的正式参数类型：
- 必需参数
- 关键字参数
- 默认参数
- 不定长参数

**规则：**
- 使用关键字参数允许函数调用时参数的顺序与声明时不一致，因为 Python 解释器能够用参数名匹配参数值。

**不定长参数：**
- 加了两个星号 ** 的参数会以字典的形式导入。

### 匿名函数

python 使用 lambda 来创建匿名函数。

所谓匿名，意即不再使用 def 语句这样标准的形式定义一个函数。
- lambda 只是一个表达式，函数体比 def 简单很多。
- lambda的主体是一个表达式，而不是一个代码块。仅仅能在lambda表达式中封装有限的逻辑进去。
- lambda 函数拥有自己的命名空间，且不能访问自己参数列表之外或全局命名空间里的参数。
- 虽然lambda函数看起来只能写一行，却不等同于C或C++的内联函数，后者的目的是调用小函数时不占用栈内存- 从而增加运行效率。

**语法：**
lambda 函数的语法只包含一个语句
```py
lambda [arg1 [,arg2,.....argn]]:expression
```

```py
# 可写函数说明
sum = lambda arg1, arg2: arg1 + arg2
 
# 调用sum函数
print ("相加后的值为 : ", sum( 10, 20 ))
print ("相加后的值为 : ", sum( 20, 20 ))

# 输出结果如下：
相加后的值为 :  30
相加后的值为 :  40
```
## 数据结构
### 列表

列表的方法

|   方法   | 描述  | JS  |
| ---- | --- | --- |
| append(x) | 把一个元素添加到列表的结尾，相当于 a[len(a):] = [x]。 | push |
| extend(L) | 通过添加指定列表的所有元素来扩充列表，相当于 a[len(a):] = L。  | concat  |
| insert(i, x) | 在指定位置插入一个元素。第一个参数是准备插入到其前面的那个元素的索引，例如 a.insert(0, x) 会插入到整个列表之前，而 a.insert(len(a), x) 相当于 a.append(x) 。 | splice |
| remove(x) | 删除列表中值为 x 的第一个元素。如果没有这样的元素，就会返回一个错误。 |  |
| pop(i) | 从列表的指定位置移除元素，并将其返回。如果没有指定索引，a.pop()返回最后一个元素。元素随即从列表中被移除。 |  |
| clear() | 移除列表中的所有项，等于del a[:]。 |  |
| index(x) | 返回列表中第一个值为 x 的元素的索引。如果没有匹配的元素就会返回一个错误。 | indexOf |
| sort() | 对列表中的元素进行排序。 |
| reverse() | 倒排列表中的元素。 |
| copy() | 返回列表的浅复制，等于a[:]。 |

```py
>>> a = [66.25, 333, 333, 1, 1234.5]
>>> print(a.count(333), a.count(66.25), a.count('x'))
2 1 0
>>> a.insert(2, -1)
>>> a.append(333)
>>> a
[66.25, 333, -1, 333, 1, 1234.5, 333]
>>> a.index(333)
1
>>> a.remove(333)
>>> a
[66.25, -1, 333, 1, 1234.5, 333]
>>> a.reverse()
>>> a
[333, 1234.5, 1, 333, -1, 66.25]
>>> a.sort()
>>> a
[-1, 1, 66.25, 333, 333, 1234.5]
```

**将列表当做堆栈使用:**
列表方法使得列表可以很方便的作为一个堆栈来使用，堆栈作为特定的数据结构，最先进入的元素最后一个被释放（后进先出）。用 append() 方法可以把一个元素添加到堆栈顶。用不指定索引的 pop() 方法可以把一个元素从堆栈顶释放出来。

**将列表当作队列使用:**

**列表推导式:**
列表推导式提供了从序列创建列表的简单途径。通常应用程序将一些操作应用于某个序列的每个元素，用其获得的结果作为生成新列表的元素，或者根据确定的判定条件创建子序列。

每个列表推导式都在 for 之后跟一个表达式，然后有零到多个 for 或 if 子句。返回结果是一个根据表达从其后的 for 和 if 上下文环境中生成出来的列表。如果希望表达式推导出一个元组，就必须使用括号。

这里我们将列表中每个数值乘三，获得一个新的列表：

```py
>>> vec = [2, 4, 6]
>>> [3*x for x in vec]
[6, 12, 18]



>>> [[x, x**2] for x in vec]
[[2, 4], [4, 16], [6, 36]]


>>> [3*x for x in vec if x > 3]
[12, 18]
>>> [3*x for x in vec if x < 2]
[]
```
以下是一些关于循环和其它技巧的演示：

```py
>>> vec1 = [2, 4, 6]
>>> vec2 = [4, 3, -9]
>>> [x*y for x in vec1 for y in vec2]
[8, 6, -18, 16, 12, -36, 24, 18, -54]
>>> [x+y for x in vec1 for y in vec2]
[6, 5, -7, 8, 7, -5, 10, 9, -3]
>>> [vec1[i]*vec2[i] for i in range(len(vec1))]
[8, 12, -54]



>>> [str(round(355/113, i)) for i in range(1, 6)]
['3.1', '3.14', '3.142', '3.1416', '3.14159']
```

**嵌套列表解析:**
Python的列表还可以嵌套。

以下实例展示了3X4的矩阵列表：
```py
>>> matrix = [
...     [1, 2, 3, 4],
...     [5, 6, 7, 8],
...     [9, 10, 11, 12],
... ]
```

以下实例将3X4的矩阵列表转换为4X3列表 的三种实现：
```py
>>> [[row[i] for row in matrix] for i in range(4)]
[[1, 5, 9], [2, 6, 10], [3, 7, 11], [4, 8, 12]]
```

```py
>>> transposed = []
>>> for i in range(4):
...     transposed.append([row[i] for row in matrix])
...
>>> transposed
[[1, 5, 9], [2, 6, 10], [3, 7, 11], [4, 8, 12]]
```

```py
>>> transposed = []
>>> for i in range(4):
...     # the following 3 lines implement the nested listcomp
...     transposed_row = []
...     for row in matrix:
...         transposed_row.append(row[i])
...     transposed.append(transposed_row)
...
>>> transposed
[[1, 5, 9], [2, 6, 10], [3, 7, 11], [4, 8, 12]]
```

**del 语句:**
使用 del 语句可以从一个列表中依索引而不是值来删除一个元素。这与使用 pop() 返回一个值不同。可以用 del 语句从列表中删除一个切割，或清空整个列表（我们以前介绍的方法是给该切割赋一个空列表）

```py
>>> a = [-1, 1, 66.25, 333, 333, 1234.5]
>>> del a[0]
>>> a
[1, 66.25, 333, 333, 1234.5]
>>> del a[2:4]
>>> a
[1, 66.25, 1234.5]
>>> del a[:]
>>> a
[]
```
也可以用 del 删除实体变量：
```py
>>> del a
```
### 遍历技巧
- ==字典中遍历时==，关键字和对应的值可以使用 items() 方法同时解读出来（l类似于JS的 Object.entries()）：
  ```py
  >>> knights = {'gallahad': 'the pure', 'robin': 'the brave'}
  >>> for k, v in knights.items():
  ...     print(k, v)
  ...
  gallahad the pure
  robin the brave
  ```

- ==序列中遍历时==，索引位置和对应值可以使用 enumerate() 函数同时得到：
  ```py
  >>> for i, v in enumerate(['tic', 'tac', 'toe']):
  ...     print(i, v)
  ...
  0 tic
  1 tac
  2 toe
  ```

- 同时遍历两个或更多的序列，可以使用 zip() 组合：
  ```py
  >>> questions = ['name', 'quest', 'favorite color']
  >>> answers = ['lancelot', 'the holy grail', 'blue']
  >>> for q, a in zip(questions, answers):
  ...     print('What is your {0}?  It is {1}.'.format(q, a))
  ...
  What is your name?  It is lancelot.
  What is your quest?  It is the holy grail.
  What is your favorite color?  It is blue.
  ```

- 要反向遍历一个序列，首先指定这个序列，然后调用 reversed() 函数：
  ```py
  >>> for i in reversed(range(1, 10, 2)):
  ...     print(i)
  ...
  9
  7
  5
  3
  1
  ```
- 要按顺序遍历一个序列，使用 sorted() 函数返回一个已排序的序列，并不修改原值：
  ```py
  >>> basket = ['apple', 'orange', 'apple', 'pear', 'orange', 'banana']
  >>> for f in sorted(set(basket)):
  ...     print(f)
  ...
  apple
  banana
  orange
  pear
  ```
## 命名空间和作用域

### 命名空间

一般有三种命名空间：
- 内置名称（built-in names）， Python 语言内置的名称，比如函数名 abs、char 和异常名称 BaseException、Exception 等等。
- 全局名称（global names），模块中定义的名称，记录了模块的变量，包括函数、类、其它导入的模块、模块级的变量和常量。
- 局部名称（local names），函数中定义的名称，记录了函数的变量，包括函数的参数和局部定义的变量。（类中定义的也是）

![](https://www.runoob.com/wp-content/uploads/2014/05/types_namespace-1.png)

**命名空间查找顺序:**

假设我们要使用变量 runoob，则 Python 的查找顺序为：`局部的命名空间去 -> 全局命名空间 -> 内置命名空间`。

如果找不到变量 runoob，它将放弃查找并引发一个 NameError 异常:
```py
NameError: name 'runoob' is not defined。
```

**命名空间的生命周期：**

命名空间的生命周期取决于对象的作用域，如果对象执行完成，则该命名空间的生命周期就结束。

因此，我们无法从外部命名空间访问内部命名空间的对象。

### 作用域
在一个 python 程序中，直接访问一个变量，会从内到外依次访问所有的作用域直到找到，否则会报未定义的错误。

Python 中，程序的变量并不是在哪个位置都可以访问的，访问权限决定于这个变量是在哪里赋值的。

变量的作用域决定了在哪一部分程序可以访问哪个特定的变量名称。Python的作用域一共有4种，分别是：
- L（Local）：最内层，包含局部变量，比如一个函数/方法内部。
- E（Enclosing）：包含了非局部(non-local)也非全局(non-global)的变量。比如两个嵌套函数，一个函数（或类） A 里面又包含了一个函数 B ，那么对于 B 中的名称来说 A 中的作用域就为 nonlocal。
- G（Global）：当前脚本的最外层，比如当前模块的全局变量。
- B（Built-in）： 包含了内建的变量/关键字等。，最后被搜索

![](https://www.runoob.com/wp-content/uploads/2014/05/1418490-20180906153626089-1835444372.png)

```py
g_count = 0  # 全局作用域
def outer():
    o_count = 1  # 闭包函数外的函数中
    def inner():
        i_count = 2  # 局部作用域
```

**内置作用域:**
内置作用域是通过一个名为 builtin 的标准模块来实现的，但是这个变量名自身并没有放入内置作用域内，所以必须导入这个文件才能够使用它。在Python3.0中，可以使用以下的代码来查看到底预定义了哪些变量:
```py
>>> import builtins
>>> dir(builtins)
```

**新的作用域:**

Python 中只有模块（module），类（class）以及函数（def、lambda）才会引入新的作用域，其它的代码块（如 if/elif/else/、try/except、for/while等）是不会引入新的作用域的，也就是说这些语句内定义的变量，外部也可以访问，如下代码：
```py
>>> if True:
...  msg = 'I am from Runoob'
... 
>>> msg
'I am from Runoob'
>>> 
```

实例中 msg 变量定义在 if 语句块中，但外部还是可以访问的。

如果将 msg 定义在函数中，则它就是局部变量，外部不能访问：

```py
>>> def test():
...     msg_inner = 'I am from Runoob'
... 
>>> msg_inner
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
NameError: name 'msg_inner' is not defined
>>> 
```

从报错的信息上看，说明了 msg_inner 未定义，无法使用，因为它是局部变量，只有在函数内可以使用。

### 全局变量和局部变量
定义在函数内部的变量拥有一个局部作用域，定义在函数外的拥有全局作用域。

局部变量只能在其被声明的函数内部访问，而全局变量可以在整个程序范围内访问。调用函数时，所有在函数内声明的变量名称都将被加入到作用域中。如下实例：

```py
total = 0 # 这是一个全局变量
# 可写函数说明
def sum( arg1, arg2 ):
    #返回2个参数的和."
    total = arg1 + arg2 # total在这里是局部变量.
    print ("函数内是局部变量 : ", total)
    return total
 
#调用sum函数
sum( 10, 20 )
print ("函数外是全局变量 : ", total)

# 结果如下：
函数内是局部变量 :  30
函数外是全局变量 :  0
```

### global 和 nonlocal关键字

当==内部作用域想修改外部作用域的变量==时，就要用到global和nonlocal关键字了。

以下实例修改全局变量 num：
```py
num = 1
def fun1():
    global num  # 需要使用 global 关键字声明
    print(num) 
    num = 123
    print(num)
fun1()
print(num)

# 结果如下：
1
123
123
```

如果要==修改嵌套作用域（enclosing 作用域，外层非全局作用域）中的变量则需要 nonlocal 关键字了==，如下实例：


```py
def outer():
    num = 10
    def inner():
        nonlocal num   # nonlocal关键字声明
        num = 100
        print(num)
    inner()
    print(num)
outer()

# 结果如下：
100
100
```
## 参考资料

- [廖雪峰 Python 官网](https://www.liaoxuefeng.com/wiki/1016959663602400)
- [W3C Python 教程](https://www.w3cschool.cn/python3/python3-tutorial.html)
- [GitHub 上适合新手的开源项目（Python 篇）](https://www.cnblogs.com/xueweihan/p/13946410.html)
