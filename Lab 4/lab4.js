const rooms = ["Kitchen", "Ballroom", "Conservatory", "Billiard Room", "Library", "Study", "Hall", "Lounge", "Dining Room"]
const suspects = ["Mrs. Peacock", "Mrs. Green", "Miss Scarlet", "Colonel Mustard", "Professor Plum", "Mrs. White"]
const weapons = ["Pistol", "Knife", "Wrench", "Lead Pipe", "Candlestick", "Rope"]

function displayConstants() {
    let constants = document.getElementById("constants");
    constants.innerHTML = "Rooms: " + rooms.join(", ") + "</br>" +
        "Guests: " + suspects.join(", ") + "</br>" +
        "Weapons: " + weapons.join(", ") + "</br>"

    renderChoices(rooms, suspects, weapons);

    document.getElementById("guess").disabled = true;
}

function renderChoices(rooms, suspects, weapons){
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
    let userdetails = document.getElementById("userdetails");
    userdetails.innerHTML = "Welcome " + name;
    document.getElementById("guess").disabled = false;
    document.getElementById("showHistory").disabled = false;

    var answerMurderer = suspects[Math.floor(Math.random() * suspects.length)];
    var answerRoom = rooms[Math.floor(Math.random() * rooms.length)];
    var answerWeapon = weapons[Math.floor(Math.random() * weapons.length)];

    var userCards = {rooms: rooms.slice(), weapons: weapons.slice(), suspects: suspects.slice()}
    var computerCards = {rooms: [], weapons: [], suspects: []}

    userCards.suspects.pop(answerMurderer);
    userCards.rooms.pop(answerRoom);
    userCards.weapons.pop(answerWeapon);

    var choices = userCards.suspects.concat(userCards.rooms);
    choices = choices.concat(userCards.weapons);

    for (var i = 0; i < 9; i++) {
        let card = choices[Math.floor(Math.random() * choices.length)];
        choices.pop(card);
        if (userCards.rooms.includes(card)) {
            userCards.rooms.pop(card);
            computerCards.rooms.push(card)
        }
            
        if (userCards.weapons.includes(card)) {
            userCards.weapons.pop(card);
            computerCards.weapons.push(card)
        }
        if (suspects.includes(card)) {
            userCards.suspects.pop(card);
            computerCards.suspects.push(card)
        }   
    }

    // console.log(rooms, weapons, suspects)
    // console.log(userCards)
    // console.log(computerCards)

    renderChoices(userCards.rooms, userCards.suspects, userCards.weapons)
}


function showHistory() {
    historyToggle = document.getElementById("showHistory")
    if (historyToggle == "Show History")
        document.getElementById("showHistory").innerHTML = "Hide History"
    else
        document.getElementById("showHistory").innerHTML = "Show History"
}

function showRecord() {
    console.log("here inside show records")
}

function userGuess() {
    console.log("ikr")
    var selectedRoom = document.getElementById("rooms").value

    if (selectedRoom!=answerRoom)
        continueGame(selectedRoom)

    var selectedSuspect = document.getElementById("suspects").value

    if (selectedSuspect!=answerMurderer)
        continueGame(selectedSuspect)

    var selectedWeapon = document.getElementById("weapons").value

    if (selectedWeapon!=answerWeapon)
        continueGame(selectedWeapon)

    let gameBoard = document.getElementById("gameBoard")

    gameBoard.innerHTML += "That was the correct guess! " + selectedSuspect +
                             " did it with the " + selectedWeapon + 
                             " in the " + selectedRoom + "!"

}


function continueGame(card) {
    let gameBoard = document.getElementById("gameBoard")
    gameBoard.innerHTML += "Sorry that was an incorrect guess! The Computer holds the card for " + card + "."
    gameBoard.innerHTML += "Click to continue: <Button>Continue </Button>" 
}