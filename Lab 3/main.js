const { retry } = require("async");
var express = require("express"),
    fs = require("fs"),
    bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    session = require('express-session');
    app = express();


// Set it to set the tempalate engine
app.set("view engine", "ejs");

// required for parsing the payload
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// required for reading the cookies
app.use(cookieParser());

// Initiate session cookies options
app.use(session({
	secret: 'magic',
	resave: true,
    saveUninitialized: true,
    name: 'sessionid'
}));

// Read the questions file to render questions to user
var questions = {}

var userInfo = {}

fs.readFile("survey.json", "utf-8", function(error, data) {
    questions = JSON.parse(data).questions;
});

app.get("/", function(req, res) {
    res.redirect("/landing")
})

app.get("/landing", function(req, res) {
    res.render("landing.ejs")
})

app.post("/landing", function(req, res) {

    let username = req.body.username
    res.cookie("username", username);
    if (username in userInfo == false){
        userInfo[username] = {
            currentPage: 0,
            preference: "horizontal",
            selectedChoices: new Array(questions.length).fill(-1)
        }
    }
    else {
        userInfo[username].currentPage = 0
    }

    if (req.body.action == "survey")
        res.redirect(307, "/survey")
    else
        res.redirect("/match")
})

app.post("/survey", function(req, res) {
    let username = req.cookies.username
    let preference = userInfo[username].preference
    let page = userInfo[username].currentPage;
    let selectedChoices = userInfo[username].selectedChoices
    if (req.body.choice != undefined)
        userInfo[username].selectedChoices[page - 1] = req.body.choice

    userInfo[username].currentPage++;

    if (page == questions.length) {
        res.clearCookie("sessionid")
        req.session.destroy();
        res.redirect("/")
        return
    }

    res.render("survey.ejs", {
        question : questions[page].question,
        options : questions[page].choices,
        page : page + 1,
        selectedChoice : selectedChoices[page],
        username : username,
        preference : preference,
        prevFlag : page == 0 ? false : true
    })
})

app.get("/match", function(req, res){
    res.send("match")
})

app.get("/preference", function(req, res){
    let username = req.cookies.username
    res.render("preference.ejs", {
        preference: userInfo[username].preference
    })
})

app.post("/preference", function(req, res){
    let username = req.cookies.username
    userInfo[username].preference = req.body.preference
    res.redirect(307, "/survey")
})

app.listen(3000)