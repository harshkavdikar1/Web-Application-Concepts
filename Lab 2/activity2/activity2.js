var http = require('http');
var url = require('url');
var qstring = require('querystring');

const db = require('./NewsService');

var newsService = new db.NewsService();

newsService.addNewsStory("Author1", "dummy title 1", "private", "dummy storyContent 1", "2010-09-18");
newsService.addNewsStory("Author1", "dummy title 2", "public", "dummy storyContent 2", "2012-09-11");
newsService.addNewsStory("Author2", "dummy title 3", "private", "dummy storyContent 3", "2010-09-11");
newsService.addNewsStory("Author2", "dummy title 4", "public", "dummy storyContent 4", "2010-09-11");


http.createServer(function (req, res) {
    let requestURL = url.parse(req.url)
    // console.log(requestURL)
    let endPoint = requestURL.pathname;
    // console.log(endPoint);
    if (endPoint == "/")
        serveHomePage(req, res);
    
    else if (endPoint == "/login")
        validateLogin(req, res);
    
    else if (endPoint == "/logout")
        logoutUser(req, res);
    
    else if (endPoint == "/news")
        viewAllNews(req, res);

    else if (endPoint.includes("/news/"))
        // console.log(endPoint.split("/").pop())
        handleNewsRequest(req, res, endPoint.split("/").pop());

    else if (endPoint.includes("/deletenews/"))
        // console.log(endPoint.split("/").pop())
        deleteNews(req, res, endPoint.split("/").pop());

    else {
        res.writeHead(405, {
            "Content-Type": "text/html"
        });
        res.end("This method is not allowed")
    }
}).listen(3000);


function serveHomePage(req, res) {
    if (req.method != "GET")
        error405(res);

    res.writeHead(200, {
        "Content-Type": "text/html"
    });
    res.end(
        `
            <!DOCTYPE html>
            <form action="http://localhost:3000/login" method="POST">
                <label for="user">User Name : </label>
                <input type="text" name="userName" required><br/><br/>
                <label for="user">Password : </label>
                <input type="password" name="password" required><br/><br/>
                <label for="user">Role : </label>
                <input type="radio" value="guest" name="role" checked="checked">
                <label for="male">Guest</label>
                <input type="radio" value="subscriber" name="role">
                <label for="subscriber">Subscriber</label>
                <input type="radio" value="author" name="role">
                <label for="authors">Author</label><br/><br/>
                <input type="submit" value="Login">
            </form>
        `
    );
}


function validateLogin(req, res) {
    if (req.method != "POST")
        error405(res);

    let jsonData = "";
    req.on('data', function (chunk) {
        jsonData += chunk;
    });

    req.on('end', function () {
        let reqObj = qstring.parse(jsonData);
        if (reqObj.userName == "harsh" && reqObj.password == "hk") {
            res.writeHead(301, {
                Location: "/news"
            });
            res.end();
        }
        error401(res);
    });
}

function error401(res) {
    res.writeHead(401, {
        "Content-Type": "text/html"
    });
    inavlidCredentials(res);
}


function error405(res) {
    res.writeHead(405, {
        "Content-Type": "text/html"
    });
    res.end("This method is not allowed")
}


function getNews(userName, role) {
    newsStories = newsService.filterNewsStory();

    let stories = ""

    for (story of newsStories) {
        if (role == "Guest") {
            if (story.publicFlag == "public")
                stories += '<a href = "/news/' + story.id + '">' + story.title + '</a></br>'
            else
                stories += story.title + '</br>'
        }
        else if (role == "Subscriber") {
            stories += '<a href = "/news/' + story.id + '">' + story.title + '</a></br>'
        }
        else if (role == "Author") {
            if (story.publicFlag == "public" || story.author == userName)
                stories += '<a href = "/news/' + story.id + '">' + story.title + '</a></br>'
            else
                stories += story.title + '</br>'
        }
    }
    return stories
}

function viewAllNews(req, res) {

    let userName = "Harsh";
    let role = "Author";
    let createNewsButton = "</br></br></br>"
    if (role == "Author")
        createNewsButton = '<a href = "/create">Create News</a>' + createNewsButton

    res.writeHead(200, {
        "Content-Type": "text/html"
    });

    res.end (
        `
            <!DOCTYPE html>
            <title> Latest News </title>
            UserName: ${userName} </br>
            Role: ${role} </br>
            ${createNewsButton}
            ${getNews(userName, role)}
            </br></br></br>
            <a href="/logout">Logout</a>
        `
    );
}

function viewNews(req, res, id) {
    let story = newsService.NewsStories[id]
    let deleteButton = ""

    let userName = "Author1"

    if (userName == story.author)
        deleteButton = '<a href = "/deletenews/' + id + '">Delete Story</a>'
    res.end(
        `
            <!DOCTYPE html>
            <b> Title : </b> ${story.title} </br>
            <b> Author : </b> ${story.author} </br>
            <b> Content : </b> ${story.storyContent} </br>
            <b> Publication Date : </b> ${story.date} </br>
            <b> Content Visibility : </b> ${story.publicFlag} </br>
            ${deleteButton}
        `
    )
}


function handleNewsRequest(req, res, id) {
    if (req.method == "GET")
        viewNews(req, res, id);
    else if (req.method == "POST")
        createNews(req, res, id);
    error405(res)
}


function  deleteNews(req, res, id) {
    if (req.method != "GET")
        error405(res)
    
    newsService.deleteNewsStory(id)

    res.writeHead(301, {
        "Content-Type": "text/html",
        Location: "/news"
    });
    res.end()
}


function inavlidCredentials(res) {
    res.end (
        `
            <!DOCTYPE html>
            <h2>Error!! Invalid user name and password combination.</h2><br/>
            Click <a href="http://localhost:3000">here</a> to go to home page.
        `
    );
}


function logoutUser(req, res) {
    res.writeHead(301, {
        Location: "/"
    });
    res.end();
}