import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const EmailTextBox = () => {
    const [value, setValue] = React.useState(""); 

  return (
      
    <Box
        value={value}
        onChange={(event, newValue) => {
        setValue(newValue);
      }} 
      component="form" 
      noValidate
      autoComplete="off"
    >
      <TextField id="outlined-basic" label="Email" variant="outlined" />  
    </Box>
  );
}


export default EmailTextBox;