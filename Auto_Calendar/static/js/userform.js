var periodNum = 4;
var daysNum = 8;
var cycledayNames = ["A1", "B1", "A2", "B2", "A3", "B3", "A4", "B4"];

function createTableForm() {

    var form = document.getElementById("userScheduleInput");


    var table = document.createElement("table");
    generateTableForm(table, form);
    

    form.append(table);

}


function generateTableForm(table, form)
{
    let thead = table.createTHead();
    let columnHeadings = thead.insertRow();
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
        rowLabel.appendChild(cycledayName);
        
        for (j = 0; j < periodNum; j++)
        {
            let inputCell = row.insertCell();
            let inputField = document.createElement("input");
            inputField.setAttribute("type", "text");
            inputField.setAttribute("name", "day-" + (i+1) + "-period-" + (j+1));
            inputField.setAttribute("maxlength", 50);
            inputField.setAttribute("class", "");
            inputCell.appendChild(inputField);
        }
    }

}


createTableForm();