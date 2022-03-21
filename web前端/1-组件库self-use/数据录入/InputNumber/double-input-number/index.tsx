import React from "react";
import { InputNumber } from "antd";

export interface IDoubleInputNumberProps {
  value?: Array<number | undefined>;
  propKey: string;
  placeholder?: string[];
  onChange(key: string, value: Array<number | undefined>);
}

export function DoubleInputNumber(props: IDoubleInputNumberProps) {
  return (
    <div>
      <InputNumber
        placeholder="最小"
        max={props.value?.[1]}
        min={0}
        value={props.value?.[0]}
        onChange={(n) => {
          const end = props.value?.[1];
          props.onChange(props.propKey, [n ? +n : undefined, end]);
        }}
      />
      <span> - </span>
      <InputNumber
        placeholder="最大"
        min={props.value?.[0] || 0}
        value={props.value?.[1]}
        onChange={(n) => {
          const start = props.value?.[0];
          props.onChange(props.propKey, [start, n ? +n : undefined]);
        }}
      />
    </div>
  );
}
