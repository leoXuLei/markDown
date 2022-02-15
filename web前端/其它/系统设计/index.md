## 登录/退出

### 登录 login

- 登录页面输入用户名密码，调用 login 接口，后台返回登录信息（即用户信息）
- 若失败：退出并提示
- 若成功：

  - 密码不符合规则，打开修改密码弹窗
  - 掉三个接口【获取所有角色对应的页面权限、获取所有页面权限、获取权限列表】来 处理用户信息的 permissions 字段

  - 保存用户信息到 localStorage
  - 根据用户信息来处理生成 menuData 并且存到里面
  - CROS 判断(还不清楚)
  - 重定向跳转到登录页面

```js
{
  namespace: 'login',
  state: {
    visible: false,
    username: '',
  },
  effects: {
    *login({ payload }, { put, call }) {
      const response = yield call(login, payload);
      const { data: userInfo, error } = response;
      if (error) {
        notification.error({
          message: '请求失败',
          description: userInfo.message,
        });
        return;
      }

      const validateNum = payload.username === 'admin' ? 12 : 8;

      // 若密码不符合规则：密码必须包含至少一位数字、字母、以及其他特殊字符，且不小于${validateNum}位
      if (
        !new RegExp(`(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^0-9a-zA-Z]).{${validateNum},30}`).test(
          payload.password,
        )
      ) {
        // 首先设置一次用户信息，保存 token 内容到本地，因为修改密码接口需要 token
        // 保存用户信息saveCurrentUser，保存到user model中的currentUser = userInfo
        yield put({ type: 'user/saveUserData', payload: userInfo });
        yield put({
          type: 'updateState',
          payload: {
            visible: true, // 打开修改密码弹窗
            username: payload.username,
          },
        });
        return;
      }

      // 获取角色页面权限，角色列表，所有页面权限
      const updatedPermissionUserInfo = yield call(updatePermission, {
        ...userInfo,
        permissions: PERMISSIONS,
      });
      yield put({
        type: 'user/replenishUserInfo',
        payload: updatedPermissionUserInfo,
      });

      const urlParams = new URL(window.location.href);
      const params = getPageQuery(); // 路径携带的动态路径参数
      let { redirect } = params;

      // CROS 判断
      if (redirect) {
        ...
      }

      const appRoutes = pageRouters.find(item => !!item.appRoute);
      if (!validateRedirect(appRoutes, redirect, updatedPermissionUserInfo.permissions)) {
        redirect = '/welcome-page';
      }
      router.push({
        pathname: redirect,
      });
  }
}


export const updatePermission = async data => {
  const permissionRsps = await initPagePermissions(data.token);
  const allRolePermissions = permissionRsps[0].data;
  // allRolePermissions 结构如下
  /*
    [{
      roleId: "b59fd07c-01c2-44b3-a4b7-87c80580c8ec",
      pageComponentId: ['8434458d-87ca-4a33-a8fd-3967ceea0659', '5d67fe78-467c-4e01-ad6e-533f1c452982'...]
    }]
  */
  const allPagePermissions = permissionRsps[1].data;
  // allPagePermissions 结构如下：递归结构
  /*
    {
      id: "8434458d-87ca-4a33-a8fd-3967ceea0659"
      pageName: "default"
      parentId: {present: false}
      sort: 0,
      children: [
        {
          id: "492f7cf3-bdfd-4e26-8920-c621a99713ca"
          pageName: "reportManage"
          parentId: {present: true}
          sort: 50000,
          children: [.....]
        }
        ...
      ]
    }
  */
  const roles = permissionRsps[2].data;
  // roles 结构如下
  /*
    [{
      alias: "admin"
      id: "f9d24f8e-ac5b-4b09-9850-1929a51e82f1"
      remark: "admin"
      roleName: "admin"
    }]
  */
  const userInfo = _.cloneDeep(data);
  setPagePermissions(userInfo, roles || [], allRolePermissions || [], allPagePermissions);
  return userInfo;
  // 处理后的userInfo结构
  /*
    {
      code: "0"
      expired: false
      locked: false
      loginStatus: true
      message: "登录成功"
      permissions: {
        // 哪些页面有权限则为true
        welcomePage: true,
        default: true,
        reportManage: true,
        hookTypeWeeklyReport: true,
        reminder: true
        ...
      }
      roles: ["admin"]
      token: "eyJhbGciOiJIUzI1NiJ9....YW1lIjoiYWRtaW4ifQ...-Xlgycmd9AiS3rw9st_0I"
      userId: "539eeb7a-89bc-42cd-8bcf-bd26f7cb495f"
      username: "admin"
    }
  */
};

export async function initPagePermissions(token?) {
  return Promise.all([
    queryRolePagePermissions({}, token), // 获取所有角色对应的页面权限
    queryAllPagePermissions({}, token), // 获取所有页面权限
    authRolesList({}, token), // 获取权限列表
  ]);
}

// 获取用户所拥有的页面权限
// 权限是挂在角色上的，每个用户拥有多个角色，将多个角色的页面权限取并集得到的就是用户的权限
// 函数目的：处理userInfo 的 permissions属性
function setPagePermissions(user, roles, rolePagesPermission, pagePermissionTree) {
  function setPermission(pageTree, pageIds) {
    if (!pageTree || typeof pageTree !== 'object') {
      return;
    }
    const { id, children, pageName } = pageTree;
    if (pageIds.includes(id)) {
      user.permissions[pageName] = true;
    }
    if (children && children.length > 0) {
      children.forEach(child => setPermission(child, pageIds));
    }
  }
  let pageIds = [];
  // 角色列表
  rolePagesPermission.forEach(page => {
    const role = roles.find(r => r.id === page.roleId);
    page.roleName = (role && role.roleName) || '';
  });
  user.roles.forEach(role => {
    const hint = rolePagesPermission.find(rolePage => rolePage.roleName === role);
    if (hint) {
      pageIds = pageIds.concat(hint.pageComponentId);
    }
  });
  setPermission(pagePermissionTree, pageIds);
}


saveCurrentUser(userInfo) {
  Storage.setItem('token', userInfo.token);
  Storage.setItem('user', userInfo.username);
  Storage.setItem('role', userInfo.roles);
  Storage.setItem(USER_LOCAL_FIELD, JSON.stringify(userInfo)); // tongyu_USER_LOCAL_FIELD
}
```

```js
{
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {
    *replenishUserInfo(action, { put }) {
      const { payload: userInfo = {} } = action;

      // 保存用户信息到localStorage
      yield put({
        type: 'saveUserData',
        payload: userInfo,
      });

      // 处理生成menuData并且存到里面
      yield put({
        type: 'menu/initMenu',
        payload: userInfo,
      });

      // eslint-disable-next-line no-underscore-dangle
      if (window._hmt && userInfo.username) {
        // eslint-disable-next-line no-underscore-dangle
        window._hmt.push(['_setUserTag', '7350', userInfo.username]);
      }
    },
  },
  reducers: {
    // 保存用户信息
    saveUserData(state, action) {
      setUser(action.payload);

      return {
        ...state,
        currentUser: action.payload,
      };
    },
  }
}

```

### 注销退出 logout

- 调用 logout 接口（参数为 userId）
- 清除当前用户信息：cleanCurrentUser
- 清空 app model 中的 navOpenKeys
- 跳转到登录页面

```js
*logout({ payload }, { put, call }) {
  dispatch({
    type: 'login/out',
    payload: {
      userId: Storage.getItem('user')
    }
  })
  yield put({
    type: 'app/handleNavOpenKeys',
    payload: { navOpenKeys: [] },
  });

  message.info('退出登录');

  router.push({
    pathname: '/login',
  });
}

cleanCurrentUser() {
  Storage.removeItem('token');
  Storage.removeItem('user');
  Storage.removeItem('role');
  Storage.removeItem(USER_LOCAL_FIELD); // tongyu_USER_LOCAL_FIELD
  Storage.removeItem(`${prefix}navOpenKeys`);
}
```

## 菜单显示

```js

export default {
  namespace: 'menu',

  state: {
    menuData: [],
  },

  effects: {
    *initMenu({ payload }, { put }) {
      const appRoute = pageRouters.find(item => item.appRoute);
      const { permissions } = payload;

      if (!appRoute) {
        throw new Error('appRoute is not defiend!');
      }

      // menuData是一个树结构，包括path,component,routes:[],children:[],icon,name,noPermission,label
      const menuData = mapTree(
        appRoute,
        item => {
          const getNoPermission = () => {
            if (
              item.routes &&
              item.routes.some(route => permissions[route.name] || route.noAccess === false)
            ) {
              return false;
            }
            return (
              !permissions[item.name] ||
              (item.routes && item.routes.every(route => !permissions[route.name]))
            );
          };

          return {
            noPermission: getNoPermission(),
            ...item,
            children: item.routes,
          };
        },
        'routes',
      );
      yield put({
        type: 'save',
        payload: menuData.children || [],
      });
    },
  },
}

// permissions 数据结构
{
  account: true
  asset: true
  auditingManagement: true
  auditingProcessConfiguration: true
  balance: true
  bond: true
}
```


```js
// C:\project\structured-finance\src\components\Layout\Menu.js
const Menus = ({ siderFold, darkTheme, navOpenKeys, changeOpenKeys, menuData, location }) => {
  const conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };
  // 生成菜单
  const getMenus = menuTreeN => {
    if (!menuTreeN) {
      return [];
    }
    return menuTreeN
      .filter(item => item.name && !item.hideInMenu && !item.noPermission)
      .map(item => {
        if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
          return (
            <SubMenu
              key={item.path}
              title={
                item.icon ? (
                  <span>
                    <Icon type={item.icon}></Icon>
                    <span>{item.label}</span>
                  </span>
                ) : (
                  item.label
                )
              }
            >
              {getMenus(item.children)}
            </SubMenu>
          );
        }
        return (
          <Menu.Item key={item.path}>
            <Link to={conversionPath(item.path)}>
              {item.icon && <Icon type={item.icon} />}
              {item.label}
            </Link>
          </Menu.Item>
        );
      });
  };

  // 生成菜单
  const menuItems = getMenus(menuData);

  // 获取所有的path数组
  const flatMenuKeys = getFlatMenuKeys(menuData);
  /* 数据结构为
  [
    "/welcome-page"
    "/distribution"
    "/distribution/product-list"
    "/distribution/product-list/:id"
  ]
  */

  // 判断path 是不是一级菜单的path 
  const isMainMenu = key =>
    menuData.some(item => {
      if (key) {
        return item.key === key || item.path === key;
      }
      return false;
    });

  // 根据当前路由返回当前选择的菜单
  const getSelectedMenuKeys = pathname => {
    return urlToList(pathname).map(itemPath => getMenuMatches(flatMenuKeys, itemPath).pop());
  };

  const handleOpenChange = keys => {
    const moreThanOne = keys.filter(openKey => isMainMenu(openKey)).length > 1;
    const nextOpenKeys = moreThanOne ? [keys.pop()] : [...keys];
    changeOpenKeys({ navOpenKeys: nextOpenKeys });
  };

  let selectedKeys = getSelectedMenuKeys(location.pathname); // 如 '/document/dictionary'
  if (!selectedKeys.length && navOpenKeys) {
    selectedKeys = [navOpenKeys[navOpenKeys.length - 1]];
  }
  console.log('selectedKeys', selectedKeys)
  console.log('navOpenKeys', navOpenKeys)
  return (
    <Menu
      mode={siderFold ? 'vertical' : 'inline'}
      theme={darkTheme ? 'dark' : 'light'}
      onOpenChange={handleOpenChange} // SubMenu 展开/关闭的回调
      selectedKeys={selectedKeys} // 当前选中的菜单项 key 数组
      className={styles.setHeight}
      openKeys={navOpenKeys} // 当前展开的 SubMenu 菜单项(一级菜单) key 数组
    >
      {menuItems}
    </Menu>
  );
};


// /userinfo/2144/id => ['/userinfo','/useinfo/2144,'/userindo/2144/id']

export function urlToList(url) {
  const urllist = url.split('/').filter(i => i);
  return urllist.map((urlItem, index) => `/${urllist.slice(0, index + 1).join('/')}`);
}


export const getMenuMatches = (flatMenuKeys, path) =>
  flatMenuKeys.filter(item => {
    if (item) {
      return pathToRegexp(item).test(path);
    }
    return false;
  });
```

## 菜单权限控制

控制不同角色显示不同菜单（即控制页面权限）。
在【系统管理/角色管理页面】给不同的角色配置不同的菜单。
页面逻辑

- 进入页面查询总菜单信息 List（数据结构见下面的 authPageComponentList...）
- 进入页面查询角色 List
  ```js
  // 数据结构
  [
    {
      alias: "admin"
      id: "f9d24f8e-ac5b-4b09-9850-1929a51e82f1"
      remark: "admin"
      roleName: "admin"
    },
    ...
  ]
  ```
- 点击某个角色的权限管理，根据角色 id 查询该角色的权限配置信息(即哪些 tree 节点被勾选的 Data)， 且 tree 型控件 onCheck 更新的数据结构也如下。
  ```js
  // 数据结构
  [
  "492f7cf3-bdfd-4e26-8920-c621a99713ca"
  "2417107b-96d6-4c1a-9237-b6f6784e5bc9"
  "456a1189-fbb5-4125-95ff-0d6fc8d6db3e"
  ...
  ]
  ```
- 全部的 tree 树 data 由下面的 authPageComponentList 菜单信息数据处理得到
  ```js
  // 数据结构
  [{
    key: "8434458d-87ca-4a33-a8fd-3967ceea0659",
    title: "页面权限",
    children: [
      {
        key: "456a1189-fbb5-4125-95ff-0d6fc8d6db3e",
        title: "市场数据管理",
        children: [
          {
            children: undefined,
            key: "968f1afa-88f4-4449-a546-7f36524de958",
            title: "市场数据",
          },
          {
            children: undefined,
            key: "4368a66b-37e5-46aa-a39c-a9a7e53a97d8",
            title: "上传标的白名单"
          },
          {
            children: undefined,
            key: "9f8bbc66-35cd-4646-bde2-78b6f6d0b2e7",
            title: "查看标的白名单"
          }
        ]
      },
      ...
    ]
  }]
  ```
  ![systemRoleManagement](../imgs/systemRoleManagement.png)
  ![systemRoleManagementConfig](../imgs/systemRoleManagementConfig.png)

```js
import pageRouters from '../../config/router.config';
const appRoute = pageRouters.find(item => item.appRoute);

 // 递归处理node对象的routes属性([{}])，若存在，每个routes的子item依然处理如此，若不存在返回undefined
const mapRoutes = (node, fieldName = 'routes') => ({
  ...node,
  [fieldName]: node[fieldName]
    ? node[fieldName].map(item => mapRoutes(item, fieldName))
    : undefined,
});

const filterAppRoute = mapRoutes(appRoute);

// 映射树形数据
function mapTree(node, cb, fieldName = 'children', parent = null) {
  return cb(
    {
      ...node,
      [fieldName]: node[fieldName]
        ? node[fieldName].map(item => mapTree(item, cb, fieldName, node)).filter(it => !!it)
        : undefined,
    },
    parent
  );
}

// 处理得到树形控件数据
export const treeData = pageId => {
  const data = mapTree(
    filterAppRoute,
    node => {
      if (node.appRoute === true) {
        return {
          title: '页面权限',
          key: _.get(pageId, 'default'),
          children: node.routes,
        };
      }
      return {
        title: node.label,
        key: _.get(pageId, node.name),
        children: node.routes,
      };
    },
    'routes',
  );
  return [data];
};


public renderTreeNodes = data =>
  data.map(item => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode key={item.key} title={item.title} dataRef={item} />;
  });

<Tree
  checkable
  onCheck={this.onCheck}
  checkedKeys={this.state.checkedKeys}
  defaultExpandedKeys={this.state.checkedKeys}
>
  {this.renderTreeNodes(treeData(pageId))}
</Tree>

public handleDrawer = async () => {
  const { error, data } = await authPagePermissionGetByRoleId({
    roleId: this.props.record.id,
  });
  if (error) {
    message.error('页面权限获取失败');
    return;
  }

  // 获取角色已选中的节点，因为antd中的父子节点有关联，传入父节点key,子节点全部选中，子节点都传入，父节点自动选中，所以要把父节点筛选掉
  const fatherNodeId = fatherTreeNode.map(item => _.get(this.props.pageId, item));
  const checkedKeys = data.filter(item => !fatherNodeId.includes(item));
  this.setState({
    visible: true,
    checkedKeys,
  });
};

/* authPageComponentList菜单信息数据结构(递归结构嵌套) */
[
{
  id: "8434458d-87ca-4a33-a8fd-3967ceea0659"
  pageName: "default"
  parentId: {present: false}
  sort: 0,
  children: [
    {
      id: "4368a66b-37e5-46aa-a39c-a9a7e53a97d8"
      pageName: "updateWhiteList"
      parentId: {present: true}
      sort: 110300,
      children: null
    },
    {
      id: "9f8bbc66-35cd-4646-bde2-78b6f6d0b2e7"
      pageName: "whiteList"
      parentId: {present: true}
      sort: 110200,
      // 第三级不再是三级菜单，而是二级菜单即页面上的操作权限
      children: [
        {
          id: "98505eb2-8974-442c-94a1-6a9610087011"
          pageName: "uploadWhite"
          parentId: {present: true}
          sort: 110201,
          children: null
        },
        {
          id: "0d526ad2-f44d-4f8e-94c5-49bc8fda4734"
          pageName: "downloadWhite"
          parentId: {present: true}
          sort: 110202,
          children: null
        }
        ...
      ]
    }
    ...
  ]
}
]

/* pageId 数据结构为 */
{
  user: "bc78939e-509e-4ab4-9260-e337037f4eb7"
  userList: "0b258c3d-b2e0-4444-bac0-bbb31d414cdc"
  weeklyReport: "2417107b-96d6-4c1a-9237-b6f6784e5bc9"
  weeklyReportList: "e4dd2b96-f75b-4d52-b892-3e09d9495261"
  welcomePage: "c15417b4-3b29-42ce-a4d4-49de459b528c"
  whiteList: "9f8bbc66-35cd-4646-bde2-78b6f6d0b2e7"
}
```

## 页面布局

所在目录:`C:\project\structured-finance\src\layouts\BasicLayout.tsx`

## 其它

### 规定时间内没操作退出

- `new Date().getTime()`

```js
/* 实现功能：如果0.5小时内没有点击页面，则退出登录 */

const timeOut = 30 * 60 * 1000; // 30分钟

useEffect(() => {
  timer = window.setInterval(() => {
    handleLogout();
  }, 1000);
  return () => {
    window.clearInterval(timer);
  };
}, []);

const handleLogout = () => {
  currentTime = new Date().getTime();
  const lastTime = sessionStorage.getItem("lastTime");
  if (currentTime - lastTime > timeOut) {
    window.clearInterval(timer);
    dispatch({
      type: "login/logout",
      payload: { userId: Storage.getItem("user") },
    });
  }
};

// 只要点击页面就触发更新lastTime（layouts/BasicLayout.tsx）
const onClick = () => {
  sessionStorage.setItem("lastTime", new Date().getTime());
};
```
