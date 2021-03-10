import React, { Component } from "react";
import PreguntaDataService from "../../services/pregunta.service";
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";

export default class PreguntasList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchTitulo = this.onChangeSearchTitulo.bind(this);
    this.retrievePreguntas = this.retrievePreguntas.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActivePregunta = this.setActivePregunta.bind(this);
    this.searchTitulo = this.searchTitulo.bind(this);

    this.state = {
      preguntas: [],
      currentPregunta: null,
      currentIndex: -1,
      searchTitulo: "",
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    this.retrievePreguntas();
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

  onChangeSearchTitulo(e) {
    const searchTitulo = e.target.value;

    this.setState({
      searchTitulo: searchTitulo
    });
  }

  retrievePreguntas() {
    PreguntaDataService.getAll()
      .then(response => {
        this.setState({
          preguntas: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrievePreguntas();
    this.setState({
      currentPregunta: null,
      currentIndex: -1
    });
  }

  setActivePregunta(pregunta, index) {
    this.setState({
      currentPregunta: pregunta,
      currentIndex: index
    });
  }

  searchTitulo() {
    PreguntaDataService.findByTitulo(this.state.searchTitulo)
      .then(response => {
        this.setState({
          preguntas: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { searchTitulo, preguntas, currentPregunta, currentIndex, currentUser, showUserBoard, showModeratorBoard, showTeacherBoard } = this.state;

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
          {showUserBoard && (
            <div className="list row">
              <div className="col-md-8">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by titulo"
                    value={searchTitulo}
                    onChange={this.onChangeSearchTitulo}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={this.searchTitulo}
                    >
                      Search
                  </button>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <h4>Preguntas List</h4>

                <ul className="list-group">
                  {preguntas &&
                    preguntas.map((pregunta, index) => (
                      <li
                        className={
                          "list-group-item " +
                          (index === currentIndex ? "active" : "")
                        }
                        onClick={() => this.setActivePregunta(pregunta, index)}
                        key={index}
                      >
                        {pregunta.titulo}
                      </li>
                    ))}
                </ul>

              </div>
              <div className="col-md-6">
                {currentPregunta ? (
                  <div>
                    <h4>Pregunta</h4>
                    <div>
                      <label>
                        <strong>Titulo:</strong>
                      </label>{" "}
                      {currentPregunta.titulo}
                    </div>
                    <div>
                      <label>
                        <strong>Tipo:</strong>
                      </label>{" "}
                      {currentPregunta.tipo}
                    </div>
                    <div>
                      <label>
                        <strong>Enunciado:</strong>
                      </label>{" "}
                      {currentPregunta.enunciado}
                    </div>
                    <div>
                      <label>
                        <strong>Puntaje:</strong>
                      </label>{" "}
                      {currentPregunta.puntaje}
                    </div>
                    <div>
                      <label>
                        <strong>Pregunta Random:</strong>
                      </label>{" "}
                      {currentPregunta.random ? "Activo" : "Desactivado"}
                    </div>

                    <Link
                      to={"/respuesta/" + currentPregunta.id}
                      className="badge badge-warning"
                    >
                      Responder
                  </Link>
                  </div>
                ) : (
                    <div>
                      <br />
                      <p>Please click on a Pregunta...</p>
                    </div>
                  )}
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