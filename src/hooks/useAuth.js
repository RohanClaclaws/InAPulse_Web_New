import { useContext } from "react";

import { Auth, Hub } from "aws-amplify";
import { UserContext } from "../context/UserContextProvider";

import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import useApi from "./useApi";

const useAuth = () => {
  const { user, setUser, updateUser, isLoading, setIsLoading } =
    useContext(UserContext);
  const { deleteUser: deleteUserapi, updateUserApi } = useApi();

  // console.log("user",Boolean(user),"loading",isLoading)

  /**
   * sign up user providing email ,password, and name, phone.
   *
   * @param {*} email
   * @param {*} password
   * @param {*} name
   * @param {*} phone
   *
   */
  const signUp = (email, password, name, phone) => {
    setIsLoading(true);
    return Auth.signUp({
      username: email,
      email,
      password,
      attributes: {
        name,
        phone_number: phone,
      },
    })
      .then((result) => {
        return result;
      })
      .finally(() => setIsLoading(false));
  };

  /**
   *  send a forget password email to the provided email
   * @param {*} email
   *
   */
  const forgotPasswordRequest = (email) => {
   
    setIsLoading(true);
    return Auth.forgotPassword(email).finally(() => setIsLoading(false))
  };

  /**
   * changing the password for forget password option providing email, code from email and a new password
   * @param {*}email
   * @param {*}code provided by the email
   * @param {*}new_password
   */
  const forgotPasswordSubmit = (email, code, new_password) => {
    setIsLoading(true);
    return Auth.forgotPasswordSubmit(email, code, new_password).finally(() =>
      setIsLoading(false)
    );
  };

  /**
   * confirm the verification code with provided username(email)
   *
   * @param {*} email user name (email)
   * @param {*} code  confirmation code
   *
   */
  const confirmSignUpCode = (email, code) => {
    setIsLoading(true);
    return Auth.confirmSignUp(email, code.toString())
      .then((result) => {
        return result;
      })
      .finally(() => setIsLoading(false));
  };

  /**
   *  sign in the user and set the user in user context
   * @param {*} username user name (email)
   * @param {*} password password
   * @returns {Promise}
   */
  const signIn = (username, password) => {
    setIsLoading(true);
    return Auth.signIn(username, password)
      .then(() => updateUser())
      .finally(() => setIsLoading(false));
  };

  const federatedSignInListner = (setIsLoading) => {
    return Hub.listen("auth", ({ payload: { event, data } }) => {
      //console.log(event)
      switch (event) {
        // happens when successfully passed with sign in params
        case "codeFlow":
          setIsLoading(true);
          break;
        case "signIn":
          Auth.currentUserInfo()
            .then((result) => setUser(result))
            .catch((err) => console.log("fedsignin:", err))
            .finally(() => setIsLoading(false));

          break;
        case "signOut":
          setUser(null);
          setIsLoading(false);
          break;
        case "signIn_failure":
          //console.log("failed");
          setIsLoading(false);
          break;
        case "cognitoHostedUI_failure":
          setIsLoading(false);
          //console.log("Sign in failure", data);
          break;
        default:
          break;
      }
    });
  };

  const facebookSignIn = () => {
    setIsLoading(true);
    return Auth.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Facebook,
    });
  };

  const googleSignIn = () => {
    setIsLoading(true);
    return Auth.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Google,
    });
  };
  const appleSignIn = () => {
    setIsLoading(true);
    return Auth.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Apple,
    });
  };

  /**
   * user sign out
   */
  const signOut = () => {
    //clear the expo token after user sign out
    setIsLoading(true);
    Auth.signOut()
      .then((result) => {
        setUser(null);
        return result;
      })
      .finally(() => setIsLoading(false));
  };
  const deleteUser = () => {
    setIsLoading(true);
    return deleteUserapi()
      .then(() => {
        signOut();
      })
      .finally(() => setIsLoading(false));
  };
  const updateUserInfo = (name, phone_number) => {
    setIsLoading(true);
    updateUserApi(name, phone_number)
      .then(() => {
        return Auth.currentUserInfo();
      })
      .then((res) => setUser(res))
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  /**
   * resend confirmation code
   *
   */
  const resendConfirmationCode = (username) => {
    setIsLoading(true);
    return Auth.resendSignUp(username)
      .then((result) => {
        return result;
      })
      .finally(() => setIsLoading(false));
  };

  return {
    signUp,
    signIn,
    deleteUser,
    facebookSignIn,
    googleSignIn,
    appleSignIn,
    federatedSignInListner,
    signOut,
    forgotPasswordRequest,
    forgotPasswordSubmit,
    confirmSignUpCode,
    resendConfirmationCode,
    updateUserInfo,
    user,
    isLoading,
    setIsLoading,
  };
};

export default useAuth;
