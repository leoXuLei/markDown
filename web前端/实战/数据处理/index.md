# 递归

## 遍历处理树形数据

```js
const mapTree = (node, cb, fieldName = "children", parentNodes = []) => {
  const findalParentNodes = parentNodes.concat(node);
  return cb(
    {
      ...node,
      [fieldName]: node[fieldName]
        ? node[fieldName].map((item) =>
            mapTree(item, cb, fieldName, findalParentNodes)
          )
        : undefined,
    },
    findalParentNodes
  );
};

export const handleTreeDataToFlatData = rootNode => {
  let res = [];
  mapTree(rootNode, (node, parentNodes) => {
    const { level } = node;
    // 返回当前节点的权限列表
    const handledAuthList = getAuthList(node);

    const getConcatList = () => {
      const getNodeNames = node => {
        const { resourceName, resourceType } = node;
        const resourceTypeZHCN = DATA_PERMISSION_RESOURCE_TYPE_MAP[resourceType];
        if (resourceTypeZHCN) {
          if (resourceTypeZHCN === DATA_PERMISSION_RESOURCE_TYPE_MAP.ROOT) {
            return resourceName;
          }
          return `${resourceName} (${resourceTypeZHCN})`;
        }
        return resourceName;
      };
      const dataPermissionColumnNameObj = ([...Array(level).keys()].reduce((t, v, i) => {
        const temp = t;
        temp[`${v}_name`] = getNodeNames(parentNodes[i]);
        return temp;
      }, {}) as unknown) as object;
      // 有权限的节点返回当前节点
      if (handledAuthList.length) {
        return handledAuthList.map(item => {
          return {
            ...dataPermissionColumnNameObj,
            [`${level}_name`]: item.name,
            level,
          };
        });
      }
      // 没有权限但是有子节点的返回nul
      if (node.children) {
        return null;
      }
      // 没有权限但是没有子节点的返回当前节点
      return {
        ...dataPermissionColumnNameObj,
        level,
      };
    };
    const toConcatList = getConcatList() || [];
    res = res.concat(toConcatList);
  });
  return res;
};

```

## 树形数据处理

原理就是递归，最小的子问题解决之后开始依次返回值，最终得到问题的最终结果（类似坐在电影院最后一排，问前面一排他是第几排，他也同样方式问他的前面一排，以此类推，直到问到第一排的人，他回头告诉第二排的人自己是第一排，以此类推，最终就能直到最后一排是第几排）

### 实例一： 两级菜单树形数据处理

```js
const pageId = {
  account: "565cbdfe-f328-425b-9b01-9d4bb2245c50",
  approvalGroupList: "21e1c211-558d-4939-844e-56496a7a5507",
  approvalList: "44a1a74a-5c95-45dc-8b3a-3570ba019966",
  approveOrder: "dd605fc4-3658-4380-beaf-f8d4bf434ddc",
  approveRisk: "7621434d-c2bf-4087-b320-95b47e0164ad",
  asset: "4d2e13c1-1383-44b5-ab43-834dc6ef31bc",
  auditingManagement: "469fe29f-f487-494f-860e-1c3d8347d4a7",
  auditingProcessConfiguration: "a3594b24-0a68-4894-a1d4-2a9f6052ae3f",
};

const appRoute = routeData.find((item) => item.appRoute); // routeData:路由配置数据 router.config.js

// appRoute数据结构
/*
  {
    appRoute: true,
    component: "../layouts/BasicLayout"
    path: "/"
    routes: [
      {
        component: "./IndexPage"
        hideInConfig: true
        icon: "laptop"
        label: "首页"
        name: "welcomePage"
        path: "/welcome-page"
      },
      {
        icon: "laptop"
        label: "发行管理"
        name: "distribution"
        path: "/distribution"
        routes: [
          {
            component: "./distribution/productList"
            icon: "laptop"
            label: "产品列表"
            name: "productList"
            path: "/distribution/product-list"
          },
          {
            component: "./distribution/createProducts"
            icon: "laptop"
            label: "非定制化预约表生成"
            name: "createProducts"
            path: "/distribution/create-products"
          }
          ...
        ]
      }
      ...
    ]
  }
*/

const mapRoutes = (node, fieldName = "routes") => ({
  ...node,
  [fieldName]: node[fieldName]
    ? node[fieldName]
        .map((item) => mapRoutes(item, fieldName))
        .filter((it) => it.hideInConfig !== true)
    : undefined,
});

const filterAppRoute = mapRoutes(appRoute);

// filterAppRoute数据结构
/*
{
  appRoute: true
  component: "../layouts/BasicLayout"
  path: "/"
  routes: [
    {
      icon: "laptop"
      label: "发行管理"
      name: "distribution"
      path: "/distribution"
      routes: [
        {
          component: "./distribution/productList"
          icon: "laptop"
          label: "产品列表"
          name: "productList"
          path: "/distribution/product-list"
          routes: undefined
        },
        {
          component: "./distribution/createProducts"
          icon: "laptop"
          label: "非定制化预约表生成"
          name: "createProducts"
          path: "/distribution/create-products"
          routes: undefined
        }
      ]
    }
  ]

}
*/

function mapTree(node, cb, fieldName = "children", parent = null) {
  return cb(
    {
      ...node,
      [fieldName]: node[fieldName]
        ? node[fieldName]
            .map((item) => mapTree(item, cb, fieldName, node))
            .filter((it) => !!it)
        : undefined,
    },
    parent
  );
}

export const treeData = (pageId) => {
  const data = mapTree(
    filterAppRoute,
    (node) => {
      if (node.appRoute === true) {
        return {
          title: "页面权限",
          key: _.get(pageId, "default"),
          children: node.routes,
        };
      }
      return {
        title: node.label,
        key: _.get(pageId, node.name),
        children: node.routes,
      };
    },
    "routes"
  );
  return [data];
};

treeData(pageId);
// 界面效果可见 【系统设计-菜单权限控制】
// 数据结构如下
/* 
[
{
  key: "1f8443d9-b421-4709-a5f6-c72e230820ca"
  title: "页面权限",
  children: [
    {
      key: "040837ca-0b50-42de-b7b4-37668e621c31"
      title: "发行管理"
      children: [
        {
          children: undefined
          key: "9e405b30-bfde-45f9-959c-42265cac9bc4"
          title: "产品列表"
        },
        {
          children: undefined
          key: "d50ff2c5-e247-4707-b046-6e8c0ea04661"
          title: "非定制化预约表生成"
        }
        ...
      ]
    }
    ...
  ]
}
]
*/
```

### 实例二： 两级菜单树形数据处理+三级(二级的操作权限)

```js
// allPagePermission 数据结构
/*
{
  id: "1f8443d9-b421-4709-a5f6-c72e230820ca"
  pageName: "default"
  pageNameCN: null
  parentId: {present: false}
  sort: 0,
  // 一级菜单
  children: [
    id: "040837ca-0b50-42de-b7b4-37668e621c31"
    pageName: "distribution"
    pageNameCN: "发行管理"
    parentId: {present: true}
    sort: 20000
    // 二级菜单
    children: [
      {
        id: "9e405b30-bfde-45f9-959c-42265cac9bc4"
        pageName: "productList"
        pageNameCN: "产品列表"
        parentId: {present: true}
        sort: 20100
        // 三级：页面权限
        children: [
          {
            children: null
            id: "f2b04163-9ddd-439d-a916-b572d81c8d09"
            pageName: "moveProductDetail"
            pageNameCN: "跳转查看产品详情页面"
            parentId: {present: true}
            sort: 20102
          },
          {
            children: null
            id: "bbdd54ba-5e8b-410d-b50e-f41fffb94b89"
            pageName: "productDetailDocumentUpdate"
            pageNameCN: "产品详情-文档更新"
            parentId: {present: true}
            sort: 20106
          },
          {
            children: null
            id: "89dbce10-4786-4bbc-89bc-3b9600e84159"
            pageName: "productDetailDocumentDownload"
            pageNameCN: "产品详情-文档下载"
            parentId: {present: true}
            sort: 20105
          }
          ...
        ]
      }，
      {
        id: "d50ff2c5-e247-4707-b046-6e8c0ea04661"
        pageName: "createProducts"
        pageNameCN: "非定制化预约表生成"
        parentId: {present: true}
        sort: 20400
        children: [
          {
            children: null
            id: "ebb8aa34-d9c2-47c5-b3ba-99fa70678d68"
            pageName: "generateNonCustomOrder"
            pageNameCN: "生成非定制化预约表"
            parentId: {present: true}
            sort: 20401
          }
        ]
      }
      ...
    ]
  ]
}
*/

// 递归遍历树形数据，根据id查找某一节点
public getLevelTwoChildrenById = id => {
  const {
    roleModel: { allPagePermission },
  } = this.props;
  const getChildrenById = (list, key) => {
    for (let i = 0; i < list.length; i += 1) {
      const node = list[i];
      if (node.id === key) {
        return node.children;
      }
      if (node.children) {
        const findRes = getChildrenById(node.children, key);
        if (findRes) {
          return findRes;
        }
      }
    }
  };
  return getChildrenById([allPagePermission], id);
};

public handleLevelThreeTreeData = list => {
  const [firstItem] = list;
  const data = mapTree(
    firstItem,
    node => {
      if (!node.children) {
        const levelTwoChildren = this.getLevelTwoChildrenById(node.key);
        if (levelTwoChildren) {
          return {
            ...node,
            children: levelTwoChildren.map(v => {
              const { id, pageNameCN, children } = v;
              return {
                key: id,
                title: pageNameCN,
                children: children || null,
              };
            }),
          };
        }
      }
      return node;
    },
    'children',
  );
  return [data];
};

const handledTreeData = this.handleLevelThreeTreeData(treeData(pageId));

// handledTreeData 数据结构
/*
[
{
  key: "1f8443d9-b421-4709-a5f6-c72e230820ca"
  title: "页面权限"
  // 一级菜单
  children: [
    {
      key: "040837ca-0b50-42de-b7b4-37668e621c31"
      title: "发行管理"
      // 二级菜单
      children: [
        {
          key: "9e405b30-bfde-45f9-959c-42265cac9bc4"
          title: "产品列表"
          // 三级：页面权限
          children: [
            {
              children: null
              key: "f2b04163-9ddd-439d-a916-b572d81c8d09"
              title: "跳转查看产品详情页面"
            },
            {
              children: null
              key: "bbdd54ba-5e8b-410d-b50e-f41fffb94b89"
              title: "产品详情-文档更新"
            },
            {
              children: null
              key: "89dbce10-4786-4bbc-89bc-3b9600e84159"
              title: "产品详情-文档下载"
            },
          ]
        }
      ]
    }
    ...
  ]
}
]
*/

```

### 实例三： 返回最后一级：即第三级(二级的操作权限)

```js
// 写法一：reduce
export const getLevelThreeKeyTreeData = (list) => {
  // const getChildrenById = list => {
  //   for (let i = 0; i < list.length; i += 1) {
  //     const node = list[i];
  //     if (!node.children) {
  //       result.push(node);
  //       continue;
  //     }
  //     getChildrenById(node.children);
  //   }
  // };
  // getChildrenById([allPagePermission]);
  // const result = getReduce([allPagePermission]);

  return list.reduce((t, v) => {
    if (!v.children) {
      t.push(v);
    }
    return t.concat(
      Array.isArray(v.children) ? getLevelThreeKeyTreeData(v.children) : []
    );
  }, []);
};

// 写法二：for循环递归
export const getLevelThreeKeyTreeData = (list) => {
  const result = [];
  const getChildrenById = (arr) => {
    for (let i = 0; i < arr.length; i += 1) {
      const node = arr[i];
      if (!node.children) {
        result.push(node);
        continue;
      }
      getChildrenById(node.children);
    }
  };

  getChildrenById(list);
  return result;
};
```

```js
  // 使用如下 handleDrawer的旧写法参照 【系统设计-菜单权限控制】
  public handleDrawer = async () => {
    const {
      roleModel: { allPagePermission },
    } = this.props;
    const { error, data } = await authPagePermissionGetByRoleId({
      roleId: this.props.record.id,
    });
    if (error) {
      message.error('页面权限获取失败');
      return;
    }

    // 获取角色已选中的节点，因为antd中的父子节点有关联，传入父节点key,子节点全部选中，子节点都传入，父节点自动选中，所以要把父节点筛选掉
    // const fatherNodeId = fatherTreeNode.map(item => _.get(this.props.pageId, item));
    // const checkedKeys = data.filter(item => !fatherNodeId.includes(item));

    const levelThreeKey = getLevelThreeKeyTreeData([allPagePermission]).map(v => v.id);
    const checkedKeys = data.filter(item => levelThreeKey.includes(item));
    this.setState({
      visible: true,
      checkedKeys,
    });
  };
```

### 实例四： 树形数据转为平层

```js
const treeData = [
  {
    children: [
      {
        title: "我的任务",
        key: "myTask",
        children: [
          {
            title: "我的审批单",
            key: "approvalProcessManagement",
            children: undefined,
          },
          { title: "交易事件提醒", key: "notifications", children: undefined },
        ],
      },
      {
        title: "定价簿记",
        key: "pricingBooking",
        children: [
          { title: "试定价", key: "pricing", children: undefined },
          { title: "场外簿记", key: "booking", children: undefined },
        ],
      },
    ],
    key: "default",
    title: "页面权限",
  },
];

const getSubMenu = (arr) => {
  return arr.reduce((t, v) => {
    if (v && v.children) {
      t = [
        ...t,
        ...getSubMenu(v.children).map((item) => ({
          parentMenuTitle: v.title,
          ...item,
          // 上面两行故意写成这样顺序是为了 可以直接调用getSubMenu(treeData)，否则顺序调换过来：getSubMenu(_.get(test, '[0].children', [])))
        })),
      ];
    } else {
      t.push({
        title: v.title,
        key: v.key,
      });
    }
    return t;
  }, []);
};

getSubMenu(treeData);
// 结果如下
const res = [
  {
    parentMenuTitle: "我的任务",
    title: "我的审批单",
    key: "approvalProcessManagement",
  },
  { parentMenuTitle: "我的任务", title: "交易事件提醒", key: "notifications" },
  { parentMenuTitle: "定价簿记", title: "试定价", key: "pricing" },
  { parentMenuTitle: "定价簿记", title: "场外簿记", key: "booking" },
];

// 若 `t.push({ title: v.title, key: v.key });` 不用else包着则结果如下
const res = [
  {
    parentMenuTitle: "我的任务",
    title: "我的审批单",
    key: "approvalProcessManagement",
  },
  { parentMenuTitle: "我的任务", title: "交易事件提醒", key: "notifications" },
  { title: "我的任务", key: "myTask" },
  { parentMenuTitle: "定价簿记", title: "试定价", key: "pricing" },
  { parentMenuTitle: "定价簿记", title: "场外簿记", key: "booking" },
  { title: "定价簿记", key: "pricingBooking" },
];
```

### 实例五： 见`典型需求/excel导出数据处理`

### 实例六： 配方详情工序各层级数据处理

从配方详情工序数据\_originData 中，按照当前 sfc 层级，处理目标节点及其后代节点的参数信息。

```tsx
// 任意层级procedure节点处理
const procedureParamContentCommonHandle = useMemoizedFn(
  (paramData: Record<string, any>, targetNode: Record<string, any>) => {
    paramData["Name"] = targetNode?.["Name"];
    paramData["Desc"] = targetNode?.["Remark"];
    const { STParam, FBParam } =
      targetNode?.["ProcedureParams"]?.reduce(
        (totalObj: any, paramItem: any) => {
          const paramType = paramItem["ParamType"];
          const handledParam = {
            Name: paramItem["ParamName"],
            Type: DATA_TYPE_ZHCH_MAP[paramItem["DataType"] as EDataType.Number],
            EU: paramItem["ParamEU"],
          };
          if (paramType === EParamType.InputParam) {
            totalObj.STParam.push(handledParam);
          } else if (paramType === EParamType.OutParam) {
            totalObj.FBParam.push(handledParam);
          }
          return totalObj;
        },
        {
          STParam: [],
          FBParam: [],
        }
      ) || {};
    paramData["STParam"] = STParam || [];
    paramData["FBParam"] = FBParam || [];
  }
);

// 获取 recipe层 SFC节点和子节点的参数信息
const recipeLevelParamContentHandle = useMemoizedFn(
  (paramData: Record<string, any>, targetNode: Record<string, any>) => {
    procedureParamContentCommonHandle(paramData, targetNode);
    paramData["Units"] = targetNode?.["Units"]?.map((unitItem: any) => {
      const handledUnitItem: any = {};
      unitLevelParamContentHandle(handledUnitItem, unitItem);
      return handledUnitItem;
    });
  }
);

// 获取 unit层 SFC节点和子节点的参数信息
const unitLevelParamContentHandle = useMemoizedFn(
  (paramData: Record<string, any>, targetNode: Record<string, any>) => {
    procedureParamContentCommonHandle(paramData, targetNode);
    paramData["UnitEquipProp"] = targetNode?.ID
      ? getUnitEquipmentClassInfoParamOptionsByUnitId(targetNode?.ID as string)
      : [];
    paramData["Operations"] = targetNode?.["Operations"]?.map(
      (operationItem: any) => {
        const handledOperationItem: any = {};
        operationLevelParamContentHandle(handledOperationItem, operationItem);
        return handledOperationItem;
      }
    );
  }
);

// 获取 operation层 SFC节点和子节点的参数信息
const operationLevelParamContentHandle = useMemoizedFn(
  (paramData: Record<string, any>, targetNode: Record<string, any>) => {
    procedureParamContentCommonHandle(paramData, targetNode);
    paramData["Phases"] = targetNode?.["Phases"]?.map((phaseItem: any) => {
      const handledPhaseItemItem: any = {};
      phaseLevelParamContentHandle(handledPhaseItemItem, phaseItem);
      return handledPhaseItemItem;
    });
  }
);

// 获取 phase层 SFC节点和子节点的参数信息
const phaseLevelParamContentHandle = useMemoizedFn(
  (paramData: Record<string, any>, targetNode: Record<string, any>) => {
    paramData["Name"] = targetNode?.["Name"];
    paramData["Desc"] = targetNode?.["Remark"];
    const { STParam, FBParam } =
      targetNode?.["Param"]?.reduce(
        (totalObj: any, paramItem: any) => {
          const paramType = paramItem["Type"];
          const handledParam = {
            Name: paramItem["Name"],
            Type: DATA_TYPE_ZHCH_MAP[paramItem["DataType"] as EDataType.Number],
            EU: paramItem["Unit"],
          };
          if (paramType === EParamType.InputParam) {
            totalObj.STParam.push(handledParam);
          } else if (paramType === EParamType.OutParam) {
            totalObj.FBParam.push(handledParam);
          }
          return totalObj;
        },
        {
          STParam: [],
          FBParam: [],
        }
      ) || {};
    paramData["STParam"] = STParam || [];
    paramData["FBParam"] = FBParam || [];

    paramData["Mat"] = [
      {
        STType:
          PHASE_OUT_PARAM_DATA_TYPE_ZHCH_MAP[
            targetNode?.["MatDataType"] as EPhaseOutParamDataType.Number
          ],
        FBType: "数值",
        EU: targetNode?.["MatUnit"],
      },
    ];
  }
);

// 获取 当前SFC节点和子节点的参数信息
const getParamContent = useMemoizedFn(() => {
  const treeSelectdSplitList = treeSelectedKey?.split?.("#");
  const curLevelType = treeSelectdSplitList?.[0];
  const leftTreeSelectNodeId = treeSelectdSplitList?.[1];

  const selectNodeFindInfos = treeSelectdSplitList[2]
    ? treeSelectdSplitList[2].split("-")
    : [];

  const recipeChildrenKeys = ["Units", "Operations", "Phases"];

  const findCurSelectedNodeConfigs =
    selectNodeFindInfos?.map?.((item, index) => {
      return {
        keyName: "Name",
        keyValue: item,
        childrenKey: recipeChildrenKeys[index],
      };
    }) || [];

  // 从V0版本的_originData中找到目标节点
  const targetNode = findNodeFromV0OriginDBData(
    v0ProcessData,
    findCurSelectedNodeConfigs
  );
  console.log("targetNode", targetNode);

  let paramContent = {};
  // 暂时先不根据当前层级取获取当前节点及其后代节点的参数信息了，直接recipe层级
  // switch (curLevelType) {
  //   case SFC_LEVEL.RECIPE:
  //     recipeLevelParamContentHandle(paramContent, targetNode);
  //     break;
  //   case SFC_LEVEL.UNIT:
  //     unitLevelParamContentHandle(paramContent, targetNode);
  //     break;
  //   case SFC_LEVEL.OPERATION:
  //     operationLevelParamContentHandle(paramContent, targetNode);
  //     break;
  //   case SFC_LEVEL.PHASE:
  //     phaseLevelParamContentHandle(paramContent, targetNode);
  //     break;
  //   default:
  //     break;
  // }
  recipeLevelParamContentHandle(paramContent, targetNode);
  console.log("getParamContent :>> paramContent :>> ", paramContent);
  return paramContent;
});
```

# 其它

## 比较两个对象的属性变化

```js
// 写一个比较两个对象相同属性、不同属性
const getKeyListObjByCompareObj = (objOne, objTwo) => {
  const keyListOne = Object.keys(objOne);
  const keyListTwo = Object.keys(objTwo);
  const sameKeyList = keyListOne.filter((v) => keyListTwo.includes(v));
  const unionKeyList = keyListOne.concat(
    keyListTwo.filter((v) => !keyListOne.includes(v))
  );

  // 属性相同值不同的属性组成的对象
  const keySameValueDifferent = sameKeyList.reduce((t, v) => {
    const valueOfOne = objOne[v];
    const valueOfTwo = objTwo[v];
    if (valueOfOne !== valueOfTwo) {
      t[v] = `${valueOfOne} -> ${valueOfTwo}`;
    }
    return t;
  }, {});
  return {
    sameKeyList, // 相同key
    unionKeyList, // 不同key
    keySameValueDifferent,
  };
};
// const res = getKeyListObjByCompareObj(test1, test2);
const { sameKeyList, unionKeyList, keySameValueDifferent } = res;
```
