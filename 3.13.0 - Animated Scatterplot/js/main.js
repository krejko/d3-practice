/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

var flag = true;
var t = d3.transition().duration(1000);

// --- Setup the canvas ---
margins = {top: 20, bottom: 40, left: 70, right: 10};
height = 500 - margins.left - margins.right;
width = 960 - margins.top - margins.bottom;

var group = d3.select("#chart-area").append("svg")
    .attr("width", width + margins.left + margins.right)
    .attr("height", height + margins.top + margins.bottom)
    .append("g")
        .attr("transform", "translate(" + margins.left + ", " + margins.top + ")");

// --- Setup Labels ---
var bottomLabel = group.append("text")
.text("Month")
.attr("x", ((width)/ 2))
.attr("y",  (height + ((margins.bottom + margins.bottom)/2)))
.attr("font-size", "15px")
.attr("text-anchor", "middle")

var leftLabel = group.append("text")
    .attr("x", - (height/2))
    .attr("y", - 55)
    .attr("font-size", "15px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")

// --- Setup Scales & Axisis ---
// x-axis
var bandScale = d3.scaleBand()
    .range([0, width])
    .paddingInner("0.2")
    .paddingOuter("0.2");
var xAxisGroup = group.append("g")
    .attr("class", "x x-axis")
    .attr("transform", "translate(0, " + height + ")")

// y-axis
var linearScale = d3.scaleLinear()
    .range([height, 0]);
var yAxisGroup = group.append("g")
    .attr("class", "y y-axis")

d3.json('data/revenues.json').then((data) => {
    
    // Format the data
    data.forEach((d) => {
        d.revenue = +d.revenue;
        d.profit = +d.profit;
    });

    console.log(data);

    // Set Initial State
    update(data);

    // Start Loop 
    d3.interval(() => {
        //Simulate various data conditions
        var newData = flag ? data : data.slice(1);

        update(newData); 
        flag = !flag;
    }, 1000);
});

function update(data) {

    // --- Update the flag --- 
    var value = flag ? "revenue" : "profit";

    // --- Update the Label ---
    var label = flag ? "Revenue" : "Profit";
    leftLabel.text(label)

    // --- Update Scale ---
    var months = data.map((d) => { return d.month; });
    bandScale.domain(months);

    var max = d3.max(data, (d)=> { return d[value]; });
    linearScale.domain([0, max]);

    // --- Update Axis ---
    var xAxis = d3.axisBottom(bandScale);
    xAxisGroup.transition(t).call(xAxis);

    var yAxis = d3.axisLeft(linearScale)
    .tickFormat((d)=> { return "$" + d; });
    yAxisGroup.transition(t).call(yAxis)

    // --- Set up bars on graph ---
    // Join new & old data with id of month
    var circiles = group.selectAll("circle").data(data, (d) => { return d.month; });
    
    // Remove outdated data
    circiles.exit()
        .transition(t)
        .attr("cy", height)
        .attr("r", 0)
        .remove()  
    ;

    // Updated old elements present in new data
    circiles
    // Add new elements present in new data
    circiles.enter()
        .append("circle")
            .attr("cx", (d) => { return bandScale(d.month) + (0.5 * bandScale.bandwidth()); })
            .attr("cy", height)
            .attr("r", 0)
            .attr("fill", "gray")
            .merge(circiles)
            .transition(t)
                .attr("cx", (d) => { return bandScale(d.month)+ (0.5 * bandScale.bandwidth()); })
                .attr("cy", (d) => { return linearScale(d[value]); })
                .attr("r", 20)  

}