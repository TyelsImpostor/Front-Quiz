import React, { Component } from "react";
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";

export default class BoardModerator extends Component {
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
            <h3 class="text-muted">El contenido de esta sección solo estará disponible para aquellos usuarios con el rol de profesor.</h3>
          )}

          {showTeacherBoard && (
            <h3>Usted no tiene el permiso para acceder a esta zona.</h3>
          )}

          {showUserBoard && (
            <h3>Usted no tiene el permiso para acceder a esta zona.</h3>
          )}
        </header>
      </div>
    );
  }
}