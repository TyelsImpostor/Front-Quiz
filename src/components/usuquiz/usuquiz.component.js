import React, { Component } from "react";
import UsuQuizDataService from "../../services/usuquiz.service";
import RespuestasDataService from "../../services/respuesta.service";
import QuizPreDataService from "../../services/quizpre.service";
import PreguntaDataService from "../../services/pregunta.service";
import { HorizontalBar, Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";

import {
  Accordion, Table, Card, Button, Tab, Row, Col, Nav
} from 'react-bootstrap';

import AuthService from "../../services/auth.service";

export default class PreguntasList extends Component {
  constructor(props) {
    super(props);
    this.Resultados = this.Resultados.bind(this);

    this.state = {
      quizs: [],
      preguntas: [],
      pregunta: [],
      respuestas: [],
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
    var nombre = [], cantidad = [], quizs = [], preguntas = [];

    QuizPreDataService.getAll()
      .then(response => {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].quizid == this.props.match.params.id) {
            quizs.push(response.data[i]);
          }
        }
        this.setState({ quizs: quizs });
        console.log(quizs);

        for (var i = 0; i < quizs.length; i++) {
          PreguntaDataService.get(quizs[i].preguntaid)
            .then(response => {
              preguntas.push(response.data);
            })
            .catch(e => {
              console.log(e);
            });
        }
        this.setState({ preguntas: preguntas });
        console.log(preguntas);

      })
      .catch(e => {
        console.log(e);
      });

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
      })
      .catch(e => {
        console.log(e);
      });
  }

  Preguntas(id) {
    var pregunta = [], respuestas = [];
    var id2 = this.props.match.params.id + id;
    RespuestasDataService.getChart(id2)
      .then(response => {
        console.log(response.data);
        for (var i = 0; i < response.data.length; i = i + 2) {
          pregunta.push(response.data[i]);
          respuestas.push(response.data[i + 1]);
        }
        this.setState({ pregunta: pregunta, respuestas: respuestas });
      })
      .catch(e => {
        console.log(e);
      });

    const data2 = {
      labels: this.state.pregunta,
      datasets: [{
        label: "Datos",
        data: this.state.respuestas,
        backgroundColor: this.state.colores
      }]
    };
    const opciones2 = {
      responsive: true,
      maintainAspectRatio: false
    }
    this.setState({ data2: data2, opciones2: opciones2 });
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
    const { currentUser, showUserBoard, showModeratorBoard, showTeacherBoard, preguntas } = this.state;

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
                <h3>Estadisticas de las preguntas</h3>
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
                                  <Nav.Link eventKey={pregunta.id} onClick={() => this.Preguntas(pregunta.id)}>{pregunta.titulo}</Nav.Link>
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
                              <div className="col-md-8">
                                <div className="App" style={{ width: "800px", height: "300px" }}>
                                  <HorizontalBar data={this.state.data2} options={this.state.opciones2} />
                                </div>
                              </div>
                            </Tab.Pane>
                          ))}
                      </Tab.Content>
                    </Col>
                  </Row>
                </Tab.Container>
              </div>
              <br></br>
            </div>
          ))}

          {showUserBoard && (
            <h3>Usted no tiene el permiso para acceder a esta zona.</h3>
          )}
        </header>
      </div >
    );
  }
}