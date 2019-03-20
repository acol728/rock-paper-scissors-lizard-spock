//The 5 choices
const CHOICES = ["rock", "paper", "scissor", "lizard", "spock"];
//5 images to cycle through
const IMAGECHOICES = ["url(../assets/rock.png)", "url(../assets/paper.png)", "url(../assets/scissors.png)", "url(../assets/lizard.png)", "url(../assets/spock.png)"];

//fun descriptions for end results
const DESCRIPTIONS = {
    rockAndPaper: "Your rock got covered by paper :(",
    rockAndScissor: "Your rock crushed scissors :)",
    rockAndLizard: "Your rock crushed lizard :)",
    rockAndSpock: "Your rock was vaporized by spock :(",
    paperAndRock: "Your paper covered rock :)",
    paperAndScissor: "Your paper was cut by scissors :(",
    paperAndLizard: "Your paper was eaten by lizard :(",
    paperAndSpock: "Your paper disproved spock :)",
    scissorAndRock: "Your scissors got crushed by rock :(",
    scissorAndPaper: "Your scissors cut paper :)",
    scissorAndLizard: "Your scissors decapitated lizard :)",
    scissorAndSpock: "Your scissors were smashed by spock :(",
    lizardAndRock: "Your lizard was crushed by rock :(",
    lizardAndPaper: "Your lizard ate the paper :)",
    lizardAndScissor: "Your lizard was decapitated by scissors :(",
    lizardAndSpock: "Your lizard poisoned spock :)",
    spockAndRock: "Your spock vaporized rock :)",
    spockAndPaper: "Your spock was disproved by paper :(",
    spockAndScissor: "Your spock smashed scissors :)",
    spockAndLizard: "Your spock was poisoned by lizard :("
}

//Arrays to determine which strings beat which string
const BEATCONDITIONS = {
    beatsrock: ["paper", "spock"],
    beatspaper: ["scissor", "lizard"],
    beatsscissor: ["rock", "spock"],
    beatslizard: ["scissor", "rock"],
    beatsspock: ["lizard", "paper"]
}

/*Important variables*/
let winNum = 0;
let loseNum = 0;
let tieNum = 0;

let state = "homePage";

/*STARTS GAME*/
function gameStart() {
    loadState("Game is starting!", "countdownPage");
    countdown();
}

//Countdown timer from 3 + reset call
function countdown() {
    setTimeout(function () {
        loadNum(2);
    }, 400);
    setTimeout(function () {
        loadNum(1);
    }, 800);
    setTimeout(function () {
        loadNum(0);
        loadState("Choose hand!", "choicePage");
        spinHand([3, 4]);
    }, 1200)
    setTimeout(function () {
        loadNum(3);
    }, 1600);
}

function loadNum(num) {
    document.getElementById("timeNum").innerHTML = num;
}

// Calculates and displays scores as a percentage
function showPercent() {
    const sum = winNum + loseNum + tieNum;
    if (sum != 0) {
        document.getElementById("wins").innerHTML = Math.round(winNum / sum * 100) + "%";
        document.getElementById("loses").innerHTML = Math.round(loseNum / sum * 100) + "%";
        document.getElementById("ties").innerHTML = Math.round(tieNum / sum * 100) + "%";
    } else {
        document.getElementById("wins").innerHTML = 0 + "%";
        document.getElementById("loses").innerHTML = 0 + "%";
        document.getElementById("ties").innerHTML = 0 + "%";
    }
}

function getPercent(number, sum) {
    return Math.round(number / sum)
}

// Function that chooses random (but not of last 3 chosen) image to give the effect of a thinking computer
function spinHand(lastImages) {
    let imageIndex = lastImages[0];
    while (lastImages.includes(imageIndex)) {
        imageIndex = Math.floor(Math.random() * 5);
    }
    document.getElementById("cpuImg").style.backgroundImage = IMAGECHOICES[imageIndex];
    let newImages = lastImages;
    newImages.unshift(imageIndex);
    newImages.pop();
    if (state == "choicePage") {
        setTimeout(function () {
            spinHand(newImages);
        }, 100);
    }
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
}

//Updates variables/scores and results
function updateScores(description, result) {
    document.getElementById("winner").innerHTML = result;
    document.getElementById("resultdesc").innerHTML = description;
    loadData();
    displayData();
}

//Finds winner based on userChoice and random cpuChoice
function findWinner(userChoice) {
    var cpuChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)];
    var newCpu = cpuChoice.charAt(0).toUpperCase() + cpuChoice.slice(1);
    var color;
    var description;
    if (userChoice != cpuChoice) {
        var loseOp = "beats" + userChoice;
        description = DESCRIPTIONS[userChoice + "And" + newCpu];
        if (BEATCONDITIONS[loseOp].includes(cpuChoice)) {
            result = "You lost...";
            incStoredValue("lose");
            color = "#D54040";
        } else {
            result = "You won!";
            incStoredValue("win");
            color = "#55AA55";
        }
    } else {
        description = newCpu + "s can't hurt " + userChoice + "s";
        result = "It's a tie!";
        incStoredValue("tie");
        color = "#00A085";
    }
    document.getElementById("winner").style.color = color;
    loadState("Game results!", "resultPage");
    updateScores(description, result);
}

//Loads states of the website
function loadState(heading, stateVal) {
    a = document.getElementsByTagName("section");
    for (i = 0; i < a.length; i++) {
        a[i].style.display = "none";
    }
    document.getElementById(stateVal).style.display = "inline-block";
    document.title = "RPSLS - " + heading;
    state = stateVal;
}

//Listeners (Not inline with the html buttons so I can pass more complex parameters)
window.onload = function () {
    document.getElementById("startGameButton").addEventListener("click", gameStart);
    document.getElementById("headerHover").addEventListener("mouseover", showPercent);
    document.getElementById("headerHover").addEventListener("mouseleave", function () {
        loadData();
        displayData();
    });
    document.getElementById("startStateOne").addEventListener("click", function () {
        loadState("Ready to begin?", "gameStartPage");
    });
    document.getElementById("startRules").addEventListener("click", function () {
        loadState("Rules", "rulePage");
    });
    document.getElementById("cancelbutton").addEventListener("click", function () {
        loadState("Welcome", "homePage");
    });
    document.getElementById("cancelbutton2").addEventListener("click", function () {
        loadState("Welcome", "homePage");
    });
    document.getElementById("cancelbutton3").addEventListener("click", function () {
        loadState("Welcome", "homePage");
    });
    document.getElementById("rockButton").addEventListener("click", function () {
        findWinner("rock");
    });
    document.getElementById("paperButton").addEventListener("click", function () {
        findWinner("paper");
    });
    document.getElementById("scissorsButton").addEventListener("click", function () {
        findWinner("scissor");
    });
    document.getElementById("lizardButton").addEventListener("click", function () {
        findWinner("lizard");
    });
    document.getElementById("spockButton").addEventListener("click", function () {
        findWinner("spock");
    });
    document.getElementById("optionButton1").addEventListener("click", gameStart);
    document.getElementById("optionButton2").addEventListener("click", function () {
        loadState("Welcome", "homePage");
    });
    document.getElementById("resetButton").addEventListener("click", resetData);
    document.getElementById("statsPageButton").addEventListener("click", function () {
        loadState("Simulations & Statistics", "statsHomePage");
    });
    document.getElementById("existingGameStatsPageButton").addEventListener("click", function () {
        loadState("Existing Game Stats", "existingGameStatsPage");
    });
    document.getElementById("statsPageButton2").addEventListener("click", function () {
        loadState("Simulations & Statistics", "statsHomePage");
    });
    loadData();
    displayData();

    
}