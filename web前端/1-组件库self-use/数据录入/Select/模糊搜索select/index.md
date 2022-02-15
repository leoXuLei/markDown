## 使用如下

```jsx
import StaffSearchSelect from 'client/components/staff-org-staff-select'

const [executor, setExecutor] = useState<string[]>([]) // 经办人

const handleExecutorChange = useCallback((v) => {
    setExecutor(v)
    updateParamRef('executor', v)
  }, [])

render() {
    return (
        <StaffSearchSelect
            className="field-item"
            placeholder="请选择经办人"
            value={executor}
            onChange={handleExecutorChange}
        />
    );
}

```
