import React from "react";
import { useAuth } from "../../context/authContext";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import "./style.scss";

export default function Homepage() {
  let auth = useAuth();
  return (
    <div>
      <div className="gradient-custom wholePage">
        <Container className="mt-5">
          <Row>
            <Col lg={7}>
              <p>
                {auth.user && auth.user.email
                  ? `Welcome Back, ${auth.user.firstName} ${auth.user.lastName}!`
                  : "Welcome"}
              </p>
              <h1>Listing Management system</h1>
              <p className="fs-3">Manage and build product listings listings all from one tool. </p>
              <div>
                {auth.user && auth.user.email ? (
                  <Button variant="primary" size="lg">
                    Check Listing
                  </Button>
                ) : (
                  <Button variant="primary" size="lg" href="/login">
                    Sign In or Sign Up
                  </Button>
                )}
              </div>
            </Col>
            <Col lg={5}></Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
