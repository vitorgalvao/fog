# <img src='https://i.imgur.com/sIH9Q7O.png' width='45' align='center' alt='Fog logo'> Fog

<img src='http://i.imgur.com/5pVpnMe.png' height='668' align='left' alt='Fog screenshot'>

### Unofficial [Overcast](https://overcast.fm/) podcast app.

> Control playback with keyboard media keys, even when not the frontmost app.

> Navigate episodes with <kbd>↓</kbd> and <kbd>↑</kbd> (or <kbd>j</kbd> and <kbd>k</kbd>).

> Keyboard shortcuts: <kbd>␣</kbd> pauses and resumes; <kbd>←</kbd> rewinds; <kbd>→</kbd> fast-forwards; <kbd>⌫</kbd> goes back to home; <kbd>⌘</kbd><kbd>⌫</kbd> deletes the current episode or podcast; <kbd>⌘</kbd><kbd>↵</kbd> saves the current episode.

> “Permalink” opens in default browser.

> “Share link” and “Share link with timestamp” copy link directly to the clipboard.

> Automatically go back to home when episode ends.

> Go to specific episode by giving its URL on the command line.

> Tweaked user experience when copying and hovering over links.

<img src='http://i.imgur.com/6robqC6.png' width='48%' alt='Fog screenshot'><img src='https://i.imgur.com/qjs5b7J.png' width='48%' alt='Fog screenshot'>

## Install

[Download the latest version](https://github.com/vitorgalvao/fog/releases), or run `brew cask install fog` if you use [homebrew](http://brew.sh/).

## Development

Built with [Electron](http://electron.atom.io).

##### Commands

- Install dependencies: `npm install`
- Run: `npm start`
- Build for macOS: `npm run build-macos`
- Build for all platforms: `npm run build`
- Build for macOS and package as a zip: `npm run package-macos`
- Build for all platforms and package as a zip: `npm run package`

Currently, only macOS is supported. I do not intend to officially support other platforms in the near future since I cannot consistently and reliably test on them, but am willing to add support if someone wants to collaborate in doing the legwork.

#### License

The Unlicense (Public Domain, essentially)
