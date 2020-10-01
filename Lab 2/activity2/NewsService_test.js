const db = require('./NewsService');

var newsService = new db.NewsService();

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
try {
    newsService.deleteNewsStory(3);
}
catch (err) {
    console.log(err)
}


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