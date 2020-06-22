yandex-music-player
===================

Yandex Music desktop Electron application with [MPRIS](https://specifications.freedesktop.org/mpris-spec/2.2/) support

## MPRIS

The Media Player Remote Interfacing Specification is a standard [D-Bus](https://www.freedesktop.org/wiki/Software/dbus/) interface which aims to provide a common programmatic API for controlling media players

It provides a mechanism for discovery, querying and basic playback control of compliant media players, as well as a tracklist interface which is used to add context to the active media item

## How to run

### Arch / Manjaro Linux

Install from [AUR](https://aur.archlinux.org/packages/yandex-music-player/)

```bash
yay -S yandex-music-player
```

Run

```bash
ymp
```

### Windows 7/10

Download and unzip [yandex-music-player-win32-ia32.zip](https://github.com/phpusr/yandex-music-player/releases)

### Other

Install [Node.js & NPM](https://nodejs.org/)

Install [Electron](https://www.electronjs.org/)

```bash
sudo npm install -g electron
```

Install dependencies

```bash
npm install --only=prod 
```

Run

```bash
electron .
```