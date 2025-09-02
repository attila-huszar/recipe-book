import * as q from '../utils/query'
import { displayCards, ingredientsData } from './cards'
import { dataService } from '../api/dataService'
import { openModal } from './modal'
import {
  openModalDelete,
  closeDrawer,
  removeAllChildren,
} from '../utils/handlers'
import '../styles/drawer.css'

export function populateDrawer(recipe) {
  removeAllChildren(q.drawerContent)
  removeAllChildren(q.drawerBg)

  if (!recipe) return

  const nameRow = document.createElement('div')
  nameRow.classList.add('detail-name-row')

  const name = document.createElement('h3')
  name.classList.add('detail-name')
  name.textContent = recipe.name

  const time = document.createElement('p')
  time.classList.add('detail-time')
  time.textContent = `${recipe.cookingTime} mins`

  const description = document.createElement('p')
  description.classList.add('detail-description')
  description.textContent = recipe.description

  const ingredientsH4 = document.createElement('h4')
  ingredientsH4.classList.add('detail-ingredients-h4')
  ingredientsH4.textContent = 'Ingredients'

  const ingredientList = document.createElement('ul')
  ingredientList.classList.add('detail-ingredients')

  recipe.ingredients.forEach((ingredient) => {
    const currentItem = ingredientsData.find(
      (ing) => ing.id === +ingredient.ingredientId,
    )

    if (currentItem) {
      const ingredientItem = document.createElement('li')
      ingredientItem.textContent = `${currentItem.name} — ${ingredient.amount} ${ingredient.amountType}${
        ingredient.amount > 1 ? 's' : ''
      }`
      ingredientList.append(ingredientItem)
    }
  })

  nameRow.append(name, time)
  q.drawerBg.append(nameRow)
  q.drawerContent.append(description, ingredientsH4, ingredientList)

  const favoriteBtn = document.createElement('div')
  favoriteBtn.classList.add('detail-bookmark-btn', 'detail-btn')

  if (recipe.isFavorite) {
    favoriteBtn.classList.add('active')
  }

  favoriteBtn.addEventListener('click', async (e) => {
    e.stopPropagation()
    const recipeId = +recipe.id

    try {
      if (e.target.classList.contains('active')) {
        e.target.classList.remove('active')
        await dataService.removeFavorite(recipeId)
      } else {
        e.target.classList.add('active')
        await dataService.addFavorite(recipeId)
      }

      displayCards()
    } catch (error) {
      console.error('Failed to update favorite status:', error)
      if (e.target.classList.contains('active')) {
        e.target.classList.remove('active')
      } else {
        e.target.classList.add('active')
      }
    }
  })

  const editBtn = document.createElement('div')
  editBtn.classList.add('detail-edit-btn', 'detail-btn')
  editBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    closeDrawer()

    openModal(recipe)
  })

  const delBtn = document.createElement('div')
  delBtn.classList.add('detail-delete-btn', 'detail-btn')
  delBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    closeDrawer()

    openModalDelete(+recipe.id)
  })

  q.drawerContent.append(favoriteBtn, editBtn, delBtn)
}
