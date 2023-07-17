import React, { useState, useEffect, createContext } from "react";
import Amplify, { Auth } from "aws-amplify";

import awsconfig from "../aws-exports";

Amplify.configure(awsconfig);

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);

  // update user with token
  const updateUser = () => {
    return Auth.currentAuthenticatedUser()
      .then((res) => {
        if (res?.attributes) {
          return res;
        }
      })
      .then((user) => {
        console.log(user)
        setIsLoading(false)
        setUser(user);
      })
      .catch((err) => {
        setIsLoading(false)
        //console.log("usercontest:currentAuthenticateduser:", err);
      })
  };

  useEffect(() => {
    updateUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        setIsLoading,
        isLoading,
        user,
        setUser,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
