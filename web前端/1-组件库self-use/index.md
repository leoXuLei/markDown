# utils

## 带单位的数值展示

```jsx
import { renderFieldFormat } from "@/utils/common";


render() {
<Descriptions.Item label="测试时长占比">
    {renderFieldFormat(testProportion)}
</Descriptions.Item>
<Descriptions.Item label="延期天数">{renderFieldFormat(delayDays, '天')}</Descriptions.Item>
<Descriptions.Item label="实际总工作量">
    {renderFieldFormat(actualWorkDays, '人日')}
</Descriptions.Item>
}

```
