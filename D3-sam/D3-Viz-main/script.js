let ukTopojson
let townFeed


let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

function drawMap() {
    
    var margin = {top: 0, left: 0, right: 0, bottom: 0},
    height = 900 - margin.top - margin.bottom,
    width = 1000 - margin.left - margin.right;

    projection = d3.geoAlbers()
        .translate([ width / 2, height / 2])
        .rotate([2, -15])
        .scale(3000)
        

    path = d3.geoPath()
        .projection(projection)
 
    canvas.selectAll('path')
            .data(ukTopojson)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('class', 'county')
            .on('mouseover', function(d) {
              d3.select('#country').text(d.properties.NAME_1);
              d3.select('#county').text(d.properties.NAME_2);
              d3.select('#region').text(d.properties.TYPE_2);
              d3.select('#population').text(
                      
                );
              d3.select('#tooltip')
                .style('left', (d3.event.pageX + 50) + 'px')
                .style('top', (d3.event.pageY - 80) + 'px')
                .style('display', 'block')
                .style('opacity', 0.8)
            })
            .on('mouseout', function(d) { 
              d3.select('#tooltip')
                .style('display', 'none');
            });
            

}



// ANIMATE NEW LOADED TOWN FEED DATA
function animateNewTown() {
 
    var county = canvas.selectAll('path')
            .data(ukTopojson)
            .transition()
            .duration(500)
            .ease('elastic');

        county.attr('path', function(d){
            
        })
    }

function loadData() {

    d3.select("#update")
    .on("click",function(){
        
        updateMap();
    });

    d3.json('https://raw.githubusercontent.com/deldersveld/topojson/master/countries/united-kingdom/uk-counties.json')
        .then(
        function (data, error) {
            if(error){
                console.log(error)
            }else{

                // CONVERTING UK GEOMETRY JSON FILE INTO TOPOJSON
                ukTopojson = topojson.feature(data, data.objects.GBR_adm2).features
                console.log(ukTopojson)
                
                // LOAD THE LOCAL TOWN FEED DATA
                d3.json('http://34.78.46.186/Circles/Towns/50')
                    .then(
                    function (data, error) {
                        if(error){
                            console.log(error)
                        }else{
                            townFeed = data //topojson.feature(data, data.objects.lad).features
                            console.log(townFeed)
                            drawMap()
                        }
                    }
                )

                
            }
        }
    )

}

function updateMap() {

    d3.json('https://raw.githubusercontent.com/deldersveld/topojson/master/countries/united-kingdom/uk-counties.json')
        .then(
        function (data, error) {
            if(error){
                console.log(error)
            }else{
                // CONVERT UK GEOMETRY JSON FILE INTO TOPOJSON
                ukTopojson = topojson.feature(data, data.objects.GBR_adm2).features

                //  LOAD THE TOWN FEED DATA               
                d3.json('http://34.78.46.186/Circles/Towns/50')
                    .then(
                    function (data, error) {
                        if(error){
                            console.log(error)
                        }else{
                            townFeed = data //topojson.feature(data, data.objects.lad).features
                            animateNewTown()
                        }
                    }
                )

                
            }
        }
    )
}


window.onload = loadData;
