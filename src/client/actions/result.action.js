const { ipcRenderer } = require('electron');

// constants

const btnBack = document.querySelector('#btn-back');
const btnLogout = document.querySelector('#btn-logout');

// listeners

btnBack.addEventListener('click', () => {
	ipcRenderer.send('module-back');
});

btnLogout.addEventListener('click', () => {
	ipcRenderer.send('app-exit');
});
