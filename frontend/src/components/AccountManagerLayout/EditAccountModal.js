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

import { UserSwitchOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
const { Text, Title } = Typography;
const { Option } = Select;

/**
 * Export the edit account modal class
 */
export default class EditAccountModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: false,
      nPassword: "",
      nRole: "",
    };
  }

  /**
   * Username is updated.
   * @param {Returned value of the triggered event} event
   */
  handleChangeUsername = (event) => {
    this.setState({
      nUsername: event.target.value,
    });
  };

  /**
   * Password is updated.
   * @param {Returned value of the triggered event} event
   */
  handleChangePassword = (event) => {
    this.setState({
      nPassword: event.target.value,
    });
  };

  /**
   * Role is updated.
   * @param {Returned value of the triggered event} value
   */
  handleChangeRole = (value) => {
    this.setState({ nRole: value });
  };

  handleOK = () => {
    if (this.state.nUsername !== "" && this.state.nPassword !== "") {
      this.props.editAccount(
        this.props.info.id,
        this.state.nUsername,
        this.state.nPassword,
        this.state.nRole
      );
    } else {
      message.warning("Fill all the empty fields");
    }
  };

  /**
   * Renders the edit account modal.
   */
  render() {
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    /**
     * Throws error if fields are empty.
     */
    /* eslint no-template-curly-in-string: off */
    const validateMessages = {
      required: "${label} is required!",
    };

    /**
     * Error if not all the fields are completed
     * @param {Error information} errorInfo
     */
    const onFinishFailed = (errorInfo) => {
      message.error(
        "Failed: Please complete all the required fields",
        errorInfo
      );
    };
    return (
      <Modal
        title="Edit Account"
        style={{
          position: "absolute",
          top: "25%",
          bottom: "25%",
          left: "15%",
          right: "25%",
          display: "flex",
          alignItems: "center",
          marginLeft: 280,
        }}
        visible={this.props.visible}
        maskClosable={false}
        onCancel={this.props.handleCancel}
        onOk={this.handleOK}
      >
        <Layout
          style={{
            alignItems: "center",
            display: "flex",
            backgroundColor: "white",
          }}
        >
          <Layout style={{ backgroundColor: "white" }}>
            <Layout
              style={{
                flexDirection: "row",
                display: "flex",
                marginTop: 90,
                backgroundColor: "white",
              }}
            >
              <UserSwitchOutlined style={{ fontSize: 50, marginLeft: -10 }} />
              <Layout
                style={{
                  display: "flex",
                  width: "100%",
                  marginRight: -10,
                  backgroundColor: "white",
                }}
              >
                <Title style={{ fontSize: 16 }}>Welcome </Title>
                <Text style={{ fontSize: 14 }}>
                  Change the following fields to update the new user
                  information.
                </Text>
              </Layout>
            </Layout>
            <Divider style={{ marginTop: -170 }} />
          </Layout>
          <Layout
            style={{
              marginTop: 20,
              backgroundColor: "white",
              flexDirection: "row",
            }}
          >
            <Form
              {...layout}
              name="nest-messages"
              validateMessages={validateMessages}
              style={{ width: "30vh", marginRight: 50 }}
            >
              <Form.Item name={["user", "Name"]} label="Name">
                <Input placeholder={this.props.info.username} disabled={true} />
              </Form.Item>
              <Form.Item
                name={["user", "age"]}
                label="Role"
                rules={[{ type: "string", min: 0, max: 99 }]}
              >
                <Select placeholder={this.props.info.role} disabled={true} />
              </Form.Item>
            </Form>

            <Form
              {...layout}
              name="nest-messages"
              onFinishFailed={onFinishFailed}
              validateMessages={validateMessages}
              style={{ width: "40vh", marginRight: 50 }}
            >
              <Form.Item
                name={["user", "Username"]}
                label="Username"
                rules={[{ required: true }]}
              >
                <Input
                  value={this.state.nUsername}
                  onChange={this.handleChangeUsername}
                />
              </Form.Item>
              <Form.Item
                name={["user", "Password"]}
                label="Password"
                rules={[{ required: true }]}
              >
                <Input.Password
                  value={this.state.nPassword}
                  onChange={this.handleChangePassword}
                />
              </Form.Item>
              <Form.Item
                name={["user", "Role"]}
                label="Role"
                rules={[{ type: "string", min: 0, max: 99, required: true }]}
              >
                <Select
                  placeholder="Select a option and change input text above"
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
