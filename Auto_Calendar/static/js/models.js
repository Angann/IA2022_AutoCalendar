/*
 * CIS AUTO CALENDAR: MODELS AND CLASSES
 * This file contiains the  classes required and used in the CISAutoCalendar Website
 * Author: Adrian Ngan (CIS Class of 2022)
 */


/*
 * Schedule Class
 * 
 * This class contains information for the user's schedule. 
 * The 'days' list stores the CycleDay objects
 */
class Schedule {
    userInput = [];
    days = [];
    
    constructor(userInput)
    {
        this.userInput = userInput;
        this.createDays(userInput);
    }

    getDay(cycleDayName){
        for (var i = 0; i<this.days.length ; i++){
            if(this.days[i].dayName == cycleDayName){
                return this.days[i];
            }
        }
        return "ERROR: day not found";
    }

    //Creates each cycleday object according to the user inputs
    createDays(userInput){
        for(var i = 0; i<userInput.length; i++){
            let input = userInput[i];
            let newDay = new CycleDay(input, i);
            this.days.push(newDay);
        }
    }

    //Creates a readable string of information in the object
    createOutputString(){
        let outputString = "";
        outputString += "User Input: " + this.userInput + "\n";
        outputString += "Days: \n";
        for( i = 0; i < this.days.length; i++)
        {
            outputString += "\tDayName: " + this.days[i].dayName + "\n";
            outputString += "\tPeriods: \n";
            var periodsLength = this.days[i].periods.length;
            for( j = 0; j< periodsLength; j++) 
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

/*
 * CycleDay Class
 * 
 * This class contains information for the specifc Cycle Day. 
 * The 'periods' list stores the Period objects
 */
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

    //Creates each period object for the given cycle day
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

/*
 * Period Class
 * 
 * This class contains information for a specifc Period. 
 * Period objects are stored within CycleDay Objects
 */
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
        if(userInput == null || userInput == "")
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

/*
 * Settings Class
 * 
 * This class contains information of the school's timetable and settings for the import process.
 * These settings are determined by the admins through the Manage page and is stored in Firebase
 * 
 */
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

export {Settings};