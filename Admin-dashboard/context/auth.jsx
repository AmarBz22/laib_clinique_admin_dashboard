import { useEffect, useState, createContext } from "react";
import api from "../utils/api.js";
import decodeToken from "../utils/jwt.js";

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: "",
    user: {},
    isLoading: true, // Initialize loading state
  });

  const clearUserAuthInfo = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setAuthState({ token: "", user: {}, isLoading: false });
  };

  const setUserAuthInfo = async (token) => {
    let user = null;

    if (token) {
      const decodedToken = decodeToken(token);
      const currentTime = Date.now() / 1000; // Convert to seconds
      if (decodedToken.exp < currentTime) {
        clearUserAuthInfo();
      } else {
        try {
          const response = await api.get("/api/user/me", {
            headers: {
              Authorization: "Bearer " + token,
            },
          });
          user = response.data;
          localStorage.setItem("user", JSON.stringify(user));
        } catch (error) {
          console.error("Error fetching user data:", error);
          clearUserAuthInfo(); // Clear user info if fetching fails
        }
        localStorage.setItem("token", token); // Store token directly
      }
    }

    setAuthState({
      token,
      user,
      isLoading: false, // Update loading state
    });
  };

  const setAuthClient = ({ token, user }) => {
    setAuthState({
      token,
      user,
      isLoading: false, // Update loading state
    });
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token); // Store token directly
  };

  const isUserAuthenticated = () =>
    typeof window !== "undefined" && Boolean(localStorage.getItem("token"));

  useEffect(() => {
    const tokenString = localStorage.getItem("token");
    const token = tokenString ? tokenString : null; // Directly use the token string
    const user = JSON.parse(localStorage.getItem("user"));

    if (token) {
      const decodedToken = decodeToken(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        clearUserAuthInfo();
      } else if (user) {
        setAuthState({ token, user, isLoading: false }); // Update loading state
      } else {
        setAuthState({ isLoading: false }); // If user is null, set loading to false
      }
    } else {
      setAuthState({ isLoading: false }); // If no token, set loading to false
    }
  }, []);

  return (
    <Provider
      value={{
        authState,
        setUserAuthInfo,
        isUserAuthenticated,
        setAuthClient,
        clearUserAuthInfo, // Now available as part of the context
      }}
    >
      {children}
    </Provider>
  );
};

// Export AuthContext and AuthProvider consistently
export { AuthContext, AuthProvider };
