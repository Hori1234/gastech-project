import React, { useState } from "react";
import "antd/dist/antd.css";
import { Layout, Menu, Avatar, Divider, Image } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useLocation, Link } from "react-router-dom";
import "../Css/NavigationLayout.css";
import { useAuth } from "../contextConfig";
import PageRouter from "./PageRouter";
const { SubMenu } = Menu;
const { Content, Sider, Footer, Header } = Layout;

/**
 * Holds the sidebar and defines the main content layout.
 */
export default function NavigationLayout() {
  const auth = useAuth();
  const location = useLocation();
  const [state, setState] = useState({
    isEmptyState: true,
    UserState: false,
    collapsed: false,
    selectedKeys: [],
  });

  /**
   * Get the key of side menu item to highlight the current page.
   *
   * @param pathname: string of the current url path
   */
  const keys = (pathname) => {
    switch (pathname) {
      case "/":
        return "0";
      case "/account":
        return "1";
      case "/upload":
        return "2";
      case "/planning":
        return "3";
      case "/view":
        return "4";
      case "/data":
        return "5";
      case "/monthly":
        return "6";
      case "/woocom":
        return "8";
      case "/woocomsycc":
        return "9";
      default:
        return null;
    }
  };

  /** Make the sidebar collapsable
   *
   * @param collapsed: boolean to set the state of the sidebar
   */
  const onCollapse = (collapsed) => {
    setState({
      ...state,
      collapsed: collapsed,
    });
    const divider = document.getElementsByClassName("ant-divider")[0];

    if (collapsed) {
      divider.style.setProperty("display", "none");
    } else {
      divider.style.setProperty("display", "flex");
    }
  };

  return !auth.state ? (
    <pre>Loading...</pre>
  ) : (
    <Layout style={{ height: "100vh", fontFamily: "Trebuchet MS" }}>
      <Layout style={{ margin: 10 }}>
        <Sider
          collapsible
          collapsed={state.collapsed}
          onCollapse={onCollapse}
          width={200}
          className="site-layout-background"
        >
          <Layout className="dividers-style">
            <Avatar
              style={{ marginTop: 10 }}
              shape="square"
              size={64}
              icon={<UserOutlined />}
            />

            <Divider>O.T.M.D - Services</Divider>
            <Menu
              mode="inline"
              defaultOpenKeys={["sub1"]}
              style={{ height: "100%", borderRight: 0 }}
              selectedKeys={keys(location.pathname)}
            >
              {auth.state.user.role === "administrator" && (
                <SubMenu
                  key="sub1"
                  defaultSelectedKeys={["0"]}
                  icon={<UserOutlined />}
                  title={auth.state.user.username}
                >
                  <Menu.Item key="0">
                    <Link to="/">Home </Link>
                  </Menu.Item>
                  <Menu.Item key="1">
                    <Link to="/account">Account Management</Link>
                  </Menu.Item>
                  {/* <Menu.Item key="2">
                      <Link to="/upload">Upload</Link>
                    </Menu.Item>
                    <Menu.Item key="3">
                      <Link to="/planning">Create Planning</Link>
                    </Menu.Item>
                    <Menu.Item key="4">
                      <Link to="/view">View Planning</Link>
                    </Menu.Item>
                    <Menu.Item key="5">
                      <Link to="/data">Data Visualisation</Link>
                    </Menu.Item>
                    <Menu.Item key="6">
                      <Link to="/monthly">Monthly Data Analytics</Link>
                    </Menu.Item> */}
                  <Menu.Item key="8">
                    <Link to="/woocom">Woocomerce OTMD</Link>
                  </Menu.Item>
                  <Menu.Item key="9">
                    <Link to="/woocomsycc">Woocomerce Sycc</Link>
                  </Menu.Item>
                  <Menu.Item key="7" onClick={auth.logout}>
                    <Link to="/">Logout</Link>
                  </Menu.Item>
                </SubMenu>
              )}

              {auth.state.user.role === "planner" && (
                <SubMenu
                  key="sub1"
                  defaultSelectedKeys={["1"]}
                  icon={<UserOutlined />}
                  title={auth.state.user.username}
                >
                  <Menu.Item key="1">
                    <Link to="/">Home</Link>
                  </Menu.Item>
                  {/* <Menu.Item key="2">
                      <Link to="/upload">Upload</Link>
                    </Menu.Item>
                    <Menu.Item key="3">
                      <Link to="/planning">Create Planning</Link>
                    </Menu.Item>
                    <Menu.Item key="4">
                      <Link to="/view">View Planning</Link>
                    </Menu.Item>
                    <Menu.Item key="5">
                      <Link to="/data">Data Visualisation</Link>
                    </Menu.Item>
                    <Menu.Item key="6">
                      <Link to="/monthly">Monthly Data Analytics</Link>
                    </Menu.Item> */}
                  <Menu.Item key="7" onClick={auth.logout}>
                    <Link to="/">Logout</Link>
                  </Menu.Item>
                </SubMenu>
              )}

              {auth.state.user.role === "view-only" && (
                <SubMenu
                  key="sub1"
                  defaultSelectedKeys={["3"]}
                  icon={<UserOutlined />}
                  title={auth.state.user.username}
                >
                  <Menu.Item key="3">
                    <Link to="/">Home</Link>
                  </Menu.Item>
                  {/* <Menu.Item key="4">
                      <Link to="/view">View Planning</Link>
                    </Menu.Item>
                    <Menu.Item key="6">
                      <Link to="/monthly">Monthly Data Analytics</Link>
                    </Menu.Item> */}
                  <Menu.Item key="7" onClick={auth.logout}>
                    <Link to="/">Logout</Link>
                  </Menu.Item>
                </SubMenu>
              )}
            </Menu>
          </Layout>
        </Sider>
        <Layout style={{ padding: "0 24px 24px", height: "100%" }}>
          <Layout
            style={{
              marginTop: 5,
              minHeight: 280,
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                marginTop: 5,
                minHeight: 280,
                width: "100%",
                height: "100%",
              }}
            >
              <Layout
                style={{
                  padding: 24,
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  backgroundColor: "white",
                }}
              >
                <PageRouter />
              </Layout>
            </Content>
          </Layout>
          {/* <Footer style={{ textAlign: "center", height: 0 }}>
            O.T.M.D - Services ©2021 Created by OTMD Group
          </Footer> */}
        </Layout>
      </Layout>
    </Layout>
  );
}
