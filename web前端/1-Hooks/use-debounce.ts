import { useMemo } from "react";
import { debounce } from "lodash";

function useDebounce(fn, time) {
  return useMemo(() => debounce(fn, time), [fn, time]);
}

/*
  // 防抖来一个
  const handleInputChange = useCallback(
    useDebounce(
      () => {
        console.log('inputRef.current?.state?.value', inputRef.current?.state?.value)
        setSearchStr(inputRef.current?.state?.value)
      },
      currentType === 'originalTask' ? 300 : 50,
    ),
    [currentType, setSearchStr],
  )

<Input
  placeholder="请搜索"
  prefix={<SearchOutlined />}
  ref={inputRef}
  // value={searchStr}
  // onChange={(e) => searchDeb(e.target.value)}
  // onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
  //   searchDeb(e.target.value)
  // }}
  onChange={handleInputChange}
/>
*/

export default useDebounce;
