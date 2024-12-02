'use client';

import { Campaign } from "@/app/types";
import { Button, Col, Row, Space, Table, TableProps } from "antd";
import { TFetchCampaigns } from "../page";

const columns: TableProps<Campaign>["columns"] = [
    { title: "mã chiến dịch", dataIndex: "id", key: "code" },
    { title: "tên chiến dịch", dataIndex: "name", key: "name" },
    {
      title: "mã dự án",
      key: "type",
      
    },
    { title: "script", dataIndex: "script", key: "script" },
    { title: "được tạo vào ngày", dataIndex: "created_at", key: "created_at" },
    {
      title: "Action",
      key: "action",
      
    },
  ];

export const CampaignList = ({ data }: TFetchCampaigns) => {

    return (
        <Row>
          <Col>
            <div>
              <Button type="primary" >
                Thêm dự án mới
              </Button>
              <Table<Campaign>
                columns={columns}
                dataSource={data.map((proj) => ({ ...proj, key: proj.id }))}
              />
            </div>
          </Col>
        </Row>
      );
    
}