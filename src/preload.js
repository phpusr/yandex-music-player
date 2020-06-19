const ipc = require('electron').ipcRenderer

function q(selector) {
    return document.querySelector(selector)
}

const PLAY_BUTTON = '.player-controls__btn_play'
const PAUSE_BUTTON = '.player-controls__btn_pause'

ipc.on('player:playPause', () => {
    console.log('>> playPause')
    q(PLAY_BUTTON).click()
})

ipc.on('player:next', () => {
    console.log('>> next')
    q('.player-controls__btn_next').click()
})

ipc.on('player:prev', () => {
    console.log('>> prev')
    q('.player-controls__btn_prev').click()
})

class YandexMusicPlayer {
    constructor() {
        setInterval(() => {
            this.sendMetadata()
            this.hideAds()
        }, 1000)
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
    hideAds() {
        setTimeout(() => {
            q('.d-overhead__close button').click()
            q('.bar-below_plus, .notify').style.display = 'none'
        }, 1000)
    }
}

window.YandexMusicPlayer = YandexMusicPlayer