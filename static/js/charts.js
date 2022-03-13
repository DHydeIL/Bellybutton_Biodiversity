function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    console.log(samples);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let filteredSample = samples.filter(value => value.id === sample);
    console.log(filteredSample);
    //  5. Create a variable that holds the first sample in the array.

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var meta = data.metadata;
    console.log(meta);
    let metaFilter = meta.filter(x => x.id == sample)[0];
    console.log(metaFilter);
    // 3. Create a variable that holds the washing frequency.
    let washFreq = metaFilter.wfreq;
    console.log(washFreq);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otu_ids = filteredSample.map(x => x.otu_ids);
    let otu_labels = filteredSample.map(x => x.otu_labels);
    let sample_values = filteredSample.map(x => x.sample_values);
    console.log(otu_ids);
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.map(x => x.slice(0, 10).reverse())[0];
    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var barData = {
      x: sample_values.map(x => x.slice(0, 10).reverse())[0],
      y: yticks.map(x => 'OTU ' + x),
      // y: String(yticks).split(","),
      type: 'bar',
      orientation: 'h',
      text: otu_labels.map(x => x.slice(0, 10).reverse())[0]
    };
    console.log(barData);
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100}
    };

    var config = {responsive: true}
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout, config);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids[0],
      y: sample_values[0],
      text: otu_labels[0],
      mode: 'markers',
      marker: {
        size: sample_values[0],
        color: otu_ids[0],
        colorscale: 'Jet'

      }
    }
   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacterial Cultures per Sample",
      xaxis: { title: 'OTU ID',
                titlefont: {
                  family: 'Arial, sans-serif',
                  size: 18,
                  color: 'grey'
                }
              },
      hovermode: 'closest',
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100}
      // height: 600,
      // width: 1200
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, config); 

    // 4. Create the trace for the gauge chart.
     var gaugeData = [{

      value: washFreq,
      title: { text: `<b>Belly Button Washing Frequency</b><br> Scrubs per Week`},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 10] },
        bar: {color: 'black'},
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "green" }
        ]}
     }
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      
      margin: {
      l: 100,
      r: 100,
      t: 100,
      b: 100}
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout, config);
  });
}
