import { indexedDBService } from './indexedDB'

class DataService {
  constructor() {
    this.isInitialized = false
  }

  async loadRecipes() {
    try {
      const response = await fetch('/recipes.json')
      return await response.json()
    } catch (error) {
      console.error('Failed to load recipes:', error)
      return []
    }
  }

  async loadIngredients() {
    try {
      const response = await fetch('/ingredients.json')
      return await response.json()
    } catch (error) {
      console.error('Failed to load ingredients:', error)
      return []
    }
  }

  async initialize() {
    if (this.isInitialized) {
      return
    }

    try {
      await indexedDBService.init()

      const existingRecipes = await indexedDBService.getRecipes()
      const existingIngredients = await indexedDBService.getIngredients()

      if (existingRecipes.length === 0 && existingIngredients.length === 0) {
        console.log('Seeding IndexedDB with initial data from JSON files...')
        await this.seedDatabase()
      }

      this.isInitialized = true
      console.log('DataService initialized successfully with IndexedDB')
    } catch (error) {
      console.error('Failed to initialize DataService:', error)
      throw error
    }
  }

  async seedDatabase() {
    try {
      const ingredients = await this.loadIngredients()
      const recipes = await this.loadRecipes()

      if (ingredients && ingredients.length > 0) {
        console.log(`Seeding ${ingredients.length} ingredients...`)
        await indexedDBService.initializeWithSampleData([], ingredients)
      }

      if (recipes && recipes.length > 0) {
        console.log(`Seeding ${recipes.length} recipes...`)
        await indexedDBService.initializeWithSampleData(recipes, [])
      }

      console.log('Database seeding completed successfully')
    } catch (error) {
      console.error('Failed to seed database:', error)
      throw error
    }
  }

  async getRecipes() {
    await this.initialize()
    return await indexedDBService.getRecipes()
  }

  async getIngredients() {
    await this.initialize()
    return await indexedDBService.getIngredients()
  }

  async addFavorite(id) {
    await this.initialize()
    return await indexedDBService.addFavorite(id)
  }

  async removeFavorite(id) {
    await this.initialize()
    return await indexedDBService.removeFavorite(id)
  }

  async addRecipe(name, time, description, ingredients) {
    await this.initialize()
    const recipe = {
      name,
      description,
      label: '',
      cookingTime: time,
      isFavorite: false,
      isPopular: false,
      ingredients,
    }
    return await indexedDBService.addRecipe(recipe)
  }

  async editRecipe(name, time, description, ingredients, id) {
    await this.initialize()
    const updates = {
      name,
      description,
      cookingTime: time,
      ingredients,
    }
    return await indexedDBService.updateRecipe(id, updates)
  }

  async deleteRecipe(id) {
    await this.initialize()
    return await indexedDBService.deleteRecipe(id)
  }

  async addIngredient(name) {
    await this.initialize()
    const ingredient = { name }
    return await indexedDBService.addIngredient(ingredient)
  }

  getCurrentStorageType() {
    return 'indexeddb'
  }

  async exportData() {
    await this.initialize()
    const recipes = await this.getRecipes()
    const ingredients = await this.getIngredients()

    return {
      recipes,
      ingredients,
      exportDate: new Date().toISOString(),
      storageType: 'indexeddb',
    }
  }

  async importData(data) {
    await this.initialize()

    await indexedDBService.clearAllData()

    await indexedDBService.initializeWithSampleData(
      data.recipes || [],
      data.ingredients || [],
    )

    console.log('Data imported successfully to IndexedDB')
  }

  async clearAllData() {
    await this.initialize()
    return await indexedDBService.clearAllData()
  }

  async resetToDefault() {
    await this.initialize()
    await indexedDBService.clearAllData()
    await this.seedDatabase()
    console.log('Database reset to default state')
  }
}

export const dataService = new DataService()
export { DataService }
