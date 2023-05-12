import React, { useContext } from "react";
import { UserDataContext } from "../../Utils/context";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
  const userContext = useContext(UserDataContext);
  const { setUser } = userContext;

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser(codeResponse);
    },
    onError: (error) => console.log("Login Failed:", error),
  });
  return (
    <button
      onClick={() => {
        login();
      }}
    >
      Sign in with Google 🚀
    </button>
  );
};

export default Login;
