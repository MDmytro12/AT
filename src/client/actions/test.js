const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

// constants

const btnBack = document.querySelector('#btn-back');
const btnLogout = document.querySelector('#btn-logout');

let ALL_QUESTION = [];
let CURRENT_QUESTION_NUMBER = null;
let CURRENT_20_QUESTIONS = [];
let CURRENT_MODULE_NUMBER = 1;
let CORRECT_QESTION_INDEX = 1;

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

function setNextQuestion() {
	if (CURRENT_QUESTION_NUMBER === null) {
		CURRENT_QUESTION_NUMBER = 1;
	}

	const currentQuestion = CURRENT_20_QUESTIONS[CURRENT_QUESTION_NUMBER - 1];

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
						`R${CURRENT_QUESTION_NUMBER}`,
						image,
					)}" alt="Question image!" />
				</div>
			`;
		});

		document.querySelector('.q-i-c').innerHTML = imagesHTML;
	} else {
		chageActiveStateElement(document.querySelector('.q-i-c'), false, 'active');
		chageActiveStateElement(document.querySelector('.q-a-c'), false, 'one');
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
}

function setPrevQuestion() {}

function getNext20Q() {
	CURRENT_20_QUESTIONS = [];

	for (let i = 0; i < 20; i++) {
		CURRENT_20_QUESTIONS.push(ALL_QUESTION.pop());
	}
}

function chageActiveStateElement(e, s, classs) {
	if (s) {
		if (!e.classList.contains(classs)) {
			e.classList.add(classs);
		}
	} else {
		if (e.classList.contains(classs)) {
			e.classList.add(classs);
		}
	}
}

// listeners

btnBack.addEventListener('click', () => {
	ipcRenderer.send('back-test');
});

btnLogout.addEventListener('click', () => {
	ipcRenderer.send('app-exit');
});

document.addEventListener('DOMContentLoaded', () => {
	ipcRenderer.send('g-all-q-by-c-id');
	ipcRenderer.send('g-current-c');
	chageActiveStateElement;
});

ipcRenderer.on('r-g-all-q', (e, questions) => {
	ALL_QUESTION = questions;
	ALL_QUESTION.reverse();
	getNext20Q();
	setNextQuestion();
});

ipcRenderer.on('gi-current-category', (e, { moduleNumber }) => {
	CURRENT_MODULE_NUMBER = moduleNumber;
});
