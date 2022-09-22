import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import SignIn from "../navbar/signin";
import SignUp from "../navbar/signup";

export default function LogIn(props) {
  let auth = useAuth();
  const [showSignUp, setShowSignUp] = useState();
  if (!auth.user || !auth.user.email) {
    return (
      <div>
        <SignUp
          show={showSignUp}
          onHide={() => {
            return setShowSignUp;
          }}
          refreshnavbar={() => {
            window.location.reload(false);
          }}
          hideClose={true}
          fullscreen={true}
          switchSignUp={() => {
            setShowSignUp(false);
          }}
        />
        <SignIn
          show={true}
          onHide={() => {
            return false;
          }}
          refreshnavbar={() => {
            window.location.reload(false);
          }}
          hideClose={true}
          switchSignUp={() => {
            setShowSignUp(true);
          }}
          fullscreen={true}
        />
      </div>
    );
  } else {
    return <Navigate to="/" />;
  }
}
