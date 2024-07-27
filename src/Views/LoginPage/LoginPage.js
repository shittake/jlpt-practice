import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { HTTP_ENDPOINT_PREFIX } from "../../Constants";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    axios
      .post(`${HTTP_ENDPOINT_PREFIX}/verify`, {
        email: email,
        password: password,
      })
      .then((response) => {
        console.log(response);
      });
    event.preventDefault();
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Row className="justify-content-md-center">
        <Col md="10">
          <h1 style={{ marginBottom: "10%" }}>JLPT practice portal</h1>
          <Card className="p-5 rounded-3 shadow-sm">
            <h1 className="text-center">Login to track your progress!</h1>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail">
                  <Form.Control
                    className="form-control"
                    type="text"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group
                  style={{ marginTop: "10%" }}
                  controlId="formPassword"
                >
                  <Form.Control
                    className="form-control"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Button
                  style={{ marginTop: "10%" }}
                  variant="primary"
                  type="submit"
                >
                  Login
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
