import './index.css'
import * as q from './utils/query'
import { displayCards } from './components/cards'
import { openModal, closeModal } from './components/modal'
import { closeModalDelete, closeDrawer } from './utils/handlers'

displayCards()

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
  q.landing.classList.add('active')
  q.favorites.classList.remove('active')
  q.landingBtn.classList.add('active')
  q.favoritesBtn.classList.remove('active')
})

q.favoritesBtn.addEventListener('click', () => {
  q.landing.classList.remove('active')
  q.favorites.classList.add('active')
  q.landingBtn.classList.remove('active')
  q.favoritesBtn.classList.add('active')
})

q.recipeAddBtn.addEventListener('click', () => openModal(null))
