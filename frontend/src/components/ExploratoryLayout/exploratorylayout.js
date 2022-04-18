import React, { Component } from 'react'
import {Layout } from "antd";
import "antd/dist/antd.css";
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
        backgroundColor: "white", display: "flex", width: "100%"
      }}>
        

        <Layout style={{
          backgroundColor: "green", width: "100%", height: "95%",
          justifyContent: "center",alignItems:"center",
        }}>
  
          <TSNEComponent />
          
        </Layout>

      </Layout>
    )
  }
}
