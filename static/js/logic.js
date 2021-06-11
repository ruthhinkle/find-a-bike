// CUSTOMIZE YOUR LOCATION

// EDIT VARIABLES: For your city, find the JSON formatted urls of "station_information" and "station_status". 
// The placeholder urls are for Chicago's bikeshare program, Divvy.
// var url_station_info = "https://gbfs.divvybikes.com/gbfs/en/station_information.json"
// var url_station_status = "https://gbfs.divvybikes.com/gbfs/en/station_status.json"

// PORTLAND INFO
// var url_station_info = "https://gbfs.biketownpdx.com/gbfs/en/station_information.json"
// var url_station_status = "https://gbfs.biketownpdx.com/gbfs/en/station_status.json"
// CENTER: [45.5, -122.67]

// Blue Bikes Boston
// var url_station_info = "https://gbfs.bluebikes.com/gbfs/en/station_information.json"
// var url_station_status = "https://gbfs.bluebikes.com/gbfs/en/station_status.json"

// DC Capital Bikeshare
// var url_station_info = "https://gbfs.capitalbikeshare.com/gbfs/en/station_information.json"
// var url_station_status ="https://gbfs.capitalbikeshare.com/gbfs/en/station_status.json"

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
};

// Create the map with our layers.
// NOTE: The "center" of this map is Chicago. Edit for your city.
var map = L.map("map-id", {
  center: [40.18, -100.59],
  zoom: 4,
  layers: [
    layers.EMPTY,
    layers.LOW,
    layers.NORMAL,
  ]
});

// Add our "streetmap" tile layer to the map.
streetmap.addTo(map);

// Create an overlays object to add to the layer control.
var overlays = {
  // "Empty Stations": layers.EMPTY,
  // "Low Stations": layers.LOW,
  // "Full Stations": layers.NORMAL,
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
    });
  })
};

