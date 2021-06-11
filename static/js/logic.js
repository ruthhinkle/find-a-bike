// CUSTOMIZE YOUR LOCATION

// EDIT VARIABLES: For your city, find the JSON formatted urls of "station_information" and "station_status". 
// The placeholder urls are for Chicago's bikeshare program, Divvy.
var url_station_info = "https://gbfs.divvybikes.com/gbfs/en/station_information.json"
var url_station_status = "https://gbfs.divvybikes.com/gbfs/en/station_status.json"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// SET UP: CREATE MAP, LAYERS, OVERLAYS, LAYER CONTROL, LEGEND CLASS, AND OBJECTS TO CONTAIN ICONS

// Create the tile layer that will be the background of our map.
var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Initialize all the LayerGroups that we'll use.
var layers = {
  EMPTY: new L.LayerGroup(),
  LOW: new L.LayerGroup(),
  NORMAL: new L.LayerGroup(),
  LANDMARKS: new L.LayerGroup(),
  ROUTES: new L.LayerGroup(),
};

// Create the map with our layers.
// NOTE: The "center" of this map is Chicago. Edit for your city.
var map = L.map("map-id", {
  center: [41.88, -87.62],
  zoom: 11,
  layers: [
    layers.EMPTY,
    layers.LOW,
    layers.NORMAL,
    layers.LANDMARKS,
    layers.ROUTES,
  ]
});

// Add our "streetmap" tile layer to the map.
streetmap.addTo(map);

// Create an overlays object to add to the layer control.
var overlays = {
  // "Empty Stations": layers.EMPTY,
  // "Low Stations": layers.LOW,
  // "Full Stations": layers.NORMAL,
  "Landmarks": layers.LANDMARKS,
  "Popular Routes": layers.ROUTES,
};

// // Create a control for our layers, and add our overlays to it.
L.control.layers(null, overlays).addTo(map);

// Create a legend to display information about our map.
var info = L.control({
  position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend".
info.onAdd = function () {
  var div = L.DomUtil.create("div", "legend");
  return div;
};
// Add the info legend to the map.
info.addTo(map);

// Initialize an object that contains icons for each layer group.
var icons = {
  EMPTY: L.ExtraMarkers.icon({
    // icon: "ion-android-bicycle",
    iconColor: "white",
    markerColor: "red",
    shape: "circle"
  }),
  LOW: L.ExtraMarkers.icon({
    // icon: "ion-android-bicycle",
    iconColor: "white",
    markerColor: "orange",
    shape: "circle"
  }),
  NORMAL: L.ExtraMarkers.icon({
    // icon: "ion-android-bicycle",
    iconColor: "white",
    markerColor: "green",
    shape: "circle"
  })
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// CREATE FUNCTIONS TO CALL ON TOGGLE BUTTONS

// Function that updates the legend's innerHTML with the last updated time and station count.
function updateLegend(time, stationCount) {
  document.querySelector(".legend").innerHTML = [
    "<p><strong>Station Bike Capacity</strong></p>",
    "<p class='full'>Full: " + stationCount.NORMAL + "</p>",
    "<p class='low'>Low: " + stationCount.LOW + "</p>",
    "<p class='empty'>Empty: " + stationCount.EMPTY + "</p>",
    "<p><em>Updated: " + moment.unix(time).format("h:mm:ss A") + "</em></p>"
  ].join("");
}

// Function to populate the map based on the toggle button options
function fillStations(stationStatus, stationInfo, updatedAt, bikeEbikes) {

  // Create an object to keep the number of markers in each layer.
  var stationCount = {
    EMPTY: 0,
    LOW: 0,
    NORMAL: 0,
  };

  // Initialize stationStatusCode, which will be used as a key to access the appropriate layers, icons, and station count for the layer group.
  var stationStatusCode;

  // Add a markerClusterGroup layer
  var groupedMarkers = L.markerClusterGroup();

  // Create conditional statements to fill map for each bike type on the toggle buttons

  // Conditional for "All Bikes" toggle button, which also loads automatically for index.html
  if (bikeEbikes === "bikes") {

    // Loop for all bikes
    for (var i = 0; i < stationInfo.length; i++) {

      // Create a new station object with properties of both station objects.
      var station = Object.assign({}, stationInfo[i], stationStatus[i]);

      // If a station has no available bikes, it's empty.
      if (!station.num_bikes_available) {
        stationStatusCode = "EMPTY";
      }

      // If a station has less than five bikes, it's status is low.
      else if (station.num_bikes_available < 5) {
        stationStatusCode = "LOW";
      }
      // Otherwise, the station is normal.
      else {
        stationStatusCode = "NORMAL";
      }

      // Update the station count.
      stationCount[stationStatusCode]++;

      // Create a new marker with the appropriate icon and coordinates.
      var newMarker = L.marker([station.lat, station.lon], {
        icon: icons[stationStatusCode]
      });

      // Add the new marker to the cluster layer group
      // newMarker.addTo(layers[stationStatusCode]);
      groupedMarkers.addLayer(newMarker)


      // Bind a popup to the marker that will  display on being clicked. This will be rendered as HTML.
      newMarker.bindPopup("<h5>" + station.name + "</h5>" + "<h6><br> Capacity: " + station.capacity + "<br>" + station.num_bikes_available + " Bikes Available </h6>");
    }

    // Call the updateLegend function, which will update the legend!
    updateLegend(updatedAt, stationCount);

    // Add the group marker layer to the map
    map.addLayer(groupedMarkers)
  }

  // Conditional for "Electric Bikes" toggle button
  else if (bikeEbikes === "ebikes") {

    // For loop for ebikes
    for (var i = 0; i < stationInfo.length; i++) {

      // Create a new station object with properties of both station objects.
      var station = Object.assign({}, stationInfo[i], stationStatus[i]);

      // If a station has no available bikes, it's empty.
      if (!station.num_ebikes_available) {
        stationStatusCode = "EMPTY";
      }

      // If a station has less than five bikes, it's status is low.
      else if (station.num_ebikes_available < 5) {
        stationStatusCode = "LOW";
      }
      // Otherwise, the station is normal.
      else {
        stationStatusCode = "NORMAL";
      }

      // Update the station count.
      stationCount[stationStatusCode]++;

      // Create a new marker with the appropriate icon and coordinates.
      var newMarker = L.marker([station.lat, station.lon], {
        icon: icons[stationStatusCode]
      });

      // Add the new marker to the cluster layer group
      groupedMarkers.addLayer(newMarker)

      // Bind a popup to the marker that will  display on being clicked. This will be rendered as HTML.
      newMarker.bindPopup("<h5>" + station.name + "</h5>" + "<h6><br> Capacity: " + station.capacity + "<br>" + station.num_ebikes_available + " eBikes Available </h6>");
    }

    // Call the updateLegend function, which will update the legend!
    updateLegend(updatedAt, stationCount);

    // Add the group marker layer to the map
    map.addLayer(groupedMarkers)
  }

  // Conditional for "Classic Bikes" toggle button
  else if (bikeEbikes === "classicbikes") {

    // Loop for classic bikes
    for (var i = 0; i < stationInfo.length; i++) {

      // Create a new station object with properties of both station objects.
      var station = Object.assign({}, stationInfo[i], stationStatus[i]);

      // Create a variable for classic bikes
      var num_classic_bikes_available = station.num_bikes_available - station.num_ebikes_available

      // If a station has no available bikes, it's empty.
      if (!num_classic_bikes_available) {
        stationStatusCode = "EMPTY";
      }

      // If a station has less than five bikes, it's status is low.
      else if (num_classic_bikes_available < 5) {
        stationStatusCode = "LOW";
      }
      // Otherwise, the station is normal.
      else {
        stationStatusCode = "NORMAL";
      }

      // Update the station count.
      stationCount[stationStatusCode]++;

      // Create a new marker with the appropriate icon and coordinates.
      var newMarker = L.marker([station.lat, station.lon], {
        icon: icons[stationStatusCode]
      });

      // Add the new marker to the cluster layer group
      groupedMarkers.addLayer(newMarker)

      // Bind a popup to the marker that will  display on being clicked. This will be rendered as HTML.
      newMarker.bindPopup("<h5>" + station.name + "</h5>" + "<h6><br> Capacity: " + station.capacity + "<br>" + num_classic_bikes_available + " Classic Bikes Available </h6>");
    }

    // Call the updateLegend function, which will update the legend!
    updateLegend(updatedAt, stationCount);

    // Add the group marker layer to the map
    map.addLayer(groupedMarkers)
  }

}

// Function to add ant-paths
function addAntPaths() {
  let antPolyline1 = L.polyline.antPath(lineOne, {
    color: "red",
    weight: 5
  })
  antPolyline1.addTo(layers.ROUTES)

  let antPolyline2 = L.polyline.antPath(lineTwo, {
    color: "green",
    weight: 3

  })
  antPolyline2.addTo(layers.ROUTES)

  let antPolyline3 = L.polyline.antPath(lineThree, {
    color: "black",
    weight: 3
  })
  antPolyline3.addTo(layers.ROUTES)

  let antPolyline4 = L.polyline.antPath(lineFour, {
    color: "purple",
    weight: 3
  })
  antPolyline4.addTo(layers.ROUTES)

  let antPolyline5 = L.polyline.antPath(lineFive, {
    color: "black",
    weight: 3,
    pulseColor: "gold"
  })
  antPolyline5.addTo(layers.ROUTES)

  let antPolyline6 = L.polyline.antPath(lineSix, {
    color: "black",
    weight: 3,
    pulseColor: "red"
  })
  antPolyline6.addTo(layers.ROUTES)

  let antPolyline8 = L.polyline.antPath(lineEight, {
    color: "teal",
    weight: 3,
    pulseColor: "black"
  })
  antPolyline8.addTo(layers.ROUTES)

  let antPolyline9 = L.polyline.antPath(lineNine, {
    color: "brown",
    weight: 3,
    pulseColor: "lightgreen"
  })
  antPolyline9.addTo(layers.ROUTES)

  let antPolyline10 = L.polyline.antPath(lineTen, {
    color: "aqua",
    weight: 3,
    pulseColor: "blue"
  })
  antPolyline10.addTo(layers.ROUTES)
}


// Function to toggle landmarks
function addLandmarks() {
  var landmarkIcon = L.Icon.extend({
    options: {
      shadowUrl: 'static/img/markers_shadow.png',
      iconSize: [29, 40],
      shadowSize: [35, 16],
      iconAnchor: [22, 94],
      shadowAnchor: [20, 64],
      popupAnchor: [-3, -76]
    }
  });

  var instituteIcon = new landmarkIcon({ iconUrl: 'static/img/whiteIcon_institute.png' }),
    fountainIcon = new landmarkIcon({ iconUrl: 'static/img/whiteIcon_fountain.png' }),
    theaterIcon = new landmarkIcon({ iconUrl: 'static/img/whiteIcon_theater.png' });
  baseballIcon = new landmarkIcon({ iconUrl: 'static/img/whiteIcon_baseball.png' });
  basketballIcon = new landmarkIcon({ iconUrl: 'static/img/whiteIcon_basketball.png' });
  chinatownIcon = new landmarkIcon({ iconUrl: 'static/img/whiteIcon_chinatown.png' });
  cloudgateIcon = new landmarkIcon({ iconUrl: 'static/img/whiteIcon_cloudgate.png' });
  conservatoryIcon = new landmarkIcon({ iconUrl: 'static/img/whiteIcon_conservatory.png' });
  downtownIcon = new landmarkIcon({ iconUrl: 'static/img/whiteIcon_downtown.png' });
  footballIcon = new landmarkIcon({ iconUrl: 'static/img/whiteIcon_football.png' });
  marinaIcon = new landmarkIcon({ iconUrl: 'static/img/whiteIcon_marina.png' });
  pequodsIcon = new landmarkIcon({ iconUrl: 'static/img/whiteIcon_pequods.png' });
  navypierIcon = new landmarkIcon({ iconUrl: 'static/img/whiteIcon_navypier.png' });
  zooIcon = new landmarkIcon({ iconUrl: 'static/img/whiteIcon_zoo.png' });

  // Popup formatting sample for landmarks
  // .bindPopup("<h5>" + 'The Art Institute of Chicago' + "</h5>" + "<br>" + "<h6>" + "Founded in 1879 as a museum and school of the arts."+"</h6>");

  L.marker([41.8796, -87.6237], { icon: instituteIcon }).addTo(layers.LANDMARKS).bindPopup("<h5>" + 'The Art Institute of Chicago' + "</h5>" + "<br>" + "<h6>" + "Founded in 1879 as a museum and school of the arts."+"</h6>");
  L.marker([41.8759, -87.6189], { icon: fountainIcon }).addTo(layers.LANDMARKS).bindPopup("<h5>" + "Buckingham Fountain"+ "</h5>" + "<br>" + "<h6>" + "One of the largest fountains worldwide, meant to represent nearby Lake Michigan."+"</h6>");
  L.marker([41.8855, -87.6274], { icon: theaterIcon }).addTo(layers.LANDMARKS).bindPopup("<h5>" + "Chicago Theater"+ "</h5>" + "<br>" + "<h6>" + "A distinctive landmark featured often in media that was built in 1921."+"</h6>");
  L.marker([41.9486, -87.6553], { icon: baseballIcon }).addTo(layers.LANDMARKS).bindPopup("<h5>" + "Wrigley Field"+ "</h5>" + "<br>" + "<h6>" + "Home of the Chicago Cubs, one of two Major League Baseball teams in the city."+"</h6>");
  L.marker([41.8301, -87.6337], { icon: baseballIcon }).addTo(layers.LANDMARKS).bindPopup("<h5>" + "Guaranteed Rate Field"+ "</h5>" + "<br>" + "<h6>" + "Home of the White Sox, one of two Major League Baseball teams in the city."+"</h6>");
  L.marker([41.8808, -87.6742], { icon: basketballIcon }).addTo(layers.LANDMARKS).bindPopup("<h5>" + "United Center"+ "</h5>" + "<br>" + "<h6>" + "Home of two major teams: the Blackhawks of the NHL and Chicago Bulls of the NBA."+"</h6>");
  L.marker([41.8527, -87.6320], { icon: chinatownIcon }).addTo(layers.LANDMARKS).bindPopup("<h5>" + "China Town"+ "</h5>" + "<br>" + "<h6>" + "Home to one of the largest concentrations of the Chinese population in the U.S."+"</h6>");
  L.marker([41.8828, -87.6233], { icon: cloudgateIcon }).addTo(layers.LANDMARKS).bindPopup("<h5>" + "Cloud Gate (a.k.a. 'The Bean')"+ "</h5>" + "<br>" + "<h6>" + "A popular destination for tourist photo-ops in downtown Chicago."+"</h6>");
  L.marker([41.8864, -87.7172], { icon: conservatoryIcon }).addTo(layers.LANDMARKS).bindPopup("<h5>" + "Garfield Park Conservatory"+ "</h5>" + "<br>" + "<h6>" + "One of the largest greenhouse conservatories in the U.S."+"</h6>");
  L.marker([41.8780, -87.6315], { icon: downtownIcon }).addTo(layers.LANDMARKS).bindPopup("<h5>" + "The Loop"+ "</h5>" + "<br>" + "<h6>" + "The heart of Chicago's business district and downtown."+"</h6>");
  L.marker([41.8627, -87.6166], { icon: footballIcon }).addTo(layers.LANDMARKS).bindPopup("<h5>" + "Soldier Field"+ "</h5>" + "<br>" + "<h6>" + "Home to the Chicago Bears of the NFL and the Chicago Fire FC of Major League Soccer."+"</h6>");
  L.marker([41.8881, -87.6290], { icon: marinaIcon }).addTo(layers.LANDMARKS).bindPopup("<h5>" + "Marina City"+ "</h5>" + "<br>" + "<h6>" + "These honeycomb structures combine residential and commercial endeavors."+"</h6>");
  L.marker([41.9220, -87.6645], { icon: pequodsIcon }).addTo(layers.LANDMARKS).bindPopup("Pequods Pizza"+ "</h5>" + "<br>" + "<h6>" + "A favorite of the creators of this page, known for their caramelized crusts."+"</h6>");
  L.marker([41.8919, -87.6100], { icon: navypierIcon }).addTo(layers.LANDMARKS).bindPopup("Navy Pier"+ "</h5>" + "<br>" + "<h6>" + "A popular attraction with over 50 acres of parks, gardens, shops, and more."+"</h6>");
  L.marker([41.9217, -87.6336], { icon: zooIcon }).addTo(layers.LANDMARKS).bindPopup("Lincoln Park Zoo"+ "</h5>" + "<br>" + "<h6>" + "A free admission zoo, also home to a burr oak tree planted before Chicago's founding."+"</h6>");

}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// CODE FOR INDEX.HTML AND "ALL BIKES" TOGGLE BUTTON

// Perform an API call to the Divvy Bike station information endpoint.
d3.json(url_station_info).then(function (infoRes) {


  // When the first API call completes, perform another call to the Divvy Bike station status endpoint.
  d3.json(url_station_status).then(function (statusRes) {
    var updatedAt = infoRes.last_updated;
    var stationStatus = statusRes.data.stations;
    var stationInfo = infoRes.data.stations;

    fillStations(stationStatus, stationInfo, updatedAt, "bikes")
    addAntPaths()
    addLandmarks()

  });

});


//ebikes toggling
function bikeeToggle(bikeType) {

  //destroy previous layers
  map.eachLayer(function (layer) {
    map.removeLayer(layer);
    map.removeLayer(layers);
  });
  var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  streetmap.addTo(map)

  // Add layers
  // var ebikelayer = new L.LayerGroup()

  //create empty layers group
  d3.json(url_station_info).then(function (infoRes) {

    d3.json(url_station_status).then(function (statusRes) {
      var updatedAt = infoRes.last_updated;
      var stationStatus = statusRes.data.stations;
      var stationInfo = infoRes.data.stations;

      fillStations(stationStatus, stationInfo, updatedAt, "ebikes")

      addAntPaths()
      addLandmarks()
    })
  });
};

// CODE FOR CLASSIC BIKES TOGGLE BUTTON

//Classic bikes toggling
function bikecToggle(bikeType) {

  //destroy previous layers
  map.eachLayer(function (layer) {
    map.removeLayer(layer);
  });
  var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  streetmap.addTo(map)
  var classicbikelayer = new L.LayerGroup()

  //create empty layers group
  d3.json(url_station_info).then(function (infoRes) {

    d3.json(url_station_status).then(function (statusRes) {
      var updatedAt = infoRes.last_updated;
      var stationStatus = statusRes.data.stations;
      var stationInfo = infoRes.data.stations;

      fillStations(stationStatus, stationInfo, updatedAt, "classicbikes")

      addAntPaths()
      addLandmarks()
    });
  })
};

