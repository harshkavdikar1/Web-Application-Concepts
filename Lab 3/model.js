const sqlite3 = require('sqlite3').verbose();
var fs = require("fs");

// Read the questions file to render questions to user
exports.readSurvey = async function () {
    return new Promise(function (resolve, reject) {
        fs.readFile("survey.json", "utf-8", function (err, data) {
            if (err) reject(err);
            resolve(JSON.parse(data).questions);
        });
    }).catch(function (err) {
        console.log(err)
    })
}

async function getConnection() {
    return new Promise(function (resolve, reject) {
        var db = new sqlite3.Database('./db/survey.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, function (err) {
            if (err) reject(err);
            else resolve(db)
        });
    }).catch(function (err) {
        console.log(err)
    })
}


async function initializeDB() {
    let db = await getConnection()

    let SQL_CREATE_TABLE_ANSWERS = `
        CREATE TABLE IF NOT EXISTS answers (
            username TEXT NOT NULL,
            questionid TEXT NOT NULL,
            choice TEXT,
            PRIMARY KEY (username, questionid)
        )
    `

    db.run(SQL_CREATE_TABLE_ANSWERS, function (err) {
        if (err)
            throw err
    })

    db.close()
}


async function insertUpdateData(username, questionid, choice) {
    var db = await getConnection()

    let SQL_INSERT_INTO_ANSWERS = `INSERT OR REPLACE INTO answers(username, questionid, choice) VALUES (?, ? , ?)`

    db.run(SQL_INSERT_INTO_ANSWERS, username, questionid, choice, function (err) {
        if (err) {
            console.log(err)
            throw err
        }
        else
            console.log(`Record inserted into table answers for user ${username} and question ${questionid}`)
    })

    db.close()
}

exports.insertRecords = async function (username, questions) {
    for (quesionid in questions) {
        insertUpdateData(username, quesionid, questions[quesionid])
    }
}

exports.fetchMatches = async function (username) {
    return new Promise(async function (resolve, reject) {
        let db = await getConnection()
        let SQL_QUERY_USER_MATCHES = `
            SELECT * FROM (
                SELECT a2.username, count(a2.choice) AS matches
                FROM answers a1
                INNER JOIN answers  a2
                ON a1.username <> a2.username
                AND a1.questionid = a2.questionid
                AND a1.choice = a2.choice
                WHERE a1.username = ?
                GROUP BY a2.username
            )
            WHERE matches > 0
            ORDER BY matches DESC
        `
        db.all(SQL_QUERY_USER_MATCHES, username, function (err, rows) {
            if (err) reject("Read error: " + err.message)
            else resolve(rows)
        })
    })
}

exports.fetchAnswers = async function (username) {
    return new Promise(async function (resolve, reject) {
        let db = await getConnection()
        db.all(`SELECT * FROM answers where username = ?`, username, function (err, rows) {
            if (err) reject("Read error: " + err.message)
            else resolve(rows)
        })
    }).then(function (rows) {
        let answers = {};
        let i = 0;
        let row;
        for (i = 0; i < rows.length; i++) {
            row = rows[i];
            answers[row.questionid] = row.choice;
        }
        return answers
    }).catch(function (err) {
        console.log("Error reading match records")
    })
}

// initializeDB()