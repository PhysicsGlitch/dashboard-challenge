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

function update_plotly (dropdownMenu) {

   
    
d3.json("samples.json").then(function(data) {

var dropdownMenu = d3.select("#selDataset");
var test_sample = dropdownMenu.property("value");
console.log(test_sample);     
    
var sample_names = data.names;
var test_index = sample_names.indexOf(test_sample);
console.log(test_index);
console.log(sample_names[test_index]);

    // save the sample and metadata portions of the json as their own arrays
var sample_set = data.samples;
    console.log(sample_set);

var metadata_set = data.metadata;
    console.log(metadata_set);
    

// The next task is connect the selected drop down value to use it as reference in the rest of the code to get the appropriate data.
// A thing to notice in the data set is that they are all indexed in the same way by id. So simply getting the index value can be a useful way to 
// get the needed data.
    


// function to sort by top 10 sample_values     

var top_10 = sample_set[test_index].sample_values.sort((firstNum, secondNum) => secondNum - firstNum).slice(0, 10);  
console.log(top_10);

    
// Bar chart 
    
var bar_data = [{
  type: 'bar',
  x: top_10.reverse(),
  y: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  orientation: 'h'
}];

Plotly.newPlot('bar', bar_data);


// Figure out how to sort metadata_set by index. 
    
// Panel Display 
    
var id_data = metadata_set[test_index];
    console.log(id_data);

var panel_body = document.getElementById("sample-metadata");
panel_body.innertHTML = "";
panel_body.innerHTML += "ID: " + metadata_set[test_index].id + "\n";
panel_body.innerHTML += "Ethnicity: " + metadata_set[test_index].ethnicity + "\n";
panel_body.innerHTML += "Gender: " + metadata_set[test_index].gender + "\n";
panel_body.innerHTML += "Age: " + metadata_set[test_index].age + "\n";
panel_body.innerHTML += "Location: " + metadata_set[test_index].location + "\n";
panel_body.innerHTML += "bbtype: " + metadata_set[test_index].bbtype + "\n";
panel_body.innerHTML += "wfreq: " + metadata_set[test_index].wfreq;

// bubble chart values

var otu_id_mark = sample_set[test_index].otu_ids;
var otu_label_name = sample_set[test_index].otu_labels;
var otu_values = sample_set[test_index].sample_values;
console.log(otu_id_mark, otu_label_name, otu_values);
    


var trace1 = {
  x: otu_id_mark,
  y: otu_values,
  mode: 'markers',
  marker: {
    size: otu_values
  }
};

var bubble_data = [trace1];

var bubble_layout = {
  title: 'Marker Size',
  showlegend: false,
  height: 600,
  width: 600
};

Plotly.newPlot('bubble', bubble_data, bubble_layout);
    

    
    
// gauge chart
// I used the code Jay so helpfully slacked out referenced here: https://com2m.de/blog/technology/gauge-charts-with-plotly/
// Using that template it was relatively easy to modify the elements, change the colors and increments in order to create a final gauge chart.
// To calculate the proper pointer to the correct wash frequency I just made my own calculation. I could get the wfreq from my arrays
// above by simply just referencing the test_index as I did for the pevious steps.
    

    
//Plotly.newPlot('gauge', gauge_data);

    
// Enter a speed between 0 and 180
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

var gauge_data = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 14, color:'850000'},
    showlegend: false,
    name: 'speed',
    text: wash_freq,
    hoverinfo: 'text+name'},
  { values: [0,1,2,3,4,5,6,7,8,9,10,4],
  rotation: 90,
  text: ["9-10",
    "8-9",
    "7-8",
    "6-7",
    "5-6",
    "4-5",
    "3-4",
    "2-3",
    "0-1",
    ''],
  textinfo: 'text',
  textposition:'inside',
  marker: {colors:[
      "rgba(14, 127, 0, .5)",
      "rgba(110, 154, 22, .5)",
      "rgba(170, 202, 42, .5)",
      "rgba(170, 202, 42, .5)",
      "rgba(170, 202, 42, .5)",
      "rgba(202, 209, 95, .5)",
      "rgba(210, 206, 145, .5)",
      "rgba(232, 226, 202, .5)",
      "rgba(255, 255, 255, 0)"
    ]},
  hoverinfo: 'label',
  hole: .5,
  type: 'pie',
  showlegend: false
}];

var layout = {
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



Plotly.newPlot('gauge', gauge_data);
    
});

};