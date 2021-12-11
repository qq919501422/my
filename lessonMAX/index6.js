let barHeight = 8;
let width=500;
let margin = ({top: 30, right: 60, bottom: 10, left: 60})
d3.csv( "2015.csv" ).then (data => {
    data = data.map(({Country,HappinessRank,HappinessScore})=>({name:Country,value:HappinessScore}));
    let height = Math.ceil((data.length + 0.1) * barHeight) + margin.top + margin.bottom;
    console.log(data);
    let format = d3.format(",d" );
let x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.value))
    .rangeRound([margin.left, width - margin.right]);
let y = d3.scalePoint()
    .domain(d3.range(data.length))
    .rangeRound([margin.top, height - margin.bottom])
    .padding(0.1);
let xAxis = g => g
    .call(g => g.select(".domain").remove());
let yAxis = g => g
    .attr("transform", `translate(${x(0)},0)`)
    .call(d3.axisLeft(y).tickFormat(i => data[i].name).tickSize(0).tickPadding(6))
    .call(g => g.selectAll(".tick text").filter(i => data[i].value < 0)
        .attr("text-anchor", "start")
        .attr("x", 6));

    let svg=d3.select("#LollipopChart")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

    svg.append("g")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 2)
        .selectAll("line")
        .data(data)
        .join("line")
        .attr("x1", x(0))
        .attr("x2", d => x(d.value))
        .attr("y1", (d, i) => y(i))
        .attr("y2", (d, i) => y(i));

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    svg.append("g")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("fill", d => d3.schemeSet1[d.value > 0 ? 1 : 0])
        .attr("cx", d => x(d.value))
        .attr("cy", (d, i) => y(i))
        .attr("r", 5);

    svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .selectAll("text")
        .data(data)
        .join("text")
        .attr("text-anchor", d => d.value < 0 ? "end" : "start")
        .attr("x", d => x(d.value) + Math.sign(d.value - 0) * 8)
        .attr("y", (d, i) => y(i) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text(d => format(d.value));
  
});

