The NewsService file between two activites differ by 2 statements both used to send the error's to parent methods. This could be done without sending errors to parent methods in activity2 but then activity1 won't have sufficient error handlig on its own.


Attention!! Before starting the code:
	Pease delete all the cookies from the browser
	Disable cache from the console otherwise there could be error with logout
	
Activity 1:
	Date should be of format "YYYY-MM-DD" and it must be string while creating News Story Object
	For filter method there are start date and end date to search between the range of date, if only one of them is entered other will be defaulted.