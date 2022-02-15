import React, { memo, useState, useEffect, useCallback } from "react";
import { Modal, Table, Input } from "@com/sun";
import { ModalTitleContainer } from "client/blocks/resource/style";
import { sprintIntervalWorkloadColumns } from "./config";
import ReportExcelButton from "@/blocks/resource/components/report-excel-button";
import styled from "@emotion/styled";

const SearchContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
`;

interface IEachEndInputModalProps {
  loading?: boolean;
  data: IEndPointCostResourceOverview;
  visible: boolean;
  onClose: () => void;
}

const EachEndInputModal = memo<IEachEndInputModalProps>((props) => {
  const { data, loading, visible, onClose } = props;
  const [searchVal, setSearchVal] = useState("");
  const [tableDataSource, setTableDataSource] = useState<
    IEndpointStaffCostResourceItem[] | []
  >([]);

  const handleDataSource = useCallback(
    (list = data?.["totalEndpointStaffCostResourceList"]) => {
      if (!list) {
        return;
      }
      setTableDataSource(list);
    },
    [data]
  );

  useEffect(() => {
    handleDataSource();
  }, [handleDataSource]);

  const handleInputSearch = useCallback(() => {
    handleDataSource(
      searchVal
        ? data?.["totalEndpointStaffCostResourceList"]?.filter((item) => {
            return item?.staffName?.includes(searchVal || "");
          })
        : undefined
    );
  }, [searchVal, data, handleDataSource]);

  return (
    <Modal
      destroyOnClose
      footer={null}
      visible={visible}
      onCancel={onClose}
      title={
        <ModalTitleContainer className="modal-title">
          <span>各端投入情况</span>
          <ReportExcelButton chartName="sprint_staff_endpoint" />
        </ModalTitleContainer>
      }
      width={1200}
    >
      <SearchContainer>
        <Input.Search
          style={{ width: 200 }}
          value={searchVal}
          placeholder="请输入人员名称"
          onChange={(e) => setSearchVal(e.target.value)}
          loading={loading}
          allowClear
          onSearch={handleInputSearch}
        />
      </SearchContainer>

      <Table
        scroll={{
          y: 500,
        }}
        rowKey={"staffId"}
        loading={loading}
        dataSource={tableDataSource}
        columns={sprintIntervalWorkloadColumns}
      />
    </Modal>
  );
});

export default EachEndInputModal;
