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
    let endPoint = requestURL.pathname;



    if (endPoint == "/")
        serveHomePage(req, res);
    
    else if (endPoint == "/login")
        validateLogin(req, res);
    
    else if (endPoint == "/logout")
        logoutUser(req, res);

    else if (endPoint == "/news")
        viewNews(req, res);

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
            viewNews(res);
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

function viewNews(res) {
    res.writeHead(200, {
        "Content-Type": "text/html"
    });
    newsStories = newsService.filterNewsStory();

    console.log(newsStories);
    res.end (
        `
            <!DOCTYPE html>
            UserName :          Role :          
            <a href="http://localhost:3000/logout">Logout</a>
            How are you?
        `
    );
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