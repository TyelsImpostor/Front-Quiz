import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";

import AuthService from "../services/auth.service";

export default class Inicio extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
      });
    }
  }

  render() {
    const { currentUser } = this.state;

    return (
      <div className="container">
        <header className="jumbotron">
          {currentUser ? (
            <h3 class="text-muted">El contenido de esta sección estará disponible para todos los usuarios sin importar su rol.</h3>
          ) : (
              <div>
                <h3 class="text-muted">Debes iniciar sesión</h3>
                <Link to={"/login"}>
                  Inicia Sesión
                </Link>
              </div>
            )}
        </header>
      </div>
    );
  }
}