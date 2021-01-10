import React, { Component } from "react";
import RecursoDataService from "../../services/recurso.service";
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";

export default class RecursosList extends Component {
  constructor(props) {
    super(props);
    this.retrieveRecursos = this.retrieveRecursos.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveRecurso = this.setActiveRecurso.bind(this);

    this.state = {
      recursos: [],
      currentRecurso: null,
      currentIndex: -1,
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined
    };
  }

  componentDidMount() {
    this.retrieveRecursos();
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

  refreshList() {
    this.retrieveRecursos();
    this.setState({
      currentRecurso: null,
      currentIndex: -1
    });
  }

  setActiveRecurso(recurso, index) {
    this.setState({
      currentRecurso: recurso,
      currentIndex: index
    });
  }

  render() {
    const { recursos, currentRecurso, currentIndex, currentUser, showUserBoard, showModeratorBoard, showTeacherBoard } = this.state;

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
                <h4>Recurso List</h4>

                <ul className="list-group">
                  {recursos &&
                    recursos.map((recurso, index) => (
                      <li
                        className={
                          "list-group-item " +
                          (index === currentIndex ? "active" : "")
                        }
                        onClick={() => this.setActiveRecurso(recurso, index)}
                        key={index}
                      >
                        {recurso.title}
                      </li>
                    ))}
                </ul>
              </div>
              <div className="col-md-6">
                {currentRecurso ? (
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
                  </div>
                ) : (
                    <div>
                      <br />
                      <p>Please click on a Recurso...</p>
                    </div>
                  )}
              </div>
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