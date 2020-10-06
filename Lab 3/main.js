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

fs.readFile("survey.json", "utf-8", function (error, data) {
    questions = JSON.parse(data).questions;
});

app.get("/", function (req, res) {
    res.redirect("/landing")
})

app.get("/landing", function (req, res) {
    res.render("landing.ejs", {
        username: req.cookies.username == undefined ? "" : req.cookies.username
    })
})

app.post("/landing", function (req, res) {
    let username = req.body.username
    res.cookie("username", username);

    if (req.cookies.preference == undefined)
        res.cookie("preference", "horizontal");

    if (username in userInfo == false) {
        userInfo[username] = {
            currentPage: 0,
            selectedChoices: {}
        }
    }
    else {
        userInfo[username].currentPage = 0
    }

    if (req.body.action == "survey")
        res.redirect("/survey")
    else
        res.redirect("/match")
})

app.post("/survey", function (req, res) {
    if (req.cookies.sessionid == undefined) {
        res.redirect("/")
        return
    }

    let username = req.cookies.username

    // Set answer for the current question
    let page = userInfo[username].currentPage;
    let questionid = questions[page].id
    userInfo[username].selectedChoices[questionid] = req.body.choice === undefined ? -1 : req.body.choice

    if (req.body.action == "prev") {
        userInfo[username].currentPage--;
        res.redirect("/survey");
        return;
    }

    if (page == questions.length - 1) {
        res.clearCookie("sessionid")
        req.session.destroy();
        res.render("finish.ejs")
        // setTimeout(function() {
        //     res.render("landing.ejs")
        // },
        // 10000);
        return
    }

    // Get question info for next question
    userInfo[username].currentPage++;
    page = userInfo[username].currentPage;
    questionid = questions[page].id

    let preference = req.cookies.preference

    let selectedChoice = userInfo[username].selectedChoices[questionid]

    res.render("survey.ejs", {
        question: questions[page].question,
        options: questions[page].choices,
        page: page + 1,
        selectedChoice: selectedChoice === undefined ? -1 : selectedChoice,
        username: username,
        preference: preference,
        prevFlag: page == 0 ? false : true
    })
})

app.get("/survey", function (req, res) {

    let username = req.cookies.username
    let preference = req.cookies.preference
    let page = userInfo[username].currentPage;
    let questionid = questions[page].id
    let selectedChoice = userInfo[username].selectedChoices[questionid]

    res.render("survey.ejs", {
        question: questions[page].question,
        options: questions[page].choices,
        page: page + 1,
        selectedChoice: selectedChoice == undefined ? -1 : selectedChoice,
        username: username,
        preference: preference,
        prevFlag: page == 0 ? false : true
    })
})

app.get("/match", function (req, res) {
    res.send("match")
})

app.get("/preference", function (req, res) {
    res.render("preference.ejs", {
        preference: req.cookies.preference
    })
})

app.post("/preference", function (req, res) {
    res.cookie("preference", req.body.preference);
    res.redirect("/survey");
})

app.listen(3000)