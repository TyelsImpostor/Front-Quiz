import React, { Component } from "react";
import UserDataService from "../../services/user.service";
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";

import {
  Button, Modal, Tabs, Tab, Card, ListGroup, Table, Accordion, OverlayTrigger, Tooltip
} from 'react-bootstrap';

export default class UsersList extends Component {
  constructor(props) {
    super(props);
    this.retrieveUsers = this.retrieveUsers.bind(this);
    this.setActiveUser = this.setActiveUser.bind(this);

    this.state = {
      users: [],
      currentUser: null,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser2: undefined,
      currentIndex: -1,
      visibleeliminar: false,
      deleteid: "",
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
    this.retrieveUsers();
  }

  retrieveUsers() {
    UserDataService.getAll()
      .then(response => {
        this.setState({
          users: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  setActiveUser(user, index) {
    this.setState({
      currentUser: user,
      currentIndex: index
    });
  }

  deleteUser(id) {
    UserDataService.delete(id)
      .then(response => {
        console.log(response.data);
        this.setState({
          visibleeliminar: false,
        });
      })
      .catch(e => {
        console.log(e);
      })
      this.retrieveUsers();
  }

  closeModaleliminar() {
    this.setState({
      visibleeliminar: false,
      deleteid: "",
    });
  }
  openModaleliminar(id) {
    this.setState({
      visibleeliminar: true,
      deleteid: id,
    });
  }

  render() {
    const { currentUser2, showUserBoard, showModeratorBoard, showTeacherBoard, users, currentUser, currentIndex, deleteid } = this.state;

    return (
      <div>
        <header>
          {currentUser2 ? (
            <h3></h3>
          ) : (
            <div>
              <h3 class="text-muted">Debes iniciar sesión</h3>
              <Link to={"/login"}>
                Inicia Sesión
                </Link>
            </div>
          )}

          {showTeacherBoard || (showUserBoard && (
            <div className="container">
              <header className="jumbotron">
                <h3>Usted no tiene el permiso para acceder a esta zona.</h3>
              </header>
            </div>
          ))}

          {showModeratorBoard && (
            <div>
              <div class="img-center">
                <h2 class="center">Panel de Usuarios</h2>
                <p>
                  Regista a un Profesor o elimina a un Usuario del sistema.
                </p>
              </div>

              <div className="list row">

                <div className="col-md-7">
                  <div align="center">
                    <img src="../../../feedback.png" width="400" height="350" />
                  </div>
                </div>

                <div className="col-md-5">
                  <br></br>
                  <Table striped bordered hover>
                    <h3 class="img-center">Preguntas Frecuentes</h3>
                    <Accordion defaultActiveKey="0">
                      <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                          ¿De qué me sirve esta interfaz?
                    </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>Como Administrador, tienes el poder de registrar a un nuevo profesor, de igual manera, puedes eliminar a usuarios registrados.</Card.Body>
                      </Accordion.Collapse>
                      <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                          Cuidado al eliminar a un Usuario
                    </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="1">
                        <Card.Body>Muchos usuarios pueden ser profesores, al eliminar a uno del sistema, eliminas automáticamente su Quiz y recursos que tenga registrados a sus credenciales.</Card.Body>
                      </Accordion.Collapse>
                    </Accordion>
                  </Table>
                </div>
              </div>

              <br></br>
              <hr></hr>
              <br></br>

              <div className="list row">
                <div className="col-md-6">
                  <h4>Listado de Usuarios</h4>

                  <ul className="list-group">
                    {users &&
                      users.map((user, index) => (
                        <li
                          className={
                            "list-group-item " +
                            (index === currentIndex ? "active" : "")
                          }
                          onClick={() => this.setActiveUser(user, index)}
                          key={index}
                        >
                          {user.username}
                        </li>
                      ))}
                  </ul>
                </div>

                <div className="col-md-6">
                  {currentUser ? (
                    <div>
                      <h4>Usuario</h4>
                      <div>
                        <label>
                          <strong>Id:</strong>
                        </label>{" "}
                        {currentUser.id}
                      </div>
                      <div>
                        <label>
                          <strong>Username:</strong>
                        </label>{" "}
                        {currentUser.username}
                      </div>
                      <div>
                        <label>
                          <strong>Email:</strong>
                        </label>{" "}
                        {currentUser.email}
                      </div>
                      <button
                        className="badge badge-danger mr-2"
                        onClick={() => this.openModaleliminar(currentUser.id)}
                      >
                        Borrar
                </button>
                    </div>
                  ) : (
                    <div>
                      <br />
                      <p>Selecciona a un usuario</p>
                    </div>
                  )}
                </div>
              </div>

              <br></br>
              <div>
                <Link
                  to="/user/add"
                  className="badge badge-blue"
                >
                  Nuevo Profesor
                  </Link>
              </div>

              <br></br>

              <Modal show={this.state.visibleeliminar} width="1000" height="500" effect="fadeInUp" onClickAway={() => this.closeModaleliminar()}>
                <Modal.Header>
                  <Modal.Title align="center">¿Deséa eliminar?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                  <button className="btn btn-warning" onClick={() => this.closeModaleliminar()}>
                    Close
                  </button>
                  <button className="btn btn-success" onClick={() => this.deleteUser(deleteid)}>
                    Eliminar
                  </button>
                </Modal.Footer>
              </Modal>
            </div>
          )}

        </header>
      </div>
    );
  }
}