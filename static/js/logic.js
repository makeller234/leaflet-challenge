var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 4
  });
  
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
maxZoom: 18,
id: "mapbox.streets",
accessToken: API_KEY
}).addTo(myMap);

//time converter function
function timeConvert(time){
    var timeJS = new Date(time*1000);

    var year = timeJS.getFullYear(); //doesn't record year correctly
    var month = timeJS.getMonth();
    var day = timeJS.getDate();
    
    var fullDate = year+"."+month+"."+day

    return fullDate;
}

//create variable outside d3.json area to keep it in a larger scope so it can be used for the legend.
var respData; 

//read in data and add markers
d3.json(link, function(response){
    respData = response.features;
    console.log(respData);
    var color = "";

    //loop through responses to do the following...
    for (var i = 0; i<respData.length; i++){
        
        //assign color based on magnitude
        if (respData[i].properties.mag > 5){
            color = "#FF0000";
        }
        else if (respData[i].properties.mag > 4) {
            color = "#FF4D00";
        }
        else if (respData[i].properties.mag > 3) {
            color = "#FFA200";
        }
        else if (respData[i].properties.mag > 2) {
            color = "#FFE600";
        }
        else if (respData[i].properties.mag > 1){
            color = "#E6FF00";
        }
        else {
            color = "#5EFF00";
        }

        //converts the timestamp to a human readable format
        var date = timeConvert(respData[i].properties.time)

        //add the circles to the map and give them the popUp
        L.circle([respData[i].geometry.coordinates[1], respData[i].geometry.coordinates[0]], {
            fillOpacity: .75,
            color: color,
            radius: respData[i].properties.mag * 3000
        }).bindPopup("Date: " + date + "<br> Location: "+ respData[i].properties.place+ "<br> Magnitude: " + respData[i].properties.mag).addTo(myMap);
    }
});


// add legend
var legend = L.control({position: "bottomleft"});
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = [0, 1, 2, 3, 4, 5];
    var colors = ["#5EFF00", "#E6FF00", "#FFE600", "#FFA200", "#FF4D00", "#FF0000"];

    div.innerHTML = legend;
    
    return div;
};

legend.addTo(myMap);
