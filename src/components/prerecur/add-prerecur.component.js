import React, { Component } from "react";
import RecursoDataService from "../../services/recurso.service";
import PreguntaDataService from "../../services/pregunta.service";
import PreRecurDataService from "../../services/prerecur.service";
import { Link } from "react-router-dom";
import {
  striped, bordered, hover, Table, Button, Text, View, Overview, Modal,
  InputGroup, FormControl, Form, Col, Jumbotron, Container, Badge, Row, OverlayTrigger, Overlay, Tooltip, Tabs, Tab, Card, ListGroup
} from 'react-bootstrap';

import AuthService from "../../services/auth.service";

export default class AddPreRecu extends Component {
  constructor(props) {
    super(props);
    this.retrieveRecursos = this.retrieveRecursos.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveRecurso = this.setActiveRecurso.bind(this);
    //DELETE
    this.deletePrerecurso = this.deletePrerecurso.bind(this);

    this.state = {
      recursos: [],
      prerecurs: [],
      currentRecurso: {
        id: null,
        title: "",
        type: "",
        resource: ""
      },
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
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
    };
  }

  openModal() {
    this.setState({
      visible: true
    });
  }

  closeModal() {
    this.setState({
      visible: false
    });
  }

  componentDidMount() {
    this.retrieveRecursos();
    this.retrievePreRecurs();
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

  retrieveRecursos() {
    RecursoDataService.getAll()
      .then(response => {
        this.setState({
          recursos: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  retrievePreRecurs() {
    PreRecurDataService.getAll()
      .then(response => {
        this.setState({
          prerecurs: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
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

  refreshList() {
    this.retrieveRecursos();
    this.retrievePreRecurs();
    this.setState({
      currentRecurso: null
    });
  }

  setActiveRecurso(recurso) {
    this.setState({
      currentRecurso: recurso
    });
    this.openModal();
  }

  savePreRecur(recurso, pregunta) {
    window.location.reload();
    var data = {
      preguntaid: pregunta,
      recursoid: recurso
    };

    PreRecurDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          preguntaid: response.data.pregunta,
          recursoid: response.data.recurso
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }
  //-----------_DELETE----------
  deletePrerecurso(id) {    
    PreRecurDataService.delete(id)
      .then(response => {
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { recursos, currentRecurso, currentPregunta, prerecurs, currentUser, showUserBoard, showModeratorBoard, showTeacherBoard } = this.state;

    return (
      <div className="">
        <header className="">
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
            <div className="">

              <div className="col-md-12 jumbotron" >
                  <div align="left">
                    <Button class="position-absolute top-0 start-0" size="sm" variant="primary" href={"/pregunta/list/"}>VOLVER</Button>
                  </div>
                  
                  <div align="center">
                    <h2>Pregunta: {currentPregunta.titulo} </h2>
                  </div>
              </div>

              <h5></h5>
              <Tabs justify variant="tabs" defaultActiveKey="listarecursos">
                <Tab eventKey="listarecursos" title="Lista de Recursos">
                  <div className="list row">
                    {recursos &&
                      recursos.map((recurso) => (
                        <Card style={{ width: '18rem' }}>
                          {recurso.type == "documento" && (
                            <Card.Img variant="top" src="https://image.flaticon.com/icons/png/512/32/32329.png" width="auto" height="200" />
                          )}
                          {recurso.type == "link" && (
                            <iframe src={"https://www.youtube.com/embed/" + recurso.link + "?autoplay=1&loop=1"} width="auto" height="200"></iframe>
                          )}
                          {recurso.type == "imagen" && (
                            <Card.Img variant="top" src={"https://spring-boot-back.herokuapp.com/api/recursos/" + recurso.id} width="auto" height="200" />
                          )}
                          <Card.Body>
                            <Card.Title>{recurso.title}</Card.Title>
                          </Card.Body>
                          <ListGroup className="list-group-flush"></ListGroup>
                          <Card.Body align="center">
                            <Button onClick={() => this.savePreRecur(recurso.id, currentPregunta.id)} class="btn btn-primary">Agregar Recurso</Button>
                          </Card.Body>
                        </Card>
                      ))}
                  </div>
                </Tab>
                <Tab eventKey="misrecursos" title="Recursos Seleccionados">
                <div className="list row">
                  {prerecurs &&
                    prerecurs.map((prerecur) => (
                      <div>
                        {prerecur.preguntaid == currentPregunta.id ? (
                          <div>
                            {recursos &&
                              recursos.map((recurso) => (
                                <div>
                                  {prerecur.recursoid == recurso.id ? (
                                    <div>
                                      <Card style={{ width: '18rem' }}>
                                        {recurso.type == "documento" && (
                                          <Card.Img variant="top" src="https://image.flaticon.com/icons/png/512/32/32329.png" width="auto" height="200" />
                                        )}
                                        {recurso.type == "link" && (
                                          <iframe src={"https://www.youtube.com/embed/" + recurso.link + "?autoplay=1&loop=1"} width="auto" height="200"></iframe>
                                        )}
                                        {recurso.type == "imagen" && (
                                          <Card.Img variant="top" src={"https://spring-boot-back.herokuapp.com/api/recursos/" + recurso.id} width="auto" height="200" />
                                        )}
                                        <Card.Body>
                                          <Card.Title>{recurso.title}</Card.Title>
                                        </Card.Body>
                                        <ListGroup className="list-group-flush"></ListGroup>
                                        <Card.Body align="center">
                                          <Button onClick={() => this.savePreRecur(recurso.id, currentPregunta.id)} class="btn btn-primary">Agregar Recurso</Button>
                                        </Card.Body>
                                      </Card>
                                    </div>
                                  ) : (
                                    <h5></h5>
                                  )}
                                </div>
                              ))}
                          </div>
                        ) : (
                          <h5></h5>
                          )}
                      </div>
                    ))}
                  </div>
                </Tab>
              </Tabs>
              <section>
                <Modal visible={this.state.visible} width="1000" height="500" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                  <div>
                    <h4>Recurso</h4>
                    <div>
                      <label>
                        <strong>ID:</strong>
                      </label>{" "}
                      {currentRecurso.id}
                    </div>
                    <div>
                      <label>
                        <strong>Titulo:</strong>
                      </label>{" "}
                      {currentRecurso.title}
                    </div>
                    <div>
                      <label>
                        <strong>Type:</strong>
                      </label>{" "}
                      {currentRecurso.type}
                    </div>
                    <div>
                      <label>
                        <strong>Recurso:</strong>
                      </label>{" "}
                      {currentRecurso.type == "imagen" && (
                        <img src={"https://spring-boot-back.herokuapp.com/api/recursos/" + currentRecurso.id} width="250" height="140"></img>
                      )}
                      {currentRecurso.type == "documento" && (
                        <a href={"https://spring-boot-back.herokuapp.com/api/recursos/" + currentRecurso.id}>{currentRecurso.title}</a>
                      )}
                      {currentRecurso.type == "link" && (
                        <iframe src={"https://www.youtube.com/embed/" + currentRecurso.link + "?autoplay=1&loop=1"} width="250" height="140"></iframe>
                      )}
                    </div>
                    <button className="btn btn-warning" onClick={() => this.closeModal()}>
                      Close
                  </button>
                    <button className="btn btn-success" onClick={() => this.savePreRecur(currentRecurso.id, currentPregunta.id)}>
                      Agregar
                  </button>
                  </div>
                </Modal>
              </section>
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