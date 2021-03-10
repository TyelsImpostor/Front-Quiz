import React, { Component } from "react";
import CursoDataService from "../../services/curso.service";
import { Link } from "react-router-dom";

import {
  striped, bordered, hover, Table, Button, Text, View, Overview, Modal,
  InputGroup, FormControl, Form, Col, Jumbotron, Container, Badge, Row, OverlayTrigger, Overlay, Tooltip, Card, ListGroup
} from 'react-bootstrap';
import AuthService from "../../services/auth.service";

export default class MisCursos extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchTitulo = this.onChangeSearchTitulo.bind(this);
    this.retrieveCursos = this.retrieveCursos.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveCurso = this.setActiveCurso.bind(this);
    this.searchTitulo = this.searchTitulo.bind(this);
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
      searchTitulo: "",
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
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
    await this.retrieveCursos();
    await this.retrieveCursoUsuario();
    await this.retrieveFiltroCursos();

  }

  onChangeSearchTitulo(e) {
    const searchTitulo = e.target.value;

    this.setState({
      searchTitulo: searchTitulo
    });
  }

  async retrieveCursos() {
    var peticion = await fetch("https://spring-boot-back.herokuapp.com/api/cursos/all");
    var respuesta = await peticion.json();
    this.setState({ cursos: respuesta });
  }

  async retrieveCursoUsuario() {
    var peticion = await fetch("https://spring-boot-back.herokuapp.com/api/curusus/all");
    var respuesta = await peticion.json();
    this.setState({ curusus: respuesta });
  }
  async retrieveFiltroCursos() {
    var listacursos = this.state.cursos;
    var listacurusus = this.state.curusus;
    var listafiltrocursosañadidas = this.state.filtrocursosañadidas;

    listacurusus && listacurusus.map((curusus) => (
      (curusus.usuarioid == this.state.currentUser.id) ? (
        listacursos && listacursos.map((curso) => (
          (curusus.cursoid == curso.id) ? (
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
          ) : (
              <div></div>
            )
        ))
      ) : (
          <div></div>
        )
    ));
    // console.log(listafiltrocursosañadidas);
    //console.log(this.state.currentUser.id);
    //console.log(this.state.cursos);

    this.setState({ filtrocursosañadidas: listafiltrocursosañadidas });

    console.log(this.state.filtrocursosañadidas);

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

  searchTitulo() {
    CursoDataService.findByTitulo(this.state.searchTitulo)
      .then(response => {
        this.setState({
          cursos: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }
  deleteCurso(id) {
    CursoDataService.delete(id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/curso/list')
      })
      .catch(e => {
        console.log(e);
      });
    //Actualizar LISTA  
    var contador = 0;
    var lista = this.state.cursos;
    lista.map((registro) => {
      if (registro.id == id) {
        lista.splice(contador, 1);
      }
      contador++;
    });
    this.setState({ cursos: lista });
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

  onChangeCodigo(e) {
    const codigo = e.target.value;

    this.setState(function (prevState) {
      return {
        currentCurso: {
          ...prevState.currentCurso,
          codigo: codigo
        }
      };
    });
  }

  onChangeSemestre(e) {
    const semestre = e.target.value;

    this.setState(function (prevState) {
      return {
        currentCurso: {
          ...prevState.currentCurso,
          semestre: semestre
        }
      };
    });
  }

  onChangeAño(e) {
    const año = e.target.value;

    this.setState(function (prevState) {
      return {
        currentCurso: {
          ...prevState.currentCurso,
          año: año
        }
      };
    });
  }

  onChangeDescripcion(e) {
    const descripcion = e.target.value;

    this.setState(function (prevState) {
      return {
        currentCurso: {
          ...prevState.currentCurso,
          descripcion: descripcion
        }
      };
    });
  }

  onChangePassword(e) {
    const password = e.target.value;

    this.setState(function (prevState) {
      return {
        currentCurso: {
          ...prevState.currentCurso,
          password: password
        }
      };
    });
  }

  onChangeActivo(e) {
    const activo = e.target.value;

    this.setState(function (prevState) {
      return {
        currentCurso: {
          ...prevState.currentCurso,
          activo: activo
        }
      };
    });
  }

  onChangeRamoid(e) {
    const ramoid = e.target.value;

    this.setState(function (prevState) {
      return {
        currentCurso: {
          ...prevState.currentCurso,
          ramoid: ramoid
        }
      };
    });
  }
  updateCurso() {
    CursoDataService.update(
      this.state.currentCurso.id,
      this.state.currentCurso
    )
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "The curso was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
    //Editar LISTA ---------------------------
    var contador = 0;
    var lista = this.state.cursos;
    lista.map((registro) => {
      if (this.state.currentCurso.id == registro.id) {
        lista[contador].codigo = this.state.currentCurso.codigo;
        lista[contador].semestre = this.state.currentCurso.semestre;
        lista[contador].año = this.state.currentCurso.año;
        lista[contador].descripcion = this.state.currentCurso.descripcion;
        lista[contador].password = this.state.currentCurso.password;
        lista[contador].activo = this.state.currentCurso.activo;
      }
      contador++;
    });
    this.setState({ cursos: lista });
    //-------------------------
    this.closeModalEdit();
  }

  render() {
    const { filtrocursosañadidas, searchTitulo, cursos, currentCurso, currentIndex, currentUser, showUserBoard, showModeratorBoard, showTeacherBoard } = this.state;

    return (
      <div>
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

          { currentUser && (

            <div>
              <Jumbotron fluid="md">
                <Container >
                  <h1 class="display-5">Mis Cursos</h1>
                </Container>
              </Jumbotron>

              <Table striped bordered hover>
                <tbody>
                  <div>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by titulo"
                        value={searchTitulo}
                        onChange={this.onChangeSearchTitulo}
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={this.searchTitulo}
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                  <tr>
                    <td>

                    {filtrocursosañadidas && filtrocursosañadidas.map((curso, index) => (
                      <Card style={{ width: '18rem' }}>
                          <Card.Img variant="top" src="https://www.noticias.ltda/wp-content/uploads/2019/02/Curso-online.png" width="auto" height="200" />

                        <Card.Body>
                          <Card.Title>{curso.codigo}</Card.Title>
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
                    ))}


                    </td>
                  </tr>
                </tbody>
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

              <Button variant="primary" onClick={this.updateCurso}>
                Editar
                        </Button>
            </Modal.Footer>

          </Modal>

        </header>
      </div>
    );
  }
}