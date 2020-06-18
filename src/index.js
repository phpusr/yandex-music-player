import {app, BrowserWindow} from 'electron'
import {createPlayer} from './player.js'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit()
}

let mainWindow

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
    })

    mainWindow.loadURL('https://music.yandex.ru')

    mainWindow.webContents.openDevTools()

    mainWindow.webContents.on('did-finish-load', () => {
        createPlayer(mainWindow)
    })

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})
