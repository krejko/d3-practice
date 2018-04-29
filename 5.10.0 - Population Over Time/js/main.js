/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

var index = 0;
var updateSpeed = 150;
var t = d3.transition().duration(updateSpeed);

// --- Setup the canvas --- 
canvasWidth = 960;
canvasHeight = 500;
var canvas = d3.select("#chart-area").append('svg')
.attr("width", canvasWidth)
.attr("height", canvasHeight);

margins = {top: 10, bottom: 50, left: 75, right: 10}
graphWidth = canvasWidth - margins.left - margins.right;
graphHeight = canvasHeight - margins.top - margins.bottom;
var graph = canvas.append("g")
.attr("transform", "translate(" + margins.left + ", " + margins.top + ")");

// --- Setup the Labels
var axisFontSize = 20;
var yearFontSize = 40;
canvas.append("text")
	.text("Life Expectancy (Years)")
	.attr("x", -((margins.top + graphHeight) * 0.5) )
	.attr("y", axisFontSize)
	.attr("text-anchor", "middle")
	.attr("font-size", axisFontSize + "px")
	.attr("transform", "rotate(-90)");

canvas.append("text")
	.text("GDP Per Capita ($)")
	.attr("x", margins.left + (graphWidth * 0.5))
	.attr("y", canvasHeight - (axisFontSize * 0.5))
	.attr("font-size", axisFontSize + "px")
	.attr("text-anchor", "middle");

var yearLabel = canvas.append("text")
	.attr("x", margins.left + graphWidth)
	.attr("y", (margins.top + graphHeight) - (yearFontSize * 0.5))
	.attr("font-size", yearFontSize + "px")
	.attr("text-anchor", "end")
	.attr("fill", "grey");


// --- Setup the scales & Axis

// x axis
var xScale = d3.scaleLog()
	.range([0, graphWidth])
	.base(10)
var xAxisGroup = canvas.append("g")
	.attr("class", "x x-axis")
	.attr("transform", "translate(" + margins.left + "," + (margins.top + graphHeight) + ")");
var xAxis = d3.axisBottom(xScale)
	.tickValues([400, 4000, 40000])
	.tickFormat(d3.format("$"));

// y axis
var yScale = d3.scaleLinear()
	.range([graphHeight, 0]);
var yAxisGroup = canvas.append("g")
	.attr("class", "y y-axis")
	.attr("transform", "translate(" + margins.left + "," + margins.top + ")");
var yAxis = d3.axisLeft(yScale);

// population scale
var populationScale = d3.scaleLinear()
	.range([25*Math.PI, 1500*Math.PI])
	.domain([2000, 1400000000]);

// color scale
var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

d3.json("data/data.json").then(function(data){

	maxLifeExpectancy = d3.max(data, (year) => {
		return d3.max(year.countries, (country) => { return country.life_exp; });
	})
	maxIncome = d3.max(data, (year) => {
		return d3.max(year.countries, (country) => { return country.income; });
	})

	// --- Update Scales & Axis ---
	xScale.domain([300, maxIncome]);
	xAxisGroup.call(xAxis);

	yScale.domain([0, maxLifeExpectancy]);
	yAxisGroup.call(yAxis);
	
	// console.log(data);

	// Setup Initial graph
	update(data);

	// Start Animation
	d3.interval(() => {
		update(data)
	}, updateSpeed);
});

function update(data) {

	
	var dataSegment = data[index];
	var countries = dataSegment.countries;
	
	// --- Update Labels --- 
	yearLabel.text(dataSegment.year);

	// --- Plot Graph Data ---
	// Join new data with old
	var circles = graph.selectAll("circle").data(countries, (d) => { return d.country; });

	// Remvove old data
	circles.exit().remove();

	// Update & Add new data
	circles.enter()
		.append("circle")
			.attr('fill', (d) => { return colorScale(d.continent); }) 
			.attr("cx", (d) => { return d.income ? xScale(d.income) : 0; })
			.attr("cy", (d) => { return yScale(d.life_exp) || graphHeight})
			.attr("r",  (d) => { return Math.sqrt(populationScale(d.population) / Math.PI); })
			.merge(circles)
			.transition()
				.attr("cx", (d) => { return d.income ? xScale(d.income) : 0; })
				.attr("cy", (d) => { return yScale(d.life_exp) || graphHeight})
				.attr("r",  (d) => { return Math.sqrt(populationScale(d.population) / Math.PI); })

	// --- Update interval information --- 
	index += 1;
	if (index >= data.length){
		index = 0;
	}
}