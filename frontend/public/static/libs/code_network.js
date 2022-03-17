var svg_network = d3.select("#network").selectAll("svg"),
    width = +svg_network.node().getBoundingClientRect().width,
    height = +svg_network.node().getBoundingClientRect().height;

// svg objects
var link, node;
// the data - an object with nodes and links
var graph;

//var colors = d3.scaleOrdinal(d3.schemeCategory20);    // NOT WORKING
//var colors = d3.schemeCategory20
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

//d3.queue()
//.defer(d3.csv, "nodes.csv")
//.defer(d3.csv, "links.csv")
//.await(function(error, nodes, links) {
//    if (error) {
//        console.error("Error: load file")
//    }
//    else {
//        const graph_ = {nodes: nodes, links: links}
//        graph = graph_
//        console.log(graph)
//        initializeDisplay();
//        initializeSimulation();
//    }
//});

d3.queue()
.defer(d3.csv, "/static/files/EmployeeRecords.csv")
.defer(d3.csv, "/static/files/emailheaders.csv")
.await(function(error, nodes, links) {
    if (error) {
        console.error("Error: load file")
    }
    else {
        //console.log(links)
        links_from_to = structuredClone(links)
        links_from_to.forEach(rowList => {
                //delete rowList.Date
                rowList.Date = rowList.Date.split(" ")[0]
                // console.log(rowList.Date)
                delete rowList.Subject
        })
        
        // REMOVE THE @ and . in all emails !!!
        linksFromTo = []
        links_from_to.forEach(rowList => {
            if (rowList.Date == "1/7/2014") {
                for (let key in rowList) {
                        var email_from
                        email_to = []
                    if (key == 'From') {
                        email_from = rowList[key]
                    }
                    if (key == 'To') {
                        email_to = [...rowList[key].split(", ")]
                    }
                    for (const email of email_to) {
                        email_temp = {From: email_from, To: email}
                        linksFromTo.push(email_temp)
                    }
                }
            }
        })

        linksFromTo.forEach(emailList => {
            for (let emailKey in emailList) {
                var emailparseFrom, emailparseTo
                if (emailKey == "From") {
                    var email = emailList[emailKey]
                    var nameFrom = email.substring(0, email.lastIndexOf("@")).replace(/\./g, "").replace(/\s/g, "").replace(/\-/g, "")
                    //var domain = email.substring(email.lastIndexOf("@") +1).replace(/\./g, "").replace(/\s/g, "").replace(/\-/g, "")
                    //emailparseFrom = name.concat(domain)
                    emailList.source = nameFrom
                    delete emailList.From
                }
                if (emailKey == "To") {
                    var email = emailList[emailKey]
                    var nameTo = email.substring(0, email.lastIndexOf("@")).replace(/\./g, "").replace(/\s/g, "").replace(/\-/g, "")
                    //var domain = email.substring(email.lastIndexOf("@") +1).replace(/\./g, "").replace(/\s/g, "").replace(/\-/g, "")
                    //emailparseTo = name.concat(domain)
                    emailList.target = nameTo
                    delete emailList.To
                }
                //emailList.FromTo = emailparseFrom.concat(emailparseTo)
                emailList.FromTo = nameFrom.concat(nameTo)
            }
        })

        let emailFromTo = linksFromTo.map(a => a.FromTo)

        emailFromTo_count = {}
        emailFromTo.forEach(function (x) {
            emailFromTo_count[x] = (emailFromTo_count[x] || 0) + 1;
        })
        
        //var count = 0;
        //for (var k in emailFromTo_count) {
        //    if (emailFromTo_count.hasOwnProperty(k)) count++;
        //}

        // remove duplication From sender To receiver
        const uniqueFromTo = []
        const linksFromTo_filter = linksFromTo.filter(element => {
            const isDuplicate = uniqueFromTo.includes(element.FromTo)
            if (!isDuplicate) {
                uniqueFromTo.push(element.FromTo)
                return true
            }
        })

        linksFromTo_filter.forEach(emailList => {
            for (let key in emailList) {
                if (key == "FromTo") {
                    emailList.FromToValue = emailFromTo_count[emailList[key]]
                }
            }
        })
        // console.log(linksFromTo_filter)     // !!!!!!!!!

        nodes.forEach(employee => {
            for (let key in employee) {
                employee[key] = employee[key].replace(/\./g, "").replace(/\s/g, "").replace(/\-/g, "");
            }
        })

        let currectEmploymentType = [...new Set(nodes.map(a => a.CurrentEmploymentType))]
        var i = 0
        const EmploymentType = Object.assign({}, ...Object.entries({...currectEmploymentType}).map(([a,b]) => ({[b]: i+=1})))
        //const EmploymentType_array = {EmploymentType: EmploymentType}

        let CurrentEmploymentTitle = [...new Set(nodes.map(a => a.CurrentEmploymentTitle))]
        var i = 0
        var EmploymentTitle = Object.assign({}, ...Object.entries({...CurrentEmploymentTitle}).map(([a,b]) => ({[b]: i+=1})))

        nodes.forEach(employee => {
            for (let key in employee) {
                if (key == "CurrentEmploymentType") {
                    employee.EmploymentTypeValue = EmploymentType[employee[key]]
                }
                else if (key == "CurrentEmploymentTitle") {
                    employee.EmploymentTitleValue = EmploymentTitle[employee[key]]
                }
                employee.Name = employee["FirstName"].concat(employee["LastName"])
            }
        })

        // console.log(nodes)      // !!!!!!!!!

        const graph_ = {nodes: nodes, links: linksFromTo_filter}
        graph = graph_
        console.log(graph)
        initializeDisplay();
        initializeSimulation();
    }
});

//////////// FORCE SIMULATION //////////// 

// force simulator
var simulation = d3.forceSimulation();

// set up the simulation and event to update locations after each tick
function initializeSimulation() {
  simulation.nodes(graph.nodes);
  initializeForces();
  simulation.on("tick", ticked);
}

// values for all forces
forceProperties = {
    center: {
        x: 0.5,
        y: 0.5
    },
    charge: {
        enabled: true,
        strength: -30,
        distanceMin: 1,
        distanceMax: 2000
    },
    collide: {
        enabled: true,
        strength: .7,
        iterations: 1,
        radius: 5
    },
    forceX: {
        enabled: false,
        strength: .1,
        x: .5
    },
    forceY: {
        enabled: false,
        strength: .1,
        y: .5
    },
    link: {
        enabled: true,
        distance: 100,
        iterations: 1
    }
}

// add forces to the simulation
function initializeForces() {
    // add forces and associate each with a name
    simulation
        .force("link", d3.forceLink())
        .force("charge", d3.forceManyBody())
        .force("collide", d3.forceCollide())
        .force("center", d3.forceCenter())
        .force("forceX", d3.forceX())
        .force("forceY", d3.forceY());
    // apply properties to each of the forces
    updateForces();
}

// apply new force properties
function updateForces() {
    // get each force by name and update the properties
    simulation.force("center")
        .x(width * forceProperties.center.x)
        .y(height * forceProperties.center.y);
    simulation.force("charge")
        .strength(forceProperties.charge.strength * forceProperties.charge.enabled)
        .distanceMin(forceProperties.charge.distanceMin)
        .distanceMax(forceProperties.charge.distanceMax);
    simulation.force("collide")
        .strength(forceProperties.collide.strength * forceProperties.collide.enabled)
        .radius(forceProperties.collide.radius)
        .iterations(forceProperties.collide.iterations);
    simulation.force("forceX")
        .strength(forceProperties.forceX.strength * forceProperties.forceX.enabled)
        .x(width * forceProperties.forceX.x);
    simulation.force("forceY")
        .strength(forceProperties.forceY.strength * forceProperties.forceY.enabled)
        .y(height * forceProperties.forceY.y);
    simulation.force("link")
        //.id(function(d) {return d.id;})
        .id(function(d) {return d.Name;})
        .distance(forceProperties.link.distance)
        .iterations(forceProperties.link.iterations)
        .links(forceProperties.link.enabled ? graph.links : []);

    // updates ignored until this is run
    // restarts the simulation (important if simulation has already slowed down)
    simulation.alpha(1).restart();
}



//////////// DISPLAY ////////////

// generate the svg objects and force simulation
function initializeDisplay() {
    //add encompassing group for the zoom 
    g = svg_network.append("g")
        .attr("class", "everything");

  // set the data and properties of link lines
  //link = svg_network.append("g")
  link = g.append("g")
        .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter()
    .append("line")
    .style("stroke", "#ccc")
    //.style("stroke-width", 0.5);
    .style("stroke-width", function(d){
        //return d.value;
        return d.FromToValue;
    });

  // set the data and properties of node circles
  //node = svg_network.append("g")
  node = g.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .style("fill", function(d,i) {
            //return colors[d.group];
            return colors[d.EmploymentTypeValue];
            //return colors[d.EmploymentTitleValue];
        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

  // node tooltip   (hover over each circle to see the information of each node)
  node.append("title")
        .text(function(d) { return d.Name+"\n"+d.CurrentEmploymentTitle+"\n"+d.CurrentEmploymentType; });
      //.text(function(d) { return d.id; });
      //.text(function(d) { return d.group; });
  // visualize the graph

    //add zoom capabilities 
    var zoom_handler = d3.zoom()
    .on("zoom", zoom_actions);

    zoom_handler(svg_network); 

  updateDisplay();
}

// update the display based on the forces (but not positions)
function updateDisplay() {
    node
        //.attr("r", forceProperties.collide.radius)
        .attr("r", 10)
        //.attr("stroke", forceProperties.charge.strength > 0 ? "blue" : "red")
        //.attr("stroke-width", forceProperties.charge.enabled==false ? 0 : Math.abs(forceProperties.charge.strength)/15);

    link
        .attr("stroke-width", forceProperties.link.enabled ? 1 : .5)
        .attr("opacity", forceProperties.link.enabled ? 1 : 0);
}

// update the display positions after each simulation tick
function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    d3.select('#alpha_value').style('flex-basis', (simulation.alpha()*100) + '%');
}



//////////// UI EVENTS ////////////

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0.0001);
  d.fx = null;
  d.fy = null;
}

//Zoom functions 
function zoom_actions(){
    g.attr("transform", d3.event.transform)
}

// update size-related forces
d3.select(window).on("resize", function(){
    width = +svg_network.node().getBoundingClientRect().width;
    height = +svg_network.node().getBoundingClientRect().height;
    updateForces();
});

// convenience function to update everything (run after UI input)
function updateAll() {
    updateForces();
    updateDisplay();
}