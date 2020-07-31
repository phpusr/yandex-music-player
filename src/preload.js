/* global document window externalAPI */

const ipc = require('electron').ipcRenderer

function q(selector) {
  return document.querySelector(selector)
}

const PLAY_BUTTON = '.player-controls__btn_play'
const PAUSE_BUTTON = '.player-controls__btn_pause'

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
  externalAPI.setPosition(position / 1000000)
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
      trackId: this.getTrackId(),
      title: currentTrack.title,
      album: currentTrack.album.title,
      artists: currentTrack.artists.map(a => a.title),
      artUrl: `https://${currentTrack.cover.replace('%%', '300x300')}`,
      length: this.timeStringToMicroseconds(q('.progress__right').innerText),
      seek: this.timeStringToMicroseconds(q('.progress__left').innerText)
    }

    if (q(PAUSE_BUTTON)) {
      metadata.playbackStatus = 'Playing'
    } else if (q(PLAY_BUTTON)) {
      metadata.playbackStatus = 'Paused'
    } else {
      metadata.playbackStatus = 'Stopped'
    }

    ipc.send('player:metadata', metadata)
  }
  getTrackId() {
    const title = q('.track__title')
    if (!title) {
      return 0
    }

    const href = title.getAttribute('href')
    return href.substr(1)
  }
  timeStringToMicroseconds(timeString) {
    if (!timeString) {
      return 0
    }

    const array = timeString.split(':')

    return ((+array[0] * 60) + +array[1]) * 1000 * 1000
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
