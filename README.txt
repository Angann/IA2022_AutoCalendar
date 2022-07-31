Project Name: CIS Auto Calendar
Author: Adrian Ngan (CIS 2022)
Class: IB Computer Science HL
Date: 11/6/2021

Description:
The Auto Calendar is a website which allows CIS students, teachers and staff to import their daily schedule into
their Google Calendars.The website uses the Google Calendar API, Firebase Firestore/Cloud Firestore, and Django for the
backend. Languages used include Python(backend), Javascript(frontend) and HTML/CSS(frontend). Requirements are listed
in requirement.txt
The website contains 2 main pages:
User Import Page:
    This page is for users. The website leads the user through the 4 steps needed to impor their daily CIS schedule into
    their Google Calendars.
    Step 1: Log into Google
        A google sign in popup opens when the Login button is pressed
        Only CIS google accounts are authorized
    Step 2: Input Schedule
        The website provides a table with each cycle day as a row and each period as a column.
        The user inputs their appropriate class/event name into the appropriate box
        Free periods are left blank
    Step 3:
        The user is prompted to press the 'Import' button.
        Pressing the import button calls the Google Calendar API and creates the appropriate events according to the CIS
        schedule and user inputs
    Step 4:
        Wait for the requests to process.
        When the process is complete, the user is prompted to press the 'Go To Calendar' button
Admin Page:
    This page is for the admin. This page allows the admins to change the CIS schedule settings including: Starting Date,
    End Date, Number of Periods in a Day, Period Start and End Times, Number of Cycle Days, Names of Cycle Days, Dates
    and their corresponding Cycle Days.
    This page is Password Protected

Requirements:
    Requirements are listed in requirement.txt
    If hosting the website locally, Anaconda may be needed to activate virtual environment – in 'venv' folder– first.
