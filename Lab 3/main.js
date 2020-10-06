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

    res.cookie("username", req.body.username);
    userInfo[req.cookies.sessionid] = {
        currentPage: 0,
        horizontalFlag: true
    }

    if (req.body.action == "survey")
        res.redirect(307, "/survey")
    else
        res.redirect("/match")
})

app.post("/survey", function(req, res) {
    horizontalFlag = false
    let page = userInfo[req.cookies.sessionid].currentPage;
    userInfo[req.cookies.sessionid].currentPage++;
    if (page == questions.length) {
        res.clearCookie("sessionid")
        req.session.destroy();
        res.redirect("/")
        return
    }
    res.render("survey.ejs", {
        question : questions[page ].question,
        options : questions[page].choices,
        page : page,
        username : req.cookies.username,
        horizontalFlag : horizontalFlag,
        prevFlag : page == 0 ? false : true
    })
})

app.get("/match", function(req, res){
    res.send("match")
})

app.listen(3000)