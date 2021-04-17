import React, { Component } from "react";
import { Layout, Typography } from "antd";
import "antd/dist/antd.css";
const { Title } = Typography;

export default class MonthlyDataAnalytics extends Component {
  render() {
    return (
      <Layout
      style={{
          flexDirection: "column",
          alignItems: "center",
          display: "flex",
          marginBottom: 1,
          width: "100%",
          backgroundColor: "white",
          padding: 250,
      }}
      >
          <Title>Hello, this page has not been implemented yet!</Title>
      </Layout>
)}
  }
