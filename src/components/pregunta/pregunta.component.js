import React, { useState, Component, useEffect } from "react";
import PreguntaDataService from "../../services/pregunta.service";
import { Link } from "react-router-dom";

import {
  striped, bordered, hover, Table, Button, Text, View, Overview, Modal,
  InputGroup, FormControl, Form, Col, Jumbotron, Container, Badge, Row, OverlayTrigger, Overlay, Tooltip
} from 'react-bootstrap';
import AuthService from "../../services/auth.service";

//TAG
import TagPreDataService from "../../services/tagpre.service";
import TagDataService from "../../services/tag.service";


import Pagination from "../Pagination";


export default class Profe extends Component {

  constructor(props) {
    super(props);
    this.onChangeSearchTitulo = this.onChangeSearchTitulo.bind(this);
    this.retrievePreguntas = this.retrievePreguntas.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActivePregunta = this.setActivePregunta.bind(this);
    this.searchTitulo = this.searchTitulo.bind(this);
    //ADD PREGUNTA
    this.onChangeTitulo = this.onChangeTitulo.bind(this);
    this.onChangeTipo = this.onChangeTipo.bind(this);
    this.onChangeEnunciado = this.onChangeEnunciado.bind(this);
    this.onChangeTiempoRespuesta = this.onChangeTiempoRespuesta.bind(this);
    this.onChangePuntaje = this.onChangePuntaje.bind(this);
    this.onChangeRandom = this.onChangeRandom.bind(this);
    this.onChangeUserid = this.onChangeUserid.bind(this);
    this.savePregunta = this.savePregunta.bind(this);
    this.newPregunta = this.newPregunta.bind(this);
    //OPCIONES
    this.onChangeOpcion1 = this.onChangeOpcion1.bind(this);
    this.onChangeRespuesta1 = this.onChangeRespuesta1.bind(this);
    this.onChangeOpcion2 = this.onChangeOpcion2.bind(this);
    this.onChangeRespuesta2 = this.onChangeRespuesta2.bind(this);
    this.onChangeOpcion3 = this.onChangeOpcion3.bind(this);
    this.onChangeRespuesta3 = this.onChangeRespuesta3.bind(this);
    this.onChangeOpcion4 = this.onChangeOpcion4.bind(this);
    this.onChangeRespuesta4 = this.onChangeRespuesta4.bind(this);
    this.onChangeOpcion5 = this.onChangeOpcion5.bind(this);
    this.onChangeRespuesta5 = this.onChangeRespuesta5.bind(this);
    //DELETE
    this.deletePregunta = this.deletePregunta.bind(this);
    //UPDATE
    this.updatePregunta = this.updatePregunta.bind(this);
    this.onChangeTitulo2 = this.onChangeTitulo2.bind(this);
    this.onChangeTipo2 = this.onChangeTipo2.bind(this);
    this.onChangeEnunciado2 = this.onChangeEnunciado2.bind(this);
    this.onChangeTiempoRespuesta2 = this.onChangeTiempoRespuesta2.bind(this);
    this.onChangePuntaje2 = this.onChangePuntaje2.bind(this);
    this.onChangeRandom2 = this.onChangeRandom2.bind(this);
    this.onChangeUserid2 = this.onChangeUserid2.bind(this);
    //OPCIONES
    this.onChangeOpcion12 = this.onChangeOpcion12.bind(this);
    this.onChangeRespuesta12 = this.onChangeRespuesta12.bind(this);
    this.onChangeOpcion22 = this.onChangeOpcion22.bind(this);
    this.onChangeRespuesta22 = this.onChangeRespuesta22.bind(this);
    this.onChangeOpcion32 = this.onChangeOpcion32.bind(this);
    this.onChangeRespuesta32 = this.onChangeRespuesta32.bind(this);
    this.onChangeOpcion42 = this.onChangeOpcion42.bind(this);
    this.onChangeRespuesta42 = this.onChangeRespuesta42.bind(this);
    this.onChangeOpcion52 = this.onChangeOpcion52.bind(this);
    this.onChangeRespuesta52 = this.onChangeRespuesta52.bind(this);
    //TAG
    this.newTagPre = this.newTagPre.bind(this);
    this.retrieveTags = this.retrieveTags.bind(this);
    this.onChangeTagid = this.onChangeTagid.bind(this);


    this.state = {
      preguntas: [],
      currentPregunta: null,
      currentIndex: -1,
      searchTitulo: "",

      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
      currentUser2: AuthService.getCurrentUser(),


      //ADD PREGUNTA
      id: null,
      titulo: "",
      tipo: "",
      enunciado: "",
      tiempoRespuesta: "",
      puntaje: "",
      random: "",
      user: "",
      usuario: "",
      opcion1: "",
      respuesta1: "",
      opcion2: "",
      respuesta2: "",
      opcion3: "",
      respuesta3: "",
      opcion4: "",
      respuesta4: "",
      opcion5: "",
      respuesta5: "",


      //TAG
      tagid: "",
      tags: [],

      //------
      query: '',
      results: {},
      loading: false,
      message: '',
      //--------
      postsPerPage: 6,
      paginate: 1,
      filtropaginaciones: [],
      pageNumbers: [],
      indexOfLastPost: '',
      indexOfFirstPost: '',
      currentPosts: '',


      submitted: false,
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
    this.retrieveTags();
    await this.retrievePreguntas();
    this.retrieveFiltroPorPagina();
  }


  async retrieveFiltroPorPagina() {

    const listapageNumbers = [];
    for (let i = 1; i <= Math.ceil(this.state.preguntas.length / this.state.postsPerPage); i++) {
      listapageNumbers.push(i);
    };
    const indexOfLastPost = await (this.state.paginate * this.state.postsPerPage);
    const indexOfFirstPost = await (indexOfLastPost - this.state.postsPerPage);
    const currentPosts = await this.state.preguntas.slice(indexOfFirstPost, indexOfLastPost);
    this.setState({ filtropaginaciones: currentPosts });
    this.setState({ pageNumbers: listapageNumbers });
    //console.log(this.state.filtropaginaciones );
    //console.log(this.state.paginate);
  }


  async refreshFiltroPorPagina(e) {
    await this.setState({ paginate: e });

    const listapageNumbers = [];
    for (let i = 1; i <= Math.ceil(this.state.preguntas.length / this.state.postsPerPage); i++) {
      listapageNumbers.push(i);
    };

    const indexOfLastPost = await (this.state.paginate * this.state.postsPerPage);
    const indexOfFirstPost = await (indexOfLastPost - this.state.postsPerPage);
    const currentPosts = await this.state.preguntas.slice(indexOfFirstPost, indexOfLastPost);
    this.setState({ filtropaginaciones: currentPosts });
    this.setState({ pageNumbers: listapageNumbers });
    console.log(this.state.filtropaginaciones);
    console.log(this.state.paginate);
  }

  //TAGS
  retrieveTags() {
    TagDataService.getAll()
      .then(response => {
        this.setState({
          tags: response.data
        });
        //console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }


  onChangeTagid(e) {
    this.setState({
      tagid: e.target.value
    });
  }
  //-------------------------
  onChangeSearchTitulo(e) {
    const searchTitulo = e.target.value;

    this.setState({
      searchTitulo: searchTitulo
    });
  }

  async retrievePreguntas() {
    const peticion = await fetch("https://spring-boot-back.herokuapp.com/api/preguntas/all");
    const respuesta = await peticion.json();
    this.setState({ preguntas: respuesta });

  }

  async refreshList() {
    this.retrievePreguntas();
    this.retrieveFiltroPorPagina();
    await this.refreshFiltroPorPagina();
    this.setState({
      currentPregunta: null,
      currentIndex: -1
    });
  }

  setActivePregunta(pregunta, index) {
    this.setState({
      currentPregunta: pregunta,
      currentIndex: index
    });
  }

  searchTitulo() {
    PreguntaDataService.findByTitulo(this.state.searchTitulo)
      .then(response => {
        this.setState({
          preguntas: response.data
        });
        //console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });

  }
  //-----------------------------------------------------------------------------------

  //Modal Agregar
  closeModal() {
    this.setState({
      visible: false
    });
  }
  openModalCreate() {
    this.setState({
      visible: true
    });
  }
  //Modal Show
  openModalShow() {
    this.setState({
      visibleshow: true
    });
  }

  closeModalShow() {
    this.setState({
      visibleshow: false
    });
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
  //Modal Recurso
  openModalRecurso() {
    this.setState({
      visiblerecurso: true
    });
  }
  closeModalRecurso() {
    this.setState({
      visiblerecurso: false
    });
  }
  //Modal Edit
  openModalOpciones() {
    this.setState({
      visibleopciones: true
    });
  }
  closeModalOpciones() {
    this.setState({
      visibleopciones: false
    });
  }

  //---------ADD PREGUNTA----------

  onChangeTitulo(e) {
    this.setState({
      titulo: e.target.value
    });
  }

  onChangeTipo(e) {
    this.setState({
      tipo: e.target.value
    });
  }

  onChangeEnunciado(e) {
    this.setState({
      enunciado: e.target.value
    });
  }

  onChangeTiempoRespuesta(e) {
    this.setState({
      tiempoRespuesta: e.target.value
    });
  }

  onChangePuntaje(e) {
    this.setState({
      puntaje: e.target.value
    });
  }

  onChangeRandom(e) {
    this.setState({
      random: e.target.value
    });
  }

  onChangeUserid(e) {
    this.setState({
      user: e.target.value
    });
  }
  //-------------------------

  onChangeOpcion1(e) {
    this.setState({
      opcion1: e.target.value
    });
  }
  onChangeRespuesta1(e) {
    this.setState({
      respuesta1: e.target.value
    });
  }
  onChangeOpcion2(e) {
    this.setState({
      opcion2: e.target.value
    });
  }
  onChangeRespuesta2(e) {
    this.setState({
      respuesta2: e.target.value
    });
  }
  onChangeOpcion3(e) {
    this.setState({
      opcion3: e.target.value
    });
  }
  onChangeRespuesta3(e) {
    this.setState({
      respuesta3: e.target.value
    });
  }
  onChangeOpcion4(e) {
    this.setState({
      opcion4: e.target.value
    });
  }
  onChangeRespuesta4(e) {
    this.setState({
      respuesta4: e.target.value
    });
  }
  onChangeOpcion5(e) {
    this.setState({
      opcion5: e.target.value
    });
  }
  onChangeRespuesta5(e) {
    this.setState({
      respuesta5: e.target.value
    });
  }
  //---------------------------

  savePregunta() {
    var data = {
      titulo: this.state.titulo,
      tipo: this.state.tipo,
      enunciado: this.state.enunciado,
      tiempoRespuesta: this.state.tiempoRespuesta,
      puntaje: this.state.puntaje,
      random: this.state.random,
      user: this.state.usuario.id,
      opcion1: this.state.opcion1,
      respuesta1: this.state.respuesta1,
      opcion2: this.state.opcion2,
      respuesta2: this.state.respuesta2,
      opcion3: this.state.opcion3,
      respuesta3: this.state.respuesta3,
      opcion4: this.state.opcion4,
      respuesta4: this.state.respuesta4,
      opcion5: this.state.opcion5,
      respuesta5: this.state.respuesta5
    };

    PreguntaDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          titulo: response.data.titulo,
          tipo: response.data.tipo,
          enunciado: response.data.enunciado,
          tiempoRespuesta: response.data.tiempoRespuesta,
          puntaje: response.data.puntaje,
          random: response.data.random,
          user: this.state.usuario.id,
          opcion1: response.data.opcion1,
          respuesta1: response.data.respuesta1,
          opcion2: response.data.opcion2,
          respuesta2: response.data.respuesta2,
          opcion3: response.data.opcion3,
          respuesta3: response.data.respuesta3,
          opcion4: response.data.opcion4,
          respuesta4: response.data.respuesta4,
          opcion5: response.data.opcion5,
          respuesta5: response.data.respuesta5,

          submitted: true,
          visible: false
        });

        //Actualizar LISTA-------------------------
        var lista = this.state.preguntas;

        lista.push(
          {
            id: response.data.id,
            titulo: this.state.titulo,
            tipo: this.state.tipo,
            enunciado: this.state.enunciado,
            tiempoRespuesta: this.state.tiempoRespuesta,
            puntaje: this.state.puntaje,
            random: this.state.random,
            user: this.state.usuario.id,
            opcion1: this.state.opcion1,
            respuesta1: this.state.respuesta1,
            opcion2: this.state.opcion2,
            respuesta2: this.state.respuesta2,
            opcion3: this.state.opcion3,
            respuesta3: this.state.respuesta3,
            opcion4: this.state.opcion4,
            respuesta4: this.state.respuesta4,
            opcion5: this.state.opcion5,
            respuesta5: this.state.respuesta5
          });

        this.setState({ preguntas: lista });

        //-------------------------------------------
        //Limpiar DATOS
        this.newPregunta();
        //-------------------------------------------

        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }
  newTagPre() {
    this.setState({
      id: null,
      tagid: "",
      preguntaid: "",

      submitted: false
    });
  }
  newPregunta() {
    this.setState({
      id: null,
      titulo: "",
      tipo: "",
      enunciado: "",
      tiempoRespuesta: "",
      puntaje: "",
      random: "",
      user: "",
      opcion1: "",
      respuesta1: "",
      opcion2: "",
      respuesta2: "",
      opcion3: "",
      respuesta3: "",
      opcion4: "",
      respuesta4: "",
      opcion5: "",
      respuesta5: "",


      submitted: false
    });
  }
  //------DELETE-------
  deletePregunta(id) {
    PreguntaDataService.delete(id)
      .then(response => {
        //console.log(response.data);
        this.props.history.push('/pregunta/list')
      })
      .catch(e => {
        console.log(e);
      });
    //Actualizar LISTA  
    var contador = 0;
    var lista = this.state.preguntas;
    lista.map((registro) => {
      if (registro.id == id) {
        lista.splice(contador, 1);
      }
      contador++;
    });
    this.setState({ preguntas: lista });

  }
  //------EDITE------------

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
    //Editar LISTA ---------------------------
    var contador = 0;
    var lista = this.state.preguntas;
    lista.map((registro) => {
      if (this.state.currentPregunta.id == registro.id) {

        lista[contador].titulo = this.state.currentPregunta.titulo;
        lista[contador].tipo = this.state.currentPregunta.tipo;
        lista[contador].enunciado = this.state.currentPregunta.enunciado;
        lista[contador].tiempoRespuesta = this.state.currentPregunta.tiempoRespuesta;
        lista[contador].puntaje = this.state.currentPregunta.puntaje;
        lista[contador].random = this.state.currentPregunta.random;
        lista[contador].opcion1 = this.state.currentPregunta.opcion1;
        lista[contador].respuesta1 = this.state.currentPregunta.respuesta1;
        lista[contador].opcion2 = this.state.currentPregunta.opcion2;
        lista[contador].respuesta2 = this.state.currentPregunta.respuesta2;
        lista[contador].opcion3 = this.state.currentPregunta.opcion3;
        lista[contador].respuesta3 = this.state.currentPregunta.respuesta3;
        lista[contador].opcion4 = this.state.currentPregunta.opcion4;
        lista[contador].respuesta4 = this.state.currentPregunta.respuesta4;
        lista[contador].opcion5 = this.state.currentPregunta.opcion5;
        lista[contador].respuesta5 = this.state.currentPregunta.respuesta5;

      }
      contador++;
    });
    this.setState({ preguntas: lista });
    //-------------------------
    this.closeModalEdit();
    this.closeModalOpciones();



  }


  onChangeTitulo2(e) {
    const titulo = e.target.value;

    this.setState(function (prevState) {
      return {
        currentPregunta: {
          ...prevState.currentPregunta,
          titulo: titulo
        }
      };
    });
  }

  onChangeTipo2(e) {
    const tipo = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        tipo: tipo
      }
    }));
  }

  onChangeEnunciado2(e) {
    const enunciado = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        enunciado: enunciado
      }
    }));
  }

  onChangeTiempoRespuesta2(e) {
    const tiempoRespuesta = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        tiempoRespuesta: tiempoRespuesta
      }
    }));
  }

  onChangePuntaje2(e) {
    const puntaje = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        puntaje: puntaje
      }
    }));
  }

  onChangeRandom2(e) {
    const random = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        random: random
      }
    }));
  }

  onChangeUserid2(e) {
    const users = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        users: users
      }
    }));
  }

  //--------------1
  onChangeOpcion12(e) {
    const opcion1 = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        opcion1: opcion1
      }
    }));
  }

  onChangeRespuesta12(e) {
    const respuesta1 = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        respuesta1: respuesta1
      }
    }));
  }
  //-------------------2
  onChangeOpcion22(e) {
    const opcion2 = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        opcion2: opcion2
      }
    }));
  }

  onChangeRespuesta22(e) {
    const respuesta2 = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        respuesta2: respuesta2
      }
    }));
  }
  //-------------------3
  onChangeOpcion32(e) {
    const opcion3 = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        opcion3: opcion3
      }
    }));
  }

  onChangeRespuesta32(e) {
    const respuesta3 = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        respuesta3: respuesta3
      }
    }));
  }
  //-------------------4
  onChangeOpcion42(e) {
    const opcion4 = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        opcion4: opcion4
      }
    }));
  }

  onChangeRespuesta42(e) {
    const respuesta4 = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        respuesta4: respuesta4
      }
    }));
  }
  //-------------------5
  onChangeOpcion52(e) {
    const opcion5 = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        opcion5: opcion5
      }
    }));
  }

  onChangeRespuesta52(e) {
    const respuesta5 = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        respuesta5: respuesta5
      }
    }));
  }
  //--------------



  handleOnInputChange = (event) => {
    const query = event.target.value;
    this.setState({ query: query });
    console.log(query);
    PreguntaDataService.findByTitulo(query)
      .then(response => {
        this.setState({
          preguntas: response.data
        });
        //console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  handlePageChange(pageNumber) {
    console.log(`active page is ${pageNumber}`);
    this.setState({ activePage: pageNumber });
  }

  render() {
    const { indexOfLastPost, indexOfFirstPost, currentPosts, query, searchTitulo, preguntas, currentPregunta, currentIndex, currentUser, currentUser2, showUserBoard, showModeratorBoard, showTeacherBoard, tags, filtropaginaciones, pageNumbers } = this.state;
    return (
      <div className="">
        <header className="">
          <div>

            {/* {
                  this.state.indexOfLastPost = this.state.paginate * this.state.postsPerPage,
                  this.state.indexOfFirstPost = (indexOfLastPost - this.state.postsPerPage),
                  this.state.currentPosts = this.state.preguntas.slice(indexOfFirstPost, indexOfLastPost),
                  this.setState({ filtropaginaciones: currentPosts })
                  } */}




            <Jumbotron fluid="md">
              <Container >
                <h1 class="display-5">Lista de Preguntas</h1>
              </Container>
            </Jumbotron>

            <Table striped bordered hover>
              <tbody>
                <div className="col-md-8" center>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by titulo"
                      value={this.props.query}
                      onChange={this.handleOnInputChange}
                    ></input>
                  </div>
                </div>


                <nav>
                  <ul className='pagination'>
                    {pageNumbers.map(number => (
                      <li key={number} className='page-item'>
                        <a onClick={() => this.refreshFiltroPorPagina(number)} className='page-link'>
                          {number}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>


                <tr>
                  <td>
                    {filtropaginaciones && filtropaginaciones.map((pregunta, index) => (
                      <li className={"list-group-item " + (index === currentIndex ? "active" : "")}  >

                        <Row href={"/pregunta/opcion/list/" + pregunta.id}>
                          <Col md="8" >

                            {pregunta.titulo}
                          </Col>
                          <Col md="auto">
                            {' '}
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Editar</Tooltip>}>
                              <Button size="sm" variant="info" onClick={() => (this.setActivePregunta(pregunta, index), this.openModalEdit())} key={index}>
                                <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-pencil" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                </svg>
                              </Button>
                            </OverlayTrigger>
                            {' '}
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Agregar Recursos</Tooltip>}>
                              <Button size="sm" variant="success" href={"/prerecur/add/" + pregunta.id}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor" class="bi bi-images" viewBox="0 0 16 16">
                                  <path fill-rule="evenodd" d="M12.002 4h-10a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1zm-10-1a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-10zm4 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                  <path fill-rule="evenodd" d="M4 2h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1v1a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2h1a1 1 0 0 1 1-1z" />
                                </svg>
                              </Button>
                            </OverlayTrigger>
                            {' '}
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Borrar</Tooltip>}>
                              <Button size="sm" variant="danger" onClick={() => this.deletePregunta(pregunta.id)} >
                                <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                </svg>
                              </Button>
                            </OverlayTrigger>
                            {' '}
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Agregar Opciones</Tooltip>}>
                              <Button size="sm" variant="warning" onClick={() => (this.setActivePregunta(pregunta, index), this.openModalOpciones())} key={index}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
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

            <div>
              <Button onClick={() => this.openModalCreate()} > Agregar Pregunta </Button>
            </div>
          </div>
        </header>
      </div>
    );
  }
}