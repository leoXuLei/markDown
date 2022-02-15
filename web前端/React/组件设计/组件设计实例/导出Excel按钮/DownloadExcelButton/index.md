使用如下：
```js
<DownloadExcelButton
  style={{ margin: '10px 0' }}
  key="export"
  type="primary"
  data={{
    dataSource: traderTableData,
    cols: TABLE_COLUMNS,
    name: '合约累计损益',
    handleDataSource,
    getSheetDataSourceItemMeta,
    // colSwitch: [{ dataIndex: 'clientType', options: TRADER_TYPE }], 列值转换
  }}
```
