import React, { Component } from 'react'
import NetworkComponent from '../ExploratoryLayout/NetworkComponent';
import { Divider, Button, Layout, Typography, message } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";

export default class hierarchicallayout extends Component {
  render() {
    return (
     <Layout style={{
        backgroundColor: "white", display: "flex", width: "100%"
      }}>
        

        <Layout style={{
          backgroundColor: "green", width: "100%", height: "95%",
          justifyContent: "center",alignItems:"center",
        }}>
          <NetworkComponent data={[5,10,1,3]}/>
          
        </Layout>

      </Layout>
    )
  }
}
