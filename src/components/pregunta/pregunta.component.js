import React, { Component } from "react";
import PreguntaDataService from "../../services/pregunta.service";

export default class Pregunta extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitulo = this.onChangeTitulo.bind(this);
    this.onChangeTipo = this.onChangeTipo.bind(this);
    this.onChangeEnunciado = this.onChangeEnunciado.bind(this);
    this.onChangeTiempoRespuesta = this.onChangeTiempoRespuesta.bind(this);
    this.onChangePuntaje = this.onChangePuntaje.bind(this);
    this.onChangeUserid = this.onChangeUserid.bind(this);
    this.getPregunta = this.getPregunta.bind(this);
    this.updateRandom = this.updateRandom.bind(this);
    this.updatePregunta = this.updatePregunta.bind(this);
    this.deletePregunta = this.deletePregunta.bind(this);

    this.state = {
      currentPregunta: {
        id: null,
        titulo: "",
        tipo: "", 
        enunciado: "",
        tiemporespuesta: "",
        puntaje: "", 
        random: false,
        userid: ""

      },
      message: ""
    };
  }

  componentDidMount() {
    this.getPregunta(this.props.match.params.id);
  }

  onChangeTitulo(e) {
    const titulo = e.target.value;

    this.setState(function(prevState) {
      return {
        currentPregunta: {
          ...prevState.currentPregunta,
          titulo: titulo
        }
      };
    });
  }

  onChangeTipo(e) {
    const tipo = e.target.value;
    
    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        tipo: tipo
      }
    }));
  }

  onChangeEnunciado(e) {
    const enunciado = e.target.value;
    
    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        enunciado: enunciado
      }
    }));
  }

  onChangeTiempoRespuesta(e) {
    const tiemporespuesta = e.target.value;
    
    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        tiemporespuesta: tiemporespuesta
      }
    }));
  }

  onChangePuntaje(e) {
    const puntaje = e.target.value;
    
    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        puntaje: puntaje
      }
    }));
  }

  onChangeUserid(e) {
    const userid = e.target.value;
    
    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        userid: userid
      }
    }));
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

  updateRandom(status) {
    var data = {
      id: this.state.currentPregunta.id,
      titulo: this.state.currentPregunta.titulo,
      tipo: this.state.currentPregunta.tipo,
      enunciado: this.state.currentPregunta.enunciado,
      tiemporespuesta: this.state.currentPregunta.tiemporespuesta,
      puntaje: this.state.currentPregunta.puntaje,
      random: status,
      userid: this.state.currentPregunta.userid,
    };

    PreguntaDataService.update(this.state.currentPregunta.id, data)
      .then(response => {
        this.setState(prevState => ({
          currentPregunta: {
            ...prevState.currentPregunta,
            random: status
          }
        }));
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updatePregunta() {
    PreguntaDataService.update(
      this.state.currentPregunta.id,
      this.state.currentPregunta
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

  deletePregunta() {    
    PreguntaDataService.delete(this.state.currentPregunta.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/preguntas')
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { currentPregunta } = this.state;

    return (
      <div>
        {currentPregunta ? (
          <div className="edit-form">
            <h4>Pregunta</h4>
            <form>
              <div className="form-group">
                <label htmlFor="titulo">Titulo</label>
                <input
                  type="text"
                  className="form-control"
                  id="titulo"
                  value={currentPregunta.titulo}
                  onChange={this.onChangeTitulo}
                />
              </div>
              <div className="form-group">
                <label htmlFor="tipo">Tipo</label>
                <input
                  type="text"
                  className="form-control"
                  id="tipo"
                  value={currentPregunta.tipo}
                  onChange={this.onChangeTipo}
                />
              </div>
              <div className="form-group">
                <label htmlFor="enunciado">Enunciado</label>
                <input
                  type="text"
                  className="form-control"
                  id="enunciado"
                  value={currentPregunta.enunciado}
                  onChange={this.onChangeEnunciado}
                />
              </div>
              <div className="form-group">
                <label htmlFor="tiemporespuesta">Tiempo de Respuesta</label>
                <input
                  type="text"
                  className="form-control"
                  id="tiemporespuesta"
                  value={currentPregunta.tiemporespuesta}
                  onChange={this.onChangeTiempoRespuesta}
                />
              </div>
              <div className="form-group">
                <label htmlFor="puntaje">Puntaje</label>
                <input
                  type="text"
                  className="form-control"
                  id="puntaje"
                  value={currentPregunta.puntaje}
                  onChange={this.onChangePuntaje}
                />
              </div>
              <div className="form-group">
                <label htmlFor="userid">Id del Usuario</label>
                <input
                  type="text"
                  className="form-control"
                  id="userid"
                  value={currentPregunta.userid}
                  onChange={this.onChangeUserid}
                />
              </div>

              <div className="form-group">
                <label>
                  <strong>Pregunta Random:</strong>
                </label>
                {currentPregunta.random ? "Activado" : "Desactivado"}
              </div>
            </form>

            {currentPregunta.random ? (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updateRandom(false)}
              >
                Desactivado
              </button>
            ) : (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updateRandom(true)}
              >
                Activado
              </button>
            )}

            <button
              className="badge badge-danger mr-2"
              onClick={this.deletePregunta}
            >
              Delete
            </button>

            <button
              type="submit"
              className="badge badge-success"
              onClick={this.updatePregunta}
            >
              Update
            </button>
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Pregunta...</p>
          </div>
        )}
      </div>
    );
  }
}