"use client";

import { Refs } from "@/app/types";
import { Button, Form, FormProps, Input } from "antd";
import { useRouter } from "next/navigation";

type FieldType = {
  name: string;
  url: string;
};

export const CreateRefForm = ({
  onSubmit,
}: {
  onSubmit: (data: Pick<Refs, "name" | "url">) => void;
}) => {
  const router = useRouter();
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    try {
      onSubmit(values);
      router.push("/ref");
    } catch (error) {
      console.log(error);
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
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
    >
      <Form.Item<FieldType>
        label="name"
        name="name"
        rules={[{ required: true, message: "Please input ref name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item<FieldType>
        label="link"
        name="url"
        rules={[{ required: true, message: "Please input ref link!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
