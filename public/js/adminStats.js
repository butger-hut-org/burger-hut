// Assuming you're getting grouped data via AJAX
document.addEventListener('DOMContentLoaded', () => { 
    $.ajax({
        type: "GET",
        url: "/api/products/groupBy?field=category", // Assuming this is your endpoint
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(response) {
            createPieChart(response);
        },
        error: function(error) {
            console.error("Error fetching grouped data:", error);
        }
    });
});

function createPieChart(data) {
    const width = 500;
    const height = 500;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select("#pieChart")
        .append("svg")
        .attr("width", width + 40)  // Add padding
        .attr("height", height + 40)  // Add padding
        .append("g")
        .attr("transform", `translate(${(width + 40) / 2}, ${(height + 40) / 2})`);  // Adjust translation

    const color = d3.scaleOrdinal()
        .domain(data.map(d => d._id))
        .range(d3.schemeSet3);

    const pie = d3.pie()
        .value(d => d.totalProducts);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    const path = svg.selectAll("path")
        .data(pie(data))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data._id))
        .attr("stroke", "#fff")
        .style("stroke-width", "2px")
        .on("mouseover", function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("transform", function(d) {
                    const dist = 10; // Adjust hover distance
                    const angle = (d.startAngle + d.endAngle) / 2;
                    const x = Math.sin(angle) * dist;
                    const y = -Math.cos(angle) * dist;
                    return `translate(${x},${y})`;
                });

            tooltip.transition()
                .duration(200)
                .style("opacity", 1);

            tooltip.html(`${d.data._id}: ${d.data.totalProducts}`)
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("transform", "translate(0,0)");

            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Create legend
    const legend = d3.select("#pieChart")
        .append("svg")
        .attr("width", 120)  // Adjust the width of the legend
        .attr("height", height)
        .style("margin-left", "20px") // Add some space between the chart and legend
        .append("g")
        .attr("transform", "translate(10, 10)");  // Adjust the position of the legend

    legend.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("width", 20) // Width of the colored square
        .attr("height", 20) // Height of the colored square
        .attr("fill", d => color(d._id)) // Color from the scale
        .attr("y", (d, i) => i * 25) // Vertical position for each square
        .attr("rx", 3); // Round the corners for a checkbox effect

    legend.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", 30) // Horizontal position to the right of the square
        .attr("y", (d, i) => i * 25 + 15) // Vertical position to align with the squares
        .text(d => d._id) // Set the category text
        .style("font-size", "16px") // Increase font size
        .style("font-weight", "bold") // Make the font bold
        .attr("fill", "#000"); // Set text color for better visibility

    // Tooltip element
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
}







