import './index.css'
import './styles/settings.css'
import * as q from './utils/query'
import { displayCards } from './components/cards'
import { openModal, closeModal } from './components/modal'
import { closeModalDelete, closeDrawer } from './utils/handlers'
import { dataService } from './api/dataService'
import { showSettings } from './components/settings'

let currentActiveTab = 'landing'

async function initApp() {
  try {
    await dataService.initialize()
    displayCards()
    console.log('Application initialized successfully')
  } catch (error) {
    console.error('Failed to initialize application:', error)
    displayCards()
  }
}

initApp()

q.overlay.addEventListener('click', () => {
  if (q.drawer.style.right === '0px') closeDrawer()
  if (q.modal.classList.contains('active')) closeModal()
  if (q.modalDelete.classList.contains('active')) closeModalDelete()
})

document.addEventListener('keyup', (e) => {
  if (e.key === 'Escape' && q.overlay.classList.contains('active')) {
    if (q.drawer.style.right === '0px') closeDrawer()
    if (q.modal.classList.contains('active')) closeModal()
    if (q.modalDelete.classList.contains('active')) closeModalDelete()
  }
})

q.landingBtn.addEventListener('click', () => {
  currentActiveTab = 'landing'
  q.landing.classList.add('active')
  q.favorites.classList.remove('active')
  q.landingBtn.classList.add('active')
  q.favoritesBtn.classList.remove('active')
  q.settingsBtn.classList.remove('active')
})

q.favoritesBtn.addEventListener('click', () => {
  currentActiveTab = 'favorites'
  q.landing.classList.remove('active')
  q.favorites.classList.add('active')
  q.landingBtn.classList.remove('active')
  q.favoritesBtn.classList.add('active')
  q.settingsBtn.classList.remove('active')
})

q.settingsBtn.addEventListener('click', () => {
  q.landingBtn.classList.remove('active')
  q.favoritesBtn.classList.remove('active')
  q.settingsBtn.classList.add('active')
  showSettings()
})

export function getCurrentActiveTab() {
  return currentActiveTab
}

export function restorePreviousTab() {
  if (currentActiveTab === 'landing') {
    q.landingBtn.classList.add('active')
    q.favoritesBtn.classList.remove('active')
  } else if (currentActiveTab === 'favorites') {
    q.landingBtn.classList.remove('active')
    q.favoritesBtn.classList.add('active')
  }
  q.settingsBtn.classList.remove('active')
}

q.recipeAddBtn.addEventListener('click', () => openModal(null))
