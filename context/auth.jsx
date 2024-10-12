import { useEffect, useState, useContext, createContext } from "react";
import api from "../utils/api.js";
import decodeToken from "../utils/jwt.js";
const AuthContext = createContext();
const { Provider } = AuthContext;



const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: "",
    user: {},
  });

  const setUserAuthInfo = async (token) => {
    let user = null;

    if (token) {
      // Decode the token to get its expiration time
      const decodedToken = decodeToken(token);
      const currentTime = Date.now() / 1000; // Convert to seconds
      if (decodedToken.exp < currentTime) {
        clearUserAuthInfo();
      } else {
        // Token is still valid, fetch user data
        const response = await api.get("/api/user/me", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        user = response.data;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", JSON.stringify({ token }));
      }
    }

    setAuthState({
      token,
      user,
    });
  };

  const setAuthClient = async ({ token, user }) => {
    setAuthState({
      token,
      user,
    });
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", JSON.stringify({ token }));
  };

  const isUserAuthenticated = () =>
    typeof window !== "undefined" &&
    Boolean(JSON.parse(localStorage.getItem("token"))?.token ?? false);

  useEffect( () => {

    var tokenString = localStorage.getItem("token");
    var token = null;

    var user = JSON.parse(localStorage.getItem("user"));


    if (tokenString) {
      token = JSON.parse(tokenString)?.token;

      const decodedToken = decodeToken(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        clearUserAuthInfo();
      } else if (user) {
        setAuthState({ token, user });
      }
    }
  }, []);

  return (
    <Provider
      value={{
        authState,
        setAuthState,
        setUserAuthInfo,
        isUserAuthenticated,
        setAuthClient,
      }}
    >
      {children}
    </Provider>
  );
};
const clearUserAuthInfo = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

export { AuthContext, AuthProvider, clearUserAuthInfo };