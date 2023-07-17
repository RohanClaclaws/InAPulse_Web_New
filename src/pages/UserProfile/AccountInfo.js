import React, { useState } from "react";
import {
  Button,
  Box,
  Grid,
  Input,
  Stack,
  FormLabel,
  Container,
  Typography,
} from "@mui/material";
import ChangePassword from "./ChangePassword";
import useAuth from "../../hooks/useAuth";



const AccountInfo = () => {
  const { user, forgotPasswordRequest } = useAuth();
  const [isChangePassword, setIsChangePassword] = useState(false);

  const handleClose = () => {
    setIsChangePassword(false);
  };

  const isOpen = true;

  const requestPasswordChange = async (e) => {
    e.preventDefault();

    setIsChangePassword(true);

    try {
       forgotPasswordRequest(user.attributes.email).then((res) => {
        console.log("Password change request has been sent!");
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      {Boolean(user) && (
        <Grid
          container
          spacing={0.5}
          sx={{
            paddingTop: "20px",
            display: "flex",
            flexDirection: "column",
            }}
        >
          <Stack
            direction="row"
            width={"100%"}
            flexWrap={"wrap"}
            gap={4}
          >
            <InputGroup 
              label={"Full Names"}
              placeholder={user.attributes.name}
             
            />
            <InputGroup label={"Email"} placeholder={user.attributes.email} />
          
          </Stack>

          <br />

          {isChangePassword ? (
            <ChangePassword handleClose={handleClose} isOpen={isOpen} />
          ) : (
            <Stack
              sx={{
                display: "flex",
                margin: "5px 0 0 0",
              }}
            >
              <Button
                disableRipple
                onClick={requestPasswordChange}
                sx={{
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  fontSize: "0.8rem",
                  marginBottom: "2em",
                  textAlign: "center",
                  padding: "2px",
                  height: "5vh",
                  width: "18em",
                  bgcolor: "primary.main",
                  color: "white",
                  borderRadius: 3,
                  pt: 0,
                  "&:hover": {
                    backgroundColor: "#f37d0d",
                    transition: "1s",
                  },
                }}
              >
                Change password
              </Button>
            </Stack>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default AccountInfo;

const InputGroup = ({ label, type, placeholder }) => {
  return (
    <Box
      sx={{
        width: "200px",
        maxWidth: "350px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <FormLabel sx={{ marginRight: "auto" }}>{label || "Label"}</FormLabel>
      <Input
        fullWidth
        type={type}
        placeholder={placeholder}
        disableUnderline={true}
        sx={{
          border: 1,
          borderRadius: 2,
          paddingX: "0.6rem",
          paddingY: "0.3rem",
          borderColor: "#aaa",
        }}
      />
    </Box>
  );
};
