let knownSpecies;
let criticallyEndangeredSpecies;
let endangeredSpecies;
let threatenedSpecies;
let vulenerableSpecies;
let countries;

(async function () {
    // Loading CSV data
    knownSpecies = await d3.csv("/api/knownSpecies");
    criticallyEndangeredSpecies = await d3.csv("/api/criticallyEndangeredSpecies");
    endangeredSpecies = await d3.csv("/api/endangeredSpecies");
    threatenedSpecies = await d3.csv("/api/threatenedSpecies");
    vulenerableSpecies = await d3.csv("/api/vulenerableSpecies");
    countries = await d3.csv("/api/countries");

    // Converting Arrays to List --------------------------
    const countryList = processDataList(countries);
    const knownSpeciesList = processDataList(knownSpecies);
    const criticallyEndangeredSpeciesList = processDataList(criticallyEndangeredSpecies);
    const endangeredSpeciesList = processDataList(endangeredSpecies);
    const threatenedSpeciesList = processDataList(threatenedSpecies);
    const vulenerableSpeciesList = processDataList(vulenerableSpecies);

    //---------------------------------------------------------

    function processDataList(data) {
        return data.columns.map(function (item) {
            return item.trim().replace(/[\[\]"]+/g, '').replace('{country:', '').replace('}', '');
        });
    }

    async function loadAndProcessData(url) {
        const data = await d3.csv(url);
        return processDataList(data);
    }

    let selectedRiskData = knownSpeciesList; // Initialising Dataset
    console.log("sdr", selectedRiskData);

    console.log("known species", knownSpecies);
    console.log("critically endangered", criticallyEndangeredSpecies);
    console.log("endangered", endangeredSpecies);
    console.log("threatened", threatenedSpecies);
    console.log("vulnerable", vulenerableSpecies);
    console.log("countries", countries);

    const riskList = [
        "Known Species",
        "Critically Endangered Species",
        "Endangered Species",
        "Threatened Species",
        "Vulnerable Species"
    ];

    //Structuring Pie Chart Container (appending dropdowns)

    const dropdownRisk = document.createElement('select');
    dropdownRisk.className = "riskSelect";

    for (let i = 0; i < riskList.length; ++i) {
        const risk = riskList[i];

        const option = document.createElement('option');
        option.value = risk;
        option.text = risk;

        dropdownRisk.appendChild(option);
    }

    const dropdownCountry = document.createElement('select');
    dropdownCountry.className = "countrySelect";

    for (let i = 0; i < countryList.length; i++) {
        const country = countryList[i];

        const option = document.createElement('option');
        option.value = country;
        option.text = country;

        dropdownCountry.appendChild(option);
    }

    const riskIntroduction = document.createElement('span');
    riskIntroduction.textContent = 'Select Dataset: ';
    riskIntroduction.style.marginRight = '10px';

    const countryIntroduction = document.createElement('span');
    countryIntroduction.textContent = 'Select Country: ';
    countryIntroduction.style.marginRight = '10px';

    const riskContainer = document.createElement('div');
    riskContainer.style.marginBottom = '10px'; 
    riskContainer.appendChild(riskIntroduction);
    riskContainer.appendChild(dropdownRisk);

    const countryContainer = document.createElement('div');
    countryContainer.appendChild(countryIntroduction);
    countryContainer.appendChild(dropdownCountry);
    
    const pieChartContainer = document.getElementById("pieChart");
    pieChartContainer.appendChild(riskContainer);
    pieChartContainer.appendChild(countryContainer);

    //---------------------------------------------------------

    // Set initial values for selectedRisk and selectedCountry
    let selectedRisk = dropdownRisk.value;
    let selectedCountry = dropdownCountry.value;

    console.log("selected Risk:", selectedRisk);
    console.log("selected Country:", selectedCountry);

    // Assigning datasets ---------------------------------------
    dropdownRisk.addEventListener('change', function () {
        selectedRisk = this.value;
        console.log("new selected risk:", selectedRisk);

        // Update selectedRiskData here
        if (selectedRisk === "Known Species") {
            selectedRiskData = knownSpeciesList;
        } else if (selectedRisk === "Critically Endangered Species") {
            selectedRiskData = criticallyEndangeredSpeciesList;
        } else if (selectedRisk === "Endangered Species") {
            selectedRiskData = endangeredSpeciesList;
        } else if (selectedRisk === "Threatened Species") {
            selectedRiskData = threatenedSpeciesList;
        } else if (selectedRisk === "Vulnerable Species") {
            selectedRiskData = vulenerableSpeciesList;
        } else {
            console.log("Unknown risk category");
            return;
        }
        console.log("new selectedRiskData", selectedRiskData);

        // Clear and refill selectedData
        updateChartData();
    });

    dropdownCountry.addEventListener('change', function () {
        selectedCountry = this.value;
        console.log("new selected Country:", selectedCountry);

        // Clear and refill selectedData
        updateChartData();
    });

    let labels = ['Mammals', 'Birds', 'Reptiles', 'Amphibians', 'Fish', 'Marine Fish', 'Freshwater Fish', 'Vascular Plants', 'Mosses', 'Invertebrates'];

    function updateChartData() {
        let selectedData = [];
        for (let i = 0; i < selectedRiskData.length; i++) {
            if (selectedRiskData[i] === selectedCountry) {
                selectedData.push(parseInt(selectedRiskData[i + 4].replace(',', '')));
            }
        }

        // Use validCounts for creating the pie chart
        const chartData = [{
            values: selectedData,
            labels: labels,
            type: 'pie'
        }];

        // Layout for the chart
        const layout = {
            height: 400,
            width: 500,
            showLegend: false,
            autosize: true,
            title: {
                text: `${selectedRisk} in ${selectedCountry}`,
                font: { size: 20 },
                y: 0.9
            },
        };

        // Create or update the pie chart using Plotly
        Plotly.newPlot('pieChart', chartData, layout);
    }

    // Call the initial updateChartData
    updateChartData();
})();
