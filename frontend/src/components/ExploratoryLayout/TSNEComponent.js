import HeatmapComponent from './HeatmapComponent';
import { Button,InputNumber ,Typography, Select, Slider, Layout } from 'antd';
import React, { Component } from 'react'
import * as tsnejs from "./tsne"
import * as d3 from "d3";
import * as d3queue from 'd3-queue'
import Papa from 'papaparse'

const { Option } = Select;
const { Paragraph } = Typography;

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
var day_colors = [
  "#1b70fc", "#faff16", "#d50527", "#158940", "#f898fd", "#24c9d7",
      "#cb9b64", "#866888", "#22e67a", "#e509ae"
]

export default class TSNEComponent extends Component {
  
  constructor(props) {
    super(props)
    this.heatmapvis = React.createRef();
    this.tsnevis = React.createRef();
    this.state = {
      data: [],
      testdata:[],
      data_name: "similarities1",
      perplexity: 5,
      epsilon: 10,
      step: 6000,
      labels: [1, 4],
      dist: [[0.1, 0.4, 0.2], [0.3, 0.2, 0.1], [0.1, 0.1]],
      change_data: false,
      load_everything: false,
      click_load_everything: false,
      heatmap_data: undefined
    }
    this.updateData = this.updateData.bind(this);
    this.importCSV = this.importCSV.bind(this);
    this.importAllCSV = this.importAllCSV.bind(this);
  }

  componentDidMount() {
    this.importCSV(`../static/files/${this.state.data_name}.csv`)
    this.importAllCSV([1, 2, 3]);
  }

  componentDidUpdate() {
    if (this.state.change_data == true) {
      this.handleSvgRefresh()
      console.log("dist before tsne", this.state.dist)
      this.TSNEBuild(this.state.dist, colors)
      this.setState({
        change_data: false
      })
    }
    if (this.state.load_everything == true) {
      this.handleSvgRefresh()
      console.log("before preproc:" , this.state.testdata)
      this.dataPreProcSubject(this.state.testdata)
      console.log("before all tsne: ",this.state.dist)
      this.TSNEBuild(this.state.dist, day_colors)
      this.setState({
        load_everything: false
      })
    }
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

  importAllCSV = (arraypath) => {
    this.setState({
      testdata: []
    })
    for (let index = 0; index < arraypath.length; index++) {
      const element = arraypath[index];
      var path = `../static/files/similarities${element}.csv`
      Papa.parse(path, {
        header: true,
        download: true,
        dynamicTyping: true,
        complete: this.updateAllData
      });
    }
    
  }


  //Data Preprocessing
  indexOf = (lbls, value) => {
    for (let index = 0; index < lbls.length; index++) {
      if (lbls[index] == value) {
        return index
      }
    }
  }

  dataPreProcSubject = (data) => {
    var lst = []
    var lbls = []
    var idcount = 0
    for (let index = 0; index < data.length - 1; index++) {
      var element = data[index]
      var element2 = data[index + 1]
      if (element.IDPF != element2.IDPF) {
        idcount = idcount + 1
        lbls.push(element.IDPF)
      }
    }
    for (let index = 0; index < idcount; index++) {
      var lst_elem = []
      for (let value = 0; value < idcount; value++) {
        lst_elem.push(0)
      }
      lst.push(lst_elem)
    }

    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      const indexofrow = this.indexOf(lbls, element.IDPF)
      //console.log("index of row", indexofrow)
      for (let value = 0; value < data.length; value++) {
        const element2 = data[value];
        if (element.IDPF == element2.IDPF) {
          var col_val = this.indexOf(lbls, element2.IDPT)
          //console.log("index of col", col_val)
          if (col_val != undefined) {
            lst[indexofrow][col_val] = element2.Similarity
          }
        }
      }
    }

    console.log("TSNE Matrix", lst)
    this.setState({
      labels: lbls,
      dist: lst
    })
    
  }

  datapreprocHeatMap = (lst) => {
    var heatmap_x = []
    var heatmap_y = []
    for (let index = 0; index < lst.length; index++) {
      const elem = lst[index];
      var sum = 0;
      for (let value = 0; value < elem.length; value++) {
        sum = sum + elem[value]
      }
      var average = sum / elem.length
      heatmap_x.push(index)
      heatmap_y.push(average)
    }
    //console.log("X axis id", heatmap_x)
    //console.log("Y axis probabilities", heatmap_y)
  }

  updateAllData = (results) => {
    const daydata = results.data
    this.setState({
      testdata: this.state.testdata.concat(daydata)
    })
    console.log("data concat",this.state.testdata)
  }

  updateData = (results)=> {
    const data  = results.data
    console.log(data)
    //this.dataPreProc(data)
    this.dataPreProcSubject(data)
    this.setState({
      change_data: true
    })
    
  }


  //Handlers 
  handleChangePerplexity = value => {
    this.setState({ perplexity: value });
  };
  handleChangeEpsilon = value => {
    this.setState({ epsilon: value });
  };
  handleOnChangeStep = value => {
    this.setState({
      step : value
    })
  }
  handleSvgRefresh = () => {
    d3.select("#similarity").selectAll("svg").remove();
    d3.select("#similarity").selectAll("div").remove();
    d3.select("#similarity").append("svg")
      .attr("width", 600)
      .attr("height", 840)
      .append("g")
      .attr("class", "graph");
  }
  handleSelect = (value) => {
    this.setState({
      data_name: "similarities" + String(value)
    })
    console.log(this.state.data_name)
  }
  handleOnClick = () => {
    this.setState({
      change_data: true,
      load_everything: false
    })
  }
  handleOnClickLoadEverything = async () => {
    this.setState({
      change_data: false,
      load_everything: true
    })
  }


  //Builders
  TSNEBuild = (data, colors) => {
    //   var colors = [
    //   "#1b70fc", "#faff16", "#d50527", "#158940", "#f898fd", "#24c9d7",
    //   "#cb9b64", "#866888", "#22e67a", "#e509ae", "#9dabfa", "#437e8a",
    //   "#b21bff", "#ff7b91", "#94aa05", "#ac5906", "#82a68d", "#fe6616",
    //   "#7a7352", "#f9bc0f", "#b65d66", "#07a2e6", "#c091ae", "#8a91a7",
    //   "#88fc07", "#ea42fe", "#9e8010", "#10b437", "#c281fe", "#f92b75",
    //   "#07c99d", "#a946aa", "#bfd544", "#16977e", "#ff6ac8", "#a88178",
    //   "#5776a9", "#678007", "#fa9316", "#85c070", "#6aa2a9", "#989e5d",
    //   "#fe9169", "#cd714a", "#6ed014", "#c5639c", "#c23271", "#698ffc",
    //   "#678275", "#c5a121", "#a978ba", "#ee534e", "#d24506", "#59c3fa",
    //   "#ca7b0a", "#6f7385", "#9a634a", "#48aa6f", "#ad9ad0", "#d7908c",
    //   "#6a8a53", "#8c46fc", "#8f5ab8", "#fd1105", "#7ea7cf", "#d77cd1",
    //   "#a9804b", "#0688b4", "#6a9f3e", "#ee8fba", "#a67389", "#9e8cfe",
    //   "#bd443c", "#6d63ff", "#d110d5", "#798cc3", "#df5f83", "#b1b853",
    //   "#bb59d8", "#1d960c", "#867ba8", "#18acc9", "#25b3a7", "#f3db1d",
    //   "#938c6d", "#936a24", "#a964fb", "#92e460", "#a05787", "#9c87a0",
    //   "#20c773", "#8b696d", "#78762d", "#e154c6", "#40835f", "#d73656",
    //   "#1afd5c", "#c4f546", "#3d88d8", "#bd3896", "#1397a3", "#f940a5",
    //   "#66aeff", "#d097e7", "#fe6ef9", "#d86507", "#8b900a", "#d47270",
    //   "#e8ac48", "#cf7c97", "#cebb11", "#718a90", "#e78139", "#ff7463", "#bea1fd"
    // ]

    var svg_tsne = d3.select("#similarity").selectAll("svg"),
    width = +svg_tsne.node().getBoundingClientRect().width,
    height = +svg_tsne.node().getBoundingClientRect().height;

    var x_offset = width/6;
    var y_offset = height/6;

    var opt = {}
    opt.epsilon = this.state.epsilon; // epsilon is learning rate (10 = default) 
    opt.perplexity = this.state.perplexity; // roughly how many neighbors each point influences (30 = default)
    opt.dim = 2; // dimensionality of the embedding (2 = default)

    var tsne = new tsnejs.tSNE(opt); // create a tSNE instance
    var lbls = this.state.labels;
    var step = this.state.step;
    d3queue.queue()
    .await(function(error, nodes, links) {
      //console.log(data)
      //console.log(data.length)//[[1.0, 0.1, 0.2], [0.1, 1.0, 0.3], [0.2, 0.1, 1.0]];
      tsne.initDataDist(data);

      for(var k = 0; k < step; k++) {
        tsne.step(); // every time you call this, solution gets better
      }

      var Y = tsne.getSolution(); // Y is an array of 2-D points that you can plot

      console.log("Y: ", Y)

      // Set the ranges and domain
      var xScale = d3.scaleLinear().domain([d3.min(Y, function(d) { return d[0] }), d3.max(Y, function(d) { return d[0] })]).range([0+x_offset, width-x_offset]);
      //var yScale = d3.scaleLinear().range([height, 0]);
      var yScale = d3.scaleLinear().domain([d3.min(Y, function(d) { return d[1] }), d3.max(Y, function(d) { return d[1] })]).range([0+y_offset, height-y_offset]);
      
      var g_tsne = svg_tsne.append("g")
        .attr("class", "everything")
        .style('pointer-events', 'all');
      
      // Add X axis
      const x = d3.scaleLinear()
        .domain([0, 1])
        .range([ 0,  width - 40%width]);
      svg_tsne.append("g")
        .attr("class", "myXaxis")   // Note that here we give a class to the X axis, to be able to call it later and modify it
        .attr("transform", `translate(${30%height}, ${height - 20%height})`)
        .call(d3.axisBottom(x))
        .attr("opacity", "1")

      // Add Y axis
      const y = d3.scaleLinear()
        .domain([1, 0])
        .range([ -height + 30%height, 0]);
      svg_tsne.append("g")
        .attr("class", "myYaxis")   // Note that here we give a class to the X axis, to be able to call it later and modify it
        .attr("transform", `translate(${30%height},${height - 20%height })`)
        .call(d3.axisLeft(y))
        .attr("opacity", "1")

      
      
      // Add title to graph
      svg_tsne.append("text")
              .attr("x", 0)
              .attr("y", -50)
              .attr("text-anchor", "left")
              .style("font-size", "22px")
              .text("Cluster of the employees");

      // Add subtitle to graph
      svg_tsne.append("text")
              .attr("x", 0)
              .attr("y", -20)
              .attr("text-anchor", "left")
              .style("font-size", "14px")
              .style("fill", "grey")
              .style("max-width", 400)
              .text("TSNE to represent the cluster of people that sent the same email with the similar Subject headers.");

      // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
      // Its opacity is set to 0: we don't see it by default.
      var tooltip = d3.select("#similarity")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")


      // A function that change this tooltip when the user hover a point.
      // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
      const mouseover = function (event, d) {
        tooltip
          .style("opacity", 1)
      };

      const mousemove = function (event, d) {
        tooltip
          .html(`The exact value of<br>the Ground Living area is: ${4}`)
          .style("left", (event.x) / 2 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
          .style("top", (event.y) / 2 + "px")
      };

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
      const mouseleave = function (event, d) {
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0)
      };

      g_tsne.on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);

      g_tsne.selectAll("dot")
        .data(Y)
        .enter()
        .append("circle")
          .transition()
          .delay(function (d, i) { return (i * 3) })
          .duration(2000)
          .attr("r", 6)
          .attr("cx", function (d) { return xScale(d[0]) })
          .attr("cy", function (d) { return yScale(d[1]) })
          .style("fill", function (d, i) {
            let idx = lbls[i % (lbls.length)];
            return colors[idx]
          })
        
    });
  }
  
  
  render() {
    return (
     <Layout style={{ width: "100%", display: "flex", justifyContent: "flex-start", alignItemsArr: "center", flexDirection: "row" }}>
            <Layout style={{
              display:'flex', backgroundColor: 'white',width: "10%"
            }}>
               <Paragraph style={{marginTop: 20}}>Choose the date form a specific day</Paragraph>
                <Select
                  showSearch
                  style={{ width: "90%", marginTop: 20 }}
                  placeholder="Search to Select"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                  }
                  onChange={this.handleSelect}
                >
                  <Option value="1">6th</Option>
                  <Option value="2">7th</Option>
                  <Option value="3">8th</Option>
                  <Option value="4">9th</Option>
                  <Option value="5">10th</Option>
                  <Option value="6">13th</Option>
                  <Option value="7">14th</Option>
                  <Option value="8">15th</Option>
                  <Option value="9">16th</Option>
                  <Option value="10">17th</Option>
              </Select>
              <Paragraph style={{marginTop: 20}}>Set the value of Perplexity</Paragraph>
              <Slider style={{ width: "80%" }} onChange={this.handleChangePerplexity} value={this.state.perplexity} />
              <Paragraph style={{marginTop: 20}}>Set the value of Epsilon</Paragraph  >
              <Slider style={{ width: "80%" }} onChange={this.handleChangeEpsilon} value={this.state.epsilon} />
              <Paragraph style={{marginTop: 20}}>Set the value of Step</Paragraph  >
              <InputNumber style={{ width: "90%" }} min={1} max={10000} defaultValue={6000} onChange={this.handleOnChangeStep} /> 
              <Button style={{ marginTop: 20, width: "90%" }} onClick={() => this.handleOnClick()}>Refresh SVg</Button>
              {/* <Button style={{marginTop: 20, width: "90%"}} onClick={() => this.handleOnClickLoadEverything()}>Load everything</Button> */}
            </Layout>
            <Layout  style={{width: 700,border: '2px solid black'}}>
               <HeatmapComponent datapath={this.state.data_name} changedata={this.state.change_data}></HeatmapComponent>
            </Layout>
               
            <Layout style={{ display:"flex",width: 600,border: '2px solid black'}} >
                <div
                  id="similarity"
                  style={{
                     display: "flex", width: 595,height: 937, backgroundColor: "white"}}
                  ref={this.tsnevis}>
                  <svg
                     style={{
                        width: 400,height: 930 }}>

                  </svg>
               </div>
               
            </Layout>
            
         </Layout>
    )
  }
}

