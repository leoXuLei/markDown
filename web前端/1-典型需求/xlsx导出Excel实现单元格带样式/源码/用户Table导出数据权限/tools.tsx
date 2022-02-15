import React from "react";
import AUTHES from "@/pages/SystemSettingResource/constants";

const getAuthList = (item) => {
  const permissions = item.resourcePermissions;
  const authes = AUTHES[item.resourceType];
  return authes.reduce((t, v) => {
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

const mapTree = (node, cb, fieldName = "children", parent = null) => {
  return cb(
    {
      ...node,
      [fieldName]: node[fieldName]
        ? node[fieldName].map((item) => mapTree(item, cb, fieldName, node))
        : undefined,
    },
    parent
  );
};

export const handleTreeDataToFlatData = (rootNode) => {
  let res = [];
  mapTree(rootNode, (node, parentNode) => {
    if (node.level === 1) {
      res = res.concat(
        getAuthList(node).map((item) => ({
          firstName: item.name,
          level: 1,
        }))
      );
    }
    if (node.level === 2) {
      res = res.concat(
        getAuthList(node).map((item) => ({
          firstName: node.resourceName,
          secondName: item.name,
          level: 2,
        }))
      );
    }
    if (node.level === 3) {
      res = res.concat(
        getAuthList(node).map((item) => ({
          firstName: parentNode.resourceName,
          secondName: node.resourceName,
          thirdName: item.name,
          level: 3,
        }))
      );
    }
  });
  return res;
};
