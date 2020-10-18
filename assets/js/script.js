const TIME_LIMIT = 30;
var  mainEl = document.querySelector('main');

var answerChoicesEl;
var startQuizButtonEl;
var timerEl;
var previousResult;

var timer;
var time = 0;
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
        question: 'A very usefule tool used during development and debugging for printing content to the debugger is:',
        answerChoices: [
            {answer: 'JavaScript', correct: false}, 
            {answer: 'terminal/bash', correct: false}, 
            {answer: 'for loops', correct: false}, 
            {answer: 'console.log', correct: true}
        ]
    }
]

//generateStartPage();

function startQuiz(){
    startClock();
    displayAssessment(problemIndex);
}

function displayAssessment(problemIndex){    
    if(time != 0 && !quitQuiz && problemIndex < problemArray.length){
        let problem = problemArray[problemIndex];
        generateProblemHTML(problem);
    } else{

    }
}

function clearMain(){
    while(mainEl.firstChild){
        mainEl.removeChild(mainEl.firstChild);
    }
}

function endQuiz(){
    quitQuiz = true;
    console.log('stop button clicked');
}

function startClock(){
    time = TIME_LIMIT;
    timer = setInterval(decrement, 1000);
}

function decrement(){
    if (time !== 0){
        time--;
    } else {
        clearInterval(timer);
        generateStartPage();
    }

    console.log(time);
    timerEl.textContent = time;
}

function checkAnswer(event){
    let isCorrect = (event.target.getAttribute('data-answer-correct') === 'true');
    if(isCorrect){
        previousResult = 'Correct!';
    }else {
        previousResult = 'Wrong!'
        time-=10
    }
    displayAssessment(++problemIndex);
}

/* ********************** HTML GENERATORS ********************** */
/* Start Page Generator */
function generateStartPage(){
    clearMain();

    let headingDivEl = generateHeadingDivEl();
    let paragraphDivEl = generateParagraphDivEl();
    let startButtonDivEl = generateStartButtonDivEl();

    mainEl.appendChild(headingDivEl);
    mainEl.appendChild(paragraphDivEl);
    mainEl.appendChild(startButtonDivEl);

    startQuizButtonEl = document.getElementById('start-quiz');
    timerEl = document.getElementById('timer');

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
        console.dir(buttonEl);
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