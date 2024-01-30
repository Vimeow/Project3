// Fetch data from the initial endpoint
d3.json("/api/knownSpecies").then((data) => {
    // Call the function to create the bubble chart
    createBubbleChart(data);
});

// Function to update the bubble chart based on the selected endpoint and top X filter
function updateBubbleChart() {
    const selectedEndpoint = document.getElementById("endpointSelect").value;
    const topX = parseInt(document.getElementById("topXInput").value);

    // Fetch data from the selected endpoint
    d3.json(selectedEndpoint).then((data) => {
        // Sort the data based on the value in descending order and get the top X countries
        const filteredData = data
            .sort((a, b) => b.value - a.value)
            .slice(0, topX);

        // Clear existing chart
        d3.select("#bubble-chart").selectAll("*").remove();

        // Call the function to create the updated bubble chart
        createBubbleChart(filteredData);
    });
}

// Function to create the bubble chart
function createBubbleChart(data) {
    const diameter = 500;

    const svg = d3.select("#bubble-chart")
        .append("svg")
        .attr("width", diameter)
        .attr("height", diameter);

    // Bubble pack layout
    const bubble = d3.pack()
        .size([diameter, diameter])
        .padding(5);

    // Convert the data to hierarchical format
    const root = d3.hierarchy({ children: data })
        .sum(d => d.value);

    // Apply the bubble layout to the hierarchical data
    bubble(root);

    // Create a group for each bubble
    const node = svg.selectAll(".node")
        .data(root.children)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    // Draw the circles (bubbles)
    node.append("circle")
        .attr("r", d => d.r)
        .style("fill", "steelblue")
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);

    // Add text labels inside the bubbles
    const text = node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .style("font-size", "10px")
        .text(d => d.data.country);

    // Function to handle mouseover event
    function handleMouseOver(d, i) {
        d3.select(this).attr("fill", "red"); // Change bubble color on hover

        // Increase font size on hover
        text.style("font-size", "12px");

        // Show tooltip with country name
        const tooltip = svg.append("g")
            .attr("class", "tooltip")
            .style("opacity", 0);

        tooltip.append("rect")
            .attr("width", 120)
            .attr("height", 40)
            .attr("fill", "white")
            .style("opacity", 0.8);

        tooltip.append("text")
            .attr("x", 60)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text(d.data.country);
    }

    // Function to handle mouseout event
    function handleMouseOut(d, i) {
        d3.select(this).attr("fill", "steelblue"); // Change back to original color on mouseout

        // Reset font size on mouseout
        text.style("font-size", "10px");

        // Hide tooltip
        d3.select(".tooltip").remove();
    }
}