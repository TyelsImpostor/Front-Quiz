import React, { Component } from "react";
import OpcionDataService from "../../services/opcion.service";

export default class Opcion extends Component {
  constructor(props) {
    super(props);
    this.onChangeOpcion = this.onChangeOpcion.bind(this);
    this.onChangeCoincide = this.onChangeCoincide.bind(this);
    this.onChangePorcentaje = this.onChangePorcentaje .bind(this);
    this.onChangePreguntaid = this.onChangePreguntaid.bind(this);
    this.getOpcion = this.getOpcion.bind(this);
    this.updateCoincide = this.updateCoincide.bind(this);
    this.updateOpcion = this.updateOpcion.bind(this);
    this.deleteOpcion = this.deleteOpcion.bind(this);

    this.state = {
      currentOpcion: {
        id: null,
        opcion: "",
        coincide: "",
        porcentaje: "",
        pregunta: ""

      },
      message: ""
    };
  }

  componentDidMount() {
    this.getOpcion(this.props.match.params.id);
  }

  onChangeOpcion(e) {
    const opcion = e.target.value;

    this.setState(function(prevState) {
      return {
        currentOpcion: {
          ...prevState.currentOpcion,
          opcion: opcion
        }
      };
    });
  }

  onChangeCoincide(e) {
    const coincide = e.target.value;

    this.setState(function(prevState) {
      return {
        currentOpcion: {
          ...prevState.currentOpcion,
          coincide: coincide
        }
      };
    });
  }

  onChangePorcentaje(e) {
    const porcentaje = e.target.value;

    this.setState(function(prevState) {
      return {
        currentOpcion: {
          ...prevState.currentOpcion,
          porcentaje: porcentaje
        }
      };
    });
  }

  onChangePreguntaid(e) {
    const pregunta = e.target.value;
    
    this.setState(prevState => ({
      currentOpcion: {
        ...prevState.currentOpcion,
        pregunta: pregunta
      }
    }));
  }

  getOpcion(id) {
    OpcionDataService.get(id)
      .then(response => {
        this.setState({
          currentOpcion: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateCoincide(status) {
    var data = {
      id: this.state.currentOpcion.id,
      opcion: this.state.currentOpcion.opcion,
      coincide: this.state.currentOpcion.coincide,
      porcentaje: this.state.currentOpcion.porcentaje,
      pregunta: this.state.currentOpcion.pregunta,
    };

    OpcionDataService.update(this.state.currentOpcion.id, data)
      .then(response => {
        this.setState(prevState => ({
          currentOpcion: {
            ...prevState.currentOpcion,
            coincide: status
          }
        }));
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateOpcion() {
    OpcionDataService.update(
      this.state.currentOpcion.id,
      this.state.currentOpcion
    )
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "The pregunta was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteOpcion() {    
    OpcionDataService.delete(this.state.currentOpcion.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/pregunta')
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { currentOpcion } = this.state;

    return (
      <div>
        {currentOpcion ? (
          <div className="edit-form">
            <h4>Opcion</h4>
            <form>
              <div className="form-group">
                <label htmlFor="opcion">Opcion</label>
                <input
                  type="text"
                  className="form-control"
                  id="opcion"
                  value={currentOpcion.opcion}
                  onChange={this.onChangeOpcion}
                />
              </div>
              <div className="form-group">
                <label htmlFor="coincide">Coincide</label>
                <input
                  type="checkbox"
                  className="form-control"
                  id="coincide"
                  value="true"
                  onChange={this.onChangeCoincide}>
                </input>
              </div>
              <div className="form-group">
                <label htmlFor="porcentaje">Porcentaje de Puntaje</label>
                <input
                  type="text"
                  className="form-control"
                  id="porcentaje"
                  value={currentOpcion.porcentaje}
                  onChange={this.onChangePorcentaje}
                />
              </div>
              <div className="form-group">
                <label htmlFor="pregunta">Id de la Pregunta</label>
                <input
                  type="text"
                  className="form-control"
                  id="pregunta"
                  value={currentOpcion.pregunta}
                  onChange={this.onChangePreguntaid}
                />
              </div>

              <div className="form-group">
                <label>
                  <strong>Respuesta:</strong>
                </label>
                {currentOpcion.coincide ? "Activado" : "Desactivado"}
              </div>
            </form>

            {currentOpcion.coincide ? (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updateCoincide(false)}
              >
                Desactivado
              </button>
            ) : (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updateCoincide(true)}
              >
                Activado
              </button>
            )}

            <button
              className="badge badge-danger mr-2"
              onClick={this.deleteOpcion}
            >
              Delete
            </button>

            <button
              type="submit"
              className="badge badge-success"
              onClick={this.updateOpcion}
            >
              Update
            </button>
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Opcion...</p>
          </div>
        )}
      </div>
    );
  }
}