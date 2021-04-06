import React, { Component } from "react";
import RamoDataService from "../../services/ramo.service";
import CarreRamoDataService from "../../services/carreramo.service";
import CarreraDataService from "../../services/carrera.service";
import CursoDataService from "../../services/curso.service";
import { Link } from "react-router-dom";

import {
  Table, Button, Modal, Form, Col, Row, OverlayTrigger, Tooltip
} from 'react-bootstrap';

import AuthService from "../../services/auth.service";

export default class RamosList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchNombre = this.onChangeSearchNombre.bind(this);
    this.retrieveRamos = this.retrieveRamos.bind(this);
    this.setActiveRamo = this.setActiveRamo.bind(this);
    this.searchNombre = this.searchNombre.bind(this);
    this.onChangeCodigo = this.onChangeCodigo.bind(this);
    this.onChangeNombre = this.onChangeNombre.bind(this);
    this.onChangeSemestre = this.onChangeSemestre.bind(this);
    this.onChangeDescripcion = this.onChangeDescripcion.bind(this);
    this.onChangeCarreraid = this.onChangeCarreraid.bind(this);
    this.onChangeCodigo2 = this.onChangeCodigo.bind(this);
    this.onChangeNombre2 = this.onChangeNombre.bind(this);
    this.onChangeSemestre2 = this.onChangeSemestre.bind(this);
    this.onChangeDescripcion2 = this.onChangeDescripcion.bind(this);

    this.onChangeCodigo3 = this.onChangeCodigo3.bind(this);
    this.onChangeSemestre3 = this.onChangeSemestre3.bind(this);
    this.onChangeAño = this.onChangeAño.bind(this);
    this.onChangeDescripcion3 = this.onChangeDescripcion3.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeActivo = this.onChangeActivo.bind(this);
    this.onChangeRamoid = this.onChangeRamoid.bind(this);

    this.saveRamo = this.saveRamo.bind(this);
    this.updateRamo = this.updateRamo.bind(this);
    this.deleteRamo = this.deleteRamo.bind(this);

    this.state = {
      id: null,
      codigo: "",
      nombre: "",
      semestre: "",
      descripcion: "",
      año: "",
      password: "",
      activo: "",
      carreraid: "",
      ramoid: "",
      carreras: [],

      currentRamo: null,
      message: "",
      ramos: [],
      visibleedit: false,
      visibleañadir: false,
      visiblecurso: false,
      currentIndex: -1,
      searchNombre: "",
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    this.retrieveRamos();
    this.retrieveCarreras();
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

  openModalEdit() {
    this.setState({
      visibleedit: true
    });
  }

  closeModalEdit() {
    this.setState({
      visibleedit: false,
      id: null,
      codigo: "",
      nombre: "",
      semestre: "",
      descripcion: "",
      año: "",
      password: "",
      activo: "",
      ramoid: "",
      carreraid: "",
      currentRamo: null,
      currentIndex: -1
    });
  }

  openModalAñadir() {
    this.setState({
      visibleañadir: true
    });
  }

  closeModalAñadir() {
    this.setState({
      visibleañadir: false,
      id: null,
      codigo: "",
      nombre: "",
      semestre: "",
      descripcion: "",
      año: "",
      password: "",
      activo: "",
      ramoid: "",
      carreraid: "",
      currentRamo: null,
      currentIndex: -1
    });
  }

  openModalCurso() {
    this.setState({
      visiblecurso: true
    });
  }

  closeModalCurso() {
    this.setState({
      visiblecurso: false,
      id: null,
      codigo: "",
      nombre: "",
      semestre: "",
      descripcion: "",
      año: "",
      password: "",
      activo: "",
      ramoid: "",
      carreraid: "",
      currentRamo: null,
      currentIndex: -1
    });
  }

  onChangeSearchNombre(e) {
    const searchNombre = e.target.value;

    this.setState({
      searchNombre: searchNombre
    });
  }

  searchNombre() {
    RamoDataService.findByNombre(this.state.searchNombre)
      .then(response => {
        this.setState({
          ramos: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  setActiveRamo(ramo, index) {
    this.setState({
      currentRamo: ramo,
      currentIndex: index,
      ramoid: ramo.id
    });
  }

  retrieveCarreras() {
    CarreraDataService.getAll()
      .then(response => {
        this.setState({
          carreras: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  retrieveRamos() {
    RamoDataService.getAll()
      .then(response => {
        this.setState({
          ramos: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    this.retrieveCarreras();
  }

  //----------------------------ADD/RAMO+CARRERA---------------------------

  onChangeCodigo(e) {
    this.setState({
      codigo: e.target.value
    });
  }

  onChangeNombre(e) {
    this.setState({
      nombre: e.target.value
    });
  }

  onChangeSemestre(e) {
    this.setState({
      semestre: e.target.value
    });
  }

  onChangeDescripcion(e) {
    this.setState({
      descripcion: e.target.value
    });
  }

  onChangeCarreraid(e) {
    this.setState({
      carreraid: e.target.value
    });
  }

  async saveRamo() {
    var data = {
      codigo: this.state.codigo,
      nombre: this.state.nombre,
      semestre: this.state.semestre,
      descripcion: this.state.descripcion
    };

    await RamoDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          codigo: response.data.codigo,
          nombre: response.data.nombre,
          semestre: response.data.semestre,
          descripcion: response.data.descripcion,

          submitted: true
        });
        console.log(response.data);

        var data = {
          carreraid: this.state.carreraid,
          ramoid: response.data.id
        };

        CarreRamoDataService.create(data)
          .then(response => {
            this.setState({
              id: response.data.id,
              carreraid: response.data.carreraid,
              ramoid: response.data.id,

              submitted: true
            });
            console.log(response.data);
            this.retrieveRamos();
            this.closeModalAñadir();
          })
          .catch(e => {
            console.log(e);
          });
      })
      .catch(e => {
        console.log(e);
      });
  }

  //----------------------------EDIT/RAMO---------------------------

  onChangeCodigo2(e) {
    const codigo = e.target.value;

    this.setState(prevState => ({
      currentRamo: {
        ...prevState.currentRamo,
        codigo: codigo
      }
    }));
  }

  onChangeNombre2(e) {
    const nombre = e.target.value;

    this.setState(prevState => ({
      currentRamo: {
        ...prevState.currentRamo,
        nombre: nombre
      }
    }));
  }

  onChangeSemestre2(e) {
    const semestre = e.target.value;

    this.setState(prevState => ({
      currentRamo: {
        ...prevState.currentRamo,
        semestre: semestre
      }
    }));
  }

  onChangeDescripcion2(e) {
    const descripcion = e.target.value;

    this.setState(prevState => ({
      currentRamo: {
        ...prevState.currentRamo,
        descripcion: descripcion
      }
    }));
  }

  onChangeCarreraid2(e) {
    const carreraid = e.target.value;

    this.setState(prevState => ({
      currentRamo: {
        ...prevState.currentRamo,
        carreraid: carreraid
      }
    }));
  }

  updateRamo() {
    RamoDataService.update(this.state.currentRamo.id,
      this.state.currentRamo
    )
      .then(response => {
        console.log(response.data);
        this.retrieveRamos();
        this.closeModalEdit();
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteRamo(id) {
    RamoDataService.delete(id)
      .then(response => {
        console.log(response.data);
        this.retrieveRamos();
      })
      .catch(e => {
        console.log(e);
      })
  }

  //----------------------------ADD/CURSO---------------------------

  onChangeCodigo3(e) {
    this.setState({
      codigo: e.target.value
    });
  }

  onChangeSemestre3(e) {
    this.setState({
      semestre: e.target.value
    });
  }

  onChangeAño(e) {
    this.setState({
      año: e.target.value
    });
  }

  onChangeDescripcion3(e) {
    this.setState({
      descripcion: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  onChangeActivo(e) {
    this.setState({
      activo: e.target.value
    });
  }

  onChangeRamoid(e) {
    this.setState({
      ramoid: e.target.value
    });
  }

  saveCurso() {
    var data = {
      codigo: this.state.codigo,
      semestre: this.state.semestre,
      año: this.state.año,
      descripcion: this.state.descripcion,
      password: this.state.password,
      activo: this.state.activo,
      ramoid: this.state.ramoid
    };

    CursoDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          codigo: response.data.codigo,
          semestre: response.data.semestre,
          año: response.data.año,
          descripcion: response.data.descripcion,
          password: response.data.password,
          activo: response.data.activo,
          ramoid: response.data.ramoid,

          submitted: true
        });
        console.log(response.data);
        this.retrieveRamos();
        this.closeModalCurso();
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { searchNombre, ramos, currentRamo, currentIndex, currentUser, showUserBoard, showModeratorBoard, showTeacherBoard, carreras } = this.state;

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
            <div className="list row">
              <div className="col-md-8">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by nombre"
                    value={searchNombre}
                    onChange={this.onChangeSearchNombre}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={this.searchNombre}
                    >
                      Search
                  </button>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <h4>Ramos List</h4>

                <div>
                  <Button onClick={() => this.openModalAñadir()} > Agregar Ramo </Button>
                </div>

                <br></br>

                <Table striped bordered hover>
                  <tbody>
                    <tr>
                      <td>
                        {ramos &&
                          ramos.map((ramo, index) => (
                            <li className={"list-group-item " + (index === currentIndex ? "active" : "")} onClick={() => this.setActiveRamo(ramo, index)} key={index}>
                              <Row>
                                <Col md="8" >
                                  {ramo.nombre}
                                </Col>
                                <Col md="auto">
                                  {' '}
                                  <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Editar</Tooltip>}>
                                    <Button size="sm" variant="info" onClick={() => (this.setActiveRamo(ramo, index), this.openModalEdit())} key={index}>
                                      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                      </svg>
                                    </Button>
                                  </OverlayTrigger>
                                  {' '}
                                  <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Borrar</Tooltip>}>
                                    <Button size="sm" variant="danger" onClick={() => (this.deleteRamo(ramo.id))} >
                                      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                      </svg>
                                    </Button>
                                  </OverlayTrigger>
                                  {' '}
                                  <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Agregar Curso</Tooltip>}>
                                    <Button size="sm" variant="warning" onClick={() => (this.setActiveRamo(ramo, index), this.openModalCurso())} key={index}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                      </svg>
                                    </Button>
                                  </OverlayTrigger>
                                </Col>
                              </Row>
                            </li>
                          ))}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>

              <div className="col-md-6">
                {currentRamo ? (
                  <div>
                    <h4>Detalles</h4>
                    <div>
                      <label>
                        <strong>Nombre:</strong>
                      </label>{" "}
                      {currentRamo.nombre}
                    </div>
                    <div>
                      <label>
                        <strong>Codigo:</strong>
                      </label>{" "}
                      {currentRamo.codigo}
                    </div>
                    <div>
                      <label>
                        <strong>Descripcion:</strong>
                      </label>{" "}
                      {currentRamo.descripcion}
                    </div>
                  </div>
                ) : (
                  <div>
                    <br />
                    <p>Please click on a Ramo...</p>
                  </div>
                )}
              </div>

              <Modal show={this.state.visibleedit} size="xl" >
                <Modal.Header closeButton onClick={() => this.closeModalEdit()} >
                  <Modal.Title>Editar Ramo</Modal.Title>
                </Modal.Header>
                {currentRamo ? (
                  <Modal.Body>
                    <Form>
                      <Form.Row>
                        <Col md="8">
                          <label htmlFor="codigo">Codigo</label>
                          <input
                            type="text"
                            className="form-control"
                            id="codigo"
                            required
                            defaultValue={currentRamo.codigo}
                            onChange={this.onChangeCodigo2}
                            name="codigo"
                          />
                        </Col>
                      </Form.Row>
                      <Form.Row>
                        <Col md="3">
                          <label htmlFor="nombre">Nombre</label>
                          <input
                            type="text"
                            className="form-control"
                            id="nombre"
                            required
                            defaultValue={currentRamo.nombre}
                            onChange={this.onChangeNombre2}
                            name="nombre"
                          />
                        </Col>
                        <Col md="3">
                          <label htmlFor="semestre">Semestre</label>
                          <input
                            type="text"
                            className="form-control"
                            id="semestre"
                            required
                            defaultValue={currentRamo.semestre}
                            onChange={this.onChangeSemestre2}
                            name="semestre"
                          />
                        </Col>

                        <Col md="5">
                          <label htmlFor="descripcion">Descripcion</label>
                          <input
                            type="text"
                            className="form-control"
                            id="descripcion"
                            required
                            defaultValue={currentRamo.descripcion}
                            onChange={this.onChangeDescripcion2}
                            name="descripcion"
                          />
                        </Col>
                        <Col md="3">
                          <label htmlFor="carreras">Carrera:</label>
                          <select
                            type="text"
                            className="form-control"
                            id="carreraid"
                            required
                            onChange={this.onChangeCarreraid2}
                            name="carreraid"
                            defaultValue="...">
                            <option disabled>...</option>
                            {carreras &&
                              carreras.map((carrera) => (
                                <option value={carrera.id}>{carrera.malla}</option>
                              ))}
                          </select>
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
                  <Button variant="primary" onClick={() => this.updateRamo()}>
                    Editar
                        </Button>
                </Modal.Footer>
              </Modal>

              <Modal show={this.state.visibleañadir} size="xl" >
                <Modal.Header closeButton onClick={() => this.closeModalAñadir()} >
                  <Modal.Title>Crear Ramo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Row>
                      <Col md="8">
                        <label htmlFor="codigo">Codigo</label>
                        <input
                          type="text"
                          className="form-control"
                          id="codigo"
                          required
                          value={this.state.codigo}
                          onChange={this.onChangeCodigo}
                          name="codigo"
                        />
                      </Col>

                    </Form.Row>
                    <Form.Row>
                      <Col md="3">
                        <label htmlFor="nombre">Nombre</label>
                        <input
                          type="text"
                          className="form-control"
                          id="nombre"
                          required
                          value={this.state.nombre}
                          onChange={this.onChangeNombre}
                          name="nombre"
                        />
                      </Col>
                      <Col md="3">
                        <label htmlFor="semestre">Semestre</label>
                        <input
                          type="text"
                          className="form-control"
                          id="semestre"
                          required
                          value={this.state.semestre}
                          onChange={this.onChangeSemestre}
                          name="semestre"
                        />
                      </Col>
                      <Col md="5">
                        <label htmlFor="descripcion">Descripcion</label>
                        <input
                          type="text"
                          className="form-control"
                          id="descripcion"
                          required
                          value={this.state.descripcion}
                          onChange={this.onChangeDescripcion}
                          name="descripcion"
                        />
                      </Col>
                      <Col md="3">
                        <label htmlFor="carreras">Carrera:</label>
                        <select
                          type="text"
                          className="form-control"
                          id="carreraid"
                          required
                          onChange={this.onChangeCarreraid}
                          name="carreraid"
                          defaultValue="...">
                          <option disabled>...</option>
                          {carreras &&
                            carreras.map((carrera) => (
                              <option value={carrera.id}>{carrera.malla}</option>
                            ))}
                        </select>
                      </Col>
                    </Form.Row>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="primary" onClick={() => this.saveRamo()}>
                    Agregar
                        </Button>
                </Modal.Footer>
              </Modal>

              <Modal show={this.state.visiblecurso} size="xl" >
                <Modal.Header closeButton onClick={() => this.closeModalCurso()} >
                  <Modal.Title>Nuevo Curso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Row>
                      <Col md="8">
                        <label htmlFor="codigo">Codigo</label>
                        <input
                          type="text"
                          className="form-control"
                          id="codigo"
                          required
                          value={this.state.codigo}
                          onChange={this.onChangeCodigo3}
                          name="codigo"
                        />
                      </Col>
                    </Form.Row>
                    <Form.Row>
                      <Col md="3">
                        <label htmlFor="semestre">Semestre</label>
                        <input
                          type="text"
                          className="form-control"
                          id="semestre"
                          required
                          value={this.state.semestre}
                          onChange={this.onChangeSemestre3}
                          name="semestre"
                        />
                      </Col>
                      <Col md="3">
                        <label htmlFor="año">Año</label>
                        <input
                          type="text"
                          className="form-control"
                          id="año"
                          required
                          value={this.state.año}
                          onChange={this.onChangeAño}
                          name="año"
                        />
                      </Col>
                      <Col md="5">
                        <label htmlFor="descripcion">Descripcion</label>
                        <input
                          type="text"
                          className="form-control"
                          id="descripcion"
                          required
                          value={this.state.descripcion}
                          onChange={this.onChangeDescripcion3}
                          name="descripcion"
                        />
                      </Col>
                      <Col md="5">
                        <label htmlFor="password">Password</label>
                        <input
                          type="text"
                          className="form-control"
                          id="password"
                          required
                          value={this.state.password}
                          onChange={this.onChangePassword}
                          name="password"
                        />
                      </Col>
                      <Col md="5">
                        <label htmlFor="activo">Activo:</label>
                        <select
                          type="text"
                          className="form-control"
                          id="activo"
                          required
                          onChange={this.onChangeActivo}
                          name="activo"
                          defaultValue="...">
                          <option disabled>...</option>
                          <option value="true">activo</option>
                          <option value="false">desactivado</option>
                        </select>
                      </Col>
                      <Col md="5">
                        <label htmlFor="ramoid">ID del Ramo</label>
                        <input
                          type="text"
                          className="form-control"
                          id="ramoid"
                          required
                          value={this.state.ramoid}
                          onChange={this.onChangeRamoid}
                          name="ramoid"
                          disabled
                        />
                      </Col>
                    </Form.Row>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="primary" onClick={() => this.saveCurso()}>
                    Crear
                        </Button>
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