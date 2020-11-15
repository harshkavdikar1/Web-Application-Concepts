How to run the code:
    1. From the root directory run :
        npm install
    2. Run the NewsServiceAPI.js file :
        node NewsServiceAPI.js

Authentication token has been created by concatinating username with current time stamp. Crypto library has been used to hash the concatinated string and create authorization token. 
The token must be passed in the header as a key value pair ({authorization: authorizationToken}) every time while making request.

cURL has been used for writing the test cases. Please see instructins in NewsService_test.txt to execute test cases.

I have used NewsService from my lab2 submission with some modifications.

External Libraries Used:
    1. body-parser
    2. express

EC 1 Not Implemented
EC 2 Implementation (along with regular submission):
    1. The token is stored in localstorage so if a user closes a tab and directly tries to access websites he will be able to do it if it is within 3 min time frame.
    2. Each news detailed info is stored in sessionStorage to reduce the number of calls to the server therefore this will not work if we are just clicking on the news
        title to read the whole news story but apart from that it will work for every other functionality.

API Endpoints:
    endpoint: /login
        Method: POST
        body payload:
            {
                username: username
                password: password
            }
        response code:
            1. 200 OK
                response payload: {"Message": "Login Successful", "authorization": authorizationToken, "success": true}

    endpoint: /create
        Method: POST
        body payload:
            {
                author: authorName,
                date: publishingdate,
                publicFlag: publicFlag (public/private),
                storyContent: storyContent,
                title: title
            }
        response code:
            1. 201 Successfully created
                response payload: {"Message":"News Story Created Successfully","id": NewsStoryId,"success":true}
            2. 400 Bad Request: 
                response payload: {"Message": "Bad Request", "Error": 400, "success": false}
    
    endpoint: /delete/<newsStoryId>
        Method: DELETE
            response code:
            1. 200 OK
                response payload: {"Message": "NewsStory with Id: newsStoryId has been successfully deleted", "Id": newsStoryId, "success": true}
            2. 404 Not Found
                response payload: {"Message": "Resource Not Found", "Error": 404, "success": false}

    
    endpoint: /editTitle/<newsStoryId>
        Method: PATCH
        body payload:
            {
                author: authorName
                title: title
            }
        response code:
            1. 200 OK
                response payload: {"Message": "NewsStory with Id: newsStoryId has been successfully updated", "Id": newsStoryId, "success": true}
            2. 400 Bad Request: 
                response payload: {"Message": "Bad Request", "Error": 400, "success": false}
            3. 403 Forbidden:
                response payload: {"Message": "Forbidden", "Error": 403, "success": false}
            4. 404 Not Found
                response payload: {"Message": "Resource Not Found", "Error": 404, "success": false}

    
    endpoint: /editContent/<newsStoryId>
        Method: PATCH
        body payload:
            {
                author: authorName, 
                storyContent: storyContent
            }
        response code:
            1. 200 OK
                response payload: {"Message": "NewsStory with Id: newsStoryId has been successfully updated", "Id": newsStoryId, "success": true}
            2. 400 Bad Request: 
                response payload: {"Message": "Bad Request", "Error": 400, "success": false}
            3. 403 Forbidden:
                response payload: {"Message": "Forbidden", "Error": 403, "success": false}
            4. 404 Not Found
                response payload: {"Message": "Resource Not Found", "Error": 404, "success": false}
    
    endpoint: /search?author=<author>&title=<title>&startDate=<stardDate&endDate<endDate>
        Method: GET
        response code:
            1. 200 OK
                response payload: {"Message": "NewsStory with Id: newsStoryId has been successfully updated", "Id": newsStoryId, "success": true}
    
    endpoint: /logout
        Method: GET
        response code:
            1. 200 OK
                response payload: {"Message": "Logged out", "success": true}
    
    Common response code for all the requests:
        1. 401 Unauthorized
            response payload: {
                "Message": "Unauthorized",
                "Error": 401,
                "success": false
            }
        
        2. 405 Method Not Allowed
            response payload: {
                "Message": "Method not allowed",
                "Error": 405,
                "success": false
            }
        
        3. 500 Server Error
            response payload: {
                "Message": "Internal Server Error",
                "Error": 500,
                "success": false
            }
