'use strict';

const mongoClient = require('mongodb').MongoClient;
const MONGO_URL = 'mongodb://127.0.0.1:27017';
const MONGO_OPTIONS = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

const { dialog } = require('electron');

class DBController {
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
}

module.exports = DBController;
