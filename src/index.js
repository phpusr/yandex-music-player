const {app, BrowserWindow, Menu} = require('electron')
const {createPlayer} = require('./player.js')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit()
}

let mainWindow
let webContents

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        }
    })

    webContents = mainWindow.webContents

    mainWindow.loadURL(`file://${__dirname}/index.html`)

    webContents.openDevTools()

    webContents.on('did-finish-load', () => {
        createPlayer(mainWindow)
    })

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

function createMenu() {
    const template = [{
        label: 'File',
        submenu : [{
            label: 'Player',
            click: () => {
                console.log('>> player')
                webContents.send('go:player')
            }
        }, {
            label: 'Log in',
            click: () => {
                console.log('>> click')
                webContents.send('go:login')
            }
        }, {
            type: 'separator'
        }, {
            role: 'reload'
        }, {
            role: 'toggledevtools'
        }, {
            type: 'separator'
        }, {
            role: 'quit'
        }]
    }]
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

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
