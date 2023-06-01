# 组件数组渲染，如何初始化传入方法/属性

**【错误实现】**
如下代码实现，会报错如下

```json
Uncaught TypeError: Cannot perform 'get' on a proxy that has been revoked


devScripts.js:6523 The above error occurred in the <div> component:

devScripts.js:6523 Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
```

```tsx
const defaultPanes = [
  {
    key: "templateManagement",
    label: "library.templateManagement",
    closable: false,
    children: <Library />,
  },
];
const LibraryPage: FC<ILibraryPageProps> = memo((props) => {
  const [tabItems, setTabItems] = useState<ITabItem[]>(defaultPanes);

  const handleTabItem = useMemoizedFn(
    (recordID: string, operateType: EnumOpTemplateStatusOperateType) => {
      console.log("recordID", recordID);
      console.log("operateType", operateType);
    }
  );

  useEffect(() => {
    if (!handleTabItem) {
      return;
    }
    setTabItems(
      produce((draft) => {
        const target = draft.find(
          (tabItem) => tabItem.key === "templateManagement"
        );
        if (!target) return;

        // <Library />组件传入方法：handleTabItem
        if (isValidElement(target.children)) {
          target.children = cloneElement(target.children, {
            handleTabItem,
          } as any);
        }
      })
    );
  }, [handleTabItem]);
});
```

**【正确实现】**

```tsx
const LibraryPage: FC<ILibraryPageProps> = memo((props) => {
  const [tabItems, setTabItems] = useState<ITabItem[]>([]);

  const handleTabItem = useMemoizedFn(
    (recordID: string, operateType: EnumOpTemplateStatusOperateType) => {
      console.log("recordID", recordID);
      console.log("operateType", operateType);
    }
  );

  useEffect(() => {
    if (!handleTabItem) {
      return;
    }
    setTabItems(
      produce((draft) => {
        draft.push({
          key: "templateManagement",
          label: "library.templateManagement",
          closable: false,
          children: <Library handleTabItem={handleTabItem} />,
        });
        return draft;
      })
    );
  }, [handleTabItem]);
});
```
