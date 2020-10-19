const TIME_LIMIT = 75;
const PENALTY = 10;

var  mainEl = document.querySelector('main');
var timerEl = document.getElementById('timer');

var answerChoicesEl;
var startQuizButtonEl;
var inputDivEl;
var previousResult;

var highscores = getHighScores();
var timer;
var time = 0;
var score;
var quitQuiz = false;
var problemIndex = 0;
var problemArray = [
    {
        question: 'Commonly used data types do NOT include: ',
        answerChoices: [
            {answer: 'string', correct: false}, 
            {answer: 'boolean', correct: false}, 
            {answer: 'alert', correct: true}, 
            {answer: 'numbers', correct: false}
        ]
    },
    {
        question: 'The condition in an if / else statement is enclosed with __________.',
        answerChoices: [
            {answer: 'quotes', correct: false}, 
            {answer: 'curly brackets', correct: true}, 
            {answer: 'parenthesis', correct: false}, 
            {answer: 'square brackets', correct: false}
        ]
    },
    {
        question: 'Arrays in JavaScript can be used to store ________.',
        answerChoices: [
            {answer: 'numbers and strings', correct: false}, 
            {answer: 'other arrays', correct: false}, 
            {answer: 'booleans', correct: false}, 
            {answer: 'all of the above', correct: true}
        ]
    },
    {
        question: 'String values must be enclosed within _______ when being assigned to variables.',
        answerChoices: [
            {answer: 'commas', correct: false}, 
            {answer: 'curly brackets', correct: false}, 
            {answer: 'quotes', correct: true}, 
            {answer: 'paranthesis', correct: false}
        ]
    },
    {
        question: 'A very useful tool used during development and debugging for printing content to the debugger is:',
        answerChoices: [
            {answer: 'JavaScript', correct: false}, 
            {answer: 'terminal/bash', correct: false}, 
            {answer: 'for loops', correct: false}, 
            {answer: 'console.log', correct: true}
        ]
    }
]

/* Starting point of application */
generateStartPage();

function getHighScores() {
    return localStorage.getItem('highscores') ? JSON.parse(localStorage.getItem('highscores')) : [];
}

function initializeQuiz(){
    time = 0;
    score = 0;
    problemIndex = 0;
    previousResult = null;
    timerEl.textContent = time;
    clearMain();
}

function startQuiz(){
    startClock();
    displayAssessment(problemIndex);
}

function displayAssessment(problemIndex){    
    if(time > 0 && problemIndex < problemArray.length){
        let problem = problemArray[problemIndex];
        generateProblemHTML(problem);
    } else{
        endQuiz();
    }
}

function clearMain(){
    while(mainEl.firstChild){
        mainEl.removeChild(mainEl.firstChild);
    }
}

function endQuiz(){
    clearInterval(timer);
    generateFeedbackPage();

}

function startClock(){
    time = TIME_LIMIT;
    timer = setInterval(decrement, 1000, 1);
}

function decrement(num){
    if (time > 0){
        time -= num;
        score = time;
        timerEl.textContent = time;
    } else {
        endQuiz();
    }
}

function checkAnswer(event){
    let isCorrect = (event.target.getAttribute('data-answer-correct') === 'true');
    if(isCorrect){
        previousResult = 'Correct!';
    }else {
        previousResult = 'Wrong!'
        decrement(PENALTY);        
    }
    displayAssessment(++problemIndex);
}

function logScore(){
    if(inputDivEl.querySelector('input').value.trim()){
        alert('Please enter initials before clicking submit.');
    } else {
        const newScore = {
            initials: inputDivEl.querySelector('input').value,
            score: score 
         };
    
         highscores.push(newScore);
         highscores.sort(function(a, b){return b.score - a.score});
    
         if(highscores.length >= 4) {
            highscores = highscores.slice(0,3);
         }
    
         localStorage.setItem('highscores', JSON.stringify(highscores));
    
         generateHighscorePage();
    }
}

function clearHighScores(){
    localStorage.clear();
    generateHighscorePage();
}

/* ********************** HTML GENERATORS ********************** */
/* Start Page Generator */
function generateStartPage(){
    initializeQuiz();
    let headingDivEl = generateHeadingDivEl();
    let paragraphDivEl = generateParagraphDivEl();
    let startButtonDivEl = generateStartButtonDivEl();

    mainEl.appendChild(headingDivEl);
    mainEl.appendChild(paragraphDivEl);
    mainEl.appendChild(startButtonDivEl);

    startQuizButtonEl = document.getElementById('start-quiz');

    startQuizButtonEl.addEventListener('click', startQuiz);

}

function generateMainContentDiv(){
    let divEl = document.createElement('div');
    divEl.setAttribute('class', 'main-content');

    return divEl;
}

function generateHeadingDivEl(){
    let headingEl = document.createElement('h1');
    let divEl = generateMainContentDiv();

    headingEl.textContent = 'Coding Quiz Challenge';
    divEl.appendChild(headingEl);

    return divEl;
}

function generateParagraphDivEl() {
    let paragraphEl = document.createElement('p');
    let divEl = generateMainContentDiv();

    paragraphEl.setAttribute('class', 'text-centered');
    paragraphEl.textContent = 'Try to answer the following code-related questions within the time limit. Keep in mind that the incorrect answers will penalize your score/time by ten seconds';
    divEl.appendChild(paragraphEl);

    return divEl;
}

function generateStartButtonDivEl() {
    let buttonEl = document.createElement('button');
    let divEl = generateMainContentDiv();

    buttonEl.setAttribute('id', 'start-quiz');
    buttonEl.textContent = 'Start Quiz';
    divEl.appendChild(buttonEl);

    return divEl;
}


/* Assessment Generator */
function generateProblemHTML(problem){
    let questionEl = generateQuestionEl(problem);
    let answerChoicesEl = generateAnswerChoiceEl(problem);

    clearMain();
    mainEl.appendChild(questionEl);
    mainEl.appendChild(answerChoicesEl);

    if(previousResult){
        mainEl.appendChild(generateHorizonalRowEl())
        mainEl.appendChild(generatePreviousResultEl());
    }
}

function generateQuestionEl(problem){
    let divEl = generateMainContentDiv();
    let questionEl = document.createElement('h1');

    questionEl.textContent = problem.question;
    divEl.appendChild(questionEl)

    return divEl;
}

function generateAnswerChoiceEl(problem){
    let divEl = generateMainContentDiv();
    divEl.setAttribute('class', 'main-content answer-choices');

    for(let index = 0; index < problem.answerChoices.length; index++){
        let buttonEl = document.createElement('button');
        buttonEl.setAttribute('class', 'answer-button');
        buttonEl.setAttribute('data-answer-correct', problem.answerChoices[index].correct)
        buttonEl.textContent = (index + 1) + '. ' + problem.answerChoices[index].answer;
        divEl.appendChild(buttonEl);
    }

    divEl.addEventListener('click', checkAnswer);

    return divEl;
}
function generateHorizonalRowEl(){
    var horizontalDivEl = document.createElement('div');
    horizontalDivEl.setAttribute('class', 'main-content horizontal-row');

    return horizontalDivEl;

}

function generatePreviousResultEl(result){
    var previousDivEl = document.createElement('div');
    var resultDivEl = document.createElement('p');

    previousDivEl.setAttribute('class', 'main-content flex-start');
    resultDivEl.setAttribute('id', 'previous-result');
    resultDivEl.textContent = previousResult;

    previousDivEl.appendChild(resultDivEl);
    return previousDivEl;
}

/* Feedback Generator */
function generateFeedbackPage(){
    var headerDivEl = generateFeedbackHeaderDivEl();
    var paragraphDivEl = generateFeedbackParagraphDivEl();
    var feedbackFormEl = generateFeedbackFormEl();

    clearMain();
    mainEl.appendChild(headerDivEl);
    mainEl.appendChild(paragraphDivEl);
    mainEl.appendChild(feedbackFormEl);
}

function generateFeedbackDivEl(){
    var divEl = document.createElement('div');
    divEl.setAttribute('class', 'result-content');

    return divEl;
}

function generateFeedbackHeaderDivEl(){
    var divEl = generateFeedbackDivEl();
    var headingEl = document.createElement('h1');

    headingEl.textContent = 'All done!';
    divEl.appendChild(headingEl);

    return divEl;
}

function generateFeedbackParagraphDivEl(){
    var divEl = generateFeedbackDivEl();
    var paragraphEl = document.createElement('p');

    paragraphEl.textContent = 'Your final score is: ' + score;
    divEl.appendChild(paragraphEl);
    
    return divEl;
    
}

function generateFeedbackFormDivEl(){
    var divEl = document.createElement('div');
    divEl.classList.add('highscore-submission');

    return divEl;
}

function generateFeedbackFormParagraphDivEl(){
    var divEl = document.createElement('div');
    var paragraphEl = document.createElement('p');

    paragraphEl.textContent = 'Enter initials: ';
    divEl.appendChild(paragraphEl);

    return divEl;
}

function generateFeedbackInputDivEl(){
    var divEl = document.createElement('div');
    var inputEl = document.createElement('input');

    inputEl.setAttribute('type', 'text');
    divEl.appendChild(inputEl);

    return divEl;
}

function generateFeedbackButtonDivEl(){
    var divEl = document.createElement('div');
    var buttonEl = document.createElement('button');
    var inputEl = inputDivEl.querySelector('input');
    buttonEl.classList.add('submit-button');
    buttonEl.textContent = 'Submit';
    buttonEl.addEventListener('click', logScore);
    divEl.appendChild(buttonEl);

    return divEl;
}

function generateFeedbackFormEl(){
    var divEl = generateFeedbackFormDivEl();
    var paragraphDivEl = generateFeedbackFormParagraphDivEl();
    inputDivEl = generateFeedbackInputDivEl();
    var feedbackButtonDivEl = generateFeedbackButtonDivEl();

    divEl.appendChild(paragraphDivEl);
    divEl.appendChild(inputDivEl);
    divEl.appendChild(feedbackButtonDivEl);

    return divEl;
}

/* Highscores Generator */
function generateHighscorePage(){
    const updatedHighscores =  getHighScores();
    var headingDivEl = generateHighscoreHeadingDivEl();
    var buttonsDivEl = generateHighscoreButtonsDivEl();
    
    clearMain();
    mainEl.appendChild(headingDivEl);
    
    for(let index = 0; index < updatedHighscores.length; index++){
        let paragraphDivEl = generateHighscoreParagraphDivEl(index, updatedHighscores[index]);
        mainEl.appendChild(paragraphDivEl);
    }

    mainEl.appendChild(buttonsDivEl);
}

function generateHighscoreHeadingDivEl(){
    var divEl = document.createElement('div');
    var headingEl = document.createElement('h1');

    headingEl.textContent = 'High scores'
    divEl.classList.add('result-content');
    divEl.appendChild(headingEl);

    return divEl;
}

function generateHighscoreParagraphDivEl(index, highscore){
    var divEl = document.createElement('div');
    var paragraphEl = document.createElement('p');

    paragraphEl.textContent = (index + 1) + '. ' + highscore.initials + ' - ' + highscore.score;

    divEl.classList.add('high-score');
    divEl.appendChild(paragraphEl);

    return divEl;
}

function generateHighscoreButtonsDivEl(){
    var divEl = document.createElement('div');
    var goBackButtonDivEl = generateHighscoreGoBackButtonDivEl();
    var clearButtonDivEl = generateHighscoreClearButtonDivEl();

    divEl.classList.add('result-content');
    divEl.appendChild(goBackButtonDivEl);
    divEl.appendChild(clearButtonDivEl);

    return divEl;
}

function generateHighscoreGoBackButtonDivEl(){
    var divEl = document.createElement('div');
    var buttonEl = document.createElement('button');

    buttonEl.textContent = 'Go back';
    buttonEl.classList.add('submit-button');
    buttonEl.addEventListener('click', generateStartPage);

    divEl.appendChild(buttonEl);

    return divEl;
}

function generateHighscoreClearButtonDivEl(){
    var divEl = document.createElement('div');
    var buttonEl = document.createElement('button');

    buttonEl.textContent = 'Clear high scores';
    buttonEl.classList.add('submit-button');
    buttonEl.addEventListener('click', clearHighScores);

    divEl.appendChild(buttonEl);

    return divEl;
}