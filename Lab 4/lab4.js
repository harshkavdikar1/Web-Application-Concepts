const rooms = ["Kitchen", "Ballroom", "Conservatory", "Billiard Room", "Library", "Study", "Hall", "Lounge", "Dining Room"]
const suspects = ["Mrs. Peacock", "Mrs. Green", "Miss Scarlet", "Colonel Mustard", "Professor Plum", "Mrs. White"]
const weapons = ["Pistol", "Knife", "Wrench", "Lead Pipe", "Candlestick", "Rope"]

var moves = []

var answerMurderer = "";
var answerRoom = "";
var answerWeapon = "";

var userCards = { rooms: [], weapons: [], suspects: [] }
var computerCards = { rooms: [], weapons: [], suspects: [] }

if (!localStorage.wins)
    localStorage.wins = 0

if (!localStorage.loss)
    localStorage.loss = 0

if (!localStorage.history)
    localStorage.history = ""

function displayConstants() {
    let constants = document.getElementById("constants");

    constants.innerHTML = "Rooms: " + rooms.join(", ") + "</br>" +
        "Guests: " + suspects.join(", ") + "</br>" +
        "Weapons: " + weapons.join(", ") + "</br>"

    renderChoices(rooms, suspects, weapons);

    document.getElementById("guess").disabled = true;
}

function renderChoices(rooms, suspects, weapons) {
    let guessRooms = document.getElementById("rooms");
    guessRooms.innerHTML = ""
    for (i in rooms)
        guessRooms.appendChild(createOptionsElement(rooms[i]));

    let guessSuspects = document.getElementById("suspects");
    guessSuspects.innerHTML = ""
    for (i in suspects)
        guessSuspects.appendChild(createOptionsElement(suspects[i]));

    let guessWeapons = document.getElementById("weapons");
    guessWeapons.innerHTML = ""
    for (i in weapons)
        guessWeapons.appendChild(createOptionsElement(weapons[i]));
}

function createOptionsElement(childValue) {
    let option = document.createElement('option');
    option.appendChild(document.createTextNode(childValue));
    option.value = childValue;
    return option;
}

function startGame() {
    let name = document.getElementById("username").value;

    document.getElementById("guess").disabled = false;
    document.getElementById("historyButton").disabled = false;

    answerMurderer = suspects[Math.floor(Math.random() * suspects.length)];
    answerRoom = rooms[Math.floor(Math.random() * rooms.length)];
    answerWeapon = weapons[Math.floor(Math.random() * weapons.length)];

    var choices = suspects.concat(rooms);
    choices = choices.concat(weapons);

    console.log(choices)

    sessionStorage.history = ""
    sessionStorage.name = name


    let i = 0
    let size = choices.length

    while (i < size / 2) {
        let card = Math.floor(Math.random() * choices.length);
        card = choices.splice(card, 1)[0];

        if (card == answerMurderer || card == answerRoom || card == answerWeapon) {
            choices.push(card);
            continue;
        }
        i++;
        if (rooms.includes(card)) {
            computerCards.rooms.push(card)
        }

        if (weapons.includes(card)) {
            computerCards.weapons.push(card)
        }

        if (suspects.includes(card)) {
            computerCards.suspects.push(card)
        }
    }

    console.log(choices)

    for (c in choices) {
        card = choices[c];

        if (card == answerMurderer || card == answerRoom || card == answerWeapon) {
            continue;
        }

        if (rooms.includes(card)) {
            userCards.rooms.push(card)
        }

        if (weapons.includes(card)) {
            userCards.weapons.push(card)
        }

        if (suspects.includes(card)) {
            userCards.suspects.push(card)
        }
    }

    console.log("User cards = ", userCards)
    console.log("Computer Cards = ", computerCards)

    let userdetails = document.getElementById("userdetails");
    userdetails.innerHTML = "Welcome " + name + ", you hold the cards for " +
        userCards.rooms.join(", ") + ", " +
        userCards.suspects.join(", ") + ", " +
        userCards.weapons.join(", ");

    computerCards.rooms.push(answerRoom);
    computerCards.suspects.push(answerMurderer);
    computerCards.weapons.push(answerWeapon);
    renderChoices(computerCards.rooms, computerCards.suspects, computerCards.weapons)
    computerCards.rooms.pop();
    computerCards.suspects.pop();
    computerCards.weapons.pop();
}

function userGuess() {

    document.getElementById("guess").disabled = true;

    var selectedRoom = document.getElementById("rooms").value
    var selectedSuspect = document.getElementById("suspects").value
    var selectedWeapon = document.getElementById("weapons").value

    let guessDetails = "User selected room = " + selectedRoom +
        ", suspect = " + selectedSuspect +
        " and weapon = " + selectedWeapon;

    sessionStorage.history += guessDetails + "<br>"

    if (selectedRoom != answerRoom) {
        continueGame(selectedRoom);
        return
    }

    if (selectedSuspect != answerMurderer) {
        continueGame(selectedSuspect);
        return;
    }

    if (selectedWeapon != answerWeapon) {
        continueGame(selectedWeapon);
        return;
    }

    let continueG = document.getElementById("continueGame")

    continueG.innerHTML += "That was the correct guess! " + selectedSuspect +
        " did it with the " + selectedWeapon +
        " in the " + selectedRoom + "! <br>"

    let gameInfo = "Computer played against " + sessionStorage.name +
    " on " + (new Date()).toString() +
    " and the game was won by " + sessionStorage.name + " <br>"

    localStorage.history += gameInfo

    localStorage.loss++;

    continueG.innerHTML += "Click to start a new game: <Button onclick='restartGame()'>New Game</Button>"

}


function continueGame(card) {
    let continueG = document.getElementById("continueGame");

    continueG.innerHTML = continueG.innerHTML + "<br> Sorry that was an incorrect guess! The Computer holds the card for " + card + ".<br>"
    continueG.innerHTML += "<div id='continueButton'>Click to continue: <Button onclick='computerGuess()'>Continue </Button></div>"
}

function resetGame(card) {
    document.getElementById("continueButton").remove();
    let continueG = document.getElementById("continueGame");

    continueG.innerHTML = continueG.innerHTML + "The Computer made an incorrect guess! You holds the card for " + card + ".<br>"
    continueG.innerHTML += "Click to continue: <Button onclick='guessAgain()'>Continue </Button>"
}


function computerGuess() {

    userCards.rooms.push(answerRoom)
    let selectedRoom = userCards.rooms[Math.floor(Math.random() * userCards.rooms.length)];
    userCards.rooms.pop()

    userCards.suspects.push(answerMurderer)
    var selectedSuspect = userCards.suspects[Math.floor(Math.random() * userCards.suspects.length)];
    userCards.suspects.pop()

    userCards.weapons.push(answerWeapon)
    var selectedWeapon = userCards.weapons[Math.floor(Math.random() * userCards.weapons.length)];
    userCards.weapons.pop()

    let guessDetails = "Computer selected room = " + selectedRoom +
        ", suspect = " + selectedSuspect +
        " and weapon = " + selectedWeapon;

    sessionStorage.history += guessDetails + "<br>"

    console.log("Guess = ", sessionStorage.history)

    if (selectedRoom != answerRoom) {
        resetGame(selectedRoom);
        return
    }

    if (selectedSuspect != answerMurderer) {
        resetGame(selectedSuspect);
        return;
    }

    if (selectedWeapon != answerWeapon) {
        resetGame(selectedWeapon);
        return;
    }

    let continueG = document.getElementById("continueGame")
    document.getElementById("continueButton").remove();

    continueG.innerHTML += "That was the correct guess! " + selectedSuspect +
        " did it with the " + selectedWeapon +
        " in the " + selectedRoom + "! <br>"

    let gameInfo = "Computer played against " + sessionStorage.name +
    " on " + (new Date()).toString() +
    " and the game was won by Computer <br>"

    localStorage.history += gameInfo

    localStorage.wins++;

    continueG.innerHTML += "Click to start a new game: <Button onclick='restartGame()'>New Game</Button>"
}

function guessAgain() {
    document.getElementById("guess").disabled = false;
    document.getElementById("continueGame").innerHTML = ""
}


function restartGame() {

    sessionStorage.clear();

    answerMurderer = "";
    answerRoom = "";
    answerWeapon = "";

    userCards = { rooms: [], weapons: [], suspects: [] }
    computerCards = { rooms: [], weapons: [], suspects: [] }
}

function showHistory() {
    historyButton = document.getElementById("historyButton")
    historyButton.innerHTML = "Hide History"
    historyButton.setAttribute("onclick", "hideHistory()")

    historyInfo = document.getElementById("history");
    historyInfo.innerHTML = sessionStorage.getItem("history")
}

function hideHistory() {
    historyButton = document.getElementById("historyButton")
    historyButton.innerHTML = "Show History"
    historyButton.setAttribute("onclick", "showHistory()")
    document.getElementById("history").innerHTML = ""
}

function showRecord() {
    recordButton = document.getElementById("recordButton")
    recordButton.innerHTML = "Hide Record"
    recordButton.setAttribute("onclick", "hideRecord()")

    let history = localStorage.history != undefined ? localStorage.history : "";
    recordInfo = document.getElementById("record");
    recordInfo.innerHTML = 'Computer has ' + localStorage.wins + ' wins and ' + localStorage.loss + ' losses <br>' +
        history;
}


function hideRecord() {
    recordButton = document.getElementById("recordButton")
    recordButton.innerHTML = "Show Record"
    recordButton.setAttribute("onclick", "showRecord()")

    document.getElementById("record").innerHTML = "";
}