const fs = require("fs");


function NewsStory(id, author, title, publicFlag, storyContent, date) {
    this.id = id;
    this.author = author;
    this.title = title;
    this.publicFlag = publicFlag;
    this.storyContent = storyContent;
    this.date = new Date(date);

}


function NewsService() {
    this.NewsStories = readDataFromStore();
    this.id = getMaxKey(this.NewsStories);

    function readDataFromStore() {
        let stories = {}
        try {
            stories = JSON.parse(fs.readFileSync("data.json", { encoding: 'utf-8' }))
        }
        catch (err) {
            return {}
        }
        return stories;
    }

    function getMaxKey(stories) {
        maxId = 0;
        for (id in stories) {
            maxId = Math.max(maxId, id)
        }
        return maxId
    }

    function writeDataToStore(stories) {
        try {
            fs.writeFileSync("data.json", JSON.stringify(stories), { encoding: 'utf-8' })
        }
        catch (err) {
            throw err;
        }
    }

    /**
     * Creates the object of type NewsStory and store it into data structure
     * @param  {String} author          author name
     * @param  {String} title           title of news story
     * @param  {String} publicFlag      flag of news story (public/private)
     * @param  {String} storyContent    story content of news story
     * @param  {String} date            published date of news story (date should be of format YYYY-MM-DD)
     */
    this.addNewsStory = function (author, title, publicFlag, storyContent, date) {

        if (author == undefined || title == undefined || publicFlag == undefined || storyContent == undefined || date == undefined) {
            throw "error400"
        }

        let newsStory = new NewsStory(++this.id, author, title, publicFlag, storyContent, date);
        this.NewsStories[this.id] = newsStory;
        writeDataToStore(this.NewsStories);
        return this.id;
    };

    /**
     * Updates the title of the NewsStory whose id is provided
     * @param  {Number} id        News Story Id
     * @param  {String} title     title of news story
     */
    this.updateTitle = function (id, author, title) {
        if (author == undefined || title == undefined) {
            throw "error400"
        }

        if (id in this.NewsStories == false) {
            throw "error404"
        }

        if (this.NewsStories[id].author != author) {
            throw "error403"
        }

        this.NewsStories[id].title = title;
        writeDataToStore(this.NewsStories);
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
    this.updateStory = function (id, author, title, publicFlag, storyContent, date) {
        try {
            if (id in this.NewsStories == false) {
                throw "error404"
            }

            if (author == undefined || title == undefined || publicFlag == undefined || storyContent == undefined || date == undefined) {
                throw "error400"
            }

            this.NewsStories[id].author = author;
            this.NewsStories[id].title = title;
            this.NewsStories[id].storyContent = storyContent;
            this.NewsStories[id].date = new Date(date);
            this.NewsStories[id].publicFlag = publicFlag;
            writeDataToStore(this.NewsStories);
        }
        catch (err) {
            throw err;
        }
    };

    /**
     * Updates object of type NewsStory with the specified values
     * @param  {Number} id              News Story Id
     * @param  {String} author          author name
     * @param  {String} storyContent    story content of news story
     */
    this.updatestoryContent = function (id, author, storyContent) {
        if (author == undefined || storyContent == undefined) {
            throw "error400"
        }

        if (id in this.NewsStories == false) {
            throw "error404"
        }

        if (this.NewsStories[id].author != author) {
            throw "error403"
        }

        this.NewsStories[id].storyContent = storyContent;
        writeDataToStore(this.NewsStories);
        }

    /**
     * Deletes the object NewsStory whose id is provided
     * @param  {Number} id              News Story Id
     */
    this.deleteNewsStory = function (id) {
        if (id in this.NewsStories == false) {
            throw "error404";
        }
        try {
            delete this.NewsStories[id];
            writeDataToStore(this.NewsStories);
        }
        catch (err) {
            throw "error500";
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
    this.filterNewsStory = function (author, title, startDate, endDate) {
        if (startDate != undefined || endDate != undefined) {
            startDate = startDate != undefined ? new Date(startDate) : new Date(1900, 1, 1);
            endDate = endDate != undefined ? new Date(endDate) : new Date(2999, 1, 1);
        }
        let stories = []

        for (id in this.NewsStories) {
            let newsStory = this.NewsStories[id];
            if (title != undefined && newsStory.title.indexOf(title) == -1)
                continue;

            if (author != undefined && newsStory.author !== author)
                continue;

            if (startDate != undefined && (startDate > newsStory.date || endDate < newsStory.date))
                continue;

            stories.push(newsStory);
        }
        return stories;
    };
};

module.exports = { NewsService };