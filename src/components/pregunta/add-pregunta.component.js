import React, { Component } from "react";
import PreguntaDataService from "../../services/pregunta.service";

export default class AddPregunta extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitulo = this.onChangeTitulo.bind(this);
    this.onChangeTipo = this.onChangeTipo.bind(this);
    this.onChangeEnunciado = this.onChangeEnunciado.bind(this);
    this.onChangeTiempoRespuesta = this.onChangeTiempoRespuesta.bind(this);
    this.onChangePuntaje = this.onChangePuntaje.bind(this);
    this.onChangeRandom= this.onChangeRandom.bind(this);
    this.onChangeUserid = this.onChangeUserid.bind(this);
    this.savePregunta = this.savePregunta.bind(this);
    this.newPregunta = this.newPregunta.bind(this);

    this.state = {
      id: null,
      titulo: "",
      tipo: "", 
      enunciado: "",
      tiemporespuesta: "",
      puntaje: "",
      random: "",
      users: "",

      submitted: false
    };
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
      tiemporespuesta: e.target.value
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
      users: e.target.value
    });
  }

  savePregunta() {
    var data = {
      titulo: this.state.titulo,
      tipo: this.state.tipo,
      enunciado: this.state.enunciado,
      tiemporespuesta: this.state.tiemporespuesta,
      puntaje: this.state.puntaje,
      random: this.state.random,
      users: this.state.users
    };

    PreguntaDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          titulo: response.data.titulo,
          tipo: response.data.tipo,
          enunciado: response.data.enunciado,
          tiemporespuesta: response.data.tiemporespuesta,
          puntaje: response.data.puntaje,
          random: response.data.random,
          users: response.data.users,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newPregunta() {
    this.setState({
      id: null,
      titulo: "",
      tipo: "", 
      enunciado: "",
      tiemporespuesta: "",
      puntaje: "",
      random: "",
      users: "",

      submitted: false
    });
  }

  render() {
    return (
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
              <label htmlFor="tiemporespuesta">Tiempo de Respuesta</label>
              <input
                type="text"
                className="form-control"
                id="tiemporespuesta"
                required
                value={this.state.tiemporespuesta}
                onChange={this.onChangeTiempoRespuesta}
                name="tiemporespuesta"
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
              <label htmlFor="users">Id del Usuario</label>
              <input
                type="text"
                className="form-control"
                id="users"
                required
                value={this.state.users}
                onChange={this.onChangeUserid}
                name="users"
              />
            </div>

            <button onClick={this.savePregunta} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>
    );
  }
}