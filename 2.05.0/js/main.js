/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.5 - Activity: Adding SVGs to the screen
*/

var data = [25, 20, 10, 12, 15];

var svg = d3.select("#chart-area").append("svg")
	.attr("wdith", 400)
	.attr("height", 400);

var circles = svg.selectAll("circle").data(data);

circles.enter()
	.append("circle")
		.attr("cx", (d) => {
			console.log("We in here");
			return 200;
		})
		.attr("cy", 200)
		.attr("r", 100)
		.attr("fill", "red");




// var circle = svg.append("circle")
// 	.attr("cx", 200)
// 	.attr("cy", 200)
// 	.attr("r", 100)
// 	.attr("fill", "blue");

// var circle = svg.append("rect")
// 	.attr("x", 200)
// 	.attr("y", 200)
// 	.attr("height", 100)
// 	.attr("width", 100)
// 	.attr("fill", "blue");