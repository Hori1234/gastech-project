import React, { Component } from 'react'
import { Divider, Button, Layout, Typography, message } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";

export default class statisticslayout extends Component {
  render() {
    return (
      <Layout
        style={{backgroundColor: "pink", width: "100%", height:"100%", flexDirections:"row"}}
      >
        <Layout
          style={{backgroundColor: "green", width: "100%", height:"100%"}}
        >

        </Layout>
        
        <Layout
          style={{backgroundColor: "yellow", width: "100%", height:"100%"}}
        >
          
        </Layout>
    </Layout>
    )
  }
}
