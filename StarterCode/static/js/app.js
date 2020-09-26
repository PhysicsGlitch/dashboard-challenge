// function updatePlotly() {
  

d3.json("samples.json").then(function(data) {
console.log(data);

    // save the sample and metadata portions of the json as their own arrays
var sample_set = data.samples;
    console.log(sample_set);

var metadata_set = data.metadata;
    console.log(metadata_set);

var name_id = data.names;
    console.log(name_id);

    
// I used the help of this code to popluate the select dropdown menu. https://stackoverflow.com/questions/14473207/how-can-i-give-an-array-as-options-to-select-element
    
var select_menu = document.getElementById("selDataset");

for(var i = 0, l = name_id.length; i < l; i++){
  var sample_id = name_id[i];
  select_menu.add( new Option(sample_id) );
};

// The next task is connect the selected drop down value to use it as reference in the rest of the code to get the appropriate data.
// A thing to notice in the data set is that they are all indexed in the same way by id. So simply getting the index value can be a useful way to 
// get the needed data.
    
var dropdownMenu = d3.select("selDataset");
var test_sample = dropdownMenu.property("value");
console.log(test_sample);

// function to sort by top 10 sample_values     
    
function sort_10(id) {
  var top_10 = id.sample_values.sort((firstNum, secondNum) => secondNum - firstNum).slice(0, 10);
    return top_10;
    console.log(top_10)};

    
// Bar chart 
    
var bar_data = [{
  type: 'bar',
  x: sort_10(test_sample).reverse(),
  y: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  orientation: 'h'
}];

Plotly.newPlot('bar', bar_data);

var test = sort_10(test_sample);
console.log(test);

// Figure out how to sort metadata_set by index. 
    
// Panel Display 
    
var id_data = metadata_set[0];
    console.log(id_data);

var panel_body = document.getElementById("sample-metadata");
panel_body.innerHTML += "ID: " + metadata_set[0].id + "\n";
panel_body.innerHTML += "Ethnicity: " + metadata_set[0].ethnicity + "\n";
panel_body.innerHTML += "Gender: " + metadata_set[0].gender + "\n";
panel_body.innerHTML += "Age: " + metadata_set[0].age + "\n";
panel_body.innerHTML += "Location: " + metadata_set[0].location + "\n";
panel_body.innerHTML += "bbtype: " + metadata_set[0].bbtype + "\n";
panel_body.innerHTML += "wfreq: " + metadata_set[0].wfreq;

// bubble chart values

var otu_id_mark = sample_set[0].otu_ids;
var otu_label_name = sample_set[0].otu_labels;
var otu_values = sample_set[0].sample_values;
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

var layout = {
  title: 'Marker Size',
  showlegend: false,
  height: 600,
  width: 600
};

Plotly.newPlot('bubble', bubble_data, layout);

});