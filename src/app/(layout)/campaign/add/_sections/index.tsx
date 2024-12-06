"use client";

import { Button, Form, FormProps, Input } from "antd";
import { useRouter } from "next/navigation";
import { SelectProject } from "./components/select-project";
import { SelectProjectItem } from "@/features/select-project-item";

export type CampaignField = {
  name: string;
  code: string;
  project_id: string;
};

export const CreateCampaignForm = ({
  onSubmit,
}: {
  onSubmit: (data: CampaignField) => void;
}) => {
  const router = useRouter();
  const [form] = Form.useForm<CampaignField>();
  const onFinish: FormProps<CampaignField>["onFinish"] = (values) => {
    try {
      onSubmit(values);
      router.push("/campaign");
    } catch (error) {
      console.log(error);
    }
  };

  const onFinishFailed: FormProps<CampaignField>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      form={form}
    >
      <Form.Item<CampaignField>
        label="Tên chiến dịch"
        name="name"
        rules={[{ required: true, message: "Please input campaign name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item<CampaignField>
        label="Mã chiến dịch"
        name="code"
        rules={[{ required: true, message: "Please input campaign code!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="project_id"
        label="Tên dự án"
        rules={[{ required: true, message: "Please input project id" }]}
      >
        <SelectProjectItem
          onChange={(value) => form.setFieldValue("project_id", value)}
        />
      </Form.Item>
      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
