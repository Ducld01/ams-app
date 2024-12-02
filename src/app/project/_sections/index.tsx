"use client";


import { EyeOutlined } from "@ant-design/icons";
import { Button, Col, Row, Space, Table, TableProps } from "antd";
import { useRouter } from "next/navigation";
import { TFetchProject } from "../page";
import { Project } from "@/app/types";

const columns: TableProps<Project>["columns"] = [
  { title: "mã dự án", dataIndex: "id", key: "code" },
  { title: "tên dự án", dataIndex: "name", key: "name" },
  {
    title: "loại dự án",
    key: "type",
    render: () => "Bọc link và chuyển hướng",
  },
  { title: "trạng thái", dataIndex: "status", key: "status" },
  { title: "được tạo vào ngày", dataIndex: "created_at", key: "created_at" },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <Button
          icon={<EyeOutlined />}
          type="link"
          href={`/project/${record.id}`}
        />
      </Space>
    ),
  },
];

export const ProjectList = ({ data }: TFetchProject) => {
  const router = useRouter();

  const handleAddProject = () => {
    router.push("/project/add");
  };

  return (
    <Row>
      <Col>
        <div>
          <Button type="primary" onClick={handleAddProject}>
            Thêm dự án mới
          </Button>
          <Table<Project>
            columns={columns}
            dataSource={data.map((proj) => ({ ...proj, key: proj.id }))}
          />
        </div>
      </Col>
    </Row>
  );
};
