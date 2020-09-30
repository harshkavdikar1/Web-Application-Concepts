function NewsStory(id, author, title, publicFlag, storyContent, date) {
    this.id = id;
    this.author = author;
    this.title = title;
    this.publicFlag = publicFlag;
    this.storyContent = storyContent;
    this.date = new Date(date);

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
            throw "Server Error"
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
            throw "Server Error"
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
            throw "Server Error"
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

module.exports = {NewsService};