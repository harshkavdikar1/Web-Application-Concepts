var express = require("express"),
    fs = require("fs"),
    bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    app = express();


// Set it to set the tempalate engine
app.set("view engine", "ejs");

// required for parsing the payload
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// required for reading the cookies
app.use(cookieParser());

// Read the questions file to render questions to user
var questions = {}
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
    if (req.body.action == "survey")
        res.redirect(307, "/survey")
    else
        res.redirect("/match")
})

app.post("/survey", function(req, res) {
    console.log(questions)
    horizontalFlag = false
    var page = 1;
    res.render("survey.ejs", {
        question : questions[page-1].question,
        options : questions[page - 1].choices,
        page : 1,
        username : req.cookies.username,
        horizontalFlag : horizontalFlag,
        prevFlag : page == 1 ? false : true,
        nextFlag : page == questions.length ? false : true
    })
})

app.get("/match", function(req, res){
    res.send("match")
})

app.listen(3000)

