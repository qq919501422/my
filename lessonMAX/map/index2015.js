const svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");
var dataone;
var datatwo;
const projection = d3.geoNaturalEarth1()
    .scale(width / 1.3 / Math.PI)
    .translate([width / 2, height / 2])
var messages=null;

var Countrys=null;
var HappinessRanks=null;
var HappinessScores=null;
var EconomyGDPperCapitas=null;
var HealthLifeExpectancys=null;
var Familys=null;
var Freedoms=null;
var TrustGovernmentCorruptions=null;
var Generositys=null;
var DystopiaResiduals=null;

function returnGenerositys(){
    return Generositys;
}
function returnDystopiaResiduals(){
    return DystopiaResiduals;
}

function returnEconomyGDPperCapitas(){
    return EconomyGDPperCapitas;
}

function returnHealthLifeExpectancys(){
    return HealthLifeExpectancys;
}

function returnFamilys(){
    return Familys;
}

function returnFreedoms(){
    return Freedoms;
}

function returnTrustGovernmentCorruptions(){
    return TrustGovernmentCorruptions;
}

function returnCountrys(){
    return Countrys;
}
function returnHappinessRanks(){
    return HappinessRanks;
}
function returnHappinessScores(){
    return HappinessScores;
}

var toolTip = d3.select("body").append("div").attr("class", "toolTip");

function nodeMouseOver(event, d){
    // Get the toolTip, update the position, and append the inner html depending on your content
    // I tend to use template literal to more easily output variables.
    try {
        let result = dataone.filter(word => word.Country==d.properties.name);
        messages="国家："+result[0].Country+"幸福排名"+result[0].HappinessRank;
        Countrys=result[0].Country;
         HappinessRanks=result[0].HappinessRank;
        HappinessScores=result[0].HappinessScore;
        EconomyGDPperCapitas=result[0].EconomyGDPperCapita;
         HealthLifeExpectancys=result[0].HealthLifeExpectancy;
         Familys=result[0].Family;
        Freedoms=result[0].Freedom;
        TrustGovernmentCorruptions=result[0].TrustGovernmentCorruption;
         Generositys=result[0].Generosity;
        DystopiaResiduals=result[0].DystopiaResidual;


    } catch(err){
        messages="此地区:"+d.properties.name+"暂无统计";
        Countrys="此地区暂无统计";
        HappinessRanks=null;
        HappinessScores=null;
        EconomyGDPperCapitas=null;
        HealthLifeExpectancys=null;
        Familys=null;
        Freedoms=null;
        TrustGovernmentCorruptions=null;
        Generositys=null;
        DystopiaResiduals=null;
    }

    toolTip.style("left", event.pageX + 18 + "px")
        .style("top", event.pageY + 18 + "px")
        .style("display", "block")
        .html(messages);

    // Optional cursor change on target
    d3.select(event.target).style("cursor", "pointer");

    // Optional highlight effects on target
    d3.select(event.target)
        .transition()
        .attr('stroke', '#fff')
        .attr('stroke-width', 1);
}

function nodeMouseOut(event, d){
    // Hide tooltip on mouse out
    toolTip.style("display", "none"); // Hide toolTip

    // Optional cursor change removed
    d3.select(event.target).style("cursor", "default");

    // Optional highlight removed
    d3.select(event.target)
        .transition()
        .attr('stroke', '#fff')
        .attr('stroke-width', 1);
}
d3.csv( "../2015.csv" ).then (data => {
    dataone = data.map(({Country, HappinessScore,HappinessRank,EconomyGDPperCapita,Family,HealthLifeExpectancy,Freedom,TrustGovernmentCorruption,Generosity,DystopiaResidual}) => ({DystopiaResidual,Generosity,TrustGovernmentCorruption,Freedom,HealthLifeExpectancy,Family,EconomyGDPperCapita,HappinessRank,Country, HappinessScore}));
    console.log(dataone);
});
d3.json("../world.geojson").then(function(data) {

    datatwo=data.features;
    console.log(datatwo);
    svg.append("g")
        .selectAll("path")
        .data(datatwo)
        .join("path")
        .attr("fill", "#69b3a2")
        .attr("d", d3.geoPath()
            .projection(projection)
        )

        .on('mousemove', nodeMouseOver)
        .on('mouseout', nodeMouseOut );
});
