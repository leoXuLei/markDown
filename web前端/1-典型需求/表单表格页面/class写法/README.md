## 表单表格相关数据
```
    this.state = {
      tableProps: {
        loading: false,
        dataSource: [],
        total: 0,

        // 接口参数
        payload: {
          // 分页参数
          current: 1,
          pageSize: 10,

          // 控件参数
          jsrq: '', // 结束日期
          ksrq: '', // 开始日期
          yyb: '',  // 营业部
          zlfl: '', // 资料分类
          zlmc: '', // 资料名称
        },
      }
    }

```

## 表单
1. 表单是用来收集参数的
2. 表单控件分为受控和非受控，区别在于是否需要自己监听事件和保存控件值


## 表格
1. 表格是dataSource的map映射，便于浏览数据
2. 列的各种操作(点击弹窗等)其实都是获取record(dataSource中的{}), 尽量往上一层传递onClickRecord(record)，弹窗组件也放在上一层接收record后进行显示和后续处理，因为只是传递给封装的弹窗组件的数据变了，逻辑和流程共用。就不需要在每一行都重复生成一个弹窗组件实例
