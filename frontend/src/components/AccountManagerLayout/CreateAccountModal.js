import React, { Component } from "react";
import {
  Layout,
  Form,
  Input,
  Typography,
  Select,
  Divider,
  message,
  Modal,
} from "antd";

import { UserAddOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
const { Text, Title } = Typography;
const { Option } = Select;

export default class CreateAccountModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: "",
      username: "",
      password: "",
    };
  }

  /**
   * Handle changes in the Username text box.
   * @param {Returned value of the triggered event} event
   */
  handleChangeUsername = (event) => {
    this.setState({
      username: event.target.value,
    });
  };

  /**
   * Handle changes in the Password text box.
   * @param {Returned value of the triggered event} event
   */
  handleChangePassword = (event) => {
    this.setState({
      password: event.target.value,
    });
  };

  /**
   * Handle changes in the Role selector drop down menu.
   * @param {Role values} value
   */
  handleChangeRole = (value) => {
    this.setState({ role: value });
  };

  handleOK = () => {
    if (
      this.state.username !== "" &&
      this.state.password !== "" &&
      this.state.role !== ""
    ) {
      this.props.addAccount(
        this.state.username,
        this.state.password,
        this.state.role
      );
    } else {
      message.error("Not all fields have been filled in.");
    }
  };

  /**
   * Renders the account creation modal(page).
   */
  render() {
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    return (
      <Modal
        title="Create Account"
        style={{
          display: "flex",
          marginLeft: "33%",
        }}
        centered={false}
        maskClosable={false}
        visible={this.props.visible}
        onCancel={this.props.handleCancel}
        onOk={this.handleOK}
      >
        <Layout
          style={{
            alignItems: "center",
            width: "70vh",
            height: "50vh",
            backgroundColor: "white",
          }}
        >
          <Layout
            style={{
              flexDirection: "row",
              backgroundColor: "white",
            }}
          >
            <UserAddOutlined style={{ fontSize: 50 }} />
            <Layout
              style={{
                backgroundColor: "white",
              }}
            >
              <Title style={{ fontSize: 16 }}>Welcome </Title>
              <Text style={{ fontSize: 14 }}>
                Complete the following form in order to add a new user. Every
                field is required to be filled.
              </Text>
            </Layout>
          </Layout>
          <Divider style={{ backgroundColor: "white" }} />
          <Layout style={{ backgroundColor: "white" }}>
            <Form
              {...layout}
              name="nest-messages"
              style={{ width: "60vh", marginRight: 50 }}
            >
              <Form.Item
                name={["user", "name"]}
                label="Name"
                rules={[{ required: true }]}
              >
                <Input
                  value={this.state.username}
                  onChange={this.handleChangeUsername}
                />
              </Form.Item>
              <Form.Item
                name={["user", "password"]}
                label="Password"
                rules={[{ required: true }]}
              >
                <Input.Password
                  value={this.state.password}
                  onChange={this.handleChangePassword}
                />
              </Form.Item>
              <Form.Item
                name={["user", "role"]}
                label="Role"
                rules={[{ type: "string", min: 0, max: 99, required: true }]}
              >
                <Select
                  placeholder="Select an option"
                  onChange={this.handleChangeRole}
                  allowClear
                >
                  <Option value="administrator">Administrator</Option>
                  <Option value="view-only">View Only</Option>
                  <Option value="planner">Planner</Option>
                </Select>
              </Form.Item>
            </Form>
          </Layout>
        </Layout>
      </Modal>
    );
  }
}
