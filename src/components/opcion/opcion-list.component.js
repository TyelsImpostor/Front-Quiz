import React, { Component } from "react";
import OpcionDataService from "../../services/opcion.service";
import PreguntaDataService from "../../services/pregunta.service";
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";

export default class OpcionsList extends Component {
  constructor(props) {
    super(props);
    this.retrieveOpcions = this.retrieveOpcions.bind(this);
    this.refreshList = this.refreshList.bind(this);

    this.state = {
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
      opciones: [],
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    this.retrieveOpcions();
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

  retrieveOpcions() {
    OpcionDataService.getAll()
      .then(response => {
        this.setState({
          opciones: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveOpcions();
    this.setState({
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

  render() {
    const { opciones, currentPregunta, currentUser, showUserBoard, showModeratorBoard, showTeacherBoard } = this.state;

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
                </div>
              </div>

              <div className="col-md-6">
                <h4>Opcions List</h4>

                <Link
                  to={"/pregunta/opcion/add/" + currentPregunta.id}
                  className="badge badge-blue"
                >
                  Agregar
              </Link>

                <ul className="list-group">
                  {opciones &&
                    opciones.map((opcione) => (
                      <div>
                        {opcione.pregunta == currentPregunta.id ? (
                          <li className="list-group-item">
                            {opcione.opcion}
                          </li>
                        ) : (
                            <h5></h5>
                          )}

                      </div>
                    ))}
                </ul>

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