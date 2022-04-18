import React, { Component } from 'react'
import { Divider, Button, Layout, Table , Typography, message } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import EditableTableOrder from './EditableTableOrder';
import { getColumnOrder } from './columnDataOrder';
import Papa from 'papaparse'



export default class statisticslayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: getColumnOrder(),
      selectedOrdersRowKeys: [],
      data: [],
      selectedOrderType: null,
      change_data:null,
    }
  }
  
  componentDidMount() {
    this.importCSV("./static/files/EmployeeRecords1.csv")
  }

  //Importers
  importCSV = (path) => {
    Papa.parse(path, {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: this.updateData
    });
  };

  updateData = (results)=> {
    const data  = results.data
    this.setState({
      data: data,
      change_data: true
    })
    
  }

  onSelectedOrdersRowKeysChange = (selectedOrdersRowKeys, selectedOrderType) => {
    this.setState({ selectedOrdersRowKeys, selectedOrderType });
  };

  setData = (e) => {
    this.setState({ data: e });
    console.log(this.state.data)
  };



  render() {
    return (
      <Layout
        style={{backgroundColor: "pink", width: "100%", height:"100%", flexDirections:"row"}}
      >
        <Layout
          style={{backgroundColor: "green", width: "100%", height:"100%"}}
        >
          
          {this.state.change_data==true && <EditableTableOrder
            style={{ height: "100%", with: "100%" }}
            dataSource={this.state.data}
            columns={this.state.columns}
            setData={this.setData}
            scroll={{ x: 1500, y: 300 }}
          />
          }
        </Layout>
        
        <Layout
          style={{backgroundColor: "yellow", width: "100%", height:"100%"}}
        >
          
        </Layout>
    </Layout>
    )
  }
}
