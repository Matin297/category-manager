import { useReducer } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { useCategory, moveCategory } from './store/category-context'
import { addCategory } from './store/category-context'

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from '@mui/material/List'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'

import Categories from './Categories'
import AddCategoryForm from './AddCategoryForm';

function AddCategory() {
  const [, dispatch] = useCategory()
  const [isAddFormVisible, toggleAddFormVisibility] = useReducer((state) => !state, false)

  function addCategoryHandler(name) {
    addCategory({ name }, dispatch)
    toggleAddFormVisibility()
  }

  if (isAddFormVisible) return <AddCategoryForm addCategoryHandler={addCategoryHandler} />

  return (
    <Button startIcon={<AddOutlinedIcon />} variant="contained" onClick={toggleAddFormVisibility}>
      Add Category
    </Button>
  )
}

function App() {
  const [categories, dispatch] = useCategory()

  return (
    <DragDropContext onDragEnd={props => moveCategory(props, dispatch)}>
      <Box padding={3} display='flex' flexDirection='column' gap={3} marginX='auto' maxWidth={500}>
        <Typography variant="h4"> Category Manager </Typography>
        <List dense><Categories category={categories['p']} /></List>
        <AddCategory />
      </Box>
    </DragDropContext>
  );
}

export default App;
