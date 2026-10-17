// UI code: connects the quiz logic (quiz.js) to the page (index.html).

const QUESTION_TIME_SECONDS = 15;
let state = createQuiz([]);

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
const startBestScoreText = document.getElementById("start-best-score");
const resultBestScoreText = document.getElementById("result-best-score");
const newBestMessage = document.getElementById("new-best-message");
let timerInterval = null;
let secondsLeft = QUESTION_TIME_SECONDS;
const BEST_SCORE_STORAGE_KEY = "devDaysQuizBestScore";
let bestScore = readBestScore();

function readBestScore() {
  try {
    const savedScore = window.localStorage.getItem(BEST_SCORE_STORAGE_KEY);
    if (savedScore === null) return null;

    const parsedScore = Number(savedScore);
    if (
      savedScore.trim() !== ""
      && Number.isInteger(parsedScore)
      && parsedScore >= 0
      && parsedScore <= 100
    ) {
      return parsedScore;
    }

    console.warn("Ignoring invalid saved quiz best score:", savedScore);
    return null;
  } catch (error) {
    console.warn("Unable to read the saved quiz best score:", error);
    return null;
  }
}

function saveBestScore(score) {
  try {
    window.localStorage.setItem(BEST_SCORE_STORAGE_KEY, String(score));
  } catch (error) {
    console.warn("Unable to save the quiz best score:", error);
  }
}

function renderBestScore() {
  const message = bestScore === null
    ? "Personal best: No score yet"
    : `Personal best: ${bestScore}%`;
  startBestScoreText.textContent = message;
  resultBestScoreText.textContent = message;
}

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
  state = createQuiz(shuffle(QUESTIONS));
  showScreen(quizScreen);
  renderQuestion();
}

function renderQuestion() {
  stopTimer();
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
  const result = answerQuestion(state, selectedIndex);
  state = result.state;
  stopTimer();

  const question = state.questions[state.current];
  const buttons = optionsList.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = true));

  if (result.correct) {
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
  state = answerQuestion(state, -1).state;

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
  state = advanceQuestion(state);
  if (!isQuizFinished(state)) {
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  stopTimer();
  const total = state.questions.length;
  const percentage = calculatePercentage(state.score, total);
  const achievedNewBest = isNewBestScore(percentage, bestScore);
  if (achievedNewBest) {
    bestScore = percentage;
    saveBestScore(bestScore);
  }

  scoreText.textContent = `You scored ${state.score} out of ${total} (${percentage}%)`;
  gradeText.textContent = `Grade: ${getGrade(percentage)}`;
  renderBestScore();
  newBestMessage.textContent = achievedNewBest ? "New personal best!" : "";
  showScreen(resultScreen);
}

renderBestScore();
document.getElementById("start-btn").addEventListener("click", startQuiz);
document.getElementById("restart-btn").addEventListener("click", startQuiz);
nextButton.addEventListener("click", nextQuestion);
