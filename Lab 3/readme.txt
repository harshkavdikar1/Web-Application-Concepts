Important :
    1. For functionality of back button to work after submitting the survey please disable cache from network tab in browser's developer options otherwise it would throw an browser error of cannot submit form.
    2. Delete all the cookies before starting application

Username constraint have been implemented in HTML5

Modules Needed:
    1. express
    2. body-parser
    3. cookie-parser
    4. express-session
    5. sqlite3
    6. ejs
	7. pug

Persistent Storage Used: Embeded SQLite

How to run the code:
    Step 1: install the dependencies
        npm install
    Step 2: Create a folder named db if it does not exist
    Step 3: Migrate the database, Inside model.js uncomment the initializeDB() line and run the model.db code. This will create the Tabel in the database
        node model.js
    Step 4: Run main.js
        node main.js tempalateName
		where tempalateName can be ejs or pug, if parameter not passed it would render using ejs by default

