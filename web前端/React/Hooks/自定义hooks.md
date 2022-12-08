# 自定义 Hook

通过自定义 Hook，可以将组件逻辑提取到可重用的函数中。

目前为止，在 React 中有两种流行的方式来共享组件之间的状态逻辑: `render props` 和高阶组件，现在让我们来看看 Hook 是如何在让你不增加组件的情况下解决相同问题的。

> **规则：**
>
> - 自定义 Hook 是一个函数，其名称必须以 “use” 开头，函数内部可以调用其他的 Hook
> - 在两个组件中使用相同的 Hook 会共享 state 吗？不会。
>   自定义 Hook 是一种重用状态逻辑的机制(例如设置为订阅并存储当前值)，**所以每次使用自定义 Hook 时，其中的所有 state 和副作用都是完全隔离的**。
>   **Hook 是一种复用状态逻辑的方式，它不复用 state 本身。事实上 Hook 的每次调用都有一个完全独立的 state**：参考`自定义Hook-实例一`

# 实例一

```jsx
import { getOriginalTaskInitInfo } from 'client/ekko/services/original-task'
import { useCallback, useEffect, useState } from 'react'

export function useOriginalStateFlow() {
  const [info, setInfo] = useState<IOriginalTaskInit>()
  const refresh = useCallback(async () => {
    const response = await getOriginalTaskInitInfo()
    if (response.success) setInfo(response.result)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return info?.flow
}


const flow = useOriginalStateFlow()
// 这种自定义hook的请求，只要使用该hook的组件挂载都会触发重新请求（甚至是更新渲染的时候）
```

# 实例二：页面读写权限 Hook`useMaterialPermission`

```tsx
import { useMemo } from "react";
import { IUserState } from "@/models/user";
import { EnumCommonPowerType } from "@/utils/config";

interface IUseMaterialPermissionProps {
  user?: IUserState;
  disabled?: boolean;
}

const useMaterialPermission = (
  props: IUseMaterialPermissionProps
): [boolean, boolean] => {
  const { disabled = false, user } = props;

  const permissionMap = useMemo(() => {
    return (
      user?.permission?.reduce?.((t: Record<string, number>, item) => {
        const { enumID, enumStatus } = item;
        t[String(enumID)] = enumStatus;
        return t;
      }, {}) || {}
    );
  }, [user?.permission]);

  // 原料管理/产品管理没有查看权限
  const canNotRead = useMemo(() => {
    const materialReadDisabled =
      permissionMap[EnumCommonPowerType.PowerID_Material_Readonly] !== 1;
    const materialConfigDisabled =
      permissionMap[EnumCommonPowerType.PowerID_Material_Config] !== 1;
    return materialReadDisabled && materialConfigDisabled;
  }, [permissionMap]);

  // 原料管理/产品管理没有组态权限
  const operateDisabled = useMemo(() => {
    const materialConfigDisabled =
      permissionMap[EnumCommonPowerType.PowerID_Material_Config] !== 1;
    return disabled || materialConfigDisabled;
  }, [disabled, permissionMap]);

  return [canNotRead, operateDisabled];
};

export default useMaterialPermission;
```

```tsx
// 使用实例

import { useMaterialPermission } from "@/hooks";

const MaterialComp: FC<IMaterialProps> = memo((props) => {
  const { user, disabled = false } = props;

  const [canNotRead, operateDisabled] = useMaterialPermission({
    user,
    disabled,
  });

  if (canNotRead) {
    return null;
  }
});

function mapStateProps(state: any) {
  return {
    user: state.user as IUserState,
  };
}

export default connect(mapStateProps)(MaterialComp);
```
