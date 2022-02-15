import { Button, Col, message, Modal, notification, Row } from 'antd';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import moment from 'moment';
import { VERTICAL_GUTTER, LETTERS } from '@/constants/global';
import { Form2, SmartTable, Table2 } from '@/components';
import Page from '@/components/Page';
import { queryAuthDepartmentList } from '@/services/department';
import DownloadExcelButton from '@/components/DownloadExcelButton';
import { authRolesList } from '@/services/role';
import { authUserList, createUser, updateUserRole, login } from '@/services/user';
import { handleChoosed } from '@/pages/SystemSettingResource/utils';
import { getUser, setUser } from '@/utils/authority';
import { queryUserResourceAuthes } from '@/services/resources';
import { handleTreeDataToFlatData } from '@/utils/dataPermissionExport';
import ResourceManagement from '../SystemSettingResource/ResourceManage';
import { CREATE_FORM_CONTROLS } from './tools';
import { createPageTableColDefs, ExportTableColDefs } from './services';
import { ROLE_FIRST_ROW_TITLE_LIST, getDataPermissionsFirstRowTitleList } from './constants';

function findDepartment(departs, departId) {
  let hint = {};
  function inner(d) {
    if (d.id === departId) {
      hint = d;
      return;
    }
    const { children } = d;
    if (children && children.length > 0) {
      const target = children.find(c => c.id === departId);
      if (target) {
        hint = target;
      } else {
        children.forEach(c => inner(c));
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
        children: params.children.map(item => getChild(item)),
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
  public rowKey = 'id';

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
    const rsps = await Promise.all([authUserList(), authRolesList(), queryAuthDepartmentList({})]);
    this.setState({ loading: false });

    if (rsps.some(item => item.error)) return;

    const [usersRes, rolesRes, departmentsRes] = rsps;
    const departments = departmentsRes.data || {};
    const roles = rolesRes.data || [];
    this.setState({
      departments,
    });
    const users = (usersRes.data || []).map(user => {
      const department = findDepartment(departments, user.departmentId);
      return {
        ...user,
        departmentName: department.departmentName || '',
        userTypeName: user.userType === 'SCRIPT' ? '脚本用户' : '普通用户',
        roles: Form2.createField(
          user.roleName.map(role => {
            const hint = roles.find(item => item.roleName === role);
            return hint && hint.id;
          }),
        ),
      };
    });
    this.setState({
      roleOptions: roles.map(item => {
        return {
          value: item.id,
          label: item.roleName,
        };
      }),
      users: users.sort((a, b) => a.username.localeCompare(b.username)),
    });
  };

  public showModal = () => {
    this.setState(state => ({
      modalVisible: !state.modalVisible,
    }));
  };

  public showResources = rowData => {
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

  public handleCellValueChanged = async params => {
    this.setState(state => ({
      users: state.users.map(item => {
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
    if (!/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^0-9a-zA-Z]).{8,30}/.test(newData.password)) {
      message.error('密码至少一位数字、大小写字母以及其他特殊字符，且不少于8位');
      return;
    }
    if (newData.password !== newData.confirmpassword) {
      message.error('确认密码与密码填写不一致');
      return;
    }
    this.setState({ confirmLoading: true });
    const { error, data } = await createUser(_.omit(newData, 'confirmpassword'));
    this.setState({ confirmLoading: false });
    if (error) {
      message.error('新建失败');
      return;
    }
    message.success('新建成功');
    this.setState({
      modalVisible: false,
      formData: Form2.createFields({ roleIds: [] }),
    });
    this.fetchData();
  };

  public handleFieldsChangeCreate = (props, fields, allFields) => {
    this.setState(state => ({
      formData: {
        ...state.formData,
        ...fields,
      },
    }));
  };

  public handleValueChanged = async params => {
    const { record, rowId } = params;

    const user = this.state.users.find(item => item.id === rowId);
    if (!user) return;

    const res = await updateUserRole({
      userId: user.id,
      roleIds: Form2.getFieldValue(record.roles),
    });
    if (res.error) return;
    const userInfo = getUser();
    if (_.get(res, 'data.username') === _.get(userInfo, 'username')) {
      setUser({
        ...userInfo,
        roles: _.get(res, 'data.roleName'),
      });
    }
    notification.success({
      message: '更新角色成功',
    });
  };

  public handleDataSource = data => {
    const newData = data.map(item => {
      const roles = (Form2.getFieldValue(item.roles) || []).map(iitem => {
        return _.get(
          _.find(this.state.roleOptions, o => o.value === iitem),
          'label',
        );
      });

      let state = '';
      if (!item.locked && !item.expired) {
        state = '正常';
      }
      if (item.locked) {
        state = '锁定';
      }
      if (item.expired) {
        state = '过期';
      }
      return {
        ...item,
        roles: (roles || []).join(','),
        lastLoginTime: item.lastLoginTime
          ? moment(item.lastLoginTime).format('YYYY-MM-DD HH:mm:ss')
          : '',
        lockedTime: item.lockedTime ? moment(item.lockedTime).format('YYYY-MM-DD HH:mm:ss') : '',
        passwordModifyTime: item.passwordModifyTime
          ? moment(item.passwordModifyTime).format('YYYY-MM-DD HH:mm:ss')
          : '',
        state,
      };
    });
    return newData;
  };

  public exportRole = (firstRowTitleList, filename = '', type = '') => {
    const { users } = this.state;
    const exportList = (users || []).reduce((t, v, i) => {
      let res = t;
      if (Array.isArray(v.roleName)) {
        const toAddObj = {
          ..._.omit(v, 'roleName'),
          index: i + 1,
        };
        res = res.concat(
          v.roleName.length
            ? v.roleName.map(item => ({
                roleName: item,
                ...toAddObj,
              }))
            : [toAddObj],
        );
      }
      return res;
    }, []);
    const handlEdexportList = [
      firstRowTitleList,
      ...exportList.map(v => {
        return [
          _.get(v, 'index'),
          _.get(v, 'username') || '',
          _.get(v, 'nickName') || '',
          _.get(v, 'departmentName') || '',
          _.get(v, 'userTypeName') || '',
          _.get(v, 'contactEmail') || '',
          _.get(v, 'roleName') || '',
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
      }, {}),
    );
    const mergeEndKeys = [...mergeStartKeys, exportList.length + 1].map(v => v - 1).slice(1);
    const handledMergeKeys = mergeStartKeys.map((v, i) => [v, mergeEndKeys[i]]);

    // 编码单元格
    // eslint-disable-next-line no-undef
    if (!XLSX) return;
    const codingCellObj = {} as any;
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
        horizontal: 'center',
        vertical: 'center',
      },
    };
    // 设置H1单元格样式
    // codingCellObj.E1.s = hvCenterStyle;

    // 设置【A-F 共6】列的【1-dataLen】行的样式
    [...Array(6).keys()].forEach(v => {
      // eslint-disable-next-line no-undef
      const colLetterText = XLSX.utils.encode_col(v);
      mergeStartKeys.forEach(item => {
        const cloText = `${colLetterText}${item + 1}`;
        codingCellObj[cloText].s = hvCenterStyle;
      });
    });

    // 获取所有单元格编码,比如["A1", "B1", "C1", "D1", "E1", "F1"]
    const output_pos = Object.keys(codingCellObj);
    const workbook = {
      SheetNames: ['sheet1'], // 保存工作表的名称
      Sheets: {
        sheet1: Object.assign(
          {},
          codingCellObj, // 单元格内容
          {
            '!ref': `${output_pos[0]}:${output_pos[output_pos.length - 1]}`, // 工作表范围
          },
        ),
      },
    };
    // 合并单元格
    workbook.Sheets.sheet1['!merges'] = [
      // 合并【A-F 共6】列的【1-dataLen】行
      ...[...Array(6).keys()].reduce((t, v) => {
        return t.concat(
          handledMergeKeys.map(item => {
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
          }),
        );
      }, []),
      // 【E：4】列 多个多行合并
    ];

    // 设置列宽
    workbook.Sheets.sheet1['!cols'] = [
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
    const handledType = type || 'xlsx';
    let handledFileName = filename || '文件名';
    handledFileName += `.${handledType}`;
    const wopts = {
      bookType: type,
      type: 'binary',
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
      type: 'application/octet-stream',
    });
    function saveAs(obj, fileName) {
      const link = document.createElement('a');
      link.download = fileName;
      link.href = URL.createObjectURL(obj);
      link.click();
      URL.revokeObjectURL(obj);
    }
    saveAs(blob, handledFileName);
  };

  public exportDataPermissions = async () => {
    const { users } = this.state;
    const DATA_PERMISSION_COLUMN_START_INDEX = 7;
    const FIRST_ROW_DATA_PERMISSION_COLUMN_KEY = 'G1';
    const filename = '用户 - 数据权限';

    // 接口数据
    let dataPermissionData = await Promise.all(
      users.map(v =>
        queryUserResourceAuthes({
          userId: v.id,
        }),
      ),
    );
    dataPermissionData = dataPermissionData.reduce((t, v) => {
      if (!v.error && v.data) {
        const hint = handleChoosed(v.data, null);
        t.push(hint[0] || {});
      }
      return t;
    }, []) as any;

    // 树形数据每层加个层级标识
    const handleLevel = (node, level = 1, fieldName = 'children') => {
      return {
        ...node,
        level,
        [fieldName]: node[fieldName]
          ? node[fieldName].map(item => handleLevel(item, level + 1))
          : null,
      };
    };
    const handledLevelTreeData = dataPermissionData.map(v => handleLevel(v));

    // 树形数据转为平层
    const subDataAuth = handledLevelTreeData.map(v => handleTreeDataToFlatData(v));
    // 数据权限列的数量
    const dataPermissionColumnLen = subDataAuth.reduce((t, v) => {
      const recordMaxLevel = v.reduce((tt, item) => {
        if (item.level > tt) {
          return item.level;
        }
        return tt;
      }, 0);
      if (recordMaxLevel > t) {
        return recordMaxLevel;
      }
      return t;
    }, 0);
    // 数据权限列每列对应的key
    const dataPermissionColumnKeys = [...Array(dataPermissionColumnLen + 1).keys()]
      .map(v => `${v}_name`)
      .slice(1);
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
    const groupedSubDataAuth = subDataAuth.map(v => groupListByKey(v, '1_name'));
    const sortSubDataAuth = dataAuthObj => {
      const sortedSubDataAuth = Object.values(dataAuthObj)
        .map(v => {
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
    // 从1_name列开始按照level排序
    const finalSubDataAuth = groupedSubDataAuth.map(v => sortSubDataAuth(v));

    const exportList = finalSubDataAuth.map((v, i) => {
      const dataSourceItem = users[i];
      const toAddObj = {
        index: i + 1,
        nickName: _.get(dataSourceItem, 'nickName'),
        username: _.get(dataSourceItem, 'username'),
        departmentName: _.get(dataSourceItem, 'departmentName'),
        userTypeName: _.get(dataSourceItem, 'userTypeName'),
        contactEmail: _.get(dataSourceItem, 'contactEmail'),
      };
      if (!(v && v.length)) {
        return [toAddObj];
      }
      return v.map(item => {
        return {
          ...item,
          ...toAddObj,
        };
      });
    });

    const handledExportList = [
      getDataPermissionsFirstRowTitleList(dataPermissionColumnLen),
      ...exportList.reduce(
        (t, v) =>
          t.concat(
            v.map(item => [
              _.get(item, 'index'),
              _.get(item, 'username') || '',
              _.get(item, 'nickName') || '',
              _.get(item, 'departmentName') || '',
              _.get(item, 'userTypeName') || '',
              _.get(item, 'contactEmail') || '',
              ...Object.values(
                _.pick(
                  item,
                  Object.keys(item).filter(keyItem => keyItem && keyItem.includes('_name')),
                ),
              ).map(nameitem => nameitem || ''),
            ]),
          ),
        [],
      ),
    ];

    // table每条record的权限数据的length
    const exportLengthList = exportList.map(v => v.length);

    // 处理各种行列合并数据
    const getFinalMergeData = () => {
      const getNumberByIndex = index => {
        if (index === 0) {
          return 0;
        }
        return [...Array(index).keys()].reduce((t, v) => {
          // eslint-disable-next-line no-param-reassign
          t += exportLengthList[v];
          return t;
        }, 0);
      };
      // 根据key获取table每条record的权限数据的对应的每类value的原始起始下标
      const getMergeOriginKeysByKey = (key, index) =>
        exportList.map(v => {
          return Object.values(
            v.reduce((t, item, i) => {
              const itemKey = dataPermissionColumnKeys
                .slice(0, index + 1)
                .map(iitem => `${item[iitem]}`)
                .join('-');
              if (!(itemKey in t)) {
                // eslint-disable-next-line no-param-reassign
                t[itemKey] = i + 1;
              }
              return t;
            }, {}),
          );
        });

      const getEndKeysByOriginData = list =>
        list.map((v, i) => {
          const addedlist = [...v, exportList[i].length + 1].slice(1);
          return addedlist.reduce((t, item) => {
            const res = t as Array<number>;
            res.push(item - 1 + getNumberByIndex(i));
            return res;
          }, []);
        });

      // table每条record的权限数据的每类 数据权限列对应的属性值的原始起始下标
      const mergeOriginKeys = dataPermissionColumnKeys.map((v, i) => getMergeOriginKeysByKey(v, i));

      // 整理得到table每条record的权限数据的每类  数据权限列对应的属性值的起始下标(下一个record的起始下标 = 上一个record的起始下标 + 上一个record的length)
      const mergeStartKeys = mergeOriginKeys.map(v =>
        v.map((item, i) => item.map((item: number) => (item ? item + getNumberByIndex(i) : item))),
      );

      // 整理得到table每条record的权限数据的每类  数据权限列对应的属性值的结尾下标(下一个record的结尾下标 = 上一个record的结尾下标 + 上一个record的length)
      const mergeEndKeys = mergeOriginKeys.map(v => getEndKeysByOriginData(v));

      // 获取数据权限列的行合并数据
      const getMergeKeysByStartEndKeys = (start, end) => {
        return start
          .map((v, i) => {
            const mergeEndItem = end[i];
            return v.map((item, index) => [item, mergeEndItem[index]]);
          })
          .reduce((t, v) => t.concat(v), []);
      };

      const handledPermissionColumnMergeDatas = mergeStartKeys.map((v, i) => {
        return getMergeKeysByStartEndKeys(v, mergeEndKeys[i]);
      });
      return {
        mergeStartKeys,
        mergeEndKeys,
        handledPermissionColumnMergeDatas,
      };
    };
    // ----------------------------------------------------------------------------------------

    const { mergeStartKeys, mergeEndKeys, handledPermissionColumnMergeDatas } = getFinalMergeData();

    // 编码单元格
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
        horizontal: 'center',
        vertical: 'center',
      },
    };
    // 设置第一行【数据权限列】所在单元格样式
    codingCellObj[FIRST_ROW_DATA_PERMISSION_COLUMN_KEY].s = hvCenterStyle;

    // 设置【非数据权限列】的【1-dataLen】行的样式
    const columnAToGRowMergeData = (mergeStartKeys[0] || []).reduce((t, v) => {
      if (v[0]) {
        t.push(v[0]);
      }
      return t;
    }, []);
    [...Array(DATA_PERMISSION_COLUMN_START_INDEX).keys()].forEach(v => {
      // eslint-disable-next-line no-undef
      const colLetterText = XLSX.utils.encode_col(v);
      columnAToGRowMergeData.forEach(item => {
        const cloText = `${colLetterText}${item + 1}`;
        codingCellObj[cloText].s = hvCenterStyle;
      });
    });

    // 设置【数据权限】多列的多行合并的样式(【DATA_PERMISSION_COLUMN_START_INDEX】列开始)
    mergeStartKeys.forEach((v, i) => {
      (v || [])
        .reduce((t, item) => t.concat(item), [])
        .forEach(item => {
          const codeCell =
            codingCellObj[`${LETTERS[i + DATA_PERMISSION_COLUMN_START_INDEX]}${item + 1}`];
          if (codeCell) {
            codeCell.s = hvCenterStyle;
          }
        });
    });

    // 获取所有单元格编码,比如["A1", "B1", "C1", "D1", "E1", "F1"]
    const output_pos = Object.keys(codingCellObj);
    const lastLetters = `${
      LETTERS[dataPermissionColumnLen + DATA_PERMISSION_COLUMN_START_INDEX - 1]
    }`;
    const lastNumber = output_pos
      .map(v => v.slice(1))
      .sort((a, b) => Number(a) - Number(b))
      .pop();
    // 工作表氛围结尾
    const lastRange = `${lastLetters}${lastNumber}`;

    const workbook = {
      SheetNames: ['sheet1'], // 保存工作表的名称
      Sheets: {
        sheet1: Object.assign(
          {},
          codingCellObj, // 单元格内容
          {
            '!ref': `${output_pos[0]}:${lastRange}`, // 工作表范围
          },
        ),
      },
    };
    // 合并单元格
    const columnADRowMergeData = (mergeStartKeys[0] || []).reduce((t, v, i) => {
      if (v[0]) {
        const endLastIndex = (mergeEndKeys[0] || [])[i].length - 1;
        t.push([v[0], mergeEndKeys[0][i][endLastIndex]]);
      }
      return t;
    }, []);
    workbook.Sheets.sheet1['!merges'] = [
      // 第【1】行 【数据权限】多列合并
      {
        s: {
          c: DATA_PERMISSION_COLUMN_START_INDEX - 1,
          r: 0,
        },
        e: {
          c: DATA_PERMISSION_COLUMN_START_INDEX - 1 + dataPermissionColumnLen,
          r: 0,
        },
      },
      // 合并【非数据权限列】的【1-dataLen】行
      ...[...Array(DATA_PERMISSION_COLUMN_START_INDEX).keys()].reduce((t, v) => {
        return t.concat(
          columnADRowMergeData.map(item => {
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
          }),
        );
      }, []),
      // 设置【数据权限】多列的多行合并(【DATA_PERMISSION_COLUMN_START_INDEX】列开始)
      ...handledPermissionColumnMergeDatas.reduce((t, singleItem, i) => {
        const temp = t;
        temp.push(
          ...singleItem.map(v => {
            const c = i + DATA_PERMISSION_COLUMN_START_INDEX;
            return {
              s: {
                c,
                r: v[0],
              },
              e: {
                c,
                r: v[1],
              },
            };
          }),
        );
        return temp;
      }, []),
    ];

    // 设置列宽
    workbook.Sheets.sheet1['!cols'] = [
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
    const handledType = 'xlsx';
    let handledFileName = filename || '文件名';
    handledFileName += `.${handledType}`;
    const wopts = {
      bookType: '',
      type: 'binary',
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
      type: 'application/octet-stream',
    });
    function saveAs(obj, fileName) {
      const link = document.createElement('a');
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
            <Row type="flex" justify="start" style={{ marginBottom: VERTICAL_GUTTER }}>
              <Col>
                <Button type="primary" onClick={this.showModal}>
                  新建用户
                </Button>
              </Col>
              <Col>
                <DownloadExcelButton
                  style={{ margin: '0px 10px' }}
                  key="export"
                  type="primary"
                  data={{
                    dataSource: users,
                    cols: ExportTableColDefs,
                    name: '用户信息',
                    colSwitch: [],
                    handleDataSource: this.handleDataSource,
                  }}
                >
                  导出Excel
                </DownloadExcelButton>
              </Col>
              <Col>
                <Button
                  type="primary"
                  onClick={() => this.exportRole(ROLE_FIRST_ROW_TITLE_LIST, '用户 - 角色')}
                >
                  导出角色
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  onClick={this.exportDataPermissions}
                  style={{
                    marginLeft: 10,
                  }}
                >
                  导出数据权限
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
                this.fetchData,
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
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 0,
                marginBottom: 10,
                paddingBottom: 10,
                borderBottomWidth: 1,
                borderBottomStyle: 'solid',
                borderBottomColor: '#e5e5e5',
              }}
            >
              <h2>
                用户：<span style={{ color: '#08c' }}>{choosedUser.username}</span> 数据权限列表
              </h2>
              <Button type="primary" onClick={this.hideResource}>
                返回用户列表
              </Button>
            </div>
            <ResourceManagement info={{ type: 'user', detail: choosedUser }} />
          </div>
        )}
        <Modal
          title="新建用户"
          visible={modalVisible}
          onCancel={this.showModal}
          onOk={this.onCreate}
          width={600}
          confirmLoading={confirmLoading}
        >
          <Form2
            ref={node => {
              this.$form = node;
            }}
            dataSource={formData}
            onFieldsChange={this.handleFieldsChangeCreate}
            footer={false}
            columns={CREATE_FORM_CONTROLS(
              departmentsTreeData(this.state.departments),
              this.state.roleOptions,
            )}
          />
        </Modal>
      </Page>
    );
  }
}

export default SystemSettingsUsers;
