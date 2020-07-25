function createPlayer(webContents, window) {
	const Player = require('mpris-service')

	const player = Player({
		name: 'YandexMusic',
		identity: 'YandexMusic media player',
		supportedUriSchemes: ['file'],
		supportedMimeTypes: ['audio/mpeg', 'application/ogg'],
		supportedInterfaces: ['player']
	})

	// Events
	player.on('play', () => {
		webContents.send('player:playPause')
	})
	player.on('pause', () => {
		webContents.send('player:playPause')
	})

	player.on('next', () => {
		webContents.send('player:next')
	})

	player.on('previous', () => {
		webContents.send('player:prev')
	})
	player.on('position', (data) => {
		webContents.send('player:setPosition', data.position)
	})



	player.on('quit', () => {
		process.exit()
	})

	// Metadata

	player.getPosition = () => {
	  // return the position of your player
	  return 0
	}

	const ipc = require('electron').ipcMain

	ipc.on('player:metadata', (event, metadata) => {
		const {trackId, title, artists, playbackStatus, length, seek, artUrl, album} = metadata
		window.setTitle(`${artists} - ${title}`)
		// @see http://www.freedesktop.org/wiki/Specifications/mpris-spec/metadata/
		player.metadata = {
			'mpris:trackid': player.objectPath(trackId),
			'mpris:length': length,
			'mpris:artUrl':artUrl,
			'xesam:title': title,
			'xesam:album': album,
			'xesam:artist': artists
		}
		player.playbackStatus = playbackStatus
		player.seeked(seek)
		webContents.send('player:metadata', metadata)
	})
}

module.exports = { createPlayer }
