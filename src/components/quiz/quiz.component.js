import React, { Component } from "react";
import QuizDataService from "../../services/quiz.service";
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";

export default class Quiz extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitulo = this.onChangeTitulo.bind(this);
    this.onChangeDescripcion = this.onChangeDescripcion.bind(this);
    this.onChangeActivo = this.onChangeActivo.bind(this);
    this.onChangeTiempodisponible = this.onChangeTiempoRespuesta.bind(this);
    this.onChangeFechacreacion = this.onChangeFechacreacion.bind(this);
    this.onChangeRandom = this.onChangeRandom.bind(this);
    this.onChangeFechatermino = this.onChangeFechatermino.bind(this);
    this.getQuiz = this.getQuiz.bind(this);
    this.updateRandom = this.updateRandom.bind(this);
    this.updateQuiz = this.updateQuiz.bind(this);
    this.deleteQuiz = this.deleteQuiz.bind(this);

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
      message: "",
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    this.getQuiz(this.props.match.params.id);
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
        currentQuiz: {
          ...prevState.currentQuiz,
          titulo: titulo
        }
      };
    });
  }

  onChangeDescripcion(e) {
    const descripcion = e.target.value;

    this.setState(prevState => ({
      currentQuiz: {
        ...prevState.currentQuiz,
        descripcion: descripcion
      }
    }));
  }

  onChangeActivo(e) {
    const activo = e.target.value;

    this.setState(prevState => ({
      currentQuiz: {
        ...prevState.currentQuiz,
        activo: activo
      }
    }));
  }

  onChangeTiempoRespuesta(e) {
    const tiempodisponible = e.target.value;

    this.setState(prevState => ({
      currentQuiz: {
        ...prevState.currentQuiz,
        tiempodisponible: tiempodisponible
      }
    }));
  }

  onChangeFechacreacion(e) {
    const fechacreacion = e.target.value;

    this.setState(prevState => ({
      currentQuiz: {
        ...prevState.currentQuiz,
        fechacreacion: fechacreacion
      }
    }));
  }

  onChangeRandom(e) {
    const random = e.target.value;

    this.setState(prevState => ({
      currentQuiz: {
        ...prevState.currentQuiz,
        random: random
      }
    }));
  }

  onChangeFechatermino(e) {
    const fechatermino = e.target.value;

    this.setState(prevState => ({
      currentQuiz: {
        ...prevState.currentQuiz,
        fechatermino: fechatermino
      }
    }));
  }

  getQuiz(id) {
    QuizDataService.get(id)
      .then(response => {
        this.setState({
          currentQuiz: response.data
        });
        //console.log(response.data);
      })
      .catch(e => {
        //console.log(e);
      });
  }

  updateRandom(status1, status2) {
    var data = {
      id: this.state.currentQuiz.id,
      titulo: this.state.currentQuiz.titulo,
      descripcion: this.state.currentQuiz.descripcion,
      activo: this.state.currentQuiz.activo,
      tiempodisponible: this.state.currentQuiz.tiempodisponible,
      random: this.state.currentQuiz.random,
      fechacreacion: this.state.currentQuiz.fechacreacion,
      fechatermino: this.state.currentQuiz.fechatermino,
    };

    QuizDataService.update(this.state.currentQuiz.id, data)
      .then(response => {
        this.setState(prevState => ({
          currentQuiz: {
            ...prevState.currentQuiz,
            random: status1,
            activo: status2
          }
        }));
        //console.log(response.data);
      })
      .catch(e => {
        //console.log(e);
      });
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
        //console.log(e);
      });
  }

  deleteQuiz() {
    QuizDataService.delete(this.state.currentQuiz.id)
      .then(response => {
        //console.log(response.data);
        this.props.history.push('/quizs')
      })
      .catch(e => {
        //console.log(e);
      });
  }

  render() {
    const { currentQuiz, currentUser, showUserBoard, showModeratorBoard, showTeacherBoard } = this.state;

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
              {currentQuiz ? (
                <div className="edit-form">
                  <h4>Quiz</h4>
                  <form>
                    <div className="form-group">
                      <label htmlFor="titulo">Titulo</label>
                      <input
                        type="text"
                        className="form-control"
                        id="titulo"
                        value={currentQuiz.titulo}
                        onChange={this.onChangeTitulo}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="descripcion">Descripcion</label>
                      <input
                        type="text"
                        className="form-control"
                        id="descripcion"
                        value={currentQuiz.descripcion}
                        onChange={this.onChangeDescripcion}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="activo">Activo</label>
                      <input
                        type="text"
                        className="form-control"
                        id="activo"
                        value={currentQuiz.activo}
                        onChange={this.onChangeActivo}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="tiempodisponible">Tiempo de Disponible</label>
                      <input
                        type="text"
                        className="form-control"
                        id="tiempodisponible"
                        value={currentQuiz.tiempodisponible}
                        onChange={this.onChangeTiempoRespuesta}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="fechacreacion">Fecha de Creacion</label>
                      <input
                        type="text"
                        className="form-control"
                        id="fechacreacion"
                        value={currentQuiz.fechacreacion}
                        onChange={this.onChangeFechacreacion}
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
                      <label htmlFor="fechatermino">Fecha de Termino</label>
                      <input
                        type="text"
                        className="form-control"
                        id="fechatermino"
                        value={currentQuiz.fechatermino}
                        onChange={this.onChangeFechatermino}
                      />
                    </div>
                  </form>

                  <button className="badge badge-danger mr-2" onClick={this.deleteQuiz}>Delete</button>

                  <button type="submit" className="badge badge-success" onClick={this.updateQuiz}>Update </button>
                  <p>{this.state.message}</p>
                </div>
              ) : (
                  <div>
                    <br />
                    <p>Please click on a Quiz...</p>
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