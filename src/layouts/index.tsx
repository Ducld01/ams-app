"use client";
import {
  LinkOutlined,
  ProjectOutlined,
  SwitcherOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";

const { Content, Header, Sider } = Layout;

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <Sider trigger={null} collapsible>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <LinkOutlined />,
              label: <a href="/ref">Refs</a>,
            },
            {
              key: "2",
              icon: <ProjectOutlined />,
              label: <a href="/project">Projects</a>,
            },
            {
              key: "3",
              icon: <SwitcherOutlined />,
              label: <a href="/campaign">Campaigns</a>,
            },
          ]}
        />
      </Sider>
      <Layout>
        {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: "100vh",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflowY: "auto",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
