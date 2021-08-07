import React, { Component } from 'react';
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";

class AddRecurso extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
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

  render() {
    const { currentUser, showUserBoard, showModeratorBoard, showTeacherBoard } = this.state;

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
            <html>
              <body>
                <h1>Upload new Recurso</h1>
                <Link
                  to={"/file/list"}
                  class="btn btn-link"
                >
                  File List
                        </Link>
                <form method="POST" action="https://spring-boot-back.herokuapp.com/api/recursos/add" enctype="multipart/form-data">
                  Title:
                  <input type="text" name="title" />
                  Type:
                  <select name="type" id="type">
                    <option value="imagen">Imagen</option>
                    <option value="documento">Documento</option>
                    <option value="link">Video Link</option>
                  </select>
                  {/* Resource:
                  <input type="file" name="resource" multiple/> */}
                  Link:
                  <input type="text" name="link" />
                  <input href="/" type="submit" value="Upload" />
                </form>
              </body>
            </html>
          )}

          {(showTeacherBoard || showUserBoard) && (
            <h3>Usted no tiene el permiso para acceder a esta zona.</h3>
          )}
        </header>
      </div>
    );
  }
}

export default AddRecurso;