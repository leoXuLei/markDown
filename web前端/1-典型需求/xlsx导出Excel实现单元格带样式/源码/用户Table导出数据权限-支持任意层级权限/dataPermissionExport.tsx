import { DATA_PERMISSION_RESOURCE_TYPE_MAP } from '@/constants/common';
import AUTHES from '@/pages/SystemSettingResource/constants';

export const getAuthList = item => {
  const permissions = item.resourcePermissions;
  const authes = AUTHES[item.resourceType];
  return (authes || []).reduce((t, v) => {
    const res = t;
    const obj = Object.assign({});
    obj.name = v.zh;
    obj.value = v.value;
    obj.choosed = permissions.includes(v.value);
    if (obj.choosed) {
      res.push(obj);
    }
    return res;
  }, []);
};

const mapTree = (node, cb, fieldName = 'children', parentNodes = []) => {
  const findalParentNodes = parentNodes.concat(node);
  return cb(
    {
      ...node,
      [fieldName]: node[fieldName]
        ? node[fieldName].map(item => mapTree(item, cb, fieldName, findalParentNodes))
        : undefined,
    },
    findalParentNodes,
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
