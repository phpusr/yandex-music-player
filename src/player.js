export function createPlayer(mainWindow) {
	const Player = require('mpris-service')

	const player = Player({
		name: 'YandexMusic',
		identity: 'YandexMusic media player',
		supportedUriSchemes: ['file'],
		supportedMimeTypes: ['audio/mpeg', 'application/ogg'],
		supportedInterfaces: ['player']
	})

	const webContents = mainWindow.webContents

	// Events
	player.on('playpause', () => {
		webContents.send('player:playPause')
	})

	player.on('next', () => {
		webContents.send('player:next')
	})

	player.on('previous', () => {
		webContents.send('player:prev')
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
		const {trackId, title, artists, playbackStatus, length, seek, artUrl} = metadata
		// @see http://www.freedesktop.org/wiki/Specifications/mpris-spec/metadata/
		player.metadata = {
			'mpris:trackid': player.objectPath(trackId),
			'mpris:length': length,
			'mpris:artUrl': artUrl,
			'xesam:title': title,
			'xesam:album': '-',
			'xesam:artist': [artists]
		}
		player.playbackStatus = playbackStatus
		player.seeked(seek)
	})
}