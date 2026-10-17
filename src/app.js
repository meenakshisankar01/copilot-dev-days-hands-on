// UI code: connects the quiz logic (quiz.js) to the page (index.html).

const QUESTION_TIME_SECONDS = 15;
const state = { questions: [], current: 0, score: 0, answered: false };

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const progressText = document.getElementById("progress");
const timerText = document.getElementById("timer");
const questionText = document.getElementById("question-text");
const optionsList = document.getElementById("options");
const feedbackText = document.getElementById("feedback");
const nextButton = document.getElementById("next-btn");
const scoreText = document.getElementById("score-text");
const gradeText = document.getElementById("grade-text");
let timerInterval = null;
let secondsLeft = QUESTION_TIME_SECONDS;

function stopTimer() {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateTimer() {
  timerText.textContent = formatTimeLeft(secondsLeft);
  timerText.classList.toggle("urgent", secondsLeft <= 5);
}

function startTimer() {
  stopTimer();
  secondsLeft = QUESTION_TIME_SECONDS;
  updateTimer();
  timerInterval = setInterval(() => {
    secondsLeft--;
    updateTimer();
    if (secondsLeft === 0) {
      stopTimer();
      timeOutQuestion();
    }
  }, 1000);
}

function showScreen(screenToShow) {
  [startScreen, quizScreen, resultScreen].forEach((screen) => {
    screen.hidden = screen !== screenToShow;
  });
}

function startQuiz() {
  stopTimer();
  state.questions = shuffle(QUESTIONS);
  state.current = 0;
  state.score = 0;
  state.answered = false;
  showScreen(quizScreen);
  renderQuestion();
}

function renderQuestion() {
  stopTimer();
  state.answered = false;
  const question = state.questions[state.current];
  progressText.textContent = `Question ${state.current + 1} of ${state.questions.length}`;
  questionText.textContent = question.question;
  feedbackText.textContent = "";
  nextButton.hidden = true;
  optionsList.innerHTML = "";

  question.options.forEach((option, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = option;
    button.addEventListener("click", () => selectAnswer(index, button));
    item.appendChild(button);
    optionsList.appendChild(item);
  });

  startTimer();
}

function selectAnswer(selectedIndex, selectedButton) {
  if (state.answered) return;
  state.answered = true;
  stopTimer();

  const question = state.questions[state.current];
  const buttons = optionsList.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = true));

  if (isCorrect(question, selectedIndex)) {
    state.score++;
    selectedButton.classList.add("correct");
    feedbackText.textContent = getFeedbackMessage(true);
  } else {
    selectedButton.classList.add("wrong");
    buttons[question.answer].classList.add("correct");
    feedbackText.textContent = getFeedbackMessage(false);
  }

  nextButton.hidden = false;
  nextButton.focus();
}

function timeOutQuestion() {
  if (state.answered) return;
  state.answered = true;

  const question = state.questions[state.current];
  const buttons = optionsList.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = true));
  buttons[question.answer].classList.add("correct");
  feedbackText.textContent = getFeedbackMessage(false, true);
  nextButton.hidden = false;
  nextButton.focus();
}

function nextQuestion() {
  stopTimer();
  state.current++;
  if (state.current < state.questions.length) {
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  stopTimer();
  const total = state.questions.length;
  const percentage = calculatePercentage(state.score, total);
  scoreText.textContent = `You scored ${state.score} out of ${total} (${percentage}%)`;
  gradeText.textContent = `Grade: ${getGrade(percentage)}`;
  showScreen(resultScreen);
}

document.getElementById("start-btn").addEventListener("click", startQuiz);
document.getElementById("restart-btn").addEventListener("click", startQuiz);
nextButton.addEventListener("click", nextQuestion);
