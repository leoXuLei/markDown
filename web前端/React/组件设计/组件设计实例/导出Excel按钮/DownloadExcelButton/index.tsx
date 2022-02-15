import { Button, message } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { Form2 } from '@/components';
import { getMoment } from '@/utils';
import { convert2excel } from './utils/convert2excel';

class DownloadExcelButton extends PureComponent<any> {
  public exportFile = async () => {
    const {
      searchMethod,
      cols,
      name,
      argument,
      colSwitch = [],
      sortBy,
      handleDataSource,
      getSheetDataSourceItemMeta,
      sheetName = 'SheetJS',
      dataSource,
      expandTitle = false,
    } = this.props.data;
    if (!searchMethod) {
      let newDataSource = [];
      if (dataSource && dataSource.length === 0) {
        return message.error('请选择想要导出的任务');
      }
      if (_.isArray(dataSource) || handleDataSource) {
        newDataSource = handleDataSource ? handleDataSource(dataSource) : dataSource;
      } else {
        newDataSource = (dataSource || []).map(item =>
          _.mapValues(item, (value, key) => {
            const col = colSwitch.find(iitem => iitem.dataIndex === key);
            if (col) {
              return col.options[value];
            }
            return value;
          }),
        );
      }
      if (sortBy) {
        newDataSource = _.reverse(_.sortBy(newDataSource, 'sortBy'));
      }

      convert2excel(
        newDataSource,
        cols,
        {
          getSheetDataSourceItemMeta,
          fileName: name,
          sheetName,
        },
        [],
        [],
        expandTitle,
      );
      return;
    }
    const { searchFormData, sortField = {}, extendTitle, extendDataIndex } = argument;
    const { error, data: _data } = await searchMethod({
      ..._.mapValues(Form2.getFieldsValue(searchFormData), (values, key) => {
        if (key === 'valuationDate') {
          return getMoment(values).format('YYYY-MM-DD');
        }
        return values;
      }),
      ...sortField,
    });

    if (error) return;

    let newData = [];
    if ((!_data.page && _.isArray(_data)) || handleDataSource) {
      newData = handleDataSource ? handleDataSource(_.isArray(_data) ? _data : _data.page) : _data;
    } else {
      newData =
        name === '定制化报告'
          ? (_data.page || []).map(item =>
              _.mapValues(item.reportData, (value, key) => {
                const col = colSwitch.find(iitem => iitem.dataIndex === key);
                if (col) {
                  return col.options[value];
                }
                return value;
              }),
            )
          : (_data.page || []).map(item =>
              _.mapValues(item, (value, key) => {
                const col = colSwitch.find(iitem => iitem.dataIndex === key);
                if (col) {
                  return col.options[value];
                }
                return value;
              }),
            );
    }

    if (sortBy) {
      newData = _.reverse(_.sortBy(newData, 'sortBy'));
    }

    convert2excel(
      newData,
      cols,
      {
        getSheetDataSourceItemMeta,
        fileName: name,
        sheetName,
      },
      extendTitle,
      extendDataIndex,
      expandTitle,
    );
  };

  public render() {
    const { children, ...rest } = this.props;
    return (
      <Button {...(_.omit(rest) as ButtonProps)} onClick={this.exportFile}>
        {children}
      </Button>
    );
  }
}

export default DownloadExcelButton;
