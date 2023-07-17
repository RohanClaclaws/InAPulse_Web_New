import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { FormHelperText,TextField } from '@mui/material';
import {
    Stack,
    Typography,
    Button,
    Container,
    Box,
    FormLabel,
    Input,
    Modal
} from "@mui/material";

const flex = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: '1rem'
}

const ChangePassword = ({
    setIsChangePassword,
    handleClose,
    isOpen }) => {

    const { user, forgotPasswordSubmit } = useAuth();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userEmail] = useState(user.attributes.email);
    const [confirmCode, setConfirmCode] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(isOpen);

    // State Variable for Password Checking
    const [errorPassword, setErrorPassword] = useState(true)

    // State Variable for Checking Password Matching
    const [matchPassword, setMatchPassword] = useState(true);

    // State Variable To check that the Confirmation Code is not Empty
    const[checkCode,setCheckCode]=useState(true)

    // State Variable to Check if the Security code and Confirmation Code matches
    const [confirmCodeMatch,setConfirmCodeMatch]=useState(true)

    const handleNewPassword = (e) => {
        setNewPassword(e.target.value);
    }

    const confirmNewPassword = (e) => {
        setConfirmPassword(e.target.value);
    }

    const handleConfirmCode = (e) => {
        
        setConfirmCode(e.target.value);
        setConfirmCodeMatch(true)
    }

    const addNewPassword = async (e) => {
        e.preventDefault();
        
        

        // Validations for Updating Passwords
        //1. Check for password length atlease 8 characters
        //2. Check if both Password Match

        //1. Length of the Password should be 8 else, throw error
        if (newPassword.length < 8) {
            setErrorPassword((current) => false)
            setConfirmPassword("");
            setNewPassword("")
        }
        
        
        //2. Check if Both Password Match
        if (newPassword !== confirmPassword) {
            console.log("Password Dont match")
            setMatchPassword(false)
        }

        if(newPassword.length>=8 && (newPassword===confirmPassword)){
            setErrorPassword(true)
            setMatchPassword(true)
        }

        try {
            if(!confirmCode){
                setCheckCode(false)
            }

            else{
                setCheckCode(true)
                await forgotPasswordSubmit(userEmail, confirmCode, confirmPassword)
                    .then((res) => {
                        //console.log("Password has been changed successfully!");

                        setIsChangePassword(false);
                        setIsModalOpen(false);
                        handleClose();
                    })
            }
        } catch (error) {
            setConfirmCodeMatch(false)
            console.log("Error while updating Password !")
            console.log(error)
        }
    }

    return (
        <Modal

            open={isModalOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >

            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 550,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    borderRadius: "10px",
                    p: 4,
                }}>
                <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    sx={{

                        textAlign: "center",
                        textTransform: "Uppercase"
                    }}>
                    Change Password
                </Typography>
                    
                {   
                    // If Password dont match we show different password else we show normal message
                    matchPassword ? <Typography
                        id="modal-modal-message"
                        sx={{
                            typography: 'body2',
                            color: 'info.main',
                            textAlign: "left",
                            marginLeft: '4rem',
                            mt: 1,

                        }}>
                        { confirmCodeMatch?`😎 Code is sent to registered email !`:` Incorrect Code 💥`}    
                        
                    </Typography> :
                        <Typography
                            id="modal-modal-message"
                            sx={{
                                typography: 'body2',
                                color: 'error.main',
                                textAlign: "left",
                                marginLeft: '4rem',
                                mt: 1,

                            }}>
                           💥 Password dont Match | Please try again
                        </Typography>
                }
                
                <Stack id="modal-modal-description" spacing={2} sx={{ mt: 2 }}>
                    <div style={flex}>

                    <InputGroup 
                            label={ checkCode? "Confirm Code" : <Typography sx={{ color: 'error.main' }}>
                            Verification Code Empty 💥   </Typography>}
                            onChange={handleConfirmCode}
                            value={confirmCode}
                            type="text"
                            />
                        
                        <InputGroup
                            label={errorPassword ? "New password" : <Typography sx={{ color: 'error.main' }}>
                                Password should be at least 8 characters long   </Typography>}
                            onChange={handleNewPassword}
                            value={newPassword}
                            type="text"
                        />
                        <InputGroup
                            label={errorPassword ? "Confirm password" : <Typography sx={{ color: 'error.main' }}>
                                Password should be at least 8 characters long   </Typography>}
                            onChange={confirmNewPassword}
                            value={confirmPassword}
                            type="text"
                        />
                    </div>


                </Stack>

                <Container sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    margin: "20px 0 0 0"
                }} >
                    <Button
                        disableRipple
                        type="submit"
                        onClick={addNewPassword}
                        variant="contained"
                        size="small"
                        sx={{ textTransform: "uppercase", fontWeight: "bold" }}
                    >
                        Submit
                    </Button>
                </Container>

            </Box>


        </Modal>
    )

}

export default ChangePassword;


const InputGroup = ({ label, value, onChange }) => {
    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: "350px",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <FormLabel sx={{ marginRight: "auto" }}>
                {label || "Label"}
            </FormLabel>
            <Input
                fullWidth
                type="text"
                value={value}
                onChange={onChange}
                disableUnderline
                sx={{
                    border: 1,
                    borderRadius: 1,
                    paddingX: "0.6rem",
                    paddingY: "0.3rem",
                    borderColor: "#aaa"
                }}

            />
        </Box>
    )
}


