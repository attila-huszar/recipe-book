import { dataService } from '../api/dataService.js'
import { restorePreviousTab } from '../index.js'

export function createSettingsModal() {
  const settingsModal = document.createElement('div')
  settingsModal.className = 'settings-modal'
  settingsModal.innerHTML = `
    <div class="settings-overlay">
      <div class="settings-content">
        <div class="settings-header">
          <h2>Settings</h2>
          <button class="close-settings" aria-label="Close settings">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="settings-body">
          <div class="setting-group">
            <h3>Data Storage</h3>
            <div class="current-storage">
              <span>Storage type: <strong>Browser Storage (IndexedDB)</strong></span>
              <p class="storage-info">
                Your recipes are stored locally in your browser. This works offline and persists between sessions.
              </p>
            </div>
          </div>

          <div class="setting-group">
            <h3>Data Management</h3>
            <div class="data-actions">
              <button class="action-btn export-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7,10 12,15 17,10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Export Data
              </button>

              <button class="action-btn import-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17,8 12,3 7,8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                Import Data
              </button>

              <button class="action-btn reset-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="1 4 1 10 7 10"></polyline>
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                </svg>
                Reset to Default
              </button>

              <button class="action-btn clear-btn danger">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3,6 5,6 21,6"></polyline>
                  <path d="m19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                </svg>
                Clear All Data
              </button>
            </div>
          </div>
        </div>

        <div class="settings-footer">
          <button class="btn-secondary close-settings-btn">Close</button>
        </div>
      </div>
    </div>

    <input type="file" id="import-file-input" accept=".json" style="display: none;" />
  `

  settingsModal
    .querySelector('.close-settings')
    .addEventListener('click', closeSettings)
  settingsModal
    .querySelector('.close-settings-btn')
    .addEventListener('click', closeSettings)
  settingsModal
    .querySelector('.export-btn')
    .addEventListener('click', exportData)
  settingsModal
    .querySelector('.import-btn')
    .addEventListener('click', importData)
  settingsModal
    .querySelector('.reset-btn')
    .addEventListener('click', resetToDefault)
  settingsModal
    .querySelector('.clear-btn')
    .addEventListener('click', clearAllData)

  settingsModal
    .querySelector('.settings-overlay')
    .addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        closeSettings()
      }
    })

  function closeSettings() {
    restorePreviousTab()
    settingsModal.remove()
  }

  async function resetToDefault() {
    const confirmed = confirm(
      'Are you sure you want to reset to default recipes? This will clear all your current data and restore the original recipes.',
    )

    if (!confirmed) return

    try {
      await dataService.resetToDefault()
      showNotification('Data reset to default successfully!', 'success')

      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error('Failed to reset data:', error)
      showNotification('Failed to reset data: ' + error.message, 'error')
    }
  }

  async function exportData() {
    try {
      const data = await dataService.exportData()
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `recipe-book-backup-${
        new Date().toISOString().split('T')[0]
      }.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      showNotification('Data exported successfully!', 'success')
    } catch (error) {
      console.error('Failed to export data:', error)
      showNotification('Failed to export data: ' + error.message, 'error')
    }
  }

  function importData() {
    const fileInput = settingsModal.querySelector('#import-file-input')
    fileInput.addEventListener('change', handleFileImport)
    fileInput.click()
  }

  async function handleFileImport(event) {
    const file = event.target.files[0]
    if (!file) return

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      if (!data.recipes || !data.ingredients) {
        throw new Error('Invalid backup file format')
      }

      await dataService.importData(data)
      showNotification('Data imported successfully!', 'success')

      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error('Failed to import data:', error)
      showNotification('Failed to import data: ' + error.message, 'error')
    }
  }

  async function clearAllData() {
    const confirmed = confirm(
      'Are you sure you want to clear all data? This action cannot be undone.',
    )

    if (!confirmed) return

    try {
      await dataService.clearAllData()
      showNotification('All data cleared successfully!', 'success')

      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error('Failed to clear data:', error)
      showNotification('Failed to clear data: ' + error.message, 'error')
    }
  }

  function showNotification(message, type = 'info') {
    const notification = document.createElement('div')
    notification.className = `notification notification-${type}`
    notification.textContent = message
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${type === 'success' ? '#4ade80' : type === 'error' ? '#f87171' : type === 'warning' ? '#fbbf24' : '#60a5fa'};
      color: white;
      border-radius: 8px;
      z-index: 10000;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.remove()
    }, 3000)
  }

  return settingsModal
}

export function showSettings() {
  const existingModal = document.querySelector('.settings-modal')
  if (existingModal) {
    existingModal.remove()
  }

  const settingsModal = createSettingsModal()
  document.body.appendChild(settingsModal)
}
