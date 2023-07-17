import React, { useState } from "react";
import * as yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import useAuth from "../hooks/useAuth";
import { confirmPassword, email, password, code } from "../helpers/Validation";
import Auth, { ACTIONS } from "./Auth";
import TextLink from "../components/general/TextLink";
import { IconButton, InputAdornment } from "@mui/material";

export default function ForgotPassword() {
  const { forgotPasswordRequest, forgotPasswordSubmit } = useAuth();
  const [isRequesting, setIsRequesting] = useState(true);
  const [user, setUser] = useState(null);
  const [show, setShow] = useState(false);
  const [showCheckPassword,setShowCheckPassword]=useState(false)

  let initialValues = isRequesting
    ? { email: "" }
    : { code: "", password: "", confirmPassword: "" };

  let validate = isRequesting
    ? { ...email }
    : { ...code, ...password, ...confirmPassword };

  let Validation = yup.object().shape({
    ...validate,
  });

  let inputs = isRequesting
    ? [{ label: "Email", key: "email", type: "email" }]
    : [
        { label: "Verification Code", key: "code", max: 6 },
        {
          label: "Password",
          key: "password",
          type: show ? "text" : "password",
          InputProps: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton  onClick={() => setShow((old) => !old)}>
                  {show ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        },
        {
          label: "Confirm Password",
          key: "confirmPassword",
          type: showCheckPassword ? "text" : "password",
          InputProps: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton  onClick={() => setShowCheckPassword((old) => !old)}>
                  {showCheckPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        },
       
      ];

  const stepHandler = (user) => {
    setIsRequesting(false);
    setUser(user);
  };

  return (
    <Auth
      initialValues={initialValues}
      email={user}
      inputs={inputs}
      onSubmit={isRequesting ? forgotPasswordRequest : forgotPasswordSubmit}
      validationSchema={Validation}
      title="Password Reset"
      body={
        <>
          {isRequesting
            ? "An Email will be sent to you to you on how to reset your password"
            : "A Email has be sent to you with a confirmation code"}
          <TextLink
            sx={{ mt: "60px" }}
            label="Dont need to reset your password?"
            link="/Login"
          >
            Login
          </TextLink>
        </>
      }
      action={isRequesting ? ACTIONS.resetRequest : ACTIONS.resetSubmit}
      nextStep={stepHandler}
    />
  );
}
