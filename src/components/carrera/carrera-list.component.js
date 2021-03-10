import React, { Component } from "react";
import CarreraDataService from "../../services/carrera.service";
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";

export default class CarrerasList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchTitulo = this.onChangeSearchTitulo.bind(this);
    this.retrieveCarreras = this.retrieveCarreras.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveCarrera = this.setActiveCarrera.bind(this);
    this.searchTitulo = this.searchTitulo.bind(this);

    this.state = {
      carreras: [],
      currentCarrera: null,
      currentIndex: -1,
      searchTitulo: "",
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    this.retrieveCarreras();
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

  retrieveCarreras() {
    CarreraDataService.getAll()
      .then(response => {
        this.setState({
          carreras: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveCarreras();
    this.setState({
      currentCarrera: null,
      currentIndex: -1
    });
  }

  setActiveCarrera(carrera, index) {
    this.setState({
      currentCarrera: carrera,
      currentIndex: index
    });
  }

  searchTitulo() {
    CarreraDataService.findByTitulo(this.state.searchTitulo)
      .then(response => {
        this.setState({
          carreras: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { searchTitulo, carreras, currentCarrera, currentIndex, currentUser, showUserBoard, showModeratorBoard, showTeacherBoard } = this.state;

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
                    placeholder="Search by malla"
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
                <h4>Carreras List</h4>

                <Link
                  to="/carrera/add"
                  className="badge badge-blue"
                >
                  Agregar
              </Link>

                <ul className="list-group">
                  {carreras &&
                    carreras.map((carrera, index) => (
                      <li
                        className={
                          "list-group-item " +
                          (index === currentIndex ? "active" : "")
                        }
                        onClick={() => this.setActiveCarrera(carrera, index)}
                        key={index}
                      >
                        {carrera.malla}
                      </li>
                    ))}
                </ul>

              </div>
              <div className="col-md-6">
                {currentCarrera ? (
                  <div>
                    <h4>Carrera</h4>
                    <div>
                      <label>
                        <strong>Malla:</strong>
                      </label>{" "}
                      {currentCarrera.malla}
                    </div>
                    <Link
                      to={"/carrera/" + currentCarrera.id}
                      className="badge badge-warning"
                    >
                      Edit
                  </Link>
                  </div>
                ) : (
                    <div>
                      <br />
                      <p>Please click on a Carrera...</p>
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