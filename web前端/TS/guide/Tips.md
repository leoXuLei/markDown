## 字符串数组元素作为联合类型的值
```ts
declare const ModeOptions: ["default", "multiple", "tags", "combobox"];
type ModeOption = (typeof ModeOptions)[number];
// type ModeOption = "default" | "multiple" | "tags" | "combobox"
```
