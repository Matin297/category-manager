import { createContext, useContext, useReducer } from 'react'
import DATA from '../data'

const ADD_CATEGORY = 'ADD_CATEGORY'
const REMOVE_CATEGORY = 'REMOVE_CATEGORY'

export const addCategory = (payload, dispatch) => dispatch({ type: ADD_CATEGORY, payload })
export const removeCategory = (payload, dispatch) => dispatch({ type: REMOVE_CATEGORY, payload })

function categoriesReducer(state, { type, payload }) {
    switch(type) {
      case ADD_CATEGORY: {
        const { parentId = 'p', name } = payload
        const id = Date.now()
        const parent = state[parentId]

        return {
            ...state,
            [parentId]: {
                ...parent,
                subCategories: parent.subCategories.concat(id)
            },
            [id]: {
              name,
              id,
              subCategories: []
            }
        }
      }
      
      case REMOVE_CATEGORY: {
        const { id, parentId = 'p' } = payload
        const parent = state[parentId]
        const newState = { 
          ...state,
          [parentId]: {
            ...parent,
            subCategories: parent.subCategories.filter(categoryId => categoryId !== id)
          }
        }

        removeCategoryRecursive(newState, id)

        return newState;
      }

      default: 
        return state;
    }
  }

const CategoryContext = createContext({})

function CategoryProvider({ children }) {
    const reducedValue = useReducer(categoriesReducer, DATA)
    return <CategoryContext.Provider value={reducedValue}>{children}</CategoryContext.Provider>
}

export default CategoryProvider

export function useCategory() {
    return useContext(CategoryContext)
}


// Utility
function removeCategoryRecursive(data, id) {
  const category = data[id]
  category.subCategories.forEach(categoryId => removeCategoryRecursive(data, categoryId))
  delete data[category.id]
}