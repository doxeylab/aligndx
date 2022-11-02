import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";


const ConfirmationModal = (props) => {
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
  const navigate = useNavigate();

  const handleClose = (param) => {
    if (props.path) {
      navigate(props.path)
    } else {
      props.onClose(false)
    }
  }
  
  return (
    <>
      <Modal
        open={props.open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          <Box sx={style}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <CheckCircleIcon color="success" sx={{ fontSize: 100 }} />
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Typography id="modal-modal-title" variant="h3" component="h6">
                {props.title}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Typography id="modal-modal-description" mt={5} sx={{ fontSize: "1.6rem"}}>
                {props.body}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Typography id="modal-modal-footer" mt={5}>
                <Button
                  variant="contained"
                  sx={{ fontSize: "1.6rem", letterSpacing: '0.1rem'}}
                  onClick={handleClose}
                  color="success"
                >
                  Close
                </Button>
              </Typography>
            </Box>
          </Box>
        </div>
      </Modal>
    </>
  );
}
export default ConfirmationModal;
