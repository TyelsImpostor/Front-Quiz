import React, { Component } from "react";
import CarreraDataService from "../../services/carrera.service";
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";

export default class CarrerasList extends Component {
  constructor(props) {
    super(props);
    this.searchMalla2 = this.searchMalla2.bind(this);
    this.retrieveCarreras2 = this.retrieveCarreras2.bind(this);
    this.refreshList2 = this.refreshList2.bind(this);
    this.setActiveCarrera2 = this.setActiveCarrera2.bind(this);

    this.state = {
      carreras2: [],
      currentCarrera2: null,
      currentIndex2: -1,
      searchMalla2: "",
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
      query2: ''
    };
  }

  componentDidMount() {
    this.retrieveCarreras2();
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

  retrieveCarreras2() {
    CarreraDataService.getAll()
      .then(response => {
        this.setState({
          carreras2: response.data
        });
        //console.log(response.data);
      })
      .catch(e => {
        //console.log(e);
      });
  }

  refreshList2() {
    this.retrieveCarreras2();
    this.setState({
      currentCarrera2: null,
      currentIndex2: -1
    });
  }

  setActiveCarrera2(carrera, index) {
    this.setState({
      currentCarrera2: carrera,
      currentIndex2: index
    });
  }

  async searchMalla2(e) {
    const searchMalla2 = await e.target.value;
    //console.log(searchMalla2)
    this.setState({
      searchMalla2: searchMalla2
    });
    await CarreraDataService.findByMalla(this.state.searchMalla2)
      .then(response => {
        this.setState({
          carreras2: response.data
        });
        //console.log(response.data);
      })
      .catch(e => {
        //console.log(e);
      });
  }

  render() {
    const { searchMalla2, carreras2, currentCarrera2, currentIndex2, currentUser, showUserBoard, showModeratorBoard, showTeacherBoard, query2 } = this.state;

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
          {(showTeacherBoard || showModeratorBoard) && (
            <div className="list row">
              <div className="col-md-8">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by malla"
                    value={this.props.query2}
                    onChange={this.searchMalla2}
                  />
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
                  {carreras2 &&
                    carreras2.map((carrera, index) => (
                      <li
                        className={
                          "list-group-item " +
                          (index === currentIndex2 ? "active" : "")
                        }
                        onClick={() => this.setActiveCarrera2(carrera, index)}
                        key={index}
                      >
                        {carrera.malla}
                      </li>
                    ))}
                </ul>

              </div>
              <div className="col-md-6">
                {currentCarrera2 ? (
                  <div>
                    <h4>Carrera</h4>
                    <div>
                      <label>
                        <strong>Malla:</strong>
                      </label>{" "}
                      {currentCarrera2.malla}
                    </div>
                    <Link
                      to={"/carrera/" + currentCarrera2.id}
                      className="badge badge-warning"
                    >
                      Editar
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
          )}

          {showUserBoard && (
            <h3>Usted no tiene el permiso para acceder a esta zona.</h3>
          )}
        </header>
      </div>
    );
  }
}