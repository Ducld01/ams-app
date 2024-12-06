"use client";

import { DeleteOutlined } from "@ant-design/icons";
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
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RefOption, SelectRefItem } from "@/features/select-ref-form-item";
import { Project } from "@/app/types";
import { reference_type_options } from "../../constant";
import { useRenderReferenceActionOptions } from "../../utils";

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

export const AddProjectForm = ({
  onSubmit,
}: {
  onSubmit: (data: Project) => void;
}) => {
  const router = useRouter();

  const [form] = Form.useForm<DataType>();
  const { renderOption } = useRenderReferenceActionOptions();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = async (values: any) => {
    try {
      onSubmit(values);

      router.push("/project");
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
                  <Table
                    dataSource={fields.map((field, idx) => ({
                      ...field,
                      key: `row-${idx}`,
                    }))}
                    pagination={false}
                    bordered
                    expandable={{
                      expandedRowRender: (_record, index) => (
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
                              <Form.List name={[index, "redirectConditions"]}>
                                {(
                                  conditionFields,
                                  { add: addCondition, remove: removeCondition }
                                ) => (
                                  <Row>
                                    <Col span={24}>
                                      {conditionFields.map(
                                        ({ key, name, ...restField }) => (
                                          <Row key={key} gutter={8}>
                                            <Col span={8}>
                                              <Form.Item
                                                {...restField}
                                                name={[name, "reference_type"]}
                                              >
                                                <Select
                                                  options={
                                                    reference_type_options
                                                  }
                                                />
                                              </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                              <Form.Item
                                                {...restField}
                                                name={[
                                                  name,
                                                  "reference_action",
                                                ]}
                                              >
                                                <Select
                                                  options={renderOption(
                                                    form.getFieldValue([
                                                      "redirectProfiles",
                                                      index,
                                                      "redirectConditions",
                                                      name,
                                                      "reference_type",
                                                    ])
                                                  )}
                                                />
                                              </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                              <Form.Item
                                                {...restField}
                                                name={[name, "valueCondition"]}
                                              >
                                                <Input />
                                              </Form.Item>
                                            </Col>
                                            <Col span={2}>
                                              <Button
                                                type="primary"
                                                onClick={() =>
                                                  removeCondition(name)
                                                }
                                              >
                                                -
                                              </Button>
                                            </Col>
                                          </Row>
                                        )
                                      )}
                                    </Col>
                                    <Col span={24}>
                                      <Button
                                        type="primary"
                                        onClick={() => addCondition()}
                                      >
                                        +
                                      </Button>
                                    </Col>
                                  </Row>
                                )}
                              </Form.List>
                            </Col>
                          </Row>
                        </Space>
                      ),
                      expandedRowKeys: expandedRowKeys,
                      expandIcon: () => null,
                      defaultExpandAllRows: true,
                    }}
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
                        render: (_, record) => (
                          <Form.Item
                            name={[record.name, "redirectProfileName"]}
                            rules={[
                              {
                                required: true,
                                message: "redirectProfileName is required",
                              },
                            ]}
                          >
                            <SelectRefItem
                              onChange={(value, option) => {
                                const redirectProfiles = form.getFieldValue(
                                  "redirectProfiles"
                                ) as DataType["redirectProfiles"];

                                redirectProfiles[record.name] = {
                                  ...redirectProfiles[record.name],
                                  redirectProfileName: (option as RefOption)
                                    .label as string,
                                  offerId: value,
                                  url: (option as RefOption).url as string,
                                };
                                form.setFieldValue(
                                  "redirectProfiles",
                                  redirectProfiles
                                );
                              }}
                            />
                            {/* <Input placeholder="Enter redirectProfileName" /> */}
                          </Form.Item>
                        ),
                      },
                      {
                        title: "Mã ref",
                        dataIndex: "offerId",
                        key: "offerId",
                        align: "center",
                        width: 150,
                        render: (_, record) => (
                          <Form.Item
                            name={[record.name, "offerId"]}
                            rules={[
                              {
                                required: true,
                                message: "offerId is required",
                              },
                            ]}
                          >
                            <Input placeholder="Enter offerId" disabled />
                          </Form.Item>
                        ),
                      },
                      {
                        title: "Link ref",
                        dataIndex: "url",
                        key: "url",
                        render: (_, record) => (
                          <Form.Item
                            name={[record.name, "url"]}
                            rules={[
                              { required: true, message: "URL is required" },
                            ]}
                          >
                            <Input placeholder="Enter URL" disabled />
                          </Form.Item>
                        ),
                      },
                      {
                        title: "Xác suất",
                        dataIndex: "probability",
                        key: "probability",
                        align: "center",
                        width: 150,
                        render: (_, record) => (
                          <Form.Item
                            name={[record.name, "probability"]}
                            rules={[
                              {
                                required: true,
                                message: "Probability is required",
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
                        render: (_text, _record, i) => (
                          <Switch
                            onChange={(checked) =>
                              onSwitchChange(checked, `row-${i}`)
                            }
                          />
                        ),
                      },
                      {
                        title: "Hoạt động",
                        dataIndex: "active",
                        key: "active",
                        render: (_, record) => (
                          <Form.Item name={[record.name, "active"]}>
                            <Switch />
                          </Form.Item>
                        ),
                      },
                      {
                        title: "Action",
                        key: "action",
                        render: (_, record) => (
                          <Space size="middle">
                            <Button
                              icon={<DeleteOutlined />}
                              onClick={() => remove(record.name)}
                            />
                          </Space>
                        ),
                      },
                    ]}
                  />
                  <Space size="middle" style={{ marginTop: 8 }}>
                    <Button type="primary" onClick={() => add()}>
                      Thêm ref mới
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => {
                        const redirectProfiles = form.getFieldValue(
                          "redirectProfiles"
                        ) as DataType["redirectProfiles"];
                        const count = redirectProfiles.length;

                        if (count > 0) {
                          // Tính toán tỷ lệ
                          const equalProbability = Math.floor(100 / count);
                          const remainder = 100 % count;

                          // Cập nhật lại probability, thêm phần dư vào phần tử đầu tiên
                          const updatedProfiles = redirectProfiles.map(
                            (profile, index) => ({
                              ...profile,
                              probability:
                                index === 0
                                  ? equalProbability + remainder // Thêm phần dư vào phần tử đầu tiên
                                  : equalProbability,
                            })
                          );

                          // Set giá trị mới vào form
                          form.setFieldValue(
                            "redirectProfiles",
                            updatedProfiles
                          );
                        }
                      }}
                    >
                      Tự động phân bổ tỷ lệ link ref
                    </Button>
                  </Space>
                </>
              )}
            </Form.List>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Button type="primary" htmlType="submit">
              Thêm dự án
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};
