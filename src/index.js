const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

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

	let TestScreen;

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

	// and load the index.html of the app.

	// Open the DevTools.
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
