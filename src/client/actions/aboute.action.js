const { ipcRenderer } = require('electron');

// constants

const btnLogout = document.querySelector('#btn-logout');
const btnBack = document.querySelector('#btn-back');

// listeners

btnLogout.addEventListener('click', () => {
	ipcRenderer.send('app-exit');
});

btnBack.addEventListener('click', () => {
	ipcRenderer.send('back-main');
});
