import React, { Component } from 'react'
import { Divider, Button, Layout, Typography, message } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import NetworkComponent from './NetworkComponent';
import HeatmapComponent from './HeatmapComponent';
import TSNEComponent from './TSNEComponent';

export default class exploratorylayout extends Component {
  constructor(props) {
    super(props);
    const data = [ 'one', 'two', 'three' ]
    this.state = {
      graphstate : null,
      
    };
  }
  componentDidMount() {
     this.setState({
      graphstate: "network",
    });
   }

  changeGraphState = (value) => {
    this.setState({
      graphstate: value,
    });
  }

  render() {
    return (
      <Layout style={{
        backgroundColor: "pink", display: "flex", width: "100%"
      }}>
        <Layout
          style={{
            backgroundColor: "yellow", display: "flex", width: "100%", flexDirection: "row", height: "5%",
            justifyContent: "flex-start",alignItemsArr:"center"
        }}>
          <Button
            style={{ marginLeft: 10,}}
            onClick={()=>this.changeGraphState("network")}>
            Network Graph</Button>
          <Button
            style={{ marginLeft: 10,}}
            onClick={()=>this.changeGraphState("tsne")}>
            t-SNE</Button>
          <Button
            style={{ marginLeft: 10,}}
            onClick={()=>this.changeGraphState("heatmap")}>
            Heatmap</Button>

        </Layout>

        <Layout style={{
          backgroundColor: "green", width: "100%", height: "95%",
          justifyContent: "center",alignItems:"center",
        }}>
          {this.state.graphstate === "network" && <NetworkComponent data={[5,10,1,3]} size={[500,500]}/>}
          {this.state.graphstate === "heatmap" && <HeatmapComponent />}
          {this.state.graphstate === "tsne" && <TSNEComponent/>}
        </Layout>

      </Layout>
    )
  }
}
