import React, { Component } from "react";
import UsuQuizDataService from "../../services/usuquiz.service";
import UsuarioDataService from "../../services/user.service";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";

import {
  Accordion, Table, Card, Button, Tabs, Tab, Row, Col, Nav
} from 'react-bootstrap';

import AuthService from "../../services/auth.service";

export default class PreguntasList extends Component {
  constructor(props) {
    super(props);
    this.Resultados = this.Resultados.bind(this);
    this.Usuarios = this.Usuarios.bind(this);

    this.state = {
      usuarios: [],
      respuesta: [],
      colores: [],
      data: [],
      opciones: [],
      nombre: [],
      cantidad: [],
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
    };
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
    await this.Resultados();
    await this.generarColores();
    await this.configurarGrafica();
  }

  async Resultados() {
    var nombre = [], cantidad = [];
    await UsuQuizDataService.getChart(this.props.match.params.id)
      .then(response => {
        this.setState({
          respuesta: response.data
        });
        console.log(response.data);
        for (var i = 0; i < response.data.length; i = i + 2) {
          nombre.push(response.data[i]);
          cantidad.push(response.data[i + 1]);
        }
        this.setState({ nombre: nombre, cantidad: cantidad });
        this.Usuarios();
      })
      .catch(e => {
        console.log(e);
      });
  }

  Usuarios() {
    var usuarios = [];
    UsuarioDataService.getAll()
      .then(response => {
        console.log(response.data);
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
        console.log(e);
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
    for (var i = 0; i < this.state.respuesta.length; i++) {
      colores.push(this.colorHEX());
    }
    this.setState({ colores: colores });
  }

  configurarGrafica() {
    const data1 = {
      labels: this.state.nombre,
      datasets: [{
        label: "Datos",
        data: this.state.cantidad,
        backgroundColor: this.state.colores
      }]
    };
    const opciones1 = {
      responsive: true,
      maintainAspectRatio: false
    }
    this.setState({ data1: data1, opciones1: opciones1 });
  }

  render() {
    const { currentUser, showUserBoard, showModeratorBoard, showTeacherBoard, usuarios } = this.state;

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
          {showTeacherBoard || (showModeratorBoard && (
            <div>
              <div class="center">
                <h3 class="img-center">Resumen de tu quiz</h3>
                <p class="center">Usa este Gráfico para evaluar el rendimiento de tus alumnos.</p>
              </div>

              <div className="list row">

                <div className="col-md-8">
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
                        <Card.Body>En este grafico se reflejaran los resultados de los alumnos que resolvieron un determinado Quiz.</Card.Body>
                      </Accordion.Collapse>
                      <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                          ¿De qué me sirve este gráfico?
                     </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="1">
                        <Card.Body>Para evaluar el rendimiento de tus alumnos, para determinar en qué materia son más débiles y en que materia son más fuertes.</Card.Body>
                      </Accordion.Collapse>
                    </Accordion>
                  </Table>
                </div>
              </div>

              <br></br>
              <br></br>

              <div>
                <h3>Contacto de los Alumnos</h3>
              </div>
              <br></br>

              <div className="list row">

                <br></br>
                <br></br>
                <div className="col-md-8">
                  <Tab.Container id="left-tabs-example">
                    <Row>
                      <Col sm={3}>
                        <Nav variant="pills" className="flex-column">
                          <ul className="list-group">
                            {usuarios &&
                              usuarios.map((usuario) => (
                                <li className="list-group-item">
                                  <Nav.Item>
                                    <Nav.Link eventKey={usuario.id}>{usuario.username}</Nav.Link>
                                  </Nav.Item>
                                </li>
                              ))}
                          </ul>
                        </Nav>
                      </Col>
                      <Col sm={9}>
                        <Tab.Content>
                          {usuarios &&
                            usuarios.map((usuario) => (
                              <Tab.Pane eventKey={usuario.id}>
                                <div>
                                  <h4>Detalles:</h4>
                                  <div>
                                    <label>
                                      <strong>Titulo:</strong>
                                    </label>{" "}
                                    {usuario.username}
                                  </div>
                                  <div>
                                    <label>
                                      <strong>Tipo:</strong>
                                    </label>{" "}
                                    {usuario.email}
                                  </div>
                                </div>
                              </Tab.Pane>
                            ))}
                        </Tab.Content>
                      </Col>
                    </Row>
                  </Tab.Container>
                </div>

                <div className="col-md-4">
                  <Table striped bordered hover>
                    <h3 class="img-center">Preguntas Frecuentes</h3>
                    <Accordion defaultActiveKey="0">
                      <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                          ¿Contacto de Alumnos, de qué me sirve?
                    </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>Si el desempeño de uno de tus estudiantes durante el quiz, no refleja su desempeño en clases, puedes usar su contacto para comunicarte con él y saber que paso.</Card.Body>
                      </Accordion.Collapse>
                    </Accordion>
                  </Table>
                </div>
              </div>
            </div>
          ))}

          {showUserBoard && (
            <h3>Usted no tiene el permiso para acceder a esta zona.</h3>
          )}
        </header>
      </div>
    );
  }
}