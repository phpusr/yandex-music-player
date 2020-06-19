window.$ = window.jQuery = require('./jquery.min.js')

const ipc = require('electron').ipcRenderer

function q(selector) {
    return document.querySelector(selector)
}

const PLAY_BUTTON = '.player-controls__btn_play'
const PAUSE_BUTTON = '.player-controls__btn_pause'

class YandexMusicPlayer {
    constructor() {
        setInterval(() => {
            this.sendMetadata()
        }, 1000)
    }
    playPause() {
        console.log('>> playPause')
        q(PLAY_BUTTON).click()
    }
    next() {
        console.log('>> next')
        q('.player-controls__btn_next').click()
    }
    prev() {
        console.log('>> prev')
        q('.player-controls__btn_prev').click()
    }
    sendMetadata() {
        this.getTrackId()
        const metadata = {
            trackId: this.getTrackId(),
            title: q('.track__title').innerText,
            artists: q('.track__artists').innerText,
            artUrl: q('.entity-cover__image').getAttribute('src'),
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

        return (+array[0] * 60 + +array[1]) * 1000 * 1000
    }
}
window.app = new YandexMusicPlayer()