import React, { Component } from "react";
import QuizPreDataService from "../../services/quizpre.service";
import PreguntaDataService from "../../services/pregunta.service";
import RespuestaDataService from "../../services/respuesta.service";
import PreRecurDataService from "../../services/prerecur.service";
import RecursoDataService from "../../services/recurso.service";
import UsuQuizDataService from "../../services/usuquiz.service";
import { Link } from "react-router-dom";
import Modal from 'react-awesome-modal';

import AuthService from "../../services/auth.service";

export default class PreguntasList extends Component {
  constructor(props) {
    super(props);
    this.retrievePreguntas = this.retrievePreguntas.bind(this);
    this.setActivePregunta = this.setActivePregunta.bind(this);

    this.onChangeRespuesta1 = this.onChangeRespuesta1.bind(this);
    this.onChangeRespuesta2 = this.onChangeRespuesta2.bind(this);
    this.onChangeRespuesta3 = this.onChangeRespuesta3.bind(this);
    this.onChangeRespuesta4 = this.onChangeRespuesta4.bind(this);
    this.onChangeTiempoRespuesta = this.onChangeTiempoRespuesta.bind(this);
    this.onChangePreguntaid = this.onChangePreguntaid.bind(this);
    this.onChangeQuizid = this.onChangeQuizid.bind(this);
    this.onChangeUserid = this.onChangeUserid.bind(this);
    this.saveRespuesta = this.saveRespuesta.bind(this);

    this.saveUsuQuiz = this.saveUsuQuiz.bind(this);

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
      puntajetotal: "0",
      resultado: "0",

      quizs: [],
      quizpres: [],
      preguntas: [],
      respuestas: [],
      respuestausers: [],
      prerecurs: [],
      recursos: [],
      recursoimages: [],
      recursodocumentos: [],
      recursolinks: [],
      currentIndex: -1,
      visible: false,
      visible2: false,
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
    };
  }

  async componentDidMount() {
    await this.retrievePreguntas();
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
  }

  openModal() {
    this.setState({
      visible: true,
      id: null,
      respuesta1: "0",
      respuesta2: "0",
      respuesta3: "0",
      respuesta4: "0",
      tiemporespuesta: "",
      puntaje: "0",
      usuarioid: "",
      preguntaid: "",
      quizid: ""
    });
  }

  closeModal() {
    this.setState({
      visible: false,
      id: null,
      respuesta1: "0",
      respuesta2: "0",
      respuesta3: "0",
      respuesta4: "0",
      tiemporespuesta: "",
      puntaje: "0",
      usuarioid: "",
      preguntaid: "",
      quizid: ""
    });
  }

  openModalResultado() {
    this.setState({
      visible2: true
    });
  }

  closeModalResultado() {
    this.setState({
      visible2: false
    });
  }

  async retrievePreguntas() {
    var quizs = [], preguntas = [], prerecurs = [], recursos = [], recursoimages = [], recursodocumentos = [], recursolinks = [];

    await RecursoDataService.getAll()
      .then(response => {
        this.setState({
          recursos: response.data
        });
        console.log(response.data);
        for (var i = 0; i < response.data.length; i++) {
          recursos.push(response.data[i]);
        }
        this.setState({ recursos: recursos });

      })
      .catch(e => {
        console.log(e);
      });

    await PreRecurDataService.getAll()
      .then(response => {
        this.setState({
          prerecurs: response.data
        });
        console.log(response.data);
        for (var i = 0; i < response.data.length; i++) {
          prerecurs.push(response.data[i]);
        }
        this.setState({ prerecurs: prerecurs });

        for (var i = 0; i < prerecurs.length; i++) {
          for (var j = 0; j < recursos.length; j++) {
            if (prerecurs[i].recursoid == recursos[j].id) {
              if (recursos[j].type == "imagen") {
                recursoimages.push(prerecurs[i]);
              }
              if (recursos[j].type == "documento") {
                recursodocumentos.push(prerecurs[i]);
              }
              if (recursos[j].type == "link") {
                recursolinks.push(prerecurs[i]);
              }
            }
          }
        }
        this.setState({ recursoimages: recursoimages, recursodocumentos: recursodocumentos, recursolinks: recursolinks });

      })
      .catch(e => {
        console.log(e);
      });

    QuizPreDataService.getAll()
      .then(response => {
        this.setState({
          quizpres: response.data
        });
        console.log(response.data);

        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].quizid == this.props.match.params.id) {
            quizs.push(response.data[i]);
          }
        }
        this.setState({ quizs: quizs });

        console.log(quizs);
        for (var i = 0; i < quizs.length; i++) {
          PreguntaDataService.get(quizs[i].preguntaid)
            .then(response => {
              this.setState({
              });
              console.log(response.data);
              preguntas.push(response.data);
            })
            .catch(e => {
              console.log(e);
            });
        }
        this.setState({ preguntas: preguntas });

      })
      .catch(e => {
        console.log(e);
      });
  }

  setActivePregunta(pregunta, index) {
    this.openModal();
    this.setState({
      pregunta: pregunta,
      currentIndex: index
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
              preguntaid: this.state.pregunta.id,
              quizid: this.props.match.params.id
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
              preguntaid: this.state.pregunta.id,
              quizid: this.props.match.params.id
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
            preguntaid: this.state.pregunta.id,
            quizid: this.props.match.params.id
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
          preguntaid: this.state.pregunta.id,
          quizid: this.props.match.params.id
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
        preguntaid: this.state.pregunta.id,
        quizid: this.props.match.params.id
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
                  usuarioid: this.state.usuario.id,
                  preguntaid: this.state.pregunta.id,
                  quizid: this.props.match.params.id
                });
                console.log(response.data);
              })
              .catch(e => {
                console.log(e);
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
                  usuarioid: this.state.usuario.id,
                  preguntaid: this.state.pregunta.id,
                  quizid: this.props.match.params.id
                });
                console.log(response.data);
              })
              .catch(e => {
                console.log(e);
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
                usuarioid: this.state.usuario.id,
                preguntaid: this.state.pregunta.id,
                quizid: this.props.match.params.id
              });
              console.log(response.data);
            })
            .catch(e => {
              console.log(e);
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
              usuarioid: this.state.usuario.id,
              preguntaid: this.state.pregunta.id,
              quizid: this.props.match.params.id
            });
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
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
            usuarioid: this.state.usuario.id,
            preguntaid: this.state.pregunta.id,
            quizid: this.props.match.params.id
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
    this.closeModal();
  }

  saveUsuQuiz() {
    var puntajeTotal = 0;
    var respuestausers = [];
    RespuestaDataService.getAll()
      .then(response => {
        this.setState({
          respuestas: response.data
        });
        console.log(response.data);
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].quizid == this.props.match.params.id) {
            if (response.data[i].usuarioid == this.state.usuario.id) {
              puntajeTotal = parseInt(puntajeTotal, 10) + parseInt(response.data[i].puntaje, 10)
              respuestausers.push(response.data[i])
            }
          }
        }
        this.setState({ respuestausers: respuestausers });

        var data = {
          usuarioid: this.state.usuario.id,
          quizid: this.props.match.params.id,
          puntajetotal: puntajeTotal,
        };

        UsuQuizDataService.create(data)
          .then(response => {
            this.setState({
              id: response.data.id,
              usuarioid: this.state.usuario.id,
              quizid: this.props.match.params.id,
              puntajetotal: puntajeTotal
            });
            console.log(response.data);
            this.setState({ resultado: puntajeTotal });

          })
          .catch(e => {
            console.log(e);
          });
      })
      .catch(e => {
        console.log(e);
      });

    this.openModalResultado();
  }

  render() {
    const { preguntas, currentIndex, pregunta, recursoimages, recursodocumentos, recursolinks, respuestausers } = this.state;

    return (
      <div>
        <div className="col-md-6">
          <h1 id='title'>Lista de Preguntas</h1>
          <ul className="list-group">
            {preguntas &&
              preguntas.map((pregunta, index) => (
                <li className={"list-group-item " + (index === currentIndex ? "active" : "")} onClick={() => this.setActivePregunta(pregunta, index)} key={index}
                >
                  <div>
                    {pregunta.titulo}
                  </div>

                  <div>
                    {pregunta.tipo}
                  </div>

                  <div>
                    {pregunta.puntaje}
                  </div>
                </li>
              ))}
          </ul>
        </div>

        <div>
          <br></br>
          <button onClick={this.saveUsuQuiz} className="btn btn-success">
            Terminar Intento
          </button>
        </div>

        <section>
          <Modal visible={this.state.visible} width="1000" height="500" effect="fadeInUp" onClickAway={() => this.closeModal()}>
            <div>
              <div className="submit-form">
                <div className="col-md-6">
                  {pregunta && (
                    <div>
                      <div>
                        <label>
                          <strong>Enunciado:</strong>
                        </label>{" "}
                        {pregunta.enunciado}
                        <br></br>
                      </div>

                      <div>
                        {recursoimages &&
                          recursoimages.map((recursoimage) => (
                            <div>
                              {recursoimage.preguntaid == pregunta.id && (
                                <img src={"http://localhost:8080/api/recursos/resource/" + recursoimage.recursoid} width="200" height="90"></img>
                              )}
                            </div>
                          ))}

                        {recursodocumentos &&
                          recursodocumentos.map((recursodocumento) => (
                            <div>
                              {recursodocumento.preguntaid == pregunta.id && (
                                <a href={"http://localhost:8080/api/recursos/resource/" + recursodocumento.recursoid}>Documento</a>
                              )}
                            </div>
                          ))}

                        {recursolinks &&
                          recursolinks.map((recursolink) => (
                            <div>
                              {recursolink.preguntaid == pregunta.id && (
                                <iframe src={"https://www.youtube.com/embed/" + recursolink.link + "?autoplay=1&loop=1"} width="250" height="140"></iframe>
                              )}
                            </div>
                          ))}
                      </div>

                      <div>
                        <br></br>
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
                            name="respuesta4"
                          />
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

                        <button onClick={this.saveRespuesta} className="btn btn-success">
                          Submit
                    </button>

                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Modal>
        </section>

        <section>
          <Modal visible={this.state.visible2} width="1000" height="500" effect="fadeInUp" onClickAway={() => this.closeModalResultado()}>
            <div>
              <div>
                <h4>Mi resultado</h4>
                <div>
                  <h3>{this.state.resultado} Puntos!!!</h3>
                </div>
                <div>
                  {respuestausers &&
                    respuestausers.map((respuesta) => (
                      <div>
                        {respuesta.puntaje == "0" ? (
                          <li className="list-group-item">
                            {respuesta.preguntaid}:
                            <img src={"https://images.emojiterra.com/twitter/512px/274c.png"} width="25" height="25"></img>
                          </li>
                        ) : (
                            <li className="list-group-item">
                              {respuesta.preguntaid}:
                              <img src={"https://cdn.pixabay.com/photo/2012/04/24/13/49/tick-40143_640.png"} width="25" height="25"></img>
                            </li>
                          )}
                      </div>
                    ))}
                </div>
                <br></br>
                <a href="/" className="btn btn-success">
                  Regresar
                </a>
              </div>
            </div>
          </Modal>
        </section>

      </div>
    );
  }
}