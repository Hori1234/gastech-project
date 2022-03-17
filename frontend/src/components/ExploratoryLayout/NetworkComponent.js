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
		<div
			class="controls"
			style="
				
				top: 10px;
				left: 10px;
				width: 200px;
				height: 100%;
				border: 3px solid black;
				border-radius: 10px;
			"
		>
			<div class="force" style="border-radius: 10px">
				<p>
					<label
						><input
							type="checkbox"
							checked
							onchange="forceProperties.charge.enabled = this.checked; updateAll();"
						/>
						charge</label
					>
					Attracts (+) or repels (-) nodes to/from each other.
				</p>
				<label
					title="Negative strength repels nodes. Positive strength attracts nodes."
				>
					strength
					<output id="charge_StrengthSliderOutput">-30</output>
					<input
						type="range"
						min="-200"
						max="50"
						value="-130"
						step=".1"
						oninput="d3.select('#charge_StrengthSliderOutput').text(value); forceProperties.charge.strength=value; updateAll();"
					/>
				</label>
			</div>

			<div class="force">
				<p>
					<label
						><input
							type="checkbox"
							checked
							onchange="forceProperties.link.enabled = this.checked; updateAll();"
						/>
						link</label
					>
					Sets link length
				</p>
				<label title="The force will push/pull nodes to make links this long">
					distance
					<output id="link_DistanceSliderOutput">100</output>
					<input
						type="range"
						min="0"
						max="500"
						value="100"
						step="1"
						oninput="d3.select('#link_DistanceSliderOutput').text(value); forceProperties.link.distance=value; updateAll();"
					/>
				</label>
			</div>
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

      script2.src = "/static/libs/code_network.js";
      script2.async = false;
      this.div.appendChild(script2);

      script4.src = "/static/libs/tsne.js";
      script4.async = false;
      this.div.appendChild(script4);

      script5.src = "/static/libs/code_tsne.js";
      script5.async = false;
      this.div.appendChild(script5);

   }
   
   
   
   render() {
      return (
         <Layout style={{ width: "100%", display: "flex", justifyContent: "flex-start", alignItemsArr: "center", flexDirection: "row" }}>
            <Layout style={{
              display:'flex', backgroundColor: 'white',width: "20%"
            }}>
               <div style={{ width: 10}} dangerouslySetInnerHTML={ {__html: htmlString} } />
            </Layout>
            <Layout  style={{ display:"flex",width: "40%",border: '2px solid black'}}>
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
               
            <Layout style={{ display:"flex",width: "40%",border: '2px solid black'}} >
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
            
         </Layout>
         
    )
  }
}
