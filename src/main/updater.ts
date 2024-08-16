import { ipcMain } from "electron"
import { autoUpdater } from "electron-updater"

interface UpdaterProps {
  mainWindow: Electron.BrowserWindow
}

export default function updater({ mainWindow }: UpdaterProps) {
  // Check for updates in the background when the app is ready
  mainWindow.webContents.on('did-finish-load', () => {
    autoUpdater.checkForUpdatesAndNotify()
  })

  // Listen for update available event
  autoUpdater.on('update-available', () => {
    if (mainWindow) {
      mainWindow.webContents.send('update_available')
    }
  })

  // Listen for update downloaded event
  autoUpdater.on('update-downloaded', () => {
    if (mainWindow) {
      mainWindow.webContents.send('update_downloaded')
    }
  })

  ipcMain.on('download_update', () => {
    autoUpdater.downloadUpdate()
  })

  ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall()
  })
}