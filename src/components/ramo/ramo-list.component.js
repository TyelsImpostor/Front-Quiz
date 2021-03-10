import React, { Component } from "react";
import RamoDataService from "../../services/ramo.service";
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";

export default class RamosList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchTitulo = this.onChangeSearchTitulo.bind(this);
    this.retrieveRamos = this.retrieveRamos.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveRamo = this.setActiveRamo.bind(this);
    this.searchTitulo = this.searchTitulo.bind(this);

    this.state = {
      ramos: [],
      currentRamo: null,
      currentIndex: -1,
      searchTitulo: "",
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    this.retrieveRamos();
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

  retrieveRamos() {
    RamoDataService.getAll()
      .then(response => {
        this.setState({
          ramos: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveRamos();
    this.setState({
      currentRamo: null,
      currentIndex: -1
    });
  }

  setActiveRamo(ramo, index) {
    this.setState({
      currentRamo: ramo,
      currentIndex: index
    });
  }

  searchTitulo() {
    RamoDataService.findByTitulo(this.state.searchTitulo)
      .then(response => {
        this.setState({
          ramos: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { searchTitulo, ramos, currentRamo, currentIndex, currentUser, showUserBoard, showModeratorBoard, showTeacherBoard } = this.state;

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
              <div className="col-md-8">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by nombre"
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
                <h4>Ramos List</h4>

                <Link
                  to="/ramo/add"
                  className="badge badge-blue"
                >
                  Agregar
              </Link>

                <ul className="list-group">
                  {ramos &&
                    ramos.map((ramo, index) => (
                      <li
                        className={
                          "list-group-item " +
                          (index === currentIndex ? "active" : "")
                        }
                        onClick={() => this.setActiveRamo(ramo, index)}
                        key={index}
                      >
                        {ramo.nombre}
                      </li>
                    ))}
                </ul>

              </div>
              <div className="col-md-6">
                {currentRamo ? (
                  <div>
                    <h4>Ramo</h4>
                    <div>
                      <label>
                        <strong>Nombre:</strong>
                      </label>{" "}
                      {currentRamo.nombre}
                    </div>
                    <div>
                      <label>
                        <strong>Codigo:</strong>
                      </label>{" "}
                      {currentRamo.codigo}
                    </div>
                    <div>
                      <label>
                        <strong>Descripcion:</strong>
                      </label>{" "}
                      {currentRamo.descripcion}
                    </div>
                    <Link
                      to={"/ramo/" + currentRamo.id}
                      className="badge badge-warning"
                    >
                      Edit
                  </Link>
                  <Link
                      to={"/curso/add/" + currentRamo.id}
                    >
                      Iniciar Curso
                  </Link>
                  </div>
                ) : (
                    <div>
                      <br />
                      <p>Please click on a Ramo...</p>
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