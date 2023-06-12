# e.presist

注意：

如果你想异步访问事件属性，你需在事件上调用 event.persist()，此方法会从池中移除合成事件，允许用户代码保留对事件的引用。

如下，如果 handleAppNameChange 方法中不使用 e.persist()，那么控制台将报错且拿不到 e.target.value

```jsx
  const handleAppNameChange = useDebounce((e) => {
    e.persist()
    setAppName(refInput?.current?.input?.state?.value)
  }, 300)

<Input.Search
  ref={refInput}
  type="text"
  placeholder={i18n.appName}
  onChange={handleAppNameChange}
  allowClear
/>
```

下面这种将 e.target.value 暂存的方法可以不用再传 e 也就是不需要再使用 e.persist()

```jsx
// 搜索业务线
  const handleSearchBusinessLine = useDebounce((value, searchType) => {
    // const value = e?.target?.value || ''
    searchTypeRef.current = searchType
    setSearchValue(value?.trim?.())
  }, 300)


<Input.Search
  loading={loading && searchTypeRef.current === "line"}
  value={lineSearchValue}
  onChange={(e) => {
    // e.persist()
    const value = e?.target?.value;
    setLineSearchValue(value);
    setStaffSearchValue("");
    handleSearchBusinessLine(value, "line");
  }}
  placeholder="搜索业务线"
  className="businessline-input"
/>
```

# e.target.value 和 e.target.ariaValueNow

`e?.target?.ariaValueNow`的值好像是上次 onChange 事件的参数 value。

```tsx
<InputNumber
  value={section}
  style={{ width: "64px", height: "24px" }}
  onBlur={(e) => {
    // e?.target?.value：onBlur前控件显示的值，不一定是全数字字符串
    const onBlurBeforeValue = Number(e?.target?.value);

    // e?.target?.ariaValueNow：onBlur后控件显示的值，全数字字符串
    const onBlurAfterValue = Number(e?.target?.ariaValueNow);

    // 失去焦点后若值小于5，则填充为5
    if (
      ((!!onBlurBeforeValue || onBlurBeforeValue === 0) &&
        onBlurBeforeValue < 5) ||
      ((!!onBlurAfterValue || onBlurAfterValue === 0) && onBlurAfterValue < 5)
    ) {
      onChange?.({ section: 5 });
    }
  }}
  onChange={(value: number | null) => {
    if (value !== null) {
      onChange?.({
        section: value,
      });
    }
  }}
/>
```
