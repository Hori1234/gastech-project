import React, { Component } from 'react'
import { Divider, Button, Layout, Typography, message } from "antd";

import "antd/dist/antd.css";

var htmlString = ` <head>
		<style>
            /* HTML styles */
            html{ width: 100%; }
            
            .controls .tSNE {
            background-color:#B0E0E6;
            border-radius: 3px;
            padding: 5px;
            margin: 5px 0;
            }
        
            /* SVG styles */
            svg {
                flex-basis: 100%;
                min-width: 200px;
            }
            .links line {
                stroke: #aaa;
            }
            .nodes circle {
                pointer-events: all;
            }

            .selection {
                fill: #ADD8E6;
                stroke: #ADD8E6;
                fill-opacity: 0.3;
                stroke-opacity: 0.7;
                stroke-width: 2;
                stroke-dasharray: 5, 5;
            }

            div#container_email {
                /*background-color: black;*/
                opacity: 1.0;
                height: 2500px;
                width: 400px;
                /* border:2px solid #000; */
                overflow: scroll;
            }

            div#container_sender {
                /*background-color: black;*/
                opacity: 1.0;
                height: 1500px;
                width: 900px;
                /* border:2px solid #000; */
                overflow: scroll;
            }

            div#container_date {
                /*background-color: black;*/
                opacity: 1.0;
                height: 2900px;
                width: 200px;
                /* border:2px solid #000; */
                overflow: scroll;
            }
        
        </style>

	</head>
	<body>
		<div class="controls" style=" top:10px; left: 10px; width:210px;
                    height:890px; border:2px solid black; border-radius: 10px;">
            <div class="tSNE" style="border-radius: 10px;">
                <p> <b>Controls for t-SNE</b> </p>
                    <label>
                        perplexity
                        <output id="tsne_PerplexitySliderOutput">10</output>
                        <!-- <input type="range" min="2" max="100" value="30" step="1" oninput="d3.select('#tsne_PerplexitySliderOutput').text(value); tSNEProperties.perplexity=value; updateAll();"> -->
                        <input autocomplete="off" type="range" min="2" max="100" value="30" step="1" oninput="d3.select('#tsne_PerplexitySliderOutput').text(value);">
                    </label>
                    <label>
                        step
                        <output id="tsne_StepSliderOutput">1000</output>
                        <!-- <input type="range" min="100" max="10000" value="5000" step="500" oninput="d3.select('#tsne_StepSliderOutput').text(value); tSNEProperties.step=value; updateAll();"> -->
                        <input autocomplete="off" type="range" min="100" max="10000" value="5000" step="50" oninput="d3.select('#tsne_StepSliderOutput').text(value);">
                    </label>
                    <label>
                        epsilon
                        <output id="tsne_EpsilonSliderOutput">5</output>
                        <!-- <input type="range" min="1" max="20" value="5" step="1" oninput="d3.select('#tsne_EpsilonSliderOutput').text(value); tSNEProperties.epsilon=value; updateAll();"> -->
                        <input autocomplete="off" type="range" min="1" max="20" value="5" step="1" oninput="d3.select('#tsne_EpsilonSliderOutput').text(value);">
                    </label>
            </div>
			 <!-- button for plotting the tSNE plot -->
            <div id="option">
                <input name="plotButton" 
                       type="button" 
                       value="Plot tSNE" 
                       onclick="plotData()" />
            </div>

		<!-- DOM for the tSNE legend (list of date) -->
        <div id="DimensionalityReductionLegend" style=" top: 20px; left: 15px; width:200px;
                    height:290px; background-color:#B0E0E6; border-radius: 10px;"> <!-- background-color:#B0E0E6; -->
            <p> <b>Date</b> </p>
            <svg width="300px" height="30000px"></svg>
        </div>

		<!-- DOM for displaying the list of senders' name -->
        <div id="senders" style="top:550px; left: 15px; width:200px;
                    height:385px; background-color:#B0E0E6; border-radius: 10px;"> <!-- background-color:#B0E0E6; -->
            <p> <b>Senders</b> </p>
            <svg width="500px" height="30000px"></svg>
        </div>
	</body> `




export default class NetworkComponent extends Component {
   constructor(props) {
      super(props)
      
   }
   componentDidMount() {
      const script = document.createElement("script");
      const script1 = document.createElement("script");
      const script2 = document.createElement("script");
      const script3 = document.createElement("script");
      const script4 = document.createElement("script");
      const script5 = document.createElement("script");
      
      script.src = "/static/libs/d3.js";
      script.type = "text/javascript";
      script.async = false;
      this.div.appendChild(script);

      script1.src = "https://d3js.org/d3.v4.min.js";
      script1.type = "text/javascript";
      script1.charset = "utf-8";
      script1.async = false;
      this.div.appendChild(script1);

      script3.src = "http://d3js.org/queue.v1.min.js";
      script3.type = "text/javascript";
      script3.charset = "utf-8";
      script3.async = false;
      this.div.appendChild(script3);

    //   script2.src = "/static/libs/code_network.js";
    //   script2.async = false;
    //   this.div.appendChild(script2);

      script4.src = "/static/libs/tsne.js";
      script4.async = false;
	   this.div.appendChild(script4);

	script2.src = "/static/libs/code.js";
      script2.async = false;
      this.div.appendChild(script2);
	   

    //   script5.src = "/static/libs/code_tsne.js";
    //   script5.async = false;
    //   this.div.appendChild(script5);

   }
   
   
   
   render() {
      return (
         <Layout style={{ width: "100%", display: "flex", justifyContent: "flex-start", alignItemsArr: "center", flexDirection: "row" }}>
            <Layout style={{
              display:'flex', backgroundColor: 'white',width: "15%"
            }}>
               <div style={{ width: 10}} dangerouslySetInnerHTML={ {__html: htmlString} } />
			  </Layout>
			<Layout style={{ width: "35%", display: "flex", justifyContent: "flex-start", alignItemsArr: "center", flexDirection: "column" }}>
				  
				<Layout  style={{ display:"flex",width: "100%",height: "70%", border: '2px solid black'}}>
					<div id="DimensionalityReduction"
						style={{
							display: "flex", width: "100%",height: "100%", backgroundColor: "white"
							}}>
						<svg
								style={{
									width: "100%",height: "100%" }}>

						</svg>
               		</div>
					  
				</Layout>
				  
				 <Layout style={{ display:"flex",width: "100%",height: "30%",border: '2px solid black', backgroundColor: 'green'}}>
					<div id="EmailList" style={{display: "flex", width: "100%",height: "100%", backgroundColor: "white"}}>
						<svg style={{ width: "100%",
						height: "100%" }}>

						</svg>
					</div>
				</Layout>
				  
			</Layout>
			
			<Layout style={{ display: "flex", width: "10%", border: '2px solid black' }} >
				<div id="SendersName" style={{display: "flex", width: "100%",height: "100%", backgroundColor: "white"}}>
					<svg style={{display: "flex", width: "50%",height: "100%", backgroundColor: "white", translate: (-50,0)}}>

					</svg>
				</div>
               
            </Layout>
               
            <Layout style={{ display:"flex",width: "40%",border: '2px solid black'}} >
               <div id="network"
						style={{ display:"flex",
						height: "100%", backgroundColor: "white"
						}}
						ref={el => (this.div = el)}
					>
						
						<svg style={{ width: "100%",
						height: "100%" }}>

						</svg>
					
					</div>
               
            </Layout>
            
         </Layout>
         
    )
  }
}
