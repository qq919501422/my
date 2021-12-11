let height = 800;
let width=1300;
let margin = ({top: 20, right: 0, bottom: 30, left: 40});
d3.csv("../2015.csv",d3.autoType).then(data=> {
    data = data.map(({Country, Freedom}) => ({x:Country,y:Freedom}));
    console.log(data);
    function zoom(svg) {
        let extent = [[margin.left, margin.top], [width - margin.right, height - margin.top]];

        svg.call(d3.zoom()
            .scaleExtent([1, 8])
            .translateExtent(extent)
            .extent(extent)
            .on("zoom", zoomed));

        function zoomed(event) {
            x.range([margin.left, width - margin.right].map(d => event.transform.applyX(d)));
            svg.selectAll(".bars rect").attr("x", d => x(d.x)).attr("width", x.bandwidth());
            svg.selectAll(".x-axis").call(xAxis);
        }
    }
   let x = d3.scaleBand()
        .domain(data.map(d => d.x))
        .range([margin.left, width - margin.right])
        .padding(0.1);
    let  y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.y)]).nice()
        .range([height - margin.bottom, margin.top]);
    let  xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));
    let yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove());

    let svg=d3.select("#linechartgdp")
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .call(zoom);

    svg.append("g")
        .attr("class", "bars")
        .attr("fill", "steelblue")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", d => x(d.x))
        .attr("y", d => y(d.y))
        .attr("height", d => y(0) - y(d.y))
        .attr("width", x.bandwidth());

    svg.append("g")
        .attr("class", "x-axis")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis);




})