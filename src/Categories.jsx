import { useReducer } from 'react'
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

    if (category.subCategories.length > 0) 
        return (
            <>
                { category.name && <CategoryItem parentId={parentId} {...category} /> }
                <Box paddingLeft={2}>
                    {
                        category.subCategories.map(categoryId => {
                            const categoryData = categories[categoryId]
                            return (
                                <CategoryList 
                                    key={categoryData.id} 
                                    category={categoryData} 
                                    parentId={category.id} 
                                />
                            )
                        })
                    }
                </Box>
            </>
            
        )
    
    if (category.name) return <CategoryItem parentId={parentId} {...category} />

    return null
}

export default CategoryList;
