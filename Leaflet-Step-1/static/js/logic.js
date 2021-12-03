const allWeekURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

const RADIUS_X = 4;

d3.json(allWeekURL, function (data) {
  function setColor(d) {
    return d > 90
      ? "#b31b1b"
      : d > 70
      ? "#ff4040"
      : d > 50
      ? "#ed9121"
      : d > 30
      ? "#f8de7e"
      : d > 10
      ? "#ccff00"
      : "#00ff00";
  }

  L.geoJSON(data.features, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag * RADIUS_X,
        fillColor: setColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      });
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`<h3>Magnitude: ${feature.properties.mag}<br>
      Depth: ${feature.geometry.coordinates[2]} <br>${
        feature.properties.place
      }</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    },
  }).addTo(myMap);

  let legend = L.control({
    position: "bottomright",
  });

  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    let levels = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"];
    let colors = [
      "#00ff00",
      "#ccff00",
      "#f8de7e",
      "#ed9121",
      "#ff4040",
      "#b31b1b",
    ];

    for (let i = 0; i < levels.length; i++) {
      div.innerHTML += '<i style="background:' + colors[i] + '"></i>' + levels[i] + "<br>";
    }
    
    return div;
  };
  
  legend.addTo(myMap);
});

let greyscale = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY,
  }
);

let satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY,
  }
);

let outdoors = L.tileLayer( "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY,
  }
);

const BASE_MAPS = {
  "Satellite ": satellite,
  "Grayscale ": greyscale,
  "Outdoors ": outdoors,
};

var myMap = L.map("map", {
  center: [40.73, -74.0059],
  zoom: 5,
  layers: [greyscale],
});

L.control
  .layers(BASE_MAPS, {
    collapsed: false,
  })
  .addTo(myMap);
