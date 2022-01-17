const PLAY_BUTTON = '.player-controls__btn_play'
const ONE_M = 1000 * 1000

function q(selector) {
  return document.querySelector(selector)
}

window.ympAPI.play(() => window.externalAPI.togglePause(''))
window.ympAPI.pause(() => window.externalAPI.togglePause('PAUSE'))
window.ympAPI.playPause(() => q(PLAY_BUTTON).click())
window.ympAPI.next(() => window.externalAPI.next())
window.ympAPI.prev(() => window.externalAPI.prev())
window.ympAPI.setPosition(position => window.externalAPI.setPosition(position / ONE_M))

setInterval(() => {
  sendMetadata()
  hideAds()
}, 1000)

function sendMetadata() {
  const currentTrack = window.externalAPI.getCurrentTrack()

  if (!currentTrack) {
    return
  }

  const metadata = {
    trackId: currentTrack.link.substr(1),
    title: currentTrack.title,
    album: currentTrack.album.title,
    artists: currentTrack.artists.map(a => a.title),
    artUrl: `https://${currentTrack.cover.replace('%%', '300x300')}`,
    length: secondsToMicroSeconds(currentTrack.duration),
    seek: secondsToMicroSeconds(window.externalAPI.getProgress().position)
  }

  if (window.externalAPI.isPlaying()) {
    metadata.playbackStatus = 'Playing'
  } else {
    metadata.playbackStatus = 'Paused'
  }

  window.ympAPI.sendMetadata(metadata)
}

function secondsToMicroSeconds(seconds) {
  return Math.round(seconds * ONE_M)
}

function hideAds() {
  // Clicking by close button
  const CloseAdButtonClasses = ['.d-overhead__close button', '.payment-plus__header-close']
  CloseAdButtonClasses.forEach((adClass) => {
    const adButtonDom = q(adClass)
    if (adButtonDom) {
      adButtonDom.click()
    }
  })

  // Hiding ads
  const hideAdClasses = ['.bar-below_plus', '.notify', '.bar__branding']
  hideAdClasses.forEach((adClass) => {
    const adDom = q(adClass)
    if (adDom) {
      adDom.style.display = 'none'
    }
  })
}
