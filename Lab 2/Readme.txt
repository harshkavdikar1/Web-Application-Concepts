Attention!! Before starting the code:
	Please delete all the cookies from the browser
	Disable cache under network tab from the console otherwise there could be error with logout and other hyperlinks'

How to run the code:
	Activity1: Go inside the activity1 folder and type
		node NewsService_test.js
	
	Activity2: Go inside the activity2 folder and type
		node activity2.js
	
	Extra Credit: Go inside the Extra Credit folder and type
		node activity2.js


Activity 1:
	Date should be of format "YYYY-MM-DD" and it must be string while creating News Story Object
	
	For filter method there are start date and end date to search between the range of date, if only one of them is entered other will be defaulted.
	
	Please follow the comments in the NewsService_test.js file for any other claeifications

	The NewsService file between two activites differ by 2 statements both used to send the error's to parent methods. This could be done without sending errors to parent methods in activity2 but then activity1 won't have sufficient error handlig on its own and activity1 can't be tested sufficiently on its own.

Activity 2:
	Fudge authentication implemented i.e. when name == password
	
	Following four NewsStrories are created at the startup:
		newsService.addNewsStory("Author1", "dummy title 1", "private", "dummy storyContent 1", "2010-09-18");
		newsService.addNewsStory("Author1", "dummy title 2", "public", "dummy storyContent 2", "2012-09-11");
		newsService.addNewsStory("Author2", "dummy title 3", "private", "dummy storyContent 3", "2010-09-11");
		newsService.addNewsStory("Author2", "dummy title 4", "public", "dummy storyContent 4", "2010-09-11");
	
	Three Cookies are used:
		1. userName : To store the username of the user
		2. loggedIn : flag representing whether the user is loggedIn or not
		3. role : Representing with which role has user logged in
		
	Every Field is case sensitive.
	
		EndPoints:
		/  		:
			Method : GET
			Responsibility : Render Home Page
		/login  :
			Method : POST
			Responsibility : Validate User credentials
		/logout :
			Method : GET
			Responsibility : Logout User
		/news :
			Method : GET
			Responsibility : View All news according based on user role
			
			Method : POST
			Responsibility : Create a new News Story in database
		/createnews :
			Method : GET
			Responsibility : Render the web page to create a new news storyContent
		/deletenews/<id> :
			Method : GET
			Responsibility : Delete the news story
			Notes:
				While deleting the story if the id does not exist it will throw 404 error of resource not found and if there was an error while deleting the story it will throw 500 error of Server Error
		/news/<id> :
			Method : GET
			Responsibility : View a particular story


Extra Credit:
	Extra Credit 1 has been implemented using fs module and data is being stored in json format in json file.
	data.json is the name of the file used to store records.
	
	There are no NewStories created at the startup otherwise there would be duplicate records everytime one starts the server. That's how activity2.js differs in extra credit and normal credit.