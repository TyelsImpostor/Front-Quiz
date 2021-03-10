import React, { Component } from 'react';
import { Link } from "react-router-dom";
import RetroDataService from "../../services/retroalimentacion.service";

import AuthService from "../../services/auth.service";

class AddRecurso extends Component {
  constructor(props) {
    super(props);

    this.state = {
      retroalimentacions: [],
      currentRetro: null,
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    this.retrieveRetros();
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

  retrieveRetros() {
    RetroDataService.getAll()
      .then(response => {
        this.setState({
          retroalimentacions: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  setActivePregunta(retro, index) {
    this.setState({
      currentRetro: retro,
      currentIndex: index
    });
  }

  render() {
    const { currentUser, showUserBoard, showModeratorBoard, showTeacherBoard, retroalimentacions, currentIndex, currentRetro } = this.state;

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
          {showModeratorBoard && (
            <div className="list row">
              <html>
                <body>
                  <h4>Añadir una Retroalimentacion</h4>
                  <form method="POST" action="http://localhost:8080/api/retroalimentacions/add" enctype="multipart/form-data">
                    Tipo:
                  <select name="tipo" id="tipo">
                      <option value="imagen">Imagen</option>
                      <option value="documento">Enunciado</option>
                    </select>
                  Enunciado:
                  <input type="text" name="enunciado" />
                  ID Pregunta:
                  <input type="text" name="preguntaid" value={this.props.match.params.id} />
                  Resource:
                  <input type="file" name="resource" multiple />
                    <input href="/" type="submit" value="Upload" onClick={() => window.location.reload()}/>
                  </form>
                </body>
              </html>

              <div className="col-md-6">
                <h4>Retroalimentacion List</h4>

                <ul className="list-group">
                  {retroalimentacions &&
                    retroalimentacions.map((retroalimentacion, index) => (
                      <li
                        className={
                          "list-group-item " +
                          (index === currentIndex ? "active" : "")
                        }
                        onClick={() => this.setActivePregunta(retroalimentacion, index)}
                        key={index}
                      >
                        {retroalimentacion.tipo}
                      </li>
                    ))}
                </ul>
              </div>

              <div className="col-md-6">
                {currentRetro ? (
                  <div>
                    <h4>Retroalimentacion</h4>
                    <div>
                      <label>
                        <strong>Tipo:</strong>
                      </label>{" "}
                      {currentRetro.tipo}
                    </div>
                    <div>
                      <label>
                        <strong>Enunciado:</strong>
                      </label>{" "}
                      {currentRetro.enunciado}
                    </div>
                    {currentRetro.tipo == "imagen" && (
                      <div>
                        <label>
                          <strong>Recurso:</strong>
                        </label>{" "}
                        <img src={"http://localhost:8080/api/retroalimentacions/resource/" + currentRetro.id} width="250" height="140"></img>
                      </div>
                    )}
                  </div>
                ) : (
                    <div>
                      <br />
                      <p>Please click on a Retroalimentacion...</p>
                    </div>
                  )}
              </div>
            </div>

          )}

          {showTeacherBoard || (showUserBoard && (
            <h3>Usted no tiene el permiso para acceder a esta zona.</h3>
          ))}
        </header>
      </div>
    );
  }
}

export default AddRecurso;