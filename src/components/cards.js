import '../styles/cards.css'
import * as q from '../utils/query'
import { dataService } from '../api/dataService'
import {
  openDrawer,
  openModalDelete,
  removeAllChildren,
} from '../utils/handlers'
import { openModal } from './modal'

let ingredientsData = []

async function initializeIngredients() {
  try {
    ingredientsData = await dataService.getIngredients()
  } catch (error) {
    console.error('Failed to load ingredients:', error)
    ingredientsData = []
  }
}

export { ingredientsData }

export async function displayCards() {
  try {
    if (ingredientsData.length === 0) {
      await initializeIngredients()
    }

    const recipesData = await dataService.getRecipes()

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
  } catch (error) {
    console.error('Failed to display cards:', error)
    createErrorDiv(q.recipesDaily, q.recipesExplore, q.recipesFav)
  }
}

function populateCards(recipe, parent) {
  const favoriteBtn = document.createElement('div')
  favoriteBtn.classList.add('recipe-bookmark-btn', 'card-btn')

  if (recipe.isFavorite) {
    favoriteBtn.classList.add('active')
  }

  favoriteBtn.addEventListener('click', async (e) => {
    e.stopPropagation()
    const cardId = +e.target.parentElement.dataset.cardId

    try {
      if (e.target.classList.contains('active')) {
        e.target.classList.remove('active')
        await dataService.removeFavorite(cardId)
      } else {
        e.target.classList.add('active')
        await dataService.addFavorite(cardId)
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
