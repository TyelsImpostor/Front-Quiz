import React, { Component } from "react";
import CursoDataService from "../../services/curso.service";
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";

export default class AddCurso extends Component {
  constructor(props) {
    super(props);
    this.onChangeCodigo = this.onChangeCodigo.bind(this);
    this.onChangeSemestre = this.onChangeSemestre.bind(this);
    this.onChangeAño = this.onChangeAño.bind(this);
    this.onChangeDescripcion = this.onChangeDescripcion.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeActivo = this.onChangeActivo.bind(this);
    this.onChangeRamoid = this.onChangeRamoid.bind(this);
    this.saveCurso = this.saveCurso.bind(this);
    this.newCurso = this.newCurso.bind(this);

    this.state = {
      id: null,
      codigo: "",
      semestre: "",
      año: "",
      descripcion: "",
      password: "",
      activo: "",
      ramoid: "",
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

  onChangeCodigo(e) {
    this.setState({
      codigo: e.target.value
    });
  }

  onChangeSemestre(e) {
    this.setState({
      semestre: e.target.value
    });
  }

  onChangeAño(e) {
    this.setState({
      año: e.target.value
    });
  }

  onChangeDescripcion(e) {
    this.setState({
      descripcion: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  onChangeActivo(e) {
    this.setState({
      activo: e.target.value
    });
  }

  onChangeRamoid(e) {
    this.setState({
      ramoid: e.target.value
    });
  }

  saveCurso() {
    var data = {
      codigo: this.state.codigo,
      semestre: this.state.semestre,
      año: this.state.año,
      descripcion: this.state.descripcion,
      password: this.state.password,
      activo: this.state.activo,
      ramoid: this.props.match.params.id
    };

    CursoDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          codigo: response.data.codigo,
          semestre: response.data.semestre,
          año: response.data.año,
          descripcion: response.data.descripcion,
          password: response.data.password,
          activo: response.data.activo,
          ramoid: this.props.match.params.id,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newCurso() {
    this.setState({
      id: null,
      codigo: "",
      semestre: "",
      año: "",
      descripcion: "",
      password: "",
      activo: "",
      ramoid: "",

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
                  <button className="btn btn-success" onClick={this.newCurso}>
                    Add
                </button>
                </div>
              ) : (
                  <div>
                    <div className="form-group">
                      <label htmlFor="codigo">Codigo</label>
                      <input
                        type="text"
                        className="form-control"
                        id="codigo"
                        required
                        value={this.state.codigo}
                        onChange={this.onChangeCodigo}
                        name="codigo"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="semestre">Semestre</label>
                      <input
                        type="text"
                        className="form-control"
                        id="semestre"
                        required
                        value={this.state.semestre}
                        onChange={this.onChangeSemestre}
                        name="semestre"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="año">Año</label>
                      <input
                        type="text"
                        className="form-control"
                        id="año"
                        required
                        value={this.state.año}
                        onChange={this.onChangeAño}
                        name="año"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="descripcion">Descripcion</label>
                      <input
                        type="text"
                        className="form-control"
                        id="descripcion"
                        required
                        value={this.state.descripcion}
                        onChange={this.onChangeDescripcion}
                        name="descripcion"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input
                        type="text"
                        className="form-control"
                        id="password"
                        required
                        value={this.state.password}
                        onChange={this.onChangePassword}
                        name="password"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="activo">Activo:</label>
                      <select
                        type="text"
                        className="form-control"
                        id="activo"
                        required
                        onChange={this.onChangeActivo}
                        name="activo"
                        defaultValue="...">
                        <option disabled>...</option>
                        <option value="true">activo</option>
                        <option value="false">desactivado</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="ramoid">ID del Ramo</label>
                      <input
                        type="text"
                        className="form-control"
                        id="ramoid"
                        required
                        value={this.props.match.params.id}
                        onChange={this.onChangeRamoid}
                        name="ramoid"
                      />
                    </div>

                    <button onClick={this.saveCurso} className="btn btn-success">
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