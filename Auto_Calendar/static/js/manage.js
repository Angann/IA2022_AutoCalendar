/*
 * CIS AUTO CALENDAR: MANAGE
 * This file contiains the code used to run the manage page in the CISAutoCalendar Website
 * Author: Adrian Ngan (CIS Class of 2022)
 */

import {Settings} from "./models.js";

//Initializing Firebase (Restricted API Key)
var firebaseConfig = {
    apiKey: "AIzaSyAYLiOsbLz2ARWVkaLSjfP_g9zkRktBEfE",
    authDomain: "cis-auto-calendar-app.firebaseapp.com",
    projectId: "cis-auto-calendar-app",
    storageBucket: "cis-auto-calendar-app.appspot.com",
    messagingSenderId: "268287262662",
    appId: "1:268287262662:web:d728b761de7702df67bcc7",
    measurementId: "G-CPM89G851L"
  };
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

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
            calendarCSV: settings.calendarCSV,
            step0Heading: settings.step0Heading,
            step0Instructions: settings.step0Instructions,
            step1Heading: settings.step1Heading,
            step1Instructions: settings.step1Instructions,
            step1InstructionsLoggedIn: settings.step1InstructionsLoggedIn,
            step2Heading: settings.step2Heading,
            step2Instructions: settings.step2Instructions,
            step3Heading: settings.step3Heading,
            step3Instructions: settings.step3Instructions,
            step4Heading: settings.step4Heading,
            step4Instructions: settings.step4Instructions,
            password: settings.password,
            enableSite: settings.enableSite
            };
    },
    fromFirestore: function(snapshot, options){
        const data = snapshot.data(options);
        return new Settings(data.startDate, data.endDate, data.cycleNum, data.periodNum, data.cycleNames, data.periodTimes, data.calendarCSV, 
            data.step0Heading, data.step0Instructions, data.step1Heading, data.step1Instructions, data.step1InstructionsLoggedIn, data.step2Heading, 
            data.step2Instructions, data.step3Heading, data.step3Instructions, data.step4Heading, data.step4Instructions, data.password, data.enableSite);
    }
};

//Initializing Variables from Settings
var startDate;
var endDate;
var periodNum;
var daysNum ;
var cycleDayNames;
var periodTimes;
var step0Heading;
var step0Instructions;
var step1Heading;
var step1Instructions;
var step1InstructionsLoggedIn;
var step2Heading;
var step2Instructions;
var step3Heading;
var step3Instructions;
var step4Heading;
var step4Instructions;
var password;
var enableSite;

resetSettings(); //gets settings from Firebase

//Assinging Inputs and Buttons to their appropriate listeners
const periodNumIn = document.getElementById("periodNum");
periodNumIn.addEventListener('input', createPeriodTableForm);

const cycleNumIn = document.getElementById("cycleNum");
cycleNumIn.addEventListener('input', createCycleNamesTableForm);

document.getElementById("submitButton").addEventListener('click', submitSettings);
document.getElementById("resetButton").addEventListener('click', resetSettings);
document.getElementById("passwordSubmit").addEventListener('click', checkPswd);


//--------------- FUNCTIONS ---------------
//This function check the input for the password field 
function checkPswd() {
    var confirmPassword = password;
    var input = document.getElementById("pswd").value;
    if (input == confirmPassword) {
        document.getElementById("passwordForm").style.display = "none";
        document.getElementById("settingsForm").style.display = "block";
        console.log("correct password");

    }
    else{
        document.getElementById("wrongPasswordMsg").textContent = "Wrong Password";
        console.log("wrong password");
    }
}

//This function creates a new table for period time inputs and calls generatePeriodTableForm
//This function is called when the admin changes the number of periods, and is used to adapt the table
//to match the number of periods
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

//This function creates all the components required for the period times input table
function generatePeriodTableForm(table, num)
{
    //Creates the 3 columns
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
    

    //Creates each row and input fields with the appropriate ID
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
            inputField.required = true;
            inputCell.appendChild(inputField);
        }
    }
}

//This functions creates a new table for cycle day name inputs and calls generateCycleNamePeriodForm
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

//This function creates all the components required for the period times input table
function generateCycleNameTableForm(table, num)
{
     //Creates the columns
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
    
    //Creates each row and input fields with the appropriate ID
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
        inputField.required = true;
        inputCell.appendChild(inputField);
    }
}

//This function gets the settings from firebase and calls functions to intialize the input tables and fields.
//This function is called when the page is first opened as well as when the undo changes button is clicked
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
        step0Heading = settings.step0Heading;
        step0Instructions = settings.step0Instructions;
        step1Heading = settings.step1Heading;
        step1Instructions = settings.step1Instructions;
        step1InstructionsLoggedIn = settings.step1InstructionsLoggedIn;
        step2Heading = settings.step2Heading;
        step2Instructions = settings.step2Instructions;
        step3Heading = settings.step3Heading;
        step3Instructions = settings.step3Instructions;
        step4Heading = settings.step4Heading;
        step4Instructions = settings.step4Instructions;
        password = settings.password;
        enableSite = settings.enableSite;
        initalizeTables();
        initializeFields();
        } else {
        console.log("Firebase Error: No such document!");
        }}).catch((error) => {
        console.log("Firebase Error: Error getting document:", error);
    });
}

//This function is called when the website is loaded for the first time. It creates the table inputs 
//and fills each input with the value that is currently stored in Firebase
function initalizeTables(){
    //Period Table Section
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

    //Cycle Table Section
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

//This function is called when the website is loaded for the first time. It creates the non-table inputs 
//and fills each input with the value that is currently stored in Firebase
function initializeFields(){
    var startField = document.getElementById("startDate");
    startField.value = startDate;

    var endField = document.getElementById("endDate");
    endField.value = endDate;

    var periodField = document.getElementById("periodNum");
    periodField.value = periodNum;

    var cycleField = document.getElementById("cycleNum");
    cycleField.value = daysNum;

    var step0HeadingField = document.getElementById("step0Heading");
    step0HeadingField.value = step0Heading;

    var step0InstructionsField = document.getElementById("step0Instructions");
    step0InstructionsField.value = step0Instructions;

    var step1HeadingField = document.getElementById("step1Heading");
    step1HeadingField.value = step1Heading;

    var step1InstructionsField = document.getElementById("step1Instructions");
    step1InstructionsField.value = step1Instructions;

    var step1InstructionsLoggedInField = document.getElementById("step1InstructionsLoggedIn");
    step1InstructionsLoggedInField.value = step1InstructionsLoggedIn;

    var step2HeadingField = document.getElementById("step2Heading");
    step2HeadingField.value = step2Heading;

    var step2InstructionsField = document.getElementById("step2Instructions");
    step2InstructionsField.value = step2Instructions;

    var step3HeadingField = document.getElementById("step3Heading");
    step3HeadingField.value = step3Heading;

    var step3InstructionsField = document.getElementById("step3Instructions");
    step3InstructionsField.value = step3Instructions;

    var step4HeadingField = document.getElementById("step4Heading");
    step4HeadingField.value = step4Heading;

    var step4InstructionsField = document.getElementById("step4Instructions");
    step4InstructionsField.value = step4Instructions;

    var newPasswordField = document.getElementById("newPswd");
    newPasswordField.value = password;

    var enableSiteField = document.getElementById("enableSite");
    enableSiteField.checked = enableSite;
}


//This function submits the admin's inputs to Firebase. Is called when the submit button is clicked
function submitSettings(e){
    //Takes values from input fields
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
    
    let step0Heading = document.getElementById("step0Heading").value.trim();
    let step0Instructions = document.getElementById("step0Instructions").value.trim();

    let step1Heading = document.getElementById("step1Heading").value.trim();
    let step1Instructions = document.getElementById("step1Instructions").value.trim();
    let step1InstructionsLoggedIn = document.getElementById("step1InstructionsLoggedIn").value.trim();

    let step2Heading = document.getElementById("step2Heading").value.trim();
    let step2Instructions = document.getElementById("step2Instructions").value.trim();

    let step3Heading = document.getElementById("step3Heading").value.trim();
    let step3Instructions = document.getElementById("step3Instructions").value.trim();

    let step4Heading = document.getElementById("step4Heading").value.trim();
    let step4Instructions = document.getElementById("step4Instructions").value.trim();

    let newPassword = document.getElementById("newPswd").value;
    let enableSite = document.getElementById("enableSite").checked;

    let calendarCSV;
    const csvFile = document.getElementById("formFile");
    let submissionText = document.getElementById("submissionMsg");
    
    //If the admin hasnt imported a CSV file, update the firebase object without deleteing the old CSV data 
    if(csvFile.files[0] == null)
    {
            db.collection("Manage").doc("settings")
            .update({
                "startDate" : startDate, 
                "endDate" : endDate, 
                "cycleNum" : cycleNum, 
                "periodNum" : periodNum, 
                "cycleNames" : cycleNames, 
                "periodTimes" : periodTimes,
                "step0Heading" : step0Heading,
                "step0Instructions" : step0Instructions,
                "step1Heading" : step1Heading,
                "step1Instructions" : step1Instructions,
                "step1InstructionsLoggedIn" : step1InstructionsLoggedIn,
                "step2Heading" : step2Heading,
                "step2Instructions" : step2Instructions,
                "step3Heading" : step3Heading,
                "step3Instructions" : step3Instructions,
                "step4Heading" : step4Heading,
                "step4Instructions" : step4Instructions,
                "password" : newPassword,
                "enableSite" : enableSite
            }).then(result => {
                var today = new Date();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                submissionText.textContent = "Settings submitted at: "+ time;
                submissionText.style.display = "block";
                })
                .catch(error => {
                submissionText.textContent = "There was an error submitting settings";
                submissionText.style.display = "block";
                console.log(error);
            });
           
    }
    //If the admin has imported a CSV file, set the new firebase object and overide the old CSV data
    else{
        e.preventDefault();
        const input = csvFile.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            const text = e.target.result;
            const data = csvToDict(text);
            calendarCSV = data;
            var settings = new Settings(startDate, endDate, cycleNum, periodNum, cycleNames, periodTimes, calendarCSV, step0Heading, step0Instructions, 
                step1Heading, step1Instructions, step1InstructionsLoggedIn, step2Heading, step2Instructions, step3Heading, step3Instructions, step4Heading, 
                step4Instructions, newPassword, enableSite);
            pushToFirebase(settings);
        }; 
        reader.readAsText(input);
    }
}

//This function sets a new setting object in firebase
function pushToFirebase(settings){
    let submissionText = document.getElementById("submissionMsg");
    //Set with Converter
    db.collection("Manage").doc("settings")
    .withConverter(settingConverter)
    .set(settings)
    .then(result => {
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        submissionText.textContent = "Settings submitted at: "+ time;
        submissionText.style.display = "block";
        })
        .catch(error => {
        submissionText.textContent = "There was an error submitting settings";
        submissionText.style.display = "block";
        console.log(error);
    });;

}

//This function converts a CSV into an array
function csvToDict(str, delimiter = ",") {
    // slice from start of text to the first \n index
    // use split to create an array from string by delimiter
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
  
    // slice from \n index + 1 to the end of the text
    // use split to create an array of each csv value row
    const rows = str.slice(str.indexOf("\n") + 1).split("\r\n");

    var calendarCSV = {};
    for(let i = 0; i < rows.length; i++)
    {
        const values = rows[i].split(delimiter);
        calendarCSV[values[1]] = values[0];
    }
    return calendarCSV;
}
     




