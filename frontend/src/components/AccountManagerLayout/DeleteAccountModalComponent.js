import React, { Component } from "react";
import {
  Layout,
  Typography,
} from "antd";

import "antd/dist/antd.css";
const { Text } = Typography;

/**
 * Export Delete account class.
 */
export default class DeleteAccountConfirmationComponent extends Component {

  /**
   * Renders the Delete account confirmation pop up.
   */
  render() {

    return (
      <Layout
        style={{
          alignItems: "center",
          display: "flex",
          backgroundColor: "white",
        }}
      >
          <Text style={{
              fontSize:"12"
          }}
          >
              Are you sure you want to delete this account
              (<Text strong>{this.props.user.username}</Text>)?
          </Text>
      </Layout>

    );
  }
}