import React, { Component } from "react";
import { Layout, List, Spin, Avatar, Button, Modal } from "antd";

import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import InfiniteScroll from "react-infinite-scroller";
import "../Css/EditAC.css";
import DeleteAccountConfirmationComponent from "./DeleteAccountModalComponent";

export default class AccountTable extends Component {
  state = {
    DAVisible: false,
    currentUser: {
      id: null,
      username: null,
      role: null,
    },
  };

  /**
   * Handles Cancel button on account deletion confirmation pop up.
   * @param {Returned value of the triggered event} e
   */
  handleCancel = (e) => {
    this.setState({
      DAVisible: false,
    });
  };

  /**
   * Displays the confirmation pop up for account deletion.
   * @param {User object for which the modal should be shown} user
   */
  showDeleteAccountModal = (user) => {
    this.setState({
      DAVisible: true,
      currentUser: user,
    });
  };

  /**
   * Renders the Edit account and Delete account buttons.
   * As well as the confirmation pop ups.
   */
  render() {
    return (
      <Layout
        style={{
          display: "flex",
          backgroundColor: "white",
          width: "100%",
          marginTop: 20,
        }}
      >
        <div className="demo-infinite-container">
          <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            loadMore={this.props.loadMore}
            hasMore={!this.props.loading && this.props.hasMore}
            useWindow={false}
          >
            <List
              dataSource={this.props.data}
              renderItem={(item) => (
                <List.Item key={item.id}>
                  <List.Item.Meta
                    avatar={
                      <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                    }
                    title={item.username}
                    description={item.role}
                  />
                  <div>
                    <Button
                      style={{ marginRight: 20 }}
                      type="primary"
                      onClick={() =>
                        this.props.showModal(
                          "ea",
                          item.id,
                          item.username,
                          item.role
                        )
                      }
                      icon={<EditOutlined />}
                    >
                      Edit Account
                    </Button>
                    <Button
                      type="primary"
                      icon={<DeleteOutlined />}
                      onClick={() => this.showDeleteAccountModal(item)}
                    >
                      Delete Account
                    </Button>
                  </div>
                </List.Item>
              )}
            >
              {this.props.loading && this.props.hasMore && (
                <div className="demo-loading-container">
                  <Spin />
                </div>
              )}
            </List>
          </InfiniteScroll>
        </div>
        <Modal
          title="Delete Account"
          style={{
            position: "absolute",
            left: "25%",
            top: "37%",
            width: "100vh",
            display: "flex",
            alignItems: "center",
            marginLeft: 280,
          }}
          visible={this.state.DAVisible}
          maskClosable={false}
          onCancel={this.handleCancel}
          onOk={() => {
            this.props.deleteAccount(this.state.currentUser.id);
            this.setState({
              DAVisible: false,
            });
          }}
        >
          {this.state.DAVisible && (
            <DeleteAccountConfirmationComponent user={this.state.currentUser} />
          )}
        </Modal>
      </Layout>
    );
  }
}
