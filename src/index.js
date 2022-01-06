const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const DBController = require('./backend/DBControllers');

require('electron-reload')(__dirname);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
	// eslint-disable-line global-require
	app.quit();
}

const createWindow = () => {
	// Create the browser window.

	const screenWidth = screen.getPrimaryDisplay().bounds.width;
	const screenHeight = screen.getPrimaryDisplay().bounds.height;

	let ChooseModuleScreen,
		SettingScreen,
		ResultScreen,
		AboutProgramScreen,
		TestScreen;

	const mainWindow = new BrowserWindow({
		width: parseInt(screenWidth / 2),
		height: parseInt(screenHeight / 1.5),
		minHeight: parseInt(screenHeight / 1.5),
		maxHeight: parseInt(screenHeight / 1.5),
		minWidth: parseInt(screenWidth / 2),
		maxWidth: parseInt(screenWidth / 2),
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
		frame: false,
	});

	mainWindow.loadFile(path.join(__dirname, 'index.html'));

	// Menu screen

	ipcMain.on('app-logout', () => {
		if (mainWindow) {
			mainWindow.close();
		}
	});

	// Module screen

	ipcMain.on('open-module', () => {
		if (!ChooseModuleScreen) {
			ChooseModuleScreen = new BrowserWindow({
				width: parseInt(screenWidth * 0.7),
				height: parseInt(screenHeight * 0.8),
				minHeight: parseInt(screenHeight * 0.8),
				maxHeight: parseInt(screenHeight * 0.8),
				minWidth: parseInt(screenWidth * 0.7),
				maxWidth: parseInt(screenWidth * 0.7),
				webPreferences: {
					nodeIntegration: true,
					contextIsolation: false,
				},
			});
			ChooseModuleScreen.loadFile(
				path.resolve(__dirname, 'client', 'html', 'module.html'),
			);
			mainWindow.hide();
		}
	});

	ipcMain.on('module-back', () => {
		if (ChooseModuleScreen) {
			ChooseModuleScreen.close();
			ChooseModuleScreen = null;
		}
		if (ResultScreen) {
			ResultScreen.close();
			ResultScreen = null;
		}
		mainWindow.show();
	});

	ipcMain.on('app-exit', () => {
		app.quit();
	});

	// Test

	ipcMain.on('open-test', () => {
		if (ChooseModuleScreen) {
			ChooseModuleScreen.close();
			ChooseModuleScreen = null;

			TestScreen = new BrowserWindow({
				width: parseInt(screenWidth * 0.95),
				height: parseInt(screenHeight * 0.85),
				minHeight: parseInt(screenHeight * 0.85),
				minWidth: parseInt(screenWidth * 0.95),
				webPreferences: {
					nodeIntegration: true,
					contextIsolation: false,
				},
				// frame: false,
			});

			TestScreen.loadFile(
				path.resolve(__dirname, 'client', 'html', 'test.html'),
			);
		}
	});

	ipcMain.on('back-test', () => {
		if (TestScreen) {
			TestScreen.close();
			TestScreen = null;

			if (!ChooseModuleScreen) {
				ChooseModuleScreen = new BrowserWindow({
					width: parseInt(screenWidth * 0.7),
					height: parseInt(screenHeight * 0.8),
					minHeight: parseInt(screenHeight * 0.8),
					maxHeight: parseInt(screenHeight * 0.8),
					minWidth: parseInt(screenWidth * 0.7),
					maxWidth: parseInt(screenWidth * 0.7),
					webPreferences: {
						nodeIntegration: true,
						contextIsolation: false,
					},
				});
				ChooseModuleScreen.loadFile(
					path.resolve(__dirname, 'client', 'html', 'module.html'),
				);
			}
		}
	});

	// Result sreen

	ipcMain.on('open-result', () => {
		if (TestScreen) {
			TestScreen.close();
			TestScreen = null;
		}

		if (!ResultScreen) {
			ResultScreen = new BrowserWindow({
				width: parseInt(screenWidth * 0.5),
				height: parseInt(screenHeight * 0.6),
				minHeight: parseInt(screenHeight * 0.6),
				maxHeight: parseInt(screenHeight * 0.6),
				minWidth: parseInt(screenWidth * 0.5),
				maxWidth: parseInt(screenWidth * 0.5),
				webPreferences: {
					nodeIntegration: true,
					contextIsolation: false,
				},
			});

			ResultScreen.loadFile(
				path.resolve(__dirname, 'client', 'html', 'result.html'),
			);
		}
	});

	// Mongo

	ipcMain.on('get-all-cs', async () => {
		await DBController.getAllCategories(ChooseModuleScreen);
	});

	ipcMain.on('s-current-c', async (e, data) => {
		await DBController.setCurrentCategory(data);
	});

	ipcMain.on('g-all-q-by-c-id', () => {
		DBController.getAllQuestionsByNumber(TestScreen);
	});

	ipcMain.on('g-current-c', async () => {
		await DBController.getCurrentCategory(TestScreen);
	});

	ipcMain.on('set-test-result', async (e, data) => {
		DBController.setTestResult({
			...data,
			date: Date.now(),
		});
	});
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
