const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld('ympAPI', {
  sendMetadata(metadata) {
    ipcRenderer.send('player:metadata', metadata)
  },
  play: (func) => {
    ipcRenderer.on('player:play', (event, ...args) => func(...args))
  },
  pause: (func) => {
    ipcRenderer.on('player:pause', (event, ...args) => func(...args))
  },
  playPause: (func) => {
    ipcRenderer.on('player:playPause', (event, ...args) => func(...args))
  },
  next: (func) => {
    ipcRenderer.on('player:next', (event, ...args) => func(...args))
  },
  prev: (func) => {
    ipcRenderer.on('player:prev', (event, ...args) => func(...args))
  },
  setPosition: (func) => {
    ipcRenderer.on('player:setPosition', (event, ...args) => func(...args))
  }
})
