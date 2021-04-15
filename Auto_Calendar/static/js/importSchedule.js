//----------------------USER INPUT AND SCHEUDLE OBJECT CREATOR SECTION---------------------------

var periodNum = 4;
var daysNum = 8;
var cycledayNames = ["A1", "B1", "A2", "B2", "A3", "B3", "A4", "B4"];
var userInputs = [];
var userSchedule;
var periodTimes = ["7:55", "9:00", "9:05", "10:10", "11:15", "12:20", "12:40", "1:45"];

function submitForm()
{
    for (i = 0; i < daysNum; i++) 
    {   var periodInputs = [];
        for (j = 0; j < periodNum; j++)
        {
            periodInputs.push(document.getElementById("day-" + (i+1) + "-period-" + (j+1)).value);        
        }
        userInputs.push(periodInputs);
        
    }
    generateSchedule(userInputs);
    importToCalendar();
    //document.getElementById("testing").innerHTML = userSchedule.createOutputString();
}

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

function generateSchedule(userInputs)
{
    userSchedule = new Schedule(userInputs);
}

// ---------------------API SECTION----------------------

// Client ID and API key from the Developer Console
var CLIENT_ID = '1097932129420-mkla5e9ibr6qgok18dvn3ac3f2a4f9in.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBqafLKv1Y-SktNmuvb651BvR48UAXd96A';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');


/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
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
    appendPre(JSON.stringify(error, null, 2));
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

function importToCalendar(){
    var eventResource = {
        'summary': 'Google I/O 2015',
        'start': {
          'dateTime': '2021-05-01T07:55:00+08:00'
            },
        'end': {
          'dateTime': '2021-05-01T9:00:00+08:00'
        }
      };
    gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': eventResource
      });
}

//export {periodNum, daysNum, cycledayNames, userInputs, CLIENT_ID, API_KEY, DISCOVERY_DOCS, SCOPES, authorizeButton, signoutButton, handleClientLoad, initClient, updateSigninStatus, handleAuthClick, handleSignoutClick};