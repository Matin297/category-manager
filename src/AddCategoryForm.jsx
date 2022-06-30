import Box from '@mui/material/Box'
import TextField from "@mui/material/TextField"
import Button from '@mui/material/Button'

function AddCategoryForm({ addCategoryHandler }) {
    function onSubmitHandler(e) {
        e.preventDefault()
        const { name } = e.target.elements
        addCategoryHandler(name.value)
    }

    return (
        <Box
            component='form'
            display='flex'
            gap={0.5} 
            marginX='auto'
            marginY={1}
            padding={1}
            borderRadius={1}
            onSubmit={onSubmitHandler}
            sx={{ backgroundColor: theme => theme.palette.grey[100] }}
        >
            <TextField color='warning' placeholder='Name...' size='small' id='name' required />
            <Button type='submit' color='warning' variant='outlined'>Add</Button>
        </Box>
    )
}

export default AddCategoryForm
