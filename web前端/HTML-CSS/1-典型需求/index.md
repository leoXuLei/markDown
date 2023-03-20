# 动态计算绝对定位元素的 left 数值

想把保存按钮绝对定位到 Tabs 标签头的末尾，目标元素节点的类名是`"ant-tabs-nav-list"`，但是把保存按钮包裹在`<Tabs/>`下无效，只能动态计算，动态的去获取目标元素节点的 width，然后设置到保存按钮的 left 的数值。

```tsx
const getSaveBtnStyle = useMemoizedFn(() => {
  // 在id为'opTemplateTabs'的元素的子节点中，获取所有class为'ant-tabs-nav-list'的元素
  const antTabsNavListEle = document
    ?.getElementById?.("opTemplateTabs")
    ?.getElementsByClassName?.("ant-tabs-nav-list");
  if (antTabsNavListEle?.[0]) {
    // `window.getComputedStyle()`方法接受一个元素节点作为参数，返回一个包含该元素的最终样式信息的对象
    const antTabsNavListEleWidth = getComputedStyle(
      antTabsNavListEle?.[0]
    )?.width;
    if (antTabsNavListEleWidth) {
      const gapWidth = 30;
      return {
        left: `${
          (parseInt(antTabsNavListEleWidth?.slice?.(0, -2), 10) || 0) + gapWidth
        }px`,
      };
    }
  }
  return {
    right: 0,
  };
});

return (
  <div id="opTemplateTabs" className={styles.TabsContainer}>
    <Tabs
      hideAdd
      type="editable-card"
      className={styles.Tabs}
      activeKey={activeKey}
      items={handledTabItems}
      onChange={onTabsChange}
    />
    <Button
      className={styles.SaveBtn}
      style={getSaveBtnStyle()}
      onClick={saveAllTabsData}
      disabled={!hasSomeOpTemplateDetailModified}
    >
      保存信息
    </Button>
  </div>
);
```

```css
.TabsContainer {
  position: relative;
  .SaveBtn {
    position: absolute;
    top: 4px;
  }
}
```
