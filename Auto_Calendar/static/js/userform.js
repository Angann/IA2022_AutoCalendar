var periodNum = 4;
var daysNum = 8;
var cycledayNames = ["A1", "B1", "A2", "B2", "A3", "B3", "A4", "B4"];

function createTableForm() {

    var form = document.getElementById("userScheduleInput");

    var table = document.createElement("table");
    table.setAttribute("class", "table table-bordered table-responsive");
    generateTableForm(table);

    /*
    var button = document.createElement("button");
    let text = document.createTextNode("Import To Google Calendar");   
    button.appendChild(text); 
    button.setAttribute("type", "submit");
    button.setAttribute("value", "Submit");
    button.setAttribute("class", "btn btn-primary padding");

    form.append(button);
    */
    form.append(table);

}

function generateTableForm(table)
{
    let thead = table.createTHead();
    let columnHeadings = thead.insertRow();
    columnHeadings.setAttribute("class", "table-light");
    let th = document.createElement("th");
    let text = document.createTextNode("Cycle Day");
    th.appendChild(text);
    th.setAttribute("scope", "col");
    columnHeadings.appendChild(th);
    
    for (i = 0; i < periodNum; i++) 
    {
        let th = document.createElement("th");
        let text = document.createTextNode("Period " + (i+1));
        th.appendChild(text);
        th.setAttribute("scope", "col");
        columnHeadings.appendChild(th);
    }

    for (i = 0; i < daysNum; i++) 
    {
        let row = table.insertRow();
        row.setAttribute("scope", "row");
        let rowLabel = row.insertCell();
        let cycledayName = document.createTextNode(cycledayNames[i]);
        rowLabel.setAttribute("class", "table-light");
        rowLabel.appendChild(cycledayName);
        
        for (j = 0; j < periodNum; j++)
        {
            let inputCell = row.insertCell();
            let inputField = document.createElement("input");
            inputField.setAttribute("type", "text");
            inputField.setAttribute("name", "day-" + (i+1) + "-period-" + (j+1));
            inputField.setAttribute("maxlength", 50);
            inputField.setAttribute("class", "border rounded");
            inputCell.appendChild(inputField);
        }
    }



}


createTableForm();