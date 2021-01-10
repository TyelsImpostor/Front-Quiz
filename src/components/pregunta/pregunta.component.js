import React, { Component } from "react";
import PreguntaDataService from "../../services/pregunta.service";
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";

export default class Pregunta extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitulo = this.onChangeTitulo.bind(this);
    this.onChangeTipo = this.onChangeTipo.bind(this);
    this.onChangeEnunciado = this.onChangeEnunciado.bind(this);
    this.onChangeTiempoRespuesta = this.onChangeTiempoRespuesta.bind(this);
    this.onChangePuntaje = this.onChangePuntaje.bind(this);
    this.onChangeRandom = this.onChangeRandom.bind(this);
    this.onChangeUserid = this.onChangeUserid.bind(this);
    this.getPregunta = this.getPregunta.bind(this);
    this.updateRandom = this.updateRandom.bind(this);
    this.updatePregunta = this.updatePregunta.bind(this);
    this.deletePregunta = this.deletePregunta.bind(this);

    this.state = {
      currentPregunta: {
        id: null,
        titulo: "",
        tipo: "",
        enunciado: "",
        tiemporespuesta: "",
        puntaje: "",
        random: "",
        users: ""

      },
      message: "",
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    this.getPregunta(this.props.match.params.id);
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

  onChangeTitulo(e) {
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

  onChangeTipo(e) {
    const tipo = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        tipo: tipo
      }
    }));
  }

  onChangeEnunciado(e) {
    const enunciado = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        enunciado: enunciado
      }
    }));
  }

  onChangeTiempoRespuesta(e) {
    const tiemporespuesta = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        tiemporespuesta: tiemporespuesta
      }
    }));
  }

  onChangePuntaje(e) {
    const puntaje = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        puntaje: puntaje
      }
    }));
  }

  onChangeRandom(e) {
    const random = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        random: random
      }
    }));
  }

  onChangeUserid(e) {
    const users = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        users: users
      }
    }));
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

  updateRandom(status) {
    var data = {
      id: this.state.currentPregunta.id,
      titulo: this.state.currentPregunta.titulo,
      tipo: this.state.currentPregunta.tipo,
      enunciado: this.state.currentPregunta.enunciado,
      tiemporespuesta: this.state.currentPregunta.tiemporespuesta,
      puntaje: this.state.currentPregunta.puntaje,
      random: this.state.currentPregunta.random,
      users: this.state.currentPregunta.users,
    };

    PreguntaDataService.update(this.state.currentPregunta.id, data)
      .then(response => {
        this.setState(prevState => ({
          currentPregunta: {
            ...prevState.currentPregunta,
            random: status
          }
        }));
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

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

  deletePregunta() {
    PreguntaDataService.delete(this.state.currentPregunta.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/preguntas')
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { currentPregunta, currentUser, showUserBoard, showModeratorBoard, showTeacherBoard } = this.state;

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
              {currentPregunta ? (
                <div className="edit-form">
                  <h4>Pregunta</h4>
                  <form>
                    <div className="form-group">
                      <label htmlFor="titulo">Titulo</label>
                      <input
                        type="text"
                        className="form-control"
                        id="titulo"
                        value={currentPregunta.titulo}
                        onChange={this.onChangeTitulo}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="tipo">Tipo</label>
                      <input
                        type="text"
                        className="form-control"
                        id="tipo"
                        value={currentPregunta.tipo}
                        onChange={this.onChangeTipo}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="enunciado">Enunciado</label>
                      <input
                        type="text"
                        className="form-control"
                        id="enunciado"
                        value={currentPregunta.enunciado}
                        onChange={this.onChangeEnunciado}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="tiemporespuesta">Tiempo de Respuesta</label>
                      <input
                        type="text"
                        className="form-control"
                        id="tiemporespuesta"
                        value={currentPregunta.tiemporespuesta}
                        onChange={this.onChangeTiempoRespuesta}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="puntaje">Puntaje</label>
                      <input
                        type="text"
                        className="form-control"
                        id="puntaje"
                        value={currentPregunta.puntaje}
                        onChange={this.onChangePuntaje}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="opcion">Random</label>
                      <input
                        type="checkbox"
                        className="form-control"
                        id="random"
                        value="true"
                        onChange={this.onChangeRandom}>
                      </input>
                    </div>
                    <div className="form-group">
                      <label htmlFor="users">Id del Usuario</label>
                      <input
                        type="text"
                        className="form-control"
                        id="users"
                        value={currentPregunta.users}
                        onChange={this.onChangeUserid}
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <strong>Pregunta Random:</strong>
                      </label>
                      {currentPregunta.random ? "Activado" : "Desactivado"}
                    </div>
                  </form>

                  {currentPregunta.random ? (
                    <button
                      className="badge badge-primary mr-2"
                      onClick={() => this.updateRandom(false)}
                    >
                      Desactivado
                    </button>
                  ) : (
                      <button
                        className="badge badge-primary mr-2"
                        onClick={() => this.updateRandom(true)}
                      >
                        Activado
                      </button>
                    )}

                  <button
                    className="badge badge-danger mr-2"
                    onClick={this.deletePregunta}
                  >
                    Delete
                </button>

                  <button
                    type="submit"
                    className="badge badge-success"
                    onClick={this.updatePregunta}
                  >
                    Update
                </button>
                  <p>{this.state.message}</p>
                </div>
              ) : (
                  <div>
                    <br />
                    <p>Please click on a Pregunta...</p>
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