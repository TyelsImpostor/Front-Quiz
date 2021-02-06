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

    this.retrievePreguntas = this.retrievePreguntas.bind(this);
    this.setActivePregunta = this.setActivePregunta.bind(this);
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
    this.onChangeOpcion2 = this.onChangeOpcion2.bind(this);
    this.onChangeRespuesta2 = this.onChangeRespuesta2.bind(this);
    this.onChangeOpcion3 = this.onChangeOpcion3.bind(this);
    this.onChangeRespuesta3 = this.onChangeRespuesta3.bind(this);
    this.onChangeOpcion4 = this.onChangeOpcion4.bind(this);
    this.onChangeRespuesta4 = this.onChangeRespuesta4.bind(this);
    this.onChangeOpcion5 = this.onChangeOpcion5.bind(this);
    this.onChangeRespuesta5 = this.onChangeRespuesta5.bind(this);
    //UPDATE
    this.updatePregunta = this.updatePregunta.bind(this);
    this.onChangeTitulo2 = this.onChangeTitulo2.bind(this);
    this.onChangeTipo2 = this.onChangeTipo2.bind(this);
    this.onChangeEnunciado2 = this.onChangeEnunciado2.bind(this);
    this.onChangeTiempoRespuesta2 = this.onChangeTiempoRespuesta2.bind(this);
    this.onChangePuntaje2 = this.onChangePuntaje2.bind(this);
    this.onChangeRandom2 = this.onChangeRandom2.bind(this);
    this.onChangeUserid2 = this.onChangeUserid2.bind(this);
    //OPCIONES UPDATE
    this.onChangeOpcion12 = this.onChangeOpcion12.bind(this);
    this.onChangeRespuesta12 = this.onChangeRespuesta12.bind(this);
    this.onChangeOpcion22 = this.onChangeOpcion22.bind(this);
    this.onChangeRespuesta22 = this.onChangeRespuesta22.bind(this);
    this.onChangeOpcion32 = this.onChangeOpcion32.bind(this);
    this.onChangeRespuesta32 = this.onChangeRespuesta32.bind(this);
    this.onChangeOpcion42 = this.onChangeOpcion42.bind(this);
    this.onChangeRespuesta42 = this.onChangeRespuesta42.bind(this);
    this.onChangeOpcion52 = this.onChangeOpcion52.bind(this);
    this.onChangeRespuesta52 = this.onChangeRespuesta52.bind(this);

    this.setActiveQuizpres = this.setActiveQuizpres.bind(this);
    //DELETE QUIZPRE
    this.deleteQuizPre = this.deleteQuizPre.bind(this);


    this.state = {
      //PREGUNTA
      preguntas: [],
      currentPregunta: null,
      currentUser2: AuthService.getCurrentUser(),
      //ADD PREGUNTA
      id: null,
      titulo: "",
      tipo: "", 
      enunciado: "",
      tiempoRespuesta: "",
      puntaje: "",
      random: "",
      user: "",
      usuario: "",
      opcion1: "",
      respuesta1: "",
      opcion2: "",
      respuesta2: "",
      opcion3: "",
      respuesta3: "",
      opcion4: "",
      respuesta4: "",
      opcion5: "",
      respuesta5: "",

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
    this.retrieveQuizPres();
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
  setActivePregunta(pregunta, index) {
    this.setState({
      currentPregunta: pregunta,
      currentIndex: index
    });
  }
  //------------------------------------------
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
  //Modal Edit
  openModalEdit() {
    this.setState({
      visibleedit: true
    });
  }
  closeModalEdit() {
    this.setState({
      visibleedit: false
    });
  }
  //Modal Recurso
  openModalRecurso() {
    this.setState({
      visiblerecurso: true
    });
  }
  closeModalRecurso() {
    this.setState({
      visiblerecurso: false
    });
  }
  //Modal Edit
  openModalOpciones() {
    this.setState({
      visibleopciones: true
    });
  }
  closeModalOpciones() {
    this.setState({
      visibleopciones: false
    });
  }
  //Modal Edit Opciones
  openModalOpciones() {
    this.setState({
      visibleopciones: true
    });
  }
  closeModalOpciones() {
    this.setState({
      visibleopciones: false
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

  onChangeOpcion2(e) {
    this.setState({
      opcion2: e.target.value
    });
  }
  onChangeRespuesta2(e) {
    this.setState({
      respuesta2: e.target.value
    });
  }
  onChangeOpcion3(e) {
    this.setState({
      opcion3: e.target.value
    });
  }
  onChangeRespuesta3(e) {
    this.setState({
      respuesta3: e.target.value
    });
  }
  onChangeOpcion4(e) {
    this.setState({
      opcion4: e.target.value
    });
  }
  onChangeRespuesta4(e) {
    this.setState({
      respuesta4: e.target.value
    });
  }
  onChangeOpcion5(e) {
    this.setState({
      opcion5: e.target.value
    });
  }
  onChangeRespuesta5(e) {
    this.setState({
      respuesta5: e.target.value
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
      opcion2: this.state.opcion2,
      respuesta2: this.state.respuesta2,
      opcion3: this.state.opcion3,
      respuesta3: this.state.respuesta3,
      opcion4: this.state.opcion4,
      respuesta4: this.state.respuesta4,
      opcion5: this.state.opcion5,
      respuesta5: this.state.respuesta5,
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
          opcion2: response.data.opcion2,
          respuesta2: response.data.respuesta2,
          opcion3: response.data.opcion3,
          respuesta3: response.data.respuesta3,
          opcion4: response.data.opcion4,
          respuesta4: response.data.respuesta4,
          opcion5: response.data.opcion5,
          respuesta5: response.data.respuesta5,

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
      opcion2: "",
      respuesta2: "",
      opcion3: "",
      respuesta3: "",
      opcion4: "",
      respuesta4: "",
      opcion5: "",
      respuesta5: "",
      

      submitted: false
    });
  }
  setActiveQuizpres(quizpres, index) {
    this.setState({
      currentQuizpres: quizpres,
      currentIndex: index
    });
  }
 
  //------EDITE------------

  updatePregunta() {
    PreguntaDataService.update(
      this.state.currentPregunta.id,
      this.state.currentPregunta
    )
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "The pregunta was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }


  onChangeTitulo2(e) {
    const titulo = e.target.value;

    this.setState(function (prevState) {
      return {
        currentPregunta: {
          ...prevState.currentPregunta,
          titulo: titulo
        }
      };
    });
  }

  onChangeTipo2(e) {
    const tipo = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        tipo: tipo
      }
    }));
  }

  onChangeEnunciado2(e) {
    const enunciado = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        enunciado: enunciado
      }
    }));
  }

  onChangeTiempoRespuesta2(e) {
    const tiempoRespuesta = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        tiempoRespuesta: tiempoRespuesta
      }
    }));
  }

  onChangePuntaje2(e) {
    const puntaje = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        puntaje: puntaje
      }
    }));
  }

  onChangeRandom2(e) {
    const random = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        random: random
      }
    }));
  }

  onChangeUserid2(e) {
    const users = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        users: users
      }
    }));
  }

  //--------------1
  onChangeOpcion12(e) {
    const opcion1 = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        opcion1: opcion1
      }
    }));
  }
  
  onChangeRespuesta12(e) {
    const respuesta1 = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        respuesta1: respuesta1
      }
    }));
  }
 //-------------------2
  onChangeOpcion22(e) {
    const opcion2 = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        opcion2: opcion2
      }
    }));
  }
  
  onChangeRespuesta22(e) {
    const respuesta2 = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        respuesta2: respuesta2
      }
    }));
  }
   //-------------------3
   onChangeOpcion32(e) {
    const opcion3 = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        opcion3: opcion3
      }
    }));
  }
  
  onChangeRespuesta32(e) {
    const respuesta3 = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        respuesta3: respuesta3
      }
    }));
  }
  //-------------------4
  onChangeOpcion42(e) {
    const opcion4 = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        opcion4: opcion4
      }
    }));
  }
  
  onChangeRespuesta42(e) {
    const respuesta4 = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        respuesta4: respuesta4
      }
    }));
  }
    //-------------------5
    onChangeOpcion52(e) {
      const opcion5 = e.target.value;
  
      this.setState(prevState => ({
        currentPregunta: {
          ...prevState.currentPregunta,
          opcion5: opcion5
        }
      }));
    }
    
    onChangeRespuesta52(e) {
      const respuesta5 = e.target.value;
  
      this.setState(prevState => ({
        currentPregunta: {
          ...prevState.currentPregunta,
          respuesta5: respuesta5
        }
      }));
    }
  //--------------
  deleteQuizPre(id) {
    QuizPreDataService.delete(id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/preguntaid')
      })
      .catch(e => {
        console.log(e);
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
                                        {' '}
                                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Editar</Tooltip>}>
                                          <Button size="sm" variant="info" onClick={() => (this.setActivePregunta(pregunta, index),this.openModalEdit())} key={index}>
                                          <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-pencil" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                          </svg>
                                          </Button>
                                        </OverlayTrigger>
                                        {' '}
                                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Agregar Recursos</Tooltip>}>
                                          <Button size="sm" variant="success" href={"/prerecur/add/"+pregunta.id}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor" class="bi bi-images" viewBox="0 0 16 16">
                                              <path fill-rule="evenodd" d="M12.002 4h-10a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1zm-10-1a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-10zm4 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                              <path fill-rule="evenodd" d="M4 2h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1v1a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2h1a1 1 0 0 1 1-1z"/>
                                            </svg>
                                          </Button>
                                        </OverlayTrigger>
                                        {' '}
                                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Quitar Pregunta</Tooltip>}>
                                          <Button size="sm" variant="danger" onClick={() => (this.deleteQuizPre(quizpre.id),window.location.reload())}> 
                                            <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                            </svg>                    
                                          </Button>
                                        </OverlayTrigger>
                                        {' '}
                                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Agregar Opciones</Tooltip>}>
                                          <Button size="sm" variant="warning" onClick={() => (this.setActivePregunta(pregunta, index),this.openModalOpciones())} key={index}>
                                              <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                                              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
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
                        <Col md="2">
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
                        <Col md= "2">
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
                        
                        <Col md="2" align="center">
                          
                        <label htmlFor="user">Random</label>
                          <input defaultChecked={false} type="checkbox" class="make-switch" id="price_check" 
                          name="pricing" data-on-color="primary" data-off-color="info" value="true" size="10"
                          onChange={this.onChangeRandom}></input>
                        </Col>
      
      
                        <Col md="3">
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
                        <Col md= "3">
                            <label htmlFor="quizid">Quiz ID</label>
                            <input
                              type="text"
                              className="form-control"
                              id="quizid"
                              required
                              defaultValue={currentQuiz.id}
                              onChange={this.onChangeRespuesta52}
                              name="quizid"
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
              


              <Modal show={this.state.visibleedit} size="xl" >
                    <Modal.Header closeButton onClick={() => this.closeModalEdit()} >
                      <Modal.Title>Editar Pregunta</Modal.Title>
                    </Modal.Header>
                      {currentPregunta ? (
                        <Modal.Body>            
                            <Form>
                              <Form.Row>
                                <Col md="8">
                                  <label htmlFor="titulo">Titulo</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="titulo"
                                    required
                                    defaultValue={currentPregunta.titulo}
                                    onChange={this.onChangeTitulo2}
                                    name="titulo"
                                  />
                                </Col>
          
                                <Form.Group as={Col} md="4 "controlId="formGridState">
                                  <Form.Label>Tipo</Form.Label>
                                  <Form.Control as="select" defaultValue={currentPregunta.tipo}
                                  className="form-control"
                                  id="tipo"
                                  required
                                  onChange={this.onChangeTipo2}
                                  name="tipo"
                                  >
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
                                    defaultValue={currentPregunta.tiempoRespuesta}
                                    onChange={this.onChangeTiempoRespuesta2}
                                    name="tiempoRespuesta"
                                  />
                                </Col>
                                <Col md= "3">
                                  <label htmlFor="puntaje">Puntaje</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="puntaje"
                                    required
                                    defaultValue={currentPregunta.puntaje}
                                    onChange={this.onChangePuntaje2}
                                    name="puntaje"
                                  />
                                </Col>
                                
                                <Col md="1" align="center">
                              
                                  <label htmlFor="user">Random</label>
                                    <input defaultChecked={currentPregunta.random} type="checkbox" class="make-switch" id="price_check" 
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
                                      defaultValue={currentPregunta.user}
                                      onChange={this.onChangeUserid2}
                                      name="user"
                                      disabled/>
                                </Col>
                              </Form.Row>
                              
                              <Form.Row>
                                <label htmlFor="enunciado">Enunciado</label>
                                <Form.Control  as="textarea" rows={3} 
                                  className="form-control"
                                  id="enunciado"
                                  required
                                  defaultValue={currentPregunta.enunciado}
                                  onChange={this.onChangeEnunciado2}
                                  name="enunciado"
                                >
                                </Form.Control>
                              </Form.Row>
          
          
                            </Form>
                        </Modal.Body>
                        
                      ) : (
                        <div>
                          <br />
                        </div>
                      )}
                      <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.closeModalEdit()} >
                          Cerrar
                        </Button>
                        
                        <Button variant="primary" onClick={this.updatePregunta} href={"/quiz/pregunta/list/" + currentQuiz.id}>
                          Editar
                        </Button>
                      </Modal.Footer>
                      
                  </Modal>


                  <Modal show={this.state.visibleopciones} size="xl" >
                    <Modal.Header closeButton onClick={() => this.closeModalOpciones()} >
                      <Modal.Title>Añadir Opciones</Modal.Title>
                    </Modal.Header>
                      {currentPregunta ? (
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
                                    defaultValue={currentPregunta.opcion1}
                                    onChange={this.onChangeOpcion12}
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
                                    defaultValue={currentPregunta.respuesta1}
                                    onChange={this.onChangeRespuesta12}
                                    name="respuesta1"
                                  />
                                </Col> 
                              </Form.Row>

                              <Form.Row>
                                <Col md="8">
                                  <label htmlFor="opcion2">Opcion 2</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="opcion2"
                                    required
                                    defaultValue={currentPregunta.opcion2}
                                    onChange={this.onChangeOpcion22}
                                    name="opcion2"
                                  />
                                </Col>
                                <Col md= "4">
                                  <label htmlFor="respuesta2">Respuesta 2</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="respuesta2"
                                    required
                                    defaultValue={currentPregunta.respuesta2}
                                    onChange={this.onChangeRespuesta22}
                                    name="respuesta2"
                                  />
                                </Col> 
                              </Form.Row>

                              <Form.Row>
                                <Col md="8">
                                  <label htmlFor="opcion3">Opcion 3</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="opcion3"
                                    required
                                    defaultValue={currentPregunta.opcion3}
                                    onChange={this.onChangeOpcion32}
                                    name="opcion3"
                                  />
                                </Col>
                                <Col md= "4">
                                  <label htmlFor="respuesta3">Respuesta 3</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="respuesta3"
                                    required
                                    defaultValue={currentPregunta.respuesta3}
                                    onChange={this.onChangeRespuesta32}
                                    name="respuesta3"
                                  />
                                </Col> 
                              </Form.Row>

                              <Form.Row>
                                <Col md="8">
                                  <label htmlFor="opcion4">Opcion 4</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="opcion4"
                                    required
                                    defaultValue={currentPregunta.opcion4}
                                    onChange={this.onChangeOpcion42}
                                    name="opcion4"
                                  />
                                </Col>
                                <Col md= "4">
                                  <label htmlFor="respuesta4">Respuesta 4</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="respuesta4"
                                    required
                                    defaultValue={currentPregunta.respuesta4}
                                    onChange={this.onChangeRespuesta42}
                                    name="respuesta4"
                                  />
                                </Col> 
                              </Form.Row>

                              <Form.Row>
                                <Col md="8">
                                  <label htmlFor="opcion5">Opcion 5</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="opcion5"
                                    required
                                    defaultValue={currentPregunta.opcion5}
                                    onChange={this.onChangeOpcion52}
                                    name="opcion5"
                                  />
                                </Col>
                                <Col md= "4">
                                  <label htmlFor="respuesta5">Respuesta 5</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="respuesta5"
                                    required
                                    defaultValue={currentPregunta.respuesta5}
                                    onChange={this.onChangeRespuesta52}
                                    name="respuesta5"
                                  />
                                </Col> 
                              </Form.Row>

                              <Form.Row hidden>
                                <Col md="8">
                                  <label htmlFor="titulo">Titulo</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="titulo"
                                    required
                                    defaultValue={currentPregunta.titulo}
                                    onChange={this.onChangeTitulo2}
                                    name="titulo"
                                    disabled
                                  />
                                </Col>
          
                                <Form.Group as={Col} md="4 "controlId="formGridState">
                                  <Form.Label>Tipo</Form.Label>
                                  <Form.Control as="select" defaultValue={currentPregunta.tipo}
                                  className="form-control"
                                  id="tipo"
                                  required
                                  onChange={this.onChangeTipo2}
                                  name="tipo"
                                  disabled
                                  >
                                    <option disabled>...</option>
                                    <option>Verdadero o Falso</option>
                                    <option>Alternativas</option>
                                    <option>Opcion Multiple</option>
                                  </Form.Control>
                                </Form.Group>
                              </Form.Row>
                              <Form.Row hidden>
                                <Col md="3">
                                  <label htmlFor="tiempoRespuesta">Tiempo de Respuesta</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="tiempoRespuesta"
                                    required
                                    defaultValue={currentPregunta.tiempoRespuesta}
                                    onChange={this.onChangeTiempoRespuesta2}
                                    name="tiempoRespuesta"
                                    disabled
                                  />
                                </Col>
                                <Col md= "3">
                                  <label htmlFor="puntaje">Puntaje</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="puntaje"
                                    required
                                    defaultValue={currentPregunta.puntaje}
                                    onChange={this.onChangePuntaje2}
                                    name="puntaje"
                                    disabled
                                  />
                                </Col>
                                
                                <Col md="1" align="center">
                              
                                  <label htmlFor="user">Random</label>
                                    <input defaultChecked={currentPregunta.random} type="checkbox" class="make-switch" id="price_check" 
                                    name="pricing" data-on-color="primary" data-off-color="info" value="true" size="10"
                                    onChange={this.onChangeRandom}
                                    disabled
                                    ></input>
                                </Col>

                                <Col md="5">
                                  <label htmlFor="user">Id del Usuario</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="user"
                                      required
                                      defaultValue={currentPregunta.user}
                                      onChange={this.onChangeUserid2}
                                      name="user"
                                      disabled/>
                                </Col>
                              </Form.Row>
                              
                              <Form.Row hidden>
                                <label htmlFor="enunciado">Enunciado</label>
                                <Form.Control  as="textarea" rows={3} 
                                  className="form-control"
                                  id="enunciado"
                                  required
                                  defaultValue={currentPregunta.enunciado}
                                  onChange={this.onChangeEnunciado2}
                                  name="enunciado"
                                  disabled
                                >
                                </Form.Control>
                              </Form.Row>
          
 
          
                            </Form>
                        </Modal.Body>
                        
                      ) : (
                        <div>
                          <br />
                        </div>
                      )}
                      <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.closeModalEdit()} >
                          Cerrar
                        </Button>
                        
                        <Button variant="primary" onClick={this.updatePregunta} href={"/quiz/pregunta/list/" + currentQuiz.id}>
                          Editar
                        </Button>
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