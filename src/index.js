var choices = ["rock", "paper", "scissors", "lizard", "spock"];

//Arrays to determine which strings beat which string
var beatsrock = ["paper", "spock"];
var beatspaper = ["scissors", "lizard"];
var beatsscissors = ["rock", "spock"];
var beatslizard = ["scissors", "rock"];
var beatsspock = ["lizard", "paper"];

//5 images to cycle
var imgChoices = ["url(../assets/rock.png)", "url(../assets/paper.png)", "../url(assets/scissors.png)", "url(../assets/lizard.png)", "url(../assets/spock.png)",];

//fun descriptions
var rockAndRock = "Rocks can't hurt rocks! :|";
var rockAndPaper = "Your rock got covered by paper :(";
var rockAndScissors = "Your rock crushed scissors :)";
var rockAndLizard = "Your rock crushed lizard :)";
var rockAndSpock = "Your rock was vaporized by spock :(";
var paperAndRock = "Your paper covered rock :)";
var paperAndPaper = "Paper can't hurt paper! :|";
var paperAndScissors = "Your paper was cut by scissors :(";
var paperAndLizard = "Your paper was eaten by lizard :(";
var paperAndSpock = "Your paper disproved spock :)";
var scissorsAndRock = "Your scissors got crushed by rock :(";
var scissorsAndPaper = "Your scissors cut paper :)";
var scissorsAndScissors = "Scissors can't hurt scissors! :|";
var scissorsAndLizard = "Your scissors decapitated lizard :)";
var scissorsAndSpock = "Your scissors were smashed by spock :(";
var lizardAndRock = "Your lizard was crushed by rock :(";
var lizardAndPaper = "Your lizard ate the paper :)";
var lizardAndScissors = "Your lizard was decapitated by scissors :(";
var lizardAndLizard = "Lizards can't hurt lizards! :|";
var lizardAndSpock = "Your lizard poisoned spock :)";
var spockAndRock = "Your spock vaporized rock :)";
var spockAndPaper = "Your spock was disproved by paper :(";
var spockAndScissors = "Your spock smashed scissors :)";
var spockAndLizard = "Your spock was poisoned by lizard";
var spockAndSpock = "Spocks can't hurt spocks! :| Live long and prosper";

/*Important variables*/
var winNum = 0;
var winPer = 0;
var loseNum = 0;
var losePer = 0;
var tieNum = 0;
var tiePer = 0;

/*STARTS GAME*/
function gameStart() {
    loadState("Game is starting!", "state2");
    countdown();
}

//Countdown timer from 3 + reset
function countdown() {
    setTimeout(function () { loadNum(2); }, 400);
    setTimeout(function () { loadNum(1); }, 800);
    setTimeout(function () {
        loadNum(0);
        loadState("Choose hand!", "state3");
    }, 1200)
    setTimeout(function () { loadNum(3); }, 1600);
}

function loadNum(num) {
    document.getElementById("timeNum").innerHTML = num;
}

//Calculation
function changePercents() {
    var sum = winNum + loseNum + tieNum;
    if (sum != 0) {
        winPer = Math.round(winNum / sum * 100);
        losePer = Math.round(loseNum / sum * 100);
        tiePer = Math.round(tieNum / sum * 100);
    } else {
        winPer = 0;
        losePer = 0;
        tiePer = 0;
    }
    console.log(winPer);
}

function showPercent() {
    document.getElementById("wins").innerHTML = winPer + "%";
    document.getElementById("loses").innerHTML = losePer + "%";
    document.getElementById("ties").innerHTML = tiePer + "%";
}

//Function to change CPUs hand *Only visually*
function spinHand(slideCount) {
    slideCount++;
    if (slideCount >= 5) {
        slideCount = 0;
    }
    document.getElementById("cpuImg").style.backgroundImage = imgChoices[slideCount];
    setTimeout(function () { spinHand(slideCount); }, 200);
}

//Data handling
function incStoredValue(type) {
    try {
        localStorage.setItem(type, Number(localStorage.getItem(type)) + 1);
        window[type] = Number(localStorage.getItem(type));
    } catch (err) {
        window[type + "Num"] = window[type + "Num"] + 1;
        console.log(window[type + "Num"]);
    }
}

function resetData() {
    try {
        localStorage.clear();
    } catch (err) {
        winNum = 0;
        loseNum = 0;
        tieNum = 0;
    }
    loadData();
    showPercent();
}

function displayData() {
    document.getElementById("wins").innerHTML = winNum;
    document.getElementById("loses").innerHTML = loseNum;
    document.getElementById("ties").innerHTML = tieNum;
}

function loadData() {
    try {
        winNum = Number(localStorage.getItem("win"));
        loseNum = Number(localStorage.getItem("lose"));
        tieNum = Number(localStorage.getItem("tie"));
    } catch (err) {
        console.log("localStorage not supported " + err);
    }
    changePercents();
}

//Updates variables/scores and results
function updateScores(desc, result) {
    document.getElementById("winner").innerHTML = result;
    if (window[desc]) {
        document.getElementById("resultdesc").innerHTML = window[desc];
    }
    loadData();
    displayData();
}

//Finds winner based on choices
function findWinner(choice) {
    var userChoice = choice;
    var cpuChoice = choices[Math.floor(Math.random() * choices.length)];
    var newCpu = cpuChoice.charAt(0).toUpperCase() + cpuChoice.slice(1);
    var color;
    if (userChoice != cpuChoice) {
        var loseOp = "beats" + userChoice;
        if (cpuChoice == window[loseOp][0] || cpuChoice == window[loseOp][1]) {
            result = "You lost...";
            incStoredValue("lose");
            color = "#D54040";
        } else {
            result = "You won!";
            incStoredValue("win");
            color = "#55AA55";
        }
    } else {
        result = "It's a tie!";
        incStoredValue("tie");
        color = "#00A085";
    }
    description = userChoice + "And" + newCpu;
    document.getElementById("winner").style.color = color;
    loadState("Game results!", "state4");
    updateScores(description, result);
}

//Loads states of the website
function loadState(stringVal, stateVal) {
    a = document.getElementsByTagName("section");
    for (i = 0; i < a.length; i++) {
        a[i].style.display = "none";
    }
    document.getElementById(stateVal).style.display = "inline-block";
    document.title = "RPSLS - " + stringVal;
}

//Listeners
window.onload = function () {
    document.getElementById("startGameButton").addEventListener("click", gameStart);
    document.getElementById("headerHover").addEventListener("mouseover", showPercent);
    document.getElementById("headerHover").addEventListener("mouseleave", function () { loadData(); displayData() });
    document.getElementById("startStateOne").addEventListener("click", function () { loadState("Ready to begin?", "state1"); });
    document.getElementById("startRules").addEventListener("click", function () { loadState("Rules", "rules"); });
    document.getElementById("cancelbutton").addEventListener("click", function () { loadState("Welcome", "state0"); });
    document.getElementById("cancelbutton2").addEventListener("click", function () { loadState("Welcome", "state0"); });
    document.getElementById("rockButton").addEventListener("click", function () { findWinner("rock"); });
    document.getElementById("paperButton").addEventListener("click", function () { findWinner("paper"); });
    document.getElementById("scissorsButton").addEventListener("click", function () { findWinner("scissors"); });
    document.getElementById("lizardButton").addEventListener("click", function () { findWinner("lizard"); });
    document.getElementById("spockButton").addEventListener("click", function () { findWinner("spock"); });
    document.getElementById("optionButton1").addEventListener("click", gameStart);
    document.getElementById("optionButton2").addEventListener("click", function () { loadState("Welcome", "state0"); });
    document.getElementById("resetButton").addEventListener("click", resetData);
    loadData();
    displayData();
    spinHand(0);
}