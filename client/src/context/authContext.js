import React from "react";
import { AuthDataProvider } from "./auth";
import { useLocation, Navigate } from "react-router-dom";

let AuthContext = React.createContext({});
function AuthProvider({ children }) {
  let [user, setUser] = React.useState(null);

  let signin = (newUser, callback) => {
    return AuthDataProvider.signin(() => {
      setUser(newUser);
      callback();
    });
  };

  let signout = (callback) => {
    return AuthDataProvider.signout(() => {
      setUser(null);
      callback();
    });
  };
  let value = { user, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
function useAuth() {
  return React.useContext(AuthContext);
}

function RequireAuth({ children }) {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
}

export { AuthProvider, useAuth, RequireAuth };
