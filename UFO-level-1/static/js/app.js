// From data.js
var tableData = data;
var columns = Object.keys(tableData[0]);
console.log(columns);

// Fix the keys for the data in preparation for the table columns
var fixedData = tableData.map(function (d) { return {
    Date : d.datetime,
    City : d.city,
    State : d.state,
    Country : d.country,
    Shape : d.shape,
    Duration : d.durationMinutes,
    Comments : d.comments
};                               
});
 
// Extract the names of the fixed columns
var fixedColumns = Object.keys(fixedData[0]);
console.log(fixedColumns);

// Create a function to generate the table
// The input is the data and columns(keys)
function tableGen(data, columns) {
    var div = d3.select("#table-area")
                  .classed("text-white", true)
    var table = div.append('table')
                  .attr("id", "ufo-table")
                  .classed("table", true)
                  .classed("table-striped table-bordered table-hover mb-0", true)
    var thead = table.append('thead')
                  .classed("thead-dark text-center", true)
    var	tbody = table.append('tbody')
                      .classed("text-white lead", true);

    // Create the row for the headers and join the columns
    thead.append('tr')
        .selectAll('th')
        .data(columns).enter()
        .append('th')
        .classed("table-head", true)
        .text(column => column);
        // .text(column => column.charAt(0).toUpperCase() + column.slice(1));

    var trs = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr');
           
    // Now create the cells in each row for each object, using the inputted columns array
    var cells = trs.selectAll('td')
        .data(function (row) {
          return columns.map(function (column) {
            return {
                column: column,
                value: row[column]
            };
          });
        })
        .enter()
        .append('td')
        .text(d => d.value)
        // .text(function (d) { return d.value; })
        .classed("bg-secondary", true)
        .style("text-align", "center");  
return table;
}
// Render the table
tableGen(fixedData, fixedColumns);

// =================================================================
//                  QUERY THE TABLE
// =================================================================
// Select the button
var button = d3.select("#filter-btn");

// Select the form
var form = d3.select("form");

// Create event handlers for clicking the button or pressing the enter key
button.on("click", runEnter);
form.on("submit",runEnter);

// Create the function to run for both events
function runEnter() {

  // Prevent the page from refreshing
  d3.event.preventDefault();

  // Select the input element and get the raw HTML node
  var inputElement = d3.select("#datetime");

  // Get the value property of the input element
  var inputValue = inputElement.property("value");

  // Print the value to the console
  console.log(`The query date: ${inputValue}`);

  // Fiter the data for display; use arrow function
  var queryData = fixedData.filter(myData => myData.Date === inputValue);
  console.log(`Filtered query data`);
  console.log(queryData);

  // Remove any previous table
  d3.select("table").remove();

  // render the tables
  tableGen(queryData, fixedColumns);
}


