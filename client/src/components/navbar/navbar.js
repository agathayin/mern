import React, { useState, useEffect } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
import SignIn from "./signin";
import SignUp from "./signup";
import { Toaster } from "react-hot-toast";
import "./style.scss";
import { useAuth } from "../../context/authContext";
import _ from "lodash";

export default function MainNavbar(props) {
  const [user, setUser] = useState([]);
  const [userLoaded, setUserLoaded] = useState(false);
  const [signUpShow, setSignUpShow] = React.useState(false);
  const [signInShow, setSignInShow] = React.useState(false);
  const auth = useAuth();

  const fetchData = async () => {
    try {
      let response = await axios.get("/api/auth/me", { withCredentials: true });
      if (response.status === 200 && response.data && response.data._id) {
        let userInfo = getMenu(response.data);
        setUser(response.data);
        setUserLoaded(true);
        window.user = userInfo;
        auth.signin(userInfo, () => {
          console.log("signin as " + userInfo.email);
        });
      } else {
        return { success: false };
      }
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  };
  useEffect(() => {
    setUserLoaded(false);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getMenu(user) {
    if (!user) return user;
    let menu = [];
    if (user.roles.includes("user")) {
      menu.push({ title: "Edit Profile", href: "/editProfile" });
    }
    if (user.roles.includes("admin")) {
      menu.push({ title: "Users", href: "/users" });
    }
    menu = _.uniqBy(menu, "href");
    user.menu = menu;
    return user;
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
              <Dropdown.Item href="/editProfile">Edit Profile</Dropdown.Item>
              <Dropdown.Item href="/resetPsw">Reset Password</Dropdown.Item>
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
  const navMenu =
    userLoaded && user.menu ? (
      <Nav className="me-auto">
        {user.menu.map((el, index) => (
          <Nav.Item>
            <Nav.Link eventKey={index + 1} title={el.title} href={el.href}>
              {el.title}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    ) : (
      <Nav className="me-auto">
        <Nav.Item>
          <Nav.Link eventKey="2" title="Home" href="/"></Nav.Link>
        </Nav.Item>
      </Nav>
    );
  const switchSignUp = (showSignUp) => {
    console.log("switch", showSignUp);
    setSignInShow(!showSignUp);
    setSignUpShow(showSignUp);
  };
  return (
    <React.Fragment>
      <Navbar collapseOnSelect expand="md" bg="light" variant="light" fixed="top">
        <Container>
          <Navbar.Brand href="/">
            <h1 className="fs-5 my-0">
              <span className="animate-charcter brand me-2">4DS</span>Listing 4D
            </h1>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            {navMenu}
            <Nav>{profileDropdown}</Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <SignIn
        show={signInShow}
        onHide={() => setSignInShow(false)}
        refreshnavbar={() => fetchData()}
        switchSignUp={switchSignUp}
      />
      <SignUp show={signUpShow} onHide={() => setSignUpShow(false)} switchSignUp={switchSignUp} />
      <Toaster />
    </React.Fragment>
  );
}
