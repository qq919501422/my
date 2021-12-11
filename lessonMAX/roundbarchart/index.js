 let innerRadius = 75;
    let dimensions = ({height:500,
        width:500,
        margin: {
            top: 5,
            right: 10,
            bottom: 10,
            left: 10,
        } });
    let outerRadius = Math.min(dimensions.width, dimensions.height) / 2;
    d3.csv("../2015.csv",d3.autoType).then(data=>{
        data = data.map(({Country,HappinessRank, Family})=>({Country,HappinessRank, value: Family*350})).reverse();
        console.log(data);
        let x = d3.scaleBand()
            .range([0, 2 * Math.PI])
            .align(0)
            .domain(data.map(d => d.HappinessRank));
        let y = d3.scaleLinear()
            .range([innerRadius, outerRadius])
            .domain([0, 600]);

        let svg=d3.select("#roundbarchart")
            .append("svg")
            .attr("width", dimensions.width + dimensions.margin.left + dimensions.margin.right)
            .attr("height", dimensions.height + dimensions.margin.top + dimensions.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + dimensions.width / 2 + "," + ( dimensions.height/1.5)+")");

        svg.append("g")
            .selectAll("path")
            .data(data)
            .enter()
            .append("path")
            .attr('fill', "skyblue")
            .attr("d", d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(d => y(d['value']))
                .startAngle(d => x(d.HappinessRank))
                .endAngle(d => x(d.HappinessRank) + x.bandwidth())
                .padAngle(0.01)
                .padRadius(innerRadius))
            .on("mouseover", function(event, d) {
                console.log(d);
                d3.select(this).style("fill", "steelblue");
                tooltip.html(`<div class="chart-tooltip">
        <div class="chart-tooltip-desc">
        <span class="highlight-data">Country:</span>
<span>${d.Country}</span>
</div>
 <div class="chart-tooltip-desc">
<span class="highlight-data">HappinessRank:</span>
<span>${d.HappinessRank}</span>
</div>
 <div class="chart-tooltip-desc">
<span class="highlight-data">Family:</span>
<span>${parseFloat(d.value/80).toFixed(20)}</span>
</div>

      </div>`);
                tooltip.style("visibility", "visible");
            })
            .on("mousemove", function(){
                return tooltip.style("top", (parseInt(this.getBoundingClientRect().y)-100)+"px").style("left",(parseInt(this.getBoundingClientRect().x)+100)+"px");
            })
            .on("mouseout", function(d) {
                d3.select(this).style("fill", "skyblue");
                tooltip.style("visibility", "hidden");
            });

        let tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("background", "#fff")
            .text("an empty tooltip");

        let legendLabels = ["Family"];

        let legend = svg.append('g')
            .attr('class', 'legend');

        legend.selectAll('rect')
            .data(legendLabels)
            .enter()
            .append('rect')
            .attr('x', -40)
            .attr('y', -20)
            .attr('width', 12)
            .attr('height', 12)
            .attr('fill', "skyblue");

        legend.selectAll('text')
            .data(legendLabels)
            .enter()
            .append('text')
            .text("Family")
            .attr('x', -20)
            .attr('y', -20)
            .style("fill", "#fff")
            .attr('text-anchor', 'start')
            .attr('alignment-baseline', 'hanging');


    });




