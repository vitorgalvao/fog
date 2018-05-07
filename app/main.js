const { app, BrowserWindow, globalShortcut, ipcMain, Menu } = require('electron')
const windowStateKeeper = require('electron-window-state');
let mainWindow;

// Main app menu
const name = app.getName();
const webviewId = 'overcast_webview';
const appWebsite = 'https://github.com/vitorgalvao/fog/';
const template = [
  {
    label: 'Application',
    submenu: [
      { label: 'About ' + name, role: 'about' },
      { type: 'separator' },
      { label: 'Hide ' + name, accelerator: 'Command+H', role: 'hide' },
      { label: 'Hide Others', accelerator: 'Command+Shift+H', role: 'hideothers' },
      { type: 'separator' },
      { label: 'Quit', accelerator: 'Command+Q', click: function () { app.quit(); } }
    ]
  }, {
    label: 'Edit',
    submenu: [
      { label: 'Undo', accelerator: 'Command+Z', role: 'undo' },
      { label: 'Redo', accelerator: 'Shift+Command+Z', role: 'redo' },
      { type: 'separator' },
      { label: 'Cut', accelerator: 'Command+X', role: 'cut' },
      { label: 'Copy', accelerator: 'Command+C', role: 'copy' },
      { label: 'Paste', accelerator: 'Command+V', role: 'paste' },
      { label: 'Select All', accelerator: 'Command+A', role: 'selectall' }
    ]
  }, {
    label: 'View',
    submenu: [
      { label: 'Reload', accelerator: 'Command+R', click: function (item, focusedWindow) { if (focusedWindow) focusedWindow.webContents.executeJavaScript('document.getElementById(' + webviewId + ').reload()'); } }
    ]
  }, {
    label: 'Window',
    role: 'window',
    submenu: [
      { label: 'Minimize', accelerator: 'Command+M', role: 'minimize' },
      { label: 'Close', accelerator: 'Command+W', role: 'close' }
    ]
  }, {
    label: 'Help',
    role: 'help',
    submenu: [
      { label: 'View Website', click: function () { require('electron').shell.openExternal(appWebsite) } },
      { type: 'separator' },
      { label: 'Toggle Developer Tools', click: function (item, focusedWindow) { if (focusedWindow) focusedWindow.toggleDevTools(); } }
    ]
  }
];

function focus_webview() {
  mainWindow.webContents.executeJavaScript('document.getElementById("overcast_webview").focus();');
}

function get_hostname(url) {
  if (url.indexOf('://') > -1) {
    return url.split('/')[2];
  } else {
    return url.split('/')[0];
  }
}

app.on('ready', function () {
  const min_window_size = [352, 556]

  // Initial window state
  const mainWindowState = windowStateKeeper({
    defaultWidth: min_window_size[0],
    defaultHeight: min_window_size[1]
  });

  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: min_window_size[0],
    minHeight: min_window_size[1],
    titleBarStyle: 'hidden-inset',
    title: 'Fog',
    backgroundColor: '#fff',
    show: false // Avoid initial flash of no content by not showing window on start…
  });

  // … and only showing the window after the DOM is ready on the webview
  ipcMain.on('page-loaded', function () {
    mainWindow.show();
  });

  // Add listeners to check for window maximization and save state
  mainWindowState.manage(mainWindow);

  // Load the index.html of the app and focus on webview
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  focus_webview();

  // If given an overcast.fm URL as the argument, try to load it
  const overcast_url = process.argv[1];
  if (overcast_url) {
    if (get_hostname(overcast_url) != 'overcast.fm') throw new Error('Argument needs to be an overcast.fm URL')
    mainWindow.webContents.executeJavaScript('document.getElementById("overcast_webview").src = "' + overcast_url + '"');
  }

  // Media keys shortcuts
  globalShortcut.register('MediaPreviousTrack', function () { mainWindow.webContents.send('media_keys', 'seekbackbutton') });
  globalShortcut.register('MediaNextTrack', function () { mainWindow.webContents.send('media_keys', 'seekforwardbutton'); });
  globalShortcut.register('MediaPlayPause', function () { mainWindow.webContents.send('media_keys', 'playpausebutton'); });

  // Set menu
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  // Focus on webview when focusing on window, so we can use keyboard shortcuts
  app.on('browser-window-focus', function () {
    focus_webview();
  });

  // Prevent app from exiting (hide it instead) when window is closed (i.e. when we press the red close button)
  mainWindow.on('close', function (event) {
    event.preventDefault();
    mainWindow.hide();
    app.focus();
  });

  app.on('before-quit', function () {
    globalShortcut.unregisterAll();
    mainWindow.webContents.send('sync_podcast'); // Try to force a sync before closing

    setTimeout(function () { // Give enough time for the sync attempt to go through
      app.exit(0);
    }, 1500);
  });

  app.on('activate', function () {
    mainWindow.show();
  });
});
