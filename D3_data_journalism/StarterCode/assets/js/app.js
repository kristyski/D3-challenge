// make responsive
d3.select(window).on("resize", makeResponsive);

function makeResponsive() {

  var svgArea = d3.select("svg");

  // If there is already an svg container on the page, remove it and reload the chart
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  function loadChart() {

    var svgWidth = window.innerWidth < 1800 ? window.innerWidth - 300 : 1500;
    // console.log('window width', window.innerWidth)
    var svgHeight = window.innerHeight < 1000 ? window.innerWidth - 200 : 900;

    var margin = {top: 25, right: 20, bottom: 80, left: 60};

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold the chart, and shift the chart by left and top margins.
    var svg = d3
      .select("#svg-area") //.scatter didn't work
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    // append an SVG group
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // import data
    d3.csv("./assets/data/data.csv").then(censusData => {

      // parse data/cast as numbers
      censusData.forEach(data => {
        data.income = +data.income;
        data.obesity = +data.obesity;
      });

      // create scale functions
      // this determines x axis "scale"
      var xLinearScale = d3.scaleLinear()
        .domain([35000, d3.max(censusData, d => d.income)])
        .range([0, width])
        .nice();

      // this determines y axis "scale"
      var yLinearScale = d3.scaleLinear()
        .domain([20, d3.max(censusData, d => d.obesity)])
        .range([height, 0])
        .nice();

      // create axis functions
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);

      // append axes to the chart
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

      chartGroup.append("g")
        .call(leftAxis);

      // create circles
      var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .join("circle")
        .attr("cx", d => xLinearScale(d.income))
        .attr("cy", d => yLinearScale(d.obesity))
        .attr("r", "15")
        .attr("fill", "yellow")
        .attr("fill-opacity", 0.75)
        .attr("stroke", "green")
        .attr("stroke-width", 1);

      // added state abbr to circles  
      chartGroup.append("g").selectAll("text")
        .data(censusData)
        .join("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.income))
        .attr("y", d => yLinearScale(d.obesity))
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central")
        .attr("font_family", "sans-serif")
        .attr("font-size", "15px")
        .attr("fill", "grey")
        .style("font-weight", "bold");

      // initialize tool tip, why so tiny?
      var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([10, 10])
        .html(d => `${d.state}<br>Income: ${d.income}<br>Obesity: ${d.obesity}`);

      // create tooltip in the chart
      chartGroup.call(toolTip);

      // create event listener to display and hide the tooltip
      circlesGroup.on("mouseover", function (data) {
        toolTip.show(data, this)
        d3.select(this).style("stroke", "#323232");
      })
        // onmouseout event
        .on("mouseout", function (data) {
          toolTip.hide(data);
        });

      // Create axes labels
      //y axis
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 5)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "aText")
        .text("Obesity (percentage)");

      //x axis
      chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "aText")
        .text("Income ($)");

    }).catch(error => console.log(error));

  };
  loadChart();

};

makeResponsive();