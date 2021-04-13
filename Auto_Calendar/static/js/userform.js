var periodNum = 4;
var daysNum = 8;
var cycledayNames = [A1, B1, A2, B2, A3, B3, A4, B4];


function GFG_Fun() {

    //var form = document.getElementById("userScheduleInput");

    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "submit.php");

    // Create an input element for emailID
    var ID = document.createElement("input");
    ID.setAttribute("type", "text");
    ID.setAttribute("name", "emailID");
    ID.setAttribute("placeholder", "E-Mail kgc");

    // Create an input element for password
    var PWD = document.createElement("input");
    PWD.setAttribute("type", "password");
    PWD.setAttribute("name", "password");
    PWD.setAttribute("placeholder", "Password");

    // Create a submit button
    var s = document.createElement("input");
    s.setAttribute("type", "submit");
    s.setAttribute("value", "Submit");

    // Append the email_ID input to the form
    form.append(ID);

    // Append the password to the form
    form.append(PWD);

    // Append the button to the form
    form.append(s);


    document.getElementById("userScheduleInput").appendChild(form);

    
}


GFG_Fun();