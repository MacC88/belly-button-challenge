// Fetch the JSON data
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    console.log(data);

    // Populate the dropdown
    let dropdown = d3.select("#selDataset");
    data.names.forEach((name) => {
        dropdown.append("option").text(name).property("value", name);
    });

    // Initial plot and metadata
    let initialSample = data.names[0];
    updateDashboard(initialSample);

    // Event listener for the dropdown menu
    dropdown.on("change", function() {
        let newSample = d3.select(this).property("value");
        updateDashboard(newSample);
    });

    function updateDashboard(sampleId) {
        // Find the data for the selected sample
        let sampleData = data.samples.find(sample => sample.id == sampleId);
        let sampleMetadata = data.metadata.find(sample => sample.id == sampleId);

        // Update metadata display
        let metadataDisplay = d3.select("#sample-metadata");
        metadataDisplay.html("");
        Object.entries(sampleMetadata).forEach(([key, value]) => {
            metadataDisplay.append("p").text(`${key}: ${value}`);
        });

        // Update plots
        // Bar chart setup
        let barData = [{
            x: sampleData.sample_values.slice(0, 10).reverse(),
            y: sampleData.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            text: sampleData.otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        }];
        let barLayout = {
            title: "Top 10 OTUs",
            margin: { t: 30, l: 150 }
        };
        Plotly.newPlot("bar", barData, barLayout);

        // Bubble chart setup
        let bubbleData = [{
            x: sampleData.otu_ids,
            y: sampleData.sample_values,
            text: sampleData.otu_labels,
            mode: 'markers',
            marker: {
                size: sampleData.sample_values,
                color: sampleData.otu_ids,
                colorscale: 'Earth'
            }
        }];
        let bubbleLayout = {
            title: 'Bacteria Cultures Per Sample',
            showlegend: false,
            height: 600,
            width: 1200
        };
        Plotly.newPlot('bubble', bubbleData, bubbleLayout);

        // Gauge chart setup
        let gaugeValue = sampleMetadata.wfreq;
        let gaugeData = [{
            type: "indicator",
            mode: "gauge+number",
            value: gaugeValue,
            title: { text: '<b>Belly Button Washing Frequency</b><br>Scrubs Per Week' },
            gauge: {
                axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkgreen" },
                bar: { color: "red" }, // Red arrow
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "gray",
                steps: [
                    { range: [0, 1], color: 'rgba(0, 255, 0, 0.1)' },
                    { range: [1, 2], color: 'rgba(0, 255, 0, 0.2)' },
                    { range: [2, 3], color: 'rgba(0, 255, 0, 0.3)' },
                    { range: [3, 4], color: 'rgba(0, 255, 0, 0.4)' },
                    { range: [4, 5], color: 'rgba(0, 255, 0, 0.5)' },
                    { range: [5, 6], color: 'rgba(0, 255, 0, 0.6)' },
                    { range: [6, 7], color: 'rgba(0, 255, 0, 0.7)' },
                    { range: [7, 8], color: 'rgba(0, 255, 0, 0.8)' },
                    { range: [8, 9], color: 'rgba(0, 255, 0, 0.9)' }
                ],
            }
        }];
        let gaugeLayout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', gaugeData, gaugeLayout);
    }
});
