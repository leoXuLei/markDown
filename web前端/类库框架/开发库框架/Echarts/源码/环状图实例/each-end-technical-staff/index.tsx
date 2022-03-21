import React, { memo, useState } from "react";
import { Button, Col, Tooltip } from "antd";
import { ChartContainer } from "@/blocks/teams/style";
import { EachEndTechnicalStaffPie } from "../each-end-technical-staff/input-pie";
import EachEndInputModal from "./input-modal";
import { INPUT_TIP_LIST } from "../each-end-technical-staff/config";
import { QuestionCircleOutlined } from "@ant-design/icons";

interface IEachEndTechnicalStaffProps {
  data: IEndPointCostResourceOverview;
  loading: boolean;
  title: string;
}

export const EachEndTechnicalStaff = memo(
  (props: IEachEndTechnicalStaffProps) => {
    const { data, loading, title } = props;

    const [modalVisible, setModalVisible] = useState<boolean>(false);

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
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button onClick={() => setModalVisible(true)}>
                    查看全部
                  </Button>
                </div>
                <EachEndTechnicalStaffPie loading={loading} data={data} />
              </div>
            </div>
          </ChartContainer>
        </Col>

        <EachEndInputModal
          visible={modalVisible}
          data={data}
          loading={loading}
          onClose={() => setModalVisible(false)}
        />
      </React.Fragment>
    );
  }
);
