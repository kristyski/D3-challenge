// @TODO: YOUR CODE HERE! from 16/03/09 1st hair

//12/extra responsive
// d3.select(window).on("resize", makeResponsive);

// When the browser loads, loadChart() is called
// loadChart();

// function makeResponsive() { // this was handleResize

  var svgArea = d3.select("svg");

  // If there is already an svg container on the page, remove it and reload the chart
  // if (!svgArea.empty()) {
  //   svgArea.remove();
  //   loadChart();
  // }

  // function loadChart() {

    var svgWidth = window.innerWidth -5; //was = 960;
    var svgHeight = window.innerHeight -5; //was = 500;

    var margin = {
      top: 20,
      right: 20,
      bottom: 60,
      left: 100 //was 100
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold the chart, and shift the chart by left and top margins.
    var svg = d3
      .select("#svg-area") //was .chart, .scatter didn't work
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    // Append an SVG group
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // .classed("bar", true) add somewhere ??


    // Import Data
    d3.csv("./assets/data/data.csv").then(censusData => {

      // Step 1: Parse Data/Cast as numbers
      // ==============================
      censusData.forEach(data => {
        data.income = +data.income;
        data.age = +data.age;
      });

      // Step 2: Create scale functions
      // ==============================
      var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(censusData, d => d.income)])
        .range([0, width])
        .nice();

      var yLinearScale = d3.scaleLinear()
        .domain([30, d3.max(censusData, d => d.age)])
        .range([height, 0])
        .nice();

      // Step 3: Create axis functions
      // ==============================
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);

      // Step 4: Append Axes to the chart
      // ==============================
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

      chartGroup.append("g")
        .call(leftAxis);

      // Step 5: Create Circles
      // ==============================
      var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .join("circle")
        .attr("cx", d => xLinearScale(d.income))
        .attr("cy", d => yLinearScale(d.age))
        .attr("r", "15")
        .attr("fill", "yellow")
        .attr("fill-opacity", 0.75)
        .attr("stroke", "grey")
        .attr("stroke-width", 1);

      // Step 6: Initialize tool tip
      // ==============================
      var toolTip = d3.tip()  //.d3-tip ?
        .attr("class", "tooltip") // this was , "tooltip" d3-tip
        .offset([10, -10]) //these were 80, -60
        .html(d => `${d.state}<br>Income: ${d.income}<br>Age: ${d.age}`);

      // Step 7: Create tooltip in the chart
      // ==============================
      chartGroup.call(toolTip);

      // Step 8: Create event listeners to display and hide the tooltip
      // ==============================
      circlesGroup.on("click", function (data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function (data) {
          toolTip.hide(data);
        });

      // Create axes labels
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Income");

      chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Age (years)");

    }).catch(error => console.log(error));

  // }
// };

// makeResponsive();

// d3.select(window).on("resize", makeResponsive);