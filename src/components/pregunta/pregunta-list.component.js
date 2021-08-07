import React, { Component } from "react";
import PreguntaDataService from "../../services/pregunta.service";
import QuizDataService from "../../services/quiz.service";
import QuizPreDataService from "../../services/quizpre.service";
import QuizCurDataService from "../../services/quizcur.service";
import TagPreDataService from "../../services/tagpre.service";
import TagQuizDataService from "../../services/tagquiz.service";
import TagDataService from "../../services/tag.service";
import { Link } from "react-router-dom";

import {
  Accordion, Card, Table, Button, Col, Row, Tab, Nav, Tabs, Modal, Form, Tooltip, OverlayTrigger, Pagination, Spinner
} from 'react-bootstrap';

import AuthService from "../../services/auth.service";

export default class PreguntasList extends Component {

  constructor(props) {
    super(props);
    this.retrievePreguntas = this.retrievePreguntas.bind(this);
    this.retrieveQuiz = this.retrieveQuiz.bind(this);
    this.retrieveQuizCur = this.retrieveQuizCur.bind(this);
    this.retrieveQuizPre = this.retrieveQuizPre.bind(this);
    this.searchNombreQuiz = this.searchNombreQuiz.bind(this);
    this.searchNombrePregunta = this.searchNombrePregunta.bind(this);

    this.state = {
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
      usuario: undefined,
      preguntas: [],
      pretags: [],
      pretag: [],
      quiztags: [],
      quizs: [],
      contPre: 0,
      contQuiz: 0,
      visibleeliminar: false,
      visibleeliminar2: false,
      deleteid: "",
      visibletagpre: false,
      tagpres: [],
      pretag: [],
      visibleTag: false,
      visibledeleteTag: false,
      visibleTag2: false,
      visibledeleteTag2: false,
      tagid: "",
      preguntaid: "",
      quizid: "",
      searchNombre: "",

      //--------PAGINACION------------
      postsPerPage: 5,
      //--------------
      paginacionPre: [],
      listapaginacionPre: [],
      paginatePre: 1,
      paginacionQuiz: [],
      listapaginacionQuiz: [],
      paginateQuiz: 1,
      paginacionTag: [],
      listapaginacionTag: [],
      paginateTag: 1,
      spinnerLoading: false
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
        //console.log(e);
      });

    await TagPreDataService.getAll()
      .then(response => {
        this.setState({
          pretags: response.data
        });
      })
      .catch(e => {
        //console.log(e);
      });

    const respuesta = await this.retrieveFiltroPorPagina(this.state.preguntas);
    await this.setState({
      listapaginacionPre: respuesta[0],
      paginacionPre: respuesta[1]
    })
  }

  async retrieveQuiz() {
    await QuizDataService.getAll()
      .then(response => {
        this.setState({
          quizs: response.data
        });
      })
      .catch(e => {
        //console.log(e);
      });

    await TagQuizDataService.getAll()
      .then(response => {
        this.setState({
          quiztags: response.data
        });
      })
      .catch(e => {
        //console.log(e);
      });

    const respuesta = await this.retrieveFiltroPorPagina(this.state.quizs);
    await this.setState({
      listapaginacionQuiz: respuesta[0],
      paginacionQuiz: respuesta[1]
    })
  }

  setActivePregunta(pregunta) {
    this.retrieveQuizPre(pregunta);
  }

  setActiveQuiz(quiz) {
    this.retrieveQuizCur(quiz);
  }

  async retrieveQuizPre(id) {
    var cantidad = 0;
    var tagpres = [], pretag = [];
    await QuizPreDataService.getAll()
      .then(response => {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].preguntaid == id) {
            cantidad++;
          }
        }
        this.setState({
          contPre: cantidad
        });
      })
      .catch(e => {
        //console.log(e);
      });


    for (var j = 0; j < this.state.pretags.length; j++) {
      if (this.state.pretags[j].preguntaid == id) {
        await TagDataService.get(this.state.pretags[j].tagid)
          .then(response => {
            pretag.push(response.data);
          })
          .catch(e => {
            //console.log(e);
          });
      }
    }

    await TagDataService.getAll()
      .then(response => {
        this.buscar(response.data, this.state.pretags, id);
      })
      .catch(e => {
        //console.log(e);
      });

    this.setState({
      pretag: pretag,
    });
  }

  async retrieveQuizCur(id) {
    var cantidad = 0;
    var quiztag = [];
    await QuizCurDataService.getAll()
      .then(response => {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].quizid == id) {
            cantidad++;
          }
        }
        this.setState({
          contQuiz: cantidad
        });
      })
      .catch(e => {
        //console.log(e);
      });

    for (var j = 0; j < this.state.quiztags.length; j++) {
      if (this.state.quiztags[j].quizid == id) {
        await TagDataService.get(this.state.quiztags[j].tagid)
          .then(response => {
            quiztag.push(response.data);
          })
          .catch(e => {
            //console.log(e);
          });
      }
    }

    //console.log(quiztag);
    await TagDataService.getAll()
      .then(response => {
        this.buscar2(response.data, this.state.quiztags, id);
      })
      .catch(e => {
        //console.log(e);
      });

    this.setState({
      quiztag: quiztag,
    });
  }

  async buscar(tag, pretag, id) {
    //console.log(pretag);
    for (var i = 0; i < tag.length; i++) {
      for (var j = 0; j < pretag.length; j++) {
        if (pretag[j].preguntaid == id) {
          if (pretag[j].tagid == tag[i].id) {
            tag.splice(i, 1);
          }
        }
      }
    }

    this.setState({
      tagpres: tag,
    });
    const respuesta = await this.retrieveFiltroPorPagina(tag);
    await this.setState({
      listapaginacionTag: respuesta[0],
      paginacionTag: respuesta[1]
    })
  }

  async buscar2(tag, quiztag, id) {
    for (var i = 0; i < tag.length; i++) {
      for (var j = 0; j < quiztag.length; j++) {
        if (quiztag[j].quizid == id) {
          if (quiztag[j].tagid == tag[i].id) {
            tag.splice(i, 1);
          }
        }
      }
    }

    this.setState({
      tagquizs: tag,
    });
    const respuesta = await this.retrieveFiltroPorPagina(tag);
    await this.setState({
      listapaginacionTag: respuesta[0],
      paginacionTag: respuesta[1]
    })
  }

  async deletePregunta(id) {
    this.openModalspinner();
    await PreguntaDataService.delete(id)
      .then(response => {
        //console.log(response.data);
        this.retrievePreguntas();
        this.retrieveQuiz();
        this.setState({
          visibleeliminar: false,
          visibleeliminar2: false
        });
      })
      .catch(e => {
        //console.log(e);
      })
    await this.closeModalspinner();
  }

  async deleteQuiz(id) {
    this.openModalspinner();
    await QuizDataService.delete(id)
      .then(response => {
        //console.log(response.data);
        this.retrievePreguntas();
        this.retrieveQuiz();
        this.setState({
          visibleeliminar: false,
          visibleeliminar2: false
        });
      })
      .catch(e => {
        //console.log(e);
      })
    await this.closeModalspinner();
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

  closeModaltagpre() {
    this.setState({
      visibletagpre: false,
    });
  }
  openModaltagpre(id) {
    this.setState({
      visibletagpre: true,
    });
  }

  async searchNombreQuiz(e) {
    const searchNombre = await e.target.value;

    this.setState({
      searchNombre: searchNombre
    });
    await QuizDataService.findByTitulo(this.state.searchNombre)
      .then(response => {
        this.setState({
          quizs: response.data
        });
      })
      .catch(e => {
        //console.log(e);
      });
    // await this.refreshFiltroPorPagina(1, this.state.ramos, "ramo")
    const listaRamos = await this.state.quizs.slice();
    const respuesta = await this.retrieveFiltroPorPagina(listaRamos);
    await this.setState({
      listapaginacionQuiz: respuesta[0],
      paginacionQuiz: respuesta[1]
    })
  }

  async searchNombrePregunta(e) {
    const searchNombre = await e.target.value;

    this.setState({
      searchNombre: searchNombre
    });
    await PreguntaDataService.findByTitulo(this.state.searchNombre)
      .then(response => {
        this.setState({
          preguntas: response.data
        });
      })
      .catch(e => {
        //console.log(e);
      });
    // await this.refreshFiltroPorPagina(1, this.state.ramos, "ramo")
    const listaRamos = await this.state.preguntas.slice();
    const respuesta = await this.retrieveFiltroPorPagina(listaRamos);
    await this.setState({
      listapaginacionPre: respuesta[0],
      paginacionPre: respuesta[1]
    })
  }

  closeModalTag() {
    this.setState({
      visibleTag: false,
      tagid: "",
      preguntaid: ""
    });
  }

  openModalTag(tagid, preguntaid) {
    this.setState({
      visibleTag: true,
      tagid: tagid,
      preguntaid: preguntaid
    });
  }

  closeModalDeleteTag() {
    this.setState({
      visibledeleteTag: false,
      tagid: "",
      preguntaid: ""
    });
  }

  openModalDeleteTag(tagid, preguntaid) {
    this.setState({
      visibledeleteTag: true,
      tagid: tagid,
      preguntaid: preguntaid
    });
  }

  closeModalTag2() {
    this.setState({
      visibleTag2: false,
      tagid: "",
      quizid: ""
    });
  }

  openModalTag2(tagid, quizid) {
    this.setState({
      visibleTag2: true,
      tagid: tagid,
      quizid: quizid
    });
  }

  closeModalDeleteTag2() {
    this.setState({
      visibledeleteTag2: false,
      tagid: "",
      quizid: ""
    });
  }

  openModalDeleteTag2(tagid, quizid) {
    this.setState({
      visibledeleteTag2: true,
      tagid: tagid,
      quizid: quizid
    });
  }

  async deleteTagPre() {
    this.openModalspinner();
    await TagPreDataService.getAll()
      .then(response => {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].preguntaid == this.state.preguntaid) {
            if (response.data[i].tagid == this.state.tagid) {
              TagPreDataService.delete(response.data[i].id)
                .then(response => {
                  //console.log(response.data);
                })
                .catch(e => {
                  //console.log(e);
                })
            }
          }
        }
      })
      .catch(e => {
        //console.log(e);
      });
    await this.retrievePreguntas();
    await this.retrieveQuiz();
    await this.closeModalDeleteTag();
    await window.location.reload();
  }

  async deleteTagQuiz() {
    this.openModalspinner();
    await TagQuizDataService.getAll()
      .then(response => {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].quizid == this.state.quizid) {
            if (response.data[i].tagid == this.state.tagid) {
              TagQuizDataService.delete(response.data[i].id)
                .then(response => {
                  //console.log(response.data);
                })
                .catch(e => {
                  //console.log(e);
                })
            }
          }
        }
      })
      .catch(e => {
        //console.log(e);
      });
    await this.retrievePreguntas();
    await this.retrieveQuiz();
    await this.closeModalDeleteTag2();
    await window.location.reload();
  }

  async createTagPre() {
    this.openModalspinner();
    var data = {
      tagid: this.state.tagid,
      preguntaid: this.state.preguntaid,
    };
    TagPreDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          tagid: response.data.tagid,
          preguntaid: response.data.id,

          submitted: true
        });
        //console.log(response.data);
      })
      .catch(e => {
        //console.log(e);
      });
    await this.retrievePreguntas();
    await this.retrieveQuiz();
    await this.closeModalTag();
    await window.location.reload();
  }

  async createTagQuiz() {
    this.openModalspinner();
    var data = {
      tagid: this.state.tagid,
      quizid: this.state.quizid,
    };
    TagQuizDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          tagid: response.data.tagid,
          quizid: response.data.id,

          submitted: true
        });
        //console.log(response.data);
      })
      .catch(e => {
        //console.log(e);
      });
    await this.retrievePreguntas();
    await this.retrieveQuiz();
    await this.closeModalTag2();
    await window.location.reload();
  }

  //================================================
  //==================PAGINACION====================
  async retrieveFiltroPorPagina(listaporpaginar) {
    const listapageNumbers = [];
    for (let i = 1; i <= Math.ceil(listaporpaginar.length / this.state.postsPerPage); i++) {
      listapageNumbers.push(i);
    };
    const indexOfLastPost = 1 * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
    const currentPosts = listaporpaginar.slice(indexOfFirstPost, indexOfLastPost);

    return [currentPosts, listapageNumbers];
  }
  //-------------------------------------------------

  async refreshFiltroPorPagina(pag, lista, tipo) {
    const indexOfLastPost = pag * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
    const currentPosts = lista.slice(indexOfFirstPost, indexOfLastPost);

    if (tipo == "pre") {
      this.setState({
        listapaginacionPre: currentPosts,
        paginatePre: pag
      });
    }

    if (tipo == "quiz") {
      this.setState({
        listapaginacionQuiz: currentPosts,
        paginateQuiz: pag
      });
    }

    if (tipo == "tag") {
      this.setState({
        listapaginacionTag: currentPosts,
        paginateTag: pag
      });
    }
  }

  closeModalspinner() {
    this.setState({
      spinnerLoading: false
    });
  }

  openModalspinner() {
    this.setState({
      spinnerLoading: true
    });
  }

  render() {
    const { currentUser, showUserBoard, showModeratorBoard, showTeacherBoard, contPre, contQuiz, preguntas, quizs, deleteid, tagquizs, quiztag, tagpres, pretag, paginacionPre, listapaginacionPre, paginatePre, paginacionQuiz, listapaginacionQuiz, paginateQuiz, paginacionTag, listapaginacionTag, paginateTag } = this.state;

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
          {(showTeacherBoard || showModeratorBoard) && (
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
                        onChange={this.searchNombreQuiz}
                      ></input>
                    </div>
                  </div>

                  <Tab.Container id="left-tabs-example">
                    <Row>
                      <Col sm={3}>
                        <Nav variant="pills" className="flex-column">
                          <ul className="list-group">
                            {listapaginacionQuiz &&
                              listapaginacionQuiz.map((quiz) => (
                                <li className="list-group-item">
                                  <Nav.Item>
                                    <Nav.Link eventKey={quiz.id} onClick={() => this.setActiveQuiz(quiz.id)}>{quiz.titulo}</Nav.Link>
                                  </Nav.Item>
                                </li>
                              ))}
                          </ul>
                          <br></br>
                          {paginacionQuiz.length > 1 && (
                            <nav>
                              <Pagination>
                                {paginacionQuiz.map(number => (
                                  <Pagination.Item key={number} active={paginateQuiz == number} onClick={() => this.refreshFiltroPorPagina(number, quizs, "quiz")} >
                                    {number}
                                  </Pagination.Item>
                                ))}
                              </Pagination>
                            </nav>
                          )}
                        </Nav>
                      </Col>
                      <Col sm={9}>
                        <Tab.Content>
                          {quizs &&
                            quizs.map((quiz) => (
                              <Tab.Pane eventKey={quiz.id}>
                                <div className="list row">

                                  <div className="col-md-4">
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
                                  <div className="col-md-4">
                                    <h5>Tags para añadir</h5>
                                    <tr>
                                      <>
                                        <ul className="list-group">
                                          {listapaginacionTag &&
                                            listapaginacionTag.map((tagpre) => (
                                              <>
                                                <li className="list-group-item">
                                                  <Row>
                                                    <Col md="8">
                                                      {tagpre.nombre}
                                                    </Col>
                                                    <Col md="auto">
                                                      {' '}
                                                      <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Añadir Tag</Tooltip>}>
                                                        <Button size="sm" variant="info" onClick={() => this.openModalTag2(tagpre.id, quiz.id)}>
                                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tags-fill" viewBox="0 0 16 16">
                                                            <path d="M2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2zm3.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                                                            <path d="M1.293 7.793A1 1 0 0 1 1 7.086V2a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l.043-.043-7.457-7.457z" />
                                                          </svg>
                                                        </Button>
                                                      </OverlayTrigger>
                                                    </Col>
                                                  </Row>
                                                </li>
                                              </>
                                            ))}
                                          {listapaginacionTag.length == 0 && (
                                            <>
                                              <h4>No existen Tags Agregados...</h4>
                                            </>
                                          )}
                                        </ul>
                                        <br></br>
                                        {paginacionTag.length > 1 && (
                                          <nav>
                                            <Pagination>
                                              {paginacionTag.map(number => (
                                                <Pagination.Item key={number} active={paginateTag == number} onClick={() => this.refreshFiltroPorPagina(number, tagquizs, "tag")} >
                                                  {number}
                                                </Pagination.Item>
                                              ))}
                                            </Pagination>
                                          </nav>
                                        )}
                                      </>
                                    </tr>
                                  </div>
                                  <div className="col-md-4">
                                    <h5>Tags añadidos</h5>
                                    <tr>
                                      <>
                                        <td>
                                        {quiztag && (
                                            <>
                                              {quiztag.length == 0 && (
                                                <>
                                                  <h4>No tienes Tags añadidos...</h4>
                                                </>
                                              )}
                                            </>
                                          )}
                                          {quiztag &&
                                            quiztag.map((pretags) => (
                                              <>
                                                <li className="list-group-item">
                                                  <Row>
                                                    <Col md="8">
                                                      {pretags.nombre}
                                                    </Col>
                                                    <Col md="auto">
                                                      {' '}
                                                      <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Eliminar Tag</Tooltip>}>
                                                        <Button size="sm" variant="danger" onClick={() => this.openModalDeleteTag2(pretags.id, quiz.id)}>
                                                          <svg width="16" height="16" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                          </svg>
                                                        </Button>
                                                      </OverlayTrigger>
                                                    </Col>
                                                  </Row>
                                                </li>
                                              </>
                                            ))}
                                        </td>
                                      </>
                                    </tr>
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
                        onChange={this.searchNombrePregunta}
                      ></input>
                    </div>
                  </div>

                  <Tab.Container id="left-tabs-example">
                    <Row>
                      <Col sm={3}>
                        <Nav variant="pills" className="flex-column">
                          <ul className="list-group">
                            {listapaginacionPre &&
                              listapaginacionPre.map((pregunta) => (
                                <li className="list-group-item">
                                  <Nav.Item>
                                    <Nav.Link eventKey={pregunta.id} onClick={() => this.setActivePregunta(pregunta.id)}>{pregunta.titulo}</Nav.Link>
                                  </Nav.Item>
                                </li>
                              ))}
                          </ul>
                          <br></br>
                          {paginacionPre.length > 1 && (
                            <nav>
                              <Pagination>
                                {paginacionPre.map(number => (
                                  <Pagination.Item key={number} active={paginatePre == number} onClick={() => this.refreshFiltroPorPagina(number, preguntas, "pre")} >
                                    {number}
                                  </Pagination.Item>
                                ))}
                              </Pagination>
                            </nav>
                          )}
                        </Nav>
                      </Col>
                      <Col sm={9}>
                        <Tab.Content>
                          {preguntas &&
                            preguntas.map((pregunta) => (
                              <Tab.Pane eventKey={pregunta.id}>
                                <div className="list row">

                                  <div className="col-md-4">
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
                                  <div className="col-md-4">
                                    <h5>Tags para añadir</h5>
                                    <tr>
                                      <>
                                        <ul className="list-group">
                                          {listapaginacionTag &&
                                            listapaginacionTag.map((tagpre) => (
                                              <>
                                                <li className="list-group-item">
                                                  <Row>
                                                    <Col md="8">
                                                      {tagpre.nombre}
                                                    </Col>
                                                    <Col md="auto">
                                                      {' '}
                                                      <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Añadir Tag</Tooltip>}>
                                                        <Button size="sm" variant="info" onClick={() => this.openModalTag(tagpre.id, pregunta.id)}>
                                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tags-fill" viewBox="0 0 16 16">
                                                            <path d="M2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2zm3.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                                                            <path d="M1.293 7.793A1 1 0 0 1 1 7.086V2a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l.043-.043-7.457-7.457z" />
                                                          </svg>
                                                        </Button>
                                                      </OverlayTrigger>
                                                    </Col>
                                                  </Row>
                                                </li>
                                              </>
                                            ))}
                                        </ul>
                                        <br></br>
                                        {paginacionTag.length > 1 && (
                                          <nav>
                                            <Pagination>
                                              {paginacionTag.map(number => (
                                                <Pagination.Item key={number} active={paginateTag == number} onClick={() => this.refreshFiltroPorPagina(number, tagpres, "tag")} >
                                                  {number}
                                                </Pagination.Item>
                                              ))}
                                            </Pagination>
                                          </nav>
                                        )}
                                      </>
                                    </tr>
                                  </div>
                                  <div className="col-md-4">
                                    <h5>Tags añadidos</h5>
                                    <tr>
                                      <>
                                        <td>
                                          {pretag &&
                                            pretag.map((pretags) => (
                                              <>
                                                <li className="list-group-item">
                                                  <Row>
                                                    <Col md="8">
                                                      {pretags.nombre}
                                                    </Col>
                                                    <Col md="auto">
                                                      {' '}
                                                      <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Eliminar Tag</Tooltip>}>
                                                        <Button size="sm" variant="danger" onClick={() => this.openModalDeleteTag(pretags.id, pregunta.id)}>
                                                          <svg width="16" height="16" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                          </svg>
                                                        </Button>
                                                      </OverlayTrigger>
                                                    </Col>
                                                  </Row>
                                                </li>
                                              </>
                                            ))}
                                        </td>
                                      </>
                                    </tr>
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

              <Modal show={this.state.visibleTag} width="1000" height="500" effect="fadeInUp" >
                <Modal.Header closeButton onClick={() => this.closeModalTag()} >
                  <Modal.Title align="center">¿Deséa añadir el tag?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                  <button className="btn btn-warning" onClick={() => this.closeModalTag()} >
                    Cerrar
                  </button>
                  <button className="btn btn-success" onClick={() => this.createTagPre()}>
                    Añadir
                  </button>
                </Modal.Footer>
              </Modal>

              <Modal show={this.state.visibledeleteTag} width="1000" height="500" effect="fadeInUp" >
                <Modal.Header closeButton onClick={() => this.closeModalDeleteTag()} >
                  <Modal.Title align="center">¿Deséa eliminar el tag?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                  <button className="btn btn-warning" onClick={() => this.closeModalDeleteTag()} >
                    Cerrar
                  </button>
                  <button className="btn btn-success" onClick={() => this.deleteTagPre()}>
                    Borrar
                  </button>
                </Modal.Footer>
              </Modal>

              <Modal show={this.state.visibleTag2} width="1000" height="500" effect="fadeInUp" >
                <Modal.Header closeButton onClick={() => this.closeModalTag2()} >
                  <Modal.Title align="center">¿Deséa añadir el tag?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                  <button className="btn btn-warning" onClick={() => this.closeModalTag2()} >
                    Cerrar
                  </button>
                  <button className="btn btn-success" onClick={() => this.createTagQuiz()}>
                    Añadir
                  </button>
                </Modal.Footer>
              </Modal>

              <Modal show={this.state.visibledeleteTag2} width="1000" height="500" effect="fadeInUp" >
                <Modal.Header closeButton onClick={() => this.closeModalDeleteTag2()} >
                  <Modal.Title align="center">¿Deséa eliminar el tag?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                  <button className="btn btn-warning" onClick={() => this.closeModalDeleteTag2()} >
                    Cerrar
                  </button>
                  <button className="btn btn-success" onClick={() => this.deleteTagQuiz()}>
                    Borrar
                  </button>
                </Modal.Footer>
              </Modal>

              <Modal show={this.state.spinnerLoading} width="250" height="250" effect="fadeInUp" onClickAway={() => this.closeModalspinner()}>
                <div align="center">
                  <br></br>
                  <Spinner variant="primary" animation="grow" />
                  <h4>Cargando...</h4>
                  <br></br>
                </div>
              </Modal>
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