/* global document window externalAPI */

const ONE_M = 1000 * 1000

const ipc = require('electron').ipcRenderer

function q(selector) {
  return document.querySelector(selector)
}

ipc.on('player:play', () => {
  externalAPI.togglePause('')
})

ipc.on('player:pause', () => {
  externalAPI.togglePause('PAUSE')
})

ipc.on('player:playPause', () => {
  externalAPI.togglePause()
})

ipc.on('player:next', () => {
  externalAPI.next()
})

ipc.on('player:prev', () => {
  externalAPI.prev()
})

ipc.on('player:setPosition', (ev, position) => {
  externalAPI.setPosition(position / ONE_M)
})

class YandexMusicPlayer {
  constructor() {
    setInterval(() => {
      this.sendMetadata()
      this.hideAds()
    }, 1000)
  }
  sendMetadata() {
    const currentTrack = externalAPI.getCurrentTrack()

    if (!currentTrack) {
      return
    }

    const metadata = {
      trackId: currentTrack.link.substr(1),
      title: currentTrack.title,
      album: currentTrack.album.title,
      artists: currentTrack.artists.map(a => a.title),
      artUrl: `https://${currentTrack.cover.replace('%%', '300x300')}`,
      length: currentTrack.duration * ONE_M,
      seek: externalAPI.getProgress().position * ONE_M
    }

    if (externalAPI.isPlaying()) {
      metadata.playbackStatus = 'Playing'
    } else {
      metadata.playbackStatus = 'Paused'
    }

    ipc.send('player:metadata', metadata)
  }
  hideAds() {
    const closeAdButton = q('.d-overhead__close button')
    if (closeAdButton) {
      closeAdButton.click()
    }
    q('.bar-below_plus, .notify').style.display = 'none'
  }
}

window.YandexMusicPlayer = YandexMusicPlayer
