import _ from 'lodash';
import React, { memo, useEffect, useState } from 'react';
import { Select } from '@/containers';
import { mktInstrumentSearch } from '@/services/market-data-service';

const GroupSelcet = memo<{
  value?: any;
  index: number;
  form?: any;
  editing?: any;
  onAutoSelectChange: (index, list) => void;
  getPopupContainer: () => void;
}>(props => {
  const { editing, index, getPopupContainer, onAutoSelectChange } = props;
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    setValue(props.value);
  }, []);

  const handleOk = async () => {
    onAutoSelectChange(index, value);
  };

  const getOptions = async (value: string = '') => {
    const { data, error } = await mktInstrumentSearch({
      instrumentIdPart: value,
    });
    if (error) return [];
    return data.slice(0, 50).map(item => ({
      label: item,
      value: item,
    }));
  };

  if (!_.get(props, 'editing')) {
    return (
      <Select
        getPopupContainer={getPopupContainer}
        defaultOpen
        autoSelect
        // mode="multiple"
        options={getOptions}
        editing={editing}
        value={value}
      />
    );
  }

  return (
    <Select
      getPopupContainer={getPopupContainer}
      placeholder="请输入内容搜索"
      showSearch
      defaultOpen
      allowClear
      autoSelect
      // mode="multiple"
      fetchOptionsOnSearch
      options={getOptions}
      editing={editing}
      value={value}
      onChange={val => {
        setValue(val);
        onAutoSelectChange(index, val);
      }}
    />
  );
});

export default GroupSelcet;
