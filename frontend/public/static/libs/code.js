// ****************************************************** //
//
// name: Thiam Wai Chua
// date: 16 April 2022
//
// code for displaying:
// 1) tSNE
// 2) legend of dates in the tSNE
// 3) senders' email
// 4) senders' name
// 5) dynamic network graph (parallel coordinates)
//
// ****************************************************** //

// colors for the circles in the tSNE
var colors = [
    "#1b70fc", "#cebb11", "#d50527", "#158940", "#f898fd", "#24c9d7",
    "#cb9b64", "#866888", "#22e67a", "#e509ae", "#9dabfa", "#437e8a",
    "#b21bff", "#ff7b91", "#94aa05", "#ac5906", "#82a68d", "#fe6616",
    "#7a7352", "#f9bc0f", "#b65d66", "#07a2e6", "#c091ae", "#8a91a7",
    "#a9804b", "#0688b4", "#6a9f3e", "#ee8fba", "#a67389", "#9e8cfe",
    "#bd443c", "#6d63ff", "#d110d5", "#798cc3", "#df5f83", "#b1b853",
    "#bb59d8", "#1d960c", "#867ba8", "#18acc9", "#25b3a7", "#f3db1d",
    "#938c6d", "#936a24", "#a964fb", "#92e460", "#a05787", "#9c87a0",
    "#20c773", "#8b696d", "#78762d", "#e154c6", "#40835f", "#d73656",
    "#1afd5c", "#c4f546", "#3d88d8", "#bd3896", "#1397a3", "#f940a5",
  ]

// colors for the senders' name, senders' email and dynamic network graph (parallel coodinates' lines)
var colors_line = [
    "#78762d", "#ea42fe", "#ee534e", "#10b437", "#c281fe", "#f92b75",
    "#9c87a0", "#a946aa", "#718a90", "#16977e", "#ff6ac8", "#a88178",
    "#5776a9", "#678007", "#fa9316", "#85c070", "#6aa2a9", "#989e5d",
    "#fe9169", "#cd714a", "#6ed014", "#c5639c", "#c23271", "#698ffc",
    "#678275", "#c5a121", "#a978ba", "#9e8010", "#d24506", "#59c3fa",
    "#ca7b0a", "#6f7385", "#9a634a", "#48aa6f", "#ad9ad0", "#d7908c",
    "#6a8a53", "#8c46fc", "#8f5ab8", "#fd1105", "#7ea7cf", "#d77cd1",
    "#a9804b", "#0688b4", "#6a9f3e", "#ee8fba", "#a67389", "#9e8cfe",
    "#bd443c", "#6d63ff", "#d110d5", "#798cc3", "#df5f83", "#8b696d",
    "#bb59d8", "#1d960c", "#867ba8", "#18acc9", "#25b3a7", "#f3db1d",
    "#938c6d", "#936a24", "#a964fb", "#92e460", "#a05787", "#20c773",
    "#07c99d", "#88fc07", "#b1b853", "#e154c6", "#40835f", "#d73656",
    "#1afd5c", "#c4f546", "#3d88d8", "#bd3896", "#1397a3", "#f940a5",
    "#66aeff", "#d097e7", "#fe6ef9", "#d86507", "#8b900a", "#d47270",
    "#e8ac48", "#cf7c97", "#bfd544", "#bea1fd", "#e78139", "#ff7463", "#faff16"
]

// define the SVG for tSNE plot
var svg_tsne = d3.select("#DimensionalityReduction").selectAll("svg"),
width = +svg_tsne.node().getBoundingClientRect().width,
height = +svg_tsne.node().getBoundingClientRect().height;
var x_offset = width/20;
var y_offset = height/20;

// define the SVG for tSNE legend
var svg_tsne_legend = d3.select("#DimensionalityReductionLegend").selectAll("svg")

// define the SVG for dynamic network graph (parallel coordinates)
var svg_net = d3.select("#network").selectAll("svg"),
width_net = +svg_net.node().getBoundingClientRect().width,
height_net = +svg_net.node().getBoundingClientRect().height;
var x_net_offset = width_net/6;
var y_net_offset = height_net/6;

// define the SVG for senders' name
var svg_names = d3.select("#SendersName").selectAll("svg"),
width_names = +svg_names.node().getBoundingClientRect().width,
height_names = +svg_names.node().getBoundingClientRect().height;

// define the SVG for senders' email
var svg_emails = d3.select("#EmailList").selectAll("svg"),
width_emails = +svg_emails.node().getBoundingClientRect().width,
height_emails = +svg_emails.node().getBoundingClientRect().height;

// define the SVG for senders' and reveicers' name
var svg_senders = d3.select("#senders").selectAll("svg"),
width_emails = +svg_senders.node().getBoundingClientRect().width,
height_emails = +svg_senders.node().getBoundingClientRect().height;

// create a vertical and horizontal scroll bar for senders' email SVG
var email_container = d3.select("#EmailList")
                    //.append("div")
                    .attr("id", "container_email");

var email_rect = email_container.append("svg_emails")
                        .attr("viewBox", "0,0,2000,2000")
                        .append("rect")
                        //.attr("width", 150)
                        .attr("height", 4200)
                        //.attr("fill", "steelblue")
                        .attr("x", 0)
                        .attr("y", 0);

// create a vertical and horizontal scroll bar for senders' and receivers' email SVG
var sender_container = d3.select("#senders")
                    //.append("div")
                    .attr("id", "container_sender");

var sender_rect = sender_container.append("svg_names")
                    .attr("viewBox", "0,0,2000,2000")
                    .append("rect")
                    //.attr("width", 150)
                    .attr("height", 4200)
                    //.attr("fill", "steelblue")
                    .attr("x", 0)
                    .attr("y", 0);

// create a vertical and horizontal scroll bar for tSNE legend SVG
var date_container = d3.select("#DimensionalityReductionLegend")
                    //.append("div")
                    .attr("id", "container_date");

var date_rect = sender_container.append("svg_tsne_legend")
                    .attr("viewBox", "0,0,2000,2000")
                    .append("rect")
                    //.attr("width", 150)
                    .attr("height", 4200)
                    //.attr("fill", "steelblue")
                    .attr("x", 0)
                    .attr("y", 0);

// function for the box selection in the tSNE SVG 
function rect(x, y, w, h) {
  return "M"+[x,y]+" l"+[w,0]+" l"+[0,h]+" l"+[-w,0]+"z";
}

// for the box selection in the tSNE SVG 
var selection_tsne = svg_tsne.append("path")
                    .attr("class", "selection")
                    .attr("visibility", "hidden");

// for the box selection in the tSNE SVG 
var startSelection = function(start) {
    selection_tsne.attr("d", rect(start[0], start[0], 0, 0))
    .attr("visibility", "visible");
};

// for the box selection in the tSNE SVG 
var moveSelection = function(start, moved) {
    selection_tsne.attr("d", rect(start[0], start[1], moved[0]-start[0], moved[1]-start[1]));
};

// for the box selection in the tSNE SVG 
var endSelection = function(start, end) {
    selection_tsne.attr("visibility", "hidden");
};

// ******************** Cosine Simililarity (for strings) ******************** //
// Helper functions
function omitPunctuations(word) {
  return word.replace(/[\!\.\,\?\-\?]/gi, '');
};

function toLowercase(word) {
  return word.toLowerCase();
};

function calcVectorSize(vec) {
  return Math.sqrt(vec.reduce((accum, curr) => accum + Math.pow(curr, 2), 0));
};

// Main function
function cosineSimilarity(vec1, vec2) {
  const dotProduct = vec1.map((val, i) => val * vec2[i]).reduce((accum, curr) => accum + curr, 0);
  const vec1Size = calcVectorSize(vec1);
  const vec2Size = calcVectorSize(vec2);
  return dotProduct / (vec1Size * vec2Size);
};

// tf-idf algorithm implementation (https://en.wikipedia.org/wiki/Tf%E2%80%93idf)
function calcTfIdfVectorForDoc(doc, otherDocs, allWordsSet) {
  return Array.from(allWordsSet).map(word => {
    return tf(word, doc) * idf(word, doc, otherDocs);
  });
};

function tf(word, doc) {
  const wordOccurences = doc.filter(w => w === word).length;
  return wordOccurences / doc.length;
};

function idf(word, doc, otherDocs) {
  const docsContainingWord = [doc].concat(otherDocs).filter(doc => {
    return !!doc.find(w => w === word);
  });
  return (1 + otherDocs.length) / docsContainingWord.length;
};
// ********************************************************************************** //

var uniqueDate = [];

// Import dataset and plot the t-SNE and dynamic network graph (paralle coordinates)

function plotData() {

d3.queue()
.defer(d3.csv, "./static/files/EmployeeRecords.csv")
.defer(d3.csv, "./static/files/emailheaders.csv")
.await(function(error, nodes, links) {
  if (error) {
    console.error("Error: load file")
  }
  else {
    linksFromTo = structuredClone(links);
    nodesEmployee = structuredClone(nodes);
    linksFromTo.forEach(rowList => {
      rowList.Date = rowList.Date.split(" ")[0]
    })
  }

    // read the perplexity value from the slider and then assign it to the perplexity variable
    var preplexityValue = document.getElementById("tsne_PerplexitySliderOutput").value;
    console.log("preplexityValue: ", preplexityValue);

    // read the step value from the slider and then assign it to the stepValue variable
    var stepValue = document.getElementById("tsne_StepSliderOutput").value;
    console.log("stepValue: ", stepValue);

    // read the epsilon value from the slider and then assign it to the epsilon variable
    var epsilonValue = document.getElementById("tsne_EpsilonSliderOutput").value;
    console.log("epsilonValue: ", epsilonValue);

    var opt = {}
    opt.epsilon = epsilonValue; // epsilon is learning rate (10 = default)
    opt.perplexity = preplexityValue; // roughly how many neighbors each point influences (30 = default)
    opt.dim = 2; // dimensionality of the embedding (2 = default)

    var tsne = new tsnejs.tSNE(opt); // create a tSNE instance

  //linksFromTo.length = 40;       // modify this value select subset of the dataset for testing purposes

  nodesEmployee.forEach(rowList => {
    for (let key in rowList) {
        var firstName, lastName;
        if (key == 'LastName') {
            lastName = rowList[key];
        }
        if (key == 'FirstName') {
            firstName = rowList[key];
        }
        rowList.Name = firstName + " " +lastName;
    }
  })

  // get the unique set of the senders' email in the dataset
  var uniqueFrom = [];
  //let count = 0;
  linksFromTo.filter(element => {
    const isDuplicate = uniqueFrom.includes(element.From);
    if (!isDuplicate) {
      uniqueFrom.push(element.From);
      return true
    }
  })

  // get the unique set of the dates in the dataset
  //var uniqueDate = [];
  linksFromTo.filter(element => {
    const isDuplicate = uniqueDate.includes(element.Date);
    if (!isDuplicate) {
      uniqueDate.push(element.Date);
      return true
    }
  })

  // create the distance matrix for the computation of tSNE plot
  var len = linksFromTo.length;
  let ToDistance = [];
  for (let i=0; i<len; i++) {
    ToDistance[i] = [];
    for (let j=0; j<len; j++) {
      // Preprocess strings and combine words to a unique collection
      var str1Words = linksFromTo[i]["To"].trim().split(' ').map(omitPunctuations).map(toLowercase);
      var str2Words = linksFromTo[j]["To"].trim().split(' ').map(omitPunctuations).map(toLowercase);
      var allWordsUnique = Array.from(new Set(str1Words.concat(str2Words)));

      // Calculate IF-IDF algorithm vectors
      var str1Vector = calcTfIdfVectorForDoc(str1Words, [str2Words], allWordsUnique);
      var str2Vector = calcTfIdfVectorForDoc(str2Words, [str1Words], allWordsUnique);

      ToDistance[i][j] = 1.0 - cosineSimilarity(str1Vector, str2Vector);    // distance matrix
    }
  }

  tsne.initDataDist(ToDistance);    // send the distance matrix for the computation of tSNE

  // the stepValue can be adjusted in the slider on the dashboard
  for(var k = 0; k < stepValue; k++) {
    tsne.step(); // every time you call this, solution gets better
  }

  var Y = tsne.getSolution(); // Y is an array of 2-D points that you can plot

  // Set the ranges and domain
  var xScale = d3.scaleLinear().domain([d3.min(Y, function(d) { return d[0] }), d3.max(Y, function(d) { return d[0] })]).range([0+x_offset, width-x_offset]);
  //var yScale = d3.scaleLinear().range([height, 0]);
  var yScale = d3.scaleLinear().domain([d3.min(Y, function(d) { return d[1] }), d3.max(Y, function(d) { return d[1] })]).range([0+y_offset, height-y_offset]);

  // add the tSNE X and Y coordinates to the dataset
  linksFromTo.forEach((listFrom, idx, arr) => {
    listFrom.tsneX = xScale(Y[idx][0])
    listFrom.tsneY = yScale(Y[idx][1])
  })

  // remove all the circles in the tSNE for reploting the tSNE
  svg_tsne.selectAll("circle").remove();
  
  // SVG for the tSNE
  // the zooming and panning is partially working, i.e. the X and Y of the dots in the tSNE are not updated after zooming and panning, this causes the box selection incorrect
  g_tsne = svg_tsne.append("svg")
                    .attr("class", "everything")
                    //.call(d3.zoom().on("zoom", function () {              // this is commented because the zooming and panning causing issue for the box selection in tSNE
                    //    g_tsne.attr("transform", d3.event.transform)      // this is commented because the zooming and panning causing issue for the box selection in tSNE
                    //}))                                                   // this is commented because the zooming and panning causing issue for the box selection in tSNE
                    //.append("g");                                         // this is commented because the zooming and panning causing issue for the box selection in tSNE
  
  // plot the tSNE
  var dots = g_tsne.selectAll("dot")
        .data(linksFromTo)
        .enter()
        .append("circle")
        .transition().duration(500)       // issue: legend is not shown if transition() and duration() are used
        .attr("r", 6)
        .attr("cx", function(d, i) { return linksFromTo[i]["tsneX"] })
        .attr("cy", function(d, i) { return linksFromTo[i]["tsneY"] })
        .style("fill", function(d,i){
              let idx = uniqueDate.indexOf(linksFromTo[i]["Date"]);
              return colors[idx];
        })
        //.append("title")              // issue: title does not show up if transition() and duration() are used
        //.text(function(d) { return d.From; })

    // SVG for tSNE legend
    g_tsne_legend = svg_tsne_legend.append("svg")
                                    .attr("class", "everything")

  // Add one dot in the legend for each name
  g_tsne_legend.selectAll("mydots")
        .data(uniqueDate)
        .enter()
        .append("circle")
        .transition().duration(500)
        .attr("cx", 20)
        .attr("cy", function(d,i){ return 20 + i*25}) // 20 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", function(d,i){
          return colors[i]; 
        })

  // Add one dot in the legend for each name
  g_tsne_legend.selectAll("mylabels")
        .data(uniqueDate)
        .enter()
        .append("text")
        .attr("x", 40)
        .attr("y", function(d,i){ return 25 + i*25}) // 25 is where the first text appears. 25 is the distance between dots
        //.style("fill", function(d){ return color(d)})
        .style("font-size", "15px")
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

    // 
    // box selection of the tSNE
    // the selected circles in the tSNE are used to generate the dynamic network graph (paralle coordinates)
    //
  let linksFromTo_sub_selected = [];
  svg_tsne.on("mousedown", function() {
    var subject = d3.select(window), parent = this.parentNode,
        start = d3.mouse(parent);
      startSelection(start);
      subject
        .on("mousemove.selection", function() {
          moveSelection(start, d3.mouse(parent));
        }).on("mouseup.selection", function() {
          endSelection(start, d3.mouse(parent));
          let xRange = [start[0], d3.mouse(parent)[0]];         // the x-range of the box selection
          let yRange = [start[1], d3.mouse(parent)[1]];         // the y-range of the box selection
          let xSelectMax, xSelectMin, ySelectMax, ySelectMin;
          xSelectMax = Math.max(...xRange);                     // this make sure the box selection can be start from every corner (NE to SW, NW to SE, etc.)
          xSelectMin = Math.min(...xRange);                     // this make sure the box selection can be start from every corner (NE to SW, NW to SE, etc.)
          ySelectMax = Math.max(...yRange);                     // this make sure the box selection can be start from every corner (NE to SW, NW to SE, etc.)
          ySelectMin = Math.min(...yRange);                     // this make sure the box selection can be start from every corner (NE to SW, NW to SE, etc.)
          linksFromTo_selected = [];
          linksFromTo_sub_selected = [];
          linksFromTo.forEach((listFrom, idx, arr) => {
            if ((xSelectMin < listFrom.tsneX ) && ( listFrom.tsneX < xSelectMax)) {
              if ((ySelectMin < listFrom.tsneY) && ( listFrom.tsneY < ySelectMax)) {
                linksFromTo_selected.push(listFrom)             // push the selected circles inside the box selection into the array which will be used for plotting the dynamic network graph (parallel coordinates)
              }
            }
          })
          linksFromTo_sub_selected = linksFromTo_selected;
          subject.on("mousemove.selection", null).on("mouseup.selection", null);
          subject.on("change", dynamicNet());
        })
        
  });

  // ======================================================================================= //
  // ========== function for ploting dynamics graph network (parallel coordinate) ========== //
  // ======================================================================================= //

  function dynamicNet() {

    // remove all current dynamic graph for replotting the new dynamics graph
    svg_net.selectAll("*").remove();
    
    var data = linksFromTo_sub_selected;

    // get the unique date in the selected circles inside in the box selection
    var uniqueDate = [];
    data.filter(element => {
        const isDuplicate = uniqueDate.includes(element.Date);
        if (!isDuplicate) {
            uniqueDate.push(element.Date);
            return true
        }
    })

    // function for renaming the string (name of the sender)
    function addStr(str, index, stringToAdd){
      return str.substring(0, index) + stringToAdd + str.substring(index, str.length);
    }

    // rename the unique date which replace the space with underscore 
    var uniqueDate_rename = [];
    for (let [index, date] of uniqueDate.entries()) {
      var date_rename = date.replace(/\//g,"_");
      date_rename = addStr(date_rename, 0, "_");
      uniqueDate_rename.push(date_rename);
    }
    uniqueDate_rename.push("_00_00_0000");          // push the _00_00_0000 in the array list of unique date for ploting the parallel coordinates (_00_00_0000 to be used as last date)

    // 
    // get the email and name of the senders and receivers of the selected circles inside the box selection in the tSNE plot for ploting the dynamics network graph (parallel coordinates)
    //
    var email_from_arr = [];
    var name_from_arr = [];
    var name_from_underscore_arr = []
    var email_to_arr = [];
    var name_to_arr = [];
    data.forEach(rowList => {
      for (let key in rowList) {
        var email_to = []
        if (key == 'From') {
          var email = rowList[key];
          var emailFrom = email.replace(/\./g, "_").replace(/\@/g, "_");
          var nameFrom = email.substring(0, email.lastIndexOf("@")).replace(/\./g, " ");
          var nameFrom_underscore = email.substring(0, email.lastIndexOf("@")).replace(/\./g, "_");
          email_from_arr.push(emailFrom);
          name_from_arr.push(nameFrom);
          name_from_underscore_arr.push(nameFrom_underscore);
        }
        if (key == 'To') {
          email_to.push([...rowList[key].split(", ")])
          email_to = email_to[0]
          arr_len = email_to.length;
          for (let i=0; i<arr_len; i++) {
            name_to_arr.push(email_to[i].substring(0, email_to[i].lastIndexOf("@")).replace(/\./g, " "));
            email_to_arr.push(email_to[i].replace(/\./g, "_").replace(/\@/g, "_"));
          }
        }
      }
    })
    email_from_arr.sort();              // array of senders' email
    name_from_arr.sort();               // array of senders' name
    name_from_underscore_arr.sort();    // array of senders' email (white space is replaced with underscore)
    name_to_arr.sort();                 // array of recievers' name

    // remove duplicate emails
    var emails = [...new Set([...email_from_arr ,...email_to_arr])]; 
    emails.sort();      // sort the emails

    // remove duplicates names
    var names = [...new Set([...name_from_arr ,...name_to_arr])]; 
    names.sort();       // sort the names

    // create an array with senders' name and its corresponding color
    // this is for consistent color for each ranking of the current selected senders 
    var colorSub = [];
    for (let m=0; m<name_from_underscore_arr.length; m++) {
      colorSub.push(colors_line[m]);
    }

    // create an array with sender's name and its corresponding color (the colors are selected from array colors_line)
    var colorSender = d3.scaleOrdinal()
                        .domain(name_from_underscore_arr)
                        .range(colorSub)
    
    //
    // create pairs of from-to for plotting the dynamic network graph (parallel coordinates)
    //
    var dataParallelCoord = [];
    var date;
    var fromValue;
    data.forEach(rowList => {
      for (let i=0; i<uniqueDate.length; i++) {
          date_send = uniqueDate_rename[i];
          date_receive = uniqueDate_rename[i+1];
          if (rowList.Date == uniqueDate[i]) {
            for (let key in rowList) {
              var email_to = []
              if (key == "From") {
                senderEmail = rowList[key];
                var email_From_underscore = senderEmail.replace(/\./g, "_").replace(/\@/g, "_");
                //var name_From = senderEmail.substring(0, email.lastIndexOf("@")).replace(/\./g, " ");
                var name_From_underscore = senderEmail.substring(0, senderEmail.lastIndexOf("@")).replace(/\./g, "_");
                fromValue = emails.indexOf(email_From_underscore).toString();
                pairDateFrom = {[date_send]: fromValue};
                pairSenderEmail = {Sender: senderEmail};
                pairSenderName = {SenderName: name_From_underscore}
                pairSenderEmailunderscore = {SenderEmailunderscore: email_From_underscore}
              }
              if (key == "To") {
                email_to.push([...rowList[key].split(", ")])
                email_to = email_to[0]
                arr_len = email_to.length;
                for (let n=0; n<arr_len; n++) {
                  toValue = emails.indexOf(email_to[n].replace(/\./g, "_").replace(/\@/g, "_")).toString();
                  pairDateTo = {[date_receive]: toValue};
                  combine_pair = {...pairDateFrom, ...pairDateTo, ...pairSenderEmail, ...pairSenderName, ...pairSenderEmailunderscore};
                  dataParallelCoord.push(combine_pair);
                }
              }
            }
          }
      }
    })

    // create a linear scale for the date which to be used in the dynamics network graph (parallel coordinates)
    var y = {}
    for (i in uniqueDate_rename) {
      name = uniqueDate_rename[i]
      y[name] = d3.scaleLinear()
                  .domain([0, emails.length])
                  .range([height_net-10, 10])
    }

    // create the scale for the date which to be used in the dynamics network graph (parallel coordinates)
    x = d3.scalePoint()
          .domain(uniqueDate_rename)
          .range([0, width_net])
          .padding(5);

    // create a tooltip
    var tooltip = d3.select("#network")
                    .append("div")
                    .style("position", "absolute")
                    .style("visibility", "hidden")
    
    // Highlight the sender that is hovered on the selected line in the dynamic network graph (parallel coordinates)
    var highlight = function(d){

      selected_sender = d.SenderEmailunderscore

      // first every group turns grey
      d3.selectAll(".line")
        .transition().duration(100)
        .style("stroke", "lightgrey")
        .style("opacity", "0.2")
      // Second the hovered specie takes its color
      d3.selectAll("." + selected_sender)
        .transition().duration(100)
        .style("stroke", colorSender(selected_sender))
        .style("opacity", "1")
      
    // tooltip the selected line in the dynamic network graph (parallel coordinates)
      tooltip
        .html("Sender: " + selected_sender)
        .style("left", (d3.mouse(this)[0]) + "px")
        .style("top", (d3.mouse(this)[1]) + "px")

    }

    // Unhighlight the selected line in the dynamic network graph (parallel coordinates)
    var doNotHighlight = function(d){
      d3.selectAll(".line")
        .transition().duration(100).delay(100)
        .style("stroke", function(d){ return( colorSender(d.SenderEmailunderscore)) } )
        .style("opacity", "1")
    }

    // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
    function path(d) {
      return d3.line()(uniqueDate_rename.map(function(p) {
        if (isNaN(y[p](d[p]))) {
          return [x(p), 100000];        // if NaN is found, return 100000. This this crucial, because the lines in the parallel coordinates cannot be generated if NaN existed
        }
        return [x(p), y[p](d[p])]; }));
    }

    // Draw the lines in the dynamics network graph (parallel coordinates)
    svg_net
      .selectAll("myPath")
      .data(dataParallelCoord)
      .enter()
      .append("path")
        .attr("class", function (d) { return "line " + d.SenderEmailunderscore } ) // 2 class for each line: 'line' and the group name
        .attr("d",  path)
        .style("fill", "none")
        //.style("stroke", "#69b3a2")
        .style("stroke", function(d,i){ 
          //return( colors_line[emails.indexOf(d.SenderEmailunderscore)] )
          return( colorSender(d.SenderEmailunderscore) )
        })
        .style("opacity", 1.0)
        .style("stroke-width", 2.0)
        .on("mouseover", highlight)
        .on("mouseleave", doNotHighlight)
    
    // Draw the axis:
    svg_net
      .selectAll("myAxis")
      .data(uniqueDate_rename).enter()
      .append("g")
      .attr("class", "axis")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
      .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
      .style("stroke", "black")
      .style("stroke-width", 1.35)
      .style("padding", 0.0)
      .style("opacity", 1.0)

    uniqueDate_rename.pop()
      
    // Draw the date on top and between axes
    svg_net
      .selectAll("myAxis")
      .data(uniqueDate_rename).enter()
      .append("g")
      .attr("class", "axis")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
      .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
      .append("text")
      //.style("text-anchor", "middle")
      .style("text-anchor", "start")
      .attr("x", -1)
      .attr("y", 15)
      .text(function(d) { return d; })
      .style("fill", "black")
      .style("font-size", 10.0)

    // ============================================================================== //
    // ======================== names of senders and receivers ====================== //
    // ============================================================================== //

    // remove all the existing senders' and receivers' name before reploting the new names
    svg_names.selectAll("*").remove();

    svg_names.attr("transform", "translate(" + 50 + "," + 0 + ")");     // transforms the axis to proper position

    // create an array of the senders' and receivers' name in the selected circles in tSNE
    var names_arr = [];
    for (let i=0; i<names.length; i++) {
      var name = {name: names[i]};
      names_arr.push(name);
    }  
    
    // create a domain and range for all the names in the selected circles in tSNE
    dimensions = d3.keys(names[0]);
    x.domain(dimensions);

    dimensions = ["0"];
    dimensions.forEach(function(d) {
      y[d] = d3.scalePoint()
                .domain(names)
                .range([height_names-10, 10],1);
    })

    // Add a group element for each dimension.
    var g_names = svg_names.selectAll(".dimension")
                            .data(dimensions)
                            .enter().append("g")
                            .attr("class", "dimension")
                            //.attr("transform", function(d) {  console.log("x(d): ", x(d)); return "translate(" + x(d) + ")"; })
                            .attr("transform", function(d) { return "translate(" + 95 + ")"; })
    
    // Add an axis and title.
    g_names.append("g")
            .attr("class", "axis")
            .each(function(d) {
                d3.select(this)
                .call(d3.axisLeft(y[d]));
            })   
    
    d3.selectAll(".axis.names .tick text")
        .style("fill", "yellow");

    // ================================================================ //
    // ======================== names of senders ====================== //
    // ================================================================ //

    // remove all the existing senders' name before reploting the new names
    svg_senders.selectAll("*").remove();

    var dataSender = linksFromTo_sub_selected;

    // create an array of the senders' name in the selected circles in tSNE
    var senders = [];
    dataSender.forEach(rowList => {
        for (let key in rowList) {
            if (key == "From") {
                var email = rowList[key];
                var nameFrom = email.substring(0, email.lastIndexOf("@")).replace(/\./g, " ");
                var employmentTitleIndex = nodesEmployee.findIndex( ({ Name }) => Name === nameFrom );
                var employmentTitle = nodesEmployee[employmentTitleIndex].CurrentEmploymentTitle;
                var nameEmploymentTitle = nameFrom + " (" + employmentTitle + ")";
                senders.push(nameEmploymentTitle);
            }
        }
    })

    // create a sey of senders' name (set with unique senders' name)
    senders = [...new Set([...senders])];
    senders.sort();         // sort the array set
    senders.reverse();      // reverse the array set to align wuth the names ordering in the parallel coordinate

    // display the senders' name in the SVG
    yPosition = 15;
    senders.forEach((subject, idx, arr) => {
      svg_senders.append("text")
                .attr("font-size", "1em")
                .attr('x', 10)
                .attr('y', yPosition)
                .text(subject)
                .style("fill", colors_line[idx])
                .style("font-size", "17px");
      yPosition += 15;
    })
    
    // ========================================================================== //
    // ========================== email header (subject) ======================== //
    // ========================================================================== //

    // remove all the existing senders' enail subject before reploting the new names
    svg_emails.selectAll("*").remove();

    var dataEmailSubject = linksFromTo_sub_selected;

    // create an array of the senders' enail subject in the selected circles in tSNE
    //var emailSubject = [];
    var senderEmailSubject = [];
    dataEmailSubject.forEach(rowList => {
      for (let key in rowList) {
        if (key == "From") {
            var email = rowList[key];
            var nameFrom = email.substring(0, email.lastIndexOf("@")).replace(/\./g, " ");
            console.log("nameFrom: ", nameFrom);
        }
        if (key == "Subject") {
          //emailSubject.push(rowList[key]);
          var subject = rowList[key];
          console.log("subject: ", subject);
        }
        senderEmailSubject.push(nameFrom + ":: " + subject);
      }
    })

    // create a sey of senders' email subject (set with unique senders' email subject)
    senderEmailSubject = [...new Set([...senderEmailSubject])];
    senderEmailSubject.sort();              // sort the array set
    senderEmailSubject.reverse();           // reverse the array set to align wuth the names ordering in the parallel coordinate
    
    // display the senders' email subject in the SVG
    yPosition = 15;
    senderEmailSubject.forEach((subject, idx, arr) => {
        let name = subject.substring(0, subject.lastIndexOf("::"));
      svg_emails.append("text")
                .attr("font-size", "1em")
                .attr('x', 10)
                .attr('y', yPosition)
                .text(subject)
                .style("fill", colors_line[senders.indexOf(name)])
                .style("font-size", "15px");
      yPosition += 15;
    })
  }

});

}