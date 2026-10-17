// Core quiz logic.
// This file has NO browser (DOM) code so it can be tested with Node.js.

/**
 * Creates a fresh quiz state from the supplied questions.
 */
function createQuiz(questions) {
  return {
    questions: [...questions],
    current: 0,
    score: 0,
    answered: false,
  };
}

/**
 * Returns an updated quiz state and whether the selected answer is correct.
 */
function answerQuestion(state, selectedIndex) {
  const correct = isCorrect(state.questions[state.current], selectedIndex);
  return {
    state: {
      ...state,
      score: state.score + (correct ? 1 : 0),
      answered: true,
    },
    correct,
  };
}

/**
 * Returns a new state advanced to the next question.
 */
function advanceQuestion(state) {
  return {
    ...state,
    current: state.current + 1,
    answered: false,
  };
}

/**
 * Returns true when the quiz has no remaining questions.
 */
function isQuizFinished(state) {
  return state.current >= state.questions.length;
}

/**
 * Returns a new array with the items in random order.
 * The original array is not changed.
 */
function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Returns true when the selected option is the correct one.
 */
function isCorrect(question, selectedIndex) {
  return question.answer === selectedIndex;
}

/**
 * Converts a score into a whole-number percentage (0-100).
 */
function calculatePercentage(score, total) {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
}

/**
 * Formats the remaining quiz time for display.
 */
function formatTimeLeft(seconds) {
  return `⏱ ${seconds}s`;
}

/**
 * Returns the feedback message for an answer or a timed-out question.
 */
function getFeedbackMessage(answerIsCorrect, timedOut = false) {
  if (timedOut) return "Time's up!";
  return answerIsCorrect ? "Correct!" : "Not quite. The correct answer is highlighted.";
}

/**
 * Turns a percentage into a grade.
 * A = 90% or more, B = 75% or more, C = 50% or more.
 */
function getGrade(percentage) {
  if (percentage >= 90) return "A";
  if (percentage >= 75) return "B";
  if (percentage >= 50) return "C";
  return "Keep practicing";
}

// Lets Node.js tests load this file. Browsers ignore this block.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    createQuiz,
    answerQuestion,
    advanceQuestion,
    isQuizFinished,
    shuffle,
    isCorrect,
    calculatePercentage,
    formatTimeLeft,
    getFeedbackMessage,
    getGrade,
  };
}
