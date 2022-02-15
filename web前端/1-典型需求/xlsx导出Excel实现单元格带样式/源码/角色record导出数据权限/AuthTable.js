import { SmartTable } from "@/components";
import { Button, Checkbox, Input, Popconfirm } from "antd";
import React, { Component } from "react";
import _ from "lodash";
import { handleTreeDataToFlatData, FIRST_ROW_TITLE_LIST } from "./utils";

export default class AuthTable extends Component {
  constructor(props) {}

  exportDataPermissions = (firstRowTitleList, filename = "", type = "") => {
    const handleLevel = (node, level = 1, fieldName = "children") => {
      return {
        ...node,
        level,
        [fieldName]: node[fieldName]
          ? node[fieldName].map((item) => handleLevel(item, level + 1))
          : null,
      };
    };
    const handledLevelTreeData = handleLevel(this.props.data);
    const subDataAuth = handleTreeDataToFlatData(handledLevelTreeData);
    const groupListByKey = (arr = [], key) => {
      return key
        ? arr.reduce((t, v) => {
            if (!t[v[key]]) {
              t[v[key]] = [];
            }
            t[v[key]].push(v);
            return t;
          }, {})
        : {};
    };
    const groupedSubDataAuth = groupListByKey(subDataAuth, "firstName");

    const sortedSubDataAuth = Object.values(groupedSubDataAuth)
      .map((v) => {
        return v.sort((a, b) => a.level - b.level);
      })
      .reduce((t, v) => t.concat(v), []);

    const beforeList = [];
    const afterList = sortedSubDataAuth.reduce((t, v) => {
      if (v.level === 1) {
        beforeList.push(v);
      } else {
        t.push(v);
      }
      return t;
    }, []);

    const finalSubDataAuth = beforeList.concat(afterList);
    const currentRecord = _.get(this.props, "info.detail");
    console.log(`finalSubDataAuth`, finalSubDataAuth);
    console.log(`currentRecord`, currentRecord);
    const exportList = finalSubDataAuth.map((v, i) => {
      return {
        ...v,
        index: i || 0,
        alias: _.get(currentRecord, "alias"),
        roleName: _.get(currentRecord, "roleName"),
        permissionType: "数据权限",
      };
    });
    console.log(`exportList`, exportList);

    const handlEdexportList = [
      firstRowTitleList,
      ...exportList.map((v) => {
        return [
          _.get(v, "index"),
          _.get(v, "roleName") || "",
          _.get(v, "alias") || "",
          _.get(v, "permissionType") || "",
          _.get(v, "firstName") || "",
          _.get(v, "secondName") || "",
          _.get(v, "thirdName") || "",
        ];
      }),
    ];
    console.log(`handlEdexportList`, handlEdexportList);
    const getMergeObjByKey = (key) =>
      exportList.reduce((t, v, i) => {
        if (!(v[key] in t)) {
          // eslint-disable-next-line no-param-reassign
          t[v[key]] = i + 1;
        }
        return t;
      }, {});
    const mergeFirstNameStartKeys = Object.values(
      getMergeObjByKey("firstName")
    );
    const mergeFirstNameEndKeys = [
      ...mergeFirstNameStartKeys,
      exportList.length + 1,
    ]
      .map((v) => v - 1)
      .filter((v) => v > 0);
    const mergeSecondNameObj = exportList.reduce((t, v, i) => {
      const key = `${v.firstName}${v.secondName}`;
      if (!(key in t)) {
        // eslint-disable-next-line no-param-reassign
        t[key] = i + 1;
      }
      return t;
    }, {});
    const mergeSecondNameStartKeys = Object.values(mergeSecondNameObj);
    const mergeSecondNameEndKeys = [
      ...mergeSecondNameStartKeys,
      exportList.length + 1,
    ]
      .map((v) => v - 1)
      .filter((v) => v > 0);
    const handledFirstNameMergeKeys = mergeFirstNameStartKeys.map((v, i) => [
      v,
      mergeFirstNameEndKeys[i],
    ]);
    const handledSecondNameMergeKeys = mergeSecondNameStartKeys.map((v, i) => [
      v,
      mergeSecondNameEndKeys[i],
    ]);
    const exportListLen = exportList.length;
    console.log(`mergeFirstNameStartKeys`, mergeFirstNameStartKeys);
    console.log(`mergeFirstNameEndKeys`, mergeFirstNameEndKeys);
    console.log(`handledFirstNameMergeKeys`, handledFirstNameMergeKeys);
    console.log(`mergeSecondNameStartKeys`, mergeSecondNameStartKeys);
    console.log(`mergeSecondNameEndKeys`, mergeSecondNameEndKeys);
    console.log(`handledSecondNameMergeKeys`, handledSecondNameMergeKeys);

    // 编码单元格
    // eslint-disable-next-line no-undef
    if (!XLSX) return;
    const codingCellObj = {};
    handlEdexportList.forEach((value, r) => {
      value.forEach((v, c) => {
        const cell_obj = { c, r };
        // eslint-disable-next-line no-undef
        const cell_text = XLSX.utils.encode_cell(cell_obj);
        codingCellObj[cell_text] = {
          v,
        };
      });
    });
    const hvCenterStyle = {
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
    };
    // 设置E1单元格样式
    codingCellObj.E1.s = hvCenterStyle;

    // 设置【A-D 共4】列的【1-dataLen】行的样式
    [...Array(4).keys()].forEach((v) => {
      // eslint-disable-next-line no-undef
      const colLetterText = XLSX.utils.encode_col(v);
      [...Array(exportListLen).keys()]
        .map((it) => it + 2)
        .forEach((item) => {
          const cloText = `${colLetterText}${item}`;
          codingCellObj[cloText].s = hvCenterStyle;
        });
    });

    // 设置【E：4】列 多个多行合并的样式
    mergeFirstNameStartKeys.forEach((v) => {
      codingCellObj[`E${v + 1}`].s = hvCenterStyle;
    });
    // 设置【F：5】列 多个多行合并的样式
    mergeSecondNameStartKeys.forEach((v) => {
      codingCellObj[`F${v + 1}`].s = hvCenterStyle;
    });

    // 获取所有单元格编码,比如["A1", "B1", "C1", "D1", "E1", "F1"]
    const output_pos = Object.keys(codingCellObj);
    const workbook = {
      SheetNames: ["sheet1"], // 保存工作表的名称
      Sheets: {
        sheet1: Object.assign(
          {},
          codingCellObj, // 单元格内容
          {
            "!ref": `${output_pos[0]}:${output_pos[output_pos.length - 1]}`, // 工作表范围
          }
        ),
      },
    };
    // 合并单元格
    workbook.Sheets.sheet1["!merges"] = [
      {
        // 【1】行 【EFG：456】列合并
        s: {
          // s开始
          c: 4,
          r: 0,
        },
        e: {
          // e结束
          c: 6,
          r: 0,
        },
      },
      // 合并【A-D 共4】列的【1-dataLen】行
      ...[...Array(4).keys()].map((v) => {
        return {
          s: {
            c: v,
            r: 1,
          },
          e: {
            c: v,
            r: exportListLen,
          },
        };
      }),
      // 【E：4】列 多个多行合并
      ...handledFirstNameMergeKeys.map((v) => {
        return {
          s: {
            c: 4,
            r: v[0],
          },
          e: {
            c: 4,
            r: v[1],
          },
        };
      }),
      // 【F：5】列 多个多行合并
      ...handledSecondNameMergeKeys.map((v) => {
        return {
          s: {
            c: 5,
            r: v[0],
          },
          e: {
            c: 5,
            r: v[1],
          },
        };
      }),
    ];

    // 设置列宽
    workbook.Sheets.sheet1["!cols"] = [
      { wch: 8 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
    ];
    // 导出文件
    const handledType = type || "xlsx";
    let handledFileName = filename || "文件名";
    handledFileName += `.${handledType}`;
    const wopts = {
      bookType: type,
      type: "binary",
    };
    // eslint-disable-next-line no-undef
    const wbout = XLSX.write(workbook, wopts);
    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      // eslint-disable-next-line no-bitwise
      for (let i = 0; i !== s.length; i += 1) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    }
    const blob = new Blob([s2ab(wbout)], {
      type: "application/octet-stream",
    });
    function saveAs(obj, fileName) {
      const link = document.createElement("a");
      link.download = fileName;
      link.href = URL.createObjectURL(obj);
      link.click();
      URL.revokeObjectURL(obj);
    }
    saveAs(blob, handledFileName);
  };

  render() {
    const { data, removeResource, modifyResource } = this.props;
    console.log(`authorities`, authorities);
    return (
      <div>
        <Button
          onClick={() => this.exportDataPermissions(FIRST_ROW_TITLE_LIST)}
        >
          导出数据权限
        </Button>
      </div>
    );
  }
}
