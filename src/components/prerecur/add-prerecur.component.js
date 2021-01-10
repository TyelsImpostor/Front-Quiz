import React, { Component } from "react";
import RecursoDataService from "../../services/recurso.service";
import PreguntaDataService from "../../services/pregunta.service";
import PreRecurDataService from "../../services/prerecur.service";
import Modal from 'react-awesome-modal';
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";

export default class AddPreRecu extends Component {
  constructor(props) {
    super(props);
    this.retrieveRecursos = this.retrieveRecursos.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveRecurso = this.setActiveRecurso.bind(this);

    this.state = {
      recursos: [],
      prerecurs: [],
      currentRecurso: {
        id: null,
        title: "",
        type: "",
        resource: ""
      },
      currentPregunta: {
        id: null,
        titulo: "",
        tipo: "",
        enunciado: "",
        tiemporespuesta: "",
        puntaje: "",
        random: false,
        users: ""
      },
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
    };
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

  componentDidMount() {
    this.retrieveRecursos();
    this.retrievePreRecurs();
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

  retrieveRecursos() {
    RecursoDataService.getAll()
      .then(response => {
        this.setState({
          recursos: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  retrievePreRecurs() {
    PreRecurDataService.getAll()
      .then(response => {
        this.setState({
          prerecurs: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
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

  refreshList() {
    this.retrieveRecursos();
    this.retrievePreRecurs();
    this.setState({
      currentRecurso: null
    });
  }

  setActiveRecurso(recurso) {
    this.setState({
      currentRecurso: recurso
    });
    this.openModal();
  }

  savePreRecur(recurso, pregunta) {
    var data = {
      preguntaid: pregunta,
      recursoid: recurso
    };

    PreRecurDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          preguntaid: response.data.pregunta,
          recursoid: response.data.recurso
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { recursos, currentRecurso, currentPregunta, prerecurs, currentUser, showUserBoard, showModeratorBoard, showTeacherBoard } = this.state;

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
            <div className="list row">
              <div className="col-md-6">
                <div>
                  <h4>Pregunta</h4>
                  <div>
                    <label>
                      <strong>Id:</strong>
                    </label>{" "}
                    {currentPregunta.id}
                  </div>
                </div>
              </div>

              <h5></h5>

              <div className="col-md-6">
                <h4>Recurso List</h4>

                <ul className="list-group">
                  {recursos &&
                    recursos.map((recurso) => (
                      <li
                        className="list-group-item " onClick={() => this.setActiveRecurso(recurso)}>
                        {recurso.title}
                      </li>
                    ))}
                </ul>
              </div>

              <div className="col-md-6">
                <h4>Recursos Seleccionado</h4>

                <ul className="list-group">
                  {prerecurs &&
                    prerecurs.map((prerecur) => (
                      <div>
                        {prerecur.preguntaid == currentPregunta.id ? (
                          <li className="list-group-item">
                            {prerecur.recursoid}
                          </li>
                        ) : (
                            <h5></h5>
                          )}

                      </div>
                    ))}
                </ul>
              </div>

              <section>
                <Modal visible={this.state.visible} width="1000" height="500" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                  <div>
                    <h4>Recurso</h4>
                    <div>
                      <label>
                        <strong>ID:</strong>
                      </label>{" "}
                      {currentRecurso.id}
                    </div>
                    <div>
                      <label>
                        <strong>Titulo:</strong>
                      </label>{" "}
                      {currentRecurso.title}
                    </div>
                    <div>
                      <label>
                        <strong>Type:</strong>
                      </label>{" "}
                      {currentRecurso.type}
                    </div>
                    <div>
                      <label>
                        <strong>Recurso:</strong>
                      </label>{" "}
                      {currentRecurso.type == "imagen" && (
                        <img src={"http://localhost:8080/api/recursos/" + currentRecurso.id} width="250" height="140"></img>
                      )}
                      {currentRecurso.type == "documento" && (
                        <a href={"http://localhost:8080/api/recursos/" + currentRecurso.id}>{currentRecurso.title}</a>
                      )}
                      {currentRecurso.type == "link" && (
                         <iframe src={"https://www.youtube.com/embed/" + currentRecurso.link + "?autoplay=1"} width="250" height="140"></iframe>
                      )}
                    </div>
                    <button className="btn btn-warning" onClick={() => this.closeModal()}>
                      Close
                  </button>
                    <button className="btn btn-success" onClick={() => this.savePreRecur(currentRecurso.id, currentPregunta.id)}>
                      Agregar
                  </button>
                  </div>
                </Modal>
              </section>
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