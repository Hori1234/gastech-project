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

  HeatmapBuild = () => {
    const margin = {top: 300, right: 25, bottom: 30, left: 50},
  width = 450 ,
  height = 450 ;

  // append the svg object to the body of the page
  const svg = d3.select("#heatmap").selectAll("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  //Read the data
  d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv").then(function(data) {

    // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
    const myGroups = Array.from(new Set(data.map(d => d.group)))
    const myVars = Array.from(new Set(data.map(d => d.variable)))

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
      .domain([1,100])

    // create a tooltip
    const tooltip = d3.select("#heatmap")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function(event,d) {
      tooltip
        .style("opacity", 1)
      d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }
    const mousemove = function(event,d) {
      tooltip
        .html("The exact value of<br>this cell is: " + d.value)
        .style("left", (event.x)/2 + "px")
        .style("top", (event.y)/2 + "px")
    }
    const mouseleave = function(event,d) {
      tooltip
        .style("opacity", 0)
      d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.8)
    }

    // add the squares
    svg.selectAll()
      .data(data, function(d) {return d.group+':'+d.variable;})
      .join("rect")
        .attr("x", function(d) { return x(d.group) })
        .attr("y", function(d) { return y(d.variable) })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("width", x.bandwidth() )
        .attr("height", y.bandwidth() )
        .style("fill", function(d) { return myColor(d.value)} )
        .style("stroke-width", 4)
        .style("stroke", "none")
        .style("opacity", 0.8)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
  })

  // Add title to graph
  svg.append("text")
          .attr("x", 0)
          .attr("y", -50)
          .attr("text-anchor", "left")
          .style("font-size", "22px")
          .text("A d3.js heatmap");

  // Add subtitle to graph
  svg.append("text")
          .attr("x", 0)
          .attr("y", -20)
          .attr("text-anchor", "left")
          .style("font-size", "14px")
          .style("fill", "grey")
          .style("max-width", 400)
          .text("A short description of the take-away message of this chart.");

  }
  render() {
    return (
      <div id="heatmap"
                  style={{ display:"flex",
                  height: "100%", backgroundColor: "white"
                  }}
                  ref={this.heatmapvis}
               >
                  
                  <svg style={{ width: "100%",
                  height: "100%" }}>

                  </svg>
            
      </div>
    )
  }
}
