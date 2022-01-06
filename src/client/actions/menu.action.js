const { ipcRenderer } = require('electron');

// constants

const btnLogout = document.querySelector('#btn-logout');
const btnStartTest = document.querySelector('#btn-start-test');
const btnStartExam = document.querySelector('#btn-start-exam');
const btnAboutPro = document.querySelector('#btn-about-pro');
const btnSettings = document.querySelector('#btn-setting');

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
