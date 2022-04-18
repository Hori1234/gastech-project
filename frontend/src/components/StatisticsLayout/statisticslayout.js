import React, { Component } from 'react'
import { Divider, Button, Layout, Table , Typography, Slider ,message } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import EditableTableOrder from './EditableTableOrder';
import { getColumnOrder } from './columnDataOrder';
import Papa from 'papaparse'

const { Paragraph } = Typography;

export default class statisticslayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: getColumnOrder(),
      data: [],
      selectedOrderType: null,
      change_data: null,
      filecontent: "",
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

  importTxt = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = () => {
      this.setState({
        filecontent: reader.result,
      })
    }
    reader.onerror = () => {
      console.log("error: ", reader.error)
    }
  }

  updateData = (results)=> {
    const data  = results.data
    this.setState({
      data: data,
      change_data: true
    })
  }

  setData = (e) => {
    this.setState({ data: e });
    console.log(this.state.data)
  };

  onChange = (value) => {
    console.log('onChange: ', value);
    fetch(`./static/files/articles/${value}.txt`)
    .then((r) => r.text())
    .then(text  => {
      console.log(text);
      this.setState({
        filecontent: text
      })
    })  
  }

  onAfterChange = (value) => {
    console.log('onAfterChange: ', value);
  }

  render() {
    return (
      <Layout
        style={{backgroundColor: "white", width: "100%", height:"100%", flexDirections:"row"}}
      >
        <Layout
          style={{backgroundColor: "white", width: "100%", height:"60%"}}
        >
          <Paragraph> Displaying the personal data of each employee</Paragraph>
          {this.state.change_data==true && <EditableTableOrder
            style={{ height: "100%", with: "100%" }}
            dataSource={this.state.data}
            columns={this.state.columns}
            setData={this.setData}
            
          />
          }
        </Layout>
        <Layout
          style={{backgroundColor: "white", width: "100%", height:"5%"}}
        >
          <Paragraph> Dragging the slider you select the articles in given order.</Paragraph>
          <Slider defaultValue={2} onChange={this.onChange} onAfterChange={this.onAfterChange} />
        </Layout>
        <Layout
          style={{backgroundColor: "white", width: "100%", height:"35%"}}
        >
          <div style={{ overflow: "scroll" }}>
            <br/>
            <p>{this.state.filecontent}</p>
          </div>
          
        </Layout>
    </Layout>
    )
  }
}
