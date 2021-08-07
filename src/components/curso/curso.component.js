import React, { Component } from "react";
import CursoDataService from "../../services/curso.service";
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";

export default class Curso extends Component {
  constructor(props) {
    super(props);
    this.onChangeCodigo = this.onChangeCodigo.bind(this);
    this.onChangeSemestre = this.onChangeSemestre.bind(this);
    this.onChangeAño = this.onChangeAño.bind(this);
    this.onChangeDescripcion = this.onChangeDescripcion.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeActivo = this.onChangeActivo.bind(this);
    this.onChangeRamoid = this.onChangeRamoid.bind(this);
    this.getCurso = this.getCurso.bind(this);
    this.updateCurso = this.updateCurso.bind(this);
    this.deleteCurso = this.deleteCurso.bind(this);

    this.state = {
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
      message: "",
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    this.getCurso(this.props.match.params.id);
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

  onChangeCodigo(e) {
    const codigo = e.target.value;

    this.setState(function (prevState) {
      return {
        currentCurso: {
          ...prevState.currentCurso,
          codigo: codigo
        }
      };
    });
  }

  onChangeSemestre(e) {
    const semestre = e.target.value;

    this.setState(function (prevState) {
      return {
        currentCurso: {
          ...prevState.currentCurso,
          semestre: semestre
        }
      };
    });
  }

  onChangeAño(e) {
    const año = e.target.value;

    this.setState(function (prevState) {
      return {
        currentCurso: {
          ...prevState.currentCurso,
          año: año
        }
      };
    });
  }

  onChangeDescripcion(e) {
    const descripcion = e.target.value;

    this.setState(function (prevState) {
      return {
        currentCurso: {
          ...prevState.currentCurso,
          descripcion: descripcion
        }
      };
    });
  }

  onChangePassword(e) {
    const password = e.target.value;

    this.setState(function (prevState) {
      return {
        currentCurso: {
          ...prevState.currentCurso,
          password: password
        }
      };
    });
  }

  onChangeActivo(e) {
    const activo = e.target.value;

    this.setState(function (prevState) {
      return {
        currentCurso: {
          ...prevState.currentCurso,
          activo: activo
        }
      };
    });
  }

  onChangeRamoid(e) {
    const ramoid = e.target.value;

    this.setState(function (prevState) {
      return {
        currentCurso: {
          ...prevState.currentCurso,
          ramoid: ramoid
        }
      };
    });
  }

  getCurso(id) {
    CursoDataService.get(id)
      .then(response => {
        this.setState({
          currentCurso: response.data
        });
        //console.log(response.data);
      })
      .catch(e => {
        //console.log(e);
      });
  }

  updateCurso() {
    CursoDataService.update(
      this.state.currentCurso.id,
      this.state.currentCurso
    )
      .then(response => {
        //console.log(response.data);
        this.setState({
          message: "The curso was updated successfully!"
        });
      })
      .catch(e => {
        //console.log(e);
      });
  }

  deleteCurso() {
    CursoDataService.delete(this.state.currentCurso.id)
      .then(response => {
        //console.log(response.data);
        this.props.history.push('/cursos')
      })
      .catch(e => {
        //console.log(e);
      });
  }

  render() {
    const { currentCurso, currentUser, showUserBoard, showModeratorBoard, showTeacherBoard } = this.state;

    return (
      <div className="container">
        <header className="jumbotron">
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
              {currentCurso ? (
                <div className="edit-form">
                  <h4>Curso</h4>
                  <form>
                    <div className="form-group">
                      <label htmlFor="codigo">Codigo</label>
                      <input
                        type="text"
                        className="form-control"
                        id="codigo"
                        value={currentCurso.codigo}
                        onChange={this.onChangeCodigo}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="semestre">Semestre</label>
                      <input
                        type="text"
                        className="form-control"
                        id="semestre"
                        value={currentCurso.semestre}
                        onChange={this.onChangeSemestre}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="año">Año</label>
                      <input
                        type="text"
                        className="form-control"
                        id="año"
                        value={currentCurso.año}
                        onChange={this.onChangeAño}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="descripcion">Descripcion</label>
                      <input
                        type="text"
                        className="form-control"
                        id="descripcion"
                        value={currentCurso.descripcion}
                        onChange={this.onChangeDescripcion}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input
                        type="text"
                        className="form-control"
                        id="password"
                        value={currentCurso.password}
                        onChange={this.onChangePassword}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="activo">Activo:</label>
                      <select
                        type="text"
                        className="form-control"
                        id="activo"
                        onChange={this.onChangeActivo}
                        defaultValue={currentCurso.activo}>
                        <option disabled>...</option>
                        <option value="true">activo</option>
                        <option value="false">desactivado</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="ramoid">ID del Ramo</label>
                      <input
                        type="text"
                        className="form-control"
                        id="ramoid"
                        value={currentCurso.ramoid}
                        onChange={this.onChangeRamoid}
                        disabled
                      />
                    </div>
                  </form>

                  <button
                    className="badge badge-danger mr-2"
                    onClick={this.deleteCurso}
                  >
                    Delete
                </button>

                  <button
                    type="submit"
                    className="badge badge-success"
                    onClick={this.updateCurso}
                  >
                    Update
                </button>
                  <p>{this.state.message}</p>
                </div>
              ) : (
                  <div>
                    <br />
                    <p>Please click on a Curso...</p>
                  </div>
                )}
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