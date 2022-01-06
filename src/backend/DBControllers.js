'use strict';

const mongoClient = require('mongodb').MongoClient;
const MONGO_URL = 'mongodb://127.0.0.1:27017';
const MONGO_OPTIONS = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

const { dialog } = require('electron');

class DBController {
	static randomNumber(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	}

	static async getRandow40Questions(window) {
		mongoClient.connect(MONGO_URL, MONGO_OPTIONS, (e, client) => {
			if (e) {
				this.showError();
				return;
			}

			client
				.db('at')
				.collection('all-questions')
				.find({})
				.count((err, countAllQuestions) => {
					let count = 0;
					let allRandomNumber = [];

					while (count < 40) {
						let newNumber = this.randomNumber(1, countAllQuestions);

						if (!(newNumber in allRandomNumber)) {
							allRandomNumber.push(newNumber);
							count++;
						}
					}

					client
						.db('at')
						.collection('all-questions')
						.find({})
						.toArray((errr, result) => {
							if (errr) {
								this.showError();
								return;
							}

							let randomQuestions = [];

							allRandomNumber.forEach((r) => {
								randomQuestions.push(result[r]);
							});

							result = null;

							window.send('r-exam-q', randomQuestions);
						});
				});
		});
	}

	static showError() {
		dialog.showMessageBox({
			title: 'Помилка!',
			message: 'Виникла помилка при підключенні до Бази даних!',
			type: 'error',
			buttons: ['Зрозуміло'],
		});
	}

	static async getAllCategories(window) {
		await mongoClient.connect(MONGO_URL, MONGO_OPTIONS, async (err, client) => {
			if (err) {
				this.showError();
				return;
			}

			client
				.db('at')
				.collection('categories')
				.find({})
				.toArray((err, result) => {
					if (err) {
						this.showError();
						return [];
					}

					window.send('r-get-all-cs', result);
				});
		});
	}

	static async setCurrentCategory(data) {
		await mongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
			if (err) {
				this.showError();
				return;
			}

			client
				.db('at')
				.collection('categories')
				.updateMany({}, { $set: { current: false } });

			client
				.db('at')
				.collection('categories')
				.updateOne(
					{ moduleNumber: parseInt(data.currentModule) },
					{ $set: { current: true } },
				);
		});
	}

	static async getAllQuestionsByNumber(window) {
		mongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
			if (err) {
				this.showError();
				return;
			}

			client
				.db('at')
				.collection('categories')
				.findOne({ current: true }, (err2, res) => {
					if (err2) {
						this.showError();
						return;
					}
					client
						.db('at')
						.collection(`R${res.moduleNumber}`)
						.find({})
						.toArray((err3, result) => {
							if (err3) {
								this.showError();
								return;
							}
							window.send('r-g-all-q', result);
						});
				});
		});
	}

	static async getCurrentCategory(window) {
		mongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
			if (err) {
				this.showError();
				return;
			}

			client
				.db('at')
				.collection('categories')
				.findOne({ current: true }, (e, result) => {
					if (e) {
						this.showError();
						return;
					}

					window.send('gi-current-category', result);
				});
		});
	}

	static async setTestResult(data) {
		mongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
			if (err) {
				this.showError();
				return;
			}

			client.db('at').collection('results').insertOne(data);
		});
	}

	static async deleteExamResult() {
		mongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
			if (err) {
				this.showError();
				return;
			}

			client.db('at').collection('exam-results').drop();
		});
	}

	static async setExamResult(data) {
		mongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
			if (err) {
				this.showError();
				return;
			}

			client.db('at').collection('exam-results').insertOne(data);
		});
	}

	static async deleteAllResults() {
		mongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
			if (err) {
				this.showError();
				return;
			}

			client.db('at').collection('results').drop();
		});
	}

	static async getResult(window) {
		mongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
			if (err) {
				this.showError();
				return;
			}

			client
				.db('at')
				.collection('results')
				.findOne({}, (e, result) => {
					if (e) {
						this.showError();
						return;
					}

					window.send('r-get-result', result);
				});
		});
	}

	static async getExamResult(window) {
		mongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
			if (err) {
				this.showError();
				return;
			}

			client
				.db('at')
				.collection('exam-results')
				.findOne({}, (e, result) => {
					if (e) {
						this.showError();
						return;
					}

					window.send('r-get-result', result);
				});
		});
	}
}

module.exports = DBController;
