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
    this.retrieveRamos = this.retrieveRamos.bind(this);
    this.setActiveRamo = this.setActiveRamo.bind(this);
    this.searchNombre = this.searchNombre.bind(this);
    this.onChangeCodigo = this.onChangeCodigo.bind(this);
    this.onChangeNombre = this.onChangeNombre.bind(this);
    this.onChangeSemestre = this.onChangeSemestre.bind(this);
    this.onChangeDescripcion = this.onChangeDescripcion.bind(this);

    this.onChangeCodigo3 = this.onChangeCodigo3.bind(this);
    this.onChangeSemestre3 = this.onChangeSemestre3.bind(this);
    this.onChangeAño = this.onChangeAño.bind(this);
    this.onChangeDescripcion3 = this.onChangeDescripcion3.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeActivo = this.onChangeActivo.bind(this);
    this.onChangeRamoid = this.onChangeRamoid.bind(this);

    //EDIT
    this.onChangeCodigo2 = this.onChangeCodigo2.bind(this);
    this.onChangeNombre2 = this.onChangeNombre2.bind(this);
    this.onChangeSemestre2 = this.onChangeSemestre2.bind(this);
    this.onChangeDescripcion2 = this.onChangeDescripcion2.bind(this);

    this.saveRamo = this.saveRamo.bind(this);
    this.updateRamo = this.updateRamo.bind(this);
    this.deleteRamo = this.deleteRamo.bind(this);

    this.deleteCarreRamo = this.deleteCarreRamo.bind(this);
    this.saveCarreRam = this.saveCarreRamo.bind(this);


    this.state = {
      currentRamo: null,
      id: null,
      codigo: "",
      nombre: "",
      semestre: "",
      descripcion: "",
      año: "",
      password: "",
      activo: "",
      ramoid: "",
      carreras: [],
      carreraid: "",
      query: '',

      currentRamo: {
        id: null,
        codigo: "",
        nombre: "",
        semestre: "",
        descripcion: "",
        año: "",
        password: "",
        activo: "",
        ramoid: ""
      },

      currentRamo: null,
      message: "",
      ramos: [],
      carreramos: [],
      filtrocarreras: [],
      filtrocarrerasañadidas: [],
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

  async componentDidMount() {
    this.setState({
      usuario: AuthService.getCurrentUser()
    });
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showUserBoard: user.roles.includes("user"),
        showModeratorBoard: user.roles.includes("moderator"),
        showTeacherBoard: user.roles.includes("teacher"),
      });
    }
    await this.retrieveRamos();
    await this.retrieveCarreras();
    await this.retrieveRamoCarreras();
  }
  async retrieveCarreras() {
    const peticion = await fetch("https://spring-boot-back.herokuapp.com/api/carreras/all");
    const respuesta = await peticion.json();
    this.setState({ carreras: respuesta });
  }

  async retrieveRamos() {
    const peticion = await fetch("https://spring-boot-back.herokuapp.com/api/ramos/all");
    const respuesta = await peticion.json();
    this.setState({ ramos: respuesta });
  }
  async retrieveRamoCarreras() {
    const peticion = await fetch("https://spring-boot-back.herokuapp.com/api/carreramos/all");
    const respuesta = await peticion.json();
    this.setState({ carreramos: respuesta });
  }
  async retrieveRamoCarrerasNoAñadidos() {
    const listacarreras = this.state.carreras.slice();
    const listacarreramos = this.state.carreramos.slice();
    const listafiltroramocarrerasñadidos = [];

    listacarreramos && listacarreramos.map((carreramo) => {
      if (carreramo.ramoid == this.state.currentRamo.id) {
        listafiltroramocarrerasñadidos.push({
          idramocarrera: carreramo.id,
          idramo: carreramo.ramoid,
          idcarrera: carreramo.carreraid
        })
      };
    });
    var contador = 0;
    listafiltroramocarrerasñadidos && listafiltroramocarrerasñadidos.map((carreramo) => {
      listacarreras && listacarreras.map((carreras, index) => {
        if (carreras.id == carreramo.idcarrera) {
          listacarreras.splice(index, 1);
        };
      });
    });


    this.setState({ filtrocarreras: listacarreras });
    console.log("Lista Carreras")
    console.log(this.state.filtrocarreras);

  }


  async retrieveRamoCarreraAñadidos() {
    const listacarreras = this.state.carreras.slice();
    const listacarreramos = this.state.carreramos.slice();
    const listafiltroramocarrerasñadidos = [];

    listacarreramos && listacarreramos.map((carreramo) => {
      if (carreramo.ramoid == this.state.currentRamo.id) {
        listacarreras && listacarreras.map((carrera) => {
          if (carreramo.carreraid == carrera.id) {
            listafiltroramocarrerasñadidos.push({
              malla: carrera.malla,
              idcarrera: carrera.id,
              idcarreramo: carreramo.id
            })
          };
        });
      };
    });
    this.setState({ filtrocarrerasañadidas: listafiltroramocarrerasñadidos });
  }


  newRamo() {
    this.setState({
      id: null,
      codigo: "",
      nombre: "",
      semestre: "",
      descripcion: "",
      año: "",
      password: "",
      activo: "",
      ramoid: "",
      currentRamo: null,
      currentIndex: -1
    });
  }

  openModal(id) {
    this.setState({
      visible: true,
      carreraid: id
    });
  }

  closeModal() {
    this.setState({
      visible: false
    });
  }
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

  openModalAñadir() {
    this.setState({
      visibleañadir: true
    });
  }

  closeModalAñadir() {
    this.setState({
      visibleañadir: false,
    });
  }

  openModalCurso() {
    this.setState({
      visiblecurso: true
    });
  }

  closeModalCurso() {
    this.setState({
      visiblecurso: false
    });
  }

  async searchNombre(e) {
    const searchNombre = await e.target.value;

    this.setState({
      searchNombre: searchNombre
    });
    await RamoDataService.findByNombre(this.state.searchNombre)
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

  async setActiveRamo(ramo, index) {
    await this.setState({
      currentRamo: ramo,
      currentIndex: index,
      ramoid: ramo.id
    });
    await this.retrieveRamoCarrerasNoAñadidos();
    await this.retrieveRamoCarreraAñadidos();
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
      })
      .catch(e => {
        console.log(e);
      });
    await this.retrieveRamos();
    await this.retrieveCarreras();
    this.closeModalAñadir();
    this.newRamo();
  }

  async saveCarreRamo() {
    var data = {
      carreraid: this.state.carreraid,
      ramoid: this.state.currentRamo.id
    };

    await CarreRamoDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          carreraid: response.data.carreraid,
          ramoid: response.data.ramoid,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    await this.retrieveRamos();
    await this.retrieveCarreras();
    await this.retrieveRamoCarreras();
    await this.retrieveRamoCarreraAñadidos();
    await this.retrieveRamoCarrerasNoAñadidos();
    this.closeModal();
  }
  async refreshList() {
    await this.retrieveRamos();
    await this.retrieveCarreras();
    await this.retrieveRamoCarreras();
    await this.retrieveRamoCarreraAñadidos();
    await this.retrieveRamoCarrerasNoAñadidos();
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

  async updateRamo() {
    console.log(this.state.currentRamo.id);
    console.log(this.state.currentRamo.codigo);
    await RamoDataService.update(
      this.state.currentRamo.id,
      this.state.currentRamo
    )
      .then(response => {
        //console.log(response.data);
        this.setState({
          message: "The pregunta was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });

    //------------------------
    await this.retrieveRamos();
    await this.retrieveCarreras();
    await this.retrieveRamoCarreras();

    this.closeModalEdit();
    this.newRamo();

  }

  async deleteRamo(id) {
    await RamoDataService.delete(id)
      .then(response => {
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      })
    await this.retrieveRamos();
    await this.retrieveCarreras();
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

  async saveCurso() {
    var data = {
      codigo: this.state.codigo,
      semestre: this.state.semestre,
      año: this.state.año,
      descripcion: this.state.descripcion,
      password: this.state.password,
      activo: this.state.activo,
      ramoid: this.state.ramoid
    };

    await CursoDataService.create(data)
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
      })
      .catch(e => {
        console.log(e);
      });
    await this.retrieveRamos();
    await this.retrieveCarreras();
    this.closeModalCurso();

  }
  async deleteCarreRamo(id) {

    await CarreRamoDataService.delete(id)
      .then(response => {
        console.log(response.data)
      })
      .catch(e => {
        console.log(e);
      });
    await this.retrieveRamos();
    await this.retrieveCarreras();
    await this.retrieveRamoCarreras();
    await this.retrieveRamoCarreraAñadidos();
    await this.retrieveRamoCarrerasNoAñadidos();
  }

  render() {
    const { searchNombre, ramos, currentRamo, currentIndex, currentUser,
      showUserBoard, showModeratorBoard, showTeacherBoard, carreras, filtrocarreras, filtrocarrerasañadidas,  query} = this.state;

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
          {showTeacherBoard || (showModeratorBoard && (
            <div className="list row">
              <div className="col-md-8">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by nombre"
                    value={this.props.query}
                    onChange={this.searchNombre}
                  />
                </div>
              </div>

              <div className="col-md-5">
                <h4>Lista de Ramos</h4>

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
                            

                  <div className="col-md-2">
                    {currentRamo ? (
                      <>
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

                            <div>
                              <Button onClick={() => this.openModalAñadir()} > Agregar Ramo </Button>
                            </div>

                      </>
                    ) : (
                    
                      <>
                          <div>
                            <br />
                            <br />
                            <br />
                            <br />

                            <p>Haz click en un Ramo por favor...</p>
                          </div>
                      
                          <div>
                            <Button onClick={() => this.openModalAñadir()} > Agregar Ramo </Button>
                          </div>
                      </>
                      
                    )}
                  </div>
                  

              { (showModeratorBoard) ? (
                <>
                  {((filtrocarreras.length != 0)) ? (
                    <div className="col-md-5">
                      <h4>Lista de Carreras</h4>

                      <Table striped bordered hover>
                        <tbody>
                          <tr>
                            <td>
                              {filtrocarreras && filtrocarreras.map((carrera) => (
                                <li className="list-group-item ">
                                  <Row>
                                    <Col md="8" >
                                      {carrera.malla}
                                    </Col>
                                    <Col md="auto">
                                      <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Asignar Carrera</Tooltip>}>
                                        <Button size="sm" variant="warning" onClick={() => this.openModal(carrera.id)}>
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
                  ) : (
                    <div>
                      {/* <h4>Lista de Carreras</h4>
                      <br/>
                    <p>Please click on a Ramo...</p> */}
                    </div>
                  )}

                  {((filtrocarreras.length == 0) && (filtrocarrerasañadidas.length > 0)) ? (
                    <div className="col-md-5">
                      <h4>Lista de Carreras</h4>
                      <br />
                      <p>No existen mas Carreras que puedan ser añadidas...</p>

                    </div>
                  ) : (
                    <div>
                      {/* <h4>Lista de Carreras</h4>
                      <br/>
                    <p>Please click on a Ramo...</p> */}
                    </div>
                  )}

                </>
              ) : (
                <></>
              )}

              { (showModeratorBoard) ? (
                <>
                  {(filtrocarrerasañadidas.length != 0) ? (
                    <div className="col-md-5">
                      <h4>Lista de Carreras Añadidas</h4>
                      <Table striped bordered hover>
                        <tbody>
                          <tr>
                            <td>
                              {filtrocarrerasañadidas && filtrocarrerasañadidas.map((carrera) => (
                                <li className="list-group-item ">
                                  <Row>
                                    <Col md="8" >
                                      {carrera.malla}
                                    </Col>
                                    <Col md="auto">
                                      <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Desvincular Carrera</Tooltip>}>
                                        <Button size="sm" variant="danger" onClick={() => this.deleteCarreRamo(carrera.idcarreramo)}>
                                          <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
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
                  ) : (
                    <></>
                  )}
                   {((filtrocarrerasañadidas.length == 0)&& (filtrocarreras.length > 0))? (
                    <div className="col-md-5">
                      <h4>Lista de Carreras Añadidas</h4>
                      <br/>
                      <p>No tienes ninguna Carrera asignada a este Ramo...</p>

                    </div>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )}

              <Modal show={this.state.visibleedit} size="xl" >
                <Modal.Header closeButton onClick={() => this.closeModalEdit()} >
                  <Modal.Title>Editar Ramo</Modal.Title>
                </Modal.Header>
                {currentRamo ? (
                  <Modal.Body>
                    <Form>
                      <Form.Row>
                        <Col md="4">
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
                        <Col md="4">
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
                        <Col md="4">
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
                      </Form.Row>
                      <Form.Row>
                        <Col >
                          <label htmlFor="descripcion">Descripcion</label>
                          <Form.Control
                            as="textarea" rows={3}
                            className="form-control"
                            id="descripcion"
                            required
                            defaultValue={currentRamo.descripcion}
                            onChange={this.onChangeDescripcion2}
                            name="descripcion"
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
                  <Button variant="primary" onClick={() => this.updateRamo()}>
                    Editar
                        </Button>
                </Modal.Footer>
              </Modal>

              <Modal show={this.state.visible} width="1000" height="500" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                <Modal.Header>
                  <Modal.Title align="center">¿Deséa asignar esta Carrera?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                  <button className="btn btn-warning" onClick={() => this.closeModal()}>
                    Close
                  </button>
                  <button className="btn btn-success" onClick={() => (this.saveCarreRamo())}>
                    Agregar
                  </button>
                </Modal.Footer>
              </Modal>

              <Modal show={this.state.visibleañadir} size="xl" >
                <Modal.Header closeButton onClick={() => this.closeModalAñadir()} >
                  <Modal.Title>Crear Ramo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Row>
                      <Col md="4">
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
                      <Col md="4">
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
                      <Col md="4">
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

                    </Form.Row>
                    <Form.Row>
                      <Col>
                        <label htmlFor="descripcion">Descripcion</label>
                        <Form.Control as="textarea" rows={3}
                          className="form-control"
                          id="descripcion"
                          required
                          value={this.state.descripcion}
                          onChange={this.onChangeDescripcion}
                          name="descripcion"
                        />
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