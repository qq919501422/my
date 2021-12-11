let height = 600;
let width = 900;
let margin = ({top: 50, right: 0, bottom: -100, left: 10});
let color = "#83CFFF";

var toolTip = d3.select("body").append("div").attr("class", "toolTip");
function nodeMouseOver(event, d){
    d3.select(this).style("fill", "skyblue");
    toolTip.style("left", event.pageX + 18 + "px")
        .style("top", event.pageY + 18 + "px")
        .style("display", "block")
        .html( "Country:"+d.Country+'<br>'+"HappinessRank:"+d.HappinessRank+'<br>'+"Trust (Government Corruption):"+d.TrustGovernmentCorruption);
    d3.select(event.target).style("cursor", "pointer");
}

function nodeMouseOut(event, d){
    toolTip.style("display", "none");
    d3.select(this).style("fill", "steelblue");
}
d3.csv("../2015.csv",d3.autoType).then(data=>{
    data = data.map(({Country,HappinessRank, TrustGovernmentCorruption})=>({HappinessRank,Country, TrustGovernmentCorruption}));
    console.log(data);


  let  xAxis = g => g
      .attr("transform", `translate(0,${margin.top})`)
      .call(d3.axisTop(x).ticks(width / 80, data.format))
      .call(g => g.select(".domain").remove());
   let yAxis = g => g
       .attr("transform", `translate(${margin.left},0)`)
       .call(d3.axisLeft(y).tickFormat(i => null).tickSizeOuter(0));
  let  y = d3.scaleBand()
      .domain(d3.range(data.length))
      .rangeRound([margin.top, height - margin.bottom])
      .padding(0.1) //;
   let x = d3.scaleLinear()
       .domain([0, d3.max(data, d => d.TrustGovernmentCorruption)])
       .range([margin.left, width - margin.right]);

  let format = x.tickFormat(20, data.format);
    let svg=d3.select("#barchart")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);
    svg.append("g")
        .attr("fill", "steelblue")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", x(0))
        .attr("y", (d, i) => y(i))
        .attr("width", d => x(d.TrustGovernmentCorruption) - x(0))
        .attr("height", y.bandwidth())
        .on('mousemove', nodeMouseOver)
        .on('mouseout', nodeMouseOut );

    svg.append("g")
        .attr("fill", "white")
        .attr("text-anchor", "end")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
        .selectAll("text")
        .data(data)
        .join("text")
        .attr("x", d => x(d.TrustGovernmentCorruption))
        .attr("y", (d, i) => y(i) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("dx", -4)
        .call(text => text.filter(d => x(d.TrustGovernmentCorruption) - x(0) < 20) // short bars
            .attr("dx", +4)
            .attr("fill", "black")
            .attr("text-anchor", "start"));

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);


});


