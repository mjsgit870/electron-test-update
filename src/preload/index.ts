import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// custom electronApi for renderer
const customElectronApi = {
  ...electronAPI,
  getAppVersion: () => ipcRenderer.invoke('app_version'),
  onUpdateAvailable: (callback: () => void) => ipcRenderer.on('update_available', callback),
  onUpdateDownloaded: (callback: () => void) => ipcRenderer.on('update_downloaded', callback),
  downloadUpdate: () => ipcRenderer.send('download_update'),
  restartApp: () => ipcRenderer.send('restart_app')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', customElectronApi)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
