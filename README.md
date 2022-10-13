# Gig App v2

This app is written using React and Typescript.

## Purpose

This purpose of this app is to give the user a simple and easy to use way to track both revenue and costs for various hobbies or "side-gigs".

## Page by Page Breakdown

This section will describe each page. All pages but the about page require a google login to access

### About

The About page contains basic information pertaining to the app's purpose.

### Dashboard

The Dashboard lists all projects made by the user in a list format with the id, name, and owner of each project enumerated.  
Each projected listed can be clicked to take the user to the corresponding project's page.

### Projects

The Projects page lists all projects made by the user in a card format with the id, name, description, and owner of each project enumerated. The ability to create a project is also possible on this page.

#### Create

This page is where the user may create projects. To create a project, the user needs to input a project name, description, and owner.

#### Project

---

This page is the template that all projects will use.

##### Costs

The costs section is where a project's costs will be listed and where users will be able to input more items.  
Each cost has an id, name, amount, and date field with the ability of removal.  
The cost creation box requires a name, amount, and date input.

##### Revenues

The revenues section is where a project's revenues will be listed and where users will be able to input more items.  
Each revenue has an id, name, amount, and date field with the ability of removal.  
The revenue creation box requires a name, amount, and date input.

##### Days Worked

The days worked section is where a project's day worked will be listed and where users will be able to input more items.  
Each day work has a notes, start time, end time, and time worked field with the ability of removal.  
The days worked creation box requires a start and end time with an optional notes input.

##### Info Section

This box contains tabulated data about the project that has been input so far.  
The data presented include:

1. Total Revenue ($)
2. Total Cost ($)
3. Profit ($)
4. Total Time Worked (hours)
5. Profit Per Hour ($)
6. Return on Investment (%)
7. Description

## Back-end

This app makes use of cors, jsonwebtoken, and express.  
It makes use of a basic REST API to handle requests from the front-end. There is also an error handler middleware.
