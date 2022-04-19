import { useRef } from "react";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Modal from "@mui/material/Modal";
import FormGroup from "@mui/material/FormGroup";

const AddUserModal = (props) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "1px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const nameInputRef = useRef();
  const emailInputRef = useRef();
  const submitHandler = (event) => {
    event.preventDefault();
    const enteredName = nameInputRef.current.value;
    const enteredEmail = emailInputRef.current.value;
    const userData = {
      name: enteredName,
      email: enteredEmail,
    };
    console.log(userData);
    window.location.reload();
  };
  const cancelHandler = () => {
    window.location.reload();
  };
  return (
    <>
      <Modal
        open={props.open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <PersonAddIcon color="info" sx={{ fontSize: 100 }} />
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography id="modal-modal-title" variant="h4" component="h6">
              Add User
            </Typography>
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography id="modal-modal-description" mt={5}>
              <form onSubmit={submitHandler}>
                {" "}
                <FormGroup>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ m: 2 }} 
                  >
                    <FormControl>
                      <Typography
                        id="modal-modal-title"
                        variant="h4"
                        component="h6"
                      >
                        <InputLabel htmlFor="user-name">User Name:</InputLabel>
                        <Input
                          id="user-name"
                          type="text"
                          required
                          inputRef={nameInputRef}
                        />
                      </Typography>
                    </FormControl>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ m: 2 }} 
                  >
                    <FormControl>
                      <Typography
                        id="modal-modal-title"
                        variant="h4"
                        component="h6"
                      >
                        <InputLabel htmlFor="ueser-email">
                          User Email:
                        </InputLabel>
                        <Input
                          id="user-email"
                          type="email"
                          required
                          inputRef={emailInputRef}
                        />
                      </Typography>
                    </FormControl>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <FormControl>
                      {" "}
                      <Typography id="modal-modal-footer" mt={5}>
                        <Button variant="contained" type="submit" color="info" size="small">
                          Send Invite
                        </Button>
                      </Typography>
                    </FormControl>
                    <FormControl>
                      {" "}
                      <Typography id="modal-modal-footer" mt={5}>
                        <Button
                          variant="contained"
                          type="button"
                          color="info"
                          size="small"
                          onClick={cancelHandler}
                        >
                          Cancel
                        </Button>
                      </Typography>
                    </FormControl>
                  </Box>
                </FormGroup>
              </form>
            </Typography>
          </Box>
        </Box>
      </Modal>
    </>
  );
};
export default AddUserModal;
