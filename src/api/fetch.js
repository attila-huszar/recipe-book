const RECIPES_URL = process.env.RECIPES_URL
const INGREDIENTS_URL = process.env.INGREDIENTS_URL

export async function fetchData(url, options) {
  try {
    const response = await fetch(url, options)
    const data = await response.json()
    return data
  } catch (error) {
    return error
  }
}

export function getRecipes() {
  return fetchData(RECIPES_URL)
}

export function getIngredients() {
  return fetchData(INGREDIENTS_URL)
}

export function addFavorite(id) {
  fetchData(`${RECIPES_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      isFavorite: true,
    }),
  })
}

export function removeFavorite(id) {
  fetchData(`${RECIPES_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      isFavorite: false,
    }),
  })
}

export function addRecipe(name, time, description, ingredients) {
  fetchData(RECIPES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      description,
      label: '',
      cookingTime: time,
      isFavorite: false,
      isPopular: false,
      ingredients,
    }),
  })
}

export function editRecipe(name, time, description, ingredients, id) {
  fetchData(`${RECIPES_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      description,
      cookingTime: time,
      ingredients,
    }),
  })
}

export function deleteRecipe(id) {
  fetchData(`${RECIPES_URL}/${id}`, {
    method: 'DELETE',
  })
}
