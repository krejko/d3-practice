/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.8 - Activity: Your first visualization!
*/

d3.json('data/buildings.json').then((data) => {

	// Format the data
	data.forEach((d) => {
		d.height = +d.height;
	});
	
	console.log(data);

	// Setup the canvas

	var margin = {top: 20, right: 10, bottom: 150, left: 100 }
	var width = 960 - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;
	
	var g = d3.select("#chart-area").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

	// Set up the labels

	g.append("text")
		.attr("class", "x axis-label")
		.attr("x", width / 2)
		.attr("y", height + 140)
		.attr("font-size", "15px")
		.attr("text-anchor", "middle")
		.text("Tallest Buildings")

	g.append("text")
		.attr("class", "x axis-label")
		.attr("x", - (height / 2))
		.attr("y", - 60)
		.attr("font-size", "15px")
		.attr("text-anchor", "middle")
		.attr("transform", "rotate(-90)")
		.text("Height (m)");

	// Set up the Scales

	var names = data.map((item) => { return item.name; });
	var bandScale = d3.scaleBand()
		.domain(names)
		.range([0, width])
		.paddingInner(0.3)
		.paddingOuter(0.2);

	var tallest = d3.max(data, (item) => { return item.height; });
	var linearScale = d3.scaleLinear()
		.domain([0, tallest])
		.range([height, 0]);

	// Set up the Graph 

	var elements = g.selectAll("rect").data(data);
	elements.enter()
		.append("rect")
			.attr("x", (d, i) =>{
				return bandScale(d.name);
			})
			.attr("y", (d) => {
				return linearScale(d.height);
			})
			.attr("width", bandScale.bandwidth())
			.attr("height", (d) => {
				return height - linearScale(d.height);
			})
			.attr("fill", "grey");

	// Set up the Axis

	var xAxis = d3.axisBottom(bandScale);
	g.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0, " + height + ")" )
		.call(xAxis)
			.selectAll("text")
				.attr("y", "10")
				.attr("x", "-5")
				.attr("text-anchor", "end")
				.attr("transform", "rotate(-40)");

	var yAxis = d3.axisLeft(linearScale)
		.ticks(3)
		.tickFormat((d) => { return d + "m"; })
	g.append("g")
			.attr("class", "y axis")
			// .attr("transform", "translate(0, " + margin.top + ")" )
			.call(yAxis)
	

}).catch((error) => {
	console.error(error);
});