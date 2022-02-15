import { Modal, HookForm as Form, Input, Button } from "@com/sun";
import { addClassify, updateClassify } from "client/ekko/services/task";
import React, { useCallback, useEffect, useMemo, useState } from "react";

const NewModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  params: {
    projectId: string;
    taskTypeId: string;
  };
  onRefresh: () => void;
  item?: IClassifyType;
  label: string;
}> = (props) => {
  const [hookForm] = Form.useForm();

  const [nameText, setNameText] = useState<any>();

  useEffect(() => {
    setNameText(props.item?.name);
  }, [props.item]);

  const [loading, setLoading] = useState(false);

  const onOk = useCallback(async () => {
    setLoading(true);
    const { name, desc } = await hookForm.validateFields();
    let res: any;
    if (props.item) {
      res = await updateClassify(
        props.params.projectId,
        props.params.taskTypeId,
        props.item.id,
        {
          name,
          desc,
        }
      );
    } else {
      res = await addClassify(props.params.projectId, props.params.taskTypeId, {
        name,
        desc,
      });
    }
    if (res.success) {
      props.onClose();
      props.onRefresh();
      hookForm.resetFields();
    }
    setLoading(false);
  }, [hookForm, props]);

  useEffect(() => {
    if (props.visible) {
      hookForm.resetFields();
    }
  }, [props.visible]);

  const footer = useMemo(
    () => (
      <Button type="primary" disabled={!nameText || loading} onClick={onOk}>
        {props.item ? "保存" : "创建"}
      </Button>
    ),
    [nameText, onOk, props.item, loading]
  );

  return (
    <Modal
      confirmLoading={loading}
      footer={footer}
      visible={props.visible}
      destroyOnClose
      title={props.item ? `编辑${props.label}分类` : `创建${props.label}分类`}
      onCancel={props.onClose}
      onOk={onOk}
    >
      <Form
        onValuesChange={(v) => {
          if (v.name !== undefined) {
            setNameText(v.name);
          }
        }}
        form={hookForm}
        layout="vertical"
      >
        <Form.Item
          initialValue={props.item?.name}
          name="name"
          label="名称"
          rules={[{ required: true, message: "请输入名称" }]}
        >
          <Input placeholder="请输入..." maxLength={20} />
        </Form.Item>
        <Form.Item initialValue={props.item?.desc} name="desc" label="描述">
          <Input.TextArea placeholder="请输入..." rows={3} maxLength={128} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewModal;
