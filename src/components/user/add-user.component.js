import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import { Link } from "react-router-dom";

import UserDataService from "../../services/user.service";
import AuthService from "../../services/auth.service";

import {
  Table, Alert, Button, Modal, Col, Row, OverlayTrigger, Tooltip, Nav, Tab, Card, Accordion, Tabs, Pagination
} from 'react-bootstrap';

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        Este campo es Obligatorio!
      </div>
    );
  }
};

const email = value => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        Este correo no es válido.
      </div>
    );
  }
};

const vusername = value => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        El usuario deber tener entre 3 y 20 caracteres.
      </div>
    );
  }
};

const vpassword = value => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        La contraseña debe tener entre 6 y 40 caracteres.
      </div>
    );
  }
};

export default class AddUser extends Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      username: "",
      email: "",
      password: "",
      successful: false,
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser2: undefined,
      message: "",
      //Botones
      visualRamo: true,
      showAlert: false,
      menssageAlert: "",
      typeAlert: "",
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser2: user,
        showUserBoard: user.roles.includes("user"),
        showModeratorBoard: user.roles.includes("moderator"),
        showTeacherBoard: user.roles.includes("teacher"),
      });
    }
  }

  async onChangeUsername(e) {
    await this.setState({
      username: e.target.value
    });
    await this.handleVerificar();
  }

  async onChangeEmail(e) {
    await this.setState({
      email: e.target.value
    });
    await this.handleVerificar();
  }

  async onChangePassword(e) {
    await this.setState({
      password: e.target.value
    });
    await this.handleVerificar();
  }

  async handleVerificar() {
    if ((3 > this.state.password.length && this.state.password.length > 0) ||
      (5 > this.state.email.length && this.state.email.length > 0) ||
      (5 > this.state.username.length && this.state.username.length > 0)) {
      this.setState({
        visualRamo: true,
        menssageAlert: "Los campos deben tener un minimo de caracteres.",
        showAlert: true,
        typeAlert: "warning"
      })
    } else if (this.state.username.length == 0) {
      this.setState({
        visualRamo: true,
        menssageAlert: "El campo 'Nombre de Usuario' no puede estar vacío.",
        showAlert: true,
        typeAlert: "danger"
      })
    } else if (this.state.email.length == 0) {
      this.setState({
        visualRamo: true,
        menssageAlert: "El campo 'Correo' no puede estar vacío.",
        showAlert: true,
        typeAlert: "danger"
      })
    } else if (this.state.password.length == 0) {
      this.setState({
        visualRamo: true,
        menssageAlert: "El campo 'Contraseña' no puede estar vacío.",
        showAlert: true,
        typeAlert: "danger"
      })
    } else if (this.state.username.length > 50) {
      this.setState({
        visualRamo: true,
        menssageAlert: "El campo 'Usuario' no puede tener tantos caracteres.",
        showAlert: true,
        typeAlert: "danger"
      })
    } else if (this.state.email.length > 50) {
      this.setState({
        visualRamo: true,
        menssageAlert: "El campo 'Correo' no puede tener tantos caracteres.",
        showAlert: true,
        typeAlert: "danger"
      })
    } else if (this.state.password.length > 50) {
      this.setState({
        visualRamo: true,
        menssageAlert: "El campo 'Contraseña' no puede tener tantos caracteres.",
        showAlert: true,
        typeAlert: "danger"
      })
    } else {
      this.setState({
        visualRamo: true,
        menssageAlert: "",
        showAlert: false,
        typeAlert: "",
        visualRamo: false
      })
    }
  }

  handleRegister(e) {
    e.preventDefault();

    this.setState({
      message: "",
      successful: false
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      UserDataService.create(
        this.state.username,
        this.state.email,
        this.state.password
      ).then(
        response => {
          this.setState({
            message: response.data.message,
            successful: true
          });
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          var mensaje;
          if (resMessage == "Error: Username is already taken!") {
            mensaje = "Error: Username ya esta en uso!";
            this.setState({
              successful: false,
              message: mensaje
            });
          } else {
            this.setState({
              successful: false,
              message: resMessage
            });
          }
        }
      );
    }
  }

  render() {
    const { currentUser2, showUserBoard, showModeratorBoard, showTeacherBoard } = this.state;

    return (
      <div className="submit-form">
        {currentUser2 ? (
          <h3></h3>
        ) : (
          <div className="container">
            <header className="jumbotron">
              <h3 class="text-muted">Debes iniciar sesión</h3>
              <Link to={"/login"}>
                Inicia Sesión
              </Link>
            </header>
          </div>
        )}

        {(showTeacherBoard || showUserBoard) && (
          <div className="container">
            <header className="jumbotron">
              <h3>Usted no tiene el permiso para acceder a esta zona.</h3>
            </header>
          </div>
        )}

        {(showModeratorBoard && this.state.submitted) ? (
          <div>
            <h4>Registro exitoso!!!,¿Desea registrar a otro profesor?</h4>
            <button className="btn btn-success" onClick={this.newUser}>
              Registrar Nuevo
            </button>
          </div>
        ) : (
          <div className="list row">
            <div className="col-md-6">
              <div className="card card-container">
                <img
                  src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                  alt="profile-img"
                  className="profile-img-card"
                />
                <Form
                  onSubmit={this.handleRegister}
                  ref={c => {
                    this.form = c;
                  }}
                >
                  {!this.state.successful && (
                    <div>
                      <div className="form-group">
                        <label htmlFor="username">Usuario</label>
                        <Input
                          type="text"
                          className="form-control"
                          name="username"
                          value={this.state.username}
                          onChange={this.onChangeUsername}
                          validations={[required, vusername]}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="email">Correo</label>
                        <Input
                          type="text"
                          className="form-control"
                          name="email"
                          value={this.state.email}
                          onChange={this.onChangeEmail}
                          validations={[required, email]}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <Input
                          type="password"
                          className="form-control"
                          name="password"
                          value={this.state.password}
                          onChange={this.onChangePassword}
                          validations={[required, vpassword]}
                        />
                      </div>

                      <div className="form-group"  >
                        <button disabled={this.state.visualRamo} className="btn btn-primary btn-block">Registrar</button>
                      </div>

                      <br />
                      <Alert show={this.state.showAlert} variant={this.state.typeAlert}>
                        {this.state.menssageAlert}
                      </Alert>
                    </div>
                  )}

                  {this.state.message && (
                    <div className="form-group">
                      <div
                        className={
                          this.state.successful
                            ? "alert alert-success"
                            : "alert alert-danger"
                        }
                        role="alert"
                      >
                        {this.state.message}
                      </div>
                    </div>
                  )}
                  <CheckButton
                    style={{ display: "none" }}
                    ref={c => {
                      this.checkBtn = c;
                    }}
                  />
                </Form>
              </div>
            </div>
            <div className="col-md-6">
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <Table striped bordered hover>
                <h3 class="center">Preguntas Frecuentes</h3>
                <Accordion defaultActiveKey="0">
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                      ¿Qué hace este registro?
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>En este registro, solo el admin puede tener acceso, aquí se podrá registrar a los usuarios que ejercerán como profesor.</Card.Body>
                  </Accordion.Collapse>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                      ¿Es igual a registro normal de usuarios?
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="1">
                    <Card.Body>Si bien, los campos son similares, este registro es muy diferente internamente, este solo registra a profesores y ningún otro usuario.</Card.Body>
                  </Accordion.Collapse>
                </Accordion>
              </Table>
            </div>
          </div>
        )}
      </div>
    );
  }
}