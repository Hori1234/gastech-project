import React, { Component } from "react";
import { Divider, Button, Layout, Typography, message } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import axios from "axios";

import CreateAccountModal from "./CreateAccountModal";
import AccountTable from "./AccountTable";
import EditAccountModal from "./EditAccountModal";

const { Text } = Typography;

/**
 * Export the class.
 */
export default class AccountManagementLayout extends Component {
  constructor(props) {
    super(props);
    this.pageSize = 10;
    this.state = {
      CAVisible: false,
      EAVisible: false,
      data: [],
      loading: true,
      hasMore: true,
      lastPage: 1,
      Metadata: {
        id: null,
        username: null,
        role: null,
      },
    };
  }

  componentDidMount = () => {
    this.getUsers(this.state.lastPage, this.pageSize);
  };

  /**
   * Set the values of all the users.
   * @param {Current value} value
   */
  setUsers = (value) => {
    this.setState({
      users: value,
    });
  };

  /**
   * Sending a request to the database
   * to retrieve the list of all users.
   * @param {Current page} vPage
   * @param {Current account list size} vPage_size
   */
  getUsers = async (vPage, vPage_size) => {
    return axios
      .get("/api/auth/users", {
        params: {
          page: vPage,
          page_size: vPage_size,
        },
      })
      .then((res) => {
        const newData = this.state.data.concat(res.data);
        this.setState((state) => ({
          data: newData,
          loading: false,
        }));
      })
      .catch(() => {
        this.setState({
          hasMore: false,
          loading: false,
        });
      });
  };

  /**
   * Gets a list of users on multiple pages from the backend.
   */
  handleInfiniteOnLoad = () => {
    let { data } = this.state;
    this.setState({
      loading: true,
    });

    if (data.length === this.state.lastPage * this.pageSize) {
      this.setState({
        lastPage: this.state.lastPage + 1,
      });
      this.getUsers(this.state.lastPage, this.pageSize);
    } else {
      this.setState({
        hasMore: false,
        loading: false,
      });
    }
  };

  /**
   * Handles successful and unsuccessful account deletions.
   * @param {Path to user to be deleted} id
   */
  deleteAccount = (id) => {
    return axios
      .delete(`/api/auth/user/${id}`)
      .then(() => {
        const filteredData = this.state.data.filter((item) => item.id !== id);
        this.setState({
          data: filteredData,
        });
        message.success("Account successfully deleted");
      })
      .catch((error) => {
        if (error.response.data) {
          message.error(error.response.data.message);
        }
      });
  };

  /**
   * When the Submit button is pressed the account is updated in the database.
   * @param {Id of a user to be edited} user_id
   * @param {New Username} vUsername
   * @param {New password} vPassword
   * @param {New role} vRole
   */
  editAccount = async (user_id, vUsername, vPassword, vRole) => {
    return axios
      .patch(`/api/auth/user/${user_id}`, {
        username: vUsername,
        password: vPassword,
        role: vRole,
      })
      .then((res) => {
        const newData = this.state.data.map((item) => {
          if (item.id === user_id) {
            item.username = vUsername;
            item.role = vRole;
          }
          return item;
        });
        this.setState({
          data: newData,
          EAVisible: false,
        });
        message.success("Account edited successfully!");
      })
      .catch((error) => {
        if (error.response.data) {
          message.error(error.response.data.message);
        }
      });
  };

  /**
   * Adding an account to the database.
   * @param {New username} vUsername
   * @param {New password} vPassword
   * @param {New role} vRole
   */
  addAccount = async (vUsername, vPassword, vRole) => {
    return axios
      .post("/api/auth/user", {
        username: vUsername,
        password: vPassword,
        role: vRole,
      })
      .then((res) => {
        const newData = this.state.data.concat({
          id: res.data.id,
          username: res.data.username,
          role: res.data.role,
        });
        this.setState({
          data: newData,
          CAVisible: false,
        });
        message.success("Account added successfully!");
      })
      .catch((error) => {
        if (error.response.data) {
          message.error(error.response.data.message);
        }
      });
  };

  /**
   * case ca: Display the account creation modal(page).
   * case ea: Display the edit account modal(page).
   * @param {ea or ca (create account or edit account)} value
   * @param {Id of a user} vId
   * @param {New username of a user} vUsername
   * @param {New role of a user} vRole
   */
  showModal = (value, vId, vUsername, vRole) => {
    switch (value) {
      case "ca":
        this.setState({
          CAVisible: true,
        });
        break;
      case "ea":
        this.setState({
          EAVisible: true,
        });
        this.setState((prevState) => {
          let Metadata = Object.assign({}, prevState.Metadata); // creating copy of state variable Metadata
          Metadata.id = vId;
          Metadata.username = vUsername;
          Metadata.role = vRole;
          return { Metadata }; // return new object Metadata object
        });
        break;
      default:
      // no default
    }
  };

  /**
   * Hide modals after Submit or Cancel button have been pressed.
   * @param {Returned value of the triggered event} e
   */
  handleCancel = (e) => {
    this.setState({
      EAVisible: false,
      CAVisible: false,
    });
  };

  /**
   * Rendering of the account management page.
   */
  render() {
    return (
      <Layout
        style={{ backgroundColor: "white", display: "flex", width: "100%" }}
      >
        <Layout>
          <Layout
            style={{
              alignItems: "flex-start",
              flexDirection: "row",
              backgroundColor: "white",
              display: "flex",
              width: "100%",
            }}
          >
            <UserAddOutlined style={{ fontSize: 90 }} />
            <Layout
              style={{ flexDirection: "column", backgroundColor: "white" }}
            >
              <Text style={{ fontWeight: "bold", fontSize: "18" }}>
                Create Accounts
              </Text>
              <Text style={{ fontSize: " 14" }}>
                This page is used create accounts
              </Text>
            </Layout>
            <Layout
              style={{ alignItems: "flex-end", backgroundColor: "white" }}
            >
              <Button
                style={{ marginRight: 20, width: 150 }}
                type="primary"
                onClick={() => this.showModal("ca")}
              >
                Create Account
              </Button>
            </Layout>
          </Layout>
        </Layout>
        <Divider />
        <Layout
          style={{
            backgroundColor: "white",
            display: "flex",
            width: "100%",
          }}
        >
          <AccountTable
            data={this.state.data}
            loading={this.state.loading}
            hasMore={this.state.hasMore}
            loadMore={this.handleInfiniteOnLoad}
            showModal={this.showModal}
            deleteAccount={this.deleteAccount}
          />
        </Layout>
        <CreateAccountModal
          handleCancel={this.handleCancel}
          visible={this.state.CAVisible}
          addAccount={this.addAccount}
        />
        <EditAccountModal
          visible={this.state.EAVisible}
          handleCancel={this.handleCancel}
          editAccount={this.editAccount}
          info={this.state.Metadata}
        />
      </Layout>
    );
  }
}
