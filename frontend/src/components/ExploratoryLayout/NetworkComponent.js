import React, { Component } from 'react'
import { Divider, Button, Layout, Typography, message } from "antd";

import "antd/dist/antd.css";

var htmlString = ` <head>
		<style>
			/* HTML styles */
			
			.controls {
				flex-basis: 200px;
				padding: 0 5px;
			}
			.controls .force {
				background-color: #eee;
				border-radius: 3px;
				padding: 5px;
				margin: 5px 0;
			}
			.controls .force p label {
				margin-right: 0.5em;
				font-size: 120%;
				font-weight: bold;
			}
			.controls .force p {
				margin-top: 0;
			}
			.controls .force label {
				display: inline-block;
			}
			.controls input[type="checkbox"] {
				transform: scale(1.2, 1.2);
			}
			.controls input[type="range"] {
				margin: 0 5% 0.5em 5%;
				width: 90%;
			}
			/* alpha viewer */
			.controls .alpha p {
				margin-bottom: 0.25em;
			}
			.controls .alpha .alpha_bar {
				height: 0.5em;
				border: 1px #777 solid;
				border-radius: 2px;
				padding: 1px;
				display: flex;
			}
			.controls .alpha .alpha_bar #alpha_value {
				background-color: #555;
				border-radius: 1px;
				flex-basis: 100%;
			}
			.controls .alpha .alpha_bar:hover {
				border-width: 2px;
				margin: -1px;
			}
			.controls .alpha .alpha_bar:active #alpha_value {
				background-color: #222;
			}

			
		</style>
	</head>
	<body>
		<div class="controls" style=" top:10px; left: 10px; width:200px;
                    height:850px; border:3px solid black; border-radius: 10px;">
            <div class="perplexity" style="border-radius: 10px;">
                <p> <b>Controls for t-SNE</b> </p>
                    <label>
                        perplexity
                        <output id="tsne_PerplexitySliderOutput">10</output>
                        <input type="range" min="2" max="100" value="10" step="1" oninput="d3.select('#tsne_PerplexitySliderOutput').text(value); tSNEProperties.perplexity=value; updateAll();">
                    </label>
                    <label>
                        step
                        <output id="tsne_StepSliderOutputv">1000</output>
                        <input type="range" min="100" max="10000" value="3000" step="500" oninput="d3.select('#tsne_StepSliderOutput').text(value); tSNEProperties.step=value; updateAll();">
                    </label>
                    <label>
                        epsilon
                        <output id="tsne_EpsilonSliderOutputv">5</output>
                        <input type="range" min="1" max="20" value="5" step="1" oninput="d3.select('#tsne_EpsilonSliderOutput').text(value); tSNEProperties.epsilon=value; updateAll();">
                    </label>
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
						<div id="DimensionalityReductionLegend" style={{ marginTop:15, marginLeft: 5, width:"100",
							height:"270"}}> 
							<svg style={{width:"100", height:"270"}}>

							</svg>
						</div>
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
					<svg style={{display: "flex", width: "100%",height: "100%", backgroundColor: "white"}}>

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
