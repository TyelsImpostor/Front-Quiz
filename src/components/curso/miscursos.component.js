import React, { Component } from "react";
import CursoDataService from "../../services/curso.service";
import CurUsuDataService from "../../services/curusu.service";
import { Link } from "react-router-dom";

import {
  striped, bordered, hover, Table, Button, Text, View, Overview, Modal,
  InputGroup, FormControl, Form, Col, Alert, Jumbotron, Container, Badge, Row, OverlayTrigger, Overlay, Tooltip, Card, ListGroup, Accordion, Spinner
} from 'react-bootstrap';
import AuthService from "../../services/auth.service";

export default class MisCursos extends Component {
  constructor(props) {
    super(props);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveCurso = this.setActiveCurso.bind(this);
    this.searchCodigo = this.searchCodigo.bind(this);
    this.deleteCurso = this.deleteCurso.bind(this);
    //UPDATE CURSO
    this.onChangeCodigo = this.onChangeCodigo.bind(this);
    this.onChangeSemestre = this.onChangeSemestre.bind(this);
    this.onChangeAño = this.onChangeAño.bind(this);
    this.onChangeDescripcion = this.onChangeDescripcion.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeActivo = this.onChangeActivo.bind(this);
    this.onChangeRamoid = this.onChangeRamoid.bind(this);
    this.updateCurso = this.updateCurso.bind(this);
    this.retrieveFiltroCursos = this.retrieveFiltroCursos.bind(this);

    this.state = {
      cursos: [],
      curusus: [],
      filtrocursosañadidas: [],
      currentCurso: null,
      id: null,
      codigo: "",
      semestre: "",
      año: "",
      descripcion: "",
      password: "",
      activo: "",
      ramoid: "",
      currentIndex: -1,
      searchCodigo: "",
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
      query: "",
      menssageAlertEdit: "",
      showAlertEditRamo: false,
      typeAlertEditRamo: "",
      visualRamoEdit: true,
      spinner: true,
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
    await this.retrievePre();

  }


  async retrieveCursos() {
    await CursoDataService.getAll()
      .then(response => {
        this.setState({
          cursos: response.data
        })
      })
      .catch(e => {
        //console.log(e);
      });
  }
  async retrieveCursoUsuario() {
    await CurUsuDataService.getAll()
      .then(response => {
        this.setState({
          curusus: response.data
        })
      })
      .catch(e => {
        //console.log(e);
      });
  }
  async retrievePre() {
    try {
      await Promise.all([this.retrieveCursos(), this.retrieveCursoUsuario()]);
      await this.retrieveFiltroCursos();
      await this.setState({ spinner: false });
    } catch (error) {
      //console.log(error);
    }
  }


  async retrieveFiltroCursos() {
    var listacursos = this.state.cursos.slice();
    var listacurusus = this.state.curusus.slice();
    var listafiltrocursosañadidas = [];

    listacurusus && listacurusus.map((curusus) => {
      if (curusus.usuarioid == this.state.currentUser.id) {
        listacursos && listacursos.map((curso) => {
          if (curusus.cursoid == curso.id) {
            listafiltrocursosañadidas.push({
              id: curso.id,
              codigo: curso.codigo,
              semestre: curso.semestre,
              año: curso.año,
              descripcion: curso.descripcion,
              password: curso.password,
              activo: curso.activo,
              ramoid: curso.ramoid,

              idcurusus: curusus.id
            })
          };
        });
      };
    });
    this.setState({ filtrocursosañadidas: listafiltrocursosañadidas });
    //console.log(this.state.filtrocursosañadidas);
  }

  refreshList() {
    this.retrieveCursos();
    this.setState({
      currentCurso: null,
      currentIndex: -1
    });
  }

  setActiveCurso(curso, index) {
    this.setState({
      currentCurso: curso,
      currentIndex: index
    });
  }

  searchCodigo(event) {
    const query = event.target.value;
    this.setState({ query: query });
    CursoDataService.findByCodigo(query)
      .then(response => {
        this.setState({
          cursos: response.data
        });
        this.retrieveFiltroCursos();
      })
      .catch(e => {
        //console.log(e);
      });
  };

  async deleteCurso(id) {
    await CursoDataService.delete(id)
      .then(response => {
        //console.log(response.data);
      })
      .catch(e => {
        //console.log(e);
      });
    await this.retrieveCursos();
    await this.retrieveCursoUsuario();
    await this.retrieveFiltroCursos();

  }
  //Modal Edit
  openModalEdit() {
    this.setState({
      visibleedit: true
    });
  }
  closeModalEdit() {
    this.setState({
      visibleedit: false
    });
  }
  async handleVerificarEditCurso() {
    if ((3 > this.state.currentCurso.codigo.length && this.state.currentCurso.codigo.length > 0) ||
      (4 > this.state.currentCurso.año.length && this.state.currentCurso.año.length > 0) ||
      (3 > this.state.currentCurso.password.length && this.state.currentCurso.password.length > 0) ||
      (3 > this.state.currentCurso.activo.length && this.state.currentCurso.activo.length > 0)
    ) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "Los campos deben tener un minimo de caracteres.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "warning"
      })
    } else if (this.state.currentCurso.año.length == 0) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo 'Año' no puede estar vacío.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "danger"
      })
    } else if (this.state.currentCurso.año.length > 30) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo 'Año' no puede tener tantos caracteres.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "danger"
      })
    } else if (this.state.currentCurso.semestre.length == 0) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo 'Semestre' no puede estar vacío.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "danger"
      })
    } else if (this.state.currentCurso.codigo.length == 0) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo 'Codigo' no puede estar vacío.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "danger"
      })
    } else if (this.state.currentCurso.codigo.length > 100) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo 'Codigo' no puede tener tantos caracteres.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "danger"
      })
    } else if (this.state.currentCurso.password.length == 0) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo 'Contraseña' no puede estar vacío.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "danger"
      })
    } else if (this.state.currentCurso.password.length > 30) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo 'Contraseña' no puede tener tantos caracteres.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "danger"
      })
    } else if (this.state.currentCurso.descripcion.length > 400) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo 'Descripcion' no puede tener tantos caracteres.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "danger"
      })
    } else if (this.state.currentCurso.activo.length == 0) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo 'Activo' no puede estar vacío.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "danger"
      })
    } else {
      this.setState({
        menssageAlertEdit: "",
        showAlertEditRamo: false,
        typeAlertEditRamo: "",
        visualRamoEdit: false,
      })
    }
  }
  async onChangeCodigo(e) {
    await this.setState(function (prevState) {
      return {
        currentCurso: {
          ...prevState.currentCurso,
          codigo: e.target.value
        }
      };
    });
    await this.handleVerificarEditCurso();
  }
  async onChangeSemestre(e) {
    await this.setState(function (prevState) {
      return {
        currentCurso: {
          ...prevState.currentCurso,
          semestre: e.target.value
        }
      };
    });
    await this.handleVerificarEditCurso();
  }
  async onChangeAño(e) {
    await this.setState(function (prevState) {
      return {
        currentCurso: {
          ...prevState.currentCurso,
          año: e.target.value
        }
      };
    });
    await this.handleVerificarEditCurso();
  }
  async onChangeDescripcion(e) {
    await this.setState(function (prevState) {
      return {
        currentCurso: {
          ...prevState.currentCurso,
          descripcion: e.target.value
        }
      };
    });
    await this.handleVerificarEditCurso();
  }
  async onChangePassword(e) {
    await this.setState(function (prevState) {
      return {
        currentCurso: {
          ...prevState.currentCurso,
          password: e.target.value
        }
      };
    });
    await this.handleVerificarEditCurso();
  }
  async onChangeActivo(e) {
    await this.setState(function (prevState) {
      return {
        currentCurso: {
          ...prevState.currentCurso,
          activo: e.target.value
        }
      };
    });
    await this.handleVerificarEditCurso();
  }
  async onChangeRamoid(e) {
    this.setState(function (prevState) {
      return {
        currentCurso: {
          ...prevState.currentCurso,
          ramoid: e.target.value
        }
      };
    });
  }

  async updateCurso() {
    await CursoDataService.update(
      this.state.currentCurso.id,
      this.state.currentCurso
    )
      .then(response => {
        //console.log(response.data);
        this.setState({
          message: "The curso was updated successfully!"
        });
      })
      .catch(e => {
        //console.log(e);
      });

    //-------------------------
    this.closeModalEdit();
    await this.retrievePre();
    await this.retrieveFiltroCursos();

  }

  render() {
    const { filtrocursosañadidas, cursos, currentCurso, currentIndex, currentUser,
      showUserBoard, showModeratorBoard, showTeacherBoard, query, spinner } = this.state;

    return (
      <div>
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

          {currentUser && (
            <div>
              <div class="img-center">
                <h2 class="center">Tus Cursos inscritos</h2>
                <p>
                  Todos los cursos inscritos por el Usuario, apareceran aqui.
                </p>
              </div>

              <div className="list row">

                <div className="col-md-7">
                  <div align="center">
                    <img src="../../../cursos.jpeg" width="450" height="350" />
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
                        <Card.Body>Esta es la interfaz más importante para el usuario, en esta interfaz podrás ver todos tus cursos inscritos y por medio de esta interfaz, podrás entrar a tus cursos.</Card.Body>
                      </Accordion.Collapse>
                      <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                          ¿Donde puedo resolver Quiz?
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="1">
                        <Card.Body>Una vez que entres a un curso, podrás resolver los Quiz que estén dentro..</Card.Body>
                      </Accordion.Collapse>
                    </Accordion>
                  </Table>
                </div>
              </div>

              <br></br>
              <hr></hr>
              <br></br>

              <Table striped bordered hover>
                {(spinner) ? (
                  <div class="img-center">
                    <Spinner class="center" variant="primary" animation="border" />
                  </div>
                ) : (
                  <>
                    <tbody>
                      <div center>
                        <div className="input-group mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar"
                            value={this.props.query}
                            onChange={this.searchCodigo}
                          ></input>
                        </div>
                      </div>
                      {filtrocursosañadidas.length > 0 ? (
                        <div className="row">
                          {filtrocursosañadidas && filtrocursosañadidas.map((curso, index) => (
                            <>
                              <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" src="https://www.noticias.ltda/wp-content/uploads/2019/02/Curso-online.png" width="auto" height="200" />

                                <Card.Body>
                                  <Card.Title><p>{curso.codigo}</p></Card.Title>
                                </Card.Body>
                                <ListGroup className="list-group-flush"></ListGroup>
                                <Card.Body align="center">
                                  <Button href={"/quizcur/" + curso.id} class="btn btn-primary">Ingresar al Curso</Button>
                                </Card.Body>
                                <ListGroup className="list-group-flush"></ListGroup>
                                {(showTeacherBoard || showModeratorBoard) && (
                                  <>
                                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Editar</Tooltip>}>
                                      <Button size="sm" variant="info" onClick={() => (this.setActiveCurso(curso, index), this.openModalEdit())} key={index}>
                                        <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-pencil" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                          <path fill-rule="evenodd" d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                        </svg>
                                      </Button>
                                    </OverlayTrigger>
                                    <ListGroup className="list-group-flush"></ListGroup>

                                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Borrar</Tooltip>}>
                                      <Button size="sm" variant="danger" onClick={() => this.deleteCurso(curso.id)} >
                                        <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                          <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                        </svg>
                                      </Button>
                                    </OverlayTrigger>
                                  </>
                                )}
                              </Card>
                            </>
                          ))}
                        </div>
                      ) : (
                        <>
                          <br />
                          <br />
                          <br />
                          <h2 class="img-center"> No posee ningún curso registrado... </h2>
                          <a class="img-center" href="/curso/list"> Registrar curso... </a>

                          <br />
                          <br />
                          <br />
                        </>
                      )}
                    </tbody>
                  </>
                )}
              </Table>
            </div>
          )}

          {/* <div>
            <Button onClick={() => this.openModalCreate()} > Agregar Curso </Button>
          </div> */}

          <Modal show={this.state.visibleedit} size="xl" >
            <Modal.Header closeButton onClick={() => this.closeModalEdit()} >
              <Modal.Title>Editar Curso</Modal.Title>
            </Modal.Header>
            {currentCurso ? (
              <Modal.Body>
                <Form>
                  <Form.Row>
                    <Col md="3">
                      <label htmlFor="codigo">Codigo</label>
                      <input
                        type="text"
                        className="form-control"
                        id="codigo"
                        required
                        defaultValue={currentCurso.codigo}
                        onChange={this.onChangeCodigo}
                        name="codigo"
                      />
                    </Col>
                    <Col md="3">
                      <label htmlFor="semestre">Semestre</label>
                      <input
                        type="text"
                        className="form-control"
                        id="semestre"
                        required
                        defaultValue={currentCurso.semestre}
                        onChange={this.onChangeSemestre}
                        name="semestre"
                      />
                    </Col>

                    <Col md="1" align="center">

                      <label htmlFor="user">Activo</label>
                      <input defaultChecked={currentCurso.activo} type="checkbox" class="make-switch" id="price_check"
                        name="pricing" data-on-color="primary" data-off-color="info" value="true" size="10"
                        onChange={this.onChangeActivo}></input>
                    </Col>

                    <Col md="3">
                      <label htmlFor="user">Año</label>
                      <input
                        type="text"
                        className="form-control"
                        id="user"
                        required
                        defaultValue={currentCurso.año}
                        onChange={this.onChangeAño}
                        name="user"
                      />
                    </Col>
                    <Col md="2">
                      <label htmlFor="password">Password</label>
                      <input
                        type="text"
                        className="form-control"
                        id="user"
                        required
                        defaultValue={currentCurso.password}
                        onChange={this.onChangePassword}
                        name="password"
                      />
                    </Col>
                  </Form.Row>

                  <Form.Row>
                    <label htmlFor="enunciado">Descripcion</label>
                    <Form.Control as="textarea" rows={3}
                      className="form-control"
                      id="enunciado"
                      required
                      defaultValue={currentCurso.descripcion}
                      onChange={this.onChangeDescripcion}
                      name="enunciado"
                    >
                    </Form.Control>
                  </Form.Row>
                  <Form.Row hidden>
                    <Col md="3">
                      <label htmlFor="ramoid">Id del Ramo</label>
                      <input
                        type="text"
                        className="form-control"
                        id="ramoid"
                        required
                        defaultValue={currentCurso.ramoid}
                        onChange={this.onChangeRamoid}
                        name="ramoid"
                        disabled
                      />
                    </Col>
                    <Col md="3">
                      <label htmlFor="id">Id</label>
                      <input
                        type="text"
                        className="form-control"
                        id="id"
                        required
                        defaultValue={currentCurso.id}
                        //onChange={this.onChangeCodigo}
                        name="id"
                        disabled
                      />
                    </Col>
                  </Form.Row>
                </Form>
                <br />
                <Alert show={this.state.showAlertEditRamo} variant={this.state.typeAlertEditRamo}>
                  {this.state.menssageAlertEdit}
                </Alert>
              </Modal.Body>

            ) : (
              <div>
                <br />
              </div>
            )}
            <Modal.Footer>
              <Button variant="secondary" onClick={() => this.closeModalEdit()} >
                Cerrar
              </Button>

              <Button variant="primary" disabled={this.state.visualRamoEdit} onClick={this.updateCurso}>
                Editar
              </Button>
            </Modal.Footer>

          </Modal>
        </header>
      </div>
    );
  }
}