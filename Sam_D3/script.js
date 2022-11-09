let ukTopojson
let townFeed


let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

function drawMap() {
    
    var margin = {top: 0, left: 0, right: 0, bottom: 0},
    height = 800 - margin.top - margin.bottom,
    width =900 - margin.left - margin.right;

    projection = d3.geoAlbers()
        .translate([ width / 2, height / 2])
        .rotate([2, -15])
        .scale(2500)
        

    path = d3.geoPath()
        .projection(projection)
		
 
    canvas.selectAll('path')
            .data(ukTopojson)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('class', 'county')
           
            

}
function sam(a,b){
	
d3.select('#tooltip')
                .style('left', (a + 20) + 'px')
                .style('top', (b - 40) + 'px')
                .style('display', 'block')
                .style('opacity', 0.8)
}

// UPDATING DATA WHEN CLICKED
function animateNewTown(dataset) {
var circles=canvas.selectAll("circle")
   .data(dataset)
   .enter()
   .append("circle")
   .on('mouseover', function(d) {
              d3.select('#country').text(d.Town);
              d3.select('#county').text(d.County);
              d3.select('#population').text(d.Population);
              
              
            })
            .on	('mouseout', function(d) { 
              d3.select('#tooltip')
                .style('display', 'none');
            });
   

circles.attr("cx", function(d){     
    return projection([d.lng,d.lat])[0];
} )
.attr("cy",function(d){
    return projection([d.lng,d.lat])[1];
} )
.attr("r", function(d){
    return 5;
} )
.attr("onmousemove",function(d){
	
return "sam("+projection([d.lng,d.lat])[0]+","+projection([d.lng,d.lat])[1]+")";

})

;  
   
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

                // CONVERTING JSON INTO TOPOJSON
                ukTopojson = topojson.feature(data, data.objects.GBR_adm2).features
                console.log(ukTopojson)
                drawMap();
               
                

                
            }
        }
    )

}



function updateMap() {

    

                              
                d3.json('http://34.78.46.186/Circles/Towns/50')
                    .then(
                    function (data, error) {
                        if(error){
                            console.log(error)
                        }else{
                            townFeed = data //topojson.feature(data, data.objects.lad).features
                            animateNewTown(townFeed)
						
                        }
                    }
                )

                
            }
        
    


window.onload = loadData;
