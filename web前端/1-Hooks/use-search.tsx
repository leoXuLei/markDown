import React, { useState, useCallback } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Input } from "@com/sun";
import useDebounce from "@/hooks/use-debounce";
import useAppLocales from "@/hooks/use-app-locales";

const useSearch = () => {
  const { common } = useAppLocales();
  const [searchVal, setSearchVal] = useState<string>();
  const handleSearch = useCallback((v: string) => {
    setSearchVal(v);
  }, []);
  const searchDeb = useDebounce(handleSearch, 215);
  const ele = (
    <Input
      prefix={<SearchOutlined />}
      placeholder={common?.pleaseInput}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        searchDeb(e.target.value);
      }}
    />
  );
  return { ele, searchVal };
};

export default useSearch;
