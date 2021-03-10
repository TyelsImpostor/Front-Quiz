import React, { Component } from "react";
import RamoDataService from "../../services/ramo.service";
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";

export default class Ramo extends Component {
  constructor(props) {
    super(props);
    this.onChangeCodigo = this.onChangeCodigo.bind(this);
    this.onChangeNombre = this.onChangeNombre.bind(this);
    this.onChangeSemestre = this.onChangeSemestre.bind(this);
    this.onChangeDescripcion = this.onChangeDescripcion.bind(this);
    this.getRamo = this.getRamo.bind(this);
    this.updateRamo = this.updateRamo.bind(this);
    this.deleteRamo = this.deleteRamo.bind(this);

    this.state = {
      currentRamo: {
        id: null,
        codigo: "",
        nombre: "",
        semestre: "",
        descripcion: ""
      },
      message: "",
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    this.getRamo(this.props.match.params.id);
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
        currentRamo: {
          ...prevState.currentRamo,
          codigo: codigo
        }
      };
    });
  }

  onChangeNombre(e) {
    const nombre = e.target.value;

    this.setState(function (prevState) {
      return {
        currentRamo: {
          ...prevState.currentRamo,
          nombre: nombre
        }
      };
    });
  }

  onChangeSemestre(e) {
    const semestre = e.target.value;

    this.setState(function (prevState) {
      return {
        currentRamo: {
          ...prevState.currentRamo,
          semestre: semestre
        }
      };
    });
  }

  onChangeDescripcion(e) {
    const descripcion = e.target.value;

    this.setState(function (prevState) {
      return {
        currentRamo: {
          ...prevState.currentRamo,
          descripcion: descripcion
        }
      };
    });
  }

  getRamo(id) {
    RamoDataService.get(id)
      .then(response => {
        this.setState({
          currentRamo: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateRamo() {
    RamoDataService.update(
      this.state.currentRamo.id,
      this.state.currentRamo
    )
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "The ramo was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteRamo() {
    RamoDataService.delete(this.state.currentRamo.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/ramos')
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { currentRamo, currentUser, showUserBoard, showModeratorBoard, showTeacherBoard } = this.state;

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
          {showTeacherBoard || (showModeratorBoard && (
            <div>
              {currentRamo ? (
                <div className="edit-form">
                  <h4>Ramo</h4>
                  <form>
                    <div className="form-group">
                      <label htmlFor="codigo">Codigo</label>
                      <input
                        type="text"
                        className="form-control"
                        id="codigo"
                        value={currentRamo.codigo}
                        onChange={this.onChangeCodigo}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="nombre">Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        value={currentRamo.nombre}
                        onChange={this.onChangeNombre}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="semestre">Semestre</label>
                      <input
                        type="text"
                        className="form-control"
                        id="semestre"
                        value={currentRamo.semestre}
                        onChange={this.onChangeSemestre}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="descripcion">Descripcion</label>
                      <input
                        type="text"
                        className="form-control"
                        id="descripcion"
                        value={currentRamo.descripcion}
                        onChange={this.onChangeDescripcion}
                      />
                    </div>
                  </form>

                  <button
                    className="badge badge-danger mr-2"
                    onClick={this.deleteRamo}
                  >
                    Delete
                </button>

                  <button
                    type="submit"
                    className="badge badge-success"
                    onClick={this.updateRamo}
                  >
                    Update
                </button>
                  <p>{this.state.message}</p>
                </div>
              ) : (
                  <div>
                    <br />
                    <p>Please click on a Ramo...</p>
                  </div>
                )}
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