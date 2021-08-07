import React, { Component } from "react";
import OpcionDataService from "../../services/opcion.service";
import PreguntaDataService from "../../services/pregunta.service";
import { Link } from "react-router-dom";
import { striped, bordered, hover, Table, Button, Text, View , Overview, Modal, 
  InputGroup, FormControl, Form, Col, Jumbotron, Container, Badge, Row, OverlayTrigger, Overlay, Tooltip} from 'react-bootstrap';

import AuthService from "../../services/auth.service";

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
      opciones: [],
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    this.retrieveOpcions();
    this.getPregunta(this.props.match.params.id);
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

  retrieveOpcions() {
    OpcionDataService.getAll()
      .then(response => {
        this.setState({
          opciones: response.data
        });
        //console.log(response.data);
      })
      .catch(e => {
        //console.log(e);
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
        //console.log(response.data);
      })
      .catch(e => {
        //console.log(e);
      });
  }
  //Modal Agregar
  closeModal() {
    this.setState({
      visible: false
    });
  }
  openModal() {
    this.setState({
      visible: true
    });
  }





  render() {
    const { opciones, currentPregunta, currentUser, showUserBoard, showModeratorBoard, showTeacherBoard } = this.state;

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
          {(showTeacherBoard || showModeratorBoard) && (
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
                        ) : (
                            <h5></h5>
                          )}

                      </div>
                    ))}
                </ul>

              </div>
              <div>
                <Button onClick={() => this.openModal()} > Agregar Pregunta </Button>
              </div>

              <Modal show={this.state.visible} size="xl" >
                    <Modal.Header closeButton onClick={() => this.closeModal()} >
                      <Modal.Title>Agregar Pregunta</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>            
                        <Form>
                          <Form.Row>







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
                      <label htmlFor="pregunta">Id de la Pregunta</label>
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



                          </Form.Row> 
                        </Form>
                        
                    </Modal.Body>
          
                      <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.closeModal()} >
                          Cerrar
                        </Button>
                        
                        <Button variant="primary" onClick={this.saveOpcion}  href="/pregunta/list">
                          Agregar
                        </Button>
                      </Modal.Footer>
              </Modal>

            </div>
          )}

          {showUserBoard && (
            <h3>Usted no tiene el permiso para acceder a esta zona.</h3>
          )}
        </header>
      </div>
    );
  }
}