import { indexedDBService } from './indexeddb.js'

class DataService {
  constructor() {
    this.isInitialized = false
  }

  async loadRecipes() {
    try {
      const response = await fetch('/recipes.json')
      if (!response.ok) {
        console.warn('Could not load recipes.json, using fallback data')
        return this.getFallbackRecipes()
      }
      return await response.json()
    } catch (error) {
      console.warn('Failed to load recipes.json, using fallback data:', error)
      return this.getFallbackRecipes()
    }
  }

  async loadIngredients() {
    try {
      const response = await fetch('/ingredients.json')
      if (!response.ok) {
        console.warn('Could not load ingredients.json, using fallback data')
        return this.getFallbackIngredients()
      }
      return await response.json()
    } catch (error) {
      console.warn('Failed to load ingredients.json, using fallback data:', error)
      return this.getFallbackIngredients()
    }
  }

  getFallbackRecipes() {
    return [
      {
        id: 1,
        name: 'Chocolate Chip Cookies',
        description: 'Classic homemade chocolate chip cookies',
        label: 'Dessert',
        cookingTime: 15,
        isFavorite: false,
        isPopular: true,
        ingredients: [
          { ingredientId: 1, amount: 2, amountType: 'cup' },
          { ingredientId: 2, amount: 1, amountType: 'cup' },
          { ingredientId: 3, amount: 0.5, amountType: 'cup' },
        ],
      },
      {
        id: 2,
        name: 'Caesar Salad',
        description: 'Classic salad with romaine lettuce, croutons, and Caesar dressing',
        label: 'Salad',
        cookingTime: 10,
        isFavorite: true,
        isPopular: false,
        ingredients: [
          { ingredientId: 7, amount: 1, amountType: 'piece' },
          { ingredientId: 8, amount: 1, amountType: 'cup' },
          { ingredientId: 9, amount: 2, amountType: 'tablespoon' },
        ],
      },
    ]
  }

  getFallbackIngredients() {
    return [
      { id: 1, name: 'Flour' },
      { id: 2, name: 'Sugar' },
      { id: 3, name: 'Butter' },
      { id: 4, name: 'Chicken breast' },
      { id: 5, name: 'Breadcrumbs' },
      { id: 6, name: 'Tomato sauce' },
      { id: 7, name: 'Romaine lettuce' },
      { id: 8, name: 'Croutons' },
      { id: 9, name: 'Caesar dressing' },
      { id: 11, name: 'Milk' },
      { id: 12, name: 'Eggs' },
    ]
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
