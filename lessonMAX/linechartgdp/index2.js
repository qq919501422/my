let config_size = {
    svg_width: 800,
    svg_height: 500,
    plot_margin: {
        left: 30,
        right: 20,
        top: 20,
        buttom: 20,
    },
};
d3.csv("../2015.csv",d3.autoType).then(data=> {
     data = data.map(({Country,HappinessRank, Generosity}) => ({Country,HappinessRank,Generosity}));
     console.log(data);




    // let data = Object.keys(map_data).map(key => ({HappinessRank: parseInt(key), Generosity: map_data[key]}));

    let svg=d3.select("#linechartgdp")
        .append("svg")
        .attr("width", config_size.svg_width).attr("height", config_size.svg_height);
    let plot_g = svg.append('g').classed('plot', true)
        .attr('transform',  `translate(${config_size.plot_margin.left}, ${config_size.plot_margin.top})`);
    let plot_width = config_size.svg_width - config_size.plot_margin.left - config_size.plot_margin.right;
    let plot_height = config_size.svg_height - config_size.plot_margin.top - config_size.plot_margin.buttom
    let background = plot_g.append('rect')
        .attr('width', plot_width).attr('height', plot_height)
        .attr('fill', 'blue').attr('fill-opacity', 0.00);

    let x = d3.scaleLinear()
        .domain(d3.extent(data, d=>d.HappinessRank))
        .range([0, plot_width]);
    plot_g.append("g")
        .attr("transform", `translate(${0},${plot_height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d=>d.Generosity)])
        .range([plot_height, 0]);
    plot_g.append("g")
        .attr("transform", `translate(${0},${0})`)
        .call(d3.axisLeft(y));

    plot_g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return x(d.HappinessRank) })
            .y(function(d) { return y(d.Generosity) })
        )

    let mouse_g = plot_g.append('g').classed('mouse', true).style('display', 'none');
    mouse_g.append('rect').attr('width', 2).attr('x',-1).attr('height', plot_height).attr('fill', 'lightgray');
    mouse_g.append('circle').attr('r', 3).attr("stroke", "steelblue");
    mouse_g.append('text');


    plot_g.on("mouseover", function(mouse) {
        mouse_g.style('display', 'block');
    });
    let [min_HappinessRank, max_HappinessRank] = d3.extent(data, d=>d.HappinessRank);
    let Generosity_sum = d3.sum(data, d=>d.Generosity);
    plot_g.data(data)
        .on("mousemove", function(mouse,d) {
        let [x_cord,y_cord] = d3.pointer(mouse);
        let ratio = x_cord / plot_width;
        let current_HappinessRank = min_HappinessRank + Math.round(ratio * (max_HappinessRank - min_HappinessRank));
        let Generosity = data.find(d => d.HappinessRank === current_HappinessRank).Generosity;
        mouse_g.attr('transform', `translate(${x(current_HappinessRank)},${0})`);
            // Country,HappinessRank:HappinessRank,Generosity:Generosity
        mouse_g.select('text').html(`幸福排名:${current_HappinessRank}\n\n慷慨指数:${Generosity}`)
            .attr("fill", "steelblue");

        mouse_g.select('circle').attr('cy', y(Generosity));
    });
    plot_g.on("mouseout", function(mouse) {
        mouse_g.style('display', 'none');
    });
})