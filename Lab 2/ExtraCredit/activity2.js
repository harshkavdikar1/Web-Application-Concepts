var http = require('http');
var url = require('url');
var qstring = require('querystring');

const db = require('./NewsService');

var newsService = new db.NewsService();

// newsService.addNewsStory("Author1", "dummy title 1", "private", "dummy storyContent 1", "2010-09-18");
// newsService.addNewsStory("Author1", "dummy title 2", "public", "dummy storyContent 2", "2012-09-11");
// newsService.addNewsStory("Author2", "dummy title 3", "private", "dummy storyContent 3", "2010-09-11");
// newsService.addNewsStory("Author2", "dummy title 4", "public", "dummy storyContent 4", "2010-09-11");


http.createServer(function (req, res) {
    let requestURL = url.parse(req.url)
    let endPoint = requestURL.pathname;

    if (endPoint == "/")
        serveHomePage(req, res);

    else if (endPoint == "/login")
        login(req, res);

    else if (endPoint == "/logout")
        logoutUser(req, res);

    else if (endPoint == "/news") {
        if (req.method == "GET")
            viewAllNews(req, res);
        else if (req.method == "POST")
            createNews(req, res);
        else
            error405(req, res);
    }

    else if (endPoint.includes("/news/"))
        viewNews(req, res, endPoint.split("/").pop());

    else if (endPoint.includes("/deletenews/"))
        deleteNews(req, res, endPoint.split("/").pop());

    else if (endPoint == "/createnews")
        create(req, res);

    else {
        error404(res)
    }
}).listen(3000);

/**
 * Autoselects the role of the user who has previously visited webage
 * @param {String} selectedRole User role stored in cookie
 * @param {String} role         Role in the HTML page
 */
function isCheckedRole(selectedRole, role) {
    return selectedRole == role || (role == "guest" && selectedRole == "") ? "checked" : ""
}

function serveHomePage(req, res) {
    if (req.method != "GET")
        error405(req, res);

    let cookies = readCookies(req);
    let userDetails = ""
    let userName = "";
    let role = "";
    if (Object.keys(cookies).length) {
        if (cookies.loggedin == "true") {
            res.writeHead(307, {
                "Cache-Control": "no-cache, no-store, must-revalidate",
                Location: "/news"
            })
            res.end()
        }
        userName = cookies.userName;
        role = cookies.role;
        userDetails = "Welcome " + role + " " + userName + ", please enter your password </br></br> "
    }

    res.writeHead(200, {
        "Content-Type": "text/html",
        "Cache-Control": "no-cache, no-store, must-revalidate"
    });
    res.end(
        `
            <!DOCTYPE html>
            ${userDetails}
            <form action="/login" method="POST">
                <label for="user">User Name : </label>
                <input type="text" required name="userName" value=${userName}><br/><br/>
                <label for="user">Password : </label>
                <input type="password" name="password" required><br/><br/>
                <label for="user">Role : </label>
                <input type="radio" value="guest" name="role" ${isCheckedRole(role, "guest")}>
                <label for="male">Guest</label>
                <input type="radio" value="subscriber" name="role" ${isCheckedRole(role, "subscriber")}>
                <label for="subscriber">Subscriber</label>
                <input type="radio" value="author" name="role" ${isCheckedRole(role, "author")}>
                <label for="author">Author</label><br/><br/>
                <input type="submit" value="Login">
            </form>
        `
    );
}

/**
 * Validate User credentials, set-cookies and redirect to target page
 * @param {HTTP Request} req    HTTP request object
 * @param {HTTP Response} res   HTTP response object
 */
function login(req, res) {
    if (req.method != "POST")
        error405(req, res);

    let jsonData = "";
    req.on('data', function (chunk) {
        jsonData += chunk;
    });

    req.on('end', function () {
        let reqObj = qstring.parse(jsonData);
        if (reqObj.userName === reqObj.password) {
            res.writeHead(301, {
                "Set-Cookie": ['userName=' + reqObj.userName, 'role=' + reqObj.role, 'loggedin=true'],
                "Cache-Control": "no-cache, no-store, must-revalidate",
                Location: "/news"
            });
            res.end();
        }
        error401InvalidCredentials(res);
    });
}

/**
 * Get all the news stories for current user
 * @param {String} userName     UserName of the user
 * @param {String} role         Current role of the user
 */
function getNews(userName, role) {
    newsStories = newsService.filterNewsStory();

    let stories = ""

    for (story of newsStories) {
        if (role == "guest") {
            if (story.publicFlag == "public")
                stories += '<a href = "/news/' + story.id + '">' + story.title + '</a></br>'
            else
                stories += story.title + '</br>'
        }
        else if (role == "subscriber") {
            stories += '<a href = "/news/' + story.id + '">' + story.title + '</a></br>'
        }
        else if (role == "author") {
            if (story.publicFlag == "public" || story.author == userName)
                stories += '<a href = "/news/' + story.id + '">' + story.title + '</a></br>'
            else
                stories += story.title + '</br>'
        }
    }
    return stories
}

/**
 * Display all the titles of news stories to the user
 * @param {HTTP Request} req    HTTP request object
 * @param {HTTP Response} res   HTTP response object
 */
function viewAllNews(req, res) {

    let cookies = readCookies(req);

    validateLogin(res, cookies);

    let userName = cookies.userName;
    let role = cookies.role;

    let createNewsButton = "</br></br></br>"
    if (role == "author")
        createNewsButton = '<a href = "/createnews">Create News</a>' + createNewsButton

    res.writeHead(200, {
        "Content-Type": "text/html",
        "Cache-Control": "no-cache, no-store, must-revalidate"
    });

    res.end(
        `
            <!DOCTYPE html>
            <title> Latest News </title>
            User Name: ${userName} </br>
            Role: ${role} </br>
            ${createNewsButton}
            ${getNews(userName, role)}
            </br></br></br>
            <a href="/logout">Logout</a>
        `
    );
}

/**
 * Show a particular news item to the user
 * @param {HTTP Request} req    HTTP request object
 * @param {HTTP Response} res   HTTP response object
 * @param {Number} id           Id of news story
 * @param {String} err          Error Messsage for the user in case of failure
 */
function viewNews(req, res, id, err = "") {
    if (req.method != "GET")
        error405(req, res)

    let cookies = readCookies(req);

    validateLogin(res, cookies);

    let userName = cookies.userName;
    let role = cookies.role;

    if (id in newsService.NewsStories == false)
        error404(res)
    else {
        let story = newsService.NewsStories[id]
        let deleteButton = ""

        if (role == "guest" && story.publicFlag == "private")
            error403(res)

        else if (role == "author" && story.publicFlag == "private" && story.author != userName)
            error403(res)

        if (userName == story.author && role == "author")
            deleteButton = '<a href = "/deletenews/' + id + '">Delete Story</a>'
        res.end(
            `
                <!DOCTYPE html>
                User Name: ${userName} </br>
                Role: ${role} </br></br></br></br>
                ${err} </br>
                <b> Title : </b> ${story.title} </br>
                <b> Author : </b> ${story.author} </br>
                <b> Content : </b> ${story.storyContent} </br>
                <b> Publication Date : </b> ${story.date} </br>
                <b> Content Visibility : </b> ${story.publicFlag} </br>
                ${deleteButton}
                </br></br></br>
                <a href="/logout">Logout</a>
            `
        )
    }
}

/**
 * Handle POST request to create a new News Story
 * @param {HTTP Request} req    HTTP request object
 * @param {HTTP Response} res   HTTP response object
 */
function createNews(req, res) {

    let cookies = readCookies(req);

    validateLogin(res, cookies);

    let userName = cookies.userName;
    let role = cookies.role;

    if (role != "author")
        error403(res)

    let jsonData = "";
    req.on('data', function (chunk) {
        jsonData += chunk;
    });

    req.on('end', function () {
        let reqObj = qstring.parse(jsonData);
        try {
            newsService.addNewsStory(reqObj.author, reqObj.title, reqObj.publicFlag, reqObj.storyContent, reqObj.publicationDate);
        }
        catch (err) {
            renderCreateNews(res, reqObj.author, err = "Error: 500 </br> Message: Unable to create the story due to some internal issue please try again")
        }
        res.writeHead(301, {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Location: "/news"
        })
        res.end()
    });
}

/**
 * GET method to render the create news page to the user
 * @param {HTTP Request} req    HTTP request object
 * @param {HTTP Response} res   HTTP response object 
 */
function create(req, res) {

    if (req.method != "GET")
        error405(req, res)

    let cookies = readCookies(req);

    validateLogin(res, cookies);

    let userName = cookies.userName;
    let role = cookies.role;

    if (role != "author")
        error403(res)

    renderCreateNews(res, userName)
}

/**
 * Render the HTML page to create a news item
 * @param {HTTP Response} res   HTTP response object
 * @param {String} userName     Current users username
 * @param {String} err          Error message in case of failure
 */
function renderCreateNews(res, userName, err = "") {
    res.writeHead(200, {
        "Content-Type": "text/html",
        "Cache-Control": "no-cache, no-store, must-revalidate"
    });
    res.end(
        `
            <!DOCTYPE html>
            ${err}
            <form action = "/news" method = "POST">
                <label for="author">Author : </label>
                <input type="text" name="author" value=${userName} required><br/><br/>
                <label for="title">Title : </label>
                <input type="text" name="title" required><br/><br/>
                <label for="storyContent">Story Content : </label>
                <input type="text" name="storyContent" required><br/><br/>
                <label for="publicationDate">Publication Date</label>
                <input type="datetime-local" name="publicationDate" required><br/><br/>
                <label for="publicFlag">Public Flag</label>    
                <input type="radio" value="private" name="publicFlag" checked>
                <label for="private">Private</label>
                <input type="radio" value="public" name="publicFlag">
                <label for="public">Public</label><br/><br/>
                <input type="submit" value="Save">
                <a href = "/news"> Cancel </a>
            </form>
        `
    )
}


/**
 * Delete the News Story with given id
 * @param {HTTP Request} req    HTTP request object
 * @param {HTTP Response} res   HTTP response object
 * @param {Number} id           Id of a particuar user story
 */
function deleteNews(req, res, id) {
    if (req.method != "GET")
        error405(req, res)

    let cookies = readCookies(req);

    validateLogin(res, cookies);

    let userName = cookies.userName;
    let role = cookies.role;
    let story = newsService.NewsStories[id]

    if (role != "author" || (story != undefined && story.author != userName))
        error403(res)

    else {
        try {
            newsService.deleteNewsStory(id)
        }
        catch (err) {
            if (err == "Error cannot delete user story with id = " + id) {
                res.writeHead(404, {
                    "Content-Type": "text/html",
                    "Cache-Control": "no-cache, no-store, must-revalidate"
                })
                res.end(
                    `
                    <!DOCTYPE html>
                    <h2>Unable to find story</h2><br/>
                    Click <a href="/news">here</a> to go back.
                    `
                )
            }
            else {
                viewNews(req, res, id, err = "Error cannot delete user story with id = " + id)
            }
        }
        res.writeHead(301, {
            "Content-Type": "text/html",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Location: "/news"
        });
        res.end()
    }
}

/**
 * Logout the user and set the cookies in the browser
 * @param {HTTP Request} req    HTTP request object
 * @param {HTTP Response} res   HTTP response object
 */
function logoutUser(req, res) {
    if (req.method != "GET")
        error405(req, res)

    let cookies = readCookies(req);

    res.writeHead(307, {
        "Content-Type": "text/html",
        "Set-Cookie": ['userName=' + cookies.userName, 'role=' + cookies.role, 'loggedin=false'],
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Location: "/"
    });
    res.end();
}

/**
 * Parse the cookies from the browser and stores it in Javascript object
 * @param {HTTP Request} req    HTTP request object
 */
function readCookies(req) {
    let cookies = {}
    let requestCookies = req.headers.cookie

    if (requestCookies != undefined) {
        requestCookies = requestCookies.split(";");

        for (requestCookie of requestCookies) {
            let cookieDetails = requestCookie.split("=");
            cookies[cookieDetails[0].trim()] = cookieDetails[1]
        }
    }

    return cookies;
}

/**
 * Validates if the user is looged in or not
 * @param {HTTP Response} res   HTTP response object
 * @param {Object} cookies      Javascript object with key value pairs of cookies
 */
function validateLogin(res, cookies) {
    if (!Object.keys(cookies).length || cookies.loggedin == "false") {
        res.writeHead(307, {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Location: "/"
        });
        res.end();
    }
}

/**
 * 404 Error Code (Resource Not found Error Handles)
 * @param {HTTP Response} res   HTTP response object
 */
function error404(res) {
    res.writeHead(404, {
        "Content-Type": "text/html",
        "Cache-Control": "no-cache, no-store, must-revalidate"
    })

    res.end(
        `
            <!DOCTYPE html>
            Error : 404 </br>
            Message : Resource Not Found
        `
    )
}

/**
 * 401 Error Code (Unauthorized Error Handles)
 * @param {HTTP Response} res   HTTP response object
 */
function error401(res) {
    res.writeHead(401, {
        "Content-Type": "text/html",
        "Cache-Control": "no-cache, no-store, must-revalidate"
    })

    res.end(
        `
            <!DOCTYPE html>
            Error : 401 </br>
            Message : Unauthorized </br>
            Click <a href = "/"> here </a> to login.
        `
    )
}

/**
 * 401 Error Code (Unauthorized Error Handles)
 * @param {HTTP Response} res   HTTP response object
 */
function error401InvalidCredentials(res) {
    res.writeHead(401, {
        "Content-Type": "text/html",
        "Cache-Control": "no-cache, no-store, must-revalidate"
    });
    res.end(
        `
            <!DOCTYPE html>
            <h2>Error!! Invalid user name and password combination.</h2><br/>
            Click <a href = "/"> here </a> to login again.
        `
    );
}

/**
 * 405 Error Code (Method Not allowed Error Handles)
 * @param {HTTP Response} res   HTTP response object
 */
function error405(req, res) {
    res.writeHead(405, {
        "Content-Type": "text/html",
        "Cache-Control": "no-cache, no-store, must-revalidate"
    });
    res.end(
        `
            Error : 405 </br>
            Message : ${req.method} is not allowed here
        `
    )
}

/**
 * 403 Error Code (Forbidden Error Handles)
 * @param {HTTP Response} res   HTTP response object
 */
function error403(res) {
    res.writeHead(403, {
        "Content-Type": "text/html",
        "Cache-Control": "no-cache, no-store, must-revalidate"
    })
    res.end(
        `
            Error : 403 </br>
            Message : Forbidden
        `
    )
}