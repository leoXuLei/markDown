import React, { memo, useState } from "react";
import { Button, Row, Col, Radio, Tooltip } from "@com/sun";
import { ChartContainer } from "@/blocks/teams/style";
import { EachEndInputPie } from "./input-pie";
import EachEndInputModal from "./input-modal";
import { IRadioType, INPUT_TIP_LIST } from "./config";
import { QuestionCircleOutlined } from "@ant-design/icons";

interface IEachEndInputProps {
  data: IEndPointCostResourceOverview;
  loading: boolean;
  title: string;
  isFunctionTeam: boolean;
}

export const EachEndInput = memo((props: IEachEndInputProps) => {
  const { data, loading, title, isFunctionTeam } = props;

  const [radioType, setRadioType] = useState<IRadioType>("all");
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const onRadioGroupChange = (e) => {
    const value = e?.target?.value;
    setRadioType(value);
  };

  return (
    <React.Fragment>
      <Col span={24} style={{ paddingLeft: 8, paddingRight: 8 }}>
        <ChartContainer>
          <div className="card-header">
            <div className="title-header">
              <div className="title">
                <span className="name">{title}</span>
                <Tooltip
                  placement="right"
                  overlayStyle={{ width: 520, maxWidth: 520 }}
                  title={INPUT_TIP_LIST?.map((v) => {
                    if (typeof v === "string") {
                      return <div key={v}>{v}</div>;
                    }
                    if (Array.isArray(v)) {
                      return v?.map((item) => (
                        <div key={item} style={{ textIndent: 10 }}>
                          {item}
                        </div>
                      ));
                    }
                    return null;
                  })}
                >
                  <QuestionCircleOutlined />
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="card-body" style={{ height: "auto" }}>
            <div className="chart-body">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Radio.Group
                  onChange={onRadioGroupChange}
                  value={radioType}
                  style={{
                    marginLeft: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <Radio.Button value="all">全部</Radio.Button>
                  <Radio.Button value="self">
                    {isFunctionTeam ? "本团队" : "本业务线"}
                  </Radio.Button>
                  <Radio.Button value="other">其它</Radio.Button>
                </Radio.Group>
                <Button onClick={() => setModalVisible(true)}>查看全部</Button>
              </div>
              <Row>
                <Col span={12}>
                  <EachEndInputPie
                    loading={loading}
                    data={data}
                    radioType={radioType}
                    inputViewType="staff"
                  />
                </Col>
                <Col span={12}>
                  <EachEndInputPie
                    loading={loading}
                    data={data}
                    radioType={radioType}
                    inputViewType="workDays"
                  />
                </Col>
              </Row>
            </div>
          </div>
        </ChartContainer>
      </Col>

      <EachEndInputModal
        visible={modalVisible}
        data={data}
        loading={loading}
        radioType={radioType}
        onClose={() => setModalVisible(false)}
      />
    </React.Fragment>
  );
});
