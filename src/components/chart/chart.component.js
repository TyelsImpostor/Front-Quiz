import React, { Component } from "react";
import { Bar, Radar } from "react-chartjs-2";
import PreguntaDataService from "../../services/pregunta.service";
import UsuarioDataService from "../../services/user.service";
import { Link } from "react-router-dom";

import {
  Accordion, Table, Card, Button, Tab, Nav, Row, Col, Tabs
} from 'react-bootstrap';

import AuthService from "../../services/auth.service";

export default class Chart extends Component {
  constructor(props) {
    super(props);
    this.retrieve = this.retrieve.bind(this);
    this.Datos = this.Datos.bind(this);

    this.state = {
      respuesta: [],
      respuesta2: [],
      id: [],
      cant: [],
      colores: [],
      data: [],
      opciones: [],
      preguntas: [],
      datos: [],
      nombre2: [],
      cantidad2: [],

      nombre: [],
      cantidad: [],
      usuarios: [],
      currentUsuario: null,
    }
  }

  async componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showUserBoard: user.roles.includes("user"),
        showModeratorBoard: user.roles.includes("moderator"),
        showTeacherBoard: user.roles.includes("teacher"),
      });
    }
    await this.peticion();
    await this.generarColores();
    await this.configurarGrafica();
    await this.configurarGrafica2();
    await this.retrieve();
  }

  async peticion() {
    var peticion = await fetch("https://spring-boot-back.herokuapp.com/api/quizpres/quizpre-chart");
    var respuesta = await peticion.json();
    this.setState({ respuesta: respuesta });
    var id = [], cant = [];
    for (var i = 0; i < respuesta.length; i = i + 2) {
      id.push(respuesta[i]);
      cant.push(respuesta[i + 1]);
    }
    this.setState({ id: id, cant: cant });

    var peticion = await fetch("https://spring-boot-back.herokuapp.com/api/preguntas/preguntas-users");
    var respuesta2 = await peticion.json();
    this.setState({ respuesta2: respuesta2 });
    var nombre = [], cantidad = [];
    for (var i = 0; i < respuesta2.length; i = i + 2) {
      nombre.push(respuesta2[i]);
      cantidad.push(respuesta2[i + 1]);
    }
    this.setState({ nombre: nombre, cantidad: cantidad });
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
    for (var i = 0; i < this.state.respuesta.length; i++) {
      colores.push(this.colorHEX());
    }
    this.setState({ colores: colores });
  }

  configurarGrafica() {
    const data1 = {
      labels: this.state.id,
      datasets: [{
        label: "Datos",
        data: this.state.cant,
        backgroundColor: this.state.colores
      }]
    };
    const opciones1 = {
      responsive: true,
      maintainAspectRatio: false
    }
    this.setState({ data1: data1, opciones1: opciones1 });
  }

  configurarGrafica2() {
    const data2 = {
      labels: this.state.nombre,
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
  }

  async retrieve() {
    var usuarios = [];
    await PreguntaDataService.getAll()
      .then(response => {
        this.setState({
          preguntas: response.data
        });
        //console.log(response.data);
      })
      .catch(e => {
        //console.log(e);
      });

    await UsuarioDataService.getAll()
      .then(response => {
        for (var i = 0; i < response.data.length; i++) {
          for (var j = 0; j < this.state.nombre.length; j++) {
            if (response.data[i].username == this.state.nombre[j]) {
              usuarios.push(response.data[i]);
            }
          }
        }

        this.setState({ usuarios: usuarios });
      })
      .catch(e => {
        //console.log(e);
      });
  }

  Datos(id) {
    var nombre2 = [], cantidad2 = [];
    PreguntaDataService.getChart(id)
      .then(response => {
        this.setState({
          datos: response.data
        });
        //console.log(response.data);
        for (var i = 0; i < response.data.length; i = i + 2) {
          nombre2.push(response.data[i]);
          cantidad2.push(response.data[i + 1]);
        }
        this.setState({ nombre2: nombre2, cantidad2: cantidad2 });
        const data3 = {
          labels: this.state.nombre2,
          datasets: [{
            label: "Datos",
            data: this.state.cantidad2,
            backgroundColor: this.state.colores
          }]
        };
        const opciones3 = {
          responsive: true,
          maintainAspectRatio: false
        }
        this.setState({ data3: data3, opciones3: opciones3 });
      })
      .catch(e => {
        //console.log(e);
      });
  }

  setActiveUsuarios(usuario) {
    this.setState({
      currentUsuario: usuario
    });
  }

  render() {
    const { preguntas, currentUser, showUserBoard, showModeratorBoard, showTeacherBoard, usuarios, currentUsuario } = this.state;

    return (
      <div className="container">
        <header>
          {currentUser ? (
            <h3></h3>
          ) : (
            <div>
              <h3 class="text-muted">Debes iniciar sesión</h3>
              <Link to={"/login"}>
                Inicia Sesión
              </Link>
            </div>
          )}
          {(showTeacherBoard || showModeratorBoard) && (
            <div>
              <div class="center">
                <h3 class="img-center">Ranking y Graficos</h3>
                <p class="center">Revisa los distintos graficos de nuestro sistema (Profesores y Preguntas).</p>
              </div>

              <Tabs justify variant="tabs" defaultActiveKey="chartpregunta">
                <Tab eventKey="chartpregunta" title="Ranking de Preguntas">
                  <div class="center">
                    <h3 class="img-center">Ranking de Preguntas</h3>
                    <p class="center">Revisar nuestro Ranking de las preguntas más populares en Quiz.</p>
                  </div>

                  <br></br>

                  <div className="list row">

                    <div className="col-md-8">
                      <br></br>
                      <br></br>
                      <div className="App" style={{ width: "700px", height: "300px" }}>
                        <Bar data={this.state.data1} options={this.state.opciones1} />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <Table striped bordered hover>
                        <h3 class="img-center">Preguntas Frecuentes</h3>
                        <Accordion defaultActiveKey="0">
                          <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                              ¿Que refleja este gráfico?
                            </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="0">
                            <Card.Body>En este gráfico verás todas las preguntas en el sistema, y cuantas veces estas fueron usadas para los quiz, usa esta información para identificar las preguntas más populares.</Card.Body>
                          </Accordion.Collapse>
                          <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="1">
                              ¿De qué me sirven las Estadísticas de la pregunta?
                            </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="1">
                            <Card.Body>Existen 5 categorías en las que se puede incluir las preguntas, unas más que otras, usa las estadísticas para identificar qué categoría está más presente en las preguntas.</Card.Body>
                          </Accordion.Collapse>
                          <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="2">
                              Ya elegí una pregunta, ¿Que hago ahora?
                            </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="2">
                            <Card.Body>Regresa a la interfaz de añadir preguntas a tu quiz, y añade la pregunta que elegiste.</Card.Body>
                          </Accordion.Collapse>
                        </Accordion>
                      </Table>
                    </div>
                  </div>

                  <br></br>
                  <br></br>
                  <hr></hr>
                  <br></br>

                  <div>
                    <h3>Estadísticas y Detalles</h3>
                    <p>Revisa cada pregunta y sus estadísticas.</p>
                  </div>

                  <br></br>

                  <div>
                    <Tab.Container id="left-tabs-example">
                      <Row>
                        <Col sm={3}>
                          <Nav variant="pills" className="flex-column">
                            <ul className="list-group">
                              {preguntas &&
                                preguntas.map((pregunta) => (
                                  <li className="list-group-item">
                                    <Nav.Item>
                                      <Nav.Link eventKey={pregunta.id} onClick={() => this.Datos(pregunta.id)}>{pregunta.titulo}</Nav.Link>
                                    </Nav.Item>
                                  </li>
                                ))}
                            </ul>
                          </Nav>
                        </Col>
                        <Col sm={9}>
                          <Tab.Content>
                            {preguntas &&
                              preguntas.map((pregunta) => (
                                <Tab.Pane eventKey={pregunta.id}>
                                  <div className="list row">

                                    <div className="col-md-5">
                                      <div>
                                        <div>
                                          <label>
                                            <strong>Titulo:</strong>
                                          </label>{" "}
                                          {pregunta.titulo}
                                        </div>
                                        <div>
                                          <label>
                                            <strong>Enunciado:</strong>
                                          </label>{" "}
                                          {pregunta.enunciado}
                                        </div>
                                        <div>
                                          <label>
                                            <strong>Tipo:</strong>
                                          </label>{" "}
                                          {pregunta.tipo}
                                        </div>
                                        <div>
                                          <label>
                                            <strong>Opciones:</strong>
                                          </label>{" "}
                                          <div>
                                            {pregunta.opcion1}
                                          </div>

                                          <div>
                                            {pregunta.opcion2}
                                          </div>

                                          <div>
                                            {pregunta.opcion3}
                                          </div>

                                          <div>
                                            {pregunta.opcion4}
                                          </div>

                                          {pregunta.opcion5 == "0" ? (
                                            <div>
                                            </div>
                                          ) : (
                                            <div>
                                              {pregunta.opcion5}
                                            </div>
                                          )}
                                        </div>
                                        <div>
                                          <label>
                                            <strong>Respuesta:</strong>
                                          </label>{" "}
                                          {pregunta.respuesta1 == 1 ? (
                                            <div>
                                              {pregunta.opcion1}
                                            </div>
                                          ) : (
                                            <div></div>
                                          )}

                                          {pregunta.respuesta2 == 1 ? (
                                            <div>
                                              {pregunta.opcion2}
                                            </div>
                                          ) : (
                                            <div></div>
                                          )}

                                          {pregunta.respuesta3 == 1 ? (
                                            <div>
                                              {pregunta.opcion3}
                                            </div>
                                          ) : (
                                            <div></div>
                                          )}

                                          {pregunta.respuesta4 == 1 ? (
                                            <div>
                                              {pregunta.opcion4}
                                            </div>
                                          ) : (
                                            <div></div>
                                          )}

                                          {pregunta.respuesta5 == 1 ? (
                                            <div>
                                              {pregunta.opcion5}
                                            </div>
                                          ) : (
                                            <div></div>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="col-md-2">
                                      <div></div>
                                    </div>

                                    <div className="col-md-5">
                                      <br></br>
                                      <br></br>
                                      <div className="App" style={{ width: "300px", height: "300px" }}>
                                        <Radar data={this.state.data3} options={this.state.opciones3} />
                                      </div>
                                    </div>
                                  </div>
                                </Tab.Pane>
                              ))}
                          </Tab.Content>
                        </Col>
                      </Row>
                    </Tab.Container>
                  </div>
                </Tab>
                <Tab eventKey="chartprofesor" title="Ranking de Profesores">
                  <div class="center">
                    <h3 class="img-center">Ranking de Profesores</h3>
                    <p class="center">Revisar nuestro Ranking de los profesores con mas preguntas creadas.</p>
                  </div>

                  <br></br>

                  <div className="list row">

                    <div className="col-md-8">
                      <br></br>
                      <br></br>
                      <div className="App" style={{ width: "700px", height: "300px" }}>
                        <Bar data={this.state.data2} options={this.state.opciones2} />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <Table striped bordered hover>
                        <h3 class="img-center">Preguntas Frecuentes</h3>
                        <Accordion defaultActiveKey="0">
                          <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                              ¿Que refleja este gráfico?
                            </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="0">
                            <Card.Body>En este gráfico verás a todos los profesores en el sistema, y cuantas veces estos crearon una pregunta para un Quiz, usa esta información para identificar a los profesores más populares.</Card.Body>
                          </Accordion.Collapse>
                        </Accordion>
                      </Table>
                    </div>
                  </div>

                  {showModeratorBoard && (
                    <>
                      <br></br>
                      <br></br>
                      <hr></hr>
                      <br></br>

                      <div>
                        <h3>Informacion de los Profesores</h3>
                      </div>
                      <br></br>
                      <div>
                        <Tab.Container id="left-tabs-example">
                          <Row>
                            <Col sm={3}>
                              <Nav variant="pills" className="flex-column">
                                <ul className="list-group">
                                  {usuarios &&
                                    usuarios.map((pregunta) => (
                                      <li className="list-group-item">
                                        <Nav.Item>
                                          <Nav.Link eventKey={pregunta.id} onClick={() => this.setActiveUsuarios(pregunta)}>{pregunta.username}</Nav.Link>
                                        </Nav.Item>
                                      </li>
                                    ))}
                                </ul>
                              </Nav>
                            </Col>
                            <Col sm={9}>
                              <Tab.Content>
                                {usuarios &&
                                  usuarios.map((pregunta) => (
                                    <Tab.Pane eventKey={pregunta.id}>
                                      <div className="col-md-8">
                                        {currentUsuario ? (
                                          <div>
                                            <div>
                                              <label>
                                                <strong>Username:</strong>
                                              </label>{" "}
                                              {currentUsuario.username}
                                            </div>
                                            <div>
                                              <label>
                                                <strong>E-mail:</strong>
                                              </label>{" "}
                                              {currentUsuario.email}
                                            </div>
                                          </div>
                                        ) : (
                                          <div>
                                            <br />
                                          </div>
                                        )}
                                      </div>
                                    </Tab.Pane>
                                  ))}
                              </Tab.Content>
                            </Col>
                          </Row>
                        </Tab.Container>
                      </div>
                    </>
                  )}
                </Tab>
              </Tabs>
            </div>
          )}

          {showUserBoard && (
            <h3>Usted no tiene el permiso para acceder a esta zona.</h3>
          )}
        </header>
      </div>
    );
  }
}