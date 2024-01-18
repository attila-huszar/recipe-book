import '../styles/cards.css'
import * as q from '../utils/query'
import {
  getRecipes,
  getIngredients,
  addFavorite,
  removeFavorite,
} from '../api/fetch'
import {
  openDrawer,
  openModalDelete,
  removeAllChildren,
} from '../utils/handlers'
import { openModal } from './modal'

export const ingredientsData = await getIngredients()

export async function displayCards() {
  const recipesData = await getRecipes()

  removeAllChildren(q.recipesExplore)
  removeAllChildren(q.recipesDaily)
  removeAllChildren(q.recipesFav)

  if (recipesData.length) {
    let recipePopularCounter = 0
    let recipeFavoriteCounter = 0

    recipesData.forEach((recipe) => {
      const cardExplore = document.createElement('div')
      cardExplore.setAttribute('data-card-id', recipe.id)
      cardExplore.classList.add('recipe-card')
      q.recipesExplore.append(cardExplore)

      populateCards(recipe, cardExplore)

      cardExplore.addEventListener('click', () => openDrawer(recipe))

      if (recipe.isPopular) {
        recipePopularCounter += 1

        const cardDaily = document.createElement('div')
        cardDaily.setAttribute('data-card-id', recipe.id)
        cardDaily.classList.add('recipe-card')
        q.recipesDaily.append(cardDaily)

        populateCards(recipe, cardDaily)

        cardDaily.addEventListener('click', () => openDrawer(recipe))
      }

      if (recipe.isFavorite) {
        recipeFavoriteCounter += 1

        const cardFavorite = document.createElement('div')
        cardFavorite.setAttribute('data-card-id', recipe.id)
        cardFavorite.classList.add('recipe-card')
        q.recipesFav.append(cardFavorite)

        populateCards(recipe, cardFavorite)

        cardFavorite.addEventListener('click', () => openDrawer(recipe))
      }
    })

    if (!recipePopularCounter) {
      createErrorDiv(q.recipesDaily)
    }

    if (!recipeFavoriteCounter) {
      createErrorDiv(q.recipesFav)
    }
  } else if (recipesData instanceof Error || !recipesData.length) {
    createErrorDiv(q.recipesDaily, q.recipesExplore, q.recipesFav)
  }
}

function populateCards(recipe, parent) {
  const favoriteBtn = document.createElement('div')
  favoriteBtn.classList.add('recipe-bookmark-btn', 'card-btn')

  if (recipe.isFavorite) {
    favoriteBtn.classList.add('active')
  }

  favoriteBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    if (e.target.classList.contains('active')) {
      e.target.classList.remove('active')
      removeFavorite(+e.target.parentElement.dataset.cardId)
    } else {
      e.target.classList.add('active')
      addFavorite(+e.target.parentElement.dataset.cardId)
    }

    displayCards()
  })

  const editBtn = document.createElement('div')
  editBtn.classList.add('recipe-edit-btn', 'card-btn')

  editBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    openModal(recipe)
  })

  const delBtn = document.createElement('div')
  delBtn.classList.add('recipe-delete-btn', 'card-btn')

  delBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    openModalDelete(+e.target.parentElement.dataset.cardId)
  })

  const name = document.createElement('p')
  name.classList.add('recipe-name')
  name.textContent = recipe.name

  const ingredients = document.createElement('p')
  ingredients.classList.add('recipe-ingredients')
  ingredients.textContent = `${recipe.ingredients.length} ingredient${recipe.ingredients.length > 1 ? 's' : ''}`

  const time = document.createElement('p')
  time.classList.add('recipe-time')
  time.textContent = `${recipe.cookingTime} mins`

  parent.append(favoriteBtn, editBtn, delBtn, name, ingredients, time)
}

function createErrorDiv(...parents) {
  const errorDiv = document.createElement('div')
  errorDiv.classList.add('error-div')
  errorDiv.textContent = '😶 No recipes to display'
  parents.forEach((elem) => {
    elem.append(errorDiv.cloneNode(true))
  })
}
