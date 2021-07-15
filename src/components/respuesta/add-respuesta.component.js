import React, { Component } from "react";
import RespuestaDataService from "../../services/respuesta.service";
import PreguntaDataService from "../../services/pregunta.service";
import { Link } from "react-router-dom";
import Modal from 'react-awesome-modal';

import AuthService from "../../services/auth.service";

export default class AddRespuesta extends Component {
  constructor(props) {
    super(props);
    this.onChangeRespuesta1 = this.onChangeRespuesta1.bind(this);
    this.onChangeRespuesta2 = this.onChangeRespuesta2.bind(this);
    this.onChangeRespuesta3 = this.onChangeRespuesta3.bind(this);
    this.onChangeRespuesta4 = this.onChangeRespuesta4.bind(this);
    this.onChangeTiempoRespuesta = this.onChangeTiempoRespuesta.bind(this);
    this.onChangePreguntaid = this.onChangePreguntaid.bind(this);
    this.onChangeQuizid = this.onChangeQuizid.bind(this);
    this.onChangeUserid = this.onChangeUserid.bind(this);
    this.saveRespuesta = this.saveRespuesta.bind(this);

    this.state = {
      pregunta: null,
      id: null,
      respuesta1: "0",
      respuesta2: "0",
      respuesta3: "0",
      respuesta4: "0",
      tiemporespuesta: "",
      puntaje: "0",
      usuarioid: "",
      preguntaid: "",
      quizid: "",
      usuario: "",
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
      submitted: false
    };
  }

  componentDidMount() {
    this.setState({
      usuario: AuthService.getCurrentUser()
    });
    PreguntaDataService.get(this.props.match.params.id)
      .then(response => {
        this.setState({
          pregunta: response.data
        });
      })
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

  openModal() {
    this.setState({
      visible: true
    });
  }

  closeModal() {
    this.setState({
      visible: false
    });
  }

  onChangeRespuesta1(e) {
    this.setState({
      respuesta1: e.target.value
    });
  }

  onChangeRespuesta2(e) {
    this.setState({
      respuesta2: e.target.value
    });
  }

  onChangeRespuesta3(e) {
    this.setState({
      respuesta3: e.target.value
    });
  }

  onChangeRespuesta4(e) {
    this.setState({
      respuesta4: e.target.value
    });
  }

  onChangeTiempoRespuesta(e) {
    this.setState({
      tiemporespuesta: e.target.value
    });
  }

  onChangePreguntaid(e) {
    this.setState({
      preguntaid: e.target.value
    });
  }

  onChangeQuizid(e) {
    this.setState({
      quizid: e.target.value
    });
  }

  onChangeUserid(e) {
    this.setState({
      usuarioid: e.target.value
    });
  }

  saveRespuesta() {
    if (this.state.respuesta1 == this.state.pregunta.respuesta1) {
      if (this.state.respuesta2 == this.state.pregunta.respuesta2) {
        if (this.state.respuesta3 == this.state.pregunta.respuesta3) {
          if (this.state.respuesta4 == this.state.pregunta.respuesta4) {
            var data = {
              respuesta1: this.state.respuesta1,
              respuesta2: this.state.respuesta2,
              respuesta3: this.state.respuesta3,
              respuesta4: this.state.respuesta4,
              tiemporespuesta: this.state.tiemporespuesta,
              puntaje: this.state.pregunta.puntaje,
              usuarioid: this.state.usuario.id,
              preguntaid: this.props.match.params.id,
              quizid: this.state.quizid
            };
          } else {
            var data = {
              respuesta1: this.state.respuesta1,
              respuesta2: this.state.respuesta2,
              respuesta3: this.state.respuesta3,
              respuesta4: this.state.respuesta4,
              tiemporespuesta: this.state.tiemporespuesta,
              puntaje: this.state.puntaje,
              usuarioid: this.state.usuario.id,
              preguntaid: this.props.match.params.id,
              quizid: this.state.quizid
            };
          }
        } else {
          var data = {
            respuesta1: this.state.respuesta1,
            respuesta2: this.state.respuesta2,
            respuesta3: this.state.respuesta3,
            respuesta4: this.state.respuesta4,
            tiemporespuesta: this.state.tiemporespuesta,
            puntaje: this.state.puntaje,
            usuarioid: this.state.usuario.id,
            preguntaid: this.props.match.params.id,
            quizid: this.state.quizid
          };
        }
      } else {
        var data = {
          respuesta1: this.state.respuesta1,
          respuesta2: this.state.respuesta2,
          respuesta3: this.state.respuesta3,
          respuesta4: this.state.respuesta4,
          tiemporespuesta: this.state.tiemporespuesta,
          puntaje: this.state.puntaje,
          usuarioid: this.state.usuario.id,
          preguntaid: this.props.match.params.id,
          quizid: this.state.quizid
        };
      }
    } else {
      var data = {
        respuesta1: this.state.respuesta1,
        respuesta2: this.state.respuesta2,
        respuesta3: this.state.respuesta3,
        respuesta4: this.state.respuesta4,
        tiemporespuesta: this.state.tiemporespuesta,
        puntaje: this.state.puntaje,
        usuarioid: this.state.usuario.id,
        preguntaid: this.props.match.params.id,
        quizid: this.state.quizid
      };
    }

    if (this.state.respuesta1 == this.state.pregunta.respuesta1) {
      if (this.state.respuesta2 == this.state.pregunta.respuesta2) {
        if (this.state.respuesta3 == this.state.pregunta.respuesta3) {
          if (this.state.respuesta4 == this.state.pregunta.respuesta4) {
            RespuestaDataService.create(data)
              .then(response => {
                this.setState({
                  id: response.data.id,
                  tiemporespuesta: response.data.tiemporespuesta,
                  respuesta1: response.data.respuesta1,
                  respuesta2: response.data.respuesta2,
                  respuesta3: response.data.respuesta3,
                  respuesta4: response.data.respuesta4,
                  puntaje: response.data.pregunta.puntaje,
                  usuarioid: response.data.usuario.id,
                  preguntaid: this.props.match.params.id,
                  quizid: response.data.quizid
                });
                //console.log(response.data);
              })
              .catch(e => {
                //console.log(e);
              });
              this.setState({
                submitted: true
              });
          } else {
            RespuestaDataService.create(data)
              .then(response => {
                this.setState({
                  id: response.data.id,
                  tiemporespuesta: response.data.tiemporespuesta,
                  respuesta1: response.data.respuesta1,
                  respuesta2: response.data.respuesta2,
                  respuesta3: response.data.respuesta3,
                  respuesta4: response.data.respuesta4,
                  puntaje: response.data.puntaje,
                  usuarioid: response.data.usuario.id,
                  preguntaid: this.props.match.params.id,
                  quizid: response.data.quizid
                });
                //console.log(response.data);
              })
              .catch(e => {
                //console.log(e);
              });
          }
        } else {
          RespuestaDataService.create(data)
            .then(response => {
              this.setState({
                id: response.data.id,
                tiemporespuesta: response.data.tiemporespuesta,
                respuesta1: response.data.respuesta1,
                respuesta2: response.data.respuesta2,
                respuesta3: response.data.respuesta3,
                respuesta4: response.data.respuesta4,
                puntaje: response.data.puntaje,
                usuarioid: response.data.usuario.id,
                preguntaid: this.props.match.params.id,
                quizid: response.data.quizid
              });
              //console.log(response.data);
            })
            .catch(e => {
              //console.log(e);
            });
        }
      } else {
        RespuestaDataService.create(data)
          .then(response => {
            this.setState({
              id: response.data.id,
              tiemporespuesta: response.data.tiemporespuesta,
              respuesta1: response.data.respuesta1,
              respuesta2: response.data.respuesta2,
              respuesta3: response.data.respuesta3,
              respuesta4: response.data.respuesta4,
              puntaje: response.data.puntaje,
              usuarioid: response.data.usuario.id,
              preguntaid: this.props.match.params.id,
              quizid: response.data.quizid
            });
            //console.log(response.data);
          })
          .catch(e => {
            //console.log(e);
          });
      }
    } else {
      RespuestaDataService.create(data)
        .then(response => {
          this.setState({
            id: response.data.id,
            tiemporespuesta: response.data.tiemporespuesta,
            respuesta1: response.data.respuesta1,
            respuesta2: response.data.respuesta2,
            respuesta3: response.data.respuesta3,
            respuesta4: response.data.respuesta4,
            puntaje: response.data.puntaje,
            usuarioid: response.data.usuario.id,
            preguntaid: this.props.match.params.id,
            quizid: response.data.quizid
          });
          //console.log(response.data);
        })
        .catch(e => {
          //console.log(e);
        });
    }
    this.openModal();
  }

  render() {
    const { currentUser, showUserBoard, showModeratorBoard, showTeacherBoard, pregunta } = this.state;

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

            <div className="submit-form">

              <div className="col-md-6">
                {pregunta && (
                  <div>
                    <h4>Pregunta</h4>
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

                    <h1></h1>

                    <div>
                      <div>
                        <input
                          type="checkbox"
                          id="respuesta1"
                          value="1"
                          defaultValue="0"
                          onChange={this.onChangeRespuesta1}
                          name="respuesta1"
                        />
                        {pregunta.opcion1}
                      </div>

                      <div>
                        <input
                          type="checkbox"
                          id="respuesta2"
                          value="1"
                          defaultValue="0"
                          onChange={this.onChangeRespuesta2}
                          name="respuesta2"
                        />
                        {pregunta.opcion2}
                      </div>

                      <div>
                        <input
                          type="checkbox"
                          id="respuesta3"
                          value="1"
                          defaultValue="0"
                          onChange={this.onChangeRespuesta3}
                          name="respuesta3"
                        />
                        {pregunta.opcion3}
                      </div>

                      <div>
                        <input
                          type="checkbox"
                          id="respuesta4"
                          value="1"
                          defaultValue="0"
                          onChange={this.onChangeRespuesta4}
                          name="respuesta4">
                        </input>
                        {pregunta.opcion4}
                      </div>

                      <div className="form-group">
                        <label htmlFor="tiemporespuesta">Tiempo de Respuesta</label>
                        <input
                          type="text"
                          className="form-control"
                          id="tiemporespuesta"
                          required
                          value={this.state.tiemporespuesta}
                          onChange={this.onChangeTiempoRespuesta}
                          name="tiemporespuesta"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="preguntaid">Id de la pregunta</label>
                        <input
                          type="text"
                          className="form-control"
                          id="preguntaid"
                          required
                          value={this.props.match.params.id}
                          onChange={this.onChangePreguntaid}
                          name="preguntaid"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="quizid">Id del Quiz</label>
                        <input
                          type="text"
                          className="form-control"
                          id="quizid"
                          required
                          value={this.state.quizid}
                          onChange={this.onChangeQuizid}
                          name="quizid"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="usuarioid">Mi ID</label>
                        <input
                          type="text"
                          className="form-control"
                          id="usuarioid"
                          required
                          value={currentUser.id}
                          onChange={this.onChangeUserid}
                          name="usuarioid"
                        />
                      </div>

                      <button onClick={this.saveRespuesta} className="btn btn-success">
                        Submit
                    </button>

                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {showUserBoard && (
            <h3>Usted no tiene el permiso para acceder a esta zona.</h3>
          )}

          <section>
            <Modal visible={this.state.visible} width="1000" height="500" effect="fadeInUp" onClickAway={() => this.closeModal()}>
              <div>
                {this.state.submitted ? (
                  <div>
                    <h4>Respuesta Correcta!!!</h4>
                    <a href="/" className="btn btn-success">
                      Regresar
                   </a>
                  </div>
                ) : (
                    <div>
                      <h4>Respuesta Incorrecta :(</h4>
                      <a href="/" className="btn btn-success">
                        Regresar
                     </a>
                    </div>
                  )}
              </div>
            </Modal>
          </section>

        </header>
      </div>
    );
  }
}