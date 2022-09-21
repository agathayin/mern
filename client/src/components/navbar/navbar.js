import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav from "react-bootstrap/Nav";
import Dropdown from "react-bootstrap/Dropdown";
import SignIn from "./signin";
import SignUp from "./signup";
import "./style.scss";

export default function Navbar(props) {
  const [user, setUser] = useState([]);
  const [userLoaded, setUserLoaded] = useState(false);
  const [signUpShow, setSignUpShow] = React.useState(false);
  const [signInShow, setSignInShow] = React.useState(false);

  useEffect(() => {
    setUserLoaded(false);
    fetchData();
  }, []);
  async function fetchData() {
    try {
      let response = await axios.get("/api/auth/me", { withCredentials: true });
      if (response.status === 200 && response.data && response.data._id) {
        setUser(response.data);
        window.user = response.data;
        setUserLoaded(true);
      } else {
        return { success: false };
      }
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  }
  const signOut = async () => {
    await axios.post("/api/auth/logout", { withCredentials: true });
    window.location.replace("/");
  };
  const profileDropdown = (
    <div>
      {userLoaded ? (
        <div>
          <Dropdown as={Nav.Item}>
            <Dropdown.Toggle as={Nav.Link}>
              {user.firstName} {user.lastName}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Edit Profile</Dropdown.Item>
              <Dropdown.Item onClick={() => signOut()}>Sign Out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      ) : (
        <Dropdown as={Nav.Item}>
          <Dropdown.Toggle as={Nav.Link}>Profile</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setSignUpShow(true)}>Sign Up</Dropdown.Item>
            <Dropdown.Item onClick={() => setSignInShow(true)}>Sign In</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </div>
  );
  return (
    <React.Fragment>
      <Nav fill>
        <Nav.Item>
          <h1 style={{ fontSize: "16px", padding: "0.5em 0" }}>
            <span className="animate-charcter brand me-2">4DS</span>Listing 4D
          </h1>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="1" href="/">
            Home
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="2" title="User" href="/users">
            User
          </Nav.Link>
        </Nav.Item>
        {profileDropdown}
      </Nav>
      <SignIn show={signInShow} onHide={() => setSignInShow(false)} refreshnavbar={() => fetchData()} />
      <SignUp show={signUpShow} onHide={() => setSignUpShow(false)} />
    </React.Fragment>
  );
}
