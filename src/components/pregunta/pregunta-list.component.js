import React, { Component } from "react";
import PreguntaDataService from "../../services/pregunta.service";
import QuizDataService from "../../services/quiz.service";
import QuizPreDataService from "../../services/quizpre.service";
import QuizCurDataService from "../../services/quizcur.service";
import { Link } from "react-router-dom";

import {
  Accordion, Card, Table, Button, Col, Row, Tab, Nav, Tabs, Modal
} from 'react-bootstrap';

import AuthService from "../../services/auth.service";

export default class PreguntasList extends Component {

  constructor(props) {
    super(props);
    this.retrievePreguntas = this.retrievePreguntas.bind(this);
    this.retrieveQuiz = this.retrieveQuiz.bind(this);
    this.retrieveQuizCur = this.retrieveQuizCur.bind(this);
    this.retrieveQuizPre = this.retrieveQuizPre.bind(this);

    this.state = {
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
      usuario: undefined,
      preguntas: [],
      quizs: [],
      contPre: 0,
      contQuiz: 0,
      visibleeliminar: false,
      visibleeliminar2: false,
      deleteid: "",
    };
  }

  async componentDidMount() {
    this.setState({
      usuario: AuthService.getCurrentUser()
    });
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showUserBoard: user.roles.includes("user"),
        showModeratorBoard: user.roles.includes("moderator"),
        showTeacherBoard: user.roles.includes("teacher"),
      });
    }
    await this.retrievePreguntas();
    await this.retrieveQuiz();
  }

  async retrievePreguntas() {
    await PreguntaDataService.getAll()
      .then(response => {
        this.setState({
          preguntas: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  async retrieveQuiz() {
    await QuizDataService.getAll()
      .then(response => {
        this.setState({
          quizs: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  setActivePregunta(pregunta) {
    this.retrieveQuizPre(pregunta);
  }

  setActiveQuiz(quiz) {
    this.retrieveQuizCur(quiz);
  }

  async retrieveQuizPre(id) {
    var cantidad = 0;
    await QuizPreDataService.getAll()
      .then(response => {
        for (var i = 0; i < response.data.length; i++) {
          console.log(response.data[i].preguntaid);
          console.log(id);
          if (response.data[i].preguntaid == id) {
            cantidad++;
          }
        }
        this.setState({
          contPre: cantidad
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  async retrieveQuizCur(id) {
    var cantidad = 0;
    await QuizCurDataService.getAll()
      .then(response => {
        for (var i = 0; i < response.data.length; i++) {
          console.log(response.data[i].quizid);
          console.log(id);
          if (response.data[i].quizid == id) {
            cantidad++;
          }
        }
        this.setState({
          contQuiz: cantidad
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  deletePregunta(id) {
    PreguntaDataService.delete(id)
      .then(response => {
        console.log(response.data);
        this.retrievePreguntas();
        this.retrieveQuiz();
        this.setState({
          visibleeliminar: false,
          visibleeliminar2: false
        });
      })
      .catch(e => {
        console.log(e);
      })
  }

  deleteQuiz(id) {
    QuizDataService.delete(id)
      .then(response => {
        console.log(response.data);
        this.retrievePreguntas();
        this.retrieveQuiz();
        this.setState({
          visibleeliminar: false,
          visibleeliminar2: false
        });
      })
      .catch(e => {
        console.log(e);
      })
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

  closeModaleliminar2() {
    this.setState({
      visibleeliminar2: false,
      deleteid: "",
    });
  }
  openModaleliminar2(id) {
    this.setState({
      visibleeliminar2: true,
      deleteid: id,
    });
  }

  InputQuiz = (event) => {
    const query = event.target.value;
    this.setState({ query: query });
    //console.log(query);
    QuizDataService.findByTitulo(query)
      .then(response => {
        this.setState({
          quizs: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  };

  InputPregunta = (event) => {
    const query = event.target.value;
    this.setState({ query: query });
    //console.log(query);
    PreguntaDataService.findByTitulo(query)
      .then(response => {
        this.setState({
          preguntas: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  };

  render() {
    const { currentUser, showUserBoard, showModeratorBoard, showTeacherBoard, contPre, contQuiz, preguntas, quizs, deleteid, query } = this.state;

    return (
      <div className="">
        <header className="">
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
              <div class="img-center">
                <h2 class="center">Control Preguntas/Quiz</h2>
                <p>
                  Pagina a la que solo tiene acceso un Admin, control Preguntas/Quiz.
              </p>
              </div>
              <Tabs justify variant="tabs" defaultActiveKey="Quizpanel">
                <Tab eventKey="Quizpanel" title="Quiz">
                  <div class="center">
                    <h3 class="img-center">Panel de Quiz</h3>
                    <p class="center">Revisa los quiz en el sistema (puedes eliminarlas)</p>
                  </div>

                  <br></br>

                  <div className="list row">

                    <div className="col-md-7">
                      <div align="center">
                        <img src="../../../documento.png" width="300" height="250" />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <Table striped bordered hover>
                        <h3 class="img-center">Preguntas Frecuentes</h3>
                        <Accordion defaultActiveKey="0">
                          <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                              ¿Que refleja esta interfaz?
                      </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="0">
                            <Card.Body>En esta interfaz el administrador podrá visualizar las Quiz dentro del sistema y su respectivo detalle.</Card.Body>
                          </Accordion.Collapse>
                          <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="1">
                              ¿Qué ocurre si elimino una Quiz?
                      </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="1">
                            <Card.Body>Si eliminas una Quiz la eliminará automáticamente cualquier referencia dentro de otros Cursos, es por eso que CUIDADO al eliminar.</Card.Body>
                          </Accordion.Collapse>
                        </Accordion>
                      </Table>
                    </div>
                  </div>

                  <br></br>
                  <br></br>
                  <hr></hr>
                  <br></br>

                  <div center>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar"
                        value={this.props.query}
                        onChange={this.InputQuiz}
                      ></input>
                    </div>
                  </div>

                  <Tab.Container id="left-tabs-example">
                    <Row>
                      <Col sm={3}>
                        <Nav variant="pills" className="flex-column">
                          <ul className="list-group">
                            {quizs &&
                              quizs.map((quiz) => (
                                <li className="list-group-item">
                                  <Nav.Item>
                                    <Nav.Link eventKey={quiz.id} onClick={() => this.setActiveQuiz(quiz.id)}>{quiz.titulo}</Nav.Link>
                                  </Nav.Item>
                                </li>
                              ))}
                          </ul>
                        </Nav>
                      </Col>
                      <Col sm={9}>
                        <Tab.Content>
                          {quizs &&
                            quizs.map((quiz) => (
                              <Tab.Pane eventKey={quiz.id}>
                                <div className="list row">

                                  <div className="col-md-5">
                                    <div>
                                      <div>
                                        <label>
                                          <strong>Titulo:</strong>
                                        </label>{" "}
                                        {quiz.titulo}
                                      </div>
                                      <div>
                                        <label>
                                          <strong>Descripcion:</strong>
                                        </label>{" "}
                                        {quiz.descripcion}
                                      </div>
                                      <div>
                                        <label>
                                          <strong>Fecha de creacion:</strong>
                                        </label>{" "}
                                        {quiz.fechacreacion}
                                      </div>
                                      <div>
                                        <label>
                                          <strong>Fecha de termino:</strong>
                                        </label>{" "}
                                        {quiz.fechatermino}
                                      </div>
                                      <div>
                                        <label>
                                          <strong>Cuantas veces usada en Cursos:</strong>
                                        </label>{" "}
                                        <div>
                                          {contQuiz}
                                        </div>
                                      </div>
                                      <br></br>
                                      <button onClick={() => this.openModaleliminar2(quiz.id)} class="btn btn-danger">Borrar Quiz</button>
                                    </div>
                                  </div>
                                </div>
                              </Tab.Pane>
                            ))}
                        </Tab.Content>
                      </Col>
                    </Row>
                  </Tab.Container>
                </Tab>

                <Tab eventKey="Preguntapanel" title="Preguntas">
                  <div class="center">
                    <h3 class="img-center">Panel de Preguntas</h3>
                    <p class="center">Revisa las preguntas en el sistema (puedes eliminarlas)</p>
                  </div>

                  <br></br>

                  <div className="list row">

                    <div className="col-md-7">
                      <div align="center">
                        <img src="../../../test.png" width="300" height="250" />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <Table striped bordered hover>
                        <h3 class="img-center">Preguntas Frecuentes</h3>
                        <Accordion defaultActiveKey="0">
                          <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                              ¿Que refleja esta interfaz?
                      </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="0">
                            <Card.Body>En esta interfaz el administrador podrá visualizar las Preguntas dentro del sistema y su respectivo detalle.</Card.Body>
                          </Accordion.Collapse>
                          <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="1">
                              ¿Qué ocurre si elimino una Pregunta?
                      </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="1">
                            <Card.Body>Si eliminas una Pregunta la eliminará automáticamente cualquier referencia dentro de otros Quiz, es por eso que CUIDADO al eliminar.</Card.Body>
                          </Accordion.Collapse>
                        </Accordion>
                      </Table>
                    </div>
                  </div>

                  <br></br>
                  <br></br>
                  <hr></hr>
                  <br></br>

                  <div center>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar"
                        value={this.props.query}
                        onChange={this.InputPregunta}
                      ></input>
                    </div>
                  </div>

                  <Tab.Container id="left-tabs-example">
                    <Row>
                      <Col sm={3}>
                        <Nav variant="pills" className="flex-column">
                          <ul className="list-group">
                            {preguntas &&
                              preguntas.map((pregunta) => (
                                <li className="list-group-item">
                                  <Nav.Item>
                                    <Nav.Link eventKey={pregunta.id} onClick={() => this.setActivePregunta(pregunta.id)}>{pregunta.titulo}</Nav.Link>
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
                                      {pregunta.tipo == "Arrastrable" ? (
                                        <div>
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
                                              <strong>Enunciados:</strong>
                                            </label>{" "}
                                            <div>
                                              {pregunta.subenunciado1}
                                            </div>
                                            <div>
                                              {pregunta.subenunciado2}
                                            </div>
                                            <div>
                                              {pregunta.subenunciado3}
                                            </div>
                                            <div>
                                              {pregunta.subenunciado4}
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        <div>
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
                                      )}
                                      <div>
                                        <label>
                                          <strong>Cuantas veces usada en Quiz:</strong>
                                        </label>{" "}
                                        <div>
                                          {contPre}
                                        </div>
                                      </div>
                                      <br></br>
                                      <button onClick={() => this.openModaleliminar(pregunta.id)} class="btn btn-danger">Borrar Pregunta</button>
                                    </div>
                                  </div>
                                </div>
                              </Tab.Pane>
                            ))}
                        </Tab.Content>
                      </Col>
                    </Row>
                  </Tab.Container>
                </Tab>
              </Tabs>

              <Modal show={this.state.visibleeliminar} width="1000" height="500" effect="fadeInUp" onClickAway={() => this.closeModaleliminar()}>
                <Modal.Header>
                  <Modal.Title align="center">¿Deséa eliminar?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                  <button className="btn btn-warning" onClick={() => this.closeModaleliminar()}>
                    Close
                  </button>
                  <button className="btn btn-success" onClick={() => this.deletePregunta(deleteid)}>
                    Eliminar
                  </button>
                </Modal.Footer>
              </Modal>

              <Modal show={this.state.visibleeliminar2} width="1000" height="500" effect="fadeInUp" onClickAway={() => this.closeModaleliminar2()}>
                <Modal.Header>
                  <Modal.Title align="center">¿Deséa eliminar?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                  <button className="btn btn-warning" onClick={() => this.closeModaleliminar2()}>
                    Close
                  </button>
                  <button className="btn btn-success" onClick={() => this.deleteQuiz(deleteid)}>
                    Eliminar
                  </button>
                </Modal.Footer>
              </Modal>
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