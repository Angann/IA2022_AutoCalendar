import {Settings} from "./models.js";

//Initializing Firebase
var firebaseConfig = {
    apiKey: "AIzaSyBqafLKv1Y-SktNmuvb651BvR48UAXd96A",
    authDomain: "ia2022-autocalendar.firebaseapp.com",
    projectId: "ia2022-autocalendar",
    storageBucket: "ia2022-autocalendar.appspot.com",
    messagingSenderId: "1097932129420",
    appId: "1:1097932129420:web:21fd9c663d25f4efbd67a9",
    measurementId: "G-R853YPF8FT"
  };

firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

//Creating Table Forms
var startDate;
var endDate;
var periodNum;
var daysNum ;
var cycleDayNames;
var periodTimes;
var calendarCSV;
resetSettings(); //HELP
const periodNumIn = document.getElementById("periodNum");

periodNumIn.addEventListener('input', createPeriodTableForm);

const cycleNumIn = document.getElementById("cycleNum");

cycleNumIn.addEventListener('input', createCycleNamesTableForm);

document.getElementById("submitButton").addEventListener('click', submitSettings);
document.getElementById("resetButton").addEventListener('click', resetSettings);



function createPeriodTableForm(num) {

    var div = document.getElementById("periodIn");

    var oldTable = document.getElementById("periodTable");
    if(oldTable !=null){
        oldTable.remove();
    }

    var table = document.createElement("table");
    table.setAttribute("class", "table table-bordered table-responsive");
    table.setAttribute("id", "periodTable");

    generatePeriodTableForm(table, num.target.value);

    div.append(table);
}

function generatePeriodTableForm(table, num)
{
    let thead = table.createTHead();
    let columnHeadings = thead.insertRow();
    columnHeadings.setAttribute("class", "table-light");
    let th = document.createElement("th");
    let text = document.createTextNode("Period");
    th.appendChild(text);
    th.setAttribute("scope", "col");
    columnHeadings.appendChild(th);
    

    let th2 = document.createElement("th");
    let text2 = document.createTextNode("Period Start");
    th2.appendChild(text2);
    th2.setAttribute("scope", "col");
    columnHeadings.appendChild(th2);
    let th3 = document.createElement("th");
    let text3 = document.createTextNode("Period End");
    th3.appendChild(text3);
    th3.setAttribute("scope", "col");
    columnHeadings.appendChild(th3);
    

    for (let i = 1; i <= num; i++) 
    {
        let row = table.insertRow();
        row.setAttribute("scope", "row");
        let rowLabel = row.insertCell();
        let period = document.createTextNode(i);
        rowLabel.setAttribute("class", "table-light");
        rowLabel.appendChild(period);
        
        for (let j = 0; j < 2; j++)
        {
            let inputCell = row.insertCell();
            let inputField = document.createElement("input");
            inputField.setAttribute("type", "time");
            inputField.setAttribute("id", "period-" + (i) + "-" + (j));
            inputField.setAttribute("maxlength", 50);
            inputField.setAttribute("class", "border rounded");
            inputCell.appendChild(inputField);
        }
    }
}

function createCycleNamesTableForm(num) {

    var div = document.getElementById("cycleIn");

    var oldTable = document.getElementById("cycleTable");
    if(oldTable !=null){
        oldTable.remove();
    }

    var table = document.createElement("table");
    table.setAttribute("class", "table table-bordered table-responsive");
    table.setAttribute("id", "cycleTable");

    generateCycleNameTableForm(table, num.target.value);

    div.append(table);

}

function generateCycleNameTableForm(table, num)
{
    let thead = table.createTHead();
    let columnHeadings = thead.insertRow();
    columnHeadings.setAttribute("class", "table-light");
    let th = document.createElement("th");
    let text = document.createTextNode("Cycle Day Number");
    th.appendChild(text);
    th.setAttribute("scope", "col");
    columnHeadings.appendChild(th);
    

    let th2 = document.createElement("th");
    let text2 = document.createTextNode("Cycle Day Name");
    th2.appendChild(text2);
    th2.setAttribute("scope", "col");
    columnHeadings.appendChild(th2);
    

    for (let i = 1; i <= num; i++) 
    {
        let row = table.insertRow();
        row.setAttribute("scope", "row");
        let rowLabel = row.insertCell();
        let cycleName = document.createTextNode(i);
        rowLabel.setAttribute("class", "table-light");
        rowLabel.appendChild(cycleName);
        
        let inputCell = row.insertCell();
        let inputField = document.createElement("input");
        inputField.setAttribute("type", "text");
        inputField.setAttribute("id", "cycleDay-" + i);
        inputField.setAttribute("maxlength", 50);
        inputField.setAttribute("class", "border rounded");
        inputCell.appendChild(inputField);
    }
}

async function resetSettings()
{
    db.collection("Manage").doc("settings")
    .withConverter(settingConverter)
    .get().then((doc) => {
        if (doc.exists){
        var settings = doc.data();
        startDate = settings.startDate;
        endDate = settings.endDate;
        periodNum = settings.periodNum;
        daysNum = settings.cycleNum;
        cycleDayNames = settings.cycleNames;
        periodTimes = settings.periodTimes;
        initalizeTables();
        initializeFields();
        } else {
        console.log("No such document!");
        }}).catch((error) => {
        console.log("Error getting document:", error);
    });
}

function initalizeTables(){
    //Period Table
    var divP = document.getElementById("periodIn");

    var oldTable = document.getElementById("periodTable");
    if(oldTable !=null){
        oldTable.remove();
    }

    var tableP = document.createElement("table");
    tableP.setAttribute("class", "table table-bordered table-responsive");
    tableP.setAttribute("id", "periodTable");

    generatePeriodTableForm(tableP, periodNum);
    divP.append(tableP);
    for (let i = 1; i <= periodNum; i++) 
    {   
        for (let j = 0; j < 2; j++)
        {
            let inputCell = document.getElementById("period-" + (i) + "-" + (j));
            inputCell.value = periodTimes[(i-1)*2 + j];
        }
    }
    //Cycle Table
    var divC = document.getElementById("cycleIn");

    var oldTable = document.getElementById("cycleTable");
    if(oldTable !=null){
        oldTable.remove();
    }

    var tableC = document.createElement("table");
    tableC.setAttribute("class", "table table-bordered table-responsive");
    tableC.setAttribute("id", "cycleTable");

    generateCycleNameTableForm(tableC, daysNum);

    divC.append(tableC);
    for (let i = 1; i <= daysNum; i++) 
    {   
        let inputCell = document.getElementById("cycleDay-" + (i));
        inputCell.value = cycleDayNames[i-1];
    }
}

function initializeFields(){
    var startField = document.getElementById("startDate");
    startField.value = startDate;

    var endField = document.getElementById("endDate");
    endField.value = endDate;

    var periodField = document.getElementById("periodNum");
    periodField.value = periodNum;

    var cycleField = document.getElementById("cycleNum");
    cycleField.value = daysNum;

}

// Firestore data converter
var settingConverter = {
    toFirestore: function(settings) {
        return {
            startDate: settings.startDate,
            endDate: settings.endDate,
            cycleNum: settings.cycleNum,
            periodNum: settings.periodNum,
            cycleNames: settings.cycleNames,
            periodTimes: settings.periodTimes,
            calendarCSV: settings.calendarCSV
            };
    },
    fromFirestore: function(snapshot, options){
        const data = snapshot.data(options);
        return new Settings(data.startDate, data.endDate, data.cycleNum, data.periodNum, data.cycleNames, data.periodTimes, data.calendarCSV);
    }
};

async function submitSettings(e){
    let startDate = document.getElementById("startDate").value;
    let endDate = document.getElementById("endDate").value;
    let periodNum = document.getElementById("periodNum").value;
    let cycleNum = document.getElementById("cycleNum").value;
    var periodTimes = [];
    for (let j = 0; j < periodNum; j++)
    {
        periodTimes.push(document.getElementById("period-" + (j+1)+ "-" + (0)).value);        
        periodTimes.push(document.getElementById("period-" + (j+1)+ "-" + (1)).value);        
    }
    var cycleNames = [];
    for (let j = 0; j < cycleNum; j++)
    {
        cycleNames.push(document.getElementById("cycleDay-" + (j+1)).value);        
    }
    let calendarCSV;
    const csvFile = document.getElementById("formFile");
    e.preventDefault();
    const input = csvFile.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const text = e.target.result;
        const data = csvToArray(text);
        calendarCSV = data;
        var settings = new Settings(startDate, endDate, cycleNum, periodNum, cycleNames, periodTimes, calendarCSV);
        pushToFirebase(settings);
    }; 
    reader.readAsText(input);
}

function pushToFirebase(settings){
    
    //document.getElementById("testing").innerHTML = startDate + " " + endDate + "-" + periodNum + "-" + cycleNum + "-" + periodTimes + "-" + cycleNames;
    // Set withConverter
    db.collection("Manage").doc("settings")
    .withConverter(settingConverter)
    .set(settings);
}

function csvToArray(str, delimiter = ",") {
    // slice from start of text to the first \n index
    // use split to create an array from string by delimiter
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
  
    // slice from \n index + 1 to the end of the text
    // use split to create an array of each csv value row
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");

    var calendarCSV = {};
    for(let i = 0; i < rows.length; i++)
    {
        const values = rows[i].split(delimiter);
        calendarCSV[values[1]] = values[0];
    }
    return calendarCSV;
}
     




