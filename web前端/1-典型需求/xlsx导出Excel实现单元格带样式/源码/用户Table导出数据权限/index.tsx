import { Button, Col, message, Modal, notification, Row } from "antd";
import _ from "lodash";
import React, { PureComponent } from "react";
import moment from "moment";
import { VERTICAL_GUTTER } from "@/constants/global";
import { Form2, SmartTable, Table2 } from "@/components";
import Page from "@/components/Page";
import { queryAuthDepartmentList } from "@/services/department";
import { handleTreeDataToFlatData } from "@/pages/SystemSettingsRoleManagement/tools";
import DownloadExcelButton from "@/components/DownloadExcelButton";
import { authRolesList } from "@/services/role";
import {
  authUserList,
  createUser,
  updateUserRole,
  login,
} from "@/services/user";
import { getUser, setUser } from "@/utils/authority";
import { queryUserResourceAuthes } from "@/services/resources";
import { handleChoosed } from "@/pages/SystemSettingResource/utils";
import ResourceManagement from "../SystemSettingResource/ResourceManage";
import { CREATE_FORM_CONTROLS } from "./tools";
import { createPageTableColDefs, ExportTableColDefs } from "./services";
import {
  ROLE_FIRST_ROW_TITLE_LIST,
  DATA_PERMISSIONS_FIRST_ROW_TITLE_LIST,
} from "./constants";

function findDepartment(departs, departId) {
  let hint = {};
  function inner(d) {
    if (d.id === departId) {
      hint = d;
      return;
    }
    const { children } = d;
    if (children && children.length > 0) {
      const target = children.find((c) => c.id === departId);
      if (target) {
        hint = target;
      } else {
        children.forEach((c) => inner(c));
      }
    }
  }
  inner(departs);
  return hint;
}

function departmentsTreeData(departments) {
  function getChild(params) {
    if (params.children) {
      return {
        title: params.departmentName,
        value: params.id,
        key: params.id,
        children: params.children.map((item) => getChild(item)),
      };
    }
    return {
      title: params.departmentName,
      value: params.id,
      key: params.id,
    };
  }
  return departments && getChild(departments);
}

class SystemSettingsUsers extends PureComponent {
  public rowKey = "id";

  public $form: Form2 = null;

  public state = {
    roleOptions: [],
    loading: false,
    formData: Form2.createFields({ roleIds: [] }),
    users: [],
    modalVisible: false,
    displayResources: false,
    choosedUser: {},
    departments: [],
    confirmLoading: false,
  };

  public componentDidMount = () => {
    this.fetchData();
  };

  public fetchData = async () => {
    this.setState({ loading: true });
    const rsps = await Promise.all([
      authUserList(),
      authRolesList(),
      queryAuthDepartmentList({}),
    ]);
    this.setState({ loading: false });

    if (rsps.some((item) => item.error)) return;

    const [usersRes, rolesRes, departmentsRes] = rsps;
    const departments = departmentsRes.data || {};
    const roles = rolesRes.data || [];
    this.setState({
      departments,
    });
    const users = (usersRes.data || []).map((user) => {
      const department = findDepartment(departments, user.departmentId);
      return {
        ...user,
        departmentName: department.departmentName || "",
        userTypeName: user.userType === "SCRIPT" ? "????????????" : "????????????",
        roles: Form2.createField(
          user.roleName.map((role) => {
            const hint = roles.find((item) => item.roleName === role);
            return hint && hint.id;
          })
        ),
      };
    });
    this.setState({
      roleOptions: roles.map((item) => {
        return {
          value: item.id,
          label: item.roleName,
        };
      }),
      users: users.sort((a, b) => a.username.localeCompare(b.username)),
    });
  };

  public showModal = () => {
    this.setState((state) => ({
      modalVisible: !state.modalVisible,
    }));
  };

  public showResources = (rowData) => {
    this.setState({
      displayResources: true,
      choosedUser: rowData,
    });
  };

  public hideResource = () => {
    this.setState({
      displayResources: false,
    });
  };

  public handleCellValueChanged = async (params) => {
    this.setState((state) => ({
      users: state.users.map((item) => {
        if (item.id === params.rowId) {
          return {
            ...item,
            ...params.changedFields,
          };
        }
        return item;
      }),
    }));
  };

  public onCreate = async () => {
    const validateRsp = await this.$form.validate();
    if (validateRsp.error) return;
    const newData = Form2.getFieldsValue(this.state.formData);
    if (
      !/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^0-9a-zA-Z]).{8,30}/.test(
        newData.password
      )
    ) {
      message.error(
        "?????????????????????????????????????????????????????????????????????????????????8???"
      );
      return;
    }
    if (newData.password !== newData.confirmpassword) {
      message.error("????????????????????????????????????");
      return;
    }
    this.setState({ confirmLoading: true });
    const { error, data } = await createUser(
      _.omit(newData, "confirmpassword")
    );
    this.setState({ confirmLoading: false });
    if (error) {
      message.error("????????????");
      return;
    }
    message.success("????????????");
    this.setState({
      modalVisible: false,
      formData: Form2.createFields({ roleIds: [] }),
    });
    this.fetchData();
  };

  public handleFieldsChangeCreate = (props, fields, allFields) => {
    this.setState((state) => ({
      formData: {
        ...state.formData,
        ...fields,
      },
    }));
  };

  public handleValueChanged = async (params) => {
    const { record, rowId } = params;

    const user = this.state.users.find((item) => item.id === rowId);
    if (!user) return;

    const res = await updateUserRole({
      userId: user.id,
      roleIds: Form2.getFieldValue(record.roles),
    });
    if (res.error) return;
    const userInfo = getUser();
    if (_.get(res, "data.username") === _.get(userInfo, "username")) {
      setUser({
        ...userInfo,
        roles: _.get(res, "data.roleName"),
      });
    }
    notification.success({
      message: "??????????????????",
    });
  };

  public handleDataSource = (data) => {
    const newData = data.map((item) => {
      const roles = (Form2.getFieldValue(item.roles) || []).map((iitem) => {
        return _.get(
          _.find(this.state.roleOptions, (o) => o.value === iitem),
          "label"
        );
      });

      let state = "";
      if (!item.locked && !item.expired) {
        state = "??????";
      }
      if (item.locked) {
        state = "??????";
      }
      if (item.expired) {
        state = "??????";
      }
      return {
        ...item,
        roles: (roles || []).join(","),
        lastLoginTime: item.lastLoginTime
          ? moment(item.lastLoginTime).format("YYYY-MM-DD HH:mm:ss")
          : "",
        lockedTime: item.lockedTime
          ? moment(item.lockedTime).format("YYYY-MM-DD HH:mm:ss")
          : "",
        passwordModifyTime: item.passwordModifyTime
          ? moment(item.passwordModifyTime).format("YYYY-MM-DD HH:mm:ss")
          : "",
        state,
      };
    });
    return newData;
  };

  public exportRole = (firstRowTitleList, filename = "", type = "") => {
    const { users } = this.state;
    const exportList = (users || []).reduce((t, v, i) => {
      let res = t;
      if (Array.isArray(v.roleName)) {
        const toAddObj = {
          ..._.omit(v, "roleName"),
          index: i + 1,
        };
        res = res.concat(
          v.roleName.length
            ? v.roleName.map((item) => ({
                roleName: item,
                ...toAddObj,
              }))
            : [toAddObj]
        );
      }
      return res;
    }, []);
    const handledExportList = [
      firstRowTitleList,
      ...exportList.map((v) => {
        return [
          _.get(v, "index"),
          _.get(v, "username") || "",
          _.get(v, "nickName") || "",
          _.get(v, "departmentName") || "",
          _.get(v, "userTypeName") || "",
          _.get(v, "contactEmail") || "",
          _.get(v, "roleName") || "",
        ];
      }),
    ];

    const mergeStartKeys = Object.values(
      exportList.reduce((t, v, i) => {
        const key = `${v.username}`;
        if (!(key in t)) {
          // eslint-disable-next-line no-param-reassign
          t[key] = i + 1;
        }
        return t;
      }, {})
    );
    const mergeEndKeys = [...mergeStartKeys, exportList.length + 1]
      .map((v) => v - 1)
      .slice(1);
    const handledMergeKeys = mergeStartKeys.map((v, i) => [v, mergeEndKeys[i]]);

    // ???????????????
    // eslint-disable-next-line no-undef
    if (!XLSX) return;
    const codingCellObj = {} as any;
    handledExportList.forEach((value, r) => {
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
    // ??????H1???????????????
    // codingCellObj.E1.s = hvCenterStyle;

    // ?????????A-F ???6????????????1-dataLen???????????????
    [...Array(6).keys()].forEach((v) => {
      // eslint-disable-next-line no-undef
      const colLetterText = XLSX.utils.encode_col(v);
      mergeStartKeys.forEach((item) => {
        const cloText = `${colLetterText}${item + 1}`;
        codingCellObj[cloText].s = hvCenterStyle;
      });
    });

    // ???????????????????????????,??????["A1", "B1", "C1", "D1", "E1", "F1"]
    const output_pos = Object.keys(codingCellObj);
    const workbook = {
      SheetNames: ["sheet1"], // ????????????????????????
      Sheets: {
        sheet1: Object.assign(
          {},
          codingCellObj, // ???????????????
          {
            "!ref": `${output_pos[0]}:${output_pos[output_pos.length - 1]}`, // ???????????????
          }
        ),
      },
    };
    // ???????????????
    workbook.Sheets.sheet1["!merges"] = [
      // ?????????A-F ???6????????????1-dataLen??????
      ...[...Array(6).keys()].reduce((t, v) => {
        return t.concat(
          handledMergeKeys.map((item) => {
            return {
              s: {
                c: v,
                r: item[0],
              },
              e: {
                c: v,
                r: item[1],
              },
            };
          })
        );
      }, []),
      // ???E???4?????? ??????????????????
    ];

    // ????????????
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
    // ????????????
    const handledType = type || "xlsx";
    let handledFileName = filename || "?????????";
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

  public exportDataPermissions = async (
    firstRowTitleList,
    filename = "",
    type = ""
  ) => {
    const { users = [] } = this.state;
    // ????????????
    let dataPermissionData = await Promise.all(
      users.map((v) =>
        queryUserResourceAuthes({
          userId: v.id,
        })
      )
    );
    dataPermissionData = dataPermissionData.reduce((t, v) => {
      if (!v.error && v.data) {
        const hint = handleChoosed(v.data, null);
        t.push(hint[0] || {});
      }
      return t;
    }, []);

    // ????????????????????????????????????
    const handleLevel = (node, level = 1, fieldName = "children") => {
      return {
        ...node,
        level,
        [fieldName]: node[fieldName]
          ? node[fieldName].map((item) => handleLevel(item, level + 1))
          : null,
      };
    };
    const handledLevelTreeData = dataPermissionData.map((v) => handleLevel(v));
    // ????????????????????????
    const subDataAuth = handledLevelTreeData.map((v) =>
      handleTreeDataToFlatData(v)
    );
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
    const groupedSubDataAuth = subDataAuth.map((v) =>
      groupListByKey(v, "firstName")
    );
    const sortSubDataAuth = (dataAuthObj) => {
      const sortedSubDataAuth = Object.values(dataAuthObj)
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
      return beforeList.concat(afterList);
    };
    // ???firstName???????????????level??????
    const finalSubDataAuth = groupedSubDataAuth.map((v) => sortSubDataAuth(v));

    const exportList = finalSubDataAuth.map((v, i) => {
      const dataSourceItem = users[i];
      const toAddObj = {
        index: i + 1,
        nickName: _.get(dataSourceItem, "nickName"),
        username: _.get(dataSourceItem, "username"),
        departmentName: _.get(dataSourceItem, "departmentName"),
        userTypeName: _.get(dataSourceItem, "userTypeName"),
        contactEmail: _.get(dataSourceItem, "contactEmail"),
      };
      if (!(v && v.length)) {
        return [toAddObj];
      }
      return v.map((item) => {
        return {
          ...item,
          ...toAddObj,
        };
      });
    });

    // ??????????????????
    const handledExportList = [
      firstRowTitleList,
      ...exportList.reduce(
        (t, v) =>
          t.concat(
            v.map((item) => [
              _.get(item, "index"),
              _.get(item, "username") || "",
              _.get(item, "nickName") || "",
              _.get(item, "departmentName") || "",
              _.get(item, "userTypeName") || "",
              _.get(item, "contactEmail") || "",
              _.get(item, "zerothName") || "",
              _.get(item, "firstName") || "",
              _.get(item, "secondName") || "",
              _.get(item, "thirdName") || "",
            ])
          ),
        []
      ),
    ];

    console.log(`handledLevelTreeData`, handledLevelTreeData);
    console.log(`subDataAuth`, subDataAuth);
    console.log(`finalSubDataAuth`, finalSubDataAuth);
    console.log(`exportList`, exportList);
    console.log(`handledExportList`, handledExportList);

    // table??????record??????????????????length
    const exportLengthList = exportList.map((v) => v.length);

    // ??????table??????record????????????????????????firstName??????????????????
    const mergeFirstNameList = exportList.map((v) => {
      return Object.values(
        v.reduce((t, item, i) => {
          const key = `${item.firstName}`;
          if (!(key in t)) {
            // eslint-disable-next-line no-param-reassign
            t[key] = i + 1;
          }
          return t;
        }, {})
      );
    });
    const getNumberByIndex = (index) => {
      if (index === 0) {
        return 0;
      }
      return [...Array(index).keys()].reduce((t, v) => {
        // eslint-disable-next-line no-param-reassign
        t += exportLengthList[v];
        return t;
      }, 0);
    };

    // ????????????table??????record????????????????????????firstName??????????????????(?????????record??????????????? = ?????????record??????????????? + ?????????record???length)
    const mergeFirstNameStartKeys = mergeFirstNameList.map((v, i) =>
      v.map((item: number) => (item ? item + getNumberByIndex(i) : item))
    );
    const getEndKeysByOriginData = (list) =>
      list.map((v, i) => {
        const addedlist = [...v, exportList[i].length + 1].slice(1);
        return addedlist.reduce((t, item) => {
          const res = t as Array<number>;
          res.push(item - 1 + getNumberByIndex(i));
          return res;
        }, []);
      });
    // ????????????table??????record????????????????????????firstName??????????????????(?????????record??????????????? = ?????????record??????????????? + ?????????record???length)
    const mergeFirstNameEndKeys = getEndKeysByOriginData(mergeFirstNameList);

    // ??????table??????record???????????????????????????firstName secondName?????????????????????
    const mergeSecondNameList = exportList.map((v) => {
      return Object.values(
        v.reduce((t, item, i) => {
          // ??????item.secondName?????????????????????, ????????????item.firstName?????????item.secondName???????????????
          const key = `${item.firstName}${item.secondName}`;
          if (!(key in t)) {
            // eslint-disable-next-line no-param-reassign
            t[key] = i + 1;
          }
          return t;
        }, {})
      );
    });

    // ????????????table??????record???????????????????????????firstName secondName?????????????????????(?????????record??????????????? = ?????????record??????????????? + ?????????record???length)
    const mergeSecondNameStartKeys = mergeSecondNameList.map((v, i) =>
      v.map((item: number) => (item ? item + getNumberByIndex(i) : item))
    );
    // ????????????table??????record???????????????????????????firstName secondName?????????????????????(?????????record??????????????? = ?????????record??????????????? + ?????????record???length)
    const mergeSecondNameEndKeys = getEndKeysByOriginData(mergeSecondNameList);

    // ??????table??????record?????????????????????????????????????????????
    const getMergeKeysByStartEndKeys = (start, end) => {
      return start
        .map((v, i) => {
          const mergeEndItem = end[i];
          return v.map((item, index) => [item, mergeEndItem[index]]);
        })
        .reduce((t, v) => t.concat(v), []);
    };
    const handledFirstNameMergeKeys = getMergeKeysByStartEndKeys(
      mergeFirstNameStartKeys,
      mergeFirstNameEndKeys
    );
    const handledSecondNameMergeKeys = getMergeKeysByStartEndKeys(
      mergeSecondNameStartKeys,
      mergeSecondNameEndKeys
    );

    console.log(`exportLengthList`, exportLengthList);
    console.log(`mergeFirstNameList`, mergeFirstNameList);
    console.log(`mergeFirstNameStartKeys`, mergeFirstNameStartKeys);
    console.log(`mergeFirstNameEndKeys`, mergeFirstNameEndKeys);
    console.log("mergeSecondNameList :>> ", mergeSecondNameList);
    console.log("mergeSecondNameStartKeys :>> ", mergeSecondNameStartKeys);
    console.log("mergeSecondNameEndKeys :>> ", mergeSecondNameEndKeys);

    console.log("handledFirstNameMergeKeys :>> ", handledFirstNameMergeKeys);
    console.log("handledSecondNameMergeKeys :>> ", handledSecondNameMergeKeys);
    // ???????????????
    // eslint-disable-next-line no-undef
    if (!XLSX) return;
    const codingCellObj = {};
    handledExportList.forEach((value, r) => {
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
    // ??????G1???????????????(???????????????)
    codingCellObj.G1.s = hvCenterStyle;

    // ????????????table??????record????????????????????????firstName???????????????
    const columnADRowData = mergeFirstNameStartKeys.reduce((t, v) => {
      if (v[0]) {
        t.push(v[0]);
      }
      return t;
    }, []);
    // ?????????A-G ???7????????????1-dataLen???????????????
    console.log("columnADRowData :>> ", columnADRowData);
    [...Array(7).keys()].forEach((v) => {
      // eslint-disable-next-line no-undef
      const colLetterText = XLSX.utils.encode_col(v);
      columnADRowData.forEach((item) => {
        const cloText = `${colLetterText}${item + 1}`;
        codingCellObj[cloText].s = hvCenterStyle;
      });
    });
    // ??????H???7??????????????????????????????????????????????????????
    // ?????????H???7?????? ???????????????????????????
    mergeFirstNameStartKeys
      .reduce((t, v) => t.concat(v), [])
      .forEach((v) => {
        codingCellObj[`H${v + 1}`].s = hvCenterStyle;
      });
    // ?????????I???8?????? ???????????????????????????
    mergeSecondNameStartKeys
      .reduce((t, v) => t.concat(v), [])
      .forEach((v) => {
        codingCellObj[`I${v + 1}`].s = hvCenterStyle;
      });

    // ???????????????????????????,??????["A1", "B1", "C1", "D1", "E1", "F1"]
    const output_pos = Object.keys(codingCellObj);
    const workbook = {
      SheetNames: ["sheet1"], // ????????????????????????
      Sheets: {
        sheet1: Object.assign(
          {},
          codingCellObj, // ???????????????
          {
            "!ref": `${output_pos[0]}:${output_pos[output_pos.length - 1]}`, // ???????????????
          }
        ),
      },
    };
    // ???????????????
    // ????????????table??????record????????????????????????firstName??????????????????, ???????????????
    const columnADRowMergeData = mergeFirstNameStartKeys.reduce((t, v, i) => {
      if (v[0]) {
        const endLastIndex = mergeFirstNameEndKeys[i].length - 1;
        t.push([v[0], mergeFirstNameEndKeys[i][endLastIndex]]);
      }
      return t;
    }, []);
    console.log("columnADRowMergeData :>> ", columnADRowMergeData);
    workbook.Sheets.sheet1["!merges"] = [
      {
        // ???1?????? ???GHIJ???6789????????????
        s: {
          c: 6,
          r: 0,
        },
        e: {
          c: 9,
          r: 0,
        },
      },
      // ?????????A-G ???7????????????1-dataLen??????
      // ??????excel???table??????Record??????????????????????????????
      ...[...Array(7).keys()].reduce((t, v) => {
        return t.concat(
          columnADRowMergeData.map((item) => {
            return {
              s: {
                c: v,
                r: item[0],
              },
              e: {
                c: v,
                r: item[1],
              },
            };
          })
        );
      }, []),
      // ???H???7?????? ??????????????????
      ...handledFirstNameMergeKeys.map((v) => {
        return {
          s: {
            c: 7,
            r: v[0],
          },
          e: {
            c: 7,
            r: v[1],
          },
        };
      }),
      // ???I???8?????? ??????????????????
      ...handledSecondNameMergeKeys.map((v) => {
        return {
          s: {
            c: 8,
            r: v[0],
          },
          e: {
            c: 8,
            r: v[1],
          },
        };
      }),
    ];

    // ????????????
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
    // ????????????
    const handledType = type || "xlsx";
    let handledFileName = filename || "?????????";
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

  public render() {
    const {
      displayResources,
      choosedUser,
      users,
      loading,
      modalVisible,
      formData,
      confirmLoading,
    } = this.state;

    return (
      <Page>
        {!displayResources && (
          <>
            <Row
              type="flex"
              justify="start"
              style={{ marginBottom: VERTICAL_GUTTER }}
            >
              <Col>
                <Button type="primary" onClick={this.showModal}>
                  ????????????
                </Button>
              </Col>
              <Col>
                <DownloadExcelButton
                  style={{ margin: "0px 10px" }}
                  key="export"
                  type="primary"
                  data={{
                    dataSource: users,
                    cols: ExportTableColDefs,
                    name: "????????????",
                    colSwitch: [],
                    handleDataSource: this.handleDataSource,
                  }}
                >
                  ??????Excel
                </DownloadExcelButton>
              </Col>
              <Col>
                <Button
                  type="primary"
                  onClick={() =>
                    this.exportRole(ROLE_FIRST_ROW_TITLE_LIST, "?????? - ??????")
                  }
                >
                  ????????????
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  onClick={() =>
                    this.exportDataPermissions(
                      DATA_PERMISSIONS_FIRST_ROW_TITLE_LIST,
                      "?????? - ????????????"
                    )
                  }
                  style={{
                    marginLeft: 10,
                  }}
                >
                  ??????????????????
                </Button>
              </Col>
            </Row>
            <SmartTable
              loading={loading}
              rowKey={this.rowKey}
              dataSource={users}
              columns={createPageTableColDefs(
                this.state.roleOptions,
                this.showResources,
                departmentsTreeData(this.state.departments),
                this.fetchData
              )}
              scroll={{ x: 1800 }}
              onCellFieldsChange={this.handleCellValueChanged}
              onCellEditingChanged={this.handleValueChanged}
            />
          </>
        )}
        {displayResources && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 0,
                marginBottom: 10,
                paddingBottom: 10,
                borderBottomWidth: 1,
                borderBottomStyle: "solid",
                borderBottomColor: "#e5e5e5",
              }}
            >
              <h2>
                ?????????
                <span style={{ color: "#08c" }}>
                  {choosedUser.username}
                </span>{" "}
                ??????????????????
              </h2>
              <Button type="primary" onClick={this.hideResource}>
                ??????????????????
              </Button>
            </div>
            <ResourceManagement info={{ type: "user", detail: choosedUser }} />
          </div>
        )}
        <Modal
          title="????????????"
          visible={modalVisible}
          onCancel={this.showModal}
          onOk={this.onCreate}
          width={600}
          confirmLoading={confirmLoading}
        >
          <Form2
            ref={(node) => {
              this.$form = node;
            }}
            dataSource={formData}
            onFieldsChange={this.handleFieldsChangeCreate}
            footer={false}
            columns={CREATE_FORM_CONTROLS(
              departmentsTreeData(this.state.departments),
              this.state.roleOptions
            )}
          />
        </Modal>
      </Page>
    );
  }
}

export default SystemSettingsUsers;
