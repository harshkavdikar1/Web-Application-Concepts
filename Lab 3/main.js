// const { retry } = require("async");
var express = require("express"),
    fs = require("fs"),
    bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    session = require('express-session'),
    model = require("./model");

model.initializeDB()

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

app.use(function(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next()
})

app.get("/", function (req, res) {
    res.redirect(307, "/landing")
})

app.get("/landing", function (req, res) {
    res.render("landing.ejs", {
        username: req.cookies.username == undefined ? "" : req.cookies.username
    })
})

function setCookies(req, res, next) {
    res.cookie("username", req.body.username);
    res.cookie("preference", req.cookies.preference == undefined ? "horizontal" : req.cookies.preference);
    next()
}

// Read the questions file to render questions to user
async function readSurvey() {
    return new Promise((resolve, reject) => {
        fs.readFile("survey.json", "utf-8", function (err, data) {
            if (err) {
                reject(err);
            }
            resolve(JSON.parse(data).questions);
        });
    });
}

app.post("/landing", setCookies, async function (req, res) {
    if (req.body.action == "survey") {
        req.session.currentPage = 0;
        req.session.selectedChoices = {};
        req.session.userName = req.body.username;
        req.session.questions = await readSurvey();
        res.redirect("/survey")
        return
    }
    else if (req.body.action == "match")
        res.redirect("/match")
    else
        res.redirect("/landing")
})

app.use("/survey", function(req, res, next) {
    if (req.session.userName == undefined) {
        res.redirect("/landing")
        return
    }
    else {
        next();
    }
})

function setAnswer(req, res, next) {
    let page = req.session.currentPage;
    let questions = req.session.questions;
    let questionid = questions[page].id;
    req.session.selectedChoices[questionid] = req.body.choice === undefined ? -1 : req.body.choice;
    next()
}

function sessionCompleteCheck(req, res, next) {
    let questions = req.session.questions;
    if (req.session.currentPage == questions.length - 1) {
        model.insertRecords(req.session.userName, req.session.selectedChoices)
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

function renderSurveyPage(req, res) {
    let page = req.session.currentPage;
    let questions = req.session.questions;
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
}

app.post("/survey", setAnswer, sessionCompleteCheck, function (req, res) {
    if (req.body.action == "prev")
        req.session.currentPage--;
    else if (req.body.action == "next")
        req.session.currentPage++;
    renderSurveyPage(req, res);
})

app.get("/survey", function (req, res) {
    renderSurveyPage(req, res)
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