import React, { Component } from "react";
import PreguntaDataService from "../../services/pregunta.service";
import PreRecurDataService from "../../services/prerecur.service";
import RecursoDataService from "../../services/recurso.service";
import RetroalimentacionDataService from "../../services/retroalimentacion.service";
import { Link } from "react-router-dom";

import {
  Accordion, Button, Form, Modal, Card, Table, OverlayTrigger, Tooltip, Jumbotron
} from 'react-bootstrap';

import AuthService from "../../services/auth.service";

export default class PreguntasList extends Component {
  constructor(props) {
    super(props);
    this.retrievePreguntas = this.retrievePreguntas.bind(this);
    this.onChangeRespuesta1 = this.onChangeRespuesta1.bind(this);
    this.onChangeRespuesta2 = this.onChangeRespuesta2.bind(this);
    this.onChangeRespuesta3 = this.onChangeRespuesta3.bind(this);
    this.onChangeRespuesta4 = this.onChangeRespuesta4.bind(this);
    this.onChangeTiempoRespuesta = this.onChangeTiempoRespuesta.bind(this);
    this.saveRespuesta = this.saveRespuesta.bind(this);

    this.state = {
      visible: false,
      respuesta: false,
      retroalimentacion: null,
      retro: false,
      progresspregunta: false,
      respuesta1: "0",
      respuesta2: "0",
      respuesta3: "0",
      respuesta4: "0",
      tiemporespuesta: "",
      puntaje: "0",
      usuarioid: "",
      preguntaid: "",
      quizid: "null",
      puntajetotal: "0",
      puntajeTotal: "0",
      resultado: "0",
      recursoid: "",
      currentPregunta: [],
      retroalimentacions: [],
      pregunta: {
        id: null,
        titulo: "",
        tipo: "",
        enunciado: "",
        opcion1: "",
        opcion2: "",
        opcion3: "",
        opcion4: "",
        opcion5: "",
        respuesta1: "",
        respuesta2: "",
        respuesta3: "",
        respuesta4: "",
        respuesta5: "",
        tiemporespuesta: "",
        puntaje: "",
        random: "",
        users: ""
      },
      currentRecurso: {
        id: null,
        title: "",
        type: "",
        privado: "",
        users: "",
        resource: ""
      },
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
    await this.retrievePreguntas();
  }

  openModal() {
    this.setState({
      visible: true,
      progresspregunta: false,
      respuesta: false,
    });
  }

  async closeModal() {
    this.setState({
      visible: false,
      progresspregunta: false,
      respuesta: false,
      id: null,
      respuesta1: "0",
      respuesta2: "0",
      respuesta3: "0",
      respuesta4: "0",
      tiemporespuesta: "",
      puntaje: "0",
      usuarioid: "",
      preguntaid: "",
      quizid: "null",
      puntajeTotal: "0",
      titulo: "",
      tipo: "",
      enunciado: "",
      tiemporespuesta: "",
      puntaje: "",
      random: "",
      users: "",
      recursoid: "",
      title: "",
      type: "",
      privado: "",
      resource: ""
    });
    window.location.reload();
  }

  async retrievePreguntas() {
    var retroalimentacions = []
    await PreguntaDataService.getAll()
      .then(response => {
        this.setState({
          currentPregunta: response.data
        });
        console.log(response.data);
        const rand = Math.floor(Math.random() * Math.floor(response.data.length));
        this.setState({
          pregunta: response.data[rand]
        });
      })
      .catch(e => {
        console.log(e);
      });

    await PreRecurDataService.getAll()
      .then(response => {
        console.log(response.data);
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].preguntaid == this.state.pregunta.id) {
            this.setState({
              recursoid: response.data[i].recursoid
            });
          }
        }
        this.setState({ progressquiz: true });
      })
      .catch(e => {
        console.log(e);
      });

    await RetroalimentacionDataService.getAll()
      .then(response => {
        for (var j = 0; j < response.data.length; j++) {
          if (response.data[j].preguntaid == this.state.pregunta.id) {
            retroalimentacions.push(response.data[j]);
          }
        }
      })
      .catch(e => {
        console.log(e);
      });
    this.setState({ retroalimentacions: retroalimentacions });
    console.log(retroalimentacions);

    if (this.state.recursoid != null) {
      await RecursoDataService.get(this.state.recursoid)
        .then(response => {
          this.setState({
            currentRecurso: response.data
          });
        })
        .catch(e => {
          console.log(e);
        });
    }
  }

  onChangeRespuesta1(e) {
    this.setState({
      respuesta1: e.target.value
    });
  }

  onChangeRespuesta2(e) {
    this.setState({
      respuesta2: e.target.value
    });
  }

  onChangeRespuesta3(e) {
    this.setState({
      respuesta3: e.target.value
    });
  }

  onChangeRespuesta4(e) {
    this.setState({
      respuesta4: e.target.value
    });
  }

  onChangeTiempoRespuesta(e) {
    this.setState({
      tiemporespuesta: e.target.value
    });
  }

  saveRespuesta() {
    if (this.state.respuesta1 == this.state.pregunta.respuesta1) {
      if (this.state.respuesta2 == this.state.pregunta.respuesta2) {
        if (this.state.respuesta3 == this.state.pregunta.respuesta3) {
          if (this.state.respuesta4 == this.state.pregunta.respuesta4) {
            this.setState({
              puntajeTotal: this.state.pregunta.puntaje,
              respuesta: true
            });
          } else {
            this.setState({
              puntajeTotal: this.state.puntaje,
              respuesta: true
            });
          }
        } else {
          this.setState({
            puntajeTotal: this.state.puntaje,
            respuesta: true
          });
        }
      } else {
        this.setState({
          puntajeTotal: this.state.puntaje,
          respuesta: true
        });
      }
    } else {
      this.setState({
        puntajeTotal: this.state.puntaje,
        respuesta: true
      });
    }
  }

  handleClick() {
    this.setState({
      progresspregunta: true
    });
  }

  setActiveRetro(retroalimentacion) {
    this.setState({
      retroalimentacion: retroalimentacion,
      retro: true
    });
  }

  handleClickRetro() {
    this.setState({
      retro: false
    });
  }

  render() {
    const { pregunta, currentRecurso, currentUser, showUserBoard, showModeratorBoard, showTeacherBoard, respuesta, puntajeTotal, retroalimentacions, retroalimentacion, retro, progresspregunta } = this.state;

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
              <div className="list row">
                <div className="col-md-6">
                  <Jumbotron>
                    <h2 class="img-center">Quick-Test</h2>
                    <p>
                      Prueba tu conocimiento con este sistema didáctico para responder preguntas.
                    </p>
                    <img class="img-center" src="../../../test.png" width="200" height="160" />
                  </Jumbotron>
                </div>
                <div className="col-md-6">
                  <Table striped bordered hover>
                    <h3 class="center">Preguntas Frecuentes</h3>
                    <Accordion defaultActiveKey="0">
                      <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                          ¿En qué consiste este Quick-Test?
                       </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>Al presionar el Boton "Iniciar Intento", podrás responder una pregunta aleatoria (la pregunta puede ser de cualquier tipo y materia), no hay un límite para realizar un Quick-Test.</Card.Body>
                      </Accordion.Collapse>
                      <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                          ¿Este Quick-Test tiene una calificación?
                       </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="1">
                        <Card.Body>En un Quick-Test no existen calificaciones, el Quick-Test tiene como objetivo, presentar un desafío didáctico y entretenido sin la presión de calificaciones.</Card.Body>
                      </Accordion.Collapse>
                      <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="2">
                          ¿Pueden mis compañeros ver mis resultados en un Quick-Test?
                       </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="2">
                        <Card.Body>Cuando respondes un Quick-Test, puedes ver tu resultado de manera inmediata, sin embargo, cuando inicias un nuevo Quick-Test, los resultados anteriores se borran, por ende, en un Quick-Test no se guardan resultados y solo tu puedes verlos.</Card.Body>
                      </Accordion.Collapse>
                    </Accordion>
                  </Table>
                </div>
              </div>

              <br></br>
              <div class="img-center">
                <button type="button" class="btn btn-primary btn-lg btn-block" onClick={() => this.openModal()}>
                  Iniciar Intento
                </button>
              </div>

              <Modal show={this.state.visible} size="xl" >
                <Modal.Header closeButton onClick={() => this.closeModal()} >
                  {progresspregunta == false ? (
                    <Modal.Title>Cargando Pregunta</Modal.Title>
                  ) : (
                    <Modal.Title>Pregunta</Modal.Title>
                  )}
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <div>
                      {respuesta == false ? (
                        <div className="submit-form">
                          {progresspregunta == false ? (
                            <div class="img-center">
                              <img src="../../../progress.gif" width="400" height="350" />
                              <h2 class="img-center">Construyendo</h2>
                              <br></br>
                              <button id="box" class="img-center" class="btn btn-primary btn-lg btn-block" onClick={() => this.handleClick()}>
                                Comenzar
                          </button>
                            </div>
                          ) : (
                            <div>
                              {retro == false ? (
                                <div>
                                  {pregunta && (
                                    <div className="list row">

                                      <div className="col-md-6">
                                        {retroalimentacions &&
                                          retroalimentacions.map((retroalimentacion) => (
                                            <div>
                                              {retroalimentacion.preguntaid == pregunta.id && (
                                                <div>
                                                  {retroalimentacion.activo == true && (
                                                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">¿Una Ayudadita?</Tooltip>}>
                                                      <Button size="sm" variant="light" onClick={() => this.setActiveRetro(retroalimentacion)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-index-thumb" viewBox="0 0 16 16">
                                                          <path d="M6.75 1a.75.75 0 0 1 .75.75V8a.5.5 0 0 0 1 0V5.467l.086-.004c.317-.012.637-.008.816.027.134.027.294.096.448.182.077.042.15.147.15.314V8a.5.5 0 0 0 1 0V6.435l.106-.01c.316-.024.584-.01.708.04.118.046.3.207.486.43.081.096.15.19.2.259V8.5a.5.5 0 1 0 1 0v-1h.342a1 1 0 0 1 .995 1.1l-.271 2.715a2.5 2.5 0 0 1-.317.991l-1.395 2.442a.5.5 0 0 1-.434.252H6.118a.5.5 0 0 1-.447-.276l-1.232-2.465-2.512-4.185a.517.517 0 0 1 .809-.631l2.41 2.41A.5.5 0 0 0 6 9.5V1.75A.75.75 0 0 1 6.75 1zM8.5 4.466V1.75a1.75 1.75 0 1 0-3.5 0v6.543L3.443 6.736A1.517 1.517 0 0 0 1.07 8.588l2.491 4.153 1.215 2.43A1.5 1.5 0 0 0 6.118 16h6.302a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.271-2.715a2 2 0 0 0-1.99-2.199h-.581a5.114 5.114 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.632 2.632 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046l-.048.002zm2.094 2.025z" />
                                                        </svg>
                                                      </Button>
                                                    </OverlayTrigger>
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                        <div>
                                          <br></br>
                                          <strong>Enunciado: </strong>
                                          {pregunta.enunciado.substring(0, 50)}{" "}
                                          {pregunta.enunciado.substr(50, 50)}{" "}
                                          {pregunta.enunciado.substr(50, 50)}{" "}
                                          {pregunta.enunciado.substr(200, pregunta.enunciado.length)}
                                        </div>

                                        <div>
                                          <br></br>
                                          <div>
                                            <input
                                              type="checkbox"
                                              id="respuesta1"
                                              value="1"
                                              defaultValue="0"
                                              onChange={this.onChangeRespuesta1}
                                              name="respuesta1"
                                            />&nbsp;&nbsp;&nbsp;
                                            {pregunta.opcion1}
                                          </div>

                                          <div>
                                            <input
                                              type="checkbox"
                                              id="respuesta2"
                                              value="1"
                                              defaultValue="0"
                                              onChange={this.onChangeRespuesta2}
                                              name="respuesta2"
                                            />&nbsp;&nbsp;&nbsp;
                                            {pregunta.opcion2}
                                          </div>

                                          <div>
                                            <input
                                              type="checkbox"
                                              id="respuesta3"
                                              value="1"
                                              defaultValue="0"
                                              onChange={this.onChangeRespuesta3}
                                              name="respuesta3"
                                            />&nbsp;&nbsp;&nbsp;
                                            {pregunta.opcion3}
                                          </div>

                                          <div>
                                            <input
                                              type="checkbox"
                                              id="respuesta4"
                                              value="1"
                                              defaultValue="0"
                                              onChange={this.onChangeRespuesta4}
                                              name="respuesta4"
                                            />&nbsp;&nbsp;&nbsp;
                                            {pregunta.opcion4}
                                          </div>

                                          <div className="form-group">
                                            <label htmlFor="tiemporespuesta">Tiempo de Respuesta</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="tiemporespuesta"
                                              required
                                              value={this.state.tiemporespuesta}
                                              onChange={this.onChangeTiempoRespuesta}
                                              name="tiemporespuesta"
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="col-md-6">
                                        <div>
                                          {currentRecurso && (
                                            <div>
                                              {currentRecurso.type == "imagen" && (
                                                <img src={"https://spring-boot-back.herokuapp.com/api/recursos/resource/" + currentRecurso.id} width="500" height="280"></img>
                                              )}

                                              {currentRecurso.type == "documento" && (
                                                <div>
                                                  <br></br>
                                                  <br></br>
                                                  <object data={"https://spring-boot-back.herokuapp.com/api/recursos/resource/" + currentRecurso.id} type="application/pdf" width="100%" height="100%">

                                                    <img src="../../../documento.png" href={"https://spring-boot-back.herokuapp.com/api/recursos/resource/" + currentRecurso.id} width="200" height="200" />
                                                    <p>Puedes descargarte el archivo desde <a href={"https://spring-boot-back.herokuapp.com/api/recursos/resource/" + currentRecurso.id}>aquí</a></p>
                                                  </object>
                                                </div>
                                              )}

                                              {currentRecurso.type == "link" && (
                                                <iframe src={"https://www.youtube.com/embed/" + currentRecurso.link + "?autoplay=1&loop=1"} width="500" height="280"></iframe>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div>
                                  {retroalimentacion && (
                                    <div className="list row">

                                      <div className="col-md-6">
                                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Regresar</Tooltip>}>
                                          <Button size="sm" variant="light" onClick={() => this.handleClickRetro()}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-reply" viewBox="0 0 16 16">
                                              <path d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822.984.624 1.99 1.76 2.595 3.876-1.02-.983-2.185-1.516-3.205-1.799a8.74 8.74 0 0 0-1.921-.306 7.404 7.404 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254a.503.503 0 0 0-.042-.028.147.147 0 0 1 0-.252.499.499 0 0 0 .042-.028l3.984-2.933zM7.8 10.386c.068 0 .143.003.223.006.434.02 1.034.086 1.7.271 1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96v-.667z" />
                                            </svg>
                                          </Button>
                                        </OverlayTrigger>
                                        <label>
                                          <br></br>
                                          <strong>Enunciado:</strong>
                                        </label>{" "}
                                        {retroalimentacion.enunciado.substring(0, 50)}{" "}
                                        {retroalimentacion.enunciado.substr(50, 50)}{" "}
                                        {retroalimentacion.enunciado.substr(50, 50)}{" "}
                                        {retroalimentacion.enunciado.substr(200, retroalimentacion.enunciado.length)}
                                      </div>

                                      <div className="col-md-6">
                                        <Table striped bordered hover>
                                          <h3 class="center">Preguntas Frecuentes</h3>
                                          <Accordion>
                                            <Card.Header>
                                              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                                ¿Qué es una Retroalimentación?
                                        </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="0">
                                              <Card.Body>Una Retroalimentación es establecida por el Profesor, esta es una ayuda para poder responder una pregunta en específica.</Card.Body>
                                            </Accordion.Collapse>
                                            <Card.Header>
                                              <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                                ¿Pierdo el puntaje si uso la Retroalimentación?
                                        </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="1">
                                              <Card.Body>No pierdes el puntaje de la pregunta al usar la Retroalimentación, su objetivo es ayudar, NO PERJUDICAR.</Card.Body>
                                            </Accordion.Collapse>
                                          </Accordion>
                                        </Table>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          {puntajeTotal == 0 ? (
                            <div className="list row">

                              <div className="col-md-3">
                                <img class="img-flip" src="../../../aplausos.gif" width="200" height="200" />
                              </div>

                              <div className="col-md-6">
                                <br></br>
                                <br></br>
                                <br></br>
                                <h2 class="img-center"><strong>Buen intento</strong></h2>
                                <h5 class="center">Recuerda que: "Del fracaso se aprende."</h5>
                              </div>

                              <div className="col-md-3">
                                <img class="img-center" src="../../../aplausos.gif" width="200" height="200" />
                              </div>
                            </div>
                          ) : (
                            <div className="list row">

                              <div className="col-md-3">
                                <img class="img-center" src="../../../einstein.gif" width="550" height="300" />
                              </div>

                              <div className="col-md-6">
                                <br></br>
                                <br></br>
                                <br></br>
                                <h2 class="center" style={{ color: 'black' }}><strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Felicitaciones</strong></h2>
                                <h4 class="img-center" style={{ color: 'black' }}>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.puntajeTotal} Puntos!!!</h4>
                                <h6 class="center" style={{ color: 'black' }}>Recuerda: "Siempre se puede seguir aprendiendo."</h6>
                              </div>

                              <div className="col-md-3">
                                <img class="img-flip" src="../../../einstein.gif" width="550" height="300" />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Form>
                </Modal.Body>
                {progresspregunta == false ? (
                  <div></div>
                ) : (
                  <Modal.Footer>
                    {respuesta == false ? (
                      <Button variant="primary" onClick={this.saveRespuesta}>
                        Responder
                      </Button>
                    ) : (
                      <Button variant="primary" onClick={() => window.location.reload()}>
                        Regresar
                      </Button>
                    )}
                  </Modal.Footer>
                )}
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