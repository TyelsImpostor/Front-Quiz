import React, { Component } from "react";
import CarreraDataService from "../../services/carrera.service";
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";

export default class AddCarrera extends Component {
  constructor(props) {
    super(props);
    this.onChangeMalla = this.onChangeMalla.bind(this);
    this.saveCarrera = this.saveCarrera.bind(this);
    this.newCarrera = this.newCarrera.bind(this);

    this.state = {
      id: null,
      malla: "",
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,

      submitted: false
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

  onChangeMalla(e) {
    this.setState({
      malla: e.target.value
    });
  }

  saveCarrera() {
    var data = {
      malla: this.state.malla
    };

    CarreraDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          malla: response.data.malla,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newCarrera() {
    this.setState({
      id: null,
      malla: "",

      submitted: false
    });
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
          {showTeacherBoard || (showModeratorBoard && (
            <div className="submit-form">
              {this.state.submitted ? (
                <div>
                  <h4>You submitted successfully!</h4>
                  <button className="btn btn-success" onClick={this.newCarrera}>
                    Add
                </button>
                </div>
              ) : (
                  <div>
                    <div className="form-group">
                      <label htmlFor="malla">Malla</label>
                      <input
                        type="text"
                        className="form-control"
                        id="malla"
                        required
                        value={this.state.malla}
                        onChange={this.onChangeMalla}
                        name="malla"
                      />
                    </div>

                    <button onClick={this.saveCarrera} className="btn btn-success">
                      Submit
                    </button>

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