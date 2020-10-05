var express = require("express")
var app = express()
var path = require('path')

app.get("/", function(req, res) {
    res.redirect("/landing")
})

app.get("/landing", function(req, res){
    res.sendFile(path.join(__dirname + "/html/landing.html"))
})

app.post("/survey", function(req, res){
    res.send("survey")
})

app.post("/match", function(req, res){
    res.send("match")
})

app.listen(3000)

