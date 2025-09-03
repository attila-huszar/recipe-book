import { dataService } from '../api/dataService'
import { ingredientsData, displayCards } from './cards'
import { removeAllChildren } from '../utils/handlers'
import * as q from '../utils/query'
import '../styles/modal.css'

let addSubmitEvent
let addIngredientsEvent
let inputTimePreventLetter
let inputQuantityPreventLetter
const amountTypes = ['cup', 'tablespoon', 'piece', 'ounce', 'pound', 'cloves']

function populateModal(recipe) {
  addIngredientsEvent = (idx) => {
    const dropdown = document.createElement('select')
    dropdown.classList.add('select-ingredient')

    createDropdown(dropdown, q.formIngredients)

    if (recipe && typeof idx === 'number') {
      dropdown.value = recipe.ingredients[idx].ingredientId
    } else {
      dropdown.value = ''
    }

    const quantity = document.createElement('input')
    quantity.classList.add('input-quantity')
    quantity.setAttribute('type', 'text')

    inputQuantityPreventLetter = (event) => {
      if (
        /\D/.test(event.key) &&
        event.key !== 'Backspace' &&
        event.key !== 'ArrowLeft' &&
        event.key !== 'ArrowRight' &&
        event.key !== 'Tab'
      ) {
        event.preventDefault()
      }
    }
    quantity.addEventListener('keydown', inputQuantityPreventLetter)

    if (recipe && typeof idx === 'number') {
      quantity.value = recipe.ingredients[idx].amount
    } else {
      quantity.value = ''
    }

    const quantityUnit = document.createElement('select')
    quantityUnit.classList.add('select-quantity-unit')

    for (let j = 0; j < 6; j += 1) {
      const option = document.createElement('option')
      option.value = amountTypes[j]
      option.textContent = amountTypes[j]
      quantityUnit.append(option)
    }

    if (recipe && typeof idx === 'number') {
      quantityUnit.value = recipe.ingredients[idx].amountType
    } else {
      quantityUnit.value = ''
    }

    const formDelBtn = document.createElement('div')
    formDelBtn.classList.add('form-delete-btn')

    formDelBtn.addEventListener('click', (e) => {
      for (let s = 0; s < 4; s += 1) {
        e.target.previousSibling.remove()
      }
    })

    q.formIngredients.append(quantity, quantityUnit, formDelBtn)
  }

  if (recipe === null) {
    q.modalTitle.textContent = 'Adding New Recipe'
    q.modalSubmitBtn.textContent = 'Add New Recipe'
    q.formRecipeName.value = ''
    q.formTime.value = ''
    q.formDescription.value = ''
    removeAllChildren(q.formIngredients)

    addIngredientsEvent(null)
    submitType(async (name, time, description, ingredients) => {
      await dataService.addRecipe(name, time, description, ingredients)
    }, null)
  } else if (recipe) {
    q.modalTitle.textContent = 'Editing Your Recipe'
    q.modalSubmitBtn.textContent = 'Edit Recipe'
    q.formRecipeName.value = recipe.name
    q.formTime.value = recipe.cookingTime
    q.formDescription.value = recipe.description
    removeAllChildren(q.formIngredients)

    for (let i = 0; i < recipe.ingredients.length; i += 1) {
      addIngredientsEvent(i)
    }
    submitType(async (name, time, description, ingredients, id) => {
      await dataService.editRecipe(name, time, description, ingredients, id)
    }, recipe)
  }

  q.formAddIngredientBtn.addEventListener('click', addIngredientsEvent)
}

function createDropdown(htmlSelect, parent) {
  ingredientsData.forEach((item) => {
    const option = document.createElement('option')
    option.value = item.id
    option.textContent = item.name
    htmlSelect.append(option)
  })

  parent.append(htmlSelect)
}

function submitType(submitForm, recipe) {
  addSubmitEvent = async () => {
    const selectIngredientAll = document.querySelectorAll('.select-ingredient')
    const inputQuantityAll = document.querySelectorAll('.input-quantity')
    const selectQuantityUnitAll = document.querySelectorAll(
      '.select-quantity-unit',
    )

    const newIngredients = []
    for (let i = 0; i < selectIngredientAll.length; i += 1) {
      newIngredients.push({
        ingredientId: +selectIngredientAll[i].value || 1,
        amount: +inputQuantityAll[i].value || 1,
        amountType: selectQuantityUnitAll[i].value || 'cup',
      })
    }

    try {
      await submitForm(
        q.formRecipeName.value || 'New Recipe',
        +q.formTime.value || 10,
        q.formDescription.value,
        newIngredients,
        recipe?.id,
      )
      displayCards()
      closeModal()
    } catch (error) {
      console.error('Failed to save recipe:', error)
      alert('Failed to save recipe. Please try again.')
    }
  }

  q.modalSubmitBtn.addEventListener('click', addSubmitEvent)
}

export function openModal(recipe) {
  populateModal(recipe)
  q.overlay.classList.add('active')
  q.modal.classList.add('active')

  inputTimePreventLetter = (event) => {
    if (
      /\D/.test(event.key) &&
      event.key !== 'Backspace' &&
      event.key !== 'ArrowLeft' &&
      event.key !== 'ArrowRight' &&
      event.key !== 'Tab'
    ) {
      event.preventDefault()
    }
  }
  q.formTime.addEventListener('keydown', inputTimePreventLetter)
  q.modalCloseBtn.addEventListener('click', closeModal)
}

export function closeModal() {
  q.overlay.classList.remove('active')
  q.modal.classList.remove('active')
  q.formAddIngredientBtn.removeEventListener('click', addIngredientsEvent)
  q.modalSubmitBtn.removeEventListener('click', addSubmitEvent)
  q.formTime.removeEventListener('keydown', inputTimePreventLetter)
  q.formIngredients.querySelectorAll('input-quantity').forEach((item) => {
    item.removeEventListener('keydown', inputQuantityPreventLetter)
  })
  q.modalCloseBtn.removeEventListener('click', closeModal)
}
