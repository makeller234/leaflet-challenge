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

//time converter function, taken from Dom's that was presented during class on 2020.04.04
function timeConvert(time){
    // Dom had time multiplied by 1000...but it works without it and doesn't work with it which is why I'm not multiplying it by 1000.

    var d = new Date(time).toLocaleDateString();
    var t = new Date(time).toLocaleTimeString();

    var datetime = "Date: " + d + " Time: " + t;
    return datetime;
}

//function to get the color based on the size of the magnitude
function getColor(d){
    var color = "";
    if (d> 5){
        color = "#FF0000";
    }
    else if (d > 4) {
        color = "#FF4D00";
    }
    else if (d > 3) {
        color = "#FFA200";
    }
    else if (d > 2) {
        color = "#FFE600";
    }
    else if (d > 1){
        color = "#E6FF00";
    }
    else {
        color = "#5EFF00";
    }

    return color;
}


//read in data and add markers
d3.json(link, function(response){
    var respData = response.features;
    // console.log(respData);


    //loop through responses to do the following...
    for (var i = 0; i<respData.length; i++){

        // call function to get color
        var magColor = getColor(respData[i].properties.mag)

        //converts the timestamp to a human readable format
        var date = timeConvert(respData[i].properties.time)

        //add the circles to the map and give them the popUp
        L.circle([respData[i].geometry.coordinates[1], respData[i].geometry.coordinates[0]], {
            fillOpacity: .75,
            fillColor: magColor,
            color: "black",
            weight: .5,
            radius: respData[i].properties.mag * 5000
            //don't have formatting for the date because the formatting is handled in the function. 
        }).bindPopup(date + "<br> Location: "+ respData[i].properties.place+ "<br> Magnitude: " + respData[i].properties.mag).addTo(myMap);
    }
});

// add legend (my first attempt)
var legend = L.control({position: "bottomleft"});
legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "info legend"),
        limits = [0, 1, 2, 3, 4, 5];
        div.innerHTML += '<h2>Magnitude</h2>'
        for (var i = 0; i < limits.length; i++) {
            div.innerHTML += '<ul style=background-color:' + getColor(limits[i]+1) + '> ' + 
            limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] : '+ </ul>');
            // limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+ </ul>');
            }
        return div;

};

legend.addTo(myMap);
