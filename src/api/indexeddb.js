const DB_NAME = 'RecipeBookDB'
const DB_VERSION = 1
const RECIPES_STORE = 'recipes'
const INGREDIENTS_STORE = 'ingredients'

class IndexedDBService {
  constructor() {
    this.db = null
    this.isInitialized = false
  }

  async init() {
    if (this.isInitialized && this.db) {
      return this.db
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result
        this.isInitialized = true
        console.log('IndexedDB initialized successfully')
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result
        console.log('Setting up IndexedDB stores...')

        if (!db.objectStoreNames.contains(RECIPES_STORE)) {
          const recipesStore = db.createObjectStore(RECIPES_STORE, {
            keyPath: 'id',
            autoIncrement: true,
          })
          recipesStore.createIndex('name', 'name', { unique: false })
          recipesStore.createIndex('isFavorite', 'isFavorite', {
            unique: false,
          })
          recipesStore.createIndex('isPopular', 'isPopular', { unique: false })
        }

        if (!db.objectStoreNames.contains(INGREDIENTS_STORE)) {
          const ingredientsStore = db.createObjectStore(INGREDIENTS_STORE, {
            keyPath: 'id',
            autoIncrement: true,
          })
          ingredientsStore.createIndex('name', 'name', { unique: false })
        }

        console.log('IndexedDB stores created successfully')
      }
    })
  }

  async getRecipes() {
    await this.init()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([RECIPES_STORE], 'readonly')
      const store = transaction.objectStore(RECIPES_STORE)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => {
        console.error('Failed to fetch recipes:', request.error)
        reject(request.error)
      }
    })
  }

  async getIngredients() {
    await this.init()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([INGREDIENTS_STORE], 'readonly')
      const store = transaction.objectStore(INGREDIENTS_STORE)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => {
        console.error('Failed to fetch ingredients:', request.error)
        reject(request.error)
      }
    })
  }

  async addRecipe(recipe) {
    await this.init()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([RECIPES_STORE], 'readwrite')
      const store = transaction.objectStore(RECIPES_STORE)
      const request = store.add(recipe)

      request.onsuccess = () => {
        const newRecipe = { ...recipe, id: request.result }
        console.log('Recipe added successfully:', newRecipe)
        resolve(newRecipe)
      }
      request.onerror = () => {
        console.error('Failed to add recipe:', request.error)
        reject(request.error)
      }
    })
  }

  async updateRecipe(id, updates) {
    await this.init()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([RECIPES_STORE], 'readwrite')
      const store = transaction.objectStore(RECIPES_STORE)

      const getRequest = store.get(id)
      getRequest.onsuccess = () => {
        if (getRequest.result) {
          const updatedRecipe = { ...getRequest.result, ...updates }
          const putRequest = store.put(updatedRecipe)

          putRequest.onsuccess = () => {
            console.log('Recipe updated successfully:', updatedRecipe)
            resolve(updatedRecipe)
          }
          putRequest.onerror = () => {
            console.error('Failed to update recipe:', putRequest.error)
            reject(putRequest.error)
          }
        } else {
          reject(new Error(`Recipe with id ${id} not found`))
        }
      }
      getRequest.onerror = () => {
        console.error('Failed to fetch recipe for update:', getRequest.error)
        reject(getRequest.error)
      }
    })
  }

  async deleteRecipe(id) {
    await this.init()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([RECIPES_STORE], 'readwrite')
      const store = transaction.objectStore(RECIPES_STORE)
      const request = store.delete(id)

      request.onsuccess = () => {
        console.log('Recipe deleted successfully:', id)
        resolve(id)
      }
      request.onerror = () => {
        console.error('Failed to delete recipe:', request.error)
        reject(request.error)
      }
    })
  }

  async addFavorite(id) {
    return this.updateRecipe(id, { isFavorite: true })
  }

  async removeFavorite(id) {
    return this.updateRecipe(id, { isFavorite: false })
  }

  async addIngredient(ingredient) {
    await this.init()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([INGREDIENTS_STORE], 'readwrite')
      const store = transaction.objectStore(INGREDIENTS_STORE)
      const request = store.add(ingredient)

      request.onsuccess = () => {
        const newIngredient = { ...ingredient, id: request.result }
        console.log('Ingredient added successfully:', newIngredient)
        resolve(newIngredient)
      }
      request.onerror = () => {
        console.error('Failed to add ingredient:', request.error)
        reject(request.error)
      }
    })
  }

  async initializeWithSampleData(recipes = [], ingredients = []) {
    await this.init()

    const transaction = this.db.transaction(
      [RECIPES_STORE, INGREDIENTS_STORE],
      'readwrite',
    )

    try {
      if (ingredients.length > 0) {
        const ingredientsStore = transaction.objectStore(INGREDIENTS_STORE)
        for (const ingredient of ingredients) {
          ingredientsStore.add(ingredient)
        }
      }

      if (recipes.length > 0) {
        const recipesStore = transaction.objectStore(RECIPES_STORE)
        for (const recipe of recipes) {
          recipesStore.add(recipe)
        }
      }

      return new Promise((resolve, reject) => {
        transaction.oncomplete = () => {
          console.log('Sample data initialized successfully')
          resolve()
        }
        transaction.onerror = () => {
          console.error('Failed to initialize sample data:', transaction.error)
          reject(transaction.error)
        }
      })
    } catch (error) {
      console.error('Error initializing sample data:', error)
      throw error
    }
  }

  async clearAllData() {
    await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(
        [RECIPES_STORE, INGREDIENTS_STORE],
        'readwrite',
      )

      const recipesStore = transaction.objectStore(RECIPES_STORE)
      const ingredientsStore = transaction.objectStore(INGREDIENTS_STORE)

      recipesStore.clear()
      ingredientsStore.clear()

      transaction.oncomplete = () => {
        console.log('All data cleared successfully')
        resolve()
      }

      transaction.onerror = () => {
        console.error('Failed to clear data:', transaction.error)
        reject(transaction.error)
      }
    })
  }

  async closeConnection() {
    if (this.db) {
      this.db.close()
      this.db = null
      this.isInitialized = false
      console.log('IndexedDB connection closed')
    }
  }
}

export const indexedDBService = new IndexedDBService()
export { IndexedDBService }
