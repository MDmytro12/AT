const { ipcRenderer } = require('electron');

// constants

const btnLogout = document.querySelector('#btn-logout');
const btnBack = document.querySelector('#btn-back');
const btnAddRecord = document.querySelector('#btn-add');
const btnDelRecord = document.querySelector('#btn-del');
const btnChRecord = document.querySelector('#btn-ch');
const AddContainer = document.querySelector('.add-c');
const DeleteContainer = document.querySelector('.del-c');
const ChangeContainer = document.querySelector('.ch-c');
const BtnsContainer = document.querySelector('.btn-c');
const allBackBtns = document.querySelectorAll('.a-b-c');

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

allBackBtns.forEach((btn) => {
	btn.addEventListener('click', () => {
		chageActiveStateElement(ChangeContainer, false);
		chageActiveStateElement(DeleteContainer, false);
		chageActiveStateElement(AddContainer, false);
		chageActiveStateElement(BtnsContainer, true);
	});
});

btnLogout.addEventListener('click', () => {
	ipcRenderer.send('app-logout');
});

btnBack.addEventListener('click', () => {
	ipcRenderer.send('back-main');
});

btnAddRecord.addEventListener('click', () => {
	chageActiveStateElement(BtnsContainer, false);
	chageActiveStateElement(AddContainer, true);
});

btnDelRecord.addEventListener('click', () => {
	chageActiveStateElement(BtnsContainer, false);
	chageActiveStateElement(DeleteContainer, true);
});

btnChRecord.addEventListener('click', () => {
	chageActiveStateElement(BtnsContainer, false);
	chageActiveStateElement(ChangeContainer, true);
});
