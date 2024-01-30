// Base layers //----------

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 19,
attribution: '© OpenStreetMap'
});

var openTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
maxZoom: 19,
attribution: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)'
});


// Overlay layer (countryGeoJson) //----------
countryGeoJson = new L.layerGroup();


// Function to create countryGeoJson layer
function geoLayer(dataset, species){
// Load two JSON files concurrently using Promise.all
    Promise.all([
        d3.json("https://raw.githubusercontent.com/AlexFeeney/Project3_Group4/main/data/filtered_countries.geojson.json"),
        d3.json(dataset) // "/api/endangeredSpecies" is replaced by dataset variable
    ]).then(function([data1, data2]) {

        // // Now I can work with both data1 and data2
        // console.log("Data from file1:", data1);
        // console.log("Data from file2:", data2);
        // console.log("value of the First data point from file2:", data2[0].value);

        // Filter data2 to include only selected species
        var key = "species";
        var value = species;

        // Filter the data based on the specified keys and values
        var filteredData2 = data2.filter(function(item) {
            return item[key] === value;
        });
        
        // Now filteredData contains only the elements that meet the criteria
        console.log("filtered data2: ", filteredData2);
        console.log("filtered data2, country: ", filteredData2[0].country);

        // Adding interaction (ref = https://leafletjs.com/examples/choropleth/)
        var geojsonObject;

        //
        function highlightFeature(e) {
            var layer = e.target;
        
            layer.setStyle({
                weight: 2,
                color: 'yellow',
                dashArray: '',
                fillOpacity: 0.7
            });
            layer.bringToFront();

        }
        //
        function resetHighlight(e) {
            geojsonObject.resetStyle(e.target);
        }
        //
        function zoomToFeature(e) {
            map.fitBounds(e.target.getBounds());
        }
        //
        function onEachFeature(feature, layer) {
            //
            var countryName = feature.properties.ADMIN;
            var countryData = filteredData2.find(c => c.country === countryName);
            var value = countryData ? countryData.value : "N/A";

            layer.bindPopup("<b>Country:</b> " + countryName + "<br><b>Count:</b> " + value);
            //

            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: function (e) {
                    this.openPopup();
                }
            });
        }

        // Create a GeoJSON object
        var geojsonObject = L.geoJson(data1, {
            style: function (feature) {
            // Find the corresponding value in the JSON data
            var countryName = feature.properties.ADMIN;
            var countryData = filteredData2.find(c => c.country === countryName);
        
            // Default color if no matching data found
            var defaultColor = 'gray';
        
            // Assign colors based on values
            if (countryData) {
                var value = countryData.value;
        
                // Example: Assign colors based on value ranges
                if (value < 10) {
                return { fillColor: '#00ff00', color: 'blue', fillOpacity: 0.6, weight: 1 };
                } else if (value < 50) {
                return { fillColor: '#1fe000', color: 'blue', fillOpacity: 0.6, weight: 1 };
                } else if (value < 100) {
                return { fillColor: '#3dc200', color: 'blue', fillOpacity: 0.6, weight: 1 };
                } else if (value < 150) {
                return { fillColor: '#5ca300', color: 'blue', fillOpacity: 0.6, weight: 1 };
                } else if (value < 200) {
                return { fillColor: '#7a8500', color: 'blue', fillOpacity: 0.6, weight: 1 };
                } else if (value < 250) {
                return { fillColor: '#996600', color: 'blue', fillOpacity: 0.6, weight: 1 };
                } else if (value < 300) {
                return { fillColor: '#b84700', color: 'blue', fillOpacity: 0.6, weight: 1 };
                } else if (value < 350) {
                return { fillColor: '#cc3300', color: 'blue', fillOpacity: 0.6, weight: 1 };
                } else {
                return { fillColor: '#bd2b08', color: 'blue', fillOpacity: 0.6, weight: 1 };
                }
            } else {
                return { fillColor: defaultColor, color: 'blue', fillOpacity: 0.6, weight: 1 };
            }
            },
            onEachFeature: onEachFeature
        });

        // Add geoJsonObject to countryGeoJson layer
        geojsonObject.addTo(countryGeoJson);

    }).catch(function(error) {
        console.error("Error loading JSON files:", error);
    });
}


// Initilize the web page and adding a list of option to the dropdown menu //----------
function init() {

    // Select the dropdownMenu location from html
    let SpeciesDropdownMenu = d3.select("#Species"); //# for id
    let DatasetDropdownMenu = d3.select("#dataset"); //# for id
  
    // Create species list
    speciesList = ['Mammals', 'Birds', 'Reptiles', 'Amphibians', 'Fish', 'Marine Fish', 'Freshwater Fish', 'Vascular plants', 'Mosses', 'Lichens', 'Invertebrates'];
    console.log(speciesList);

    // Create dataset list
    datasetList = ["/api/criticallyEndangeredSpecies", "/api/endangeredSpecies", "/api/threatenedSpecies", "/api/vulenerableSpecies"];
    console.log(datasetList);

    // Add the species list into the dropdownMenu
    // iterate through the List then append each species as an "option" to the dropdownMenu
    speciesList.forEach((sp) => {
        SpeciesDropdownMenu.append("option").text(sp).property("value", sp);
    });

    // Add the dataset list into the dropdownMenu
    // iterate through the List then append each dataset as an "option" to the dropdownMenu
    datasetList.forEach((d) => {
        DatasetDropdownMenu.append("option").text(d).property("value", d);
    });

    // Add event listeners for both dropdowns
    SpeciesDropdownMenu.on("change", function () {
        var selectedSpecies = d3.select(this).property("value");
        var selectedDataset = DatasetDropdownMenu.property("value"); // get the current value of the dataset dropdown
        optionChanged(selectedDataset, selectedSpecies);
    });

    DatasetDropdownMenu.on("change", function () {
        var selectedDataset = d3.select(this).property("value");
        var selectedSpecies = SpeciesDropdownMenu.property("value"); // get the current value of the species dropdown
        optionChanged(selectedDataset, selectedSpecies);
    });

    // Assign the first species to the species variable:
    let sp = speciesList[0];
    console.log("First species: ", sp);

    // Assign the first dataset to the dataset variable:
    let dt = datasetList[0];
    console.log("First dataset: ", dt);

    // Call the function to create a map layer for the chosen species
    geoLayer(dt, sp);
}

// Call the initialize function

init();


// Update the leaflet map when dataset and species are selected.

function optionChanged(selectedDataset, selectedSpecies) {
    geoLayer(selectedDataset, selectedSpecies);
};


// Add the default layers to the map //----------

var map = L.map('map', {
center: [40, 10],
zoom: 2,
layers: [osm, countryGeoJson]
});

// Create an object contain base layers //----------

var baseMaps = {
"OpenStreetMap": osm,
"opentopomap": openTopoMap
};

// Create an object contain overlay layer //----------
var overlayMaps = {
"Target countries": countryGeoJson
};

// Create a layer control and add it to the map //----------
var layerControl = L.control.layers(baseMaps, overlayMaps, {collapsed: true}).addTo(map);

// Create a legend //----------

// Define the gradient colors
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    var grades = [10, 50, 100, 150, 200, 250, 300, 350, 400]; // Adjust as needed
    var colors = ['#00ff00', '#1fe000', '#3dc200', '#5ca300', '#7a8500', '#996600', '#b84700', '#cc3300', '#bd2b08'];

    // Loop through the legend intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            (i === 0 ? 'Low' : (i === grades.length - 1 ? 'High' : '')) + '<br>';
    }

    return div;
};

legend.addTo(map);

