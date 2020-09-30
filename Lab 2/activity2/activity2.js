var http = require('http');
var url = require('url');
var qstring = require('querystring');

http.createServer(function (req, res) {
    // let requestURL = url.parse(req.url)
    // let endPoint = requestURL.pathname;

    // if (endPoint == "/")
    //     serveHomePage(res);

    if (req.method == "POST") {
        var jsonData = "";
        req.on('data', function (chunk) {
            jsonData += chunk;
        });
        req.on('end', function () {
            var reqObj = qstring.parse(jsonData);
            if (reqObj.userName == "harsh" && reqObj.password == "hk") {
                res.writeHead(200, {
                    "Content-Type": "text/html"
                });
                serveViewNews(res);
            }
            res.writeHead(401, {
                "Content-Type": "text/html"
            });
            serveFailedHomePage(res);
        });
    }
    else if (req.method == "GET") {
        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        serveHomePage(res);
    }
    else {
        res.writeHead(405, {
            "Content-Type": "text/html"
        });
        res.end("This method is not allowed")
    }
}).listen(3000);


function serveHomePage(res) {
    // res.writeHead(200, {
    //     "Content-Type": "text/html"
    // });
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


function serveViewNews(res) {
    res.end (
        `
            <!DOCTYPE html>
            UserName :          Role :          
            <a href="http://localhost:3000/logout">Logout</a>
            How are you?
        `
    );
}

function serveFailedHomePage(res) {
    res.end (
        `
            <!DOCTYPE html>
            <h2>Error!! Invalid user name and password combination.</h2><br/>
            Click <a href="http://localhost:3000">here</a> to go to home page.
        `
    );
}