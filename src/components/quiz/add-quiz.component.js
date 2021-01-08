import React, { Component } from "react";
import QuizDataService from "../../services/quiz.service";

export default class AddQuiz extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitulo = this.onChangeTitulo.bind(this);
    this.onChangeDescripcion = this.onChangeDescripcion.bind(this);
    this.onChangeActivo = this.onChangeActivo.bind(this);
    this.onChangeTiempodisponible = this.onChangeTiempodisponible.bind(this);
    this.onChangeFechacreacion = this.onChangeFechacreacion.bind(this);
    this.onChangeRandom= this.onChangeRandom.bind(this);
    this.onChangeFechatermino = this.onChangeFechatermino.bind(this);
    this.saveQuiz = this.saveQuiz.bind(this);
    this.newQuiz = this.newQuiz.bind(this);

    this.state = {
      id: null,
      titulo: "",
      descripcion: "", 
      activo: "",
      tiempodisponible: "",
      random: "",
      fechacreacion: "",
      fechatermino: "",

      submitted: false
    };
  }

  onChangeTitulo(e) {
    this.setState({
      titulo: e.target.value
    });
  }

  onChangeDescripcion(e) {
    this.setState({
      descripcion: e.target.value
    });
  }

  onChangeActivo(e) {
    this.setState({
      activo: e.target.value
    });
  }

  onChangeTiempodisponible(e) {
    this.setState({
      tiempodisponible: e.target.value
    });
  }

  onChangeFechacreacion(e) {
    this.setState({
      fechacreacion: e.target.value
    });
  }

  onChangeRandom(e) {
    this.setState({
      random: e.target.value
    });
  }

  onChangeFechatermino(e) {
    this.setState({
      fechatermino: e.target.value
    });
  }

  saveQuiz() {
    var data = {
      titulo: this.state.titulo,
      descripcion: this.state.descripcion,
      activo: this.state.activo,
      tiempodisponible: this.state.tiempodisponible,
      random: this.state.random,
      fechacreacion: this.state.fechacreacion,
      fechatermino: this.state.fechatermino
    };

    QuizDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          titulo: response.data.titulo,
          descripcion: response.data.descripcion,
          activo: response.data.activo,
          tiempodisponible: response.data.tiempodisponible,
          random: response.data.random,
          fechacreacion: response.data.fechacreacion,
          fechatermino: response.data.fechatermino,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newQuiz() {
    this.setState({
      id: null,
      titulo: "",
      descripcion: "", 
      activo: "",
      tiempodisponible: "",
      random: "",
      fechacreacion: "",
      fechatermino: "",

      submitted: false
    });
  }

  render() {
    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success" onClick={this.newQuiz}>
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
                <label htmlFor="activo">Activo:</label>
                <input
                  type="checkbox"
                  className="form-control"
                  id="activo"
                  value="true"
                  onChange={this.onChangeActivo}
                  name="activo">
                </input>
              </div>

            <div className="form-group">
              <label htmlFor="tiempodisponible">Tiempo de Respuesta</label>
              <input
                type="text"
                className="form-control"
                id="tiempodisponible"
                required
                value={this.state.tiempodisponible}
                onChange={this.onChangeTiempodisponible}
                name="tiempodisponible"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fechacreacion">Fecha de Creacion</label>
              <input
                type="text"
                className="form-control"
                id="fechacreacion"
                required
                value={this.state.fechacreacion}
                onChange={this.onChangeFechacreacion}
                name="fechacreacion"
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
              <label htmlFor="fechatermino">Feca de Termino</label>
              <input
                type="text"
                className="form-control"
                id="fechatermino"
                required
                value={this.state.fechatermino}
                onChange={this.onChangeFechatermino}
                name="fechatermino"
              />
            </div>

            <button onClick={this.saveQuiz} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>
    );
  }
}