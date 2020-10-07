// const { retry } = require("async");
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
    secret: 'MAGICALEXPRESSKEY',
    resave: true,
    saveUninitialized: true,
    name: 'sessionid'
}));

// Read the questions file to render questions to user
var questions = {}
fs.readFile("survey.json", "utf-8", function (err, data) {
    if (err)
        console.log(err);
    else
        questions = JSON.parse(data).questions;
});

app.get("/", function (req, res) {
    res.redirect(307, "/landing")
})

app.get("/landing", function (req, res) {
    res.render("landing.ejs", {
        username: req.cookies.username == undefined ? "" : req.cookies.username
    })
})

app.post("/landing", function (req, res) {

    res.cookie("username", req.body.username);
    res.cookie("preference", req.cookies.preference == undefined ? "horizontal" : req.cookies.preference);

    if (req.body.action == "survey") {
        req.session.currentPage = 0;
        req.session.selectedChoices = {};
        req.session.userName = req.body.username;
        res.redirect("/survey")
        return
    }
    else
        res.redirect("/match")
})

app.use("/survey", function(req, res, next) {
    if (req.session.userName === undefined) {
        res.redirect("/landing")
        return
    }
    else {
        next();
    }
})


function prevQuestion(req, res, next) {
    if (req.body.action == "prev") {
        req.session.currentPage--;
        res.redirect("/survey");
    }
    else
        next()
}

function setAnswer(req, res, next) {
    let page = req.session.currentPage;
    let questionid = questions[page].id;
    req.session.selectedChoices[questionid] = req.body.choice === undefined ? -1 : req.body.choice;
    next()
}

function sessionCompleteCheck(req, res, next) {
    if (req.session.currentPage == questions.length - 1) {
        req.session.destroy(function(err) {
            if (err)
                res.status(500).send("Error: 500 \n Message: Internal Server Error")
            else
                res.render("finish.ejs")
            });
    }
    else
        next()
}

app.post("/survey", setAnswer, prevQuestion, sessionCompleteCheck, function (req, res) {

    // Get question info for next question
    req.session.currentPage++;
    let page = req.session.currentPage;
    let questionid = questions[page].id
    let selectedChoice = req.session.selectedChoices[questionid]

    res.render("survey.ejs", {
        question: questions[page].question,
        options: questions[page].choices,
        page: page + 1,
        selectedChoice: selectedChoice === undefined ? -1 : selectedChoice,
        username: req.cookies.username,
        preference: req.cookies.preference,
        prevFlag: page == 0 ? false : true
    })
})

app.get("/survey", function (req, res) {

    let page = req.session.currentPage;
    let questionid = questions[page].id
    let selectedChoice = req.session.selectedChoices[questionid]

    res.render("survey.ejs", {
        question: questions[page].question,
        options: questions[page].choices,
        page: page + 1,
        selectedChoice: selectedChoice == undefined ? -1 : selectedChoice,
        username: req.cookies.username,
        preference: req.cookies.preference,
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

app.all("*", function (req, res) {
    res.status(404).send("Error: 404 <br> Message: Page not found")
})

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send("Error: 500 <br> Message: Internal Server Error")
})

app.listen(3000)