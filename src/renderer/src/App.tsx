import { useEffect, useState } from "react"

declare global {
  interface Window {
    electron: {
      getAppVersion: () => Promise<{ version: string }>
      onUpdateAvailable: (callback: () => void) => void
      onUpdateDownloaded: (callback: () => void) => void
      downloadUpdate: () => void
      restartApp: () => void
    }
  }
}

export default function App() {
  const [version, setVersion] = useState<string>('');
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const [updateDownloaded, setUpdateDownloaded] = useState<boolean>(false);

  useEffect(() => {
    // Get the app version
    window.electron.getAppVersion().then(({ version }) => {
      setVersion(version);
    });

    // Listen for update available
    window.electron.onUpdateAvailable(() => {
      setUpdateAvailable(true);
    });

    // Listen for update downloaded
    window.electron.onUpdateDownloaded(() => {
      setUpdateDownloaded(true);
    });
  }, []);

  const handleDownloadUpdate = () => {
    window.electron.downloadUpdate();
  };

  const handleInstallUpdate = () => {
    window.electron.restartApp();
  };

  return (
    <div>
      <h1>App Version: {version}</h1>
      {updateAvailable && !updateDownloaded && (
        <div>
          <p>Update available! Would you like to download it?</p>
          <button onClick={handleDownloadUpdate}>Download Update</button>
        </div>
      )}
      {updateDownloaded && (
        <div>
          <p>Update downloaded! Would you like to install it now?</p>
          <button onClick={handleInstallUpdate}>Install Update</button>
        </div>
      )}
      {!updateAvailable && <p>Your app is up to date.</p>}
    </div>
  )
}