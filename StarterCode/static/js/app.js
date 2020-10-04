// First step is to populate the drop down menu with all the sample names. I set this outside of my event filter since I don't want this 
// refreshed everytime I have an event change and the user needs to select a sample in order for the event handler to register an event. 

d3.json("samples.json").then(function(data) {
  var sample_names = data.names;
  console.log(sample_names); 

// I used the help of this code to popluate the select dropdown menu. https://stackoverflow.com/questions/14473207/how-can-i-give-an-array-as-options-to-select-element    
    
var select_menu = document.getElementById("selDataset");

for(var i = 0, l = sample_names.length; i < l; i++){
  var sample_id = sample_names[i];
  select_menu.add( new Option(sample_id) );
};
    });

d3.selectAll("#selDataset").on("change", update_plotly);

// With the dropdown menu populated and correctly formatted we create our main update function that refreshes plotly when a new value is selected.

function update_plotly (dropdownMenu) {

// To properly index the values in the samples I created a main value "test_sample" and "test_index" that are just the name and index value of the sample id. All three arrays are indexed
// with the same index for the same sample number so I used the test_index as an easy way to get values from the three arrays.
    
d3.json("samples.json").then(function(data) {

var dropdownMenu = d3.select("#selDataset");
var test_sample = dropdownMenu.property("value");
console.log(test_sample);     
    
var sample_names = data.names;
var test_index = sample_names.indexOf(test_sample);
console.log(test_index);
console.log(sample_names[test_index]);

// I saved the sample and metadata portions of the json as their own arrays to be able to easily pull the data.
var sample_set = data.samples;
    console.log(sample_set);

var metadata_set = data.metadata;
    console.log(metadata_set);

// To get the top 10 samples I created a sort function that sorted the sample_set in descending order and then slice the first 10 sample_values.     

var top_10 = sample_set[test_index].sample_values.sort((firstNum, secondNum) => secondNum - firstNum).slice(0, 10);  
console.log(top_10);

    
// Bar chart: The bar chart was very straightforward. With teh top_10 defined I just needed to match them to a y_index. Also, I "reversed them" because they way they were stored
// was smallest to largest so reversing them gives the highest value at the top of the bar hart. We also orient with "h" to get a horizontal orientation.
    
var bar_data = [{
  type: 'bar',
  x: top_10.reverse(),
  y: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  orientation: 'h'
}];

Plotly.newPlot('bar', bar_data);

    
// Panel Display 
// To get the panel display I had to go through a few steps. d3 select can't accept a dictonary, but will take an array.
// To work with this I took my metadata dictionary and then converted it into a properly formatted array with a for loop that pushed the 'key: value'
// pairs into a properly formatted string I needed. I pushed those values to an array.
// Then I was able to use d3 to select my <p> elements. (The only p's in my index.html were the panel body). I could have delimited that selection if needed.
// d3 then inserts the properly formatted metadata info into the final index.html file.
    
    
var id_data = metadata_set[test_index];
    console.log(id_data);

var id_data_formatted =  [];

for (const [key, value] of Object.entries(id_data)) {
     id_data_formatted.push(`${key}: ${value}`);
    };
    
var id_array = Object.entries(id_data);
    console.log(id_data);

d3.select("body")
        .selectAll("p")
        .data(id_data_formatted)
        .text(
    function (d) {
              return d;
        });
    


// The bubble chart values were very straight forward. I justed matched the variables in the array to the marks, names and values. 

var otu_id_mark = sample_set[test_index].otu_ids;
var otu_label_name = sample_set[test_index].otu_labels;
var otu_values = sample_set[test_index].sample_values;
console.log(otu_id_mark, otu_label_name, otu_values);
    


var trace1 = {
  x: otu_id_mark,
  y: otu_values,
  mode: 'markers',
  marker: {
    size: otu_values,
      color: otu_id_mark,
  }
};

var bubble_data = [trace1];

var bubble_layout = {
  title: 'Sample Size',
  showlegend: false,
  height: 800,
  width: 1400
};

Plotly.newPlot('bubble', bubble_data, bubble_layout);
    

    
// gauge chart
// I used the code Jay so helpfully slacked out referenced here: https://com2m.de/blog/technology/gauge-charts-with-plotly/
// Using that template it was relatively easy to modify the elements, change the colors and increments in order to create a final gauge chart.
// To calculate the proper pointer to the correct wash frequency I just made my own calculation. I could get the wfreq from my arrays
// above by simply just referencing the test_index as I did for the pevious steps.
// I added the .chart css style directly into my index file to turn the pie chart into a donut. 
    

    

    
// This just stores the wfreq value as a variable to input into the code
var wash_freq = metadata_set[test_index].wfreq;
    console.log(wash_freq);

// Trig to calc meter point
// since each slice of our 9 gauge levels is 20 degrees we just need to substract 180 - wash_freq*20 to get the proper gauge pointer.
    

// Trig to calc meter point
var degrees = 180 - 20*wash_freq,
     radius = .5;
var radians = degrees * Math.PI / 180;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);
var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
// Path: may have to change to create a better triangle
var mainPath = path1,
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

var gauge_data = [
    { type: 'scatter',
   x: [0], y:[0],
    marker: {size: 14, color:'850000'},
    showlegend: false,
    name: 'WashFreq',
    text: wash_freq.toString(),
    hoverinfo: 'text+name'},
    {
  values: [
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    180
  ],
  rotation: 90,
  text: [
     "8-9",
    "7-8",
    "6-7",
    "5-6",
    "4-5",
    "3-4",
    "2-3",
    "1-2",
    "0-1",
    ""
  ],
  textinfo: "text",
  textposition: "inside",
  marker: {
    colors: [
      "rgba(14, 127, 0, .5)",
      "rgba(110, 154, 22, .5)",
      "rgba(130, 170, 42, .5)",
      "rgba(160, 182, 95, .5)",
      "rgba(180, 190, 130, .5)",
      "rgba(200, 200, 160, .5)",
      "rgba(210, 212, 190, .5)",
      "rgba(232, 226, 235, .5)",
      "rgba(255, 255, 255, 0)"
    ]
  },
  labels: [
    "8-9",
    "7-8",
    "6-7",
    "5-6",
    "4-5",
    "3-4",
    "2-3",
    "1-2",
    "0-1",
    ""
  ],
  hoverinfo: "label",
  hole: .5,
  type: "pie",
  showlegend: false
}];

var gauge_layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  height: 400,
  width: 400,
  xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
};



Plotly.newPlot('gauge', gauge_data, gauge_layout);
    
});

};