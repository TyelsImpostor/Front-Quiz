import React, { Component } from "react";
import PreguntaDataService from "../../services/pregunta.service";
import { Link } from "react-router-dom";

export default class PreguntasList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchTitulo = this.onChangeSearchTitulo.bind(this);
    this.retrievePreguntas = this.retrievePreguntas.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActivePregunta = this.setActivePregunta.bind(this);
    this.removeAllPreguntas = this.removeAllPreguntas.bind(this);
    this.searchTitulo = this.searchTitulo.bind(this);

    this.state = {
      preguntas: [],
      currentPregunta: null,
      currentIndex: -1,
      searchTitulo: ""
    };
  }

  componentDidMount() {
    this.retrievePreguntas();
  }

  onChangeSearchTitulo(e) {
    const searchTitulo = e.target.value;

    this.setState({
      searchTitulo: searchTitulo
    });
  }

  retrievePreguntas() {
    PreguntaDataService.getAll()
      .then(response => {
        this.setState({
          preguntas: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrievePreguntas();
    this.setState({
      currentPregunta: null,
      currentIndex: -1
    });
  }

  setActivePregunta(pregunta, index) {
    this.setState({
      currentPregunta: pregunta,
      currentIndex: index
    });
  }

  removeAllPreguntas() {
    PreguntaDataService.deleteAll()
      .then(response => {
        console.log(response.data);
        this.refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  }

  searchTitulo() {
    PreguntaDataService.findByTitulo(this.state.searchTitulo)
      .then(response => {
        this.setState({
          preguntas: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { searchTitulo, preguntas, currentPregunta, currentIndex } = this.state;

    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by titulo"
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
          <h4>Preguntas List</h4>

          <ul className="list-group">
            {preguntas &&
              preguntas.map((pregunta, index) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActivePregunta(pregunta, index)}
                  key={index}
                >
                  {pregunta.titulo}
                </li>
              ))}
          </ul>

          <button
            className="m-3 btn btn-sm btn-danger"
            onClick={this.removeAllPreguntas}
          >
            Remove All
          </button>
        </div>
        <div className="col-md-6">
          {currentPregunta ? (
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
              <div>
                <label>
                  <strong>Tiempo de Respuesta:</strong>
                </label>{" "}
                {currentPregunta.tiemporespuesta}
              </div>
              <div>
                <label>
                  <strong>Puntaje:</strong>
                </label>{" "}
                {currentPregunta.puntaje}
              </div>
              <div>
                <label>
                  <strong>Pregunta Random:</strong>
                </label>{" "}
                {currentPregunta.random ? "Activo" : "Desactivado"}
              </div>
              <div>
                <label>
                  <strong>Id del Usuario:</strong>
                </label>{" "}
                {currentPregunta.userid}
              </div>

              <Link
                to={"/preguntas/" + currentPregunta.id}
                className="badge badge-warning"
              >
                Edit
              </Link>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Pregunta...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}