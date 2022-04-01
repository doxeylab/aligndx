import BaseModal from "../../../components/Modals/BaseModal";
import LogInAuth from "../../Authentication/LogInAuth/LogInAuth"
import { Box, Typography } from "@mui/material";
import { FormContainer } from "./StyledLoginModal";

const LogInModal = (props) => {
    return (
        <BaseModal
        show={props.show}
        onHide={props.onHide}
        size={'sm'}
        title={
            <Box>
                <Typography variant="h4" sx={{ margin: 1 }}>
                </Typography>
            </Box>
        }

        body={
            <FormContainer>
                <LogInAuth link={props.link}/>
            </FormContainer>
            
        }
        >
        </BaseModal>
        )
}

export default  LogInModal