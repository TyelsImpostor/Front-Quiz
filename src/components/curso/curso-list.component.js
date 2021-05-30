import React, { Component } from "react";
import CursoDataService from "../../services/curso.service";
import CurUsuDataService from "../../services/curusu.service";
import { Link } from "react-router-dom";

import {
  Button, Modal, Tabs, Tab, Card, ListGroup, Table, Accordion, OverlayTrigger, Tooltip, Pagination
} from 'react-bootstrap';

import AuthService from "../../services/auth.service";

export default class CursoList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchCodigo = this.onChangeSearchCodigo.bind(this);
    this.onChangeCodigo = this.onChangeCodigo.bind(this);
    this.retrieveCursos = this.retrieveCursos.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveCurso = this.setActiveCurso.bind(this);
    this.searchCodigo = this.searchCodigo.bind(this);
    this.searchCurUsu = this.searchCurUsu.bind(this);
    this.saveCurUsu = this.saveCurUsu.bind(this);

    this.state = {
      cursos: [],
      curusus: [],
      currentCurso: null,
      currentIndex: -1,
      searchCodigo: "",
      query: '',
      match: false,
      codigo: "",
      codigocurso: "",
      message: false,
      loading: false,

      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    this.retrieveCursos();
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

  onChangeSearchCodigo(e) {
    const searchCodigo = e.target.value;

    this.setState({
      searchCodigo: searchCodigo
    });
  }

  onChangeCodigo(e) {
    this.setState({
      codigo: e.target.value
    });
  }

  retrieveCursos() {
    CursoDataService.getAll()
      .then(response => {
        this.setState({
          cursos: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveCursos();
    this.setState({
      currentCurso: null,
      currentIndex: -1
    });
  }

  setActiveCurso(curso, index) {
    this.setState({
      currentCurso: curso,
      currentIndex: index,
      codigocurso: "",
      codigo: "",
      message: false,
      loading: false,
      match: false,
      codigocurso: curso.password
    });
    this.searchCurUsu(curso.id);
  }

  searchCurUsu(id) {
    CurUsuDataService.getAll()
      .then(response => {
        this.setState({
          curusus: response.data
        });
        console.log(response.data);
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].cursoid == id) {
            if (response.data[i].usuarioid == this.state.currentUser.id) {
              this.setState({
                match: true,
                loading: true
              });
            }
            else {
              this.setState({
                loading: true
              });
            }
          }
          else {
            this.setState({
              loading: true
            });
          }
        }
      })
      .catch(e => {
        console.log(e);
      });
  }

  saveCurUsu(id1, id2) {
    if (this.state.codigocurso == this.state.codigo) {
      var data = {
        cursoid: id1,
        usuarioid: id2,
      };

      CurUsuDataService.create(data)
        .then(response => {
          this.setState({
            id: response.data.id,
            cursoid: response.data.cursoid,
            usuarioid: response.data.usuarioid,

            message: false
          });
          console.log(response.data);
          window.location.reload();
        })
        .catch(e => {
          console.log(e);
        });
    }
    else {
      this.setState({ message: true });
    }
  }

  searchCodigo() {
    CursoDataService.findByCodigo(this.state.searchCodigo)
      .then(response => {
        this.setState({
          cursos: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  handleOnInputChange = (event) => {
    const query = event.target.value;
    this.setState({ query: query });
    //console.log(query);
    CursoDataService.findByCodigo(query)
      .then(response => {
        this.setState({
          cursos: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  };


  render() {
    const { searchCodigo, cursos, currentCurso, currentIndex, currentUser, showUserBoard,
      showModeratorBoard, showTeacherBoard, match, codigo, message, loading, query } = this.state;

    return (
      <div>
        <header>
          {currentUser ? (
            <div>
              <div class="img-center">
                <h2 class="center">Inscribe un Curso</h2>
                <p>
                  Revisa los cursos, ingresa el codigo y empieza tu aprendizaje.
              </p>
              </div>

              <div className="list row">

                <div className="col-md-7">
                  <div align="center">
                    <img src="../../../UCM.png" width="400" height="350" />
                  </div>
                </div>

                <div className="col-md-5">
                  <br></br>
                  <Table striped bordered hover>
                    <h3 class="img-center">Preguntas Frecuentes</h3>
                    <Accordion defaultActiveKey="0">
                      <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                          ¿De qué me sirve esta interfaz?
                  </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>En esta interfaz podrás ver los cursos en el sistema, revisa sus detalles y si ingresas su código proporcionado por el profesor, puedes inscribir el curso.</Card.Body>
                      </Accordion.Collapse>
                      <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                          Que no puedo hacer aquí
                  </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="1">
                        <Card.Body>Esta interfaz no te servirá para ingresar a un curso y revisar los Quiz, para eso deberás inscribir el curso y posteriormente entrar en la interfaz de Tus Cursos.</Card.Body>
                      </Accordion.Collapse>
                    </Accordion>
                  </Table>
                </div>
              </div>

              <br></br>
              <hr></hr>
              <br></br>

              <div>
                <div center>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar"
                      value={this.props.query}
                      onChange={this.handleOnInputChange}
                    ></input>
                  </div>
                </div>
              </div>

              <div className="list row">
                <div className="col-md-1"></div>

                <div className="col-md-4">
                  <h4>Cursos en el Sistema</h4>

                  <ul className="list-group">
                    {cursos &&
                      cursos.map((curso, index) => (
                        <li
                          className={
                            "list-group-item " +
                            (index === currentIndex ? "active" : "")
                          }
                          onClick={() => this.setActiveCurso(curso, index)}
                          key={index}
                        >
                          {curso.codigo}
                        </li>
                      ))}
                  </ul>

                </div>
                <div className="col-md-7">

                  {currentCurso ? (
                    <div className="list row">
                      <div className="col-md-5">
                        <h4>Detalles del Curso:</h4>
                        <div>
                          <label>
                            <strong>Codigo:</strong>
                          </label>{" "}
                          {currentCurso.codigo}
                        </div>
                        <div>
                          <label>
                            <strong>Semestre:</strong>
                          </label>{" "}
                          {currentCurso.semestre}
                        </div>
                        <div>
                          <label>
                            <strong>Año:</strong>
                          </label>{" "}
                          {currentCurso.año}
                        </div>
                        <div>
                          <label>
                            <strong>Descripcion:</strong>
                          </label>{" "}
                          {currentCurso.descripcion}
                        </div>
                      </div>
                      <div className="col-md-5">
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        {loading == true ? (
                          <>
                            {match == true ? (
                              <>
                                <label>
                                  <strong>Ingresa a tus Cursos para ver el contenido.</strong>
                                </label>
                                {" "}
                                <h6>Curso Inscrito</h6>
                              </>
                            ) : (
                              <>
                                <label>
                                  <strong>Ingresa el codigo del Curso:</strong>
                                </label>{" "}
                                <div className="row">
                                  <div className="col">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Ingrese Codigo"
                                      value={codigo}
                                      onChange={this.onChangeCodigo}
                                    />
                                  </div>
                                  <div className="col-xs-3 col-sm-3 col-md-3">
                                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Editar Retroalimentación</Tooltip>}>
                                      <Button size="sm" variant="secondary" onClick={() => this.saveCurUsu(currentCurso.id, currentUser.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
                                          <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                                          <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                                        </svg>
                                      </Button>
                                    </OverlayTrigger>
                                  </div>
                                  <br></br>
                                  <br></br>
                                  {message == true ? (
                                    <>
                                      <h6>Codigo Incorrecto</h6>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <div>
                              <img src="../../../loading.gif" width="50" height="50" />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <br />
                      <p>Selecciona un Curso...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3 class="text-muted">Debes iniciar sesión</h3>
              <Link to={"/login"}>
                Inicia Sesión
                </Link>
            </div>
          )}

          {/* {showTeacherBoard || (showModeratorBoard && (
          ))}

          {showUserBoard && (
            <h3>Usted no tiene el permiso para acceder a esta zona.</h3>
          )} */}

        </header>
      </div>
    );
  }
}