let margin = ({
    top: -100,
    bottom: 150,
    left: 30,
    right: 100
});
let width=750;
let height = 600;
function length(path) {
    return d3
        .create("svg:path")
        .attr("d", path)
        .node()

        .getTotalLength();
}
d3.csv("../2015.csv",d3.autoType).then(data=> {
     data = data.map(({Country,HappinessRank, HealthLifeExpectancy}) => ({name:Country,x:HappinessRank,y:HealthLifeExpectancy}));
     console.log(data);

    let xAccessor = d => d.x;
    let yAccessor = d => d.y;
    let xScale = d3
        .scaleLinear()
        .domain(d3.extent(data, xAccessor))
        .nice()

        .range([margin.left, width - margin.right])
    ;
    let yScale = d3
        .scaleLinear()
        .domain(d3.extent(data, yAccessor))
        .nice()
        .range([height - margin.bottom, margin.top]);
   let  xAxis = g =>
        g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale).ticks(width / 80, ",f"))
            .call(g => g.select(".domain").remove())
            .call(g =>
                g
                    .selectAll(".tick line")
                    .clone()
                    .attr("y2", -height)
                    .attr("stroke-opacity", 0.1)
                    .attr("fill", "skyblue")
            )
            .call(g =>
                g
                    .append("text")
                    .attr("x", width - 4)
                    .attr("y", -4)
                    .attr("font-weight", "bold")
                    .attr("font-size", 14)
                    .attr("text-anchor", "end")
                    .attr("fill", "skyblue")
                    .text(data.x)
            );
   let yAxis = g =>
       g
           .attr("transform", `translate(${margin.left},0)`)
           .call(d3.axisLeft(yScale).ticks(null, ",f"))
           .call(g => g.select(".domain").remove())
           .call(g =>
               g
                   .selectAll(".tick line")
                   .clone()
                   .attr("x2", width)
                   .attr("stroke-opacity", 0.1)
                   .attr("fill", "skyblue")
           )
           .call(g =>
               g
                   .select(".tick:last-of-type text")
                   .clone()
                   .attr("x", 4)
                   .attr("font-size", 14)
                   .attr("text-anchor", "start")
                   .attr("font-weight", "bold")
                   .attr("fill", "skyblue")
                   .text(data.y)
           )
           .attr("fill", "skyblue");

   let line = d3
        .line()
        .curve(d3.curveCatmullRom)
        .x(d => xScale(xAccessor(d)))
        .y(d => yScale(yAccessor(d)))
   ;
    let svg=d3.select("#scatterplot")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

    let l = length(line(data));

    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);

    svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "skyblue")
        .attr("stroke-width", 2.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")

        .attr("stroke-dasharray", `0,${l}`)

        .attr("d", line)
        .transition()
        .duration(5000)
        .ease(d3.easeLinear)
        .attr("stroke-dasharray", `${l},${l}`);

    svg
        .append("g")
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .selectAll("circle")
        .data(data)
        .join("circle")

        .attr("cx", d => xScale(xAccessor(d)))
        .attr("cy", d => yScale(yAccessor(d)))
        .attr("r", 5);

    let label = svg
        .append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 14)

        .selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", d => `translate(${xScale(d.x)},${yScale(d.y)})`)
        .attr("opacity", 0)
        .attr("fill", "skyblue")
    ;

    label
        .append("text")
        .each(function(d) {
            let t = d3.select(this);

                    t.attr("text-anchor", "middle").attr("dy", "-0.7em");

        });

    label
        .transition(10)
        .delay((d, i) => (length(line(data.slice(0, i + 1))) / l) * (5000 - 50))
        .attr("opacity", 1);


        let tooltip = d3
            .select("body")
            .append("div")
            .attr("class", "svg-tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden");

        d3.selectAll("circle")
            .data(data)
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

                        `国家: ${d.name}\n幸福排名: ${d.x}\n健康寿命指数: ${d.y}`
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


})