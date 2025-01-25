import React, { PureComponent } from "react";
import { debounce } from "lodash";
import classNames from "classnames";
import { Input, Modal, Form, Button, Steps, message } from "@ecsnext/supcond";
import { FormInstance } from "@supcon/supcond2/es/form/Form";
import {
  ACTION_CONFIRM,
  ACTION_CANCEL,
  LABEL_PASSWORD,
  LABEL_USERNAME,
  LABEL_REMARKS,
} from "../../locales/I18nKeys";
import encrypt from "../../utils/encrypt";
import { checkPwd, getUserName } from "../../utils/api";
import "./index.less";

const prefixCls = "ele-sign-modal";

enum ELanguageType {
  zhCN = 1,
  enUS = 2,
}

const OPERATION_REASON = "OperationReason";
const ELECTRONIC_SIGN = "Electronic Sign";
const OPERATION_VERIFICATION = "Operation Identity Verification";
const WAITING = "Waiting";
const IN_PROGRESS = "In Progress";
const FINISHED = "Finished";
const SAME_USER_CANNOT_SIGN_REPEATED = "sameUserCannotSignRepeated";
const SIGN_VERIFICATION_FAILED = "signVerificationFailed";

const zhCNMap = {
  [OPERATION_REASON]: "操作原因",
  [LABEL_REMARKS]: "备注",
  [LABEL_USERNAME]: "用户名",
  [LABEL_PASSWORD]: "密码",
  [ACTION_CONFIRM]: "确认",
  [ACTION_CANCEL]: "取消",
  [ELECTRONIC_SIGN]: "电子签名",
  [OPERATION_VERIFICATION]: "操作身份验证",
  [WAITING]: "等待处理",
  [IN_PROGRESS]: "正在处理",
  [FINISHED]: "已完成",
  [SAME_USER_CANNOT_SIGN_REPEATED]: "同一用户不能重复签名！",
  [SIGN_VERIFICATION_FAILED]: "签名验证失败！",
};

const enUSMap = {
  [OPERATION_REASON]: "Operation Reason",
  [LABEL_REMARKS]: "Remarks",
  [LABEL_USERNAME]: "User Name",
  [LABEL_PASSWORD]: "Password",
  [ACTION_CONFIRM]: "Confirm",
  [ACTION_CANCEL]: "Cancel",
  [ELECTRONIC_SIGN]: ELECTRONIC_SIGN,
  [OPERATION_VERIFICATION]: OPERATION_VERIFICATION,
  [WAITING]: WAITING,
  [IN_PROGRESS]: IN_PROGRESS,
  [FINISHED]: FINISHED,
  [SAME_USER_CANNOT_SIGN_REPEATED]: "The same user cannot sign multiple times!",
  [SIGN_VERIFICATION_FAILED]: "The signature verification failed!",
};

const allLanguageMap = {
  [ELanguageType.zhCN]: zhCNMap,
  [ELanguageType.enUS]: enUSMap,
};

/** 签名验证内容item */
interface IEleSignAuthItem {
  /** 备注 */
  Remark: string;
  /** 用户名 */
  UserName: string;
  /** 密码 */
  Password: string;
}

export interface IVerifyEleSignParams {
  /** 签名层级 */
  ESignLevel: number;
  /** 签名内容 */
  ESignAuth: IEleSignAuthItem[];
}

export interface IEleSignModalParams {
  /** 弹窗类型是否是二次确认 */
  isSecondaryConfirm?: boolean;
  /** 弹窗title，弹窗类型是二次确认时有效 */
  modalTitle?: string;
  /** 签名原因 */
  signReason: string;
  /** 签名层级，1 | 2，弹窗类型是非二次确认时有效 */
  signLevel?: number;
  /** 签名备注是否必填 */
  isRemarksRequired?: boolean;
  /** 操作原因是否必填 */
  isOperationReasonRequired?: boolean;
  /** 中文还是英文环境 */
  isZHCN?: boolean;
}

export type TEleSignParams = Pick<
  IEleSignModalParams,
  "signReason" | "isRemarksRequired"
>;

export type TSecConfirmParams = Pick<
  IEleSignModalParams,
  "modalTitle" | "isOperationReasonRequired"
> & {
  /** 确认内容 */
  confirmContent: string;
};

export interface IEleSignModalProps extends IEleSignModalParams {
  intl?: any;
  modalClassName?: string;
  onOk: (values: any) => void;
  onSignFailed: (err: any) => void;
  onClose: () => void;
}

interface IEleSignModalState {
  modalVisible: boolean;
  verifyIndex: number;
  confirmBtnLoading: boolean;
}

class ElectronicSignModal extends PureComponent<
  IEleSignModalProps,
  IEleSignModalState
> {
  static defaultProps = {
    isSecondaryConfirm: false,
    isOperationReasonRequired: false,
    signLevel: 1,
  };
  formRef: React.RefObject<FormInstance>;
  eleSignAuthDataRef: IEleSignAuthItem[];
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.eleSignAuthDataRef = [];
    this.initEleSignAuthData();
    this.state = {
      modalVisible: true,
      verifyIndex: 1,
      confirmBtnLoading: false,
    };
  }

  componentWillUnmount(): void {
    this.eleSignAuthDataRef = [];
    this.formRef = null;
  }

  private initEleSignAuthData = () => {
    const totalVerifyNumbers = this.props.signLevel;
    this.eleSignAuthDataRef = new Array(totalVerifyNumbers).fill(null);
  };

  // getDerivedStateFromProps(nextProps: IEleSignModalParams, prevState) {
  // }

  // 隐藏弹出框
  hideModal = () => {
    this.setState({
      modalVisible: false,
      verifyIndex: 1,
      confirmBtnLoading: false,
    });
    this.props?.onClose?.();
  };

  // 验证签名接口
  verifyEleSign = (formName: any, values: any, curLanguageMap) => {
    this.eleSignAuthDataRef[formName] = {
      ...values,
    };

    const { UserName, Password, Remark } = values;

    const localUserName = getUserName();

    const userName = UserName || localUserName;

    const operationLog = {
      function: "verify",
      // 操作账号
      user: userName,
      desc: curLanguageMap[ELECTRONIC_SIGN],
      // 审核账号、审核意见
      extend1: { auditUser: UserName, auditConclusion: Remark },
    };
    const verifyParam = {
      password: Password ? encrypt(Password) : "",
      userName,
    };
    this.setState({
      confirmBtnLoading: true,
    });
    const _this = this;

    checkPwd(verifyParam, operationLog)
      .then((response: any) => {
        // 签名验证失败，直接return
        if (response.code !== 0) {
          message.warning(curLanguageMap[SIGN_VERIFICATION_FAILED]);
          // 最后一个签名签完
          // if (Number(formName) === _this.eleSignAuthDataRef.length - 1) {
          //   _this.props?.onSignFailed?.(enUSMap[SIGN_VERIFICATION_FAILED]);
          // }
          return;
        }
        _this.setState((prevState) => {
          return {
            verifyIndex: prevState.verifyIndex + 1,
          };
        });
        // 最后一个签名签完后，回调this.props?.onOk
        if (Number(formName) === _this.eleSignAuthDataRef.length - 1) {
          _this.props?.onOk?.(
            (_this.eleSignAuthDataRef || [])?.map?.((item) => {
              const { Remark, UserName } = item;
              return {
                Remark,
                UserName,
              };
            })
          );
          _this.hideModal();
        }
      })
      .catch((reason) => console.info("checkPwd catch ::> ", reason))
      .finally(() => {
        _this.setState({
          confirmBtnLoading: false,
        });
      });
  };

  // 表单提交
  handleFormFinish = debounce((formName, { values }) => {
    const { isZHCN, isSecondaryConfirm } = this.props;
    const curLanguageKey = isZHCN ? ELanguageType.zhCN : ELanguageType.enUS;
    const curLanguageMap = allLanguageMap[curLanguageKey];

    // 二次确认弹窗直接this.props?.onOk提交
    if (isSecondaryConfirm) {
      this.props?.onOk?.({
        [OPERATION_REASON]: values[OPERATION_REASON],
      });
      this.hideModal();
      return;
    }

    const findRepeatUserIndex = this.eleSignAuthDataRef.findIndex(
      (authDataItem, index) => {
        // 大小写敏感，'Admin'、'admin'、'ADMIN' 等都视作同一用户
        const lowerCasedItemUserName = authDataItem?.UserName?.toLowerCase?.();
        const lowerCasedCurFormUserName = values?.UserName?.toLowerCase?.();

        return (
          lowerCasedItemUserName === lowerCasedCurFormUserName &&
          index !== Number(formName)
        );
      }
    );

    // 同一用户不能重复签名，直接return
    if (findRepeatUserIndex > -1) {
      message.warning(curLanguageMap[SAME_USER_CANNOT_SIGN_REPEATED]);
      return;
    }

    if (Number(formName) < this.eleSignAuthDataRef.length) {
      this.verifyEleSign(formName, values, curLanguageMap);
    }
  }, 300);

  renderFormEles = (curLanguageMap) => {
    const {
      intl,
      isRemarksRequired,
      isSecondaryConfirm,
      isOperationReasonRequired,
    } = this.props;
    const { verifyIndex, confirmBtnLoading } = this.state;

    const formItemEles = this.eleSignAuthDataRef.map((_, index, array) => {
      const curIndex = index + 1;

      return (
        <Form
          className={classNames(`${prefixCls}-form-item`, {
            [`${prefixCls}-form-item-disabled`]: curIndex !== verifyIndex,
          })}
          layout="vertical"
          key={curIndex}
          name={`${index}`}
          preserve={false}
          ref={curIndex === verifyIndex ? this.formRef : null}
          disabled={curIndex !== verifyIndex}
        >
          <div className={`${prefixCls}-form-item-box`}>
            <Form.Item
              name={isSecondaryConfirm ? OPERATION_REASON : "Remark"}
              className={`${prefixCls}-form-item-textarea`}
              markPlacement="right"
              label={
                curLanguageMap[
                  isSecondaryConfirm ? OPERATION_REASON : LABEL_REMARKS
                ]
              }
              // label={intl?.formatMessage?.({
              //   id: LABEL_REMARKS,
              // })}
              rules={[
                {
                  required: isSecondaryConfirm
                    ? isOperationReasonRequired
                    : isRemarksRequired,
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
            {!isSecondaryConfirm && (
              <>
                <div className={`${prefixCls}-split`} />
                <div className={`${prefixCls}-form-item-auth-title`}>
                  {curLanguageMap[OPERATION_VERIFICATION]}
                </div>
                <Form.Item
                  name="UserName"
                  className={`${prefixCls}-form-item-username`}
                  markPlacement="right"
                  label={curLanguageMap[LABEL_USERNAME]}
                  // label={intl?.formatMessage?.({
                  //   id: LABEL_USERNAME,
                  // })}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input autoComplete="new-password" />
                </Form.Item>
                <Form.Item
                  name="Password"
                  className={`${prefixCls}-form-item-password`}
                  markPlacement="right"
                  label={curLanguageMap[LABEL_PASSWORD]}
                  // label={intl?.formatMessage?.({
                  //   id: LABEL_PASSWORD,
                  // })}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input autoComplete="new-password" type="password" />
                </Form.Item>
              </>
            )}
            <div className={`${prefixCls}-form-item-footer-wrapper`}>
              <div
                className={classNames(`${prefixCls}-form-item-footer`, {
                  [`${prefixCls}-single-form-item-footer`]:
                    array.length === 1 || isSecondaryConfirm,
                })}
              >
                <Button onClick={this.hideModal}>
                  {/* {intl?.formatMessage?.({
                    id: ACTION_CANCEL,
                  })} */}
                  {curLanguageMap[ACTION_CANCEL]}
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={verifyIndex === curIndex ? confirmBtnLoading : false}
                >
                  {/* {intl?.formatMessage?.({
                    id: ACTION_CONFIRM,
                  })} */}
                  {curLanguageMap[ACTION_CONFIRM]}
                </Button>
              </div>
            </div>
          </div>
        </Form>
      );
    });
    // 二次确认只有一个Form
    return isSecondaryConfirm ? formItemEles.slice(0, 1) : formItemEles;
  };

  render() {
    const { modalVisible, verifyIndex } = this.state;
    const { modalTitle, signLevel, signReason, isSecondaryConfirm, isZHCN } =
      this.props;

    const curLanguageKey = isZHCN ? ELanguageType.zhCN : ELanguageType.enUS;
    const curLanguageMap = allLanguageMap[curLanguageKey];

    const formItemEles = this.renderFormEles(curLanguageMap);
    return (
      <Modal
        title={
          isSecondaryConfirm
            ? modalTitle || curLanguageMap[ELECTRONIC_SIGN]
            : curLanguageMap[ELECTRONIC_SIGN]
        }
        wrapClassName={`${prefixCls} ${this.props?.modalClassName || ""}`}
        open={modalVisible}
        width={signLevel === 1 || isSecondaryConfirm ? 332 : signLevel * 380}
        onCancel={this.hideModal}
        centered
        destroyOnClose={true}
        maskClosable={false}
        footer={<div className={`${prefixCls}-footer`} />}
      >
        <div className={`${prefixCls}-container`}>
          <div className={`${prefixCls}-reason`}>{signReason}</div>
          <div className={`${prefixCls}-split`} />
          <Form.Provider onFormFinish={this.handleFormFinish}>
            <div className={`${prefixCls}-auth-box`}>
              {!isSecondaryConfirm && formItemEles.length > 1 ? (
                <Steps
                  current={1}
                  items={formItemEles.map((formEleItem, index) => {
                    const curIndex = index + 1;
                    const title =
                      verifyIndex > curIndex
                        ? curLanguageMap[FINISHED]
                        : curIndex === verifyIndex
                        ? curLanguageMap[IN_PROGRESS]
                        : curLanguageMap[WAITING];
                    const status =
                      verifyIndex > curIndex
                        ? "finish"
                        : curIndex === verifyIndex
                        ? "process"
                        : "wait";
                    return {
                      title,
                      status,
                      description: formEleItem,
                    };
                  })}
                />
              ) : (
                formItemEles
              )}
            </div>
          </Form.Provider>
        </div>
      </Modal>
    );
  }
}

// export default injectIntl(ElectronicSignModal);
export default ElectronicSignModal;
