let height = 600;
let width = 900;
let margin = ({top: 100, right: 0, bottom: 30, left: 10});

var toolTip = d3.select("body").append("div").attr("class", "toolTip");
function nodeMouseOver(event, d){
    d3.select(this).style("fill", "steelblue");
    toolTip.style("left", event.pageX + 18 + "px")
        .style("top", event.pageY + 18 + "px")
        .style("display", "block")
        .html( "Country:"+d.Country+'<br>'+"HappinessRank:"+d.HappinessRank+'<br>'+"GDP:"+d.EconomyGDPperCapita);
    d3.select(event.target).style("cursor", "pointer");
}

function nodeMouseOut(event, d){
    toolTip.style("display", "none");
    d3.select(this).style("fill", "skyblue");
}
d3.csv("../2015.csv",d3.autoType).then(data=>{
    data = data.map(({Country,HappinessRank, EconomyGDPperCapita})=>({HappinessRank,Country, EconomyGDPperCapita}));
    console.log(data);


  let  xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
      .attr("fill",'#fff')
.call(d3.axisBottom(x).tickFormat(i => data[i].SOCIAL_TIER).tickSizeOuter(0))
        .style('font-weight','bold');
   let yAxis = g => g
       .attr("transform", `translate(${margin.left},0)`)
       .call(d3.axisLeft(y))
       .attr("fill",'#fff')
.call(g => g.select(".domain").remove());
  let  y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.EconomyGDPperCapita)]).nice()
        //.range(1000)
        .range([height - margin.bottom, margin.top]);
   let x = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([margin.left, width - margin.right])
        .padding(0.1);


    let svg=d3.select("#barchart")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

    svg.append("g")
        .attr("fill", "skyblue")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", (d, i) => x(i))
        .attr("y", d => y(d.EconomyGDPperCapita))

        .attr("height", d => y(0) - y(d.EconomyGDPperCapita))
        .attr("width", x.bandwidth())

        .on('mousemove', nodeMouseOver)
        .on('mouseout', nodeMouseOut )
    ;



    svg.append("g")
        .attr("class", "bar-label-group")
        .selectAll(".bar-label")
        .data(data)
        .join(
            enter => {
                enter
                    .append("text")
                    .attr("class", "bar-label")
                    .attr("x", (d, i) => x(i) + (x.bandwidth() / 2))
                    .attr("y", d => y(d.EconomyGDPperCapita) - 5)
                    .attr("width", x.bandwidth())
                    .attr('text-anchor','middle')


            }
        )


    svg.append("g")
        .call(xAxis);
    svg.append("g")
        .call(yAxis);




    let legendLabels = ["GDP"];

    let legend = svg.append('g');

    legend.selectAll('rect')
        .data(legendLabels)
        .enter()
        .append('rect')
        .attr('x', 20)
        .attr('y', 20)
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', "skyblue");

    legend.selectAll('text')
        .data(legendLabels)
        .enter()
        .append('text')
        .text("GDP")
        .attr('x', 40)
        .attr('y', 20)
        .attr('text-anchor', 'start')
        .attr('fill','skyblue')
        .attr('alignment-baseline', 'hanging');

});


