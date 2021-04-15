class Rectangle {
    constructor(height, width) {
      this.height = height;
      this.width = width;
    }
    get area() {
        return this.calcArea();
      }
      // Method
      calcArea() {
        return this.height * this.width;
      }
  }

//export default Rectangle;

class Schedule {
    
    userInput = [];
    days = [];
    
    constructor(userInput)
    {
        this.userInput = userInput;
        this.createDays(userInput);
    }

    createDays(userInput){
        for(i = 0; i<userInput.length; i++){
            let input = userInput[i];
            let newDay = new CycleDay(input, i);
            this.days.push(newDay);
        }
    }

}

class CycleDay {
    
    dayName;
    periods = [];
    userInput;
    
    constructor(userInput, dayNum)
    {
        this.userInput = userInput;
        this.createClasses(userInput);
        //THIS TOO this.dayName = ;
    }

    createClasses(input){
        for(i = 0; i<input.length; i++){
            let periodNum = i +1;
            let clasName = input[i];
            let newPeriod = new Period(periodNum, clasName);
            //SET START AND STOP TIME
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