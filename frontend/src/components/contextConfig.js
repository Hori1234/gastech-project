import React from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

// Context for keeping the current user state
export const AuthContext = React.createContext({
  status: "pending",
  error: null,
  user: null,
});

/**
 * Provides the Authentication context.
 *
 * Provides a component with the current user. It gives a component the ability to
 * login, logout, get the current user and verify the current users against a list of roles.
 *
 * @param props: The properties that need to set to the authentication provider
 */
const AuthProvider = (props) => {
  const [state, setState] = React.useState({
    status: "pending",
    error: null,
    user: null,
    getUsersStatus: "pending",
  });

  // Use history to redirect the user to the correct page after logging in
  let history = useHistory();

  /**
   * Get the current user from the backend.
   *
   * This effect only runs on the initial mount of this component.
   */
  React.useEffect((state) => {
    // check if user is already logged in
    axios
      .get("/auth/user")
      .then((res) => {
        setState((state) => ({
          ...state,
          user: res.data,
          status: "success",
        }));
      })
      .catch((error) => {
        setState((state) => ({
          ...state,
          status: "error",
          error: error,
        }));
      });
  }, []);

  /**
   * Try to log in a user using the credentials provided.
   *
   * @param credentials: An object containing the username, password and remember fields for the login.
   * @returns {Promise<boolean>}: Whether the login request was successful.
   */
  const login = async (credentials) => {
    return axios
      .post("/auth/login", credentials)
      .then((res) => {
        setState((state) => ({
          ...state,
          user: res.data,
          status: "success",
        }));
        return true;
      })
      .catch((error) => {
        setState((state) => ({
          ...state,
          status: "error",
          error: error,
        }));
        return false;
      });
  };

  /**
   * Try to log out the current user.
   *
   * @returns {Promise<boolean>}: Whether the logout request was successful.
   */
  const logout = async () => {
    return axios
      .post("/auth/logout")
      .then(() => {
        setState((state) => ({
          ...state,
          user: null,
          status: "logged-out",
        }));
        history.push("/");
        return true;
      })
      .catch((error) => {
        setState((state) => ({
          ...state,
          status: "error",
          error: error,
        }));
        return false;
      });
  };

  /**
   * Verify if the current user's role is in a list of roles.
   *
   * @param requiredRoles: A list of strings defining which roles are allowed.
   * @returns {boolean}: Whether the current user's role is in the requiredRoles list.
   */
  const verifyRole = (requiredRoles) => {
    if (state.user === null || state.user.role === null) {
      return false;
    } else {
      return requiredRoles.includes(state.user.role);
    }
  };

  // return the provider for the context, using the state and functions of this component
  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
        verifyRole,
      }}
      {...props}
    />
  );
};

// Create a react hook for this context
const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
