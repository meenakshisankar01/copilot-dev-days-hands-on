// Tests use Node's built-in test runner, so nothing needs to be installed.
// Run them with:  npm test
const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  createQuiz,
  answerQuestion,
  advanceQuestion,
  isQuizFinished,
  shuffle,
  isCorrect,
  calculatePercentage,
  isNewBestScore,
  formatTimeLeft,
  getFeedbackMessage,
  getGrade,
} = require("../src/quiz.js");

test("createQuiz creates a fresh initial state and copies the questions array", () => {
  const questions = [{ answer: 1 }];
  const state = createQuiz(questions);

  assert.deepEqual(state, {
    questions,
    current: 0,
    score: 0,
    answered: false,
  });
  assert.notEqual(state.questions, questions);
});

test("answerQuestion returns a correct updated state without mutating the input", () => {
  const state = createQuiz([{ answer: 1 }]);
  const result = answerQuestion(state, 1);

  assert.deepEqual(result, {
    state: { ...state, score: 1, answered: true },
    correct: true,
  });
  assert.deepEqual(state, {
    questions: [{ answer: 1 }],
    current: 0,
    score: 0,
    answered: false,
  });
});

test("answerQuestion marks an incorrect answer without increasing the score", () => {
  const state = createQuiz([{ answer: 1 }]);
  const result = answerQuestion(state, 0);

  assert.equal(result.correct, false);
  assert.equal(result.state.score, 0);
  assert.equal(result.state.answered, true);
  assert.equal(state.answered, false);
});

test("advanceQuestion returns a new unanswered state at the next index", () => {
  const state = { ...createQuiz([{ answer: 0 }, { answer: 1 }]), answered: true };
  const nextState = advanceQuestion(state);

  assert.deepEqual(nextState, { ...state, current: 1, answered: false });
  assert.equal(state.current, 0);
  assert.equal(state.answered, true);
});

test("isQuizFinished reports whether all questions have been passed", () => {
  const state = createQuiz([{ answer: 0 }]);

  assert.equal(isQuizFinished(state), false);
  assert.equal(isQuizFinished(advanceQuestion(state)), true);
});

test("isCorrect returns true for the right answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 2), true);
});

test("isCorrect returns false for a wrong answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 0), false);
});

test("calculatePercentage rounds to a whole number", () => {
  assert.equal(calculatePercentage(2, 3), 67);
});

test("calculatePercentage returns 0 when there are no questions", () => {
  assert.equal(calculatePercentage(0, 0), 0);
});

test("isNewBestScore treats the first completed score as a new best", () => {
  assert.equal(isNewBestScore(0, null), true);
});

test("isNewBestScore returns true for a higher score", () => {
  assert.equal(isNewBestScore(81, 80), true);
});

test("isNewBestScore returns false for a tied score", () => {
  assert.equal(isNewBestScore(80, 80), false);
});

test("isNewBestScore returns false for a lower score", () => {
  assert.equal(isNewBestScore(79, 80), false);
});

test("formatTimeLeft displays the remaining seconds", () => {
  assert.equal(formatTimeLeft(12), "⏱ 12s");
});

test("formatTimeLeft displays zero seconds", () => {
  assert.equal(formatTimeLeft(0), "⏱ 0s");
});

test("getFeedbackMessage returns feedback for correct and incorrect answers", () => {
  assert.equal(getFeedbackMessage(true), "Correct!");
  assert.equal(getFeedbackMessage(false), "Not quite. The correct answer is highlighted.");
});

test("getFeedbackMessage returns timeout feedback", () => {
  assert.equal(getFeedbackMessage(false, true), "Time's up!");
});

test("shuffle keeps every item and does not change the original array", () => {
  const original = [1, 2, 3, 4, 5];
  const result = shuffle(original);
  assert.deepEqual([...result].sort(), [1, 2, 3, 4, 5]);
  assert.deepEqual(original, [1, 2, 3, 4, 5]);
});

test("getGrade gives an A for exactly 90%", () => {
  assert.equal(getGrade(90), "A");
});

test("getGrade gives a B for exactly 75%", () => {
  assert.equal(getGrade(75), "B");
});

test("getGrade gives a C for exactly 50%", () => {
  assert.equal(getGrade(50), "C");
});
