const {app, BrowserWindow, Menu, BrowserView} = require('electron')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit()
}

let mainWindow
let webContents
process.env.NODE_ENV = process.env.NODE_ENV || 'production'
const isProduction = process.env.NODE_ENV === 'production'
const isLinux = process.platform === 'linux'

main()

function main() {
    createMenu()

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
}

function createWindow() {
    // Main Window
    mainWindow = new BrowserWindow({title: 'Yandex Music Player'})
    mainWindow.on('closed', () => {
        mainWindow = null
    })

    // Player View
    const view = new BrowserView({
        webPreferences: {
            preload: `${__dirname}/preload.js`
        }
    })
    mainWindow.setBrowserView(view)
    view.setBounds({x: 0, y: 0, width: 800, height: isLinux ? 576 : 540})
    view.setAutoResize({width: true, height: true})
    webContents = view.webContents
    webContents.loadURL('https://music.yandex.ru')
    if (!isProduction) {
        webContents.openDevTools()
    }
    webContents.on('did-finish-load', () => {
        if (isLinux) {
            const {createPlayer} = require('./player.js')
            createPlayer(webContents, mainWindow)
        }
        webContents.executeJavaScript(`const app = new YandexMusicPlayer()`)
    })
}

function createMenu() {
    const template = [{
        label: 'File',
        submenu : [{
            label: 'Player',
            click: () => webContents.loadURL('https://music.yandex.ru')
        }, {
            label: 'Log in',
            click: () => webContents.loadURL('https://passport.yandex.ru')
        }, {
            type: 'separator'
        }, {
            role: 'reload'
        }, {
            label: 'Open Dev Tools',
            click: () => webContents.openDevTools()
        }, {
            type: 'separator'
        }, {
            role: 'quit'
        }]
    }]
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}
