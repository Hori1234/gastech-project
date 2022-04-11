import React, { Component } from 'react'
import * as d3_scale_cromatic from 'd3-scale-chromatic'
import * as d3 from 'd3'

    
export default class HeatmapComponent extends Component {
  
  
  constructor(props) {
    super(props)
    
    this.HeatmapBuild = this.HeatmapBuild.bind(this);
  }

  componentDidMount() {
    this.HeatmapBuild()
  }

  componentDidUpdate() {
    if (this.props.changedata == true) {
      this.handleSvgRefresh()
      this.HeatmapBuild()
    }
  }

  handleSvgRefresh = () => {
    d3.select("#heatmap").selectAll("svg").remove();
    d3.select("#heatmap").selectAll("div").remove();
  }

  HeatmapBuild = () => {
    const margin = {top: 100, right: 25, bottom: 30, left: 50},
  width = 600 ,
  height = 680 ;

  // append the svg object to the body of the page
    const svg = d3.select("#heatmap")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  //Read the data
  d3.csv(`../static/files/${this.props.datapath}.csv`).then(function(data) {

    // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
    const myGroups = Array.from(new Set(data.map(d => d.IDPF)))
    const myVars = Array.from(new Set(data.map(d => d.Subject)))

    console.log("My groups", myGroups);
    console.log("my vars", myVars)

    // Build X scales and axis:
    const x = d3.scaleBand()
      .range([ 0, width ])
      .domain(myGroups)
      .padding(0.05);
    svg.append("g")
      .style("font-size", 15)
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickSize(0))
      .select(".domain").remove()

    // Build Y scales and axis:
    const y = d3.scaleBand()
      .range([ height, 0 ])
      .domain(myVars)
      .padding(0.05);
    svg.append("g")
      .style("font-size", 15)
      .call(d3.axisLeft(y).tickSize(0))
      .select(".domain").remove()

    // Build color scale
    const myColor = d3.scaleSequential()
      .interpolator(d3.interpolateInferno)
      .domain([1,0.5])

    // create a tooltip
    const tooltip = d3.select("#heatmap")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", 30)
      .style("border-height",15)
      .style("border-radius", "2px")
      .style("padding", "2px")

    // add the squares
    svg.selectAll()
      .data(data, function(d) {return d.IDPF+':'+d.Subject;})
      .join("rect")
        .attr("x", function(d) { return x(d.IDPF) })
        .attr("y", function(d) { return y(d.Subject) })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("width", x.bandwidth() )
        .attr("height", y.bandwidth() )
        .style("fill", function(d) { return myColor(d.Similarity)} )
        .style("stroke-width", 4)
        .style("stroke", "none")
        .style("opacity", 0.8)
      .on("mouseover", function(event,d) {
        tooltip
          .style("opacity", 1)
        d3.select(this)
          .style("stroke", "black")
          .style("opacity", 1)
      })
      .on("mousemove", function(event,d) {
        const [x, y] = d3.pointer(event);
        tooltip
          .html("The exact value of<br>this cell is: " + d.Similarity)
          .attr('transform', `translate(${x}, ${y})`);
      })
      .on("mouseleave", function(event,d) {
        tooltip
          .style("opacity", 0)
        d3.select(this)
          .style("stroke", "none")
          .style("opacity", 0.8)
      })
  })

  // Add title to graph
  svg.append("text")
          .attr("x", 0)
          .attr("y", -50)
          .attr("text-anchor", "left")
          .style("font-size", "22px")
          .text("Heatmap for the density of the subject heathers");

  // Add subtitle to graph
  svg.append("text")
          .attr("x", 0)
          .attr("y", -20)
          .attr("text-anchor", "left")
          .style("font-size", "14px")
          .style("fill", "grey")
          .style("max-width", 400)
          .text("Heatmap to show the similarity in texts sent by the employees between the employees in the specified date.");

  }
  render() {
    return (
      <div id="heatmap"
                  style={{ height:837,
                   backgroundColor: "white"
                  }}
                  ref={this.heatmapvis}
               >
      </div>
    )
  }
}
