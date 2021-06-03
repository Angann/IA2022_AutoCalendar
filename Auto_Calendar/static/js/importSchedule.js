//----------------------USER INPUT AND SCHEUDLE OBJECT CREATOR SECTION---------------------------

// Client ID and API key from the Developer Console
var CLIENT_ID = '1097932129420-mkla5e9ibr6qgok18dvn3ac3f2a4f9in.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBqafLKv1Y-SktNmuvb651BvR48UAXd96A';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.events";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
var step1Div = document.getElementById("loginDiv");
var step2Div = document.getElementById("inputDiv");

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

var startDate;
var endDate;
var periodNum;
var daysNum ;
var cycledayNames;
var periodTimes;
var calendarCSV;
var userInputs = [];
var userSchedule;
var fakeUserinputs = [
    ["Econ", "Econ", "CS", "Chem"],
    ["2Econ", "2Econ", "2CS", " "],
    ["3Econ", "3Econ", "3CS", "3Chem"],
    ["E4con", "4Econ", "4CS", "4Chem"],
    ["5Econ", "5Econ", "5CS", "5Chem"],
    ["6Econ", "6Econ", "6CS", "C6hem"],
    ["7Econ", "7Econ", "7CS", "7Chem"],
    ["8Econ", "8Econ", "8CS", "8Chem"]
];
var fakeCSVData = {
    "A1":"24/5/2021",
    "B1":"25/5/2021",
    "A2":"26/5/2021",
    "B2":"27/5/2021",
    "A3":"28/5/2021",
    "B3":"31/5/2021",
    "A4":"1/6/2021",
    "B4":"2/6/2021"};

db.collection("Manage").doc("settings")
.withConverter(settingConverter)
.get().then((doc) => {
    if (doc.exists){
    var settings = doc.data();
    startDate = settings.startDate;
    endDate = settings.endDate;
    periodNum = settings.periodNum;
    daysNum = settings.cycleNum;
    cycledayNames = settings.cycleNames;
    periodTimes = settings.periodTimes;
    calendarCSV = settings.calendarCSV;
    console.log("imported");
    createTableForm();
    } else {
    console.log("No such document!");
    }}).catch((error) => {
    console.log("Error getting document:", error);
});


// -----------------------FUNCTIONS------------------------
function createTableForm() {

    var form = document.getElementById("userScheduleInput");
    var tableDiv = document.getElementById("tableInput");


    var table = document.createElement("table");
    table.setAttribute("class", "table table-bordered table-responsive");
    generateTableForm(table);

    tableDiv.append(table);

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
            inputField.setAttribute("id", "day-" + (i+1) + "-period-" + (j+1));
            inputField.setAttribute("maxlength", 50);
            inputField.setAttribute("class", "border rounded");
            inputCell.appendChild(inputField);
        }
    }
}

//Functions for the API
//On load, called to load the auth2 library and API client library.
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

// Initializes the API client library and sets up sign-in state listeners.
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, function(error) {
    //appendPre(JSON.stringify(error, null, 2));
  });
}

// Called when the signed in status changes, to update the UI appropriately. 
// After a sign-in, the API is called.
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    step2Div.style.display = 'block';
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    step2Div.style.display = 'none';
  }
}

// Sign in the user upon button click.
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

// Sign out the user upon button click.
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

function submitForm()
{
    for (i = 0; i < daysNum; i++) 
    {   
        var periodInputs = [];
        for (j = 0; j < periodNum; j++)
        {
            periodInputs.push(document.getElementById("day-" + (i+1) + "-period-" + (j+1)).value);        
        }
        userInputs.push(periodInputs);
        
    }
    userSchedule = new Schedule(fakeUserinputs);
    importToCalendar(userSchedule, document.getElementById("userImportDays").checked);
    //window.location.href = 'https://calendar.google.com/';
    //document.getElementById("testing").innerHTML = document.getElementById("userImportDays").checked;
}

function importToCalendar(schedule, checked){
    console.log("importing");
    var calendarID = "c_ktnlv95n9lqvca1lv0f1gougik@group.calendar.google.com";
    for(var date in calendarCSV) {
        if(checkDateWithinRange(date))
        {
            var cycleDay = calendarCSV[date];
            var scheduleDay = schedule.getDay(cycleDay);
            for(var i = 0; i< scheduleDay.periods.length; i++){
                var schedulePeriod = scheduleDay.periods[i];
                if (!schedulePeriod.freePeriod)
                {
                    var dateInput = makeDateString(date);
                    var eventResource = {
                        'summary': schedulePeriod.className,
                        'start': {
                            'dateTime': dateInput + 'T' + schedulePeriod.startTime+':00+08:00'
                            },
                        'end': {
                            'dateTime': dateInput + 'T'+ schedulePeriod.endTime +':00+08:00'
                        }
                    };
                    var request = gapi.client.calendar.events.insert({
                        'calendarId': calendarID,
                        'resource': eventResource
                    });
                    retry_(request, 10, 10);

                    //console.log(schedulePeriod.className + ": " + dateInput + 'T' + schedulePeriod.startTime+':00+08:00');
                }
            }
            if(checked){
                var eventResource = {
                    'summary': cycleDay,
                    'start': {
                        'date': makeDateString(date)
                        },
                    'end': {
                        'date': makeDateString(date)
                    }
                };
                var request = gapi.client.calendar.events.insert({
                    'calendarId': calendarID,
                    'resource': eventResource
                });
                retry_(request, 10, 10);
            }
        }
    }
}

function makeDateString(date){
    var ISODate = "";
    var split = date.split("/");
    for(var i = 2; i> -1; i--){
        if(i!=0 && split[i].length <2){
            ISODate += "0"+ split[i];
        }
        else{
            ISODate += split[i];
        }
        if(i != 0){
            ISODate += "-";
        }
    }
    return ISODate;
}

function checkDateWithinRange(date){
    var date = date.split("/"); //Format: DD/MM/YY
    if(aboveStartDate(date) && belowEndDate(date))
    {
        return true;
    }
    else{
        return false;
    }
}

function aboveStartDate(date){
    var startDateArr = startDate.split("-"); //Format: YY-MM-DD
    if(parseInt(date[2]) > parseInt(startDateArr[0]))
    {
        return true;
    }
    else if(parseInt(date[2]) == parseInt(startDateArr[0]))
    {
        if(parseInt(date[1]) > parseInt(startDateArr[1]))
        {
            return true;
        }
        else if(parseInt(date[1]) == parseInt(startDateArr[1]))
        {
            if(parseInt(date[0]) >= parseInt(startDateArr[2]))
            {
                return true;
            }
            else{return false}
        }
        else{return false}
    }
    else{return false;}
}

function belowEndDate(date){
    var endDateArr = endDate.split("-"); //Format: YY-MM-DD
    if(parseInt(date[2]) < parseInt(endDateArr[0]))
    {
        return true;
    }
    else if(parseInt(date[2]) == parseInt(endDateArr[0]))
    {
        if(parseInt(date[1]) < parseInt(endDateArr[1]))
        {
            return true;
        }
        else if(parseInt(date[1]) == parseInt(endDateArr[1]))
        {
            if(parseInt(date[0]) <= parseInt(endDateArr[2]))
            {
                return true;
            }
            else{return false}
        }
        else{return false}
    }
    else{return false;}
}

function retry_(request, numRetries, numOriginal) {
    if(numRetries> 0){
        setTimeout(() => request.execute(function(event) {
            if(event.hasOwnProperty('error'))
            {
                console.log(event);
                console.log(numRetries);
                setTimeout( () => retry_(request, numRetries-1), (Math.pow(2, numOriginal - numRetries)*1000) + (Math.round(Math.random() * 1000)));//added a 0
            }
        }), (2000) + (Math.round(Math.random() * 1000))); 
    }       
}

// --------------------- CLASSES -------------------------
//Settings Class
class Settings {
    
    startDate;
    endDate;
    cycleNum;
    periodNum;
    cycleNames;
    periodTimes;
    calendarCSV;
    
    constructor(startDate, endDate, cycleNum, periodNum, cycleNames, periodTimes, calendarCSV)
    {
        this.startDate = startDate;
        this.endDate = endDate;
        this.cycleNum = cycleNum
        this.periodNum = periodNum;
        this.cycleNames = cycleNames;
        this.periodTimes = periodTimes;
        this.calendarCSV = calendarCSV;
    }
}

//Schedule Class
class Schedule {
    userInput = [];
    days = [];
    
    constructor(userInput)
    {
        this.userInput = userInput;
        this.createDays(userInput);
    }

    createDays(userInput){
        for(var i = 0; i<userInput.length; i++){
            let input = userInput[i];
            let newDay = new CycleDay(input, i);
            this.days.push(newDay);
        }
    }

    getDay(cycleDayName){
        for (var i = 0; i<this.days.length ; i++){
            if(this.days[i].dayName == cycleDayName){
                return this.days[i];
            }
        }
        return "ERROR: day not found";
    }

    createOutputString(){
        let outputString = "";
        outputString += "User Input: " + this.userInput + "\n";
        outputString += "Days: \n";
        for( i = 0; i < this.days.length; i++)
        {
            outputString += "\tDayName: " + this.days[i].dayName + "\n";
            outputString += "\tPeriods: \n";
            var periodsLength = this.days[i].periods.length;
            for( j = 0; j< periodsLength; j++) //.periods.length; i++)
            {
                var currPeriod = this.days[i].periods[j];
                outputString += "\t\tPeriodNum: " + currPeriod.periodNum + "\n";
                outputString += "\t\t\tClassName: " + currPeriod.className + "\n";
                outputString += "\t\t\tFree: " + currPeriod.freePeriod + "\n";
                outputString += "\t\t\tStart: " + currPeriod.startTime + "\n";
                outputString += "\t\t\tEnd: " + currPeriod.endTime + "\n";
            }
        }
        console.log(outputString);
        return outputString;
    }

}

//CycleDay Class
class CycleDay {
    
    dayName;
    dayNum;
    periods = [];
    userInput;
    
    constructor(userInput, dayNum)
    {
        this.userInput = userInput;
        this.createClasses(userInput);
        this.dayNum = dayNum;
        this.dayName = cycledayNames[dayNum];
    }

    createClasses(input){
        for(var i = 0; i<input.length; i++){
            let periodNum = i +1;
            let className = input[i];
            let newPeriod = new Period(periodNum, className);
            newPeriod.setStartTime(periodTimes[periodNum * 2 - 2]);
            newPeriod.setEndTime(periodTimes[periodNum * 2 - 1]);
            this.periods.push(newPeriod);
        }
    }
}

//Period Class
class Period {
    
    periodNum;
    className;
    freePeriod;
    startTime;
    endTime;
    
    constructor(periodNum, userInput)
    {
        this.className = userInput;
        this.periodNum = periodNum;
        if(userInput == null || userInput.trim().length == 0)
        {
            this.freePeriod = true;
        }
        else{
            this.freePeriod = false;
        }
    }

    setStartTime(time) {
        this.startTime = time;
    }

    setEndTime(time){
        this.endTime = time;
    }
}
