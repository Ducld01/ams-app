"use client";

import { DeleteOutlined } from "@ant-design/icons";
import { pick } from "lodash-es";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Typography,
} from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";

type redirectProfilesItem = {
  active: boolean;
  probability: number;
  offerId: string;
  redirectProfileName: string;
  url: string;
  key: string;
  condition_type: string;
  redirectConditions: {
    valueCondition: string;
    reference_type: string;
    reference_action: string;
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
  key: number;
  name: string;
  code: string;
  type: string;
  status: string;
  redirectProfiles: redirectProfilesItem[];
  campaign: campaignItem[];
}

export const AddProjectForm = () => {
  const router = useRouter();

  const [form] = Form.useForm<DataType>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = async (values: any) => {
    // const projectValues = pick(values, ["name", "status"]);
    console.log(values);
    // Math.random().toString(16).slice(2)
    // ngrok, local tunnel
    try {
      // console.log(projectValues);
      // await fetch("/api/projects", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(projectValues),
      // });
      // router.push("/project");
    } catch (error) {
      throw new Error((error as Error)?.message);
    }
  };

  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  const onSwitchChange = (checked: boolean, key: string) => {
    setExpandedRowKeys((prevKeys) =>
      checked
        ? [...prevKeys, key]
        : prevKeys.filter((expandedKey) => expandedKey !== key)
    );
  };

  return (
    <Card title="Thêm dự án mới">
      <Form form={form} layout="vertical" id="form-detail" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Tên dự án"
              name="name"
              rules={[
                { required: true, message: "Please input project name!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Đang hoạt động"
              valuePropName="checked"
              rules={[{ required: true }]}
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.List name="redirectProfiles">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Table
                      key={key}
                      columns={[
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
                          render: () => (
                            <Form.Item
                              {...restField}
                              name={[name, "redirectProfileName"]}
                              rules={[
                                {
                                  required: true,
                                  message: "redirectProfileName is required",
                                },
                              ]}
                            >
                              <Input placeholder="Enter redirectProfileName" />
                            </Form.Item>
                          ),
                        },
                        {
                          title: "Mã ref",
                          dataIndex: "offerId",
                          key: "offerId",
                          align: "center",
                          width: 150,
                          render: () => (
                            <Form.Item
                              {...restField}
                              name={[name, "offerId"]}
                              rules={[
                                {
                                  required: true,
                                  message: "offerId is required",
                                },
                              ]}
                            >
                              <Input placeholder="Enter offerId" />
                            </Form.Item>
                          ),
                        },
                        {
                          title: "Link ref",
                          dataIndex: "url",
                          key: "url",
                          width: "auto",
                          render: () => (
                            <Form.Item
                              {...restField}
                              name={[name, "url"]}
                              rules={[
                                {
                                  required: true,
                                  message: "offerId is required",
                                },
                              ]}
                            >
                              <Input placeholder="Enter offerId" />
                            </Form.Item>
                          ),
                        },
                        {
                          title: "Xác suất",
                          dataIndex: "probability",
                          key: "probability",
                          align: "center",
                          width: 150,
                          render: () => (
                            <Form.Item
                              {...restField}
                              name={[name, "probability"]}
                              rules={[
                                {
                                  required: true,
                                  message: "offerId is required",
                                },
                              ]}
                            >
                              <InputNumber<number>
                                min={0}
                                max={100}
                                formatter={(value) => `${value}%`}
                                parser={(value) =>
                                  value?.replace("%", "") as unknown as number
                                }
                              />
                            </Form.Item>
                          ),
                        },
                        {
                          title: "Điều kiện",
                          dataIndex: "isRedirectConditions",
                          key: "isRedirectConditions",
                          render: (_tex, _record, index) => (
                            <Switch
                              onChange={(checked) =>
                                onSwitchChange(checked, `index-${index}`)
                              }
                            />
                          ),
                        },
                        {
                          title: "Hoạt động",
                          dataIndex: "active",
                          key: "active",
                          render: () => (
                            <Form.Item name={[name, "active"]} {...restField}>
                              <Switch />
                            </Form.Item>
                          ),
                        },
                        {
                          title: "Action",
                          key: "action",
                          render: (_value, _record, index) => (
                            <Space size="middle">
                              <Button
                                icon={<DeleteOutlined />}
                                onClick={() => remove(index)}
                              />
                            </Space>
                          ),
                        },
                      ]}
                      dataSource={fields.map((field, index) => ({
                        ...field,
                        key: `index-${index}`,
                      }))}
                      rowKey={(field) => field.key}
                      pagination={false}
                      bordered
                      expandable={{
                        expandedRowRender: (_record, index) => {
                          return (
                            <Space>
                              <Row>
                                <Col span={24}>
                                  <Typography>
                                    Điều kiện chuyển hướng tham chiếu:
                                  </Typography>
                                </Col>
                                <Col span={6}>
                                  <Typography>
                                    Hoạt động áp dụng giữa các điều kiện:
                                  </Typography>
                                  <Form.Item name={[index, "condition_type"]}>
                                    <Radio.Group>
                                      <Radio value="and">Và</Radio>
                                      <Radio value="or">Hoặc</Radio>
                                    </Radio.Group>
                                  </Form.Item>
                                </Col>

                                <Col span={24}>
                                  <Form.List
                                    name={[index, "redirectConditions"]}
                                  >
                                    {(fields, { add, remove }) => (
                                      <Row>
                                        <Col span={24}>
                                          {fields.map((_field, i) => (
                                            <Row key={i} gutter={8}>
                                              <Col span={8}>
                                                <Form.Item
                                                  name={[i, "reference_type"]}
                                                >
                                                  <Select
                                                    options={[
                                                      {
                                                        value: "A",
                                                        label: "A",
                                                      },
                                                      {
                                                        value: "B",
                                                        label: "B",
                                                      },
                                                    ]}
                                                  />
                                                </Form.Item>
                                              </Col>
                                              <Col span={8}>
                                                <Form.Item
                                                  name={[i, "reference_action"]}
                                                >
                                                  <Select
                                                    options={[
                                                      {
                                                        value: "C",
                                                        label: "C",
                                                      },
                                                      {
                                                        value: "D",
                                                        label: "D",
                                                      },
                                                    ]}
                                                  />
                                                </Form.Item>
                                              </Col>
                                              <Col span={6}>
                                                <Form.Item
                                                  name={[i, "valueCondition"]}
                                                >
                                                  <Input />
                                                </Form.Item>
                                              </Col>
                                              <Col span={2}>
                                                <Button
                                                  type="primary"
                                                  onClick={() => remove(i)}
                                                >
                                                  -
                                                </Button>
                                              </Col>
                                            </Row>
                                          ))}
                                        </Col>
                                        <Col span={24}>
                                          <Button type="primary" onClick={add}>
                                            +
                                          </Button>
                                        </Col>
                                      </Row>
                                    )}
                                  </Form.List>
                                </Col>
                              </Row>
                            </Space>
                          );
                        },
                        expandedRowKeys: expandedRowKeys,
                        // rowExpandable: (record) =>
                        //   record.isRedirectConditions === true,
                        //   expandIcon: () => null,
                        defaultExpandAllRows: true,
                        showExpandColumn: true,
                      }}
                      
                    />
                  ))}
                  <Space size="middle">
                    <Button type="primary" onClick={add}>
                      Thêm ref mới
                    </Button>
                    <Button type="primary">
                      Tự động phân bổ tỷ lệ link ref
                    </Button>
                  </Space>
                </>
              )}
            </Form.List>
          </Col>
        </Row>
        <Row gutter={16}>
          <Button type="primary" htmlType="submit">
            Thêm dự án
          </Button>
        </Row>
      </Form>
    </Card>
  );
};
