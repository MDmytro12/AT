const { ipcRenderer } = require('electron');
const mongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const path = require('path');

// constants

const btnLogout = document.querySelector('#btn-logout');
const btnBack = document.querySelector('#btn-back');
const btnAddRecord = document.querySelector('#btn-add');
const btnDelRecord = document.querySelector('#btn-del');
const AddContainer = document.querySelector('.add-c');
const DeleteContainer = document.querySelector('.del-c');
const BtnsContainer = document.querySelector('.btn-c');
const allBackBtns = document.querySelectorAll('.a-b-c');

const btnAddAnswer = document.querySelector('#add-a-btn');
const btnDelAnswer = document.querySelector('#del-a-btn');
const btnDelImage = document.querySelector('#del-img-btn');
const btnSelectModule = document.querySelector('.que-mod-i-sd');
const btnAddQuestionDb = document.querySelector('#btn-add-item');
const btnSelectImage = document.querySelector('input[type="file"]');
const btnSMDel = document.querySelector('.cat-cur');

const MONGO_URL = 'mongodb://127.0.0.1:27017';
const MONGO_OPTIONS = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

// functions

function insertImage(moduleNumber, questionNumber, patth) {
	if (
		!fs.existsSync(
			path.resolve(__dirname, '..', 'assets', 'img', `R${moduleNumber}`),
		)
	) {
		fs.mkdirSync(
			path.resolve(__dirname, '..', 'assets', 'img', `R${moduleNumber}`),
		);
	}

	patth.forEach((p, index) => {
		fs.copyFileSync(
			p,
			path.resolve(
				__dirname,
				'..',
				'assets',
				'img',
				`R${moduleNumber}`,
				`${questionNumber}.${index}.${p.split('.').pop()}`,
			),
		);
	});
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

function showError() {
	ipcRenderer.send('show-error');
}

function setAllCategoriesAdd(categories) {
	let catHTML = '';

	categories.forEach((c) => {
		catHTML += `
			<div class="que-mod-i" >
				<p id="${c.moduleNumber}">
					<span> ${c.moduleNumber}. </span>
					${c.moduleName}
				</p>
			</div>
		`;
	});

	document.querySelector('.que-mod-m').innerHTML = catHTML;

	document.querySelector('.que-mod-i-sd').innerHTML = `
			<p id="1">
				<span> ${categories[0].moduleNumber}. </span>
				${categories[0].moduleName}
			</p>
`;
}

function setAllCategoriesDel(categories) {
	let catHTML = '';

	categories.forEach((c) => {
		catHTML += `
			<div class="cat-i" >
				<p id="${c.moduleNumber}">
					<span> ${c.moduleNumber}. </span>
					${c.moduleName}
				</p>
			</div>
		`;
	});

	document.querySelector('.cat-list').innerHTML = catHTML;

	document.querySelector('.cat-cur').innerHTML = `
			<p id="1">
				<span> ${categories[0].moduleNumber}. </span>
				${categories[0].moduleName}
			</p>
`;
}

function setModuleListeners() {
	document.querySelectorAll('.que-mod-i').forEach((m) => {
		m.addEventListener('click', () => {
			chageActiveStateElement(document.querySelector('.que-mod-m'), false);
			document.querySelector('.que-mod-i-sd').innerHTML = m.innerHTML;
		});
	});
}

function setModuleListenersDel() {
	document.querySelectorAll('.cat-i').forEach((m) => {
		m.addEventListener('click', () => {
			chageActiveStateElement(document.querySelector('.cat-list'), false);
			document.querySelector('.cat-cur').innerHTML = m.innerHTML;
			getAllQuestions(
				parseInt(m.querySelector(' p > span').innerText.split('.')[0]),
			);
		});
	});
}

function getAllCategories() {
	mongoClient.connect(MONGO_URL, MONGO_OPTIONS, (e, client) => {
		if (e) {
			showError();
			return;
		}

		client
			.db('at')
			.collection('categories')
			.find({})
			.toArray((err, result) => {
				if (err) {
					showError();
					return;
				}

				if (document.querySelector('.add-c').classList.contains('active')) {
					setAllCategoriesAdd(result);
					setModuleListeners();
				} else if (
					document.querySelector('.del-c').classList.contains('active')
				) {
					setAllCategoriesDel(result);
					setModuleListenersDel();
					getAllQuestions(1);
				}
			});
	});
}

function addNewImageItem(path) {
	let isImage = false;
	let allowedImages = ['jpeg', 'png', 'jpg', 'ico', 'tiff', 'raw'];

	allowedImages.forEach((i) => {
		if (i === path.split('.').pop()) {
			isImage = true;
		}
	});

	if (isImage) {
		const count = document.querySelector('.que-img-i')
			? parseInt(document.querySelector('.que-img-i:last-child').id) + 1
			: 1;

		document.querySelector('.que-img-list').innerHTML += `
			<div class="que-img-i" id="${count}">
				<span>${count}.</span>
				<img src="${path}" alt="Image!" />
				<p>${path}</p>
			</div>
		`;
	}
}

function removeImageItem() {
	if (document.querySelector('.que-img-i')) {
		document
			.querySelector('.que-img-list')
			.removeChild(document.querySelector('.que-img-i:last-child'));
	}
}

function addNewAnswerItem() {
	const count = document.querySelector('.que-as-i')
		? parseInt(
				document
					.querySelector('.que-as-i:last-child > span')
					.innerText.replace('.', ''),
		  ) + 1
		: 1;

	document.querySelectorAll('.que-as-i > input').forEach((i) => {
		i.setAttribute('value', i.value);
	});

	document.querySelector('.que-as-m').innerHTML += `
		<div class="que-as-i">
			<span> ${count}. </span>
			<input type="text" placeholder="Введіть відповідь ..." />
		</div>
	`;

	setAnswerFocus();
}

function setAnswerFocus() {
	document.querySelectorAll('.que-as-i').forEach((i) => {
		i.addEventListener('focusin', () => {
			chageActiveStateElement(i, true);
		});

		i.addEventListener('focusout', () => {
			chageActiveStateElement(i, false);
		});
	});
}

function removeAnswerItem() {
	if (document.querySelector('.que-as-i')) {
		document
			.querySelector('.que-as-m')
			.removeChild(document.querySelector('.que-as-i:last-child'));
	}
}

function insertInDbNewAnswer(q, imgs) {
	mongoClient.connect(MONGO_URL, MONGO_OPTIONS, (e, client) => {
		if (e) {
			ipcRenderer.send('show-error');
			return;
		}

		client
			.db('at')
			.collection(`R${q.moduleNumber}`)
			.find({})
			.count((err, c) => {
				if (err) {
					ipcRenderer.send('show-error');
					return;
				}

				client
					.db('at')
					.collection(`R${q.moduleNumber}`)
					.insertOne({ ...q, moduleNumber: c + 1 }, (e, r) => {
						if (e) {
							ipcRenderer.send('show-error');
							return;
						}
						insertImage(q.moduleNumber, c + 1, imgs);
					});
			});
	});
}

function ShowSuccess() {
	chageActiveStateElement(document.querySelector('.error-c'), true);
	chageActiveStateElement(AddContainer, false);

	setTimeout(() => {
		document.querySelector('#new-question').value = '';
		document.querySelector('input[type="number"]').value = '';
		document.querySelector('.que-as-m').innerHTML = `
			<div class="que-as-i">
				<span> 1. </span>
				<input type="text" placeholder="Введіть відповідь ..." />
			</div>
		`;
		chageActiveStateElement(document.querySelector('.error-c'), false);
		chageActiveStateElement(BtnsContainer, true);
	}, 5000);
}

function getAllQuestions(moduleNumber) {
	mongoClient.connect(MONGO_URL, MONGO_OPTIONS, (e, client) => {
		if (e) {
			ipcRenderer.send('show-error');
			return;
		}

		client
			.db('at')
			.collection(`R${moduleNumber}`)
			.find({})
			.toArray((er, result) => {
				if (er) {
					ipcRenderer.send('show-error');
					return;
				}

				setAllQuestions(result);
				setDeleteListeners();
			});
	});
}

function setAllQuestions(questions) {
	let HTML = '';

	questions.forEach((q) => {
		HTML += `
			<div class="que-i" id="${q.moduleNumber}">
				<p>
					<span> ${q.moduleNumber}. </span>
					${q.question}
				</p>
				<div class="del-q-btn" id="${q.moduleNumber}">
					<i class="fa fa-trash"></i>
				</div>
			</div>
		`;
	});

	document.querySelector('.all-q-c').innerHTML = HTML;
}

function setDeleteListeners() {
	document.querySelectorAll('.del-q-btn').forEach((b) => {
		b.addEventListener('click', () => {
			mongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
				if (err) {
					ipcRenderer.send('show-error');
					return;
				}
				client
					.db('at')
					.collection(
						`R${
							document
								.querySelector('.cat-cur > p > span')
								.innerText.split('.')[0]
						}`,
					)
					.findOne({ moduleNumber: parseInt(b.id) }, (errr, res) => {
						if (errr) {
							ipcRenderer.send('show-error');
							return;
						}

						if (res.isImage) {
							let allImages = fs.readdirSync(
								path.resolve(
									__dirname,
									'..',
									'assets',
									'img',
									`R${
										document
											.querySelector('.cat-cur > p > span')
											.innerText.split('.')[0]
									}`,
								),
							);

							allImages.forEach((i) => {
								if (parseInt(i.split('.')[0]) === parseInt(b.id)) {
									fs.rmSync(
										path.resolve(
											__dirname,
											'..',
											'assets',
											'img',
											`R${
												document
													.querySelector('.cat-cur > p > span')
													.innerText.split('.')[0]
											}`,
											i,
										),
									);
								}
							});
						}
					});
				client
					.db('at')
					.collection(
						`R${
							document
								.querySelector('.cat-cur > p > span')
								.innerText.split('.')[0]
						}`,
					)
					.deleteOne(
						{
							moduleNumber: parseInt(b.id),
						},
						(errr, res) => {
							if (errr) {
								ipcRenderer.send('show-error');
								return;
							}

							b.parentNode.style.backgroundColor = 'rgba(255 , 0,0, .5)';
							b.style.display = 'none';

							setTimeout(() => {
								getAllQuestions(
									parseInt(
										document
											.querySelector('.cat-cur > p > span')
											.innerText.split('.')[0],
									),
								);
							}, 3000);
						},
					);
			});
		});
	});
}

// listeners

btnSMDel.addEventListener('click', () => {
	if (document.querySelector('.cat-list').classList.contains('active')) {
		chageActiveStateElement(document.querySelector('.cat-list'), false);
	} else {
		chageActiveStateElement(document.querySelector('.cat-list'), true);
	}
});

btnDelAnswer.addEventListener('click', () => {
	removeAnswerItem();
});

btnAddAnswer.addEventListener('click', () => {
	addNewAnswerItem();
});

btnDelImage.addEventListener('click', () => {
	removeImageItem();
});

btnSelectImage.addEventListener('change', (e) => {
	addNewImageItem(e.target.files[0].path);
});

allBackBtns.forEach((btn) => {
	btn.addEventListener('click', () => {
		chageActiveStateElement(DeleteContainer, false);
		chageActiveStateElement(AddContainer, false);
		chageActiveStateElement(BtnsContainer, true);
	});
});

btnLogout.addEventListener('click', () => {
	ipcRenderer.send('app-exit');
});

btnBack.addEventListener('click', () => {
	ipcRenderer.send('back-main');
});

btnAddRecord.addEventListener('click', () => {
	chageActiveStateElement(BtnsContainer, false);
	chageActiveStateElement(AddContainer, true);

	getAllCategories();
	setAnswerFocus();
});

btnDelRecord.addEventListener('click', () => {
	chageActiveStateElement(BtnsContainer, false);
	chageActiveStateElement(DeleteContainer, true);

	getAllCategories();
});

btnSelectModule.addEventListener('click', () => {
	if (document.querySelector('.que-mod-m').classList.contains('active')) {
		chageActiveStateElement(document.querySelector('.que-mod-m'), false);
	} else {
		chageActiveStateElement(document.querySelector('.que-mod-m'), true);
	}
});

btnAddQuestionDb.addEventListener('click', () => {
	if (
		document.querySelector('#new-question').value.trim() !== '' &&
		document.querySelector('input[type="number"]').value !== '' &&
		document.querySelector('.que-as-i') &&
		parseInt(document.querySelector('input[type="number"]').value) <=
			document.querySelectorAll('.que-as-i').length
	) {
		let allAnswers = {};
		let allImages = [];
		let isImage = false;
		let count = 1;

		document.querySelectorAll('.que-as-i > input').forEach((a, index) => {
			if (a.value !== '') {
				allAnswers[count] = a.value;
				count++;
			}
		});

		if (document.querySelector('.que-img-i')) {
			isImage = true;
			document.querySelectorAll('.que-img-i > img').forEach((i) => {
				allImages.push(i.getAttribute('src'));
			});
		}

		const question = {
			question: document.querySelector('#new-question').value,
			answers: JSON.stringify(allAnswers),
			correctAnswer: parseInt(
				document.querySelector('input[type="number"]').value,
			),
			moduleNumber: parseInt(document.querySelector('.que-mod-i-sd > p').id),
			isImage,
		};

		insertInDbNewAnswer(question, allImages);
		ShowSuccess();
	} else {
		ipcRenderer.send('show-error', 'Ви не коректно заповнили форму!');
	}
});
