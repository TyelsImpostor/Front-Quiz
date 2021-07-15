import React, { Component } from "react";
import RamoDataService from "../../services/ramo.service";
import CarreRamoDataService from "../../services/carreramo.service";
import CarreraDataService from "../../services/carrera.service";
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";

export default class AddRamo extends Component {
  constructor(props) {
    super(props);
    this.onChangeCodigo = this.onChangeCodigo.bind(this);
    this.onChangeNombre = this.onChangeNombre.bind(this);
    this.onChangeSemestre = this.onChangeSemestre.bind(this);
    this.onChangeDescripcion = this.onChangeDescripcion.bind(this);
    this.onChangeCarreraid = this.onChangeCarreraid.bind(this);
    this.saveRamo = this.saveRamo.bind(this);
    this.newRamo = this.newRamo.bind(this);
    this.newCarreRamo = this.newCarreRamo.bind(this);
    this.retrieveCarreras = this.retrieveCarreras.bind(this);

    this.state = {
      id: null,
      codigo: "",
      nombre: "",
      semestre: "",
      descripcion: "",
      carreraid: "",
      ramoid: "",
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
      carreras: [],

      submitted: false
    };
  }

  componentDidMount() {
    this.retrieveCarreras();
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

  retrieveCarreras() {
    CarreraDataService.getAll()
      .then(response => {
        this.setState({
          carreras: response.data
        });
        //console.log(response.data);
      })
      .catch(e => {
        //console.log(e);
      });
  }

  onChangeCodigo(e) {
    this.setState({
      codigo: e.target.value
    });
  }

  onChangeNombre(e) {
    this.setState({
      nombre: e.target.value
    });
  }

  onChangeSemestre(e) {
    this.setState({
      semestre: e.target.value
    });
  }

  onChangeDescripcion(e) {
    this.setState({
      descripcion: e.target.value
    });
  }

  onChangeCarreraid(e) {
    this.setState({
      carreraid: e.target.value
    });
  }

  saveRamo() {
    var data = {
      codigo: this.state.codigo,
      nombre: this.state.nombre,
      semestre: this.state.semestre,
      descripcion: this.state.descripcion
    };

    RamoDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          codigo: response.data.codigo,
          nombre: response.data.nombre,
          semestre: response.data.semestre,
          descripcion: response.data.descripcion,

          submitted: true
        });
        //console.log(response.data);

        var data = {
          carreraid: this.state.carreraid,
          ramoid: response.data.id
        };

        CarreRamoDataService.create(data)
        .then(response => {
          this.setState({
            id: response.data.id,
            carreraid: response.data.carreraid,
            ramoid: response.data.id,

            submitted: true
          });
          //console.log(response.data);
        })
        .catch(e => {
          //console.log(e);
        });
      })
      .catch(e => {
        //console.log(e);
      });
  }

  newRamo() {
    this.setState({
      id: null,
      codigo: "",
      nombre: "",
      semestre: "",
      descripcion: "",

      submitted: false
    });
  }

  newCarreRamo() {
    this.setState({
      id: null,
      carreraid: "",
      ramoid: "",

      submitted: false
    });
  }

  render() {
    const { currentUser, carreras, showUserBoard, showModeratorBoard, showTeacherBoard } = this.state;

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
                  <button className="btn btn-success" onClick={this.newRamo, this.newCarreRamo}>
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
                      <label htmlFor="nombre">Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        required
                        value={this.state.nombre}
                        onChange={this.onChangeNombre}
                        name="nombre"
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
                      <label htmlFor="carreras">Carrera:</label>
                      <select
                        type="text"
                        className="form-control"
                        id="carreras"
                        required
                        onChange={this.onChangeCarreraid}
                        name="carreras"
                        defaultValue="...">
                        <option disabled>...</option>
                        {carreras &&
                          carreras.map((carrera) => (
                            <option value={carrera.id}>{carrera.malla}</option>
                          ))}
                      </select>
                    </div>

                    <button onClick={this.saveRamo} className="btn btn-success">
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