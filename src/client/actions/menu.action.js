const { ipcRenderer } = require('electron');

// constants

const btnLogout = document.querySelector('#btn-logout');
const btnStartTest = document.querySelector('#btn-start-test');
const btnStartExam = document.querySelector('#btn-start-exam');
const btnAboutPro = document.querySelector('#btn-about-pro');
const btnSettings = document.querySelector('#btn-setting');
const btnBack = document.querySelector('#btn-back');
const btnLogin = document.querySelector('#btn-log');

// functions

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

// listeners

btnLogout.addEventListener('click', () => {
	ipcRenderer.send('app-logout');
});

btnStartTest.addEventListener('click', () => {
	ipcRenderer.send('open-module');
});

btnStartExam.addEventListener('click', () => {
	ipcRenderer.send('open-exam');
});

btnAboutPro.addEventListener('click', () => {
	ipcRenderer.send('open-about');
});

btnBack.addEventListener('click', () => {
	chageActiveStateElement(document.querySelector('.btn-c'), true);
	chageActiveStateElement(document.querySelector('.login-c'), false);
});

btnSettings.addEventListener('click', () => {
	chageActiveStateElement(document.querySelector('.btn-c'), false);
	chageActiveStateElement(document.querySelector('.login-c'), true);
});

btnLogin.addEventListener('click', () => {
	let password = document.querySelector('.login-c > input').value;

	ipcRenderer.send('check-login', password);
});

ipcRenderer.on('r-check-login', (e, isLogin) => {
	if (isLogin) {
		ipcRenderer.send('open-edit');
	} else {
		chageActiveStateElement(document.querySelector('.login-r'), true);
		chageActiveStateElement(document.querySelector('.login-c'), false);

		setTimeout(() => {
			chageActiveStateElement(document.querySelector('.login-r'), false);
			chageActiveStateElement(document.querySelector('.btn-c'), true);
			document.querySelector('.login-c > input').value = '';
		}, 5000);
	}
});
