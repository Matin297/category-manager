import { createContext, useContext, useReducer } from 'react'
import DATA from '../data'

const ADD_CATEGORY = 'ADD_CATEGORY'
const REMOVE_CATEGORY = 'REMOVE_CATEGORY'
const MOVE_CATEGORY = 'MOVE_CATEGORY'

export const addCategory = (payload, dispatch) => dispatch({ type: ADD_CATEGORY, payload })
export const removeCategory = (payload, dispatch) => dispatch({ type: REMOVE_CATEGORY, payload })
export const moveCategory = (payload, dispatch) => dispatch({ type: MOVE_CATEGORY, payload })

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

      case MOVE_CATEGORY: {
        const { source, destination } = payload;

        // dropped outside the list
        if (!destination) {
          return;
        }
        const sourceId = +source.droppableId || source.droppableId;
        const destinationId = +destination.droppableId || destination.droppableId;

        const srcParent = state[sourceId]
        const destParent = state[destinationId]

        if (sourceId === destinationId) {
          const subCategories = reorder(srcParent.subCategories, source.index, destination.index);
          return {
            ...state,
            [sourceId]: {
              ...srcParent,
              subCategories
            }
          }
        } 
        
        const result = move(srcParent.subCategories, destParent.subCategories, source, destination);
        return {
          ...state,
          [sourceId]: {
            ...srcParent,
            subCategories: result[sourceId]
          },
          [destinationId]: {
            ...destParent,
            subCategories: result[destinationId]
          }
        }
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

function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

function move(source, destination, droppableSource, droppableDestination) {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};
