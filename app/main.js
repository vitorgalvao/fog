'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = require('menu');
const globalShortcut = electron.globalShortcut;

const windowStateKeeper = require('electron-window-state');

let mainWindow;

function focus_webview() {
  mainWindow.webContents.executeJavaScript('document.getElementById("overcast_webview").focus();');
}

app.on('ready', function() {
  // Initial window state
  let mainWindowState = windowStateKeeper({
    defaultWidth: 352,
    defaultHeight: 556
  });

  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 298,
    minHeight: 502,
    titleBarStyle: 'hidden-inset',
    title: 'Fog'
  });

  // Add listeners to check for window maximization and save state
  mainWindowState.manage(mainWindow);

  // Load the index.html of the app and focus on webview
  mainWindow.loadURL('file://' + __dirname + '/index.html')
  focus_webview();

  // Media keys shortcuts
  globalShortcut.register('MediaPreviousTrack', function() { mainWindow.webContents.send('media_keys', 'seekbackbutton') });
  globalShortcut.register('MediaNextTrack', function() { mainWindow.webContents.send('media_keys', 'seekforwardbutton') });
  globalShortcut.register('MediaPlayPause', function() { mainWindow.webContents.send('media_keys', 'playpausebutton'); });

  // Main app menu
  let name = electron.app.getName();
  let template = [
    {
      label: 'Application',
      submenu: [
        { label: 'About ' + name, role: 'about' },
        { type: 'separator' },
        { label: 'Hide ' + name, accelerator: 'Command+H', role: 'hide' },
        { label: 'Hide Others', accelerator: 'Command+Shift+H', role: 'hideothers' },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'Command+Q', click: function() {app.quit();} }
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
        { label: 'Reload', accelerator: 'Command+R', click: function(item,focusedWindow) {if (focusedWindow) focusedWindow.webContents.executeJavaScript('document.getElementById("overcast_webview").reload()');} }
      ]
    }, {
      label: 'Window',
      submenu: [
        { label: 'Minimize', accelerator: 'Command+M', role: 'minimize' },
        { label: 'Close', accelerator: 'Command+W', role: 'hide' }
      ]
    }, {
      label: 'Help',
      role: 'help',
      submenu: [
        { label: 'View Website', click: function() { require('electron').shell.openExternal('https://github.com/vitorgalvao/fog/') } },
        { type: 'separator' },
        { label: 'Toggle Developer Tools', click: function(item,focusedWindow) {if (focusedWindow) focusedWindow.toggleDevTools();} }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  // Focus on webview when focusing on window, so we can use keyboard shortcuts
  app.on('browser-window-focus', function() {
    focus_webview();
  });

});
