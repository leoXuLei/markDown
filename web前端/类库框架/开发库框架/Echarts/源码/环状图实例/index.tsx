import React, { memo } from "react";
import { Col } from "@com/sun";
import TeamSprintSaturation from "./team-sprint-saturation";
import FunctionalLinesOverview from "./overview";
import { IOverviewProps } from "@/blocks/resource/sprint/resource-input";
import TrendChartDetail from "client/blocks/efficiency/trend/trend-chart-detail";
import { EachEndInput } from "./each-end-input";
import { EachEndTechnicalStaff } from "./each-end-technical-staff";

const FunctionalLinesResourceInput = memo<IOverviewProps>((props) => {
  const {
    loading,
    overviewTrendData,
    resourceData,
    isFunctionTeam,
    eachEndInputData,
  } = props;

  const inputedDetailData = {
    data: resourceData,
    loading,
  };

  return (
    <>
      <FunctionalLinesOverview {...props} />

      <Col span={8}>
        <EachEndTechnicalStaff
          title="当前各端技术人数"
          data={eachEndInputData}
          loading={loading}
        />
      </Col>
      <Col span={16}>
        <EachEndInput
          title="各端投入占比"
          data={eachEndInputData}
          isFunctionTeam={isFunctionTeam!}
          loading={loading}
        />
      </Col>

      <Col span={24} style={{ paddingLeft: 4, paddingRight: 4 }}>
        <TrendChartDetail
          trendName="资源饱和度(迭代/项目)"
          metricName="saturationMetric"
          loading={loading!}
          overviewData={overviewTrendData!}
          reportExcelButtonProps={{
            statisticMetricType: "SPRINT_RESOURCE_SATURATION",
          }}
        />
      </Col>

      <TeamSprintSaturation {...inputedDetailData} />
    </>
  );
});

export default FunctionalLinesResourceInput;
