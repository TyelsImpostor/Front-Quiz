import React, { Component } from "react";
import CursoDataService from "../../services/curso.service";
import CurUsuDataService from "../../services/curusu.service";
import { Link } from "react-router-dom";

import { Button } from 'react-bootstrap';

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
      showModeratorBoard, showTeacherBoard, match, codigo, message, loading, query} = this.state;

    return (
      <div className="container">
        <header className="jumbotron">
          {currentUser ? (
            <div className="list row">
            <div className="col-md-8">
              <div className="col-md-8" center>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by titulo"
                    value={this.props.query}
                    onChange={this.handleOnInputChange}
                  ></input>
                </div>
              </div>

            </div>
            <div className="col-md-6">
              <h4>Cursos List</h4>

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
            <div className="col-md-6">
              {currentCurso ? (
                <div>
                  <h4>Detalles:</h4>
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

                  {loading == true ? (
                    <>
                      <div className="col-xs-6 col-sm-6 col-md-6" >
                        {match == true ? (
                          <>
                            <h6>Curso Inscrito</h6>
                          </>
                        ) : (
                          <>
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
                                  <Button size="sm" variant="primary" onClick={() => this.saveCurUsu(currentCurso.id, currentUser.id)}>
                                    Inscribir Curso
                                  </Button>
                                </div>
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
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <img src="../../../loading.gif" width="50" height="50" />
                      </div>
                     </> 
                    )}
                </div>
              ) : (
                  <div>
                    <br />
                    <p>Selecciona un Curso...</p>
                  </div>
                )}
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