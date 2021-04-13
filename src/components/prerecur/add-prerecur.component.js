import React, { Component } from "react";
import RecursoDataService from "../../services/recurso.service";
import PreguntaDataService from "../../services/pregunta.service";
import PreRecurDataService from "../../services/prerecur.service";
import { Link } from "react-router-dom";
import {
  Button, Modal, Tabs, Tab, Card, ListGroup, Table, Accordion, OverlayTrigger, Tooltip
} from 'react-bootstrap';

import AuthService from "../../services/auth.service";

export default class AddPreRecu extends Component {
  constructor(props) {
    super(props);
    this.retrieveRecursos = this.retrieveRecursos.bind(this);
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
      visible: false,
      tiporecurso: 0,
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
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
    this.retrieveRecursos();
    this.retrievePreRecurs();
    this.getPregunta(this.props.match.params.id);
  }

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

  setActiveRecurso(recurso) {
    this.setState({
      currentRecurso: recurso
    });
    this.openModal();
  }

  savePreRecur(recurso, pregunta) {
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
        this.retrieveRecursos();
        this.retrievePreRecurs();
        this.setState({
          currentRecurso: null
        });
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
        this.retrieveRecursos();
        this.retrievePreRecurs();
        this.setState({
          currentRecurso: null
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  handleClickBack() {
    this.setState({
      tiporecurso: 0
    });
  }

  handleClickimg() {
    this.setState({
      tiporecurso: 1
    });
  }

  handleClickdoc() {
    this.setState({
      tiporecurso: 2
    });
  }

  handleClicklnk() {
    this.setState({
      tiporecurso: 3
    });
  }

  render() {
    const { recursos, currentPregunta, prerecurs, currentUser, showUserBoard, showModeratorBoard, showTeacherBoard, tiporecurso } = this.state;

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
            <div>
              <div class="img-center">
                <h2 class="center">Centro de edicion</h2>
                <p>
                  Crea, agrega o elimina un recurso para tu pregunta.
                </p>
              </div>

              <div className="list row">

                <div className="col-md-7">
                  <div align="center">
                    <img src="../../../feedback.png" width="400" height="350" />
                  </div>
                </div>

                <div className="col-md-5">
                  <br></br>
                  <Table striped bordered hover>
                    <h3 class="img-center">Preguntas Frecuentes</h3>
                    <Accordion defaultActiveKey="0">
                      <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                          ¿De qué me sirve esta interfaz?
                     </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>En esta interfaz verás todos los recursos en el sistema, además, podrás agregar una o más recursos para tu pregunta.</Card.Body>
                      </Accordion.Collapse>
                      <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                          Cuidado al agregar más de un recurso
                     </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="1">
                        <Card.Body>Los recursos son muy pesados, al hacer consultas, el sistema demora mucho para mostrar el recurso.</Card.Body>
                      </Accordion.Collapse>
                    </Accordion>
                  </Table>
                </div>
              </div>

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
                            <Card.Img variant="top" src={"https://spring-boot-back.herokuapp.com/api/recursos/resource/" + recurso.id} width="auto" height="200" />
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
                        <>
                          {prerecur.preguntaid == currentPregunta.id ? (
                            <>
                              {recursos &&
                                recursos.map((recurso) => (
                                  <>
                                    {prerecur.recursoid == recurso.id ? (
                                      <>
                                        <Card>
                                          {recurso.type == "documento" && (
                                            <Card.Img variant="top" src="https://image.flaticon.com/icons/png/512/32/32329.png" width="auto" height="200" />
                                          )}
                                          {recurso.type == "link" && (
                                            <iframe src={"https://www.youtube.com/embed/" + recurso.link + "?autoplay=1&loop=1"} width="auto" height="200"></iframe>
                                          )}
                                          {recurso.type == "imagen" && (
                                            <Card.Img variant="top" src={"https://spring-boot-back.herokuapp.com/api/recursos/resource/" + recurso.id} width="auto" height="200" />
                                          )}
                                          <Card.Body>
                                            <Card.Title>{recurso.title}</Card.Title>
                                          </Card.Body>
                                          <ListGroup className="list-group-flush"></ListGroup>
                                          <Card.Body align="center">
                                            <Button onClick={() => this.deletePrerecurso(prerecur.id)} class="danger">Eliminar</Button>
                                          </Card.Body>
                                        </Card>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </>
                                ))}
                            </>
                          ) : (
                            <h5></h5>
                          )}
                        </>
                      ))}
                  </div>
                </Tab>
              </Tabs>

              <br></br>
              <div>
                <Button onClick={() => this.openModal()} > Nuevo Recurso </Button>
              </div>
              <br></br>

              <Modal show={this.state.visible} size="xl">
                <Modal.Header closeButton onClick={() => this.closeModal()} >
                  <Modal.Title>Crear Recurso</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                  <html>
                    <body>
                      {tiporecurso == 0 && (
                        <div>
                          <div className="list row">

                            <br></br>
                            <div className="col-md-4">
                              <div align="center">
                                <img src="../../../imagen.png" width="200" height="150" onClick={() => this.handleClickimg()} />
                              </div>
                            </div>

                            <div className="col-md-4">
                              <br></br>
                              <br></br>
                              <div align="center">
                                <p>
                                  Sube un documento al sistema, recuerda que este no debe pesar mas de 2MB.
                                </p>
                              </div>
                            </div>
                          </div>

                          <br></br>
                          <div className="list row">

                            <div className="col-md-4">
                              <div align="center">
                                <img src="../../../documento.png" width="200" height="150" onClick={() => this.handleClickdoc()} />
                              </div>
                            </div>

                            <div className="col-md-4">
                              <br></br>
                              <br></br>
                              <div align="center">
                                <p>
                                  Sube un documento al sistema, recuerda que este no debe pesar mas de 2MB.
                                </p>
                              </div>
                            </div>
                          </div>

                          <br></br>
                          <br></br>
                          <div className="list row">

                            <div className="col-md-4">
                              <div align="center">
                                <img src="../../../youtube.png" width="150" height="100" onClick={() => this.handleClicklnk()} />
                              </div>
                            </div>

                            <div className="col-md-4">
                              <br></br>
                              <br></br>
                              <div align="center">
                                <p>
                                  Sube un link al sistema, no existe un limite de MB para esta opcion.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {tiporecurso == 1 && (
                        <div>
                          <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Regresar</Tooltip>}>
                            <Button size="sm" variant="light" onClick={() => this.handleClickBack()}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-reply" viewBox="0 0 16 16">
                                <path d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822.984.624 1.99 1.76 2.595 3.876-1.02-.983-2.185-1.516-3.205-1.799a8.74 8.74 0 0 0-1.921-.306 7.404 7.404 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254a.503.503 0 0 0-.042-.028.147.147 0 0 1 0-.252.499.499 0 0 0 .042-.028l3.984-2.933zM7.8 10.386c.068 0 .143.003.223.006.434.02 1.034.086 1.7.271 1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96v-.667z" />
                              </svg>
                            </Button>
                          </OverlayTrigger>
                          <div className="list row">

                            <br></br>
                            <div className="col-md-8">
                              <br></br>
                              <br></br>
                              <br></br>
                              <form method="POST" action="https://spring-boot-back.herokuapp.com/api/recursos/add" enctype="multipart/form-data">
                                Tipo:
                              <input type="text" name="type" value="imagen" />
                              &nbsp;
                              Privado:
                              <select name="privado" id="privado" defaultValue="...">
                                  <option value="..." disabled>...</option>
                                  <option value="true">True</option>
                                  <option value="false">False</option>
                                </select>
                              &nbsp;
                              ID del Usuario:
                              <input type="text" name="users" value={currentUser.id} />
                                <br></br>
                                <br></br>
                              Titulo:
                              <input type="text" name="title" />
                              &nbsp;
                              Resource:
                              <input type="file" name="resource" multiple />
                                <br></br>
                                <br></br>
                                <input href="/" type="submit" value="Subir" />
                              </form>
                            </div>

                            <div className="col-md-4">
                              <Table striped bordered hover>
                                <h3 class="center">Preguntas Frecuentes</h3>
                                <Accordion defaultActiveKey="0">
                                  <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                      ¿Que tamaño como máximo puede tener mi imagen?
                                  </Accordion.Toggle>
                                  </Card.Header>
                                  <Accordion.Collapse eventKey="0">
                                    <Card.Body>Las imágenes que subes al sistema no deben pasar de los 2MB.</Card.Body>
                                  </Accordion.Collapse>
                                  <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                      ¿Cuántas fotos puedo subir?
                                  </Accordion.Toggle>
                                  </Card.Header>
                                  <Accordion.Collapse eventKey="1">
                                    <Card.Body>Puedes subir las fotos que quieras, pero mientras más tengas más lento funciona el sistema.</Card.Body>
                                  </Accordion.Collapse>
                                </Accordion>
                              </Table>
                            </div>
                          </div>
                        </div>
                      )}

                      {tiporecurso == 2 && (
                        <div>
                          <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Regresar</Tooltip>}>
                            <Button size="sm" variant="light" onClick={() => this.handleClickBack()}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-reply" viewBox="0 0 16 16">
                                <path d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822.984.624 1.99 1.76 2.595 3.876-1.02-.983-2.185-1.516-3.205-1.799a8.74 8.74 0 0 0-1.921-.306 7.404 7.404 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254a.503.503 0 0 0-.042-.028.147.147 0 0 1 0-.252.499.499 0 0 0 .042-.028l3.984-2.933zM7.8 10.386c.068 0 .143.003.223.006.434.02 1.034.086 1.7.271 1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96v-.667z" />
                              </svg>
                            </Button>
                          </OverlayTrigger>
                          <div className="list row">

                            <br></br>
                            <div className="col-md-8">
                              <br></br>
                              <br></br>
                              <br></br>
                              <form method="POST" action="https://spring-boot-back.herokuapp.com/api/recursos/add" enctype="multipart/form-data">
                                Tipo:
                              <input type="text" name="type" value="documento" />
                              &nbsp;
                              Privado:
                              <select name="privado" id="privado" defaultValue="...">
                                  <option value="..." disabled>...</option>
                                  <option value="true">True</option>
                                  <option value="false">False</option>
                                </select>
                              &nbsp;
                              ID del Usuario:
                              <input type="text" name="users" value={currentUser.id} />
                                <br></br>
                                <br></br>
                              Titulo:
                              <input type="text" name="title" />
                              &nbsp;
                              Resource:
                              <input type="file" name="resource" multiple />
                                <br></br>
                                <br></br>
                                <input href="/" type="submit" value="Subir" />
                              </form>
                            </div>

                            <div className="col-md-4">
                              <Table striped bordered hover>
                                <h3 class="center">Preguntas Frecuentes</h3>
                                <Accordion defaultActiveKey="0">
                                  <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                      ¿Que tamaño como máximo puede tener mi imagen?
                                  </Accordion.Toggle>
                                  </Card.Header>
                                  <Accordion.Collapse eventKey="0">
                                    <Card.Body>Las imágenes que subes al sistema no deben pasar de los 2MB.</Card.Body>
                                  </Accordion.Collapse>
                                  <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                      ¿Cuántas fotos puedo subir?
                                  </Accordion.Toggle>
                                  </Card.Header>
                                  <Accordion.Collapse eventKey="1">
                                    <Card.Body>Puedes subir las fotos que quieras, pero mientras más tengas más lento funciona el sistema.</Card.Body>
                                  </Accordion.Collapse>
                                </Accordion>
                              </Table>
                            </div>
                          </div>
                        </div>
                      )}

                      {tiporecurso == 3 && (
                        <div>
                          <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Regresar</Tooltip>}>
                            <Button size="sm" variant="light" onClick={() => this.handleClickBack()}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-reply" viewBox="0 0 16 16">
                                <path d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822.984.624 1.99 1.76 2.595 3.876-1.02-.983-2.185-1.516-3.205-1.799a8.74 8.74 0 0 0-1.921-.306 7.404 7.404 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254a.503.503 0 0 0-.042-.028.147.147 0 0 1 0-.252.499.499 0 0 0 .042-.028l3.984-2.933zM7.8 10.386c.068 0 .143.003.223.006.434.02 1.034.086 1.7.271 1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96v-.667z" />
                              </svg>
                            </Button>
                          </OverlayTrigger>
                          <div className="list row">

                            <br></br>
                            <div className="col-md-8">

                              <br></br>
                              <br></br>
                              <br></br>
                              <form method="POST" action="https://spring-boot-back.herokuapp.com/api/recursos/add" enctype="multipart/form-data">
                                Tipo:
                              <input type="text" name="type" value="link" />
                              &nbsp;
                              Privado:
                              <select name="privado" id="privado" defaultValue="...">
                                  <option value="..." disabled>...</option>
                                  <option value="true">True</option>
                                  <option value="false">False</option>
                                </select>
                              &nbsp;
                              ID del Usuario:
                              <input type="text" name="users" value={currentUser.id} />
                                <br></br>
                                <br></br>
                              Titulo:
                              <input type="text" name="title" />
                              &nbsp;
                              Link:
                              <input type="text" name="link" />
                                <br></br>
                                <br></br>
                                <input href="/" type="submit" value="Subir" />
                              </form>
                            </div>

                            <div className="col-md-4">
                              <Table striped bordered hover>
                                <h3 class="center">Preguntas Frecuentes</h3>
                                <Accordion defaultActiveKey="0">
                                  <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                      ¿Que tamaño como máximo puede tener mi imagen?
                                  </Accordion.Toggle>
                                  </Card.Header>
                                  <Accordion.Collapse eventKey="0">
                                    <Card.Body>Las imágenes que subes al sistema no deben pasar de los 2MB.</Card.Body>
                                  </Accordion.Collapse>
                                  <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                      ¿Cuántas fotos puedo subir?
                                  </Accordion.Toggle>
                                  </Card.Header>
                                  <Accordion.Collapse eventKey="1">
                                    <Card.Body>Puedes subir las fotos que quieras, pero mientras más tengas más lento funciona el sistema.</Card.Body>
                                  </Accordion.Collapse>
                                </Accordion>
                              </Table>
                            </div>
                          </div>
                        </div>
                      )}

                    </body>
                  </html>
                </Modal.Footer>
              </Modal>
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