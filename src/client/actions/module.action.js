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

document.addEventListener('DOMContentLoaded', () => {
	ipcRenderer.send('get-all-cs');
});

ipcRenderer.on('r-get-all-cs', (e, categories) => {
	console.log(categories);
	let cHTML = '';

	categories.forEach((item) => {
		cHTML += `
			<div class="choose-i" id="${item.moduleNumber}">
				<p>
					<span>${item.moduleNumber}</span>
					${item.moduleName}
				</p>
			</div>
		`;
	});

	document.querySelector('.choose-i-c').innerHTML = cHTML;

	document.querySelectorAll('.choose-i').forEach((item) => {
		item.addEventListener('click', () => {
			ipcRenderer.send('s-current-c', {
				currentModule: item.querySelector('span').innerText,
			});
			ipcRenderer.send('open-test');
		});
	});
});
