import { useReducer } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { useCategory, addCategory, removeCategory } from './store/category-context'

import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CloseIcon from '@mui/icons-material/Close';

import AddCategoryForm from './AddCategoryForm'

function CategoryItem({ name, id, parentId }) {
    const [, dispatch] = useCategory()

    const [isAddFormVisible, toggleAddFormVisibility] = useReducer((state) => !state, false)

    function addCategoryHandler(name) {
        addCategory({ parentId: id, name }, dispatch)
        toggleAddFormVisibility()
    }

    function removeCategoryHandler() {
        removeCategory({ id, parentId }, dispatch)
    }

    return (
        <Box display='flex' flexDirection='column'>
            <ListItem
                secondaryAction={
                    <>
                        <IconButton onClick={toggleAddFormVisibility} color='primary'>
                            { isAddFormVisible ? <CloseIcon /> : <AddOutlinedIcon /> }
                        </IconButton>
                        <IconButton onClick={removeCategoryHandler}><DeleteOutlineIcon /></IconButton>
                    </>
                }
            >
                <ListItemText primary={name} />
            </ListItem>
            { isAddFormVisible && <AddCategoryForm addCategoryHandler={addCategoryHandler} /> }
        </Box>
    )
}

function CategoryList({ category, parentId }) {
    const [categories] = useCategory()

    return (
        <Droppable droppableId={`${category.id}`} type={`${parentId}`}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    style={{ 
                        backgroundColor: snapshot.isDraggingOver ? 'blue' : 'white',
                    }}
                    {...provided.droppableProps}
                >
                    {category.name && <CategoryItem parentId={parentId} {...category} />}
                    <Box paddingLeft={2} minHeight={3}>
                        {
                            category.subCategories.map((categoryId, categoryInx) => {
                                const categoryData = categories[categoryId]
                                return (
                                    <Draggable key={categoryData.id} draggableId={`${categoryId}`} index={categoryInx}>
                                        {(providedDrag, dragSnapshot) => (
                                            <div
                                                ref={providedDrag.innerRef}
                                                style={{
                                                    backgroundColor: dragSnapshot.isDragging ? 'red' : 'blue',
                                                }}
                                                {...providedDrag.draggableProps}
                                                {...providedDrag.dragHandleProps}
                                            >
                                                <CategoryList category={categoryData} parentId={category.id}/>
                                            </div>
                                        )}
                                    </Draggable>
                                )
                            })
                        }
                    </Box>
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
        
    )
}

export default CategoryList;
