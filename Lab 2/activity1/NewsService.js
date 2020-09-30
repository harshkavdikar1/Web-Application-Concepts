function NewsStory(id, author, title, publicFlag, storyContent, date) {
    this.id = id;
    this.author = author;
    this.title = title;
    this.publicFlag = publicFlag;
    this.storyContent = storyContent;
    this.date = new Date(date);

    // this.toString = function () {
    //     return "Title : " + this.title +
    //         "\nstoryContent : " + this.storyContent +
    //         "\nAuthor : " + this.author +
    //         "\nDate : " + this.date + "\n";
    // }
}


function NewsService() {
    this.id = 0;
    this.NewsStories = {};

    /**
     * Creates the object of type NewsStory and store it into data structure
     * @param  {String} author          author name
     * @param  {String} title           title of news story
     * @param  {String} publicFlag      flag of news story (public/private)
     * @param  {String} storyContent    story content of news story
     * @param  {String} date            published date of news story (date should be of format YYYY-MM-DD)
     */
    this.addNewsStory = function (author, title, publicFlag, storyContent, date) {
        let newsStory = new NewsStory(++this.id, author, title, publicFlag, storyContent, date);
        this.NewsStories[this.id] = newsStory;
    };

    /**
     * Updates the title of the NewsStory whose id is provided
     * @param  {Number} id        News Story Id
     * @param  {String} title     title of news story
     */
    this.updateTitle = function (id, title) {
        try {
            if (id in this.NewsStories == false) {
                throw "Error cannot update title of user story with id = " + id;
            }
            this.NewsStories[id].title = title;
        }
        catch (err) {
            console.log(err);
        }
    };

    /**
     * Updates object of type NewsStory with the specified values
     * @param  {Number} id              News Story Id
     * @param  {String} author          author name
     * @param  {String} title           title of news story
     * @param  {String} publicFlag      flag of news story (public/private)
     * @param  {String} storyContent    story content of news story
     * @param  {String} date            published date of news story
     */
    this.updatestoryContent = function (id, author, title, publicFlag, storyContent, date) {
        try {
            if (id in this.NewsStories == false) {
                throw "Error cannot update user story with id = " + id;
            }
            this.NewsStories[id].author = author;
            this.NewsStories[id].title = title;
            this.NewsStories[id].storyContent = storyContent;
            this.NewsStories[id].date = new Date(date);
            this.NewsStories[id].publicFlag = publicFlag;
        }
        catch (err) {
            console.log(err);
        }
    };

    /**
     * Deletes the object NewsStory whose id is provided
     * @param  {Number} id              News Story Id
     */
    this.deleteNewsStory = function (id) {
        try {
            if (id in this.NewsStories == false) {
                throw "Error cannot delete user story with id = " + id;
            }
            delete this.NewsStories[id];
        }
        catch (err) {
            console.log(err);
        }
    };

    /**
     * Filter out the records based on given parameters.
     * @param  {String} author      author name
     * @param  {String} title       title of news story
     * @param  {String} endDate     title of news story (date should be of format YYYY-MM-DD)
     * @param  {String} startDate   published date of news story (date should be of format YYYY-MM-DD)
     * @return {Array}  stories     The result of the input operation
     */
    this.filterNewsStory = function (title = null, author = null, startDate = null, endDate = null) {
        if (startDate!=null || endDate!=null) {
            startDate = startDate != null ? new Date(startDate) : new Date(1900, 1, 1);
            endDate = endDate != null ? new Date(endDate) : new Date(2999, 1, 1);
        }
        let stories = []

        for (id in this.NewsStories) {
            let newsStory = this.NewsStories[id];
            if (title != null && newsStory.title.indexOf(title) == -1)
                continue;

            if (author != null && newsStory.author !== author)
                continue;

            if (startDate!=null && (startDate > newsStory.date || endDate < newsStory.date))
                continue;

            stories.push(newsStory);
        }
        return stories;
    };
};

var newsService = new NewsService();

// Date should be of format "YYYY-MM-DD"
// Test case 1 Add a story
newsService.addNewsStory("Author1", "dummy title 1", "private", "dummy storyContent 1", "2010-09-18");
newsService.addNewsStory("Author1", "dummy title 2", "public", "dummy storyContent 2", "2012-09-11");
newsService.addNewsStory("Author2", "dummy title 3", "private", "dummy storyContent 3", "2010-09-11");
newsService.addNewsStory("Author2", "dummy title 4", "public", "dummy storyContent 4", "2010-09-11");


// Test case 2 Update Title
newsService.updateTitle(2, "Updated dummy title 2");

// Test case 3 Update storyContent
newsService.updatestoryContent(1, "Author1", "dummy title 1 updated storyContent", "public", "dummy storyContent 1", "2010-09-18");

// Test case 4 Delete a existing story
newsService.deleteNewsStory(3);

// Test case 5 Delete a story that does not exist
newsService.deleteNewsStory(3);

// 1. These are just to prepoluate null values and have a uniform method invocation for filter method.
// 2. Make actual changes in method invocation
// 3. Each method should have 4 paramteres for filter condition in following order
//    title, author, startDate, endDate
var title = null;
var author = null;
var startDate = null;
var endDate = null;

// Test Case 6 No filter should return all the records
console.log(newsService.filterNewsStory(title, author, startDate, endDate));

// Test Case 7 Filter on title only
console.log(newsService.filterNewsStory("title 1", author, startDate, endDate));

// Test Case 8 Filter on author only
console.log(newsService.filterNewsStory(title, "Author1", startDate, endDate));

// Test Case 9 Filter on date only
console.log(newsService.filterNewsStory(null, null, "2010-09-17", "2011-01-01"));

// Test Case 10 Filter on title and author
console.log(newsService.filterNewsStory("title 2", "Author1", startDate, endDate));

// Test Case 11 Filter on all the things
console.log(newsService.filterNewsStory("title 1", "Author1", "2010-09-17", "2011-01-01"));