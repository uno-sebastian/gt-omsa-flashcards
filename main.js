// Global Functions
const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
// getting the DOM elements 
// Card Elements
let card = document.querySelector(".card")
let question = document.querySelector(".question");
let solution = document.querySelector(".solution");
// Buttons
let checkAnswerBUTTON = document.querySelector(".check_answer");
let newWordBUTTON = document.querySelector(".new_word");
let correctBUTTON = document.querySelector(".correct");
let wrongBUTTON = document.querySelector(".wrong");
let reloadBUTTON = document.querySelector(".reload");
let returnBUTTON = document.querySelector(".return");
// Text below the Cards
let remainingCards = document.querySelector(".remaining");
let knownCards = document.querySelector("#known");
let nextCards = document.querySelector("#next");
let deckOptions = document.querySelector("#decks");
// Variables
let currentDeck = undefined;
let shuffledCardsIndex = undefined;
let knownCardsCounter = 0;
let finishedRounds = 0;
// Setup
for (var i = 0; i <= questionSets.length; i++) {
    if (questionSets[i] == undefined) continue;
    var opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = questionSets[i]['name'];
    deckOptions.appendChild(opt);
}
function loadDeck(deck) {
    shuffledCardsIndex = shuffleArray([...Array(deck.length).keys()]);
    knownCardsCounter = 0;
    updateScores();
    loadCard(shuffledCardsIndex[0]);
}
function loadSelectedDeck(index) {
    currentDeck = questionSets[index]["data"];
    loadDeck(currentDeck);
}
function loadCard(index) {
    currentCard = currentDeck[index];
    // remove the first element
    card.classList.remove("flipped");
    //
    var front_text = currentCard["Front"];
    var back_text = currentCard["Back"];
    // format new lines with break tag
    front_text = front_text.split("\n").join("<br>");
    back_text = back_text.split("\n").join("<br>");
    // write 
    question.innerHTML = front_text;
    solution.innerHTML = back_text;
}
async function finishDeck() {
    question.innerHTML = "You Finished!";
    finishedRounds++;
    updateScores();
    await sleepNow(1000);
    loadDeck(currentDeck);
    checkAnswerBUTTON.classList.remove('hidden');
}
async function answerCard(answeredCorrect) {
    checkAnswerBUTTON.classList.add('hidden');
    question.innerHTML = '';
    card.classList.remove("flipped");
    await sleepNow(500);
    if (answeredCorrect) {
        if (shuffledCardsIndex.length < 2 && currentDeck.length > 0) {
            finishDeck();
        }
        else {
            checkAnswerBUTTON.classList.remove('hidden');
            knownCardsCounter++;
            shuffledCardsIndex.shift();
            loadCard(shuffledCardsIndex[0]);
            updateScores();
        }
    }
    else {
        checkAnswerBUTTON.classList.remove('hidden');
        shuffledCardsIndex = shuffleArray(shuffledCardsIndex)
        loadCard(shuffledCardsIndex[0]);
    }
}
// Append Functionality
// keep track of current deck-index (cardDeckOptions / questionSets)
// load the deck the user selects from the options-drop-down
deckOptions.addEventListener("change", function () { loadSelectedDeck(this.value); });
reloadBUTTON.addEventListener("click", () => loadDeck(currentDeck));
// flip Answer-Card back to Question
returnBUTTON.addEventListener("click", () => card.classList.remove("flipped"));
checkAnswerBUTTON.addEventListener("click", () => card.classList.add("flipped"));
correctBUTTON.addEventListener("click", () => answerCard(true));
wrongBUTTON.addEventListener("click", () => answerCard(false));


// function resetFrontStyle() {
//     let front = document.querySelector(".front");
//     front.classList = ["front"];
// }

// function resetBackStyle() {
//     let back = document.querySelector(".back");
//     back.classList = ["back"];
// }

// function addBackStyle(style) {
//     let back = document.querySelector(".back");
//     back.classList.add(style);
// }




// // ask your user before leaving the page if they really want to
// window.addEventListener("beforeunload", (e) => {
//     e.preventDefault();
//     e.returnValue = "";
// });
// UI
function updateScores() {
    // display current stack of cards
    remainingCards.innerHTML = `Remaining: ${shuffledCardsIndex.length}`
    knownCards.innerHTML = `Correct: ${knownCardsCounter}`;
    nextCards.innerHTML = `Finished: ${finishedRounds}`;
}


// reload the page / begin from the beginning
reloadBUTTON.addEventListener("click", () => loadDeck(currentDeck));



loadSelectedDeck(0);






























// // removes current randomPair of question Answer from global questionSet-Array of objects
// function removeCardFromSet(correct) {
//     let idx = currentDeck.findIndex(qa => qa["Front"] == randomPair["Front"]);
//     let card = currentDeck[idx];
//     if (correct) {
//         currentDeck.splice(idx, 1);
//         knownCardsCounter += 1;
//     } else {
//         nextRound.push(card);
//         currentDeck.splice(idx, 1);
//     }
//     displayCounts();
//     if (currentDeck.length > 0 || nextRound.length > 0) {
//         newCard();
//     }
//     else {
//         resetBackStyle();
//         addBackStyle("finished");
//         wrongBUTTON.classList.add("hidden");
//         correctBUTTON.classList.add("hidden");
//         returnBUTTON.classList.add("hidden");
//         solution.innerHTML = "Card set finished!";
//     }
// }



// // attache newWord-function to button on backside of card
// newWordBUTTON.addEventListener("click", () => {
//     let answer = document.querySelector(".answer");
//     answer = answer.value;
//     removeCardFromSet(answer == randomPair["Back"]);
// });
// // attache functionality "newCard" to wrong-button
// wrongBUTTON.addEventListener("click", () => {
//     removeCardFromSet(false);
// });
// correctBUTTON.addEventListener("click", () => {
//     removeCardFromSet(true);
// });
