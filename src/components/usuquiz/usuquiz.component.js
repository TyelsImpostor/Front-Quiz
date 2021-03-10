import React, { Component } from "react";
import UsuQuizDataService from "../../services/usuquiz.service";
import { Bar } from "react-chartjs-2";

import AuthService from "../../services/auth.service";

export default class PreguntasList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      respuesta: [],
      colores: [],
      data: [],
      opciones: [],
      datos: [],
      nombre: [],
      cantidad: [],
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
    };
  }

  async componentDidMount() {
    await this.Resultados();
    await this.generarColores();
    this.configurarGrafica();
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

  Resultados() {
    var nombre = [], cantidad = [];
    UsuQuizDataService.getChart(this.props.match.params.id)
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

  render() {
    const {  } = this.state;

    return (
      <div>
        <h3>Calificaciones</h3>
        <div className="App" style={{ width: "40%", height: "400px" }}>
          <Bar data={this.state.data2} options={this.state.opciones2} />
        </div>
      </div>
    );
  }
}