import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

const EmailTextBox = ({grabEmail}) => { 

  const [errortext, setErrorText] = useState("");
  const [error,setError]= useState(false)

  const regex = new RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/gm)
 
  const errorHandler = (event) => {
    const isemail = regex.test(event.target.value) || event.target.value === ''? (setError(false), setErrorText("")): (setError(true), setErrorText("Not a valid email"))
    return isemail 
  } 
  return (
      
    <Box
      id = "Email Box" 
      onChange={(event,data) => grabEmail(event.target.value)} 
      noValidate
      autoComplete="off"
    >
      <TextField  
      id="Email Textbox" 
      label="Email"  
      variant="outlined" 
      placeholder = "user@email.com" 
      error={error}
      onChange={errorHandler}
      helperText={errortext}
      />  
    </Box> 
  );
}


export default EmailTextBox;