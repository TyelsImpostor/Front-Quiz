import React, { Component } from "react";
import PreguntaDataService from "../../services/pregunta.service";
import QuizDataService from "../../services/quiz.service";
import QuizPreDataService from "../../services/quizpre.service";

import { striped, bordered, hover, Table, Button, Text, View , Overview, Modal, 
  InputGroup, FormControl, Form, Col, Jumbotron, Container, Badge, Row, OverlayTrigger, Overlay, Tooltip} from 'react-bootstrap';

import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";

export default class QuizPreList extends Component {
  constructor(props) {
    super(props);
    this.retrieveOpcions = this.retrieveOpcions.bind(this);
    this.refreshList = this.refreshList.bind(this);

    this.retrievePreguntas = this.retrievePreguntas.bind(this);

    //ADD PREGUNTA
    this.onChangeTitulo = this.onChangeTitulo.bind(this);
    this.onChangeTipo = this.onChangeTipo.bind(this);
    this.onChangeEnunciado = this.onChangeEnunciado.bind(this);
    this.onChangeTiempoRespuesta = this.onChangeTiempoRespuesta.bind(this);
    this.onChangePuntaje = this.onChangePuntaje.bind(this);
    this.onChangeRandom= this.onChangeRandom.bind(this);
    this.onChangeUserid = this.onChangeUserid.bind(this);
    this.savePregunta = this.savePregunta.bind(this);
    this.newPregunta = this.newPregunta.bind(this);
    //OPCIONES
    this.onChangeOpcion1 = this.onChangeOpcion1.bind(this);
    this.onChangeRespuesta1 = this.onChangeRespuesta1.bind(this);

    this.setActiveQuizpres = this.setActiveQuizpres.bind(this);

    

    this.state = {
      currentIndex: -1,

      currentQuiz: {
        id: null,
        titulo: "",
        descripcion: "",
        activo: "",
        tiempodisponible: "",
        random: "",
        fechacreacion: "",
        fechatermino: "",
        currentUser: undefined,
      },
      currentPregunta: {
        id: null,
        titulo: "",
        tipo: "",
        enunciado: "",
        tiemporespuesta: "",
        puntaje: "",
        random: "",
        usuario: ""
      },
      preguntas: [],
      quizpres: [],
      visible: false,
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
    };
  }

  openModal(id) {
    this.setState({
      visible: true
    });
    this.getPregunta(id);
  }

  closeModal() {
    this.setState({
      visible: false
    });
  }

  componentDidMount() {
    this.retrievePreguntas();
    this.retrieveOpcions();
    this.retrieveQuizPres()
    this.getQuiz(this.props.match.params.id);
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
  }

  retrieveOpcions() {
    PreguntaDataService.getAll()
      .then(response => {
        this.setState({
          preguntas: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  retrieveQuizPres() {
    QuizPreDataService.getAll()
      .then(response => {
        this.setState({
          quizpres: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveOpcions();
    this.setState({
    });
  }

  getQuiz(id) {
    QuizDataService.get(id)
      .then(response => {
        this.setState({
          currentQuiz: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  getPregunta(id) {
    PreguntaDataService.get(id)
      .then(response => {
        this.setState({
          currentPregunta: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  saveQuizPre(quiz, pregunta) {
    var data = {
      quizid: quiz,
      preguntaid: pregunta
    };

    QuizPreDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          quizid: response.data.quiz,
          preguntaid: response.data.pregunta
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  //Modal Agregar
  closeModal() {
    this.setState({
      visible: false
    });
  }
  openModalCreate() {
    this.setState({
      visible: true
    });
  }
  //Modal Añadir
  closeModalañadir() {
    this.setState({
      visibleañadir: false
    });
  }
  openModalañadir(id) {
    this.setState({
      preguntaid: id,
      visibleañadir: true
    });
  }
  //---------ADD PREGUNTA----------

  onChangeTitulo(e) {
    this.setState({
      titulo: e.target.value
    });
  }

  onChangeTipo(e) {
    this.setState({
      tipo: e.target.value
    });
  }

  onChangeEnunciado(e) {
    this.setState({
      enunciado: e.target.value
    });
  }

  onChangeTiempoRespuesta(e) {
    this.setState({
      tiempoRespuesta: e.target.value
    });
  }

  onChangePuntaje(e) {
    this.setState({
      puntaje: e.target.value
    });
  }

  onChangeRandom(e) {
    this.setState({
      random: e.target.value
    });
  }

  onChangeUserid(e) {
    this.setState({
      user: e.target.value
    });
  }
  //-------------------------

  onChangeOpcion1(e) {
    this.setState({
      opcion1: e.target.value
    });
  }
  onChangeRespuesta1(e) {
    this.setState({
      respuesta1: e.target.value
    });
  }
  //---------------------------

  retrievePreguntas() {
    PreguntaDataService.getAll()
      .then(response => {
        this.setState({
          preguntas: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  savePregunta() {
    var data = {
      titulo: this.state.titulo,
      tipo: this.state.tipo,
      enunciado: this.state.enunciado,
      tiempoRespuesta: this.state.tiempoRespuesta,
      puntaje: this.state.puntaje,
      random: this.state.random,
      user: this.state.usuario.id,
      opcion1: this.state.opcion1,
      respuesta1: this.state.respuesta1,
    };

    PreguntaDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          titulo: response.data.titulo,
          tipo: response.data.tipo,
          enunciado: response.data.enunciado,
          tiempoRespuesta: response.data.tiempoRespuesta,
          puntaje: response.data.puntaje,
          random: response.data.random,
          user: response.data.usuario.id,
          opcion1: response.data.opcion1,
          respuesta1: response.data.respuesta1,

          submitted: true,
          visible: false
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newPregunta() {
    this.setState({
      id: null,
      titulo: "",
      tipo: "", 
      enunciado: "",
      tiempoRespuesta: "",
      puntaje: "",
      random: "",
      user: "",
      opcion1: "",
      respuesta1: "",

      submitted: false
    });
  }
  setActiveQuizpres(quizpres, index) {
    this.setState({
      currentQuizpres: quizpres,
      currentIndex: index
    });
  }

  render() {
    const { preguntas, quizpres, currentQuiz, currentPregunta, currentUser, showUserBoard, showModeratorBoard, showTeacherBoard, currentIndex} = this.state;

    return (
      <div>
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
              <Jumbotron fluid="md">
                <Container >
                  <h1 class="display-5">Quiz: {currentQuiz.titulo} </h1>
                </Container>
              </Jumbotron>






              <Table striped bordered hover>
                    <tbody>
                      <tr>
                        <td>
              {quizpres && quizpres.map((quizpre) => (
                <div>
                  {quizpre.quizid == currentQuiz.id ? (
                    <div>
                       {preguntas && preguntas.map((pregunta,index) => (
                          <div>
                            {quizpre.preguntaid == pregunta.id ? (
                              <div>
                                  <li className= {"list-group-item " +  (index === currentIndex ? "active" : "")}  >
                                    <Row>
                                      <Col md="8" >
                                        {pregunta.titulo}
                                      </Col>
                                      <Col md="auto">
                                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Borrar</Tooltip>}>
                                          <Button size="sm" variant="danger"> 
                                            <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                            </svg>                    
                                          </Button>
                                        </OverlayTrigger>
                                      </Col>
                                    </Row>
                                  </li>
                              </div>
                            ) : (
                              <div></div>                    
                              )}
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div></div>                    
                    )}
                </div>
              ))}
                        
                        </td>
                      </tr>
                    </tbody>
                  </Table>
          






            {/*
              <div className="col-md-6">
                <h4>Lista de Preguntas</h4>
                <ul className="list-group">
                  {preguntas &&
                    preguntas.map((pregunta) => (
                      <li
                        className="list-group-item" >
                        {pregunta.titulo}
                        
                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Agregar Opciones</Tooltip>}>
                          <Button size="sm" variant="warning" onClick={() => this.openModalañadir(pregunta.id)}  >
                              <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                            </svg>
                          </Button>
                        </OverlayTrigger>
                      </li>
                    ))}
                </ul>
              </div>

            */}











              <div>
                <Button onClick={() => this.openModalCreate()} > Agregar Pregunta </Button>
              </div>


              <Modal show={this.state.visible} size="xl" >
                <Modal.Header closeButton onClick={() => this.closeModal()} >
                  <Modal.Title>Agregar Pregunta</Modal.Title>
                </Modal.Header>
                <Modal.Body>            
                    <Form> 
                      <Form.Row>
                            <Col md="8">
                              <label htmlFor="opcion1">Opcion 1</label>
                              <input
                                type="text"
                                className="form-control"
                                id="opcion1"
                                required
                                value={this.state.opcion1}
                                onChange={this.onChangeOpcion1}
                                name="opcion1"
                              />
                            </Col>
                            <Col md= "4">
                              <label htmlFor="respuesta1">Respuesta 1</label>
                              <input
                                type="text"
                                className="form-control"
                                id="respuesta1"
                                required
                                value={this.state.respuesta1}
                                onChange={this.onChangeRespuesta1}
                                name="respuesta1"
                              />
                            </Col> 

                          </Form.Row>
                      <Form.Row>
                        <Col md="8">
                          <label htmlFor="titulo">Titulo</label>
                          <input
                            type="text"
                            className="form-control"
                            id="titulo"
                            required
                            value={this.state.titulo}
                            onChange={this.onChangeTitulo}
                            name="titulo"
                          />
                        </Col>
      
                        <Form.Group as={Col} md="4 "controlId="formGridState">
                          <Form.Label>Tipo</Form.Label>
                          <Form.Control as="select"
                          className="form-control"
                          id="tipo"
                          required
                          defaultValue="..."
                          onChange={this.onChangeTipo}
                          name="tipo">
                            <option disabled>...</option>                                
                            <option>Verdadero o Falso</option>
                            <option>Alternativas</option>
                            <option>Opcion Multiple</option>
                          </Form.Control>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Col md="3">
                          <label htmlFor="tiempoRespuesta">Tiempo de Respuesta</label>
                          <input
                            type="text"
                            className="form-control"
                            id="tiempoRespuesta"
                            required
                            value={this.state.tiempoRespuesta}
                            onChange={this.onChangeTiempoRespuesta}
                            name="tiempoRespuesta"
                          />
                        </Col>
                        <Col md= "3">
                          <label htmlFor="puntaje">Puntaje</label>
                          <FormControl
                            type="text"
                            className="form-control"
                            id="puntaje"
                            required
                            value={this.state.puntaje}
                            onChange={this.onChangePuntaje}
                            name="puntaje"
                          />
                        </Col>
                        
                        <Col md="1" align="center">
                          
                        <label htmlFor="user">Random</label>
                          <input defaultChecked={false} type="checkbox" class="make-switch" id="price_check" 
                          name="pricing" data-on-color="primary" data-off-color="info" value="true" size="10"
                          onChange={this.onChangeRandom}></input>
                        </Col>
      
      
                        <Col md="5">
                          <label htmlFor="user">Id del Usuario</label>
                            <input
                              type="text"
                              className="form-control"
                              id="user"
                              required
                              value={currentUser.id}
                              onChange={this.onChangeUserid}
                              name="user"
                              disabled
                            />
                        </Col>
                      </Form.Row>
                      
                      <Form.Row>
                        <label htmlFor="enunciado">Enunciado</label>
                        <Form.Control  as="textarea" rows={3} 
                          className="form-control"
                          id="enunciado"
                          required
                          value={this.state.enunciado}
                          onChange={this.onChangeEnunciado}
                          name="enunciado"
                        >
                        </Form.Control>
                      </Form.Row>
                    </Form>
                    
                </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.closeModal()} >
                      Cerrar
                    </Button>
                    
                    <Button variant="primary" onClick={this.savePregunta} href={"/quiz/pregunta/list/" + currentQuiz.id}>
                      Agregar
                    </Button>
                  </Modal.Footer>
              </Modal>

              {/*

              <Modal show={this.state.visibleañadir} width="1000" height="500" effect="fadeInUp" onClickAway={() => this.closeModal()}>
         
                <Modal.Header>
                  <Modal.Title align="center">¿Deséa añadir esta pregunta?</Modal.Title>
                </Modal.Header>

                <Modal.Footer>
                  <button className="btn btn-warning" onClick={() => this.closeModalañadir()}>
                      Close
                  </button>
                  <button className="btn btn-success" onClick={() => (this.saveQuizPre(currentQuiz.id, this.state.preguntaid), window.location.reload())}>
                      Agregar
                  </button>
                </Modal.Footer>
              </Modal>
              
              */}


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