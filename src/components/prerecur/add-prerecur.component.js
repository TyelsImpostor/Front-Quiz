import React, { Component } from "react";
import RecursoDataService from "../../services/recurso.service";
import PreguntaDataService from "../../services/pregunta.service";
import PreRecurDataService from "../../services/prerecur.service";
import { Link } from "react-router-dom";
import {
  Button, Modal, Tabs, Tab, Card, ListGroup, Table, Accordion, OverlayTrigger, Tooltip, Pagination, Nav
} from 'react-bootstrap';

import AuthService from "../../services/auth.service";

export default class AddPreRecu extends Component {
  constructor(props) {
    super(props);
    this.retrieveRecursos = this.retrieveRecursos.bind(this);
    this.setActiveRecurso = this.setActiveRecurso.bind(this);
    this.retrieveFiltro = this.retrieveFiltro.bind(this);
    this.retrievePreRecurs = this.retrievePreRecurs.bind(this);
    //DELETE
    this.deletePrerecurso = this.deletePrerecurso.bind(this);
    this.cambioTabPropios = this.cambioTabPropios.bind(this);
    this.cambioTabPublicos = this.cambioTabPublicos.bind(this);
    this.state = {
      recursos: [],
      prerecurs: [],
      recursosPublicos: [],
      recursosPropios: [],
      recursosAñadidos: [],
      variantColor1: "primary",
      variantColor2: "secondary",
      idpregunta: "",
      idrecurso: "",
      currentRecurso: {
        id: null,
        title: "",
        type: "",
        resource: "",
        privado: ""
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
      visibletutorial: false,
      tiporecurso: 0,
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
      visibleeliminar: false,
      visiblecopia: false,
      deleteid: "",
      //--------PAGINACION------------
      postsPerPage: 10,
      paginacionPublicas: [],
      listapaginacionPublicas: [],
      paginatePubli: 1,
      paginacionPropias: [],
      listapaginacionPropias: [],
      paginateProp: 1
    };
  }

  async componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showUserBoard: user.roles.includes("user"),
        showModeratorBoard: user.roles.includes("moderator"),
        showTeacherBoard: user.roles.includes("teacher"),
      });
    }
    await this.getPregunta(this.props.match.params.id);

    await this.retrievePre();
  }

  async retrievePre() {
    try {
      await Promise.all([this.retrieveRecursos(), this.retrievePreRecurs()]);
      await this.retrieveFiltro();
    } catch (error) {
      //console.log(error);
    }
  }
  async retrieveFiltro() {
    var listaPublicosNoAñadidos = this.state.recursos.slice();
    var listaPropiosNoAñadidos = this.state.recursos.slice();
    var recursoAñadido = this.state.recursos.slice();
    var listaPreRecurs = this.state.prerecurs.slice();

    //===PUBLICAS NO AÑADIDAS===
    if (listaPreRecurs.length > 0) {
      listaPreRecurs = listaPreRecurs.filter((prerecur) => (prerecur.preguntaid == this.props.match.params.id));
    }

    if (listaPreRecurs.length > 0) {
      listaPreRecurs.forEach(prerecur => {
        listaPublicosNoAñadidos = listaPublicosNoAñadidos.filter(recurso => prerecur.recursoid != recurso.id && recurso.privado == false && recurso.user != this.state.currentUser.id);
      });
    } else {
      listaPublicosNoAñadidos = listaPublicosNoAñadidos.filter(recurso => recurso.privado == false && recurso.user != this.state.currentUser.id);
    }
    //===PROPIAS NO AÑADIDAS====
    if (listaPreRecurs.length > 0) {
      listaPreRecurs.forEach(prerecur => {
        listaPropiosNoAñadidos = listaPropiosNoAñadidos.filter(recurso => prerecur.recursoid != recurso.id && recurso.user == this.state.currentUser.id);
      });
    } else {
      listaPropiosNoAñadidos = listaPropiosNoAñadidos.filter(recurso => recurso.user == this.state.currentUser.id);
    }
    //==========AÑADIDA=========
    if (listaPreRecurs.length > 0) {
      listaPreRecurs.forEach(prerecur => {
        recursoAñadido = recursoAñadido.filter(recurso => prerecur.recursoid == recurso.id);
      });
    } else {
      recursoAñadido = [];
    }
    //==========================
    const respuesta = await this.retrieveFiltroPorPagina(listaPublicosNoAñadidos);
    this.setState({
      listapaginacionPublicas: respuesta[0],
      paginacionPublicas: respuesta[1]
    });
    const respuesta1 = await this.retrieveFiltroPorPagina(listaPropiosNoAñadidos);
    this.setState({
      listapaginacionPropias: respuesta1[0],
      paginacionPropias: respuesta1[1]
    });
    //===========================
    this.setState({
      recursosPublicos: listaPublicosNoAñadidos,
      recursosPublicosSearch: listaPublicosNoAñadidos,
      recursosPropios: listaPropiosNoAñadidos,
      recursosPropiosSearch: listaPropiosNoAñadidos,
      recursosAñadidos: recursoAñadido
    });
  }

  async retrieveRecursos() {
    await RecursoDataService.getAll()
      .then(response => {
        this.setState({
          recursos: response.data
        });
      })
      .catch(e => {
        //console.log(e);
      });
  }

  async retrievePreRecurs() {
    await PreRecurDataService.getAll()
      .then(response => {
        this.setState({
          prerecurs: response.data
        });
      })
      .catch(e => {
        //console.log(e);
      });
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

  openModalTutorial() {
    this.setState({
      visibletutorial: true
    });
  }

  closeModalTutorial() {
    this.setState({
      visibletutorial: false
    });
  }

  async getPregunta(id) {
    await PreguntaDataService.get(id)
      .then(response => {
        this.setState({
          currentPregunta: response.data
        });
      })
      .catch(e => {
        //console.log(e);
      });
  }

  setActiveRecurso(recurso) {
    this.setState({
      currentRecurso: recurso
    });
    this.openModal();
  }

  async savePreRecur(recurso, pregunta) {
    var data = {
      preguntaid: pregunta,
      recursoid: recurso
    };

    await PreRecurDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          preguntaid: response.data.pregunta,
          recursoid: response.data.recurso
        });
        //console.log(response.data);
        this.setState({
          currentRecurso: null
        });
      })
      .catch(e => {
        //console.log(e);
      });
    await this.retrievePre();
  }

  async savePreRecurCopia(idrecurso, idpregunta) {
    var id = idrecurso + idpregunta + this.state.currentUser.id;
    await PreRecurDataService.create2(id)
      .then(response => {
        //console.log(response.data);
        this.setState({
          currentRecurso: null
        });
      })
      .catch(e => {
        //console.log(e);
      });
    await this.retrievePre();
    await this.closeModalCopia()
  }

  //-----------_DELETE----------
  async deletePrerecurso(id) {
    const recursoañadido = this.state.prerecurs.filter(prerecur => (id == prerecur.recursoid && prerecur.preguntaid == this.props.match.params.id));
    const deleteid = recursoañadido[0].id;
    await PreRecurDataService.delete(deleteid)
      .then(response => {
        //console.log(response.data);
        this.setState({
          currentRecurso: null
        });
      })
      .catch(e => {
        //console.log(e);
      });
    await this.retrievePre();
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

  async delete(id) {
    await RecursoDataService.delete(id)
      .then(response => {
        //console.log(response.data);
      })
      .catch(e => {
        //console.log(e);
      })
    await this.retrievePre();
    await this.setState({
      visibleeliminar: false,
    });
  }

  closeModaleliminar() {
    this.setState({
      visibleeliminar: false,
      deleteid: "",
    });
  }
  openModaleliminar(id) {
    this.setState({
      visibleeliminar: true,
      deleteid: id,
    });
  }
  //Modal Copia
  closeModalCopia() {
    this.setState({
      visiblecopia: false,
      idpregunta: "",
      idrecurso: ""
    });
  }

  openModalCopia(idpreguntaa, idrecursoo) {
    this.setState({
      visiblecopia: true,
      idpregunta: idpreguntaa,
      idrecurso: idrecursoo
    });
  }

  async cambioTabPropios() {
    await this.setState({
      tab: "propias",
      variantColor1: "primary",
      variantColor2: "secondary"
    });
  }


  async cambioTabPublicos() {
    await this.setState({
      tab: "publicas",
      variantColor1: "secondary",
      variantColor2: "primary"
    });
  }

  //================================================
  //==================PAGINACION====================
  async retrieveFiltroPorPagina(listaporpaginar) {
    const listapageNumbers = [];
    for (let i = 1; i <= Math.ceil(listaporpaginar.length / this.state.postsPerPage); i++) {
      listapageNumbers.push(i);
    };
    const indexOfLastPost = 1 * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
    const currentPosts = listaporpaginar.slice(indexOfFirstPost, indexOfLastPost);

    return [currentPosts, listapageNumbers];
  }
  //-------------------------------------------------
  async refreshFiltroPorPagina(pag, lista, tipo) {
    const indexOfLastPost = pag * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
    const currentPosts = lista.slice(indexOfFirstPost, indexOfLastPost);

    if (tipo == "publicas") {
      this.setState({
        listapaginacionPublicas: currentPosts,
        paginatePubli: pag
      });
      //console.log("publicas")
    }
    if (tipo == "propias") {
      this.setState({
        listapaginacionPropias: currentPosts,
        paginateProp: pag
      });
      //console.log("propias")
    }
  }
  //==========================================

  render() {
    const { filtropreguntas, paginacionPublicas, recursos, currentPregunta,
      prerecurs, currentUser, showUserBoard, showModeratorBoard, showTeacherBoard, tiporecurso,
      deleteid, listapaginacionPublicas, listapaginacionPropias, paginacionPropias, recursosAñadidos,
      recursosPublicos, recursosPropios, recursosPropiosSearch, recursosPublicosSearch, paginateProp,
      paginatePubli, variantColor1, variantColor2 } = this.state;

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
                <h2 class="center">Centro de edición</h2>
                <p>
                  Crea, agrega o elimina un recurso para tu pregunta.
                </p>
              </div>

              <div className="list row">
                {recursosAñadidos.length >= 1 ? (

                  <div className="col-md-7">
                    {recursosAñadidos.map((recurso) => (
                      <>
                        <Card style={{ width: '18rem' }}>
                          <h4 align="center" >
                            Recurso Añadido
                          </h4>
                          {recurso.type == "documento" && (
                            <Card.Img variant="top" src="../../../documento.png" width="auto" height="200" />
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
                            <button onClick={() => this.deletePrerecurso(recurso.id)} class="btn btn-success">Desvincular</button>
                          </Card.Body>
                        </Card>
                      </>
                    ))}
                  </div>
                ) : (
                  <div className="col-md-7">
                    <div align="center">
                      <img src="../../../feedback.png" width="400" height="350" />
                    </div>
                  </div>
                )}

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
              <hr></hr>
              <br></br>


              {currentPregunta.tipo == "Arrastrable" ? (
                <div class="img-center">
                  <br></br>
                  <p class="center">La pregunta no es compatible con los recursos.</p>
                </div>
              ) : (
                <Tab.Container defaultActiveKey="misrecursos">
                  <div>
                    <Nav fill >
                      <Nav.Item>
                        <ListGroup.Item action variant={variantColor1} eventKey="misrecursos" onClick={() => this.cambioTabPropios()}> Mis Recursos</ListGroup.Item>
                      </Nav.Item>
                      <Nav.Item>
                        <ListGroup.Item action variant={variantColor2} eventKey="listarecursos" onClick={() => this.cambioTabPublicos()}> Recursos Públicos</ListGroup.Item>
                      </Nav.Item>
                    </Nav>
                  </div>
                  <div>
                  </div>
                  <div class="tabdiv">
                    <Tab.Content justify variant="tabs" defaultActiveKey="misrecursos">
                      <Tab.Pane eventKey="misrecursos">
                        {listapaginacionPropias.length == 0 ? (
                          <div>
                            <br></br>
                            <br></br>

                            <h3>
                              No tienes Recursos en tu lista.
                            </h3>
                          </div>
                        ) : (
                          <>
                            <br />
                            {/* <div className="input-group mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Busca por Titulo del Recurso"
                            value={this.props.query}
                            onChange={this.searchRecurso}
                          />
                          </div> */}
                            <div className="list row">
                              {listapaginacionPropias.map((recurso) => (
                                <>
                                  <Card style={{ width: '18rem' }}>
                                    {recurso.type == "documento" && (
                                      <Card.Img variant="top" src="../../../documento.png" width="auto" height="200" />
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
                                      {recursosAñadidos.length > 0 ? (
                                        <>
                                        </>
                                      ) : (
                                        <>
                                          <Button onClick={() => this.savePreRecur(recurso.id, currentPregunta.id)} class="btn btn-primary">Agregar Recurso</Button>
                                          <br />
                                          <br />
                                        </>
                                      )}
                                      <button onClick={() => this.openModaleliminar(recurso.id)} class="btn btn-danger">Borrar Recurso</button>
                                    </Card.Body>
                                  </Card>
                                </>
                              ))}
                            </div>
                            <div>
                              {paginacionPropias.length > 1 && (
                                <nav>
                                  <Pagination>
                                    {paginacionPropias.map(number => (
                                      <Pagination.Item key={number} active={paginateProp == number}
                                        onClick={() => this.refreshFiltroPorPagina(number, recursosPropios, "propias")}>
                                        {number}
                                      </Pagination.Item>
                                    ))}
                                  </Pagination>
                                </nav>
                              )}
                            </div>
                          </>
                        )}
                      </Tab.Pane>
                      <Tab.Pane eventKey="listarecursos">

                        <br />
                        {/* <div className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Busca por Titulo del Recurso"
                              value={this.props.query}
                              onChange={this.searchRecurso}
                            />
                            </div> */}
                        <div className="list row">
                          {listapaginacionPublicas.map((recurso) => (
                            <>
                              <Card style={{ width: '18rem' }}>
                                {recurso.type == "documento" && (
                                  <Card.Img variant="top" src="../../../documento.png" width="auto" height="200" />
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
                                {recursosAñadidos.length > 0 ? (
                                  <>
                                  </>
                                ) : (
                                  <>
                                    <Card.Body align="center">
                                      {/* <Button onClick={() => this.savePreRecur(recurso.id, currentPregunta.id)} class="btn btn-primary">Agregar Recurso</Button> */}
                                      {/* <Button onClick={() => this.savePreRecurCopia(recurso.id, currentPregunta.id)} class="btn btn-primary">Copia</Button> */}
                                      <Button onClick={() => this.openModalCopia(recurso.id, currentPregunta.id)} class="btn btn-primary">Agregar Recurso</Button>
                                    </Card.Body>
                                  </>
                                )}
                              </Card>
                            </>
                          ))}


                        </div>
                        <div>
                          {paginacionPublicas.length > 1 && (
                            <nav>
                              <Pagination>
                                {paginacionPublicas.map(number => (
                                  <Pagination.Item key={number} active={paginatePubli == number}
                                    onClick={() => this.refreshFiltroPorPagina(number, recursosPublicos, "publicas")}>
                                    {number}
                                  </Pagination.Item>
                                ))}
                              </Pagination>
                            </nav>
                          )}
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </div>
                </Tab.Container>
              )}

              <br></br>
              <div>
                <Button onClick={() => this.openModal()} > Nuevo Recurso </Button>
              </div>
              <br></br>
              <div hidden>
                <iframe
                  name="hiddenFrameImg"
                  id="hiddenFrameImg"
                  width="0"
                  height="0"
                >
                </iframe>
              </div>
              <div hidden>
                <iframe
                  name="hiddenFrameDoc"
                  id="hiddenFrameDoc"
                  width="0"
                  height="0"
                >
                </iframe>
              </div>
              <div hidden>
                <iframe
                  name="hiddenFrameYT"
                  id="hiddenFrameYT"
                  width="0"
                  height="0"
                >
                </iframe>
              </div>

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


                              <form
                                target="hiddenFrameImg"
                                method="post"
                                action="https://spring-boot-back.herokuapp.com/api/recursos/add"
                                enctype="multipart/form-data"
                              >
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
                                <input type="file" name="resource" id="files" multiple />
                                <br></br>
                                <br></br>
                                <input type="submit" />
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
                              <form target="hiddenFrameDoc" method="post" action="https://spring-boot-back.herokuapp.com/api/recursos/add" enctype="multipart/form-data">
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
                                <input type="submit" />
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
                              <form target="hiddenFrameYT" method="post" action="https://spring-boot-back.herokuapp.com/api/recursos/add" enctype="multipart/form-data">
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
                                <div className="list row">
                                  <div className="col-md-6">
                                    <p>*Indica los minutos esenciales en tu link.</p>
                                  </div>
                                  <div className="col-md-3">
                                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Como subir un link</Tooltip>}>
                                      <Button size="sm" variant="light" onClick={() => this.openModalTutorial()}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-images" viewBox="0 0 16 16">
                                          <path fill-rule="evenodd" d="M12.002 4h-10a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1zm-10-1a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-10zm4 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                          <path fill-rule="evenodd" d="M4 2h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1v1a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2h1a1 1 0 0 1 1-1z" />
                                        </svg>
                                      </Button>
                                    </OverlayTrigger>
                                    <br></br>
                                  </div>
                                </div>
                                Minuto Inicial:
                                <input type="time" step="1" name="inicialmin" />
                                &nbsp;
                                Minuto Final:
                                <input type="time" step="1" name="finalmin" />
                                <br></br>
                                <br></br>
                                <input type="submit" />
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

              <Modal show={this.state.visibleeliminar} width="1000" height="500" effect="fadeInUp" onClickAway={() => this.closeModaleliminar()}>
                <Modal.Header>
                  <Modal.Title align="center">¿Deséa eliminar?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                  <button className="btn btn-warning" onClick={() => this.closeModaleliminar()}>
                    Cerrar
                  </button>
                  <button className="btn btn-success" onClick={() => this.delete(deleteid)}>
                    Eliminar
                  </button>
                </Modal.Footer>
              </Modal>

              <Modal show={this.state.visiblecopia} width="1000" height="500" effect="fadeInUp" onClickAway={() => this.closeModalCopia()}>
                <Modal.Header>
                  <Modal.Title align="center">¿Deséa agregar una copia de este recurso a tu lista y ligarlo a esta pregunta?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                  <button className="btn btn-warning" onClick={() => this.closeModalCopia()}>
                    Cerrar
                  </button>
                  <button className="btn btn-success" onClick={() => this.savePreRecurCopia(this.state.idpregunta, this.state.idrecurso)}>
                    Agregar
                  </button>
                </Modal.Footer>
              </Modal>

              <Modal show={this.state.visibletutorial} width="1000" height="500" effect="fadeInUp" onClickAway={() => this.closeModalTutorial()}>
                <Modal.Header closeButton onClick={() => this.closeModalTutorial()} >
                  <Modal.Title>Como subir un link</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                  <div>
                    <img src="../../../tutorial.gif" width="470" height="275" />
                  </div>
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