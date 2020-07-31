function createPlayer(webContents, window) {
  // eslint-disable-next-line global-require
  const MprisService = require('mpris-service')

  const mprisService = MprisService({
    name: 'YandexMusic',
    identity: 'YandexMusic media player',
    supportedUriSchemes: ['file'],
    supportedMimeTypes: ['audio/mpeg', 'application/ogg'],
    supportedInterfaces: ['player']
  })

  // Events
  mprisService.on('play', () => {
    webContents.send('player:play')
  })

  mprisService.on('pause', () => {
    webContents.send('player:pause')
  })

  mprisService.on('playpause', () => {
    webContents.send('player:playPause')
  })

  mprisService.on('next', () => {
    webContents.send('player:next')
  })

  mprisService.on('previous', () => {
    webContents.send('player:prev')
  })
  mprisService.on('position', (data) => {
    webContents.send('player:setPosition', data.position)
  })

  mprisService.on('quit', () => {
    process.exit()
  })

  // Metadata

  // return the position of your player
  mprisService.getPosition = () => 0

  // eslint-disable-next-line global-require
  const ipc = require('electron').ipcMain

  ipc.on('player:metadata', (event, metadata) => {
    const { trackId, title, artists, playbackStatus, length, seek, artUrl, album } = metadata
    window.setTitle(`${artists} - ${title}`)
    // @see http://www.freedesktop.org/wiki/Specifications/mpris-spec/metadata/
    mprisService.metadata = {
      'mpris:trackid': mprisService.objectPath(trackId),
      'mpris:length': length,
      'mpris:artUrl': artUrl,
      'xesam:title': title,
      'xesam:album': album,
      'xesam:artist': artists
    }
    mprisService.playbackStatus = playbackStatus
    mprisService.seeked(seek)
    webContents.send('player:metadata', metadata)
  })
}

module.exports = { createPlayer }
