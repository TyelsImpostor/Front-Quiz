import React, { Component } from "react";
import OpcionDataService from "../../services/opcion.service";

export default class AddOpcion extends Component {
  constructor(props) {
    super(props);
    this.onChangeOpcion = this.onChangeOpcion.bind(this);
    this.onChangeCoincide = this.onChangeCoincide.bind(this);
    this.onChangePorcentaje = this.onChangePorcentaje.bind(this);
    this.onChangePreguntaid = this.onChangePreguntaid.bind(this);
    this.saveOpcion = this.saveOpcion.bind(this);
    this.newOpcion = this.newOpcion.bind(this);

    this.state = {
      id: null,
      opcion: "",
      coincide: "",
      porcentaje: "",
      pregunta: "",

      submitted: false
    };
  }

  onChangeOpcion(e) {
    this.setState({
      opcion: e.target.value
    });
  }

  onChangeCoincide(e) {
    this.setState({
      coincide: e.target.value
    });
  }

  onChangePorcentaje(e) {
    this.setState({
      porcentaje: e.target.value
    });
  }

  onChangePreguntaid(e) {
    this.setState({
      pregunta: e.target.value
    });
  }

  saveOpcion() {
    var data = {
      opcion: this.state.opcion,
      coincide: this.state.coincide,
      porcentaje: this.state.porcentaje,
      pregunta: this.props.match.params.id
    };

    OpcionDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          opcion: response.data.opcion,
          coincide: response.data.coincide,
          porcentaje: response.data.porcentaje,
          pregunta: this.props.match.params.id,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newOpcion() {
    this.setState({
      id: null,
      opcion: "",
      coincide: "",
      porcentaje: "",
      pregunta: "",

      submitted: false
    });
  }

  render() {
    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success" onClick={this.newOpcion}>
              Add
            </button>
          </div>
        ) : (
            <div>
              <div className="form-group">
                <label htmlFor="opcion">Opcion</label>
                <input
                  type="text"
                  className="form-control"
                  id="opcion"
                  required
                  value={this.state.opcion}
                  onChange={this.onChangeOpcion}
                  name="opcion"
                />
              </div>

              <div className="form-group">
                <label htmlFor="coincide">Coincide</label>
                <input
                  type="checkbox"
                  className="form-control"
                  id="coincide"
                  value="true"
                  onChange={this.onChangeCoincide}
                  name="coincide">
                </input>
              </div>

              <div className="form-group">
                <label htmlFor="porcentaje">Porcentaje de Puntaje</label>
                <input
                  type="text"
                  className="form-control"
                  id="porcentaje"
                  required
                  value={this.state.porcentaje}
                  onChange={this.onChangePorcentaje}
                  name="porcentaje"
                />
              </div>

              <div className="form-group">
                <label htmlFor="pregunta">Id del Usuario</label>
                <input
                  type="text"
                  className="form-control"
                  id="pregunta"
                  required
                  value={this.props.match.params.id}
                  onChange={this.onChangePreguntaid}
                  name="pregunta"
                />
              </div>

              <button onClick={this.saveOpcion} className="btn btn-success">
                Submit
            </button>
            </div>
          )}
      </div>
    );
  }
}