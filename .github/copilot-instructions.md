# Copilot instructions for this repository

This repository is the starter project for the GitHub Copilot Dev Days workshop. It is a small static web app for a short quiz about Git, GitHub, and Copilot. Keep changes small and aligned with the workshop flow: the app is intentionally simple and designed to be easy to reason about in a single session.

## Build, test, and run

There is no build step or lint configuration in this repo; the app is plain HTML, CSS, and JavaScript served statically.

- Full test suite: `npm test`
- Single test file: `node --test tests/quiz.test.js`
- Single test file: `node --test tests/questions.test.js`
- Run the app locally: `npm start`

`npm start` serves the app from `src/` on `http://localhost:8080` using `npx --yes http-server src -p 8080 -c-1`.

The repository is intentionally set up so workshop exercise steps can be run without installing dependencies beyond Node.js 20+.

## High-level architecture

The project is structured around a simple browser app with a small logic layer that can be tested from Node.js:

- `src/index.html` is the page shell. It loads the question data, quiz logic, and UI wiring in order.
- `src/questions.js` contains the static `QUESTIONS` array. Each question includes a `question`, exactly four `options`, and a zero-based `answer` index.
- `src/quiz.js` holds the reusable quiz logic (`shuffle`, `isCorrect`, `calculatePercentage`, `getGrade`). This file intentionally has no DOM code so it can be tested with Node's built-in test runner.
- `src/app.js` is the browser-only UI layer. It connects the DOM elements in `index.html` to the quiz state and displays the flow: start -> question -> result.
- `src/style.css` contains the styling for the quiz screens.
- `tests/quiz.test.js` verifies the pure logic functions in `quiz.js`.
- `tests/questions.test.js` validates that question data has the expected shape and unique text.

## Key conventions

- Keep logic in `src/quiz.js` pure and free of browser APIs. That makes it easy to validate with `node:test` and keeps behavior deterministic.
- Treat `answer` as a zero-based index into `options`, not a boolean or label.
- Keep `QUESTIONS` valid: each question must have text, exactly four options, and a valid answer index.
- Prefer small, focused changes that match the workshop's intent. This repository is intentionally simple and does not have a larger framework or build pipeline to hide logic.
- The repo notes in README that the project starts with one intentionally failing test for the workshop debugging exercise. Do not treat that as a general bug in the repo; it is part of the exercise flow.

## Notes for future Copilot sessions

- When adding or changing quiz behavior, update the relevant tests in `tests/` to keep the logic and data checks aligned.
- When making UI changes, prefer updating the existing flow in `src/app.js` and keep the script order in `index.html` unchanged.
- Avoid introducing package managers or build tooling unless the task explicitly requires it.
