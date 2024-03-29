import * as q from './query'
import { populateDrawer } from '../components/drawer'
import { displayCards } from '../components/cards'
import { deleteRecipe } from '../api/fetch'

export function openDrawer(recipe) {
  populateDrawer(recipe)
  q.overlay.classList.add('active')
  q.drawer.style.right = '0'
  q.drawerCloseBtn.addEventListener('click', closeDrawer)
}

export function closeDrawer() {
  q.overlay.classList.remove('active')
  q.drawer.style.right = '-600px'
  q.drawerCloseBtn.removeEventListener('click', closeDrawer)
}

let deleteEventHandler

export function openModalDelete(id) {
  q.overlay.classList.add('active')
  q.modalDelete.classList.add('active')
  deleteEventHandler = () => {
    deleteRecipe(id)
    displayCards()
    closeModalDelete()
  }
  q.modalDeleteBtnYes.addEventListener('click', deleteEventHandler)
  q.modalDeleteBtnNo.addEventListener('click', closeModalDelete)
  q.modalDeleteCloseBtn.addEventListener('click', closeModalDelete)
}

export function closeModalDelete() {
  q.overlay.classList.remove('active')
  q.modalDelete.classList.remove('active')
  q.modalDeleteBtnYes.removeEventListener('click', deleteEventHandler)
  q.modalDeleteBtnNo.removeEventListener('click', closeModalDelete)
  q.modalDeleteCloseBtn.removeEventListener('click', closeModalDelete)
}

export function removeAllChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild)
  }
}
