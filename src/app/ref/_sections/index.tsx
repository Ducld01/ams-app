"use client";

import { Button, Col, Row, Space, Table, TableProps } from "antd";
import { useRouter } from "next/navigation";
import { TFetchRefs } from "../page";
import { Refs } from "@/app/types";
import { CopyOutlined } from "@ant-design/icons";

export const ListRefTable = ({ data }: TFetchRefs) => {
  const router = useRouter();

  const handeCopyRef = async (ref: string) => {
    try {
      await navigator.clipboard.writeText(ref); // Sao chép vào clipboard
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const columns: TableProps<Refs>["columns"] = [
    {
      title: "Mã ref",
      dataIndex: "id",
      key: "code",
    },
    {
      title: "Tên ref",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Link giới thiệu",
      dataIndex: "url",
      key: "link",
    },
    {
      title: "Được tạo vào ngày",
      key: "created_at",
      dataIndex: "created_at",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<CopyOutlined />}
            onClick={() => handeCopyRef(record.url)}
          />
        </Space>
      ),
    },
  ];

  const handleRedirect = () => {
    router.push("/ref/add");
  };
  return (
    <Row>
      <Col>
        <div>
          <Button type="primary" onClick={handleRedirect}>
            Thêm ref mới
          </Button>
          <Table<Refs> columns={columns} dataSource={data} />
        </div>
      </Col>
    </Row>
  );
};
