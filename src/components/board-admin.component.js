import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";

import AuthService from "../services/auth.service";

export default class BoardAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showUserBoard: false,
      showModeratorBoard: false,
      showAdminBoard: false,
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
        showAdminBoard: user.roles.includes("admin"),
      });
    }
  }

  render() {
    const { currentUser, showUserBoard, showModeratorBoard, showAdminBoard } = this.state;

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
          {showAdminBoard && (
            <h3 class="text-muted">El contenido de esta sección solo estará disponible para aquellos usuarios con el rol de profesor.</h3>
          )}

          {showModeratorBoard && (
            <h3 class="text-muted">El contenido de esta sección solo estará disponible para aquellos usuarios con el rol de profesor.</h3>
          )}

          {showUserBoard && (
            <h3>Usted no tiene el permiso para acceder a esta zona.</h3>
          )}
        </header>
      </div>
    );
  }
}