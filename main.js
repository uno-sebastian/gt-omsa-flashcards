// load questionSets into scope
const questionSetsJSON = [mr, iuk, im, ik, orga, ar, hgb, v];

// getting the DOM elements 
// Card Elements
let card = document.querySelector(".card")
let question = document.querySelector(".question");
let solution = document.querySelector(".solution");
let inputField = document.querySelector(".answer");
// Buttons
let checkAnswerBUTTON = document.querySelector(".check_answer");
let newWordBUTTON = document.querySelector(".new_word");
let correctBUTTON = document.querySelector(".correct");
let wrongBUTTON = document.querySelector(".wrong");
let reloadBUTTON = document.querySelector(".reload");
let returnBUTTON = document.querySelector(".return");
// card-deck-choice-fields
const cardDeckOptions = [
    "#medien_recht",
    "#kommunikations_fragen",
    "#internationale_fragen",
    "#interkulturelle_fragen",
    "#orga_fragen",
    "#arbeits_recht",
    "#handels_recht",
    "#vokabeln"
];

// Text below the Cards
let remainingCards = document.querySelector(".remaining");

// define question-set
// global questionSet
let questionSet = mr;
// set a questionSet to start with
function defineQuestionSet(set) {
    questionSet = set;
}

cardDeckOptions.forEach((deckID, i) => {
    const deck = document.querySelector(deckID);
    deck.addEventListener("change", () => {
        defineQuestionSet(questionSetsJSON[i]);
        newCard();
    })
});

// flip Answer-Card back to Question
returnBUTTON.addEventListener("click", () => card.classList.remove("flipped"));


// gets a random pair (question/answer) from the a given array of objects
function getQuestionPair(dict) {
    let rand = Math.floor(Math.random() * dict.length);
    return Object.entries(dict)[rand][1];
}

// innitial randomPair on Page-Load
let randomPair = getQuestionPair(questionSet);

// display first question
displayQuestion(randomPair);

// write question on the front of card
function displayQuestion(rP) {
    // get curser into input-field
    if (inputField) inputField.focus(); 
    // remove input field from page if it is not needed (e.g. for rechtFragen)
    if (rP["input"]) {
        inputField.classList.remove("hidden");
        wrongBUTTON.classList.add("hidden");
        correctBUTTON.classList.add("hidden");
    } else {
        inputField.classList.add("hidden");
        wrongBUTTON.classList.remove("hidden");
        correctBUTTON.classList.remove("hidden");
    }
    // turn card to frons-side
    card.classList.remove("flipped");
    // write question on front-side of the card
    question.innerHTML = rP["Frage"];

    // display current stack of cards
    remainingCards.innerHTML = `Es sind noch ${questionSet.length} Karten im Deck`
}

// used inside of "flipBackAndDisplayAnswer" to split multiple answers
function splitPhraseIfSeveralNumbers(phrase) {
    let re = /\d\.\s.+\;/;
    if (re.test(phrase)) {
        phrase = phrase.split(";");
    }
    return phrase;
}

// flip card to back-side and display/render answer(s)
function flipBackAndDisplayAnswer() {
    // display answer on the back of the card
    card.classList.add("flipped");

    // if no input no "nächste Frage"
    if (randomPair["input"]) newWordBUTTON.classList.remove("hidden");
    else newWordBUTTON.classList.add("hidden");

    // create backside of the card
    let answer = document.querySelector(".answer");
    if (randomPair["input"]) {
        answer = answer.value;
        if (answer == randomPair["Antwort"]) solution.innerHTML = "Korrekt!";
        else solution.innerHTML = `Leider nein leider garnischt.<br>Die richtige Antwort wäre <em>"${randomPair["Antwort"]}"</em> gewesen.`;
    } else {
        // create List of possible multiple-answer
        let answerList = splitPhraseIfSeveralNumbers(randomPair["Antwort"]);
        // if it is just one answer display it
        if (typeof answerList == "string") solution.innerHTML = randomPair["Antwort"];
        // if muslitple answers display them as a list
        else {
            solution.innerHTML = "";
            let answerListDOM = document.createElement("ol");
            solution.appendChild(answerListDOM);
            answerList.forEach(a => {
                // check if a number is in front and delete it so the ordered list tag provides numbers;
                let numRegEx = /^\s*\d+\.\s/g;
                a = a.replace(numRegEx, "");
                let listElement = document.createElement("li");
                answerListDOM.appendChild(listElement);
                listElement.innerHTML = a;
            });
        }
    } 

    // clear the input field if there is one for next questions
    let answerInput = document.querySelector(".answer");
    if (answerInput) answerInput.value = "";
}

// get a new card
function newCard() {
    // create new randomPair in global scope
    randomPair = getQuestionPair(questionSet);
    displayQuestion(randomPair);
}

// removes current randomPair of question Answer from global questionSet-Array of objects
function removeCardFromSet() {
    let idx = questionSet.findIndex(qa => qa["Frage"] == randomPair["Frage"]);
    questionSet.splice(idx, 1);
}

// attache the show-result function to the button on frontside of card
checkAnswerBUTTON.addEventListener("click", flipBackAndDisplayAnswer);

// attache newWord-function to button on backside of card
newWordBUTTON.addEventListener("click", newCard);

// attache functionality "newCard" to wrong-button
wrongBUTTON.addEventListener("click", newCard);
correctBUTTON.addEventListener("click", () => {
    removeCardFromSet();
    newCard();
});

// reload the page / begin from the beginning
reloadBUTTON.addEventListener("click", () => location.reload());




