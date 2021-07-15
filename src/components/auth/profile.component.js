import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../../services/auth.service";
import UserService from "../../services/user.service";
import PerfilService from "../../services/perfil.sevice";
import { Radar } from "react-chartjs-2";
import { Link } from "react-router-dom";

import {
  Button, Modal, Card, OverlayTrigger, Tooltip, Table, Accordion, Alert, Row, Col
} from 'react-bootstrap';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.Datos = this.Datos.bind(this);
    this.updateActivo = this.updateActivo.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);

    this.state = {
      redirect: null,
      userReady: false,
      perfilid: "",
      User: {
        id: null,
        username: "",
        email: "",
        password: "",
      },
      respuesta: [],
      colores: [],
      data: [],
      opciones: [],
      datos: [],
      username: [],
      cantidad: [],
      currentPerfil: [],
      currentPerfil2: [],
      perfils: [],
      currentNew: -1,
      currentUser: undefined,
      visible2: false
    };
  }

  async componentDidMount() {
    const User = AuthService.getCurrentUser();

    if (User) {
      this.setState({
        currentUser: User,
      });
    }
    else {
      this.setState({ redirect: "/home" });
    }
    this.setState({ User: User, userReady: true })
    await this.Datos();
    await this.Imagen();
  }

  openModal() {
    this.setState({
      visible: true
    });
  }

  closeModal() {
    this.setState({
      visible: false,
      currentNew: -1
    });
  }

  Datos(id) {
    var username = [], cantidad = [];
    UserService.getChart(id)
      .then(response => {
        this.setState({
          datos: response.data
        });
        this.generarColores();

        //console.log(response.data);
        for (var i = 0; i < response.data.length; i = i + 2) {
          username.push(response.data[i]);
          cantidad.push(response.data[i + 1]);
        }
        this.setState({ username: username, cantidad: cantidad });

        const data2 = {
          labels: this.state.username,
          datasets: [{
            label: "Datos",
            data: this.state.cantidad,
            backgroundColor: this.state.colores
          }]
        };
        const opciones2 = {
          responsive: true,
          maintainAspectRatio: false
        }
        this.setState({ data2: data2, opciones2: opciones2 });
      })
      .catch(e => {
        //console.log(e);
      });
  }

  Perfil(id) {
    var perfils = [];
    this.openModal();
    PerfilService.getAll()
      .then(response => {
        this.setState({
          currentPerfil: response.data
        });

        //console.log(response.data);
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].user == id) {
            perfils.push(response.data[i]);
          }
        }
        this.setState({ perfils: perfils });
        //console.log(perfils);
      })
      .catch(e => {
        //console.log(e);
      });
  }

  Imagen() {
    PerfilService.getAll()
      .then(response => {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].user == this.state.User.id) {
            if (response.data[i].activo == true) {
              this.setState({ perfilid: response.data[i].id });
            }
          }
        }
      })
      .catch(e => {
        //console.log(e);
      });
  }

  generarCaracter() {
    var caracter = ["a", "b", "c", "d", "e", "f", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    var numero = (Math.random() * 15).toFixed(0);
    return caracter[numero];
  }

  colorHEX() {
    var color = "";
    for (var i = 0; i < 6; i++) {
      color = color + this.generarCaracter();
    }
    return "#" + color;
  }

  generarColores() {
    var colores = [];
    for (var i = 0; i < this.state.datos.length; i++) {
      colores.push(this.colorHEX());
    }
    this.setState({ colores: colores });
  }

  newPerfil() {
    this.setState({
      currentNew: 1
    });
  } handleClickBack

  handleClickBack() {
    this.setState({
      currentNew: -1
    });
  }

  async updateActivo(status, id, perfil) {
    var data = {
      id: perfil.id,
      activo: status,
      user: perfil.user,
      resource: perfil.resource,
    };

    await PerfilService.update(perfil.id, data)
      .then(response => {
        this.setState(prevState => ({
          perfil: {
            ...prevState.perfil,
            activo: status
          }
        }));
        //console.log(response.data);
      })
      .catch(e => {
        //console.log(e);
      });

    await PerfilService.getAll()
      .then(response => {
        this.setState({
          currentPerfil2: response.data
        });

        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].user == id) {
            if (response.data[i].id != perfil.id) {
              var data = {
                id: response.data[i].id,
                activo: "false",
                user: response.data[i].user,
                resource: response.data[i].resource,
              };
              PerfilService.update(response.data[i].id, data)
            }
          }
        }
      })
      .catch(e => {
        //console.log(e);
      });

    await this.closeModal()
  }

  delete(id) {
    PerfilService.delete(id)
      .then(response => {
        //console.log(response.data);
        window.location.reload();
      })
      .catch(e => {
        //console.log(e);
      })
  }

  async onChangeUsername(e) {
    await this.setState(function (prevState) {
      return {
        User: {
          ...prevState.User,
          username: e.target.value
        }
      };
    });
    await this.handleVerificar();
  }

  async onChangeEmail(e) {
    await this.setState(function (prevState) {
      return {
        User: {
          ...prevState.User,
          email: e.target.value
        }
      };
    });
    await this.handleVerificar();
  }

  async handleVerificar() {
    if ((3 > this.state.User.username.length && this.state.User.username.length > 0)
    ) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo debe tener un minimo de caracteres.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "warning"
      })
    } else if (this.state.User.username.length == 0) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo 'Nombre' no puede estar vacío.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "danger"
      })
    } else if (this.state.User.username.length > 100) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo 'Nombre' no puede tener tantos caracteres.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "danger"
      })
    } else {
      this.setState({
        menssageAlertEdit: "",
        showAlertEditRamo: false,
        typeAlertEditRamo: "",
        visualRamoEdit: false,
      })
    }

  }

  async updateUser() {
    var data = {
      id: this.state.User.id,
      username: this.state.User.username,
      email: this.state.User.email,
      password: this.state.User.password,
    };
    await UserService.update(
      this.state.User.id,
      data
    )
      .then(response => {
        //console.log(response.data);
        this.setState({
          message: "Usuario Actualizado"
        });
        AuthService.logout();
        window.location.replace("http://localhost:8081/");
      })
      .catch(e => {
        //console.log(e);
      });
  }

  closeModal2() {
    this.setState({
      visible2: false
    });
  }
  openModal2(id) {
    this.setState({
      visible2: true
    });
  }

  render() {

    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    const { User, perfils, currentNew, perfilid } = this.state;

    return (
      <div className="container">
        <header>
          <div>
            {User ? (
              <div>
                <div class="img-center">
                  <h2 class="img-center">Mi Perfil</h2>
                  <p>
                    Mira tu información personal y desempeño de tus cursos.
                  </p>
                </div>

                <div className="list row">

                  <div className="col-md-4">
                    <ul className="list-group">
                      <li className="list-group-item">
                        <img src={"https://spring-boot-back.herokuapp.com/api/perfils/resource/" + perfilid} width="295" height="190"></img>
                        <br></br>
                      </li>
                      <li className="list-group-item">
                        ID: {User.id}
                      </li>
                      <li className="list-group-item">
                        Username: <strong>{User.username}</strong>
                      </li>
                      <li className="list-group-item">
                        Email: {User.email}
                      </li>
                      <li className="list-group-item">
                        <Row>
                          <Col md="6" >
                            Opciones:
                          </Col>
                          <Col md="auto">
                            {' '}
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Cambiar/Nueva Foto</Tooltip>}>
                              <Button size="sm" variant="light" onClick={() => this.Perfil(User.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-card-image" viewBox="0 0 16 16">
                                  <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                  <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z" />
                                </svg>
                              </Button>
                            </OverlayTrigger>
                            {' '}
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Editar Perfil</Tooltip>}>
                              <Button size="sm" variant="light" onClick={() => this.openModal2()}>
                                <svg width="16" height="16" viewBox="0 0 16 16" class="bi bi-pencil" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                </svg>
                              </Button>
                            </OverlayTrigger>
                            {' '}
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Mi Desempeño</Tooltip>}>
                              <Button size="sm" variant="light" onClick={() => this.Datos(User.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bar-chart-line-fill" viewBox="0 0 16 16">
                                  <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1V2z" />
                                </svg>
                              </Button>
                            </OverlayTrigger>
                          </Col>
                        </Row>
                      </li>
                    </ul>
                  </div>

                  <div className="col-md-4">
                    <br></br>
                    <div className="App" style={{ width: "800px", height: "400px" }}>
                      <Radar data={this.state.data2} options={this.state.opciones2} />
                    </div>
                  </div>
                </div>

                <Modal show={this.state.visible} size="xl" >
                  <Modal.Header closeButton onClick={() => this.closeModal()} >
                    <Modal.Title>Cambiar/Nueva Foto</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div>
                      {currentNew == 1 ? (
                        <div>
                          <html>
                            <body>
                              <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Regresar</Tooltip>}>
                                <Button size="sm" variant="light" onClick={() => this.handleClickBack()}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-reply" viewBox="0 0 16 16">
                                    <path d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822.984.624 1.99 1.76 2.595 3.876-1.02-.983-2.185-1.516-3.205-1.799a8.74 8.74 0 0 0-1.921-.306 7.404 7.404 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254a.503.503 0 0 0-.042-.028.147.147 0 0 1 0-.252.499.499 0 0 0 .042-.028l3.984-2.933zM7.8 10.386c.068 0 .143.003.223.006.434.02 1.034.086 1.7.271 1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96v-.667z" />
                                  </svg>
                                </Button>
                              </OverlayTrigger>
                              <div className="list row">

                                <br></br>
                                <div className="col-md-7">
                                  <br></br>
                                  <form target="hiddenFrame" method="POST" action="https://spring-boot-back.herokuapp.com/api/perfils/add" enctype="multipart/form-data">
                                    Activo:
                                    <input type="text" name="activo" value="false" />
                                    &nbsp;&nbsp;&nbsp;
                                    ID Usuario:
                                    <input type="text" name="users" value={User.id} />
                                    <br></br>
                                    <br></br>
                                    Resource:
                                    <input type="file" name="resource" multiple />
                                    <br></br>
                                    <br></br>
                                    <input href="/" type="submit" value="Upload" onClick={() => window.location.reload()} />
                                  </form>
                                </div>

                                <div className="col-md-5">
                                  <Table striped bordered hover>
                                    <h3 class="center">Preguntas Frecuentes</h3>
                                    <Accordion defaultActiveKey="0">
                                      <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                          ¿Que tamaño como máximo puede tener mi imagen?
                                        </Accordion.Toggle>
                                      </Card.Header>
                                      <Accordion.Collapse eventKey="0">
                                        <Card.Body>Las imágenes que subes al sistema no deben pasar de los 2MB.</Card.Body>
                                      </Accordion.Collapse>
                                      <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                          ¿Cuántas fotos puedo subir?
                                        </Accordion.Toggle>
                                      </Card.Header>
                                      <Accordion.Collapse eventKey="1">
                                        <Card.Body>Puedes subir las fotos que quieras, pero mientras más tengas más lento funciona el sistema.</Card.Body>
                                      </Accordion.Collapse>
                                    </Accordion>
                                  </Table>
                                </div>

                                <div hidden>
                                  <iframe
                                    name="hiddenFrame"
                                    id="hiddenFrame"
                                    width="0"
                                    height="0"
                                  >
                                  </iframe>
                                </div>
                              </div>
                            </body>
                          </html>
                        </div>
                      ) : (
                        <div>
                          <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Nueva Foto</Tooltip>}>
                            <Button size="sm" variant="light" onClick={() => this.newPerfil()}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-card-image" viewBox="0 0 16 16">
                                <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z" />
                              </svg>
                            </Button>
                          </OverlayTrigger>

                          <br></br>
                          <br></br>
                          <div className="list row">

                            {perfils &&
                              perfils.map((perfil) => (
                                <div className="col-md-3">
                                  <ul className="list-group">
                                    <li className="list-group-item">
                                      <br></br>
                                      <img src={"https://spring-boot-back.herokuapp.com/api/perfils/resource/" + perfil.id} width="210" height="160"></img>
                                    </li>
                                    <li className="list-group-item">
                                      {perfil.activo == false ? (
                                        <div class="center">
                                          <Link
                                            class="badge badge-info"
                                            onClick={() => this.updateActivo(true, User.id, perfil)}
                                          >
                                            Activar
                                          </Link>
                                          &nbsp;
                                          <Link
                                            className="badge badge-danger"
                                            onClick={() => this.delete(perfil.id)}
                                          >
                                            Eliminar
                                          </Link>
                                        </div>
                                      ) : (
                                        <strong class="img-center">Ya en uso</strong>
                                      )}
                                    </li>
                                  </ul>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Modal.Body>
                </Modal>

                <Modal show={this.state.visible2} width="1000" height="500" effect="fadeInUp" onClickAway={() => this.closeModal2()}>
                  <Modal.Header closeButton onClick={() => this.closeModal2()} >
                    <Modal.Title align="center">Actualizar Perfil</Modal.Title>
                  </Modal.Header>
                  <Modal.Footer>
                    <div class="center">
                      <div className="edit-form">
                        <form>
                          <div className="form-group">
                            <label htmlFor="username">Nombre</label>
                            <input
                              type="text"
                              className="form-control"
                              id="username"
                              value={User.username}
                              onChange={this.onChangeUsername}
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                              type="text"
                              className="form-control"
                              id="email"
                              value={User.email}
                              onChange={this.onChangeEmail}
                            />
                          </div>
                        </form>

                        <Button className="btn btn-success" onClick={() => this.updateUser()}>
                          Actualizar
                        </Button>

                        <Alert show={this.state.showAlertEditRamo} variant={this.state.typeAlertEditRamo}>
                          {this.state.menssageAlertEdit}
                        </Alert>

                        <p>{this.state.message}</p>
                      </div>
                    </div>
                  </Modal.Footer>
                </Modal>

                <br></br>
              </div>
            ) : (
              <div>
                <h3 class="text-muted">Debes iniciar sesión</h3>
                <Link to={"/login"}>
                  Inicia Sesión
                </Link>
              </div>
            )}
          </div>
        </header >
      </div >

    );
  }
}