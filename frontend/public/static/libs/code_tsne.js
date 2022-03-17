

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

var svg_tsne = d3.select("#DimensionalityReduction").selectAll("svg"),
width = +svg_tsne.node().getBoundingClientRect().width,
height = +svg_tsne.node().getBoundingClientRect().height;

var x_offset = width/6;
var y_offset = height/6;

var opt = {}
opt.epsilon = 5; // epsilon is learning rate (10 = default)
opt.perplexity = 2; // roughly how many neighbors each point influences (30 = default)
opt.dim = 2; // dimensionality of the embedding (2 = default)

var tsne = new tsnejs.tSNE(opt); // create a tSNE instance


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



// Import dataset & plot the scatterplot using t-SNE
d3.queue()
.defer(d3.csv, "/static/files/EmployeeRecords.csv")
.defer(d3.csv, "/static/files/emailheaders.csv")
.await(function(error, nodes, links) {
  if (error) {
    console.error("Error: load file")
  }
  else {
    console.log(links)
    linksFromTo = structuredClone(links)
    linksFromTo.forEach(rowList => {
      //delete rowList.Date
      rowList.Date = rowList.Date.split(" ")[0]
      // console.log(rowList.Date)
      // delete rowList.Subject
    })
    //console.log("linksFromTo", linksFromTo)
  }

  var linksFromToDate = [];
  linksFromTo.forEach(rowList => {
    if (rowList.Date == "1/6/2014") {
      linksFromToDate.push(rowList)
    }
  })

  var uniqueFrom = [];
  let count = 0;
  linksFromToDate.filter(element => {
    const isDuplicate = uniqueFrom.includes(element.From);
    if (!isDuplicate) {
      uniqueFrom.push(element.From);
      return true
    }
  })
  console.log("uniqueFrom: ", uniqueFrom);
  console.log("indexOf(): ", uniqueFrom.indexOf("Orhan.Strum@gastech.com.kronos"))

  var len = linksFromToDate.length;
  let ToDistance = [];
  for (let i=0; i<len; i++) {
    ToDistance[i] = [];
    for (let j=0; j<len; j++) {
      // Preprocess strings and combine words to a unique collection
      var str1Words = linksFromToDate[i]["To"].trim().split(' ').map(omitPunctuations).map(toLowercase);
      var str2Words = linksFromToDate[j]["To"].trim().split(' ').map(omitPunctuations).map(toLowercase);
      var allWordsUnique = Array.from(new Set(str1Words.concat(str2Words)));

      // Calculate IF-IDF algorithm vectors
      var str1Vector = calcTfIdfVectorForDoc(str1Words, [str2Words], allWordsUnique);
      var str2Vector = calcTfIdfVectorForDoc(str2Words, [str1Words], allWordsUnique);

      ToDistance[i][j] = 1.0 - cosineSimilarity(str1Vector, str2Vector);
    }
  }
  console.log("ToDistance: ", ToDistance)

  tsne.initDataDist(ToDistance);

  for(var k = 0; k < 6000; k++) {
    tsne.step(); // every time you call this, solution gets better
  }

  var Y = tsne.getSolution(); // Y is an array of 2-D points that you can plot

  console.log("Y: ", Y)

  // Set the ranges and domain
  var xScale = d3.scaleLinear().domain([d3.min(Y, function(d) { return d[0] }), d3.max(Y, function(d) { return d[0] })]).range([0+x_offset, width-x_offset]);
  //var yScale = d3.scaleLinear().range([height, 0]);
  var yScale = d3.scaleLinear().domain([d3.min(Y, function(d) { return d[1] }), d3.max(Y, function(d) { return d[1] })]).range([0+y_offset, height-y_offset]);

  g_tsne = svg_tsne.append("g")
        .attr("class", "everything");

  g_tsne.selectAll("dot")
    .data(Y)
    .enter()
    .append("circle")
    .attr("r", 6)
    .attr("cx", function(d) { return xScale(d[0]) })
    .attr("cy", function(d) { return yScale(d[1]) })
    .style("fill", function(d,i){
      let idx = uniqueFrom.indexOf(linksFromToDate[i]["To"]);
      return colors[idx]
    })

    //add zoom capabilities 
    var zoom_handler_tsne = d3.zoom()
    .on("zoom", zoom_actions_tsne);            // DOES NOT WORK

    zoom_handler_tsne(svg_tsne);          // DOES NOT WORK

});

// ====================================================== //

//Zoom functions 
function zoom_actions_tsne(){
  g.attr("transform", d3.event.transform)   // DOES NOT WORK
}