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

// =================================================================
//       Set up the HTML dropdown QUERY SECTION dynamically
// =================================================================
function optionsHTML(theChoice, index) {
      console.log(theChoice);
      let div = d3.select("form").append("div");
      let theLabel = div.append("label")
                        .attr("for", "select"+theChoice)
                        .text(`Select ${theChoice}`);
      let select = div.append("select")
                      .attr("id", "select"+theChoice)
                      .attr("name", theChoice);
      select.selectAll("option")
            .data(uniqueItemsArray[index])
            .enter()
            .append("option")
            .attr("value", d => d)
            .text(d => d);
      let defaultEmpty = select.append("option")
                              .attr("value", "")
                              .text("")
                              .attr("selected", "selected");
};

// Get the unique values in each column: SORTED
let uniqueDate = Array.from(new Set(fixedData.map(d => d.Date)));
console.log(`uniqueDate`);
console.log(uniqueDate);

let uniqueCity = Array.from(new Set(fixedData.map(d => d.City)))
                        .sort((a, b) =>  a.localeCompare(b));
console.log(`uniqueCity`);
console.log(uniqueCity);

let uniqueState = Array.from(new Set(fixedData.map(d => d.State)))
                        .sort((a, b) =>  a.localeCompare(b));
console.log(`uniqueState`);
console.log(uniqueState);

let uniqueCountry = Array.from(new Set(fixedData.map(d => d.Country)))
                        .sort((a, b) =>  a.localeCompare(b));
console.log(`uniqueCountry`);
console.log(uniqueCountry);

let uniqueShape = Array.from(new Set(fixedData.map(d => d.Shape)))
                        .sort((a, b) =>  a.localeCompare(b));
console.log(`uniqueShape`);
console.log(uniqueShape);

// Create the list of choices
const queryList = ["Date", "City", "State", "Country", "Shape"];
const uniqueItemsArray = [uniqueDate, uniqueCity, uniqueState, uniqueCountry, uniqueShape]

queryList.forEach((queryItem, index) => optionsHTML(queryItem, index));

// ================================================================
//             Create the initial table of data
// ================================================================
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
};
// Render the table
tableGen(fixedData, fixedColumns);

// Select the button
var button = d3.select("#filter-btn");

// Select the form
// var form = d3.select("form");

// Create event handlers for clicking the button or pressing the enter key
button.on("click", runEnter);
// form.on("submit",runEnter);

// Create the function to run for both events
function runEnter() {
        // Prevent the page from refreshing
        d3.event.preventDefault();

        // Select the input elements and get the raw HTML node
        let inputDate = d3.select("#selectDate");
        let inputCity = d3.select("#selectCity");
        let inputState = d3.select("#selectState");
        let inputCountry = d3.select("#selectCountry");
        let inputShape = d3.select("#selectShape");

        // Get the value property of the input elements
        let inputValueDate = inputDate.property("value");
        let inputValueCity = inputCity.property("value");
        let inputValueState = inputState.property("value");
        let inputValueCountry = inputCountry.property("value");
        let inputValueShape = inputShape.property("value");

        // Print the selected input values to the console
        console.log(`The query Date: ${inputValueDate}`);
        console.log(`The query City: ${inputValueCity}`);
        console.log(`The query State: ${inputValueState}`);
        console.log(`The query Country: ${inputValueCountry}`);
        console.log(`The query Shape: ${inputValueShape}`);

        let selectedQueryObject = {
                    Date : inputValueDate,
                    City : inputValueCity,
                    State : inputValueState,
                    Country : inputValueCountry,
                    Shape : inputValueShape
        };
        console.log(`selectedQueryObject: ${selectedQueryObject}`);
        // console.log(`selectedQueryKeys: ${Object.keys(selectedQueryObject)}`);
        // console.log(`selectedQueryValues: ${Object.values(selectedQueryObject)}`);

        let filteredData = fixedData;
        let queryData;
        let theKeys;
        console.log(`filteredData`);
        console.log(filteredData);

        // Using a for/in loop: loops through the properties of an Object
        for (theKeys in selectedQueryObject) {
          if (selectedQueryObject[theKeys] != "") {

            console.log(`Inside for-in loop ${theKeys} : ${selectedQueryObject[theKeys]}`);

            queryData = filteredData.filter(myData => myData[theKeys] === selectedQueryObject[theKeys]);

            console.log(`Filtered query data`);
            console.log(queryData);

            filteredData = queryData;
          };
        };

        // Remove any previous table
        d3.select("table").remove();

        // render the tables
        tableGen(queryData, fixedColumns);
};

