"use client";

import { Project } from "@/app/types";
import { DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  FormProps,
  GetRef,
  Input,
  Row,
  Space,
  Switch,
  Table,
  TableProps,
  Typography,
} from "antd";
import { createContext, useState } from "react";

type redirectProfilesItem = {
  active: boolean;
  probability: number;
  offerId: string;
  redirectProfileName: string;
  url: string;
  key: string;
  redirectConditions: {
    valueCondition: string;
  }[];
};

type campaignItem = {
  key: string;
  name: string;
  status: string;
  created_at: string;
  time_zone: string;
  script: string;
  project_id: string;
  id: string;
  isNew?: boolean;
};

interface DataType {
  key: string;
  name: string;
  code: string;
  type: string;
  status: string;
  redirectProfiles: redirectProfilesItem[];
  campaign: campaignItem[];
}

const cls: TableProps<redirectProfilesItem>["columns"] = [
  {
    title: "Số thứ tự",
    key: "stt",
    width: 100,
    align: "center",
    render: (_row, _record, index) => index + 1,
  },
  {
    title: "Tên ref",
    dataIndex: "redirectProfileName",
    key: "redirectProfileName",
    width: 200,
    render: (text) => <Input value={text} disabled />,
  },
  {
    title: "Mã ref",
    dataIndex: "offerId",
    key: "offerId",
    align: "center",
    width: 150,
    render: (text) => <Input value={text} disabled />,
  },
  {
    title: "Link ref",
    dataIndex: "url",
    key: "url",
    width: "auto",
    render: (text) => <Input value={text} disabled />,
  },
  {
    title: "Xác suất",
    dataIndex: "probability",
    key: "probability",
    align: "center",
    width: 150,
    render: (text) => <Input value={`${text}%`} disabled />,
  },
  {
    title: "Điều kiện",
    dataIndex: "redirectConditions",
    key: "redirectConditions",
    render: (value) => <Switch checked={value.length > 0} disabled />,
  },
  {
    title: "Hoạt động",
    dataIndex: "active",
    key: "active",
    render: (value) => <Switch checked={value} disabled />,
  },
  {
    title: "Action",
    key: "action",
    render: () => (
      <Space size="middle">
        <Button icon={<DeleteOutlined />} type="link" />
      </Space>
    ),
  },
];

type FormInstance<T> = GetRef<typeof Form<T>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EditableContext = createContext<FormInstance<any> | null>(null);

const mockData: DataType = {
  key: "1",
  name: "Link Bọc Chiến Dịch Tháng 12",
  code: "LC-DEC2024",
  type: "Campaign",
  status: "Active",
  redirectProfiles: [
    {
      key: "1",
      active: true,
      probability: 70,
      offerId: "OFF-12345",
      redirectProfileName: "Redirect VN",
      url: "https://example.com/vn-product",
      redirectConditions: [],
    },
    {
      key: "2",
      active: false,
      probability: 30,
      offerId: "OFF-67890",
      redirectProfileName: "Redirect US",
      url: "https://example.com/us-producthgghvhgvhgvhgv",
      redirectConditions: [{ valueCondition: "US" }],
    },
  ],
  campaign: [
    {
      key: "1",
      name: "Chiến Dịch Quảng Cáo Tháng 12",
      status: "Running",
      created_at: "2024-12-01T10:00:00Z",
      time_zone: "Asia/Ho_Chi_Minh",
      script:
        'const BASE_URL = "https://authoritysitemaster.com/wp-json/api/v2/campaign/script/";\nconst TOKEN = "507463572f374b4b5742502b6873416f6f4d574248664577523737433631776e48704c46663767746d7a4f725a734d4133356947423937766b51452f565646675931306232636f504c576132325a4350536b464841444f6b4b6e5952644a74635338437371375a7263616b37347566564d464c75495442734c446763766157506e41343534504461665a73724c724e75516d31476e7a42787a32417a742f506e68394549483733793145665238335644504f583131422f39656533754b414252";\nfunction main() {\n    eval(JSON.parse(UrlFetchApp.fetch(BASE_URL + TOKEN).getContentText()));\n}',
      project_id: "PROJ-98765",
      id: "CMP-54321",
    },
  ],
};
export const ProjectDetailForm = ({ data }: { data: Project }) => {
  const [defaultData, setDefaultData] = useState<DataType>(mockData);
  

  const handleAdd = () => {
    setDefaultData((prevData) => ({
      ...prevData,
      campaign: [
        {
          key: `${prevData.campaign.length + 1}`,
          name: "",
          status: "",
          created_at: "",
          time_zone: "",
          script: "",
          project_id: "",
          id: "",
          isNew: true,
        },
        ...prevData.campaign,
      ],
    }));
  };
  const campaignColumns: TableProps<campaignItem>["columns"] = [
    {
      title: "Tên chiến dịch",
      dataIndex: "name",
      key: "name",
      render: (value, record) =>
        record.isNew ? (
          <Form.Item<campaignItem>
            label="name"
            name="name"
            rules={[
              { required: true, message: "Please input campaigns name!" },
            ]}
          >
            <Input />
          </Form.Item>
        ) : (
          value
        ),
    },
    {
      title: "Mã chiến dịch",
      dataIndex: "id",
      key: "id",
      render: (value, record) =>
        record.isNew ? (
          <Form.Item<campaignItem>
            label="id"
            name="id"
            rules={[{ required: true, message: "Please input campaigns id!" }]}
          >
            <Input />
          </Form.Item>
        ) : (
          value
        ),
    },
    {
      title: "Được tạo vào ngày",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Kịch bản",
      dataIndex: "script",
      key: "script",
      render: (text, record) =>
        record.isNew ? (
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        ) : (
          <Input
            readOnly={true}
            value={text}
            suffix={
              <Typography.Paragraph
                copyable={{ text }}
                style={{ margin: 0 }}
              ></Typography.Paragraph>
            }
          />
        ),
    },
  ];
  return (
    <Card title={data.name}>
      <Form
        layout="vertical"
        id="form-detail"
        initialValues={{
          name: data.name,
          status: data.status === "active" ? true : false,
          refs: [],
          campaign: [],
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Tên dự án"
              name="name"
              rules={[
                { required: true, message: "Please input project name!" },
              ]}
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Đang hoạt động"
              valuePropName="checked"
              rules={[{ required: true }]}
            >
              <Switch disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Link ref" rules={[{ required: true }]} />
            <Table<redirectProfilesItem>
              columns={cls}
              dataSource={[]}
              bordered
              expandable={{
                expandedRowRender: (record) => (
                  <p style={{ margin: 0, padding: 24 }}>{record.url}</p>
                ),
                rowExpandable: (record) => record.redirectConditions.length > 0,
                //   expandIcon: () => null,
                defaultExpandAllRows: true,
                showExpandColumn: false,
              }}
              footer={() => ""}
            />
          </Col>
          <Col span={24}>
            <Form.Item label="Campaign" rules={[{ required: true }]}>
              <div>
                <Button
                  type="primary"
                  style={{ marginBottom: 16 }}
                  onClick={handleAdd}
                >
                  Thêm chiến dịch mới
                </Button>
                <Table<campaignItem>
                  components={components}
                  rowClassName={() => "editable-row"}
                  bordered
                  dataSource={[]}
                  columns={campaignColumns}
                />
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  const onFinish: FormProps<campaignItem>["onFinish"] = (values) => {
    console.log("Success:", values);
  };
  return (
    <Form
      form={form}
      component={false}
      onFinish={onFinish}
      id="form-add-compaign"
    >
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const components = {
  body: {
    row: EditableRow,
  },
};
