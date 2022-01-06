const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

// constants

const btnBack = document.querySelector('#btn-back');
const btnLogout = document.querySelector('#btn-logout');
const btnImageViewClose = document.querySelector('.img-view > .btn-close');
const btnNextPartQuestoins = document.querySelector('#btn-next');
const btnPrevPartQuestions = document.querySelector('#btn-prev');
const btnComment = document.querySelector('.q-comm-c');

let ALL_QUESTION = [];
let ALL_QUESTION_BUFFER = [];
let CURRENT_QUESTION_NUMBER = 1;
let CURRENT_20_QUESTIONS = [];
let CURRENT_MODULE_NUMBER = 1;
let CORRECT_QESTION_INDEX = 1;
let IMAGE_VIEW_PATH = '';
let QUESTIONS_PART_COUNT = 0;
let CORRECT_ANSWERS_COUNT = [0];
let ERROR_ANSWERS_COUNT = [0];
let TOTAL_QUESTION_COUTN = 0;

let JOURNAL_ANSWERS = {};

// functions

function getQuestionImages(currentQuestion) {
	let imageDirectory = fs
		.readdirSync(path.resolve(__dirname, '..', 'assets', 'img'))
		.filter((i) => i === 'R' + CURRENT_MODULE_NUMBER);

	let allImages = fs.readdirSync(
		path.resolve(__dirname, '..', 'assets', 'img', imageDirectory[0]),
	);

	return allImages.filter(
		(im) => im.split('.')[0] === `${currentQuestion.moduleNumber}`,
	);
}

function AnswerSuccess() {
	chageActiveStateElement(document.querySelector('.q-t'), false);
	chageActiveStateElement(document.querySelector('.q-n'), false);
	chageActiveStateElement(document.querySelector('#q-b'), false);
	chageActiveStateElement(document.querySelector('#result-se'), true, 'active');
	document.querySelector('#result-se').innerHTML = `
		<i class="fas fa-check-circle"></i>
		<p>Правильна відповідь!</p>
	`;

	if (CURRENT_QUESTION_NUMBER.toString() in JOURNAL_ANSWERS) {
		if (!JOURNAL_ANSWERS[CURRENT_QUESTION_NUMBER + QUESTIONS_PART_COUNT]) {
			CORRECT_ANSWERS_COUNT[CORRECT_ANSWERS_COUNT.length - 1]++;
		}
	} else {
		CORRECT_ANSWERS_COUNT[CORRECT_ANSWERS_COUNT.length - 1]++;
	}

	JOURNAL_ANSWERS[CURRENT_QUESTION_NUMBER + QUESTIONS_PART_COUNT] = 'success';
}

function AnswerError() {
	chageActiveStateElement(document.querySelector('.q-t'), false);
	chageActiveStateElement(document.querySelector('.q-n'), false);
	chageActiveStateElement(document.querySelector('.q-b'), false);
	chageActiveStateElement(document.querySelector('#result-se'), true);
	document.querySelector('#result-se').innerHTML = `
		<i class="fas fa-exclamation-circle" style="color: var(--red);" ></i>
		<p>Не правильна відповідь!</p>
	`;

	if (CURRENT_QUESTION_NUMBER.toString() in JOURNAL_ANSWERS) {
		if (JOURNAL_ANSWERS[CURRENT_QUESTION_NUMBER + QUESTIONS_PART_COUNT]) {
			ERROR_ANSWERS_COUNT[ERROR_ANSWERS_COUNT.length - 1]++;
		}
	} else {
		ERROR_ANSWERS_COUNT[ERROR_ANSWERS_COUNT.length - 1]++;
	}
	JOURNAL_ANSWERS[CURRENT_QUESTION_NUMBER + QUESTIONS_PART_COUNT] = 'error';
}

function AnswerToNormalState() {
	chageActiveStateElement(document.querySelector('.q-t'), true);
	chageActiveStateElement(document.querySelector('.q-n'), true);
	chageActiveStateElement(document.querySelector('#q-b'), true);
	chageActiveStateElement(document.querySelector('#result-se'), false);
}

function GoToNextQuestion() {
	CURRENT_QUESTION_NUMBER++;
	setNextQuestion();
}

function TurnOnImageView() {
	chageActiveStateElement(document.querySelector('.q-c'), false, 'active');
	chageActiveStateElement(document.querySelector('.img-view'), true, 'active');
}

function TirnOffImageView() {
	chageActiveStateElement(document.querySelector('.q-c'), true, 'active');
	chageActiveStateElement(document.querySelector('.img-view'), false, 'active');
}

function setImageListeners() {
	let allImages = document.querySelectorAll('.q-i-i > img ');

	allImages.forEach((img) => {
		img.addEventListener('click', () => {
			IMAGE_VIEW_PATH = img.getAttribute('src');
			document
				.querySelector('.img-view > img')
				.setAttribute('src', IMAGE_VIEW_PATH);
			TurnOnImageView();
		});
	});
}

function setNextQuestion() {
	if (CURRENT_QUESTION_NUMBER === 21) {
		btnNextPartQuestoins.click();
	} else {
		const currentQuestion = CURRENT_20_QUESTIONS[CURRENT_QUESTION_NUMBER - 1];

		ClearCurrentBtn();
		setCurrentBtn();

		document.querySelector('.q-t > p').innerHTML = `
		<span>${currentQuestion.moduleNumber}.</span>
		${currentQuestion.question}
	`;

		if (currentQuestion.isImage) {
			chageActiveStateElement(document.querySelector('.q-i-c'), true, 'active');
			chageActiveStateElement(document.querySelector('.q-a-c'), false, 'one');

			let questionImages = getQuestionImages(currentQuestion);

			let imagesHTML = `
			<div class="q-i-c-t">
				<i class="fas fa-images"></i>
				<p class="">Зображення</p>
			</div>
		`;

			questionImages.forEach((image, index) => {
				imagesHTML += `
				<div class="q-i-i">
					<p>
						<span> <i class="far fa-image"></i></span>
						${index + 1}
					</p>
					<img src="${path.resolve(
						__dirname,
						'..',
						'assets',
						'img',
						`R${CURRENT_MODULE_NUMBER}`,
						image,
					)}" alt="Question image!" />
				</div>
			`;
			});

			document.querySelector('.q-i-c').innerHTML = imagesHTML;

			setImageListeners();
		} else {
			chageActiveStateElement(
				document.querySelector('.q-i-c'),
				false,
				'active',
			);
			chageActiveStateElement(document.querySelector('.q-a-c'), true, 'one');
		}

		let answerHTML = `
		<div class="q-i-c-t">
			<i class="fas fa-question-circle"></i>
			<p>Питання</p>
		</div>
	`;

		Object.keys(JSON.parse(currentQuestion.answers)).forEach((a, index) => {
			answerHTML += `
			<div class="q-a-i" id="${index + 1}">
				<p>
					<span>${index + 1}.</span>
					${JSON.parse(currentQuestion.answers)[a]}
				</p>
			</div>
		`;
		});

		document.querySelector('.q-a-c').innerHTML = answerHTML;

		CORRECT_QESTION_INDEX = parseInt(currentQuestion.correctAnswer);

		SetAnswerListeners();
	}
}

function SetAnswerListeners() {
	document.querySelectorAll('.q-a-i').forEach((answer) => {
		answer.addEventListener('click', () => {
			if (parseInt(answer.id) === CORRECT_QESTION_INDEX) {
				AnswerSuccess();
			} else {
				AnswerError();
			}

			setTimeout(() => {
				if (
					TOTAL_QUESTION_COUTN ===
					CURRENT_QUESTION_NUMBER + QUESTIONS_PART_COUNT
				) {
					finishTest();
				} else {
					setNavigationButtons();
					GoToNextQuestion();
					AnswerToNormalState();
				}
			}, 2000);
		});
	});
}

function getNext20Q() {
	CURRENT_20_QUESTIONS = [];

	const board = ALL_QUESTION.length > 20 ? 20 : ALL_QUESTION.length;

	for (let i = 0; i < board; i++) {
		CURRENT_20_QUESTIONS.push(ALL_QUESTION.pop());
	}
}

function chageActiveStateElement(e, s, classs = 'active') {
	if (s) {
		if (!e.classList.contains(classs)) {
			e.classList.add(classs);
		}
	} else {
		if (e.classList.contains(classs)) {
			e.classList.remove(classs);
		}
	}
}

function setCurrentBtn() {
	document.querySelectorAll('.q-btns-i').forEach((btn) => {
		if (
			btn.id === (CURRENT_QUESTION_NUMBER + QUESTIONS_PART_COUNT).toString()
		) {
			btn.classList.add('current');
		}
	});
}

function ClearCurrentBtn() {
	document
		.querySelectorAll('.q-btns-i')
		.forEach((item) => chageActiveStateElement(item, false, 'current'));
}

function setNavigationButtons() {
	let btnsHTML = '';

	for (let i = 0; i < CURRENT_20_QUESTIONS.length; i++) {
		let aClass = '';

		if ((i + 1 + QUESTIONS_PART_COUNT).toString() in JOURNAL_ANSWERS) {
			aClass = JOURNAL_ANSWERS[i + 1 + QUESTIONS_PART_COUNT];
		}

		btnsHTML += `
			<div class="q-btns-i ${aClass}" id="${i + 1 + QUESTIONS_PART_COUNT}">
				<p>${i + 1 + QUESTIONS_PART_COUNT}</p>
			</div>
		`;
	}

	document.querySelector('.q-btns-c').innerHTML = btnsHTML;

	document.querySelectorAll('.q-btns-i').forEach((btn) => {
		btn.addEventListener('click', () => {
			if (QUESTIONS_PART_COUNT > 0) {
				CURRENT_QUESTION_NUMBER = parseInt(btn.id - QUESTIONS_PART_COUNT);
			} else {
				CURRENT_QUESTION_NUMBER = parseInt(btn.id);
			}

			setNextQuestion();
		});
	});
}

function getPrev20Q() {
	CURRENT_20_QUESTIONS.reverse();

	for (let k = 0; k < CURRENT_20_QUESTIONS.length; k++) {
		ALL_QUESTION.push(CURRENT_20_QUESTIONS[k]);
	}

	CURRENT_20_QUESTIONS = [];

	ALL_QUESTION_BUFFER.forEach((item, index) => {
		if (index >= QUESTIONS_PART_COUNT && index < QUESTIONS_PART_COUNT + 20) {
			CURRENT_20_QUESTIONS.push(item);
		}
	});
}

function finishTest() {
	let correctAnswers = CORRECT_ANSWERS_COUNT.reduce(function (total, value) {
		return total + value;
	}, 0);
	let errorAnswers = ERROR_ANSWERS_COUNT.reduce(function (total, value) {
		return total + value;
	}, 0);
	const testResult = {
		correctAnswers,
		totalAnswers: errorAnswers + correctAnswers,
		moduleNumber: CURRENT_MODULE_NUMBER,
	};
	ipcRenderer.send('set-test-result', testResult);
	ipcRenderer.send('open-result');
}

function ShowComment() {
	chageActiveStateElement(document.querySelector('.q-c'), false);
	chageActiveStateElement(document.querySelector('.comment-c'), true);

	document.querySelector('.comment-c > .c-m > p').innerText = JSON.parse(
		CURRENT_20_QUESTIONS[CURRENT_QUESTION_NUMBER - 1].answers,
	)[CURRENT_20_QUESTIONS[CURRENT_QUESTION_NUMBER - 1].correctAnswer];
}

function HideComment() {
	chageActiveStateElement(document.querySelector('.q-c'), true);
	chageActiveStateElement(document.querySelector('.comment-c'), false);
}
// listeners

btnComment.addEventListener('click', () => {
	ShowComment();

	setTimeout(() => {
		HideComment();
	}, 5000);
});

btnNextPartQuestoins.addEventListener('click', () => {
	if (ALL_QUESTION.length > 0) {
		QUESTIONS_PART_COUNT += 20;
		CURRENT_QUESTION_NUMBER = 1;
		CORRECT_ANSWERS_COUNT.push(0);
		ERROR_ANSWERS_COUNT.push(0);
		getNext20Q();
		setNextQuestion();
		setNavigationButtons();

		ClearCurrentBtn();
		setCurrentBtn();
	} else {
		finishTest();
	}
});

btnPrevPartQuestions.addEventListener('click', () => {
	if (QUESTIONS_PART_COUNT !== 0) {
		QUESTIONS_PART_COUNT -= 20;
		CURRENT_QUESTION_NUMBER = 1;
		CORRECT_ANSWERS_COUNT.pop();
		ERROR_ANSWERS_COUNT.pop();

		getPrev20Q();

		setNextQuestion();
		setNavigationButtons();

		ClearCurrentBtn();
		setCurrentBtn();
	} else {
		ipcRenderer.send('back-test');
	}
});

btnImageViewClose.addEventListener('click', () => {
	TirnOffImageView();
});

btnBack.addEventListener('click', () => {
	ipcRenderer.send('back-test');
});

btnLogout.addEventListener('click', () => {
	ipcRenderer.send('app-exit');
});

document.addEventListener('DOMContentLoaded', () => {
	ipcRenderer.send('g-current-c');
});

ipcRenderer.on('r-g-all-q', (e, questions) => {
	ALL_QUESTION = questions.filter((i) => i);
	ALL_QUESTION_BUFFER = questions.map((i) => i);
	TOTAL_QUESTION_COUTN = questions.length;
	ALL_QUESTION.reverse();
	getNext20Q();
	setNavigationButtons();
	setNextQuestion();
});

ipcRenderer.on('gi-current-category', (e, { moduleNumber }) => {
	CURRENT_MODULE_NUMBER = moduleNumber;
	ipcRenderer.send('g-all-q-by-c-id');
});
