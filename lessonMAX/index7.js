let height = 800;
let width=1200;
let margin = ({top: 10, right: 20, bottom: 35, left: 40});
d3.csv( "2015.csv" ).then (data => {
    data = data.map(({Country,HappinessScore,EconomyGDPperCapita})=>({category:Country,x:EconomyGDPperCapita,y:HappinessScore}));
    console.log(data);
let shape = d3.scaleOrdinal(data.map(d => d.category), d3.symbols.map(s => d3.symbol().type(s)()));

let color = d3.scaleOrdinal(data.map(d => d.category), d3.schemeCategory10);

    let grid = g => g
        .attr("stroke", "currentColor")
        .attr("stroke-opacity", 0.1)
        .call(g => g.append("g")
            .selectAll("line")
            .data(x.ticks())
            .join("line")
            .attr("x1", d => 0.5 + x(d))
            .attr("x2", d => 0.5 + x(d))
            .attr("y1", margin.top)
            .attr("y2", height - margin.bottom))
        .call(g => g.append("g")
            .selectAll("line")
            .data(y.ticks())
            .join("line")
            .attr("y1", d => 0.5 + y(d))
            .attr("y2", d => 0.5 + y(d))
            .attr("x1", margin.left)
            .attr("x2", width - margin.right));
    let y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.y)).nice()
        .range([height - margin.bottom, margin.top]);
    let x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.x)).nice()
        .range([margin.left, width - margin.right]);

    let yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", -margin.left)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(data.y));
    let xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 50))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", width)
            .attr("y", margin.bottom - 4)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text(data.x));
    let svg = d3.select("#treemap")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    svg.append("g")
        .call(grid);
    let tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "svg-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden");


    svg.append("g")
        .attr("stroke-width", 1.5)
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .selectAll("path")
        .data(data)
        .join("path")
        .attr("transform", d => `translate(${x(d.x)},${y(d.y)})`)
        .attr("fill", d => color(d.category))
        .attr("d", d => shape(d.category))
        .on("mouseover", function(event,d) {
            // change the selection style
            console.log(d);
            d3.select(this)
                .attr('stroke-width', '4')
                .attr("stroke", "black")
                .style('fill', "gray");

            tooltip
                .style("visibility", "visible")
                .text(
                    `Country: ${d.category}\nGPD: ${d.x}\n HappinessScore: ${d.y}`
                );
        })
        .on("mousemove", function(d, i) {
            tooltip
                .style("top", (parseInt(this.getBoundingClientRect().y)-5) + "px")
                .style("left", (parseInt(this.getBoundingClientRect().x)+50) + "px");
        })
        .on("mouseout", function(d, i) {
            // change the selection style
            d3.select(this)
                .style("fill", "white")
                .attr("stroke", "black")
                .attr("stroke-width", 2);

            tooltip.style("visibility", "hidden");
        });
  
});

