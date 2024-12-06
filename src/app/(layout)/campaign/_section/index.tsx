"use client";

import { Campaign } from "@/app/types";
import { Button, Col, Input, Row, Table, TableProps, Typography } from "antd";
import { TFetchCampaigns } from "../page";
import { useRouter } from "next/navigation";
import { CopyOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const columns: TableProps<Campaign>["columns"] = [
  { title: "mã chiến dịch", dataIndex: "code", key: "code", width: 150 },
  { title: "tên chiến dịch", dataIndex: "name", key: "name", width: 350 },
  {
    title: "mã dự án",
    key: "project_id",
    dataIndex: "project_id",
    render: (text) => (text ? <Typography>{text}</Typography> : "---"),
  },
  {
    title: "script",
    dataIndex: "script",
    key: "script",
    width: 250,
    render: (text) =>
      text ? (
        <div
          style={{
            width: "100%",
            height: 150,
            overflowY: "auto",
            position: "relative",
            border: "1px solid #d9d9d9",
            padding: 8,
            borderRadius: 5,
          }}
        >
          <Button
            type="primary"
            shape="circle"
            icon={<CopyOutlined />}
            size="small"
            style={{ position: "absolute", top: 0, right: 0 }}
            onClick={() => navigator.clipboard.writeText(text)}
          />
          <Typography>{text}</Typography>
        </div>
      ) : (
        "---"
      ),
  },
  { title: "được tạo vào ngày", dataIndex: "created_at", key: "created_at" },
  {
    title: "Action",
    key: "action",
  },
];

export const CampaignList = ({ data }: TFetchCampaigns) => {
  const router = useRouter();
  return (
    <Row>
      <Col span={24}>
        <div style={{ width: "100%" }}>
          <Button type="primary" onClick={() => router.push("/campaign/add")}>
            Thêm dự án mới
          </Button>
          <Table<Campaign>
            columns={columns}
            style={{ width: "100%" }}
            dataSource={data.map((proj) => ({ ...proj, key: proj.id }))}
          />
        </div>
      </Col>
    </Row>
  );
};
