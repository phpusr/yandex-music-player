export function createPlayer(mainWindow) {
	const Player = require('mpris-service')

	const player = Player({
		name: 'YandexMusic',
		identity: 'YandexMusic media player',
		supportedUriSchemes: ['file'],
		supportedMimeTypes: ['audio/mpeg', 'application/ogg'],
		supportedInterfaces: ['player']
	})

	player.getPosition = function() {
	  // return the position of your player
	  return 0
	}

	// language=JavaScript
	const scripts = `
		class YandexMusicPlayer {
			playPause() {
				console.log('>> playPause')
				let playPauseButtonDom = document.querySelector('.player-controls__btn_play')
				if (!playPauseButtonDom) {
					playPauseButtonDom = document.querySelector('.player-controls__btn_pause')
				}
				
				playPauseButtonDom.click()
			}
			next() {
			    console.log('>> next')
			    document.querySelector('.player-controls__btn_next').click()
			}
			prev() {
			    console.log('>> prev')
				document.querySelector('.player-controls__btn_prev').click()
			}
		}
		const app = new YandexMusicPlayer()
	`
	mainWindow.webContents.executeJavaScript(scripts)

	// Events
	player.on('playpause', () => {
		mainWindow.webContents.executeJavaScript('app.playPause()')
	})

	player.on('next', () => {
		mainWindow.webContents.executeJavaScript('app.next()')
	})

	player.on('previous', () => {
		mainWindow.webContents.executeJavaScript('app.prev()')
	})

	player.on('quit', function () {
		process.exit()
	})

	setTimeout(function () {
		// @see http://www.freedesktop.org/wiki/Specifications/mpris-spec/metadata/
		player.metadata = {
			'mpris:trackid': player.objectPath('track/0'),
			'mpris:length': 60 * 1000 * 1000, // In microseconds
			'mpris:artUrl': 'http://www.adele.tv/images/facebook/adele.jpg',
			'xesam:title': 'Lolol',
			'xesam:album': '21',
			'xesam:artist': ['Adele']
		}

		player.playbackStatus = Player.PLAYBACK_STATUS_PLAYING
	}, 1000)

	setTimeout(() => {
	  player.seeked(0)
	}, 2000)
}