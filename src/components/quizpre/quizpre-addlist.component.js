import React, { Component } from "react";
import PreguntaDataService from "../../services/pregunta.service";
import QuizDataService from "../../services/quiz.service";
import QuizPreDataService from "../../services/quizpre.service";
import Modal from 'react-awesome-modal';
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";

export default class QuizPreList extends Component {
  constructor(props) {
    super(props);
    this.retrieveOpcions = this.retrieveOpcions.bind(this);
    this.refreshList = this.refreshList.bind(this);

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
      preguntas: [],
      quizpres: [],
      visible: false,
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
    };
  }

  openModal(id) {
    this.setState({
      visible: true
    });
    this.getPregunta(id);
  }

  closeModal() {
    this.setState({
      visible: false
    });
  }

  componentDidMount() {
    this.retrieveOpcions();
    this.retrieveQuizPres()
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

  retrieveOpcions() {
    PreguntaDataService.getAll()
      .then(response => {
        this.setState({
          preguntas: response.data
        });
        //console.log(response.data);
      })
      .catch(e => {
        //console.log(e);
      });
  }

  retrieveQuizPres() {
    QuizPreDataService.getAll()
      .then(response => {
        this.setState({
          quizpres: response.data
        });
        //console.log(response.data);
      })
      .catch(e => {
        //console.log(e);
      });
  }

  refreshList() {
    this.retrieveOpcions();
    this.setState({
    });
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

  getPregunta(id) {
    PreguntaDataService.get(id)
      .then(response => {
        this.setState({
          currentPregunta: response.data
        });
        //console.log(response.data);
      })
      .catch(e => {
        //console.log(e);
      });
  }

  saveQuizPre(quiz, pregunta) {
    var data = {
      quizid: quiz,
      preguntaid: pregunta
    };

    QuizPreDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          quizid: response.data.quiz,
          preguntaid: response.data.pregunta
        });
        //console.log(response.data);
      })
      .catch(e => {
        //console.log(e);
      });
  }

  render() {
    const { preguntas, quizpres, currentQuiz, currentPregunta, currentUser, showUserBoard, showModeratorBoard, showTeacherBoard } = this.state;

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
            <div className="list row">
              <div className="col-md-6">
                <div>
                  <h4>Quiz</h4>
                  <div>
                    <label>
                      <strong>Id:</strong>
                    </label>{" "}
                    {currentQuiz.id}
                  </div>
                  <div>
                    <label>
                      <strong>Titulo:</strong>
                    </label>{" "}
                    {currentQuiz.titulo}
                  </div>
                  <div>
                    <label>
                      <strong>Descripcion:</strong>
                    </label>{" "}
                    {currentQuiz.descripcion}
                  </div>
                  <div>
                    <label>
                      <strong>Tiempo Disponible:</strong>
                    </label>{" "}
                    {currentQuiz.tiempodisponible}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <h4>Preguntas List</h4>

                <Link
                  to={"/pregunta/add"}
                  className="badge badge-blue"
                >
                  Agregar
              </Link>

                <ul className="list-group">
                  {preguntas &&
                    preguntas.map((pregunta) => (
                      <li
                        className="list-group-item" onClick={() => this.openModal(pregunta.id)}>
                        {pregunta.titulo}
                      </li>
                    ))}
                </ul>
              </div>

              <section>
                <Modal visible={this.state.visible} width="1000" height="500" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                  <div>
                    <div>
                      <h4>Detalle</h4>
                      <div>
                        <label>
                          <strong>Id:</strong>
                        </label>{" "}
                        {currentPregunta.id}
                      </div>
                      <div>
                        <label>
                          <strong>Titulo:</strong>
                        </label>{" "}
                        {currentPregunta.titulo}
                      </div>
                      <div>
                        <label>
                          <strong>Enunciado:</strong>
                        </label>{" "}
                        {currentPregunta.enunciado}
                      </div>
                      <div>
                        <label>
                          <strong>Tipo de Pregunta:</strong>
                        </label>{" "}
                        {currentPregunta.tipo}
                      </div>
                    </div>
                    <button className="btn btn-warning" onClick={() => this.closeModal()}>
                      Close
                  </button>
                    <button className="btn btn-success" onClick={() => this.saveQuizPre(currentQuiz.id, currentPregunta.id)}>
                      Agregar
                  </button>
                  </div>
                </Modal>
              </section>

              <div className="col-md-6">
                <h4>Preguntas Añadidas</h4>

                <ul className="list-group">
                  {quizpres &&
                    quizpres.map((quizpre) => (
                      <div>
                        {quizpre.quizid == currentQuiz.id ? (
                          <li className="list-group-item">
                            {quizpre.preguntaid}
                          </li>
                        ) : (
                            <h5></h5>
                          )}

                      </div>
                    ))}
                </ul>
              </div>
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