import React, { Component } from "react";
import OpcionDataService from "../../services/opcion.service";
import PreguntaDataService from "../../services/pregunta.service";
import { Link } from "react-router-dom";

export default class OpcionsList extends Component {
  constructor(props) {
    super(props);
    this.retrieveOpcions = this.retrieveOpcions.bind(this);
    this.refreshList = this.refreshList.bind(this);

    this.state = {
      currentPregunta: {
        id: null,
        titulo: "",
        tipo: "",
        enunciado: "",
        tiemporespuesta: "",
        puntaje: "",
        random: false,
        users: ""

      },
      opciones: []
    };
  }

  componentDidMount() {
    this.retrieveOpcions();
    this.getPregunta(this.props.match.params.id);
  }

  retrieveOpcions() {
    OpcionDataService.getAll()
      .then(response => {
        this.setState({
          opciones: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveOpcions();
    this.setState({
    });
  }

  getPregunta(id) {
    PreguntaDataService.get(id)
      .then(response => {
        this.setState({
          currentPregunta: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { opciones, currentPregunta } = this.state;

    return (
      <div className="list row">
        <div className="col-md-6">
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
          </div>
        </div>

        <div className="col-md-6">
          <h4>Opcions List</h4>

          <Link
            to={"/pregunta/opcion/add/" + currentPregunta.id}
            className="badge badge-blue"
          >
            Agregar
          </Link>

          <ul className="list-group">
            {opciones &&
              opciones.map((opcione) => (
                <div>
                  {opcione.pregunta == currentPregunta.id ? (
                    <li className="list-group-item">
                      {opcione.opcion}
                    </li>
                  ):(
                    <h5></h5>
                  )}

                </div>
              ))}
          </ul>

        </div>
      </div>
    );
  }
}