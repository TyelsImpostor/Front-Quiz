import React, { Component } from "react";
import CarreraDataService from "../../services/carrera.service";
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";

export default class Carrera extends Component {
  constructor(props) {
    super(props);
    this.onChangeMalla = this.onChangeMalla.bind(this);
    this.getCarrera = this.getCarrera.bind(this);
    this.updateCarrera = this.updateCarrera.bind(this);
    this.deleteCarrera = this.deleteCarrera.bind(this);

    this.state = {
      currentCarrera: {
        id: null,
        malla: ""

      },
      message: "",
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    this.getCarrera(this.props.match.params.id);
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

  onChangeMalla(e) {
    const malla = e.target.value;

    this.setState(function (prevState) {
      return {
        currentCarrera: {
          ...prevState.currentCarrera,
          malla: malla
        }
      };
    });
  }

  getCarrera(id) {
    CarreraDataService.get(id)
      .then(response => {
        this.setState({
          currentCarrera: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateCarrera() {
    CarreraDataService.update(
      this.state.currentCarrera.id,
      this.state.currentCarrera
    )
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "The carrera was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteCarrera() {
    CarreraDataService.delete(this.state.currentCarrera.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/carreras')
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { currentCarrera, currentUser, showUserBoard, showModeratorBoard, showTeacherBoard } = this.state;

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
            <div>
              {currentCarrera ? (
                <div className="edit-form">
                  <h4>Carrera</h4>
                  <form>
                    <div className="form-group">
                      <label htmlFor="malla">Malla</label>
                      <input
                        type="text"
                        className="form-control"
                        id="malla"
                        value={currentCarrera.malla}
                        onChange={this.onChangeMalla}
                      />
                    </div>
                  </form>

                  <button
                    className="badge badge-danger mr-2"
                    onClick={this.deleteCarrera}
                  >
                    Delete
                </button>

                  <button
                    type="submit"
                    className="badge badge-success"
                    onClick={this.updateCarrera}
                  >
                    Update
                </button>
                  <p>{this.state.message}</p>
                </div>
              ) : (
                  <div>
                    <br />
                    <p>Please click on a Carrera...</p>
                  </div>
                )}
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