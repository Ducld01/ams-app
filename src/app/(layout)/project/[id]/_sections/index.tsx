"use client";

import { Campaign, Project } from "@/app/types";
import { RefOption, SelectRefItem } from "@/features/select-ref-form-item";
import { CopyOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  FormListFieldData,
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
import { PrefetchKind } from "next/dist/client/components/router-reducer/router-reducer-types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const ProjectDetailForm = ({
  data,
  onCreateCampaign,
}: {
  data: Project;
  onCreateCampaign: (
    data: Pick<Campaign, "name" | "code" | "project_id">
  ) => void;
}) => {
  const router = useRouter();
  const [form] = Form.useForm<Project>();
  const [newCampaignvalue, setNewCampaignValue] = useState({
    name: "",
    code: "",
    project_id: String(data.id),
  });

  const [isCreating, setIsCreating] = useState(false);

  const handleCreateCampaign = async () => {
    onCreateCampaign(newCampaignvalue);
    setIsCreating(false);
    router.refresh();
  };

  const handleAddNewItem = (
    fields: FormListFieldData[],
    add: () => void,
    remove: (index: number | number[]) => void
  ) => {
    if (!isCreating) {
      add();
      setIsCreating((prev) => !prev);
    } else {
      remove(fields.length - 1);
      setIsCreating((prev) => !prev);
    }
  };  

  useEffect(() => {
    form.setFieldsValue(data)
  }, [data]);

  return (
    <Card title={data.name}>
      <Form
        layout="vertical"
        id="form-detail"
        initialValues={{
          name: data.name,
          status: data.status === "active" ? true : false,
          redirectProfiles: data.redirectProfiles,
          campaigns: data.campaigns,
        }}
        form={form}
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
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.List name="redirectProfiles">
              {(fields) => (
                <Table
                  dataSource={fields.map((field, index) => ({
                    ...field,
                    key: `row-${index}`,
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
                              <Radio.Group disabled>
                                <Row
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                  }}
                                >
                                  <Radio value="and">Và</Radio>
                                  <Radio value="or">Hoặc</Radio>
                                </Row>
                              </Radio.Group>
                            </Form.Item>
                          </Col>

                          <Col span={24}>
                            <Form.List name={[index, "redirectConditions"]}>
                              {(conditionFields) => (
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
                                                disabled
                                                options={[
                                                  { value: "A", label: "A" },
                                                  { value: "B", label: "B" },
                                                ]}
                                              />
                                            </Form.Item>
                                          </Col>
                                          <Col span={8}>
                                            <Form.Item
                                              {...restField}
                                              name={[name, "reference_action"]}
                                            >
                                              <Select
                                                disabled
                                                options={[
                                                  { value: "C", label: "C" },
                                                  { value: "D", label: "D" },
                                                ]}
                                              />
                                            </Form.Item>
                                          </Col>
                                          <Col span={8}>
                                            <Form.Item
                                              {...restField}
                                              name={[name, "valueCondition"]}
                                            >
                                              <Input disabled />
                                            </Form.Item>
                                          </Col>
                                        </Row>
                                      )
                                    )}
                                  </Col>
                                </Row>
                              )}
                            </Form.List>
                          </Col>
                        </Row>
                      </Space>
                    ),
                    expandIcon: () => null,
                    rowExpandable: (record) => {
                      const redirectProfiles = form.getFieldValue(
                        "redirectProfiles"
                      ) as Project["redirectProfiles"];
                      return (
                        redirectProfiles[record.name]?.redirectConditions
                          ?.length > 0
                      );
                    },
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
                            disabled
                            onChange={(value, option) => {
                              const redirectProfiles = form.getFieldValue(
                                "redirectProfiles"
                              ) as Project["redirectProfiles"];

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
                            disabled
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
                          disabled
                          checked={
                            form.getFieldValue([
                              "redirectProfiles",
                              i,
                              "redirectConditions",
                            ]).length > 0
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
                          <Switch disabled />
                        </Form.Item>
                      ),
                    },
                  ]}
                />
              )}
            </Form.List>
          </Col>
          <Col span={24}>
            <Form.List name="campaigns">
              {(fields, { add, remove }) => (
                <div>
                  <Button
                    type="primary"
                    style={{ marginBottom: 16 }}
                    onClick={() => handleAddNewItem(fields, add, remove)}
                  >
                    {isCreating ? "Hủy" : "Thêm chiến dịch mới"}
                  </Button>
                  <Table
                    rowClassName={() => "editable-row"}
                    bordered
                    dataSource={fields.map((field, index) => ({
                      ...field,
                      key: `row-${index}`,
                    }))}
                    columns={[
                      {
                        title: "Tên chiến dịch",
                        dataIndex: "name",
                        key: "name",
                        render: (_value, record) => {
                          const isDisabledName =
                            (record.name <= data.campaigns.length - 1 &&
                              data.campaigns.length > 0) ||
                            record.name !== fields.length - 1;

                          return (
                            <>
                              <Form.Item
                                name={[record.name, "name"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please input campaigns name!",
                                  },
                                ]}
                              >
                                <Input
                                  disabled={isDisabledName}
                                  placeholder="Nhập tên chiến dịch"
                                  onChange={
                                    !isDisabledName
                                      ? (e) => {
                                          setNewCampaignValue((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                          }));
                                        }
                                      : undefined
                                  }
                                />
                              </Form.Item>
                            </>
                          );
                        },
                      },
                      {
                        title: "Mã chiến dịch",
                        dataIndex: "code",
                        key: "code",
                        render: (_value, record) => {
                          const isDisabledCode =
                            (record.name <= data.campaigns.length - 1 &&
                              data.campaigns.length > 0) ||
                            record.name !== fields.length - 1;

                          return (
                            <Form.Item
                              name={[record.name, "code"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Please input campaigns id!",
                                },
                              ]}
                            >
                              <Input
                                disabled={isDisabledCode}
                                placeholder="Nhập mã chiến dịch"
                                onChange={
                                  !isDisabledCode
                                    ? (e) => {
                                        setNewCampaignValue((prev) => ({
                                          ...prev,
                                          code: e.target.value,
                                        }));
                                      }
                                    : undefined
                                }
                              />
                            </Form.Item>
                          );
                        },
                      },
                      {
                        title: "Được tạo vào ngày",
                        dataIndex: "created_at",
                        key: "created_at",
                        render: (_value, record) => (
                          <Form.Item
                            name={[record.name, "created_at"]}
                            rules={[
                              {
                                required: true,
                                message: "Please input campaigns id!",
                              },
                            ]}
                          >
                            <Input
                              style={{
                                border: "none",
                                background: "none",
                                color: "#000",
                              }}
                              disabled
                            />
                          </Form.Item>
                        ),
                      },
                      {
                        title: "Kịch bản",
                        dataIndex: "script",
                        key: "script",
                        width: 250,
                        render: (text, record) => {
                          const create =
                            (record.name <= data.campaigns.length - 1 &&
                              data.campaigns.length > 0) ||
                            record.name !== fields.length - 1;
                          const scriptDetail = form.getFieldValue([
                            "campaigns",
                            record.name,
                            "script",
                          ]);
                          return (
                            <>
                              {!create ? (
                                <Button
                                  type="primary"
                                  onClick={() => handleCreateCampaign()}
                                >
                                  Thêm Chiến Dịch
                                </Button>
                              ) : (
                                <>
                                  {scriptDetail ? (
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
                                        style={{
                                          position: "absolute",
                                          top: 0,
                                          right: 0,
                                        }}
                                        onClick={() =>
                                          navigator.clipboard.writeText(
                                            scriptDetail
                                          )
                                        }
                                      />
                                      <Typography>{scriptDetail}</Typography>
                                    </div>
                                  ) : (
                                    "---"
                                  )}
                                </>
                              )}
                            </>
                          );
                        },
                      },
                    ]}
                  />
                </div>
              )}
            </Form.List>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};
