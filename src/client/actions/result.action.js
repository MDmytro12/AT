const { ipcRenderer } = require('electron');

// constants

const btnBack = document.querySelector('#btn-back');
const btnLogout = document.querySelector('#btn-logout');

let RESULT = {};
let ASSESSMENT = 2;
let TOTAL_QUESTIONS_NUMBER = 0;

// functions

function AssessementState(assess) {
	let colorIndicator = '--red';
	let classIndicator = 'r';

	switch (assess) {
		case 1:
		case 2:
			{
				colorIndicator = '--red';
			}
			break;
		case 3:
			{
				colorIndicator = '--yellow';
				classIndicator = 'y';
			}
			break;
		case 4:
			{
				colorIndicator = '--blue';
				classIndicator = 'b';
			}
			break;
		case 5:
			{
				colorIndicator = '--green';
				classIndicator = 'g';
			}
			break;
	}

	let starHTML = '';
	console.log(assess);

	for (let i = 0; i < parseInt(assess); i++) {
		starHTML += `<i class="fas fa-star animate__animated animate__fadeInDownBig" style="color: var(${colorIndicator})!important"></i>`;
	}

	document.querySelector('.i-c').innerHTML = starHTML;

	document
		.querySelector('.part')
		.setAttribute('style', `color: var(${colorIndicator})`);

	document
		.querySelector('.r-a > span')
		.setAttribute(
			'style',
			`color: var(${colorIndicator}); border-color: var(${colorIndicator});`,
		);

	chageActiveStateElement(document.querySelector('.r-a > span'), false, 'r');
	chageActiveStateElement(document.querySelector('.r-a > span'), false, 'y');
	chageActiveStateElement(document.querySelector('.r-a > span'), false, 'g');
	chageActiveStateElement(document.querySelector('.r-a > span'), false, 'b');

	chageActiveStateElement(
		document.querySelector('.r-a > span'),
		true,
		classIndicator,
	);
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

function drawResult() {
	document.querySelector('.all').innerText = TOTAL_QUESTIONS_NUMBER;
	document.querySelector('.part').innerText = RESULT.correctAnswers;

	RESULT.correctAnswers =
		RESULT.correctAnswers === 0 ? 1 : RESULT.correctAnswers;

	let assessmentIndicator = RESULT.correctAnswers / TOTAL_QUESTIONS_NUMBER;
	let assessHTML = '';

	switch (true) {
		case assessmentIndicator < 0.5:
			{
				assessHTML = 2;
				AssessementState(assessHTML);
			}
			break;
		case assessmentIndicator >= 0.5 && assessmentIndicator < 0.7:
			{
				assessHTML = 3;
				AssessementState(assessHTML);
			}
			break;
		case assessmentIndicator >= 0.7 && assessmentIndicator < 0.9:
			{
				assessHTML = 4;
				AssessementState(assessHTML);
			}
			break;
		case assessmentIndicator >= 0.9:
			{
				assessHTML = 5;
				AssessementState(assessHTML);
			}
			break;
		default:
			break;
	}

	document.querySelector('.r-a > span').innerText = assessHTML;
}

// listeners

btnBack.addEventListener('click', () => {
	ipcRenderer.send('clear-results');
	ipcRenderer.send('module-back');
});

btnLogout.addEventListener('click', () => {
	ipcRenderer.send('clear-results');
	ipcRenderer.send('app-exit');
});

document.addEventListener('DOMContentLoaded', () => {
	ipcRenderer.send('get-result');
	console.log('Loaded');
});

ipcRenderer.on('r-get-result', (e, r) => {
	RESULT = r;
	ipcRenderer.send('get-q-q');
});

ipcRenderer.on('r-g-all-q', (e, result) => {
	TOTAL_QUESTIONS_NUMBER = result.length;
	drawResult();
});
