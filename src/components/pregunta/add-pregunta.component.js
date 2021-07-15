import React, { Component } from "react";
import PreguntaDataService from "../../services/pregunta.service";
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";

export default class AddPregunta extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitulo = this.onChangeTitulo.bind(this);
    this.onChangeTipo = this.onChangeTipo.bind(this);
    this.onChangeEnunciado = this.onChangeEnunciado.bind(this);
    this.onChangeTiempoRespuesta = this.onChangeTiempoRespuesta.bind(this);
    this.onChangePuntaje = this.onChangePuntaje.bind(this);
    this.onChangeRandom = this.onChangeRandom.bind(this);
    this.onChangeUserid = this.onChangeUserid.bind(this);
    this.savePregunta = this.savePregunta.bind(this);
    this.newPregunta = this.newPregunta.bind(this);

    this.state = {
      id: null,
      titulo: "",
      tipo: "",
      enunciado: "",
      tiempoRespuesta: "",
      puntaje: "",
      random: "",
      user: "",
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

  onChangeTitulo(e) {
    this.setState({
      titulo: e.target.value
    });
  }

  onChangeTipo(e) {
    this.setState({
      tipo: e.target.value
    });
  }

  onChangeEnunciado(e) {
    this.setState({
      enunciado: e.target.value
    });
  }

  onChangeTiempoRespuesta(e) {
    this.setState({
      tiempoRespuesta: e.target.value
    });
  }

  onChangePuntaje(e) {
    this.setState({
      puntaje: e.target.value
    });
  }

  onChangeRandom(e) {
    this.setState({
      random: e.target.value
    });
  }

  onChangeUserid(e) {
    this.setState({
      user: e.target.value
    });
  }

  savePregunta() {
    var data = {
      titulo: this.state.titulo,
      tipo: this.state.tipo,
      enunciado: this.state.enunciado,
      tiempoRespuesta: this.state.tiempoRespuesta,
      puntaje: this.state.puntaje,
      random: this.state.random,
      user: this.props.match.params.id
    };

    PreguntaDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          titulo: response.data.titulo,
          tipo: response.data.tipo,
          enunciado: response.data.enunciado,
          tiempoRespuesta: response.data.tiempoRespuesta,
          puntaje: response.data.puntaje,
          random: response.data.random,
          user: this.props.match.params.id,

          submitted: true
        });
        //console.log(response.data);
      })
      .catch(e => {
        //console.log(e);
      });
  }

  newPregunta() {
    this.setState({
      id: null,
      titulo: "",
      tipo: "",
      enunciado: "",
      tiempoRespuesta: "",
      puntaje: "",
      random: "",
      user: "",

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
          { showTeacherBoard|| ( showModeratorBoard&& (
            <div className="submit-form">
              {this.state.submitted ? (
                <div>
                  <h4>You submitted successfully!</h4>
                  <button className="btn btn-success" onClick={this.newPregunta}>
                    Add
                </button>
                </div>
              ) : (
                  <div>
                    <div className="form-group">
                      <label htmlFor="titulo">Titulo</label>
                      <input
                        type="text"
                        className="form-control"
                        id="titulo"
                        required
                        value={this.state.titulo}
                        onChange={this.onChangeTitulo}
                        name="titulo"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="tipo">Tipo</label>
                      <input
                        type="text"
                        className="form-control"
                        id="tipo"
                        required
                        value={this.state.tipo}
                        onChange={this.onChangeTipo}
                        name="tipo"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="enunciado">Enunciado</label>
                      <input
                        type="text"
                        className="form-control"
                        id="enunciado"
                        required
                        value={this.state.enunciado}
                        onChange={this.onChangeEnunciado}
                        name="enunciado"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="tiempoRespuesta">Tiempo de Respuesta</label>
                      <input
                        type="text"
                        className="form-control"
                        id="tiempoRespuesta"
                        required
                        value={this.state.tiempoRespuesta}
                        onChange={this.onChangeTiempoRespuesta}
                        name="tiempoRespuesta"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="puntaje">Puntaje</label>
                      <input
                        type="text"
                        className="form-control"
                        id="puntaje"
                        required
                        value={this.state.puntaje}
                        onChange={this.onChangePuntaje}
                        name="puntaje"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="opcion">Random:</label>
                      <input
                        type="checkbox"
                        className="form-control"
                        id="random"
                        value="true"
                        onChange={this.onChangeRandom}
                        name="random">
                      </input>
                    </div>

                    <div className="form-group">
                      <label htmlFor="user">Id del Usuario</label>
                      <input
                        type="text"
                        className="form-control"
                        id="user"
                        required
                        value={this.props.match.params.id}
                        onChange={this.onChangeUserid}
                        name="user"
                      />
                    </div>

                    <button onClick={this.savePregunta} className="btn btn-success">
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