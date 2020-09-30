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

    else if (endPoint == "/news"){
        console.log(endPoint, req.method == "POST")
        if (req.method == "GET")
            viewAllNews(req, res);
        else if (req.method == "POST")
            createNews(req, res);
        else
            error405(res);
    }

    else if (endPoint.includes("/news/"))
        viewNews(req, res, endPoint.split("/").pop());

    else if (endPoint.includes("/deletenews/"))
        deleteNews(req, res, endPoint.split("/").pop());

    else if (endPoint == "/createnews")
        create(req, res);

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
        createNewsButton = '<a href = "/createnews">Create News</a>' + createNewsButton

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
    if (req.method != "GET")
        error405(res)
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

function createNews(req, res) {
    let jsonData = "";
    req.on('data', function (chunk) {
        jsonData += chunk;
    });

    req.on('end', function () {
        let reqObj = qstring.parse(jsonData);
        newsService.addNewsStory(reqObj.author, reqObj.title, reqObj.publicFlag, reqObj.storyContent, reqObj.date);

        res.writeHead(301, {
            Location: "/news"
        })

        res.end()
    });
}


function create(req, res) {
    res.writeHead(200, {
        "Content-Type": "text/html",
    });
    res.end(
        `
            <!DOCTYPE html>
            <form action = "/news" method = "POST">
                <label for="author">Author : </label>
                <input type="text" name="author" required><br/><br/>
                <label for="title">Title : </label>
                <input type="text" name="title" required><br/><br/>
                <label for="storyContent">Story Content : </label>
                <input type="text" name="storyContent" required><br/><br/>
                <label for="publicationDate">Publication Date</label>
                <input type="date" name="storyContent" required><br/><br/>
                <label for="publicFlag">Public Flag</label>    
                <input type="radio" value="private" name="publicFlag" checked>
                <label for="private">Private</label>
                <input type="radio" value="author" name="publicFlag">
                <label for="public">Public</label><br/><br/>
                <input type="submit" value="Create">
            </form>
        `
    )
}

function deleteNews(req, res, id) {
    if (req.method != "GET")
        error405(res)
    
    try {
        newsService.deleteNewsStory(id)
    }
    catch (err) {
        res.writeHead(404, {
            "Content-Type": "text/html"
        })
        res.end(
            `
            <!DOCTYPE html>
            <h2>Unable to find story</h2><br/>
            Click <a href="/news">here</a> to go back.
            `
        )
    }

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