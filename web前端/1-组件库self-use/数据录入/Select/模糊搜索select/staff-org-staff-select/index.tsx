import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { Select } from "@com/sun";
import { searchOrgAndStaff } from "client/ekko/services/project";
import useDebounce from "@/hooks/use-debounce";
import { SelectProps, SelectValue } from "@com/sun/dist/select";

const { Option } = Select;

interface IValue {
  staffs?: IStaff[] | string[];
  orgs?: IOrg[] | string[];
}

export interface IStaffSearchSelectProps extends SelectProps<SelectValue> {
  style?: React.CSSProperties;
  className?: string;
  placeholder?: string;
  value?: string | string[];
  onChange?: (any) => void;
}

const StaffOrgStaffSelect: React.FC<IStaffSearchSelectProps> = (props) => {
  const [value, setValue] = useState<string | string[]>();
  const [loading, setLoading] = useState(false);
  const [searchList, setSearchList] = useState<
    Array<{ label: string; value: string }>
  >([]); // 搜索结果
  const searchValueRef = useRef<string>(); // 记录最新一次搜索的值

  const {
    className,
    style = {},
    placeholder = "请选择",
    onChange,
    ...restProps
  } = props;

  useEffect(() => {
    props?.value && setValue(props?.value);
  }, [props?.value]);

  // 监听搜索框变化
  const handleSearchChange = useCallback(async (value) => {
    searchValueRef.current = value;
    if (value) {
      setLoading(true);
      const { result = {} as IValue, success } = await searchOrgAndStaff({
        key: value,
        includeOrg: false,
        includeStaff: true,
      });
      if (success && searchValueRef.current === value) {
        const data = ((result?.staffs as IStaff[]) || [])?.map((v) => ({
          label: `${v?.comName}(${v?.name})`,
          value: v?.staffId!,
        }));
        setSearchList(data);
      } else {
        setSearchList([]);
      }
      setLoading(false);
    } else {
      setSearchList([]);
    }
  }, []);

  const handleChange = (value) => {
    setValue(value);
    console.log("StaffOrgStaffSelect::setValue", value);
    onChange?.(value);
  };

  const handleSearch = useDebounce(handleSearchChange, 300);

  const options = useMemo(
    () =>
      searchList.map((item) => (
        <Option key={item?.value} value={item?.value}>
          {item?.label}
        </Option>
      )),
    [searchList]
  );

  return (
    <Select
      className={className}
      style={style}
      placeholder={placeholder}
      allowClear
      showArrow
      showSearch
      mode="multiple"
      maxTagCount={3}
      defaultActiveFirstOption={false}
      filterOption={false}
      loading={loading}
      value={value}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={<span>暂无数据</span>}
      {...restProps}
    >
      {options}
    </Select>
  );
};

export default StaffOrgStaffSelect;
