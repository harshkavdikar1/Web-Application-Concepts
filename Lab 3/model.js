const sqlite3 = require('sqlite3').verbose();


async function getConnection() {
    return new sqlite3.Database('./db/survey.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) {
            console.error(err.message);
            throw "Database Error"
        }
    });
}


async function initializeDB() {
    var db = await getConnection()

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

async function insertRecords(username, questions) {
    for (quesionid in questions) {
        insertUpdateData(username, quesionid, questions[quesionid])
    }
}

async function fetchMatches(username) {
    var db = await getConnection()

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
        ORDER BY matches DESC
    `

    return new Promise(function(resolve, reject) {
        db.all(SQL_QUERY_USER_MATCHES, username, function(err, rows)  {
            if(err) reject("Read error: " + err.message)
            else {
                resolve(rows)
            }
        })
    })

    // db.all(SQL_QUERY_USER_MATCHES, username, function (err, row) {
    //     if (err) {
    //         console.log(err)
    //         throw err
    //     }
    //     else
    //         return row
    // })

    // db.close()
}

async function fetchAnswers(username) {
    let db = await getConnection()
    return new Promise(function(resolve, reject) {
        db.all(`SELECT * FROM answers where username = ?`, username, function(err, rows)  {
            if(err) reject("Read error: " + err.message)
            else {
                resolve(rows)
            }
        })
    })
}


async function fetchallMatches() {
    var db = await getConnection()

    SQL_QUERY_USER_MATCHES = `
        SELECT * FROM answers
    `

    db.all(SQL_QUERY_USER_MATCHES, function (err, row) {
        if (err) {
            console.log(err)
            throw err
        }
        else
            console.log(row)
    })

    db.close()
}

// fetchallMatches()

exports.fetchMatches = fetchMatches
exports.insertRecords = insertRecords
exports.initializeDB = initializeDB
exports.fetchAnswers = fetchAnswers