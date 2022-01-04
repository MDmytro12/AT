const { ipcRenderer } = require('electron');

// constants

const btnBack = document.querySelector('#btn-back');
const btnLogout = document.querySelector('#btn-logout');

// listeners

btnBack.addEventListener('click', () => {
	ipcRenderer.send('module-back');
	console.log('Back');
});

btnLogout.addEventListener('click', () => {
	ipcRenderer.send('app-exit');
});

document.querySelectorAll('.choose-i')[0].addEventListener('click', () => {
	ipcRenderer.send('open-test');
});
