var express = require("express"),
    bodyParser = require("body-parser");

var db = require('./NewsService');

var newsService = new db.NewsService();

app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/news", function (req, res) {

    let author = req.body.author
    let title = req.body.title
    let publicFlag = req.body.publicFlag
    let storyContent = req.body.storyContent
    let date = String(req.body.date)

    let newsStroyId = newsService.addNewsStory(author, title, publicFlag, storyContent, date)
    res.status(201).send({
        "Message": "News Story Created Successfully",
        "id": newsStroyId
    })
})

app.put("/news/:Id", function (req, res) {
    let newsStoryId = req.params.Id
    let author = req.body.author
    let title = req.body.title

    newsService.updateTitle(newsStoryId, author, title)
    res.status(204).send({
        "Message": "NewsStory with Id: " + newsStoryId + " has been successfully updated"
    })
})

app.put("/news/:Id", function (req, res) {

    let newsStoryId = req.params.Id
    let author = req.body.author
    let storyContent = req.body.storyContent

    newsService.updatestoryContent(newsStoryId, author, storyContent)
    res.status(204).send({
        "Message": "NewsStory with Id: " + newsStoryId + " has been successfully updated"
    })
})

app.delete("/news/:Id", function (req, res) {
    let newsStoryId = req.params.Id
    newsService.deleteNewsStory(newsStoryId)
    res.status(204).send({
        "Message": "NewsStory with Id: " + newsStoryId + " has been successfully deleted"
    })
})

app.get("/news", function (req, res) {

    let author = req.query.author
    let title = req.query.title
    let startDate = req.query.startDate
    let endDate = req.query.endDate

    let stories = newsService.filterNewsStory(author, title, startDate, endDate)

    res.status(200).send({
        "stories": stories
    })
})

app.get("/news/:Id", function (req, res) {
    let newsStoryId = req.params.Id

    let newsStory = newsService.getNewsStoryWithId(newsStoryId)

    res.status(200).send({
        "NewsStory": newsStory
    })
})

app.use(["/news", "/news/:Id"], function (req, res) {
    throw "error405"
})

app.use("*", function (req, res) {
    throw "error404"
})

// 400 Error Handler
app.use(function (err, req, res, next) {
    if (err == "error400") {
        res.status(400).send({
            "Message": "Bad Request"
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
            "Error": 404
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
            "Error": 405
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
        "Error": 500
    })
})

app.listen(3000)