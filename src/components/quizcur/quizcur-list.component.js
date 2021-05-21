import React, { Component } from "react";
import QuizCurDataService from "../../services/quizcur.service";
import QuizDataService from "../../services/quiz.service";
import CursoDataService from "../../services/curso.service";
import RamoDataService from "../../services/ramo.service";
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";
import {
  Accordion, Card, Table, Button, Modal, FormControl, Form, Col, OverlayTrigger, Tooltip, Row
} from 'react-bootstrap';


export default class QuizCurList extends Component {
  constructor(props) {
    super(props);
    this.retrieveQuizCurs = this.retrieveQuizCurs.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.saveQuizCur = this.saveQuizCur.bind(this);
    //CREATE
    this.onChangeTitulo = this.onChangeTitulo.bind(this);
    this.onChangeDescripcion = this.onChangeDescripcion.bind(this);
    this.onChangeActivo = this.onChangeActivo.bind(this);
    this.onChangeTiempodisponible = this.onChangeTiempodisponible.bind(this);
    this.onChangeFechacreacion = this.onChangeFechacreacion.bind(this);
    this.onChangeRandom = this.onChangeRandom.bind(this);
    this.onChangeFechatermino = this.onChangeFechatermino.bind(this);
    this.saveQuiz = this.saveQuiz.bind(this);
    this.newQuiz = this.newQuiz.bind(this);
    //Delete
    this.deleteQuizCur = this.deleteQuizCur.bind(this);
    this.setActiveQuiz = this.setActiveQuiz.bind(this);
    //UPDATE
    this.updateQuiz = this.updateQuiz.bind(this);
    // this.updateQuizAñadidos = this.updateQuizAñadidos.bind(this);

    this.state = {
      currentQuiz: {
        id: null,
        titulo: "",
        descripcion: "",
        activo: "",
        tiempodisponible: "",
        random: "",
        fechacreacion: "",
        fechatermino: ""
      },
      currentCurso: {
        id: null,
        codigo: "",
        semestre: "",
        año: "",
        descripcion: "",
        password: "",
        activo: "",
        ramoid: ""
      },
      currentRamo: {
        id: null,
        codigo: "",
        nombre: "",
        semestre: "",
        descripcion: ""
      },
      //--------------
      id: null,
      titulo: "",
      descripcion: "",
      activo: "",
      tiempodisponible: "",
      random: "",
      fechacreacion: "",
      fechatermino: "",
      //..........
      deleteid: "",
      quizcurs: [],
      quizs: [],
      filtroquizsañadidas: [],
      filtroquizs: [],
      visibledelete: false,
      visible: false,
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
    this.getCurso(this.props.match.params.id);
    await this.retrieveQuizs();
    await this.retrieveQuizCurs();
    await this.retrieveFiltroQuizAñadidas();
    await this.retrieveFiltroQuiz();

  }

  getCurso(id) {
    CursoDataService.get(id)
      .then(response => {
        this.setState({
          currentCurso: response.data
        });
        console.log(response.data);

        RamoDataService.get(response.data.ramoid)
          .then(response => {
            this.setState({
              currentRamo: response.data
            });
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
      })
      .catch(e => {
        console.log(e);
      });
  }

  async retrieveFiltroQuizAñadidas() {
    var listaquizs = this.state.quizs;
    var listaquizcurs = this.state.quizcurs;
    var listafiltroquizsañadidas = this.state.filtroquizsañadidas;

    listaquizcurs && listaquizcurs.map((quizcur) => (
      (quizcur.cursoid == this.props.match.params.id) && (
        listaquizs && listaquizs.map((quiz) => (
          (quizcur.quizid == quiz.id) && (
            listafiltroquizsañadidas.push({
              id: quiz.id,
              titulo: quiz.titulo,
              descripcion: quiz.descripcion,
              activo: quiz.activo,
              tiempodisponible: quiz.tiempodisponible,
              random: quiz.random,
              fechacreacion: quiz.fechacreacion,
              fechatermino: quiz.fechatermino,
              idquizcur: quizcur.id
            })
          )
        ))
      )
    ));

    console.log(this.state.filtroquizsañadidas);
    this.setState({ filtroquizsañadidas: listafiltroquizsañadidas });
  }
  //-----------------------------------------------------
  async retrieveFiltroQuiz() {
    const listaquizs = this.state.quizs;
    const listaquizcurs = this.state.quizcurs;
    const filtroquizcurs = [];

    listaquizcurs && listaquizcurs.map((quizcur) => {
      if (quizcur.cursoid == this.props.match
        .params.id) {
        filtroquizcurs.push({
          idquizcur: quizcur.id,
          idquiz: quizcur.quizid,
          idcur: quizcur.cursoid
        })
      };
    });

    var contador = 0;
    filtroquizcurs && filtroquizcurs.map((quizcur) => {
      listaquizs && listaquizs.map((quiz) => {
        if (quiz.id == quizcur.idquiz) {
          listaquizs.splice(contador, 1);
        };
        contador++;
      });
      contador = 0;
    });

    console.log(listaquizs);
    this.setState({ filtroquizs: listaquizs });
  }
  //--------------------------------------------------------




  async retrieveQuizs() {
    const peticion = await fetch("https://spring-boot-back.herokuapp.com/api/quizs/all");
    const respuesta = await peticion.json();
    this.setState({ quizs: respuesta });
  }

  async retrieveQuizCurs() {
    const peticion = await fetch("https://spring-boot-back.herokuapp.com/api/quizcurs/all");
    const respuesta = await peticion.json();
    this.setState({ quizcurs: respuesta });
  }

  refreshList() {
    this.retrieveQuizCurs();
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

  setActiveQuiz(quiz, index) {
    this.setState({
      currentQuiz: quiz,
      currentIndex: index
    });
  }


  saveQuizCur(currentQuiz, id2) {
    var data = {
      cursoid: id2,
      quizid: currentQuiz.id
    };

    QuizCurDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          quizid: response.data.quizid,
          cursoid: response.data.cursoid,

          submitted: true
        });
        console.log(response.data);

        //Actualizar LISTA-------------------------
        var lista = this.state.filtroquizsañadidas;
        //con un .map 
        lista.push(
          {
            id: response.data.id,
            titulo: currentQuiz.titulo,
            descripcion: currentQuiz.descripcion,
            activo: currentQuiz.activo,
            tiempodisponible: currentQuiz.tiempodisponible,
            random: currentQuiz.random,
            fechacreacion: currentQuiz.fechacreacion,
            fechatermino: currentQuiz.fechatermino
          });
        this.setState({ filtroquizsañadidas: lista });
        //-------------------------------------------
        //Actualizar LISTA  
        var contador = 0;
        var listafiltroquizs = this.state.filtroquizs;
        listafiltroquizs.map((registro) => {
          if (registro.id == currentQuiz.id) {
            listafiltroquizs.splice(contador, 1);
          }
          contador++;
        });
        this.setState({ filtroquizs: listafiltroquizs });
        //------------------------------


      })
      .catch(e => {
        console.log(e);
      });
    this.closeModal();
  }

  saveQuiz() {
    var data = {
      titulo: this.state.titulo,
      descripcion: this.state.descripcion,
      activo: this.state.activo,
      tiempodisponible: this.state.tiempodisponible,
      random: this.state.random,
      fechacreacion: this.state.fechacreacion,
      fechatermino: this.state.fechatermino
    };

    QuizDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          titulo: response.data.titulo,
          descripcion: response.data.descripcion,
          activo: response.data.activo,
          tiempodisponible: response.data.tiempodisponible,
          random: response.data.random,
          fechacreacion: response.data.fechacreacion,
          fechatermino: response.data.fechatermino,

          submitted: true
        });
        console.log(response.data);
        //Actualizar LISTA-------------------------
        var lista = this.state.filtroquizsañadidas;

        lista.push(
          {
            id: response.data.id,
            titulo: this.state.titulo,
            descripcion: this.state.descripcion,
            activo: this.state.activo,
            tiempodisponible: this.state.tiempodisponible,
            random: this.state.random,
            fechacreacion: this.state.fechacreacion,
            fechatermino: this.state.fechatermino
          });

        this.setState({ filtroquizsañadidas: lista });

        //---------------------------------------------

        var data = {
          cursoid: this.props.match.params.id,
          quizid: response.data.id
        };

        QuizCurDataService.create(data)
          .then(response => {
            this.setState({
              id: response.data.id,
              quizid: response.data.tagid,
              cursoid: response.data.id,

              submitted: true
            });
            console.log(response.data);
            //-------------------------------------------
            //Limpiar DATOS
            this.newQuiz();
            //-------------------------------------------
            this.closeModal();
          })
          .catch(e => {
            console.log(e);
          });

      })
      .catch(e => {
        console.log(e);
      });
  }
  //Modal Agregar
  closeModalCreate() {
    this.setState({
      visiblecreate: false
    });
  }
  openModalCreate() {
    this.setState({
      visiblecreate: true
    });
  }

  closeModalDelete() {
    this.setState({
      visibledelete: false,
      deleteid: "",
    });
  }
  openModalDelete(id) {
    this.setState({
      visibledelete: true,
      deleteid: id,
    });
  }

  openModal(id) {
    console.log(id);
    this.setState({
      visible: true
    });
    this.getQuiz(id);
  }

  closeModal() {
    this.setState({
      visible: false
    });
    this.refreshList();
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
  //CREATE----------------------------

  onChangeTitulo(e) {
    this.setState({
      titulo: e.target.value
    });
  }

  onChangeDescripcion(e) {
    this.setState({
      descripcion: e.target.value
    });
  }

  onChangeActivo(e) {
    this.setState({
      activo: e.target.value
    });
  }

  onChangeTiempodisponible(e) {
    this.setState({
      tiempodisponible: e.target.value
    });
  }

  onChangeFechacreacion(e) {
    this.setState({
      fechacreacion: e.target.value
    });
  }

  onChangeRandom(e) {
    this.setState({
      random: e.target.value
    });
  }

  onChangeFechatermino(e) {
    this.setState({
      fechatermino: e.target.value
    });
  }

  newQuiz() {
    this.setState({
      id: null,
      titulo: "",
      descripcion: "",
      activo: "",
      tiempodisponible: "",
      random: "",
      fechacreacion: "",
      fechatermino: "",

      submitted: false
    });
  }
  //--------------
  deleteQuizCur(id) {
    QuizCurDataService.delete(id)
      .then(response => {
        console.log(response.data)
        //this.props.history.push('/preguntaid')
      })
      .catch(e => {
        console.log(e);
      });


    //Actualizar LISTA  
    var contador = 0;
    var lista = this.state.filtroquizsañadidas;
    var listanoañadidas = this.state.filtroquizs;
    lista.map((registro) => {
      if (registro.idquizcur == id) {
        listanoañadidas.push(
          {
            id: id,
            titulo: registro.titulo,
            descripcion: registro.descripcion,
            activo: registro.activo,
            tiempodisponible: registro.tiempodisponible,
            random: registro.random,
            fechacreacion: registro.fechacreacion,
            fechatermino: registro.fechatermino
          });
        lista.splice(contador, 1);
      }
      contador++;
    });
    this.setState({ filtroquizs: listanoañadidas });
    this.setState({ filtroquizsañadidas: lista, visibledelete: false });
  }
  updateQuiz() {
    QuizDataService.update(
      this.state.currentQuiz.id,
      this.state.currentQuiz
    )
      .then(response => {
        //console.log(response.data);
        this.setState({
          message: "The quiz was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });

    //Editar LISTA ---------------------------
    var contador = 0;
    var lista = this.state.filtroquizs;
    lista.map((registro) => {
      if (this.state.currentQuiz.id == registro.id) {

        lista[contador].titulo = this.state.currentQuiz.titulo;
        lista[contador].descripcion = this.state.currentQuiz.descripcion;
        lista[contador].activo = this.state.currentQuiz.activo;
        lista[contador].tiempodisponible = this.state.currentQuiz.tiempodisponible;
        lista[contador].random = this.state.currentQuiz.random;
        lista[contador].fechacreacion = this.state.currentQuiz.fechacreacion;
        lista[contador].fechatermino = this.state.currentQuiz.fechatermino;


      }
      contador++;
    });
    this.setState({ filtroquizs: lista });
    //-------------------------
    this.closeModalEdit();
  }
  // updateQuizAñadidos() {
  //   QuizDataService.update(
  //     this.state.currentQuiz.id,
  //     this.state.currentQuiz
  //   )
  //     .then(response => {
  //       console.log(response.data);
  //       this.setState({
  //         message: "The quiz was updated successfully!"
  //       });
  //     })
  //     .catch(e => {
  //       console.log(e);
  //     });

  //     //Editar LISTA ---------------------------
  //     var contador=0;
  //     var lista=this.state.filtroquizsañadidas;
  //     lista.map((registro)=>{
  //       if(this.state.currentQuiz.id==registro.id){

  //         lista[contador].titulo = this.state.currentQuiz.titulo;
  //         lista[contador].descripcion = this.state.currentQuiz.descripcion;
  //         lista[contador].activo = this.state.currentQuiz.activo;
  //         lista[contador].tiempodisponible = this.state.currentQuiz.tiempodisponible;
  //         lista[contador].random = this.state.currentQuiz.random;
  //         lista[contador].fechacreacion = this.state.currentQuiz.fechacreacion;
  //         lista[contador].fechatermino = this.state.currentQuiz.fechatermino;


  //       }
  //       contador++;
  //     });
  //     console.log(this.state.filtroquizsañadidas);

  //     console.log(this.state.currentQuiz.id);

  //     this.setState({filtroquizsañadidas: lista});
  //     //-------------------------
  //     this.closeModalEdit();
  //   }

  render() {
    const { tags, filtroquizs, filtroquizsañadidas, currentQuiz, currentUser, showModeratorBoard, showTeacherBoard, currentCurso, currentRamo, deleteid } = this.state;

    return (
      <div >
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
          {currentUser && (
            <div>
              <div class="img-center">
                <h2 class="center">Curso {currentCurso.codigo}</h2>
                <p>
                  Revisa el contenido en tu curso, resuelve los Quiz disponibles.
                </p>
              </div>

              <div className="list row">

                <div className="col-md-8">
                  <br></br>
                  <h4>Informacion del curso:</h4>
                  <ul className="list-group">
                    <li className="list-group-item">
                      Codigo del curso: {currentCurso.codigo}
                    </li>
                    <li className="list-group-item">
                      El curso se imparte en: {currentCurso.semestre} en el año {currentCurso.año}
                    </li>
                    <li className="list-group-item">
                      Descripcion del curso: {currentCurso.descripcion}
                    </li>
                    <li className="list-group-item">
                      Este curso pertenece al ramo: {currentRamo.nombre}
                    </li>
                    <li className="list-group-item">
                      El ramo consiste en: {currentRamo.descripcion}
                    </li>
                  </ul>
                </div>

                <div className="col-md-4">
                  <Table striped bordered hover>
                    <h3 class="img-center">Preguntas Frecuentes</h3>
                    <Accordion defaultActiveKey="0">
                      <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                          ¿De qué me sirve esta interfaz?
                     </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>Usa esta interfaz para revisar la descripción de tu curso, también podrás ver los Quiz disponibles en tu curso.</Card.Body>
                      </Accordion.Collapse>
                      <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                          ¿Que pasa si entro al Quiz?
                     </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="1">
                        <Card.Body>Si entras al Quiz, la pagina te redireccionará a la vista para responder el Quiz, CUIDADO, si no estás listo para responder el Quiz, no respondas nada.</Card.Body>
                      </Accordion.Collapse>
                    </Accordion>
                  </Table>
                </div>
              </div>

              <br></br>
              <hr></hr>
              <br></br>

              <div className="list row">

                <div className="col-md-8">
                  <h4>Quiz disponibles</h4>

                  <ul className="list-group">
                    {filtroquizsañadidas &&
                      filtroquizsañadidas.map((quizañadido, index) => (
                        <div>
                          <li className="list-group-item">
                            <Row>
                              <Col md="8" >
                                {quizañadido.titulo}
                              </Col>
                              <Col md="auto">
                                {' '}
                                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Resolver</Tooltip>}>
                                  <Button size="sm" variant="primary" href={"/respuesta/pregunta/list/" + quizañadido.id} key={index}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
                                      <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                                      <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
                                    </svg>
                                  </Button>
                                </OverlayTrigger>
                                {showTeacherBoard || showModeratorBoard && (
                                  <>
                                    {' '}
                                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Agregar Preguntas</Tooltip>}>
                                      <Button size="sm" variant="success" href={"/quiz/pregunta/list/" + quizañadido.id}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor" class="bi bi-clipboard-plus" viewBox="0 0 16 16">
                                          <path fill-rule="evenodd" d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7z" />
                                          <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                                          <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
                                        </svg>
                                      </Button>
                                    </OverlayTrigger>
                                    {' '}
                                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Editar</Tooltip>}>
                                      <Button size="sm" variant="info" onClick={() => (this.setActiveQuiz(quizañadido, index), this.openModalEdit())} key={index}>
                                        <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-pencil" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                          <path fill-rule="evenodd" d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                        </svg>
                                      </Button>
                                    </OverlayTrigger>
                                    {' '}
                                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Quitar Quiz</Tooltip>}>
                                      <Button size="sm" variant="danger" onClick={() => this.openModalDelete(quizañadido.idquizcur)}>
                                        <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                          <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                        </svg>
                                      </Button>
                                    </OverlayTrigger>
                                  </>
                                )}
                              </Col>
                            </Row>
                          </li>
                        </div>
                      ))}
                  </ul>
                </div>

                {(showTeacherBoard || showModeratorBoard) && (

                  <div className="col-md-4">
                    <h4>Quiz para Añadir</h4>

                    <ul className="list-group">
                      {filtroquizs &&
                        filtroquizs.map((quizcur, index) => (
                          <li className="list-group-item" >
                            <Row>
                              <Col md="8" >
                                {quizcur.titulo}
                              </Col>
                              <Col md="auto">
                                {' '}
                                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Agregar Quiz</Tooltip>}>
                                  <Button size="sm" variant="warning" onClick={() => this.openModal(quizcur.id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                    </svg>
                                  </Button>
                                </OverlayTrigger>
                                {/* {' '}
                              <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Editar</Tooltip>}>
                                <Button size="sm" variant="info" onClick={() => (this.setActiveQuiz(quizcur, index),this.openModalEdit())} key={index}>
                                <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-pencil" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                </svg>
                                </Button>
                              </OverlayTrigger> */}
                              </Col>
                            </Row>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>

              <Modal show={this.state.visible} width="1000" height="500" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                <Modal.Header>
                  <Modal.Title align="center">¿Deséa añadir este Quiz?</Modal.Title>
                </Modal.Header>

                <Modal.Footer>
                  <button className="btn btn-warning" onClick={() => this.closeModal()}>
                    Close
                    </button>
                  <button className="btn btn-success" onClick={() => this.saveQuizCur(currentQuiz, this.props.match.params.id)}>
                    Agregar
                    </button>
                </Modal.Footer>
              </Modal>

              <Modal show={this.state.visibledelete} width="1000" height="500" effect="fadeInUp" onClickAway={() => this.closeModalDelete()}>
                <Modal.Header>
                  <Modal.Title align="center">¿Deséa eliminar este Quiz?</Modal.Title>
                </Modal.Header>

                <Modal.Footer>
                  <button className="btn btn-warning" onClick={() => this.closeModalDelete()}>
                    Close
                    </button>
                  <button className="btn btn-success" onClick={() => this.deleteQuizCur(deleteid)}>
                    Eliminar
                    </button>
                </Modal.Footer>
              </Modal>

              <Modal show={this.state.visiblecreate} size="xl" >
                <Modal.Header closeButton onClick={() => this.closeModalCreate()} >
                  <Modal.Title>Agregar Quiz</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Row>
                      <Col md="12">
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
                    </Form.Row>
                    <Form.Row>
                      <Col md="2">
                        <label htmlFor="tiempodisponible">Tiempo de Respuesta</label>
                        <input
                          type="text"
                          className="form-control"
                          id="tiempodisponible"
                          required
                          value={this.state.tiempodisponible}
                          onChange={this.onChangeTiempodisponible}
                          name="tiempodisponible"
                        />
                      </Col>
                      <Col md="2">
                        <label htmlFor="fechacreacion">fechacreacion</label>
                        <FormControl
                          type="date"
                          className="form-control"
                          id="fechacreacion"
                          required
                          value={this.state.fechacreacion}
                          onChange={this.onChangeFechacreacion}
                          name="fechacreacion"
                        />
                      </Col>
                      <Col md="2">
                        <label htmlFor="fechatermino">fechatermino</label>
                        <FormControl
                          type="date"
                          className="form-control"
                          id="fechatermino"
                          required
                          value={this.state.fechatermino}
                          onChange={this.onChangeFechatermino}
                          name="fechatermino"
                        />
                      </Col>

                      <Col md="1" align="center">
                        <label htmlFor="user">Activo</label>
                        <input defaultChecked={false} type="checkbox" class="make-switch" id="price_check"
                          name="pricing" data-on-color="primary" data-off-color="info" value="true" size="10"
                          onChange={this.onChangeActivo}></input>
                      </Col>

                      <Col md="1" align="center">
                        <label htmlFor="user">Random</label>
                        <input defaultChecked={false} type="checkbox" class="make-switch" id="price_check"
                          name="pricing" data-on-color="primary" data-off-color="info" value="true" size="10"
                          onChange={this.onChangeRandom}></input>
                      </Col>
                      <Col md="4">
                        <Form.Label>Tag</Form.Label>
                        <Form.Control as="select"
                          className="form-control"
                          id="tipo"
                          required
                          onChange={this.onChangeTagid}
                          name="tipo">
                          <option disabled>...</option>
                          {tags &&
                            tags.map((tag) => (
                              <option value={tag.id}>{tag.nombre}</option>
                            ))}
                        </Form.Control>

                      </Col>
                    </Form.Row>

                    <Form.Row>
                      <label htmlFor="descripcion">Descripcion</label>
                      <Form.Control as="textarea" rows={3}
                        className="form-control"
                        id="descripcion"
                        required
                        value={this.state.descripcion}
                        onChange={this.onChangeDescripcion}
                        name="descripcion"
                      >
                      </Form.Control>
                    </Form.Row>
                  </Form>

                </Modal.Body>

                <Modal.Footer>
                  <Button variant="secondary" onClick={() => this.closeModalCreate()} >
                    Cerrar
                      </Button>

                  <Button variant="primary" onClick={this.saveQuiz} >
                    Agregar
                      </Button>
                </Modal.Footer>
              </Modal>

              <Modal show={this.state.visibleedit} size="xl" >
                <Modal.Header closeButton onClick={() => this.closeModalEdit()} >
                  <Modal.Title>Editar Quiz</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Row>
                      <Col md="12">
                        <label htmlFor="titulo">Titulo</label>
                        <input
                          type="text"
                          className="form-control"
                          id="titulo"
                          required
                          defaultValue={currentQuiz.titulo}
                          onChange={this.onChangeTitulo2}
                          name="titulo"
                        />
                      </Col>

                    </Form.Row>
                    <Form.Row>
                      <Col md="3">
                        <label htmlFor="tiempodisponible">Tiempo de Respuesta</label>
                        <input
                          type="text"
                          className="form-control"
                          id="tiempodisponible"
                          required
                          defaultValue={currentQuiz.tiempodisponible}
                          onChange={this.onChangeTiempodisponible2}
                          name="tiempodisponible"
                        />
                      </Col>
                      <Col md="3">
                        <label htmlFor="fechacreacion">fechacreacion</label>
                        <FormControl
                          type="date"
                          className="form-control"
                          id="fechacreacion"
                          required
                          defaultValue={currentQuiz.fechacreacion}
                          onChange={this.onChangeFechacreacion2}
                          name="fechacreacion"
                        />
                      </Col>
                      <Col md="3">
                        <label htmlFor="fechatermino">fechatermino</label>
                        <FormControl
                          type="date"
                          className="form-control"
                          id="fechatermino"
                          required
                          defaultValue={currentQuiz.fechatermino}
                          onChange={this.onChangeFechatermino2}
                          name="fechatermino"
                        />
                      </Col>

                      <Col md="1" align="center">
                        <label htmlFor="user">Activo</label>
                        <input defaultChecked={currentQuiz.activo} type="checkbox" class="make-switch" id="price_check"
                          name="pricing" data-on-color="primary" data-off-color="info" value="true" size="10"
                          onChange={this.onChangeActivo2}></input>
                      </Col>

                      <Col md="1" align="center">
                        <label htmlFor="user">Random</label>
                        <input defaultChecked={currentQuiz.random} type="checkbox" class="make-switch" id="price_check"
                          name="pricing" data-on-color="primary" data-off-color="info" value="true" size="10"
                          onChange={this.onChangeRandom2}></input>
                      </Col>

                    </Form.Row>

                    <Form.Row>
                      <label htmlFor="descripcion">Descripcion</label>
                      <Form.Control as="textarea" rows={3}
                        className="form-control"
                        id="descripcion"
                        required
                        defaultValue={currentQuiz.descripcion}
                        onChange={this.onChangeDescripcion2}
                        name="descripcion"
                      >
                      </Form.Control>
                    </Form.Row>
                  </Form>

                </Modal.Body>

                <Modal.Footer>
                  <Button variant="secondary" onClick={() => this.closeModalEdit()} >
                    Cerrar
                      </Button>

                  <Button variant="primary" onClick={this.updateQuiz}>
                    Editar
                      </Button>
                </Modal.Footer>

              </Modal>
              <div>
                <Button onClick={() => this.openModalCreate()} > Agregar Quiz </Button>
              </div>
              <br></br>
            </div>
          )}
        </header>
      </div>
    );
  }
}