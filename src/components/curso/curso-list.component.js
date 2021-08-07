import React, { Component } from "react";
import CursoDataService from "../../services/curso.service";
import RamoDataService from "../../services/ramo.service";
import CurUsuDataService from "../../services/curusu.service";
import { Link } from "react-router-dom";

import {
  Button, Col, Form, Tab, Card, ListGroup, Table, Accordion, OverlayTrigger, Tooltip, Pagination
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
    this.searchNombre = this.searchNombre.bind(this);

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
      searchNombre: "",

      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,

      //--------PAGINACION------------
      postsPerPage: 5,
      //--------------
      paginacionCursos: [],
      listapaginacionCursos: [],
      paginateCursos: 1,
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

  async retrieveCursos() {
    var cursos = [], ramos = [];
    await CursoDataService.getAll()
      .then(response => {
        for (var i = 0; i < response.data.length; i++) {
          cursos.push(response.data[i]);
        }
      })
      .catch(e => {
        //console.log(e);
      });

    for (var i = 0; i < cursos.length; i++) {
      await RamoDataService.get(cursos[i].ramoid)
        .then(response => {
          var data = {
            id: cursos[i].id,
            codigo: cursos[i].codigo,
            semestre: cursos[i].semestre,
            año: cursos[i].año,
            descripcion: cursos[i].descripcion,
            password: cursos[i].password,
            activo: cursos[i].activo,
            ramoid: cursos[i].ramoid,
            nombreramo: response.data.nombre
          }
          ramos.push(data);
        })
        .catch(e => {
          //console.log(e);
        });
    }
    await this.setState({
      cursos: ramos
    });
    const respuesta = await this.retrieveFiltroPorPagina(this.state.cursos);
    await this.setState({
      listapaginacionCursos: respuesta[0],
      paginacionCursos: respuesta[1]
    })
  }

  refreshList() {
    this.retrieveCursos();
    this.setState({
      currentCurso: null,
      currentIndex: -1
    });
  }

  async setActiveCurso(curso, index) {
    await this.setState({
      currentCurso: curso,
      currentIndex: index,
      codigocurso: "",
      codigo: "",
      message: false,
      loading: false,
      match: false,
      codigocurso: curso.password
    });
    await this.searchCurUsu(curso.id);
  }

  searchCurUsu(id) {
    CurUsuDataService.getAll()
      .then(response => {
        //console.log(response.data);
        console.log(response.data.length)
        for (var i = 0; i <= response.data.length; i++) {
          console.log(this.state.currentUser.id)
          if (response.data.length == 0) {
            this.setState({
              loading: true
            });
          } else {
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
            } else {
              this.setState({
                loading: true
              });
            }
          }
        }
      })
      .catch(e => {
        //console.log(e);
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
          //console.log(response.data);
          window.location.reload();
        })
        .catch(e => {
          //console.log(e);
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
        //console.log(response.data);
      })
      .catch(e => {
        //console.log(e);
      });
  }

  async searchNombre(e) {
    const searchNombre = await e.target.value;

    this.setState({
      searchNombre: searchNombre
    });
    await CursoDataService.findByCodigo(this.state.searchNombre)
      .then(response => {
        this.setState({
          cursos: response.data
        });
      })
      .catch(e => {
        //console.log(e);
      });
    // await this.refreshFiltroPorPagina(1, this.state.ramos, "ramo")
    const listaRamos = await this.state.cursos.slice();
    const respuesta = await this.retrieveFiltroPorPagina(listaRamos);
    await this.setState({
      listapaginacionCursos: respuesta[0],
      paginacionCursos: respuesta[1]
    })
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

    if (tipo == "curso") {
      this.setState({
        listapaginacionCursos: currentPosts,
        paginateCursos: pag
      });
    }
  }

  render() {
    const { searchCodigo, cursos, currentCurso, currentIndex, currentUser, paginateCursos,
      showModeratorBoard, showTeacherBoard, match, codigo, message, loading, listapaginacionCursos, paginacionCursos } = this.state;

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
                      onChange={this.searchNombre}
                    />
                  </div>
                </div>
              </div>

              <div className="list row">
                <div className="col-md-1"></div>

                <div className="col-md-4">
                  <h4>Cursos en el Sistema</h4>

                  <ul className="list-group">
                    {listapaginacionCursos &&
                      listapaginacionCursos.map((curso, index) => (
                        <li
                          className={
                            "list-group-item " +
                            (index === currentIndex ? "active" : "")
                          }
                          onClick={() => this.setActiveCurso(curso, index)}
                          key={index}
                        >
                          {curso.nombreramo} - {curso.codigo}
                        </li>
                      ))}
                  </ul>
                  <br></br>
                  {paginacionCursos.length > 1 && (
                    <nav>
                      <Pagination>
                        {paginacionCursos.map(number => (
                          <Pagination.Item key={number} active={paginateCursos == number} onClick={() => this.refreshFiltroPorPagina(number, cursos, "curso")} >
                            {number}
                          </Pagination.Item>
                        ))}
                      </Pagination>
                    </nav>
                  )}

                </div>
                <div className="col-md-7">

                  {currentCurso ? (
                    <div>
                      <h4>Detalles del Curso:</h4>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th><div align="center">Codigo</div></th>
                            <th><div align="center">Semestre</div></th>
                            <th><div align="center">Año</div></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><div align="center">{currentCurso.codigo}</div></td>
                            <td><div align="center">{currentCurso.semestre}</div></td>
                            <td><div align="center">{currentCurso.año}</div></td>
                          </tr>
                          <tr>
                            <td colSpan="3"><div align="center">{currentCurso.descripcion}</div></td>
                          </tr>
                          <tr>
                            <td colSpan="3">
                              <div align="center">
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
                                        <Form.Row>
                                          <Col md="11">
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Ingrese Codigo"
                                              value={codigo}
                                              onChange={this.onChangeCodigo}
                                            />
                                          </Col>
                                          <Col md="1">
                                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Inscribir</Tooltip>}>
                                              <Button size="sm" variant="secondary" onClick={() => this.saveCurUsu(currentCurso.id, currentUser.id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
                                                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                                                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                                                </svg>
                                              </Button>
                                            </OverlayTrigger>
                                          </Col>
                                          <br></br>
                                          <br></br>
                                          {message == true ? (
                                            <>
                                              <h6>Codigo Incorrecto</h6>
                                            </>
                                          ) : (
                                            <></>
                                          )}
                                        </Form.Row>
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
                            </td>
                          </tr>
                        </tbody>
                      </Table>
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

          {/* {(showTeacherBoard || showModeratorBoard) && (
          ))}

          {showUserBoard && (
            <h3>Usted no tiene el permiso para acceder a esta zona.</h3>
          )} */}

        </header>
      </div>
    );
  }
}