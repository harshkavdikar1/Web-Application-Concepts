var express = require("express"),
    bodyParser = require("body-parser"),
    crypto = require('crypto');

var hash = crypto.createHash('sha1')

var db = require('./NewsService');

var newsService = new db.NewsService();

app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var tokens = {}

app.post("/login", function (req, res) {
    if (req.body.username != req.body.password)
        throw "error401"
    else {
        var uniqueValue = req.body.username + Date.now()
        var authorizationToken = hash.update(uniqueValue).digest('hex');
        tokens[authorizationToken] = true;
        res.set("authorization", authorizationToken)
        res.status(200).send({
            "Message": "Login Successfull",
            "authorization": authorizationToken,
            "success": True
        });
    }
})

app.use("*", function (req, res, next) {
    let authorizationToken = req.headers["authorization"]
    let token = tokens[authorizationToken]
    if (token == undefined || token == false) {
        throw "error401"
    }
    else
        next()
})

app.post("/create", function (req, res) {

    let author = req.body.author
    let title = req.body.title
    let publicFlag = req.body.publicFlag
    let storyContent = req.body.storyContent
    let date = req.body.date

    let newsStroyId = newsService.addNewsStory(author, title, publicFlag, storyContent, date)
    res.status(201).send({
        "Message": "News Story Created Successfully",
        "id": newsStroyId,
        "success": True
    })
})

app.patch("/editTitle/:Id", function (req, res) {
    let newsStoryId = req.params.Id
    let author = req.body.author
    let title = req.body.title

    newsService.updateTitle(newsStoryId, author, title)
    res.status(200).send({
        "Message": "NewsStory with Id: " + newsStoryId + " has been successfully updated",
        "Id": newsStoryId,
        "success": True
    })
})

app.patch("/editContent/:Id", function (req, res) {

    let newsStoryId = req.params.Id
    let author = req.body.author
    let storyContent = req.body.storyContent

    newsService.updatestoryContent(newsStoryId, author,storyContent)
    res.status(200).send({
        "Message": "NewsStory with Id: " + newsStoryId + " has been successfully updated",
        "Id": newsStoryId,
        "success": True
    })
})

app.delete("/delete/:Id", function (req, res) {
    let newsStoryId = req.params.Id
    newsService.deleteNewsStory(newsStoryId)
    res.status(200).send({
        "Message": "NewsStory with Id: " + newsStoryId + " has been successfully deleted",
        "Id": newsStoryId,
        "success": True
    })
})

app.get("/search", function (req, res) {

    let author = req.query.author
    let title = req.query.title
    let startDate = req.query.startDate
    let endDate = req.query.endDate

    let stories = newsService.filterNewsStory(author, title, startDate, endDate)

    res.status(200).send({
        "stories": stories,
        "success": True
    })
})

app.get('/logout', function (req, res) {
    let authorizationToken = req.headers["authorization"]
    tokens[authorizationToken] = false;
    res.status(200).end()
})

app.use(["/login", "/create", "/editTitle", "/editContent", "/search", "/delete", "/logout"], function (req, res) {
    throw "error405"
})

app.use("*", function(req, res) {
    throw "error404"
})

// 400 Error Handler
app.use(function (err, req, res, next) {
    if (err == "error400") {
        res.status(400).send({
            "Message": "Bad Request",
            "Error": "400",
            "success": False
        })
    }
    else
        next(err)
})

// 401 Error Handler
app.use(function (err, req, res, next) {
    if (err == "error401") {
        res.status(401).send({
            "Message": "Unauthorized",
            "Error": "401",
            "success": False
        })
    }
    else
        next(err)
})

// 403 Error Handler
app.use(function (err, req, res, next) {
    if (err == "error403") {
        res.status(403).send({
            "Message": "Forbidden",
            "Error": 403,
            "success": False
        })
    }
    else
        next(err)
})

// 404 Error Handler
app.use(function (err, req, res, next) {
    if (err == "error404") {
        res.status(404).send({
            "Message": "Resource Not Found",
            "Error": 404,
            "success": False
        })
    }
    else
        next(err)
})

// 405 Error Handler
app.use(function (err, req, res, next) {
    if (err == "error405") {
        res.status(405).send({
            "Message": "Method not allowed",
            "Error": 405,
            "success": False
        })
    }
    else
        next(err)
})

// 500 Error Handler
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send({
        "Message": "Internal Server Error",
        "Error": "500",
        "success": False
    })
})

app.listen(3000)