var periodNum;
var daysNum;
var cycledayNames;

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

db.collection("Manage").doc("settings")
.withConverter(settingConverter)
.get().then((doc) => {
    if (doc.exists){
    var settings = doc.data();
    periodNum = settings.periodNum;
    daysNum = settings.cycleNum;
    cycledayNames = settings.cycleNames;
    createTableForm();    
    } else {
    console.log("No such document!");
    }}).catch((error) => {
    console.log("Error getting document:", error);
});

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

function createTableForm() {

    var form = document.getElementById("userScheduleInput");
    var div = document.getElementById("tableDiv");

    var table = document.createElement("table");
    table.setAttribute("class", "table table-bordered table-responsive");
    generateTableForm(table);

    div.append(table);
    form.append(div);

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



//export { createTableForm, generateTableForm, periodNum, daysNum, cycledayNames };