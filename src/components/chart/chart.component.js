import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";
import { Radar } from "react-chartjs-2";
import PreguntaDataService from "../../services/pregunta.service";

export default class Chart extends Component {
  constructor(props) {
    super(props);
    this.retrievePreguntas = this.retrievePreguntas.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.Datos = this.Datos.bind(this);

    this.state = {
      respuesta: [],
      id: [],
      cant: [],
      colores: [],
      data: [],
      opciones: [],

      preguntas: [],
      datos: [],
      nombre: [],
      cantidad: [],
    }
  }

  async peticion() {
    var peticion = await fetch("http://localhost:8080/api/quizpres/quizpre-chart");
    var respuesta = await peticion.json();
    this.setState({ respuesta: respuesta });
    var id = [], cant = [];
    for (var i = 0; i < respuesta.length; i = i + 2) {
      id.push(respuesta[i]);
      cant.push(respuesta[i + 1]);
    }
    this.setState({ id: id, cant: cant });
  }

  generarCaracter() {
    var caracter = ["a", "b", "c", "d", "e", "f", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    var numero = (Math.random() * 15).toFixed(0);
    return caracter[numero];
  }

  colorHEX() {
    var color = "";
    for (var i = 0; i < 6; i++) {
      color = color + this.generarCaracter();
    }
    return "#" + color;
  }

  generarColores() {
    var colores = [];
    for (var i = 0; i < this.state.respuesta.length; i++) {
      colores.push(this.colorHEX());
    }
    this.setState({ colores: colores });
  }

  configurarGrafica() {
    const data1 = {
      labels: this.state.id,
      datasets: [{
        data: this.state.cant,
        backgroundColor: this.state.colores
      }]
    };
    const opciones1 = {
      responsive: true,
      maintainAspectRatio: false
    }
    this.setState({ data1: data1, opciones1: opciones1 });
  }

  async componentDidMount() {
    await this.peticion();
    await this.generarColores();
    this.configurarGrafica();
    this.retrievePreguntas();
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
      currentPregunta: null
    });
  }

  Datos(id) {
    var nombre = [], cantidad = [];
    PreguntaDataService.getChart(id)
      .then(response => {
        this.setState({
          datos: response.data
        });
        console.log(response.data);
        for (var i = 0; i < response.data.length; i = i + 2) {
          nombre.push(response.data[i]);
          cantidad.push(response.data[i + 1]);
        }
        this.setState({ nombre: nombre, cantidad: cantidad });
        const data2 = {
          labels: this.state.nombre,
          datasets: [{
            label: "Datos",
            data: this.state.cantidad,
            backgroundColor: this.state.colores
          }]
        };
        const opciones2 = {
          responsive: true,
          maintainAspectRatio: false
        }
        this.setState({ data2: data2, opciones2: opciones2 });
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { preguntas } = this.state;

    return (
      <div>
        <div className="col-md-6">
          <h4>Preguntas List</h4>

          <ul className="list-group">
            {preguntas &&
              preguntas.map((pregunta) => (
                <li
                  className="list-group-item" onClick={() => this.Datos(pregunta.id)}>
                  {pregunta.titulo}
                </li>
              ))}
          </ul>
        </div>

        <h3>Preguntas utilizadas en Quiz</h3>
        <div className="App" style={{ width: "40%", height: "400px" }}>
          <Doughnut data={this.state.data1} options={this.state.opciones1} />
        </div>

        <h3>Estadisticas</h3>
        <div className="App" style={{ width: "40%", height: "400px" }}>
          <Radar data={this.state.data2} options={this.state.opciones2} />
        </div>
      </div>
    );
  }
}