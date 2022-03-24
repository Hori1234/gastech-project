import HeatmapComponent from './HeatmapComponent';
import { Button, Layout } from 'antd';
import React, { Component } from 'react'
import * as tsnejs from "./tsne"
import * as d3 from "d3";
import * as d3queue from 'd3-queue'
import Papa from 'papaparse'
const fs = require('fs')



export default class TSNEComponent extends Component {
  
  constructor(props) {
    super(props)
    this.heatmapvis = React.createRef();
    this.tsnevis = React.createRef();
    this.state = {
      data: [],
      labels: [1,4],
      dist: [[0.1,0.4,0.2],[0.3,0.2,0.1],[0.1,0.1]],
      change_data: false
    }
    this.updateData = this.updateData.bind(this);
  }

  componentDidMount() {
    this.TSNEBuild(this.state.dist)
  }

  componentDidUpdate() {
    if (this.state.change_data == true) {
       this.TSNEBuild(this.state.dist)
     } 
  }

  handleChange = event => {
    this.setState({
      data: event.target.files[0]
    });
  };

  importCSV = () => {
    const { data } = this.state;
    Papa.parse(data, {
      complete: this.updateData,
      header: true
    });
    
  };

  dataPreProc = (data) => {
    var lst = []
    var lbls = []
    var lst_elem = []
    var max_ = 0
    var max = 0
    for (let index = 0; index < data.length - 1; index++) {
      max = max + 1
      const element = data[index];
      const element2 = data[index + 1]
      lst_elem.push(element.Similarity)
      //console.log(element.IDPF)
      if (element.IDPF != element2.IDPF) {
        lst.push(lst_elem)
        lst_elem = []
        lbls.push(element.IDPF)
        if (max > max_) {
          max_ = max
        }
        max = 0
      }
     
    }
    console.log(max_)
    for (let index = 0; index < lst.length; index++) {
      const elem = lst[index];
      console.log(max_ - elem.length)
      var treshold = max_ - elem.length
      for (let value = 0; value < treshold; value++) {
        elem.push(0.1)
      }
    }
    console.log(lst)
    console.log(lbls)
    this.setState({
      labels: lbls,
      dist: lst
    })
  }

  updateData(result) {
    var data = result.data;
    console.log(data);
    this.dataPreProc(data)
    this.setState({
      change_data: true
    })
    
  }


  TSNEBuild = (data) => {
      var colors = [
      "#1b70fc", "#faff16", "#d50527", "#158940", "#f898fd", "#24c9d7",
      "#cb9b64", "#866888", "#22e67a", "#e509ae", "#9dabfa", "#437e8a",
      "#b21bff", "#ff7b91", "#94aa05", "#ac5906", "#82a68d", "#fe6616",
      "#7a7352", "#f9bc0f", "#b65d66", "#07a2e6", "#c091ae", "#8a91a7",
      "#88fc07", "#ea42fe", "#9e8010", "#10b437", "#c281fe", "#f92b75",
      "#07c99d", "#a946aa", "#bfd544", "#16977e", "#ff6ac8", "#a88178",
      "#5776a9", "#678007", "#fa9316", "#85c070", "#6aa2a9", "#989e5d",
      "#fe9169", "#cd714a", "#6ed014", "#c5639c", "#c23271", "#698ffc",
      "#678275", "#c5a121", "#a978ba", "#ee534e", "#d24506", "#59c3fa",
      "#ca7b0a", "#6f7385", "#9a634a", "#48aa6f", "#ad9ad0", "#d7908c",
      "#6a8a53", "#8c46fc", "#8f5ab8", "#fd1105", "#7ea7cf", "#d77cd1",
      "#a9804b", "#0688b4", "#6a9f3e", "#ee8fba", "#a67389", "#9e8cfe",
      "#bd443c", "#6d63ff", "#d110d5", "#798cc3", "#df5f83", "#b1b853",
      "#bb59d8", "#1d960c", "#867ba8", "#18acc9", "#25b3a7", "#f3db1d",
      "#938c6d", "#936a24", "#a964fb", "#92e460", "#a05787", "#9c87a0",
      "#20c773", "#8b696d", "#78762d", "#e154c6", "#40835f", "#d73656",
      "#1afd5c", "#c4f546", "#3d88d8", "#bd3896", "#1397a3", "#f940a5",
      "#66aeff", "#d097e7", "#fe6ef9", "#d86507", "#8b900a", "#d47270",
      "#e8ac48", "#cf7c97", "#cebb11", "#718a90", "#e78139", "#ff7463", "#bea1fd"
    ]

    var svg_tsne = d3.select("#similarity").selectAll("svg"),
    width = +svg_tsne.node().getBoundingClientRect().width,
    height = +svg_tsne.node().getBoundingClientRect().height;

    var x_offset = width/6;
    var y_offset = height/6;

    var opt = {}
    opt.epsilon = 5; // epsilon is learning rate (10 = default)
    opt.perplexity = 10; // roughly how many neighbors each point influences (30 = default)
    opt.dim = 2; // dimensionality of the embedding (2 = default)

    var tsne = new tsnejs.tSNE(opt); // create a tSNE instance
    var lbls = this.state.labels

    d3queue.queue()
    .await(function(error, nodes, links) {
      console.log(data)
      console.log(data.length)//[[1.0, 0.1, 0.2], [0.1, 1.0, 0.3], [0.2, 0.1, 1.0]];
      tsne.initDataDist(data);

      for(var k = 0; k < 6000; k++) {
        tsne.step(); // every time you call this, solution gets better
      }

      var Y = tsne.getSolution(); // Y is an array of 2-D points that you can plot

      console.log("Y: ", Y)

      // Set the ranges and domain
      var xScale = d3.scaleLinear().domain([d3.min(Y, function(d) { return d[0] }), d3.max(Y, function(d) { return d[0] })]).range([0+x_offset, width-x_offset]);
      //var yScale = d3.scaleLinear().range([height, 0]);
      var yScale = d3.scaleLinear().domain([d3.min(Y, function(d) { return d[1] }), d3.max(Y, function(d) { return d[1] })]).range([0+y_offset, height-y_offset]);
      
      var g_tsne = svg_tsne.append("g")
            .attr("class", "everything");

      g_tsne.selectAll("dot")
        .data(Y)
        .enter()
        .append("circle")
        .attr("r", 6)
        .attr("cx", function(d) { return xScale(d[0]) })
        .attr("cy", function(d) { return yScale(d[1]) })
        .style("fill", function(d,i){
          let idx = lbls[i%(lbls.length)];
          return colors[idx]
        })

    });
  }
  
  
  render() {
    return (
     <Layout style={{ width: "100%", display: "flex", justifyContent: "flex-start", alignItemsArr: "center", flexDirection: "row" }}>
            <Layout style={{
              display:'flex', backgroundColor: 'white',width: "20%"
            }}>
               <div className="App">
                  <h2>Import CSV File!</h2>
                  <input
                    className="csv-input"
                    type="file"
                    ref={input => {
                      this.filesInput = input;
                    }}
                    name="file"
                    placeholder={null}
                    onChange={this.handleChange}
                  />
                  <p />
                <button onClick={this.importCSV}> Upload now!</button>
                <button onClick={() => this.TSNEBuild(this.state.dist)}> Reload</button>
              </div>
            </Layout>
            <Layout  style={{ display:"flex",border: '2px solid black'}}>
               <HeatmapComponent></HeatmapComponent>
            </Layout>
               
            <Layout style={{ display:"flex",width: "40%",border: '2px solid black'}} >
                <div
                  id="similarity"
                  style={{
                     display: "flex", width: "100%",height: "100%", backgroundColor: "white"}}
                  ref={this.tsnevis}>
                  <svg
                     style={{
                        width: "100%",height: "100%" }}>

                  </svg>
               </div>
               
            </Layout>
            
         </Layout>
    )
  }
}

