const EARTHQUAKES_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

const PLATES_URL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

let satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
  {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY,
  }
);

let grayscaleMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
  {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY,
  }
);

let outdoorsMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
  {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY,
  }
);

let earthquakes = new L.LayerGroup();
let tectonicPlates = new L.LayerGroup();

const BASE_MAPS = {
  Satellite: satelliteMap,
  Grayscale: grayscaleMap,
  Outdoors: outdoorsMap,
};

const OVERLAY_MAPS = {
  Earthquakes: earthquakes,
  "Fault Lines": tectonicPlates,
};

var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 2,
  layers: [satelliteMap, earthquakes],
});

L.control.layers(BASE_MAPS, OVERLAY_MAPS).addTo(myMap);

d3.json(EARTHQUAKES_URL, function (earthquakeData) {
  function markerSize(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 3;
  }

  function setColor(magnitude) {
    let color;
    switch (true) {
      case magnitude > 5:
        color = "#581845";
        break;
      case magnitude > 4:
        color = "#900C3F";
        break;
      case magnitude > 3:
        color = "#C70039";
        break;
      case magnitude > 2:
        color = "#FF5733";
        break;
      case magnitude > 1:
        color = "#FFC300";
        break;
      default:
        color = "#DAF7A6";
        break;
    }
    return color;
  }

  L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: function (feature) {
      return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: setColor(feature.properties.mag),
        color: "#000000",
        radius: markerSize(feature.properties.mag),
        stroke: true,
        weight: 0.5,
      };
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<h4>Location: " + feature.properties.place + "</h4><hr><p>Date & Time: " + new Date(feature.properties.time) + "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
    },
  }).addTo(earthquakes);

  earthquakes.addTo(myMap);

  d3.json(PLATES_URL, function (plateData) {
    L.geoJson(plateData, {
      color: "#DC143C",
      weight: 2,
    }).addTo(tectonicPlates);
    tectonicPlates.addTo(myMap);
  });

  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend"),
      magnitudeLevels = [0, 1, 2, 3, 4, 5];

    div.innerHTML += "<h3>Magnitude</h3>";

    for (let i = 0; i < magnitudeLevels.length; i++) {
      div.innerHTML += '<i style="background: ' + setColor(magnitudeLevels[i] + 1) + '"></i> ' + magnitudeLevels[i] + (magnitudeLevels[i + 1] ? "&ndash;" + magnitudeLevels[i + 1] + "<br>" : "+");
    }
    return div;
  };
  legend.addTo(myMap);
});
