import {app, BrowserWindow} from 'electron';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
    });

    mainWindow.loadURL('https://music.yandex.ru');
    // mainWindow.loadURL(`file://${__dirname}/index.html`);
    createPlayer();

    // mainWindow.webContents.openDevTools();
    mainWindow.webContents.on('did-finish-load', () => {
        const code = `
            setInterval(() => {
                const title = document.querySelector('.d-link.deco-link.track__title').innerText;
                console.log('title', title);
            }, 1000)
        `
        mainWindow.webContents.executeJavaScript(code)
    })

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};

function createPlayer() {
    require('./player.js');
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
