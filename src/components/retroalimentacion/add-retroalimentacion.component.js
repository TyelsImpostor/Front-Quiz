import React, { Component } from 'react';
import RetroDataService from "../../services/retroalimentacion.service";
import { Link } from "react-router-dom";

import {
  Accordion, Button, Form, Modal, Card, Table, OverlayTrigger, Tooltip, Col
} from 'react-bootstrap';

import AuthService from "../../services/auth.service";

class AddRetro extends Component {
  constructor(props) {
    super(props);
    this.setActiveRetro = this.setActiveRetro.bind(this);
    this.updateActivo = this.updateActivo.bind(this);
    this.updateRetro = this.updateRetro.bind(this);
    this.onChangePreguntaid = this.onChangePreguntaid.bind(this);
    this.onChangeActivo = this.onChangeActivo.bind(this);
    this.onChangeEnunciado = this.onChangeEnunciado.bind(this);
    this.onChangePreguntaid2 = this.onChangePreguntaid2.bind(this);
    this.onChangeActivo2 = this.onChangeActivo2.bind(this);
    this.onChangeEnunciado2 = this.onChangeEnunciado2.bind(this);
    this.saveRetro = this.saveRetro.bind(this);
    this.delete = this.delete.bind(this);

    this.state = {
      update: false,
      currentIndex: -1,
      id: null,
      preguntaid: "",
      activo: "",
      enunciado: "",
      retroalimentacions: [],
      retropreguntas: [],
      currentRetro2: [],
      currentRetro: null,
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
      visible: false,
      visible2: false
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showUserBoard: user.roles.includes("user"),
        showModeratorBoard: user.roles.includes("moderator"),
        showTeacherBoard: user.roles.includes("teacher"),
      });
    }
    this.retrieveRetros();
  }

  openModal() {
    this.setState({
      visible: true
    });
  }

  closeModal() {
    this.setState({
      visible: false,
      id: null,
      preguntaid: "",
      activo: "",
      enunciado: "",
      currentRetro2: [],
      update: false
    });
  }

  openModalRetro() {
    this.setState({
      visible2: true
    });
  }

  closeModalRetro() {
    this.setState({
      visible2: false,
      id: null,
      preguntaid: "",
      activo: "",
      enunciado: "",
      currentRetro2: [],
      update: false
    });
  }

  async retrieveRetros() {
    var retropreguntas = [];
    await RetroDataService.getAll()
      .then(response => {
        this.setState({
          retroalimentacions: response.data
        });
        //console.log(response.data);
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].preguntaid == this.props.match.params.id) {
            retropreguntas.push(response.data[i]);
          }
        }
        this.setState({ retropreguntas: retropreguntas });
      })
      .catch(e => {
        //console.log(e);
      });
  }

  setActiveRetro(retro, index) {
    this.setState({
      currentRetro: retro,
      currentIndex: index
    });
    this.openModalRetro();
  }

  async updateActivo(status, id, id2) {
    var data = {
      id: this.state.currentRetro.id,
      enunciado: this.state.currentRetro.enunciado,
      activo: status,
      preguntaid: this.state.currentRetro.preguntaid,
    };

    await RetroDataService.update(this.state.currentRetro.id, data)
      .then(response => {
        this.setState(prevState => ({
          currentRetro: {
            ...prevState.currentRetro,
            activo: status
          }
        }));
        //console.log(response.data);
      })
      .catch(e => {
        //console.log(e);
      });

    await RetroDataService.getAll()
      .then(response => {
        this.setState({
          currentRetro2: response.data
        });

        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].preguntaid == id) {
            if (response.data[i].id != id2) {
              var data = {
                id: response.data[i].id,
                enunciado: response.data[i].enunciado,
                activo: "false",
                preguntaid: response.data[i].preguntaid,
              };

              RetroDataService.update(response.data[i].id, data)
            }
          }
        }
      })
      .catch(e => {
        //console.log(e);
      });
    
    await this.closeModal();
  }

  delete(id) {
    RetroDataService.delete(id)
      .then(response => {
        //console.log(response.data);
        this.retrieveRetros();
        this.closeModalRetro();
      })
      .catch(e => {
        //console.log(e);
      })
  }

  //----------------------ADD/RETRO-----------------------------

  onChangePreguntaid(e) {
    this.setState({
      preguntaid: e.target.value
    });
  }

  onChangeActivo(e) {
    this.setState({
      activo: e.target.value
    });
  }

  onChangeEnunciado(e) {
    this.setState({
      enunciado: e.target.value
    });
  }

  saveRetro() {
    var data = {
      preguntaid: this.props.match.params.id,
      activo: false,
      enunciado: this.state.enunciado,
    };

    RetroDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          preguntaid: response.data.preguntaid,
          activo: response.data.activo,
          enunciado: response.data.enunciado,
        });
        //console.log(response.data);
        this.retrieveRetros();
        this.closeModal();
      })
      .catch(e => {
        //console.log(e);
      });
  }

  //----------------------UPDATE/RETRO-----------------------------

  update() {
    this.setState({
      update: true
    });
  }

  updateBack() {
    this.setState({
      update: false
    });
  }

  onChangePreguntaid2(e) {
    const preguntaid = e.target.value;

    this.setState(function (prevState) {
      return {
        currentRetro: {
          ...prevState.currentRetro,
          preguntaid: preguntaid
        }
      };
    });
  }

  onChangeActivo2(e) {
    const activo = e.target.value;

    this.setState(prevState => ({
      currentRetro: {
        ...prevState.currentRetro,
        activo: activo
      }
    }));
  }

  onChangeEnunciado2(e) {
    const enunciado = e.target.value;

    this.setState(prevState => ({
      currentRetro: {
        ...prevState.currentRetro,
        enunciado: enunciado
      }
    }));
  }

  updateRetro() {
    RetroDataService.update(this.state.currentRetro.id,
      this.state.currentRetro
    )
      .then(response => {
        //console.log(response.data);
        this.retrieveRetros();
        this.closeModalRetro();
      })
      .catch(e => {
        //console.log(e);
      });
  }

  render() {
    const { update, currentUser, showUserBoard, showModeratorBoard, showTeacherBoard, retropreguntas, currentIndex, currentRetro } = this.state;

    return (
      <div className="container">
        <header>
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
            <div>
              <div class="center">
                <h2 class="img-center">Centro Feedback</h2>
                <p class="center">
                  Selecciona o Añade una Retroalimentación para tu pregunta.
                </p>
              </div>

              <div className="list row">

                <div className="col-md-6">
                  <br></br>
                  <h4>Ya en el Sistema:</h4>
                  <ul className="list-group">
                    {retropreguntas &&
                      retropreguntas.map((retroalimentacion, index) => (
                        <li
                          className={"list-group-item " + (index === currentIndex ? "active" : "")}
                          onClick={() => this.setActiveRetro(retroalimentacion, index)}
                          key={index}
                        >
                          {retroalimentacion.enunciado.substring(0, 50)} ...{" "}
                        </li>
                      ))}
                  </ul>
                  <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Nueva</Tooltip>}>
                    <Button size="sm" variant="light" onClick={() => this.openModal()}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="505" height="20" fill="currentColor" class="bi bi-file-earmark-plus" viewBox="0 0 16 16">
                        <path d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5z" />
                        <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z" />
                      </svg>
                    </Button>
                  </OverlayTrigger>
                </div>

                <div className="col-md-6">
                  <br></br>
                  <Table striped bordered hover>
                    <h3 class="center">Preguntas Frecuentes</h3>
                    <Accordion defaultActiveKey="0">
                      <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                          ¿Qué es una Retroalimentación?
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>Una Retroalimentación es establecida por el Profesor, esta es una ayuda para poder responder una pregunta en específica.</Card.Body>
                      </Accordion.Collapse>
                      <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                          ¿Cuántas Retroalimentaciones puede tener una pregunta?
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="1">
                        <Card.Body>Una pregunta puede tener muchas Retroalimentaciones, pero solo una “Activa”.</Card.Body>
                      </Accordion.Collapse>
                      <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="2">
                          ¿Que significa que una Retroalimentación esté “Activa”?
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="2">
                        <Card.Body>La Retroalimentación que este “Activa” significa que es la elegida para que los alumnos puedan verla.</Card.Body>
                      </Accordion.Collapse>
                    </Accordion>
                  </Table>
                </div>
              </div>

              <Modal show={this.state.visible} size="xl" >
                <Modal.Header closeButton onClick={() => this.closeModal()} >
                  <Modal.Title>Nueva Retroalimentación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div>
                    <Form>
                      <Form.Row>
                        <Col md="3">
                          <label htmlFor="preguntaid">Id de Pregunta</label>
                          <input
                            type="text"
                            className="form-control"
                            id="preguntaid"
                            disabled
                            value={this.props.match.params.id}
                            onChange={this.onChangePreguntaid}
                            name="preguntaid"
                          />
                        </Col>
                        <Col md="3">
                          <label htmlFor="activo">Activo</label>
                          <input
                            type="text"
                            className="form-control"
                            id="activo"
                            disabled
                            value="false"
                            onChange={this.onChangeActivo}
                            name="activo"
                          />
                        </Col>
                      </Form.Row>
                      <Form.Row>
                        <label htmlFor="enunciado">Enunciado</label>
                        <Form.Control as="textarea" rows={3}
                          className="form-control"
                          id="enunciado"
                          required
                          value={this.state.enunciado}
                          onChange={this.onChangeEnunciado}
                          name="enunciado"
                        >
                        </Form.Control>
                      </Form.Row>
                    </Form>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="primary" onClick={this.saveRetro}>
                    Añadir
                  </Button>
                </Modal.Footer>
              </Modal>

              <Modal show={this.state.visible2} size="xl" >
                <Modal.Header closeButton onClick={() => this.closeModalRetro()} >
                  {update == false ? (
                    <Modal.Title>Detalles</Modal.Title>
                  ) : (
                    <Modal.Title>Editar</Modal.Title>
                  )}
                </Modal.Header>
                <Modal.Body>
                  <div>
                    {update == false ? (
                      <div>
                        {currentRetro ? (
                          <div className="list row">

                            <div className="col-md-6">
                              <div class="center">
                                <div>
                                  <label>
                                    <strong>ID:</strong>
                                  </label>{" "}
                                  {currentRetro.id}
                                </div>
                                <div>
                                  <label>
                                    <strong>Enunciado:</strong>
                                  </label>{" "}
                                  {currentRetro.enunciado.substring(0, 50)}{" "}
                                  {currentRetro.enunciado.substr(50, 50)}{" "}
                                  {currentRetro.enunciado.substr(50, 50)}{" "}
                                  {currentRetro.enunciado.substr(200, currentRetro.enunciado.length)}
                                </div>
                                {currentRetro.activo == false ? (
                                  <div>
                                    <label>
                                      <strong>Opciones:</strong>
                                    </label>{" "}
                                    <Link
                                      class="badge badge-info"
                                      onClick={() => this.updateActivo(true, currentRetro.preguntaid, currentRetro.id)}
                                    >
                                      Activar
                                    </Link>
                                    &nbsp;
                                    <Link
                                      className="badge badge-danger"
                                      onClick={() => this.delete(currentRetro.id)}
                                    >
                                      Eliminar
                                    </Link>
                                    &nbsp;
                                    <Link
                                      className="badge badge-warning"
                                      onClick={() => this.update()}
                                    >
                                      Editar
                                    </Link>
                                  </div>
                                ) : (
                                  <div>
                                    <label>
                                      <strong>Estado:</strong>
                                    </label>{" "}
                                    <h6>Activo</h6>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="col-md-6">
                              <br></br>
                              <Table striped bordered hover>
                                <h3 class="center">Preguntas Frecuentes</h3>
                                <Accordion defaultActiveKey="0">
                                  <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                      ¿Qué pasa si activo una Retroalimentación?
                                    </Accordion.Toggle>
                                  </Card.Header>
                                  <Accordion.Collapse eventKey="0">
                                    <Card.Body>Cuando activas una Retroalimentación, se buscará en sistema si existe otra activa, si se encuentra otra activa, automáticamente se desactiva dejando solo la que seleccionaste.</Card.Body>
                                  </Accordion.Collapse>
                                </Accordion>
                              </Table>
                            </div>
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Regresar</Tooltip>}>
                          <Button size="sm" variant="light" onClick={() => this.updateBack()}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-reply" viewBox="0 0 16 16">
                              <path d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822.984.624 1.99 1.76 2.595 3.876-1.02-.983-2.185-1.516-3.205-1.799a8.74 8.74 0 0 0-1.921-.306 7.404 7.404 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254a.503.503 0 0 0-.042-.028.147.147 0 0 1 0-.252.499.499 0 0 0 .042-.028l3.984-2.933zM7.8 10.386c.068 0 .143.003.223.006.434.02 1.034.086 1.7.271 1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96v-.667z" />
                            </svg>
                          </Button>
                        </OverlayTrigger>
                        <Form>
                          <Form.Row>
                            <Col md="3">
                              <label htmlFor="preguntaid">Id de la Pregunta</label>
                              <input
                                type="text"
                                className="form-control"
                                id="preguntaid"
                                required
                                defaultValue={currentRetro.preguntaid}
                                onChange={this.onChangePreguntaid2}
                                name="preguntaid"
                                disabled />
                            </Col>
                            <Col md="3">
                              <label htmlFor="activo">Activo</label>
                              <input
                                type="text"
                                className="form-control"
                                id="activo"
                                required
                                defaultValue={currentRetro.activo}
                                onChange={this.onChangeActivo2}
                                name="activo"
                                disabled />
                            </Col>
                          </Form.Row>
                          <Form.Row>
                            <label htmlFor="enunciado">Enunciado</label>
                            <Form.Control as="textarea" rows={3}
                              className="form-control"
                              id="enunciado"
                              required
                              defaultValue={currentRetro.enunciado}
                              onChange={this.onChangeEnunciado2}
                              name="enunciado"
                            >
                            </Form.Control>
                          </Form.Row>
                        </Form>
                      </div>
                    )}
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  {update == false ? (
                    <div></div>
                  ) : (
                    <Button variant="primary" onClick={this.updateRetro}>
                      Editar
                    </Button>
                  )}
                </Modal.Footer>
              </Modal>
            </div>
          ))}

          {showUserBoard && (
            <h3>Usted no tiene el permiso para acceder a esta zona.</h3>
          )}
        </header>
      </div >
    );
  }
}

export default AddRetro;