import React, { Component } from "react";
import PreguntaDataService from "../../services/pregunta.service";
import QuizPreDataService from "../../services/quizpre.service";
import QuizDataService from "../../services/quiz.service";

import {
  Accordion, Card, Table, Button, Modal, FormControl, Form, Col, Row, OverlayTrigger, Tooltip, Pagination
} from 'react-bootstrap';

//TAG
import TagPreDataService from "../../services/tagpre.service";
import TagDataService from "../../services/tag.service";
import { Link } from "react-router-dom";
import AuthService from "../../services/auth.service";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the preguntas look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 150
});

const getListStyle2 = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 600
});

export default class QuizPreList extends Component {
  constructor(props) {
    super(props);
    this.setActivePregunta = this.setActivePregunta.bind(this);
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
    this.newPreguntaCopia = this.newPreguntaCopia.bind(this);

    //OPCIONES
    this.onChangeOpcion1 = this.onChangeOpcion1.bind(this);
    this.onChangeRespuesta1 = this.onChangeRespuesta1.bind(this);
    this.onChangeOpcion2 = this.onChangeOpcion2.bind(this);
    this.onChangeRespuesta2 = this.onChangeRespuesta2.bind(this);
    this.onChangeOpcion3 = this.onChangeOpcion3.bind(this);
    this.onChangeRespuesta3 = this.onChangeRespuesta3.bind(this);
    this.onChangeOpcion4 = this.onChangeOpcion4.bind(this);
    this.onChangeRespuesta4 = this.onChangeRespuesta4.bind(this);
    this.onChangeSubenunciado1 = this.onChangeSubenunciado1.bind(this);
    this.onChangeSubenunciado2 = this.onChangeSubenunciado2.bind(this);
    this.onChangeSubenunciado3 = this.onChangeSubenunciado3.bind(this);
    this.onChangeSubenunciado4 = this.onChangeSubenunciado4.bind(this);
    this.onChangeTemplate = this.onChangeTemplate.bind(this);
    //UPDATE
    this.updatePregunta = this.updatePregunta.bind(this);
    this.updatePregunta2 = this.updatePregunta2.bind(this);
    this.onChangeTitulo2 = this.onChangeTitulo2.bind(this);
    this.onChangeTipo2 = this.onChangeTipo2.bind(this);
    this.onChangeEnunciado2 = this.onChangeEnunciado2.bind(this);
    this.onChangeTiempoRespuesta2 = this.onChangeTiempoRespuesta2.bind(this);
    this.onChangePuntaje2 = this.onChangePuntaje2.bind(this);
    this.onChangeRandom2 = this.onChangeRandom2.bind(this);
    this.onChangeUserid2 = this.onChangeUserid2.bind(this);
    //OPCIONES UPDATE
    this.onChangeOpcion12 = this.onChangeOpcion12.bind(this);
    this.onChangeRespuesta12 = this.onChangeRespuesta12.bind(this);
    this.onChangeOpcion22 = this.onChangeOpcion22.bind(this);
    this.onChangeRespuesta22 = this.onChangeRespuesta22.bind(this);
    this.onChangeOpcion32 = this.onChangeOpcion32.bind(this);
    this.onChangeRespuesta32 = this.onChangeRespuesta32.bind(this);
    this.onChangeOpcion42 = this.onChangeOpcion42.bind(this);
    this.onChangeRespuesta42 = this.onChangeRespuesta42.bind(this);
    this.onChangeSubenunciado12 = this.onChangeSubenunciado12.bind(this);
    this.onChangeSubenunciado22 = this.onChangeSubenunciado22.bind(this);
    this.onChangeSubenunciado32 = this.onChangeSubenunciado32.bind(this);
    this.onChangeSubenunciado42 = this.onChangeSubenunciado42.bind(this);
    this.onChangeTemplate2 = this.onChangeTemplate2.bind(this);

    this.setActiveQuizpres = this.setActiveQuizpres.bind(this);
    //DELETE QUIZPRE
    this.deleteQuizPre = this.deleteQuizPre.bind(this);

    //TAG
    this.newTagPre = this.newTagPre.bind(this);
    this.retrieveTags = this.retrieveTags.bind(this);
    this.onChangeTagid = this.onChangeTagid.bind(this);

    //COPIA PREGUNTA
    this.savePreguntaCopia = this.savePreguntaCopia.bind(this);

    //Paginacion
    this.retrieveFiltroPorPagina = this.retrieveFiltroPorPagina.bind(this);
    this.refreshFiltroPorPagina = this.refreshFiltroPorPagina.bind(this);

    this.state = {
      //PREGUNTA
      currentPregunta: null,
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
      subenunciado1: "",
      subenunciado2: "",
      subenunciado3: "",
      subenunciado4: "",
      template: "",
      //TAG
      tagid: "",
      tags: [],

      currentIndex: -1,

      currentQuiz: {
        id: null,
        titulo: "",
        descripcion: "",
        activo: "",
        tiempodisponible: "",
        random: "",
        fechacreacion: "",
        fechatermino: "",
        currentUser: undefined
      },
      currentPregunta: {
        id: null,
        titulo: "",
        tipo: "",
        enunciado: "",
        tiemporespuesta: "",
        puntaje: "",
        random: "",
        usuario: "",
        opcion1: "",
        respuesta1: "",
        opcion2: "",
        respuesta2: "",
        opcion3: "",
        respuesta3: "",
        opcion4: "",
        respuesta4: "",
        subenunciado1: "",
        subenunciado2: "",
        subenunciado3: "",
        subenunciado4: "",
        template: ""
      },
      visibleeliminar: false,
      deleteid: "",
      deleteidpre: "",
      droppableTemplate: "0",
      preguntas: [],
      quizpres: [],
      //dragg - dropp
      opcions: [],
      selected1: [],
      selected2: [],
      selected3: [],
      selected4: [],

      filtropreguntasañadidas: [],
      filtropreguntas: [],
      filtropreguntaspropias: [],
      input: false,
      visible: false,
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
      currentPreguntaCopia: undefined,
      //--------PAGINACION------------
      postsPerPage: 5,

      paginacionPublicas: [],
      listapaginacionPublicas: [],
      paginatePubli: 1,
      paginacionPropias: [],
      listapaginacionPropias: [],
      paginateProp: 1,
      paginacionAgregadas: [],
      listapaginacionAgregadas: [],
      paginateAgre: 1

    };
  }

  //============PAGINACION=================
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
  async refreshFiltroPorPagina(pag, lista, tipo) {
    const listapageNumbers = [];
    for (let i = 1; i <= Math.ceil(lista.length / this.state.postsPerPage); i++) {
      listapageNumbers.push(i);
    };

    const indexOfLastPost = pag * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
    const currentPosts = lista.slice(indexOfFirstPost, indexOfLastPost);

    if (tipo == "publicas") {
      this.setState({
        listapaginacionPublicas: currentPosts,
        paginatePubli: pag
      });
      console.log("publicas")
    }
    if (tipo == "agregadas") {
      this.setState({
        listapaginacionAgregadas: currentPosts,
        paginateAgre: pag
      });
      console.log("agregados")
    }
    if (tipo == "propias") {
      this.setState({
        listapaginacionPropias: currentPosts,
        paginateProp: pag
      });
      console.log("propias")
    }

  }
  //==========================================
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
    await this.retrievePreguntas();
    await this.retrieveQuizPres();
    this.retrieveTags();
    this.getQuiz(this.props.match.params.id);
    await this.retrieveFiltroPreguntasAñadidas();
    await this.retrieveFiltroPreguntas();
  }

  async retrievePreguntas() {
    await PreguntaDataService.getAll()
      .then(response => {
        this.setState({
          preguntas: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  async retrieveFiltroPreguntasAñadidas() {
    const listapreguntas = this.state.preguntas.slice();
    const listaquizpres = this.state.quizpres.slice();
    const listafiltropreguntasañadidas = [];

    listaquizpres && listaquizpres.map((quizpre) => {
      if (quizpre.quizid == this.props.match.params.id) {
        listapreguntas && listapreguntas.map((pregunta) => {
          if (quizpre.preguntaid == pregunta.id) {
            listafiltropreguntasañadidas.push({
              id: pregunta.id,
              titulo: pregunta.titulo,
              tipo: pregunta.tipo,
              enunciado: pregunta.enunciado,
              tiempoRespuesta: pregunta.tiempoRespuesta,
              puntaje: pregunta.puntaje,
              random: pregunta.random,
              user: pregunta.user,
              opcion1: pregunta.opcion1,
              respuesta1: pregunta.respuesta1,
              opcion2: pregunta.opcion2,
              respuesta2: pregunta.respuesta2,
              opcion3: pregunta.opcion3,
              respuesta3: pregunta.respuesta3,
              opcion4: pregunta.opcion4,
              respuesta4: pregunta.respuesta4,
              subenunciado1: pregunta.subenunciado1,
              subenunciado2: pregunta.subenunciado2,
              subenunciado3: pregunta.subenunciado3,
              subenunciado4: pregunta.subenunciado4,
              template: pregunta.template,
              idquizpre: quizpre.id
            })
          };
        });
      };
    });

    const respuesta = await this.retrieveFiltroPorPagina(listafiltropreguntasañadidas);
    this.setState({
      listapaginacionAgregadas: respuesta[0],
      filtropreguntasañadidas: listafiltropreguntasañadidas,
      paginacionAgregadas: respuesta[1]

    });


  }

  async retrieveFiltroPreguntas() {
    const listapreguntas = this.state.preguntas.slice();
    const listaquizpres = this.state.quizpres.slice();
    const filtroquizpre = [];
    listaquizpres && listaquizpres.map((quizpre) => {
      if (quizpre.quizid == this.props.match.params.id) {
        filtroquizpre.push({
          idquizpre: quizpre.id,
          idquiz: quizpre.quizid,
          idpre: quizpre.preguntaid
        })
      };
    });
    filtroquizpre && filtroquizpre.map((quizpre) => {
      listapreguntas && listapreguntas.map((pregunta, index) => {
        if (pregunta.id == quizpre.idpre) {
          listapreguntas.splice(index, 1);
        };
      });
    });

    const preguntaspublicas = listapreguntas.filter(pregunta => pregunta.privado == false && pregunta.user != this.state.currentUser.id);
    const preguntaspropias = listapreguntas.filter(pregunta => pregunta.user == this.state.currentUser.id);

    const respuestapubli = await this.retrieveFiltroPorPagina(preguntaspublicas);
    this.setState({
      listapaginacionPublicas: respuestapubli[0],
      filtropreguntas: preguntaspublicas,
      paginacionPublicas: respuestapubli[1]

    });

    const respuestaprop = await this.retrieveFiltroPorPagina(preguntaspropias);
    this.setState({
      listapaginacionPropias: respuestaprop[0],
      filtropreguntaspropias: preguntaspropias,
      paginacionPropias: respuestaprop[1]

    });


  }

  async retrieveQuizPres() {
    var peticion = await fetch("https://spring-boot-back.herokuapp.com/api/quizpres/all");
    var respuesta = await peticion.json();
    this.setState({ quizpres: respuesta });
  }
  //-----------------------
  retrieveTags() {
    TagDataService.getAll()
      .then(response => {
        this.setState({
          tags: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  //-----------------------
  onChangeTagid(e) {
    this.setState({
      tagid: e.target.value
    });
  }

  getQuiz(id) {
    QuizDataService.get(id)
      .then(response => {
        this.setState({
          currentQuiz: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  async saveQuizPre() {
    var data = {
      quizid: this.props.match.params.id,
      preguntaid: this.state.preguntaid
    };

    await QuizPreDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          quizid: response.data.quiz,
          preguntaid: response.data.pregunta
        });
      })
      .catch(e => {
        console.log(e);
      });

    await this.retrievePreguntas();
    await this.retrieveQuizPres();
    await this.retrieveFiltroPreguntasAñadidas();
    await this.retrieveFiltroPreguntas();
    this.closeModalañadir();
  }

  setActivePregunta(pregunta, index) {
    this.setState({
      currentPregunta: pregunta,
      currentIndex: index
    });
  }
  //------------------------------------------

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

  closeModaleliminar() {
    this.setState({
      visibleeliminar: false
    });
  }
  openModaleliminar(id, idpre) {
    this.setState({
      visibleeliminar: true,
      deleteid: id,
      deleteidpre: idpre
    });
  }

  //Modal Añadir
  closeModalañadir() {
    this.setState({
      visibleañadir: false
    });
  }
  openModalañadir(id) {
    this.setState({
      preguntaid: id,
      visibleañadir: true
    });
  }
  //Modal Añadir Copia
  closeModalañadirCopia() {
    this.setState({
      visibleañadircopia: false
    });
  }
  openModalañadirCopia(pregunta) {
    this.setState({
      currentPreguntaCopia: pregunta,
      visibleañadircopia: true
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
      visibleopciones: false,
      droppableTemplate: "0",
      input: false,
      //dragg - dropp
      opcions: [],
      selected1: [],
      selected2: [],
      selected3: [],
      selected4: []
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
  onChangeSubenunciado1(e) {
    this.setState({
      subenunciado1: e.target.value
    });
  }
  onChangeSubenunciado2(e) {
    this.setState({
      subenunciado2: e.target.value
    });
  }
  onChangeSubenunciado3(e) {
    this.setState({
      subenunciado3: e.target.value
    });
  }
  onChangeSubenunciado4(e) {
    this.setState({
      subenunciado4: e.target.value
    });
  }
  onChangeTemplate(e) {
    this.setState({
      template: e.target.value
    });
  }

  async savePregunta() {
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
      subenunciado1: this.state.subenunciado1,
      subenunciado2: this.state.subenunciado2,
      subenunciado3: this.state.subenunciado3,
      subenunciado4: this.state.subenunciado4,
      template: this.state.template
    };

    await PreguntaDataService.create(data)
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
          subenunciado1: response.data.subenunciado1,
          subenunciado2: response.data.subenunciado2,
          subenunciado3: response.data.subenunciado3,
          subenunciado4: response.data.subenunciado4,
          template: response.data.template,

          submitted: true,
          visible: false
        });
        var data = {
          quizid: this.props.match.params.id,
          preguntaid: response.data.id
        };

        QuizPreDataService.create(data)
          .then(response => {
            this.setState({
              id: response.data.id,
              quizid: this.props.match.params.id,
              preguntaid: response.data.id,

              submitted: true
            });
            console.log(response.data);

            var data = {
              tagid: this.state.tagid,
              preguntaid: response.data.id
            };

            TagPreDataService.create(data)
              .then(response => {
                this.setState({
                  id: response.data.id,
                  tagid: response.data.tagid,
                  preguntaid: response.data.id,

                  submitted: true
                });
                console.log(response.data);
              })
              .catch(e => {
                console.log(e);
              });

            //-------------------------------------------
            //Limpiar DATOS
            this.newPregunta();
            //-------------------------------------------

          })
          .catch(e => {
            console.log(e);
          });
      })
      .catch(e => {
        console.log(e);
      });
    await this.retrievePreguntas();
    await this.retrieveQuizPres();
    await this.retrieveFiltroPreguntasAñadidas();
    await this.retrieveFiltroPreguntas();
  }

  async savePreguntaCopia() {
    var data = {
      titulo: this.state.currentPreguntaCopia.titulo,
      tipo: this.state.currentPreguntaCopia.tipo,
      enunciado: this.state.currentPreguntaCopia.enunciado,
      subenunciado1: this.state.currentPreguntaCopia.subenunciado1,
      subenunciado2: this.state.currentPreguntaCopia.subenunciado2,
      subenunciado3: this.state.currentPreguntaCopia.subenunciado3,
      subenunciado4: this.state.currentPreguntaCopia.subenunciado4,
      template: this.state.currentPreguntaCopia.template,
      opcion1: this.state.currentPreguntaCopia.opcion1,
      opcion2: this.state.currentPreguntaCopia.opcion2,
      opcion3: this.state.currentPreguntaCopia.opcion3,
      opcion4: this.state.currentPreguntaCopia.opcion4,
      respuesta1: this.state.currentPreguntaCopia.respuesta1,
      respuesta2: this.state.currentPreguntaCopia.respuesta2,
      respuesta3: this.state.currentPreguntaCopia.respuesta3,
      respuesta4: this.state.currentPreguntaCopia.respuesta4,
      puntaje: this.state.currentPreguntaCopia.puntaje,
      random: this.state.currentPreguntaCopia.random,
      privado: true,
      tiempoRespuesta: this.state.currentPreguntaCopia.tiempoRespuesta,
      user: this.state.usuario.id
    };
    await PreguntaDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          titulo: response.data.titulo,
          tipo: response.data.tipo,
          enunciado: response.data.enunciado,
          subenunciado1: response.data.subenunciado1,
          subenunciado2: response.data.subenunciado2,
          subenunciado3: response.data.subenunciado3,
          subenunciado4: response.data.subenunciado4,
          template: response.data.template,
          opcion1: response.data.opcion1,
          opcion2: response.data.opcion2,
          opcion3: response.data.opcion3,
          opcion4: response.data.opcion4,
          respuesta1: response.data.respuesta1,
          respuesta2: response.data.respuesta2,
          respuesta3: response.data.respuesta3,
          respuesta4: response.data.respuesta4,
          puntaje: response.data.puntaje,
          random: response.data.random,
          privado: response.data.privado,
          tiempoRespuesta: response.data.tiempoRespuesta,
          user: this.state.usuario.id,

          submitted: true,
        });
        var data = {
          quizid: this.props.match.params.id,
          preguntaid: response.data.id
        };
        QuizPreDataService.create(data)
          .then(response => {
            this.setState({
              id: response.data.id,
              quizid: this.props.match.params.id,
              preguntaid: response.data.id,

              submitted: true
            });
            console.log(response.data);
            this.newPreguntaCopia();
          })
          .catch(e => {
            console.log(e);
          });
      })
      .catch(e => {
        console.log(e);
      });
    await this.retrievePreguntas();
    await this.retrieveQuizPres();
    await this.retrieveFiltroPreguntasAñadidas();
    await this.retrieveFiltroPreguntas();
    this.closeModalañadirCopia();
  }

  async deletePregunta(id) {
    await PreguntaDataService.delete(id)
      .then(response => {
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    await this.retrievePreguntas();
    await this.retrieveQuizPres();
    await this.retrieveFiltroPreguntasAñadidas();
    await this.retrieveFiltroPreguntas();
    this.closeModaleliminar();
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
      subenunciado1: "",
      subenunciado2: "",
      subenunciado3: "",
      subenunciado4: "",
      template: "",

      submitted: false
    });
  }
  newPreguntaCopia() {
    this.setState({
      currentPreguntaCopia: undefined,
      submitted: false
    });
  }
  setActiveQuizpres(quizpres, index) {
    this.setState({
      currentQuizpres: quizpres,
      currentIndex: index
    });
  }

  //------EDITE------------

  async updatePregunta() {
    await PreguntaDataService.update(
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
    //-------------------------
    await this.retrievePreguntas();
    await this.retrieveQuizPres();
    await this.retrieveFiltroPreguntasAñadidas();
    await this.retrieveFiltroPreguntas();
    this.closeModalEdit();
    this.closeModalOpciones();
  }

  updatePregunta2() {
    var respuesta1 = "";
    var respuesta2 = "";
    var respuesta3 = "";
    var respuesta4 = "";

    this.state.selected1.sort();
    this.state.selected2.sort();
    this.state.selected3.sort();
    this.state.selected4.sort();

    for (var i = 0; i < this.state.selected1.length; i++) {
      respuesta1 = respuesta1 + ";" + this.state.selected1[i];
    }

    for (var i = 0; i < this.state.selected2.length; i++) {
      respuesta2 = respuesta2 + ";" + this.state.selected2[i];
    }

    for (var i = 0; i < this.state.selected3.length; i++) {
      respuesta3 = respuesta3 + ";" + this.state.selected3[i];
    }

    for (var i = 0; i < this.state.selected4.length; i++) {
      respuesta4 = respuesta4 + ";" + this.state.selected4[i];
    }

    var data = {
      id: this.state.currentPregunta.id,
      titulo: this.state.currentPregunta.titulo,
      tipo: this.state.currentPregunta.tipo,
      enunciado: this.state.currentPregunta.enunciado,
      tiempoRespuesta: this.state.currentPregunta.tiempoRespuesta,
      puntaje: this.state.currentPregunta.puntaje,
      random: this.state.currentPregunta.random,
      user: this.state.currentPregunta.user,
      opcion1: this.state.currentPregunta.opcion1,
      respuesta1: respuesta1,
      opcion2: this.state.currentPregunta.opcion2,
      respuesta2: respuesta2,
      opcion3: this.state.currentPregunta.opcion3,
      respuesta3: respuesta3,
      opcion4: this.state.currentPregunta.opcion4,
      respuesta4: respuesta4,
      subenunciado1: this.state.currentPregunta.subenunciado1,
      subenunciado2: this.state.currentPregunta.subenunciado2,
      subenunciado3: this.state.currentPregunta.subenunciado3,
      subenunciado4: this.state.currentPregunta.subenunciado4,
      template: this.state.droppableTemplate,
    };

    PreguntaDataService.update(this.state.currentPregunta.id, data)
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "The pregunta was updated successfully!"
        });
        window.location.reload();
      })
      .catch(e => {
        console.log(e);
      });
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
  //-------------------
  onChangeSubenunciado12(e) {
    const subenunciado1 = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        subenunciado1: subenunciado1
      }
    }));
  }

  onChangeSubenunciado22(e) {
    const subenunciado2 = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        subenunciado2: subenunciado2
      }
    }));
  }

  onChangeSubenunciado32(e) {
    const subenunciado3 = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        subenunciado3: subenunciado3
      }
    }));
  }

  onChangeSubenunciado42(e) {
    const subenunciado4 = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        subenunciado4: subenunciado4
      }
    }));
  }

  onChangeTemplate2(e) {
    const template = e.target.value;

    this.setState(prevState => ({
      currentPregunta: {
        ...prevState.currentPregunta,
        template: template
      }
    }));
  }

  //--------------
  async deleteQuizPre(id) {
    await QuizPreDataService.delete(id)
      .then(response => {
        console.log(response.data)
      })
      .catch(e => {
        console.log(e);
      });
    this.closeModaleliminar();
    await this.retrievePreguntas();
    await this.retrieveQuizPres();
    await this.retrieveFiltroPreguntasAñadidas();
    await this.retrieveFiltroPreguntas();
  }

  //TAG
  newTagPre() {
    this.setState({
      id: null,
      tagid: "",
      preguntaid: "",

      submitted: false
    });
  }

  //Droppable / Draggable

  id2List = {
    droppable1: 'opcions',
    droppable2: 'selected1',
    droppable3: 'selected2',
    droppable4: 'selected3',
    droppable5: 'selected4'
  };

  getList(id) {
    return this.state[this.id2List[id]];
  }

  onDragEnd = result => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const opcions = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      );

      let state = { opcions };

      if (source.droppableId === 'droppable2') {
        state = { selected1: opcions };
      }

      if (source.droppableId === 'droppable3') {
        state = { selected2: opcions };
      }

      if (source.droppableId === 'droppable4') {
        state = { selected3: opcions };
      }

      if (source.droppableId === 'droppable5') {
        state = { selected4: opcions };
      }

      this.setState(state);
    } else {

      var droppable1 = source.droppableId;
      var droppable2 = destination.droppableId;

      //con droppable1 la origen

      if ((droppable1 == "droppable1") && (droppable2 == "droppable2")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          opcions: result.droppable1,
          selected1: result.droppable2
        });
      }

      if ((droppable1 == "droppable1") && (droppable2 == "droppable3")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          opcions: result.droppable1,
          selected2: result.droppable3
        });
      }

      if ((droppable1 == "droppable1") && (droppable2 == "droppable4")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          opcions: result.droppable1,
          selected3: result.droppable4
        });
      }

      if ((droppable1 == "droppable1") && (droppable2 == "droppable5")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          opcions: result.droppable1,
          selected4: result.droppable5
        });
      }

      //con droppable1 la lista droppable2

      if ((droppable1 == "droppable2") && (droppable2 == "droppable1")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          selected1: result.droppable2,
          opcions: result.droppable1
        });
      }

      if ((droppable1 == "droppable2") && (droppable2 == "droppable3")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          selected1: result.droppable2,
          selected2: result.droppable3
        });
      }

      if ((droppable1 == "droppable2") && (droppable2 == "droppable4")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          selected1: result.droppable2,
          selected3: result.droppable4
        });
      }

      if ((droppable1 == "droppable2") && (droppable2 == "droppable5")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          selected1: result.droppable2,
          selected4: result.droppable5
        });
      }

      //con droppable1 la lista droppable3

      if ((droppable1 == "droppable3") && (droppable2 == "droppable2")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          selected2: result.droppable3,
          selected1: result.droppable2
        });
      }

      if ((droppable1 == "droppable3") && (droppable2 == "droppable1")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          selected2: result.droppable3,
          opcions: result.droppable1
        });
      }

      if ((droppable1 == "droppable3") && (droppable2 == "droppable4")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          selected2: result.droppable3,
          selected3: result.droppable4
        });
      }

      if ((droppable1 == "droppable3") && (droppable2 == "droppable5")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          selected2: result.droppable3,
          selected4: result.droppable5
        });
      }

      //con droppable1 la lista droppable4

      if ((droppable1 == "droppable4") && (droppable2 == "droppable2")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          selected3: result.droppable4,
          selected1: result.droppable2
        });
      }

      if ((droppable1 == "droppable4") && (droppable2 == "droppable1")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          selected3: result.droppable4,
          opcions: result.droppable1
        });
      }

      if ((droppable1 == "droppable4") && (droppable2 == "droppable3")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          selected3: result.droppable4,
          selected2: result.droppable3
        });
      }

      if ((droppable1 == "droppable4") && (droppable2 == "droppable5")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          selected3: result.droppable4,
          selected4: result.droppable5
        });
      }

      //con droppable1 la lista droppable5

      if ((droppable1 == "droppable5") && (droppable2 == "droppable2")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          selected4: result.droppable5,
          selected1: result.droppable2
        });
      }

      if ((droppable1 == "droppable5") && (droppable2 == "droppable1")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          selected4: result.droppable5,
          opcions: result.droppable1
        });
      }

      if ((droppable1 == "droppable5") && (droppable2 == "droppable3")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          selected4: result.droppable5,
          selected2: result.droppable3
        });
      }

      if ((droppable1 == "droppable5") && (droppable2 == "droppable4")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          selected4: result.droppable5,
          selected3: result.droppable4
        });
      }
    }
  };

  onChangeTemplate1(e) {
    var numero = parseInt(e, 10);
    if (numero < 7) {
      numero = numero + 1;
    }
    else {
      numero = 0;
    }
    this.setState({
      droppableTemplate: numero.toString()
    });
  }

  onChangeTemplate2(e) {
    var numero = parseInt(e, 10);
    if (numero > 0) {
      numero = numero - 1;
    }
    else {
      numero = 7;
    }
    this.setState({
      droppableTemplate: numero.toString()
    });
  }

  onChangeInput() {
    var opcions = [];
    opcions.push(this.state.currentPregunta.opcion1)
    opcions.push(this.state.currentPregunta.opcion2)
    opcions.push(this.state.currentPregunta.opcion3)
    opcions.push(this.state.currentPregunta.opcion4)
    this.setState({
      input: true,
      opcions: opcions
    });
  }

  render() {
    const { currentPregunta, filtropreguntas, currentUser, showUserBoard, showModeratorBoard, showTeacherBoard, currentIndex,
      tags, filtropreguntasañadidas, droppableTemplate, selected1, selected2, selected3, selected4, opcions, input,
      deleteid, filtropreguntaspropias, deleteidpre,
      paginacionPublicas, paginacionPropias, paginacionAgregadas,
      listapaginacionPublicas, listapaginacionPropias,
      listapaginacionAgregadas, paginatePubli } = this.state;

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
            <div>
              <div class="img-center">
                <h2 class="center">Centro de edicion</h2>
                <p>
                  Edita, agrega y configura las preguntas para tu Quiz.
                </p>
              </div>

              <div className="list row">

                <div className="col-md-8">
                  <br></br>
                  <Table striped bordered hover>
                    <tbody>
                      {filtropreguntasañadidas.length > 0 ? (
                        <>
                          <tr>
                            <>
                              <td>
                                {listapaginacionAgregadas && listapaginacionAgregadas.map((pregunta, index) => (
                                  <>
                                    <li className={"list-group-item " + (index === currentIndex ? "active" : "")}  >
                                      <Row>
                                        <Col md="8" >
                                          {pregunta.titulo}
                                        </Col>
                                        <Col md="auto">
                                          {' '}
                                          <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Editar</Tooltip>}>
                                            <Button size="sm" variant="info" onClick={() => (this.setActivePregunta(pregunta, index), this.openModalEdit())} key={index}>
                                              <svg width="16" height="16" viewBox="0 0 16 16" class="bi bi-pencil" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                              </svg>
                                            </Button>
                                          </OverlayTrigger>
                                          {' '}
                                          {pregunta.tipo == "Arrastrable" ? (
                                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Agregar Recursos</Tooltip>}>
                                              <Button size="sm" variant="success" href={"/prerecur/add/" + pregunta.id} disabled>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-images" viewBox="0 0 16 16">
                                                  <path fill-rule="evenodd" d="M12.002 4h-10a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1zm-10-1a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-10zm4 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                                  <path fill-rule="evenodd" d="M4 2h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1v1a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2h1a1 1 0 0 1 1-1z" />
                                                </svg>
                                              </Button>
                                            </OverlayTrigger>
                                          ) : (
                                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Agregar Recursos</Tooltip>}>
                                              <Button size="sm" variant="success" href={"/prerecur/add/" + pregunta.id}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-images" viewBox="0 0 16 16">
                                                  <path fill-rule="evenodd" d="M12.002 4h-10a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1zm-10-1a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-10zm4 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                                  <path fill-rule="evenodd" d="M4 2h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1v1a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2h1a1 1 0 0 1 1-1z" />
                                                </svg>
                                              </Button>
                                            </OverlayTrigger>
                                          )}
                                          {' '}
                                          <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Quitar Pregunta</Tooltip>}>
                                            <Button size="sm" variant="danger" onClick={() => this.openModaleliminar(pregunta.idquizpre, pregunta.id)}>
                                              <svg width="16" height="16" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                              </svg>
                                            </Button>
                                          </OverlayTrigger>
                                          {' '}
                                          <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Agregar Opciones</Tooltip>}>
                                            <Button size="sm" variant="warning" onClick={() => (this.setActivePregunta(pregunta, index), this.openModalOpciones())} key={index}>
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                              </svg>
                                            </Button>
                                          </OverlayTrigger>
                                          {' '}
                                          <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Editar Retroalimentación</Tooltip>}>
                                            <Button size="sm" variant="secondary" href={"/retroalimentacion/add/" + pregunta.id}>
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-wrench" viewBox="0 0 16 16">
                                                <path d="M.102 2.223A3.004 3.004 0 0 0 3.78 5.897l6.341 6.252A3.003 3.003 0 0 0 13 16a3 3 0 1 0-.851-5.878L5.897 3.781A3.004 3.004 0 0 0 2.223.1l2.141 2.142L4 4l-1.757.364L.102 2.223zm13.37 9.019l.528.026.287.445.445.287.026.529L15 13l-.242.471-.026.529-.445.287-.287.445-.529.026L13 15l-.471-.242-.529-.026-.287-.445-.445-.287-.026-.529L11 13l.242-.471.026-.529.445-.287.287-.445.529-.026L13 11l.471.242z" />
                                              </svg>
                                            </Button>
                                          </OverlayTrigger>
                                        </Col>
                                      </Row>
                                    </li>
                                  </>
                                ))}
                                {paginacionAgregadas.length > 1 && (
                                  <nav>
                                    <ul className='pagination'>
                                      {paginacionAgregadas.map(number => (
                                        <li key={number} className='page-item'>
                                          <a onClick={() => this.refreshFiltroPorPagina(number, filtropreguntasañadidas, "agregadas")} className='page-link'>
                                            {number}
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  </nav>
                                )}
                              </td>
                            </>
                          </tr>

                        </>
                      ) : (
                        <>
                          <br />
                          <br />
                          <br />
                          <h2 class="center"> Agregue preguntas para personalizar... </h2>
                          <br />
                          <br />
                          <br />
                        </>
                      )}
                    </tbody>
                  </Table>
                </div>

                <div className="col-md-4">
                  <Table striped bordered hover>
                    <h3 class="img-center">Preguntas Frecuentes</h3>
                    <Accordion defaultActiveKey="0">
                      <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                          ¿De qué me sirve esta interfaz?
                      </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>Usa esta interfaz para agregar y editar las preguntas a tu Quiz.</Card.Body>
                      </Accordion.Collapse>
                      <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                          Me cuesta configurar una pregunta
                      </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="1">
                        <Card.Body>Si te cuesta crear una pregunta, usa una de las que tenemos en el sistema, tenemos un ranking de las preguntas más populares.</Card.Body>
                      </Accordion.Collapse>
                    </Accordion>
                  </Table>
                </div>
              </div>

              <br></br>
              <hr></hr>
              <br></br>


              <div className="list row">
                <div className="col-md-5">
                  <h4>Lista de Preguntas Publicas </h4>


                  <br></br>
                  <ul className="list-group">

                    {listapaginacionPublicas &&
                      listapaginacionPublicas.map((pregunta) => (
                        <li className="list-group-item" >
                          <Row>
                            <Col md="8" >
                              {pregunta.titulo}
                            </Col>
                            <Col md="auto">
                              {' '}
                              <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Agregar Pregunta</Tooltip>}>
                                <Button size="sm" variant="warning" onClick={() => this.openModalañadirCopia(pregunta)}  >
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

                  </ul>
                  {paginacionPublicas.length > 1 && (
                    // active={paginatePubli}

                    <nav>
                      <ul className='pagination'>
                        {paginacionPublicas.map(number => (
                          <Pagination.Item key={number}
                            onClick={() => this.refreshFiltroPorPagina(number, filtropreguntas, "publicas")}>
                            {number}
                          </Pagination.Item>
                        ))}
                      </ul>
                    </nav>
                  )}
                </div>


                <div className="col-md-5">
                  <h4>Lista de tus Preguntas</h4>
                  <br></br>
                  <ul className="list-group">

                    {listapaginacionPropias &&
                      listapaginacionPropias.map((pregunta) => (
                        <li className="list-group-item" >
                          <Row>
                            <Col md="8" >
                              {pregunta.titulo}
                            </Col>
                            <Col md="auto">
                              {' '}
                              <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Agregar Pregunta</Tooltip>}>
                                <Button size="sm" variant="warning" onClick={() => this.openModalañadir(pregunta.id)}  >
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

                  </ul>
                  {paginacionPropias.length > 1 && (

                    <nav>
                      <ul className='pagination'>
                        {paginacionPropias.map(number => (
                          <li key={number} className='page-item'>
                            <a onClick={() => this.refreshFiltroPorPagina(number, filtropreguntaspropias, "propias")} className='page-link'>
                              {number}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  )}
                </div>

                <div className="col-md-2">
                  <Link to={"/chart"}>
                    ¿Que pregunta elegir?
                    </Link>
                </div>
              </div>

              <br></br>
              <div>
                <Button onClick={() => this.openModalCreate()} > Agregar Pregunta </Button>
              </div>

              <Modal show={this.state.visible} size="xl" >
                <Modal.Header closeButton onClick={() => this.closeModal()} >
                  <Modal.Title>Agregar Pregunta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Row>
                      <Col md="8">
                        <label htmlFor="titulo">Titulo</label>
                        <input
                          type="text"
                          className="form-control"
                          id="titulo"
                          required
                          value={this.state.titulo}
                          onChange={this.onChangeTitulo}
                          name="titulo"
                        />
                      </Col>

                      <Form.Group as={Col} md="4 " controlId="formGridState">
                        <Form.Label>Tipo</Form.Label>
                        <Form.Control as="select"
                          className="form-control"
                          id="tipo"
                          required
                          defaultValue="..."
                          onChange={this.onChangeTipo}
                          name="tipo">
                          <option disabled>...</option>
                          <option>Verdadero o Falso</option>
                          <option>Alternativas</option>
                          <option>Opcion Multiple</option>
                          <option>Arrastrable</option>
                        </Form.Control>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Col md="2">
                        <label htmlFor="tiempoRespuesta">Tiempo de Respuesta</label>
                        <input
                          type="text"
                          className="form-control"
                          id="tiempoRespuesta"
                          required
                          value={this.state.tiempoRespuesta}
                          onChange={this.onChangeTiempoRespuesta}
                          name="tiempoRespuesta"
                        />
                      </Col>
                      <Col md="2">
                        <label htmlFor="puntaje">Puntaje</label>
                        <FormControl
                          type="text"
                          className="form-control"
                          id="puntaje"
                          required
                          value={this.state.puntaje}
                          onChange={this.onChangePuntaje}
                          name="puntaje"
                        />
                      </Col>

                      <Col md="1" align="center">

                        <label htmlFor="user">Random</label>
                        <input defaultChecked={false} type="checkbox" class="make-switch" id="price_check"
                          name="pricing" data-on-color="primary" data-off-color="info" value="true" size="10"
                          onChange={this.onChangeRandom}></input>
                      </Col>


                      <Col md="2">
                        <label htmlFor="user">Id del Usuario</label>
                        <input
                          type="text"
                          className="form-control"
                          id="user"
                          required
                          value={currentUser.id}
                          onChange={this.onChangeUserid}
                          name="user"
                          disabled
                        />
                      </Col>

                      <Col md="2">
                        <label htmlFor="quizid2">Quiz ID</label>
                        <input
                          type="text"
                          className="form-control"
                          id="quizid2"
                          required
                          defaultValue={this.props.match.params.id}
                          onChange={this.onChangeQuizid2}
                          name="quizid2"
                          disabled
                        />
                      </Col>

                      <Col md="3">
                        <Form.Label>Tag</Form.Label>
                        <Form.Control as="select"
                          className="form-control"
                          id="tipo"
                          required
                          onChange={this.onChangeTagid}
                          name="tipo">
                          <option disabled>...</option>
                          {tags &&
                            tags.map((tag) => (
                              <option value={tag.id}>{tag.nombre}</option>
                            ))}
                        </Form.Control>

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

                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => this.closeModal()} >
                    Cerrar
                    </Button>
                  <Button variant="primary" onClick={this.savePregunta}>
                    Agregar
                    </Button>
                </Modal.Footer>
              </Modal>

              <Modal show={this.state.visibleañadir} width="1000" height="500" effect="fadeInUp" onClickAway={() => this.closeModalañadir()}>
                <Modal.Header>
                  <Modal.Title align="center">¿Deséa agregar esta pregunta a su Quiz?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                  <button className="btn btn-success" onClick={() => this.saveQuizPre()}>
                    Si
                  </button>
                  <button className="btn btn-secondary" onClick={() => this.closeModalañadir()}>
                    No
                  </button>
                </Modal.Footer>
              </Modal>

              <Modal show={this.state.visibleañadircopia} width="1000" height="500" effect="fadeInUp" onClickAway={() => this.closeModalañadir()}>
                <Modal.Header>
                  <Modal.Title align="center">Se agregará una copia de esta pregunta a su lista y se vinculará a esta prueba. ¿Deséa realizar esta operació?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                  <button className="btn btn-success" onClick={() => this.savePreguntaCopia()}>
                    Si
                  </button>
                  <button className="btn btn-secondary" onClick={() => this.closeModalañadirCopia()}>
                    No
                  </button>
                </Modal.Footer>
              </Modal>

              <Modal show={this.state.visibleeliminar} width="1000" height="500" effect="fadeInUp" onClickAway={() => this.closeModaleliminar()}>
                <Modal.Header>
                  <Modal.Title align="center">¿Deséa eliminar esta pregunta?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                  <button className="btn btn-secondary" onClick={() => this.closeModaleliminar()}>
                    Close
                  </button>
                  <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Se quita del Quiz, pero se mantiene en su lista de preguntas.</Tooltip>}>
                    <Button className="btn btn-warning" onClick={() => this.deleteQuizPre(deleteid)}>
                      Desvincular
                  </Button>
                  </OverlayTrigger>
                  <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Eliminar definitivamente la pregunta.</Tooltip>}>
                    <Button className="btn btn-danger" onClick={() => this.deletePregunta(deleteidpre)}>
                      Borrar Pregunta
                  </Button>
                  </OverlayTrigger>

                </Modal.Footer>
              </Modal>

              <Modal show={this.state.visibleedit} size="xl" >
                <Modal.Header closeButton onClick={() => this.closeModalEdit()} >
                  <Modal.Title>Editar Pregunta</Modal.Title>
                </Modal.Header>
                {currentPregunta ? (
                  <Modal.Body>
                    <Form>
                      <Form.Row>
                        <Col md="8">
                          <label htmlFor="titulo">Titulo</label>
                          <input
                            type="text"
                            className="form-control"
                            id="titulo"
                            required
                            defaultValue={currentPregunta.titulo}
                            onChange={this.onChangeTitulo2}
                            name="titulo"
                          />
                        </Col>

                        <Form.Group as={Col} md="4 " controlId="formGridState">
                          <Form.Label>Tipo</Form.Label>
                          <Form.Control as="select" defaultValue={currentPregunta.tipo}
                            className="form-control"
                            id="tipo"
                            required
                            onChange={this.onChangeTipo2}
                            name="tipo"
                          >
                            <option disabled>...</option>
                            <option>Verdadero o Falso</option>
                            <option>Alternativas</option>
                            <option>Opcion Multiple</option>
                            <option>Arrastrable</option>
                          </Form.Control>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Col md="3">
                          <label htmlFor="tiempoRespuesta">Tiempo de Respuesta</label>
                          <input
                            type="text"
                            className="form-control"
                            id="tiempoRespuesta"
                            required
                            defaultValue={currentPregunta.tiempoRespuesta}
                            onChange={this.onChangeTiempoRespuesta2}
                            name="tiempoRespuesta"
                          />
                        </Col>
                        <Col md="3">
                          <label htmlFor="puntaje">Puntaje</label>
                          <input
                            type="text"
                            className="form-control"
                            id="puntaje"
                            required
                            defaultValue={currentPregunta.puntaje}
                            onChange={this.onChangePuntaje2}
                            name="puntaje"
                          />
                        </Col>

                        <Col md="1" align="center">

                          <label htmlFor="user">Random</label>
                          <input defaultChecked={currentPregunta.random} type="checkbox" class="make-switch" id="price_check"
                            name="pricing" data-on-color="primary" data-off-color="info" value="true" size="10"
                            onChange={this.onChangeRandom}></input>
                        </Col>

                        <Col md="5">
                          <label htmlFor="user">Id del Usuario</label>
                          <input
                            type="text"
                            className="form-control"
                            id="user"
                            required
                            defaultValue={currentPregunta.user}
                            onChange={this.onChangeUserid2}
                            name="user"
                            disabled />
                        </Col>
                      </Form.Row>

                      <Form.Row>
                        <label htmlFor="enunciado">Enunciado</label>
                        <Form.Control as="textarea" rows={3}
                          className="form-control"
                          id="enunciado"
                          required
                          defaultValue={currentPregunta.enunciado}
                          onChange={this.onChangeEnunciado2}
                          name="enunciado"
                        >
                        </Form.Control>
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
                  <Button variant="primary" onClick={this.updatePregunta}>
                    Editar
                   </Button>
                </Modal.Footer>
              </Modal>


              <Modal show={this.state.visibleopciones} size="xl" >
                <Modal.Header closeButton onClick={() => this.closeModalOpciones()} >
                  <Modal.Title>Añadir Opciones</Modal.Title>
                </Modal.Header>
                {currentPregunta ? (
                  <Modal.Body>
                    <Form>
                      {currentPregunta.tipo == "Arrastrable" && (
                        <div>
                          {input == true ? (
                            <div>
                              <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Regresar</Tooltip>}>
                                <Button size="sm" variant="light" onClick={() => this.onChangeTemplate2(droppableTemplate)}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                                  </svg>
                                </Button>
                              </OverlayTrigger>

                              <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Siguiente</Tooltip>}>
                                <Button size="sm" variant="light" onClick={() => this.onChangeTemplate1(droppableTemplate)}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                                  </svg>
                                </Button>
                              </OverlayTrigger>

                              <br></br>
                              <br></br>
                              <DragDropContext onDragEnd={this.onDragEnd}>
                                <div className="list row">
                                  <div className="col-md-2">
                                    <Droppable droppableId="droppable1">
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          style={getListStyle(snapshot.isDraggingOver)}>
                                          {opcions &&
                                            opcions.map((item, index) => (
                                              <Draggable
                                                key={item}
                                                draggableId={item}
                                                index={index}>
                                                {(provided, snapshot) => (
                                                  <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                      snapshot.isDragging,
                                                      provided.draggableProps.style
                                                    )}>
                                                    {item}
                                                  </div>
                                                )}
                                              </Draggable>
                                            ))}
                                          {provided.placeholder}
                                        </div>
                                      )}
                                    </Droppable>
                                  </div>

                                  {droppableTemplate == "0" && (

                                    <div className="col-md-2">
                                      {currentPregunta.subenunciado1}
                                      <Droppable droppableId="droppable2">
                                        {(provided, snapshot) => (
                                          <div
                                            ref={provided.innerRef}
                                            style={getListStyle(snapshot.isDraggingOver)}>
                                            {selected1 &&
                                              selected1.map((item, index) => (
                                                <Draggable
                                                  key={item}
                                                  draggableId={item}
                                                  index={index}>
                                                  {(provided, snapshot) => (
                                                    <div
                                                      ref={provided.innerRef}
                                                      {...provided.draggableProps}
                                                      {...provided.dragHandleProps}
                                                      style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                      )}>
                                                      {item}
                                                    </div>
                                                  )}
                                                </Draggable>
                                              ))}
                                            {provided.placeholder}
                                          </div>
                                        )}
                                      </Droppable>
                                    </div>
                                  )}

                                  {droppableTemplate == "1" && (
                                    <div className="col-md-10">
                                      <div className="list row">
                                        <div className="col-md-2">
                                          {currentPregunta.subenunciado1}
                                          <Droppable droppableId="droppable2">
                                            {(provided, snapshot) => (
                                              <div
                                                ref={provided.innerRef}
                                                style={getListStyle(snapshot.isDraggingOver)}>
                                                {selected1 &&
                                                  selected1.map((item, index) => (
                                                    <Draggable
                                                      key={item}
                                                      draggableId={item}
                                                      index={index}>
                                                      {(provided, snapshot) => (
                                                        <div
                                                          ref={provided.innerRef}
                                                          {...provided.draggableProps}
                                                          {...provided.dragHandleProps}
                                                          style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                          )}>
                                                          {item}
                                                        </div>
                                                      )}
                                                    </Draggable>
                                                  ))}
                                                {provided.placeholder}
                                              </div>
                                            )}
                                          </Droppable>
                                        </div>

                                        &nbsp;&nbsp;
                                        <div className="col-md-2">
                                          {currentPregunta.subenunciado2}
                                          <Droppable droppableId="droppable3">
                                            {(provided, snapshot) => (
                                              <div
                                                ref={provided.innerRef}
                                                style={getListStyle(snapshot.isDraggingOver)}>
                                                {selected2 &&
                                                  selected2.map((item, index) => (
                                                    <Draggable
                                                      key={item}
                                                      draggableId={item}
                                                      index={index}>
                                                      {(provided, snapshot) => (
                                                        <div
                                                          ref={provided.innerRef}
                                                          {...provided.draggableProps}
                                                          {...provided.dragHandleProps}
                                                          style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                          )}>
                                                          {item}
                                                        </div>
                                                      )}
                                                    </Draggable>
                                                  ))}
                                                {provided.placeholder}
                                              </div>
                                            )}
                                          </Droppable>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {droppableTemplate == "2" && (
                                    <div className="col-md-10">
                                      <div className="list row">
                                        <div className="col-md-2">
                                          {currentPregunta.subenunciado1}
                                          <Droppable droppableId="droppable2">
                                            {(provided, snapshot) => (
                                              <div
                                                ref={provided.innerRef}
                                                style={getListStyle(snapshot.isDraggingOver)}>
                                                {selected1 &&
                                                  selected1.map((item, index) => (
                                                    <Draggable
                                                      key={item}
                                                      draggableId={item}
                                                      index={index}>
                                                      {(provided, snapshot) => (
                                                        <div
                                                          ref={provided.innerRef}
                                                          {...provided.draggableProps}
                                                          {...provided.dragHandleProps}
                                                          style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                          )}>
                                                          {item}
                                                        </div>
                                                      )}
                                                    </Draggable>
                                                  ))}
                                                {provided.placeholder}
                                              </div>
                                            )}
                                          </Droppable>
                                        </div>

                                        &nbsp;&nbsp;
                                        <div className="col-md-2">
                                          {currentPregunta.subenunciado2}
                                          <Droppable droppableId="droppable3">
                                            {(provided, snapshot) => (
                                              <div
                                                ref={provided.innerRef}
                                                style={getListStyle(snapshot.isDraggingOver)}>
                                                {selected2 &&
                                                  selected2.map((item, index) => (
                                                    <Draggable
                                                      key={item}
                                                      draggableId={item}
                                                      index={index}>
                                                      {(provided, snapshot) => (
                                                        <div
                                                          ref={provided.innerRef}
                                                          {...provided.draggableProps}
                                                          {...provided.dragHandleProps}
                                                          style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                          )}>
                                                          {item}
                                                        </div>
                                                      )}
                                                    </Draggable>
                                                  ))}
                                                {provided.placeholder}
                                              </div>
                                            )}
                                          </Droppable>
                                        </div>

                                        &nbsp;&nbsp;
                                        <div className="col-md-2">
                                          {currentPregunta.subenunciado3}
                                          <Droppable droppableId="droppable4">
                                            {(provided, snapshot) => (
                                              <div
                                                ref={provided.innerRef}
                                                style={getListStyle(snapshot.isDraggingOver)}>
                                                {selected3 &&
                                                  selected3.map((item, index) => (
                                                    <Draggable
                                                      key={item}
                                                      draggableId={item}
                                                      index={index}>
                                                      {(provided, snapshot) => (
                                                        <div
                                                          ref={provided.innerRef}
                                                          {...provided.draggableProps}
                                                          {...provided.dragHandleProps}
                                                          style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                          )}>
                                                          {item}
                                                        </div>
                                                      )}
                                                    </Draggable>
                                                  ))}
                                                {provided.placeholder}
                                              </div>
                                            )}
                                          </Droppable>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {droppableTemplate == "3" && (
                                    <div className="col-md-10">
                                      <div className="list row">
                                        <div className="col-md-2">
                                          {currentPregunta.subenunciado1}
                                          <Droppable droppableId="droppable2">
                                            {(provided, snapshot) => (
                                              <div
                                                ref={provided.innerRef}
                                                style={getListStyle(snapshot.isDraggingOver)}>
                                                {selected1 &&
                                                  selected1.map((item, index) => (
                                                    <Draggable
                                                      key={item}
                                                      draggableId={item}
                                                      index={index}>
                                                      {(provided, snapshot) => (
                                                        <div
                                                          ref={provided.innerRef}
                                                          {...provided.draggableProps}
                                                          {...provided.dragHandleProps}
                                                          style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                          )}>
                                                          {item}
                                                        </div>
                                                      )}
                                                    </Draggable>
                                                  ))}
                                                {provided.placeholder}
                                              </div>
                                            )}
                                          </Droppable>
                                        </div>

                                        &nbsp;&nbsp;
                                        <div className="col-md-2">
                                          {currentPregunta.subenunciado2}
                                          <Droppable droppableId="droppable3">
                                            {(provided, snapshot) => (
                                              <div
                                                ref={provided.innerRef}
                                                style={getListStyle(snapshot.isDraggingOver)}>
                                                {selected2 &&
                                                  selected2.map((item, index) => (
                                                    <Draggable
                                                      key={item}
                                                      draggableId={item}
                                                      index={index}>
                                                      {(provided, snapshot) => (
                                                        <div
                                                          ref={provided.innerRef}
                                                          {...provided.draggableProps}
                                                          {...provided.dragHandleProps}
                                                          style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                          )}>
                                                          {item}
                                                        </div>
                                                      )}
                                                    </Draggable>
                                                  ))}
                                                {provided.placeholder}
                                              </div>
                                            )}
                                          </Droppable>
                                        </div>

                                        &nbsp;&nbsp;
                                        <div className="col-md-2">
                                          {currentPregunta.subenunciado3}
                                          <Droppable droppableId="droppable4">
                                            {(provided, snapshot) => (
                                              <div
                                                ref={provided.innerRef}
                                                style={getListStyle(snapshot.isDraggingOver)}>
                                                {selected3 &&
                                                  selected3.map((item, index) => (
                                                    <Draggable
                                                      key={item}
                                                      draggableId={item}
                                                      index={index}>
                                                      {(provided, snapshot) => (
                                                        <div
                                                          ref={provided.innerRef}
                                                          {...provided.draggableProps}
                                                          {...provided.dragHandleProps}
                                                          style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                          )}>
                                                          {item}
                                                        </div>
                                                      )}
                                                    </Draggable>
                                                  ))}
                                                {provided.placeholder}
                                              </div>
                                            )}
                                          </Droppable>
                                        </div>

                                        &nbsp;&nbsp;
                                        <div className="col-md-2">
                                          {currentPregunta.subenunciado4}
                                          <Droppable droppableId="droppable5">
                                            {(provided, snapshot) => (
                                              <div
                                                ref={provided.innerRef}
                                                style={getListStyle(snapshot.isDraggingOver)}>
                                                {selected4 &&
                                                  selected4.map((item, index) => (
                                                    <Draggable
                                                      key={item}
                                                      draggableId={item}
                                                      index={index}>
                                                      {(provided, snapshot) => (
                                                        <div
                                                          ref={provided.innerRef}
                                                          {...provided.draggableProps}
                                                          {...provided.dragHandleProps}
                                                          style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                          )}>
                                                          {item}
                                                        </div>
                                                      )}
                                                    </Draggable>
                                                  ))}
                                                {provided.placeholder}
                                              </div>
                                            )}
                                          </Droppable>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {droppableTemplate == "4" && (
                                    <div className="col-md-10">
                                      <br></br>
                                      <br></br>
                                      <br></br>
                                      <br></br>
                                      <Droppable droppableId="droppable2">
                                        {(provided, snapshot) => (
                                          <div
                                            ref={provided.innerRef}
                                            style={getListStyle2(snapshot.isDraggingOver)}>
                                            {currentPregunta.subenunciado1}{"..."}
                                            {selected1 &&
                                              selected1.map((item, index) => (
                                                <Draggable
                                                  key={item}
                                                  draggableId={item}
                                                  index={index}>
                                                  {(provided, snapshot) => (
                                                    <div
                                                      ref={provided.innerRef}
                                                      {...provided.draggableProps}
                                                      {...provided.dragHandleProps}
                                                      style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                      )}>
                                                      {item}
                                                    </div>
                                                  )}
                                                </Draggable>
                                              ))}
                                            {provided.placeholder}
                                          </div>
                                        )}
                                      </Droppable>
                                    </div>
                                  )}

                                  {droppableTemplate == "5" && (
                                    <div className="col-md-10">
                                      <br></br>
                                      <br></br>
                                      <br></br>
                                      <Droppable droppableId="droppable2">
                                        {(provided, snapshot) => (
                                          <div
                                            ref={provided.innerRef}
                                            style={getListStyle2(snapshot.isDraggingOver)}>
                                            {currentPregunta.subenunciado1}{"..."}
                                            {selected1 &&
                                              selected1.map((item, index) => (
                                                <Draggable
                                                  key={item}
                                                  draggableId={item}
                                                  index={index}>
                                                  {(provided, snapshot) => (
                                                    <div
                                                      ref={provided.innerRef}
                                                      {...provided.draggableProps}
                                                      {...provided.dragHandleProps}
                                                      style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                      )}>
                                                      {item}
                                                    </div>
                                                  )}
                                                </Draggable>
                                              ))}
                                            {provided.placeholder}
                                          </div>
                                        )}
                                      </Droppable>

                                      <br></br>
                                      <Droppable droppableId="droppable3">
                                        {(provided, snapshot) => (
                                          <div
                                            ref={provided.innerRef}
                                            style={getListStyle2(snapshot.isDraggingOver)}>
                                            {currentPregunta.subenunciado2}{"..."}
                                            {selected2 &&
                                              selected2.map((item, index) => (
                                                <Draggable
                                                  key={item}
                                                  draggableId={item}
                                                  index={index}>
                                                  {(provided, snapshot) => (
                                                    <div
                                                      ref={provided.innerRef}
                                                      {...provided.draggableProps}
                                                      {...provided.dragHandleProps}
                                                      style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                      )}>
                                                      {item}
                                                    </div>
                                                  )}
                                                </Draggable>
                                              ))}
                                            {provided.placeholder}
                                          </div>
                                        )}
                                      </Droppable>
                                    </div>
                                  )}

                                  {droppableTemplate == "6" && (
                                    <div className="col-md-10">
                                      <br></br>
                                      <br></br>
                                      <Droppable droppableId="droppable2">
                                        {(provided, snapshot) => (
                                          <div
                                            ref={provided.innerRef}
                                            style={getListStyle2(snapshot.isDraggingOver)}>
                                            {currentPregunta.subenunciado1}{"..."}
                                            {selected1 &&
                                              selected1.map((item, index) => (
                                                <Draggable
                                                  key={item}
                                                  draggableId={item}
                                                  index={index}>
                                                  {(provided, snapshot) => (
                                                    <div
                                                      ref={provided.innerRef}
                                                      {...provided.draggableProps}
                                                      {...provided.dragHandleProps}
                                                      style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                      )}>
                                                      {item}
                                                    </div>
                                                  )}
                                                </Draggable>
                                              ))}
                                            {provided.placeholder}
                                          </div>
                                        )}
                                      </Droppable>

                                      <br></br>
                                      <Droppable droppableId="droppable3">
                                        {(provided, snapshot) => (
                                          <div
                                            ref={provided.innerRef}
                                            style={getListStyle2(snapshot.isDraggingOver)}>
                                            {currentPregunta.subenunciado2}{"..."}
                                            {selected2 &&
                                              selected2.map((item, index) => (
                                                <Draggable
                                                  key={item}
                                                  draggableId={item}
                                                  index={index}>
                                                  {(provided, snapshot) => (
                                                    <div
                                                      ref={provided.innerRef}
                                                      {...provided.draggableProps}
                                                      {...provided.dragHandleProps}
                                                      style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                      )}>
                                                      {item}
                                                    </div>
                                                  )}
                                                </Draggable>
                                              ))}
                                            {provided.placeholder}
                                          </div>
                                        )}
                                      </Droppable>

                                      <br></br>
                                      <Droppable droppableId="droppable4">
                                        {(provided, snapshot) => (
                                          <div
                                            ref={provided.innerRef}
                                            style={getListStyle2(snapshot.isDraggingOver)}>
                                            {currentPregunta.subenunciado3}{"..."}
                                            {selected3 &&
                                              selected3.map((item, index) => (
                                                <Draggable
                                                  key={item}
                                                  draggableId={item}
                                                  index={index}>
                                                  {(provided, snapshot) => (
                                                    <div
                                                      ref={provided.innerRef}
                                                      {...provided.draggableProps}
                                                      {...provided.dragHandleProps}
                                                      style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                      )}>
                                                      {item}
                                                    </div>
                                                  )}
                                                </Draggable>
                                              ))}
                                            {provided.placeholder}
                                          </div>
                                        )}
                                      </Droppable>
                                    </div>
                                  )}

                                  {droppableTemplate == "7" && (
                                    <div className="col-md-10">
                                      <br></br>
                                      <Droppable droppableId="droppable2">
                                        {(provided, snapshot) => (
                                          <div
                                            ref={provided.innerRef}
                                            style={getListStyle2(snapshot.isDraggingOver)}>
                                            {currentPregunta.subenunciado1}{"..."}
                                            {selected1 &&
                                              selected1.map((item, index) => (
                                                <Draggable
                                                  key={item}
                                                  draggableId={item}
                                                  index={index}>
                                                  {(provided, snapshot) => (
                                                    <div
                                                      ref={provided.innerRef}
                                                      {...provided.draggableProps}
                                                      {...provided.dragHandleProps}
                                                      style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                      )}>
                                                      {item}
                                                    </div>
                                                  )}
                                                </Draggable>
                                              ))}
                                            {provided.placeholder}
                                          </div>
                                        )}
                                      </Droppable>

                                      <br></br>
                                      <Droppable droppableId="droppable3">
                                        {(provided, snapshot) => (
                                          <div
                                            ref={provided.innerRef}
                                            style={getListStyle2(snapshot.isDraggingOver)}>
                                            {currentPregunta.subenunciado2}{"..."}
                                            {selected2 &&
                                              selected2.map((item, index) => (
                                                <Draggable
                                                  key={item}
                                                  draggableId={item}
                                                  index={index}>
                                                  {(provided, snapshot) => (
                                                    <div
                                                      ref={provided.innerRef}
                                                      {...provided.draggableProps}
                                                      {...provided.dragHandleProps}
                                                      style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                      )}>
                                                      {item}
                                                    </div>
                                                  )}
                                                </Draggable>
                                              ))}
                                            {provided.placeholder}
                                          </div>
                                        )}
                                      </Droppable>

                                      <br></br>
                                      <Droppable droppableId="droppable4">
                                        {(provided, snapshot) => (
                                          <div
                                            ref={provided.innerRef}
                                            style={getListStyle2(snapshot.isDraggingOver)}>
                                            {currentPregunta.subenunciado3}{"..."}
                                            {selected3 &&
                                              selected3.map((item, index) => (
                                                <Draggable
                                                  key={item}
                                                  draggableId={item}
                                                  index={index}>
                                                  {(provided, snapshot) => (
                                                    <div
                                                      ref={provided.innerRef}
                                                      {...provided.draggableProps}
                                                      {...provided.dragHandleProps}
                                                      style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                      )}>
                                                      {item}
                                                    </div>
                                                  )}
                                                </Draggable>
                                              ))}
                                            {provided.placeholder}
                                          </div>
                                        )}
                                      </Droppable>

                                      <br></br>
                                      <Droppable droppableId="droppable5">
                                        {(provided, snapshot) => (
                                          <div
                                            ref={provided.innerRef}
                                            style={getListStyle2(snapshot.isDraggingOver)}>
                                            {currentPregunta.subenunciado4}{"..."}
                                            {selected4 &&
                                              selected4.map((item, index) => (
                                                <Draggable
                                                  key={item}
                                                  draggableId={item}
                                                  index={index}>
                                                  {(provided, snapshot) => (
                                                    <div
                                                      ref={provided.innerRef}
                                                      {...provided.draggableProps}
                                                      {...provided.dragHandleProps}
                                                      style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                      )}>
                                                      {item}
                                                    </div>
                                                  )}
                                                </Draggable>
                                              ))}
                                            {provided.placeholder}
                                          </div>
                                        )}
                                      </Droppable>
                                    </div>
                                  )}
                                </div>
                              </DragDropContext>
                            </div>
                          ) : (
                            <div>
                              <div className="list row">
                                <div className="col-md-7">
                                  <Form.Row>
                                    <Col md="5">
                                      <label htmlFor="opcion1">Opcion 1</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="opcion1"
                                        required
                                        defaultValue={currentPregunta.opcion1}
                                        onChange={this.onChangeOpcion12}
                                        name="opcion1"
                                      />
                                    </Col>

                                    <Col md="5">
                                      <label htmlFor="opcion2">Opcion 2</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="opcion2"
                                        required
                                        defaultValue={currentPregunta.opcion2}
                                        onChange={this.onChangeOpcion22}
                                        name="opcion2"
                                      />
                                    </Col>
                                  </Form.Row>

                                  <Form.Row>
                                    <Col md="5">
                                      <label htmlFor="opcion3">Opcion 3</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="opcion3"
                                        required
                                        defaultValue={currentPregunta.opcion3}
                                        onChange={this.onChangeOpcion32}
                                        name="opcion3"
                                      />
                                    </Col>

                                    <Col md="5">
                                      <label htmlFor="opcion4">Opcion 4</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="opcion4"
                                        required
                                        defaultValue={currentPregunta.opcion4}
                                        onChange={this.onChangeOpcion42}
                                        name="opcion4"
                                      />
                                    </Col>
                                  </Form.Row>

                                  <Form.Row>
                                    <Col md="5">
                                      <label htmlFor="subenunciado1">Sub-Enunciado1</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="subenunciado1"
                                        required
                                        defaultValue={currentPregunta.subenunciado1}
                                        onChange={this.onChangeSubenunciado12}
                                        name="subenunciado1"
                                      />
                                    </Col>
                                    <Col md="5">
                                      <label htmlFor="subenunciado2">Sub-Enunciado2</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="subenunciado2"
                                        required
                                        defaultValue={currentPregunta.subenunciado2}
                                        onChange={this.onChangeSubenunciado22}
                                        name="subenunciado2"
                                      />
                                    </Col>
                                  </Form.Row>

                                  <Form.Row>
                                    <Col md="5">
                                      <label htmlFor="subenunciado3">Sub-Enunciado3</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="subenunciado3"
                                        required
                                        defaultValue={currentPregunta.subenunciado3}
                                        onChange={this.onChangeSubenunciado32}
                                        name="subenunciado3"
                                      />
                                    </Col>
                                    <Col md="5">
                                      <label htmlFor="subenunciado4">Sub-Enunciado4</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="subenunciado4"
                                        required
                                        defaultValue={currentPregunta.subenunciado4}
                                        onChange={this.onChangeSubenunciado42}
                                        name="subenunciado4"
                                      />
                                    </Col>
                                  </Form.Row>
                                </div>

                                <div className="col-md-5">
                                  <Table striped bordered hover>
                                    <h3 class="center">Preguntas Frecuentes</h3>
                                    <Accordion defaultActiveKey="0">
                                      <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                          ¿De qué me sirve esta interfaz?
                                        </Accordion.Toggle>
                                      </Card.Header>
                                      <Accordion.Collapse eventKey="0">
                                        <Card.Body>Para configurar tu pregunta “Arrastrable”, primero ingresa los valores que tendrán tus opciones, después de eso se te mostrará otra interfaz, ahí deberás configurar las respuestas.</Card.Body>
                                      </Accordion.Collapse>
                                      <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                          ¿Cómo configuro las respuestas de una pregunta “Arrastrable”?
                                        </Accordion.Toggle>
                                      </Card.Header>
                                      <Accordion.Collapse eventKey="1">
                                        <Card.Body>Para configurar las respuestas, deberás arrastrar las opciones y ubicarlas en sus respectivos espacios, de ese modo configuras las respuestas.</Card.Body>
                                      </Accordion.Collapse>
                                    </Accordion>
                                  </Table>
                                </div>
                              </div>

                              <Form.Row hidden>
                                <Col md="8">
                                  <label htmlFor="titulo">Titulo</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="titulo"
                                    required
                                    defaultValue={currentPregunta.titulo}
                                    onChange={this.onChangeTitulo2}
                                    name="titulo"
                                    disabled
                                  />
                                </Col>

                                <Form.Group as={Col} md="4 " controlId="formGridState">
                                  <Form.Label>Tipo</Form.Label>
                                  <Form.Control as="select" defaultValue={currentPregunta.tipo}
                                    className="form-control"
                                    id="tipo"
                                    required
                                    onChange={this.onChangeTipo2}
                                    name="tipo"
                                    disabled
                                  >
                                    <option disabled>...</option>
                                    <option>Verdadero o Falso</option>
                                    <option>Alternativas</option>
                                    <option>Opcion Multiple</option>
                                    <option>Arrastrable</option>
                                  </Form.Control>
                                </Form.Group>
                              </Form.Row>
                              <Form.Row hidden>
                                <Col md="3">
                                  <label htmlFor="tiempoRespuesta">Tiempo de Respuesta</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="tiempoRespuesta"
                                    required
                                    defaultValue={currentPregunta.tiempoRespuesta}
                                    onChange={this.onChangeTiempoRespuesta2}
                                    name="tiempoRespuesta"
                                    disabled
                                  />
                                </Col>
                                <Col md="3">
                                  <label htmlFor="puntaje">Puntaje</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="puntaje"
                                    required
                                    defaultValue={currentPregunta.puntaje}
                                    onChange={this.onChangePuntaje2}
                                    name="puntaje"
                                    disabled
                                  />
                                </Col>

                                <Col md="1" align="center">

                                  <label htmlFor="user">Random</label>
                                  <input defaultChecked={currentPregunta.random} type="checkbox" class="make-switch" id="price_check"
                                    name="pricing" data-on-color="primary" data-off-color="info" value="true" size="10"
                                    onChange={this.onChangeRandom}
                                    disabled
                                  ></input>
                                </Col>

                                <Col md="5">
                                  <label htmlFor="user">Id del Usuario</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="user"
                                    required
                                    defaultValue={currentPregunta.user}
                                    onChange={this.onChangeUserid2}
                                    name="user"
                                    disabled />
                                </Col>
                              </Form.Row>

                              <Form.Row hidden>
                                <label htmlFor="enunciado">Enunciado</label>
                                <Form.Control as="textarea" rows={3}
                                  className="form-control"
                                  id="enunciado"
                                  required
                                  defaultValue={currentPregunta.enunciado}
                                  onChange={this.onChangeEnunciado2}
                                  name="enunciado"
                                  disabled
                                >
                                </Form.Control>
                              </Form.Row>

                              <br></br>
                              <Button onClick={() => this.onChangeInput()} > Siguiente </Button>
                            </div>
                          )}
                        </div>
                      )}

                      {currentPregunta.tipo != "Arrastrable" && (
                        <div>
                          <Form.Row>
                            <Col md="8">
                              <label htmlFor="opcion1">Opcion 1</label>
                              <input
                                type="text"
                                className="form-control"
                                id="opcion1"
                                required
                                defaultValue={currentPregunta.opcion1}
                                onChange={this.onChangeOpcion12}
                                name="opcion1"
                              />
                            </Col>
                            <Col md="4">
                              <label htmlFor="respuesta1">Respuesta 1</label>
                              <input
                                type="text"
                                className="form-control"
                                id="respuesta1"
                                required
                                defaultValue={currentPregunta.respuesta1}
                                onChange={this.onChangeRespuesta12}
                                name="respuesta1"
                              />
                            </Col>
                          </Form.Row>

                          <Form.Row>
                            <Col md="8">
                              <label htmlFor="opcion2">Opcion 2</label>
                              <input
                                type="text"
                                className="form-control"
                                id="opcion2"
                                required
                                defaultValue={currentPregunta.opcion2}
                                onChange={this.onChangeOpcion22}
                                name="opcion2"
                              />
                            </Col>
                            <Col md="4">
                              <label htmlFor="respuesta2">Respuesta 2</label>
                              <input
                                type="text"
                                className="form-control"
                                id="respuesta2"
                                required
                                defaultValue={currentPregunta.respuesta2}
                                onChange={this.onChangeRespuesta22}
                                name="respuesta2"
                              />
                            </Col>
                          </Form.Row>

                          <Form.Row>
                            <Col md="8">
                              <label htmlFor="opcion3">Opcion 3</label>
                              <input
                                type="text"
                                className="form-control"
                                id="opcion3"
                                required
                                defaultValue={currentPregunta.opcion3}
                                onChange={this.onChangeOpcion32}
                                name="opcion3"
                              />
                            </Col>
                            <Col md="4">
                              <label htmlFor="respuesta3">Respuesta 3</label>
                              <input
                                type="text"
                                className="form-control"
                                id="respuesta3"
                                required
                                defaultValue={currentPregunta.respuesta3}
                                onChange={this.onChangeRespuesta32}
                                name="respuesta3"
                              />
                            </Col>
                          </Form.Row>

                          <Form.Row>
                            <Col md="8">
                              <label htmlFor="opcion4">Opcion 4</label>
                              <input
                                type="text"
                                className="form-control"
                                id="opcion4"
                                required
                                defaultValue={currentPregunta.opcion4}
                                onChange={this.onChangeOpcion42}
                                name="opcion4"
                              />
                            </Col>
                            <Col md="4">
                              <label htmlFor="respuesta4">Respuesta 4</label>
                              <input
                                type="text"
                                className="form-control"
                                id="respuesta4"
                                required
                                defaultValue={currentPregunta.respuesta4}
                                onChange={this.onChangeRespuesta42}
                                name="respuesta4"
                              />
                            </Col>
                          </Form.Row>

                          <Form.Row hidden>
                            <Col md="5">
                              <label htmlFor="subenunciado1">Sub-Enunciado1</label>
                              <input
                                type="text"
                                className="form-control"
                                id="subenunciado1"
                                required
                                defaultValue={currentPregunta.subenunciado1}
                                onChange={this.onChangeSubenunciado12}
                                name="subenunciado1"
                                disabled
                              />
                            </Col>
                            <Col md="5">
                              <label htmlFor="subenunciado2">Sub-Enunciado2</label>
                              <input
                                type="text"
                                className="form-control"
                                id="subenunciado2"
                                required
                                defaultValue={currentPregunta.subenunciado2}
                                onChange={this.onChangeSubenunciado12}
                                name="subenunciado2"
                                disabled
                              />
                            </Col>
                          </Form.Row>

                          <Form.Row hidden>
                            <Col md="5">
                              <label htmlFor="subenunciado3">Sub-Enunciado3</label>
                              <input
                                type="text"
                                className="form-control"
                                id="subenunciado3"
                                required
                                defaultValue={currentPregunta.subenunciado3}
                                onChange={this.onChangeSubenunciado12}
                                name="subenunciado3"
                                disabled
                              />
                            </Col>
                            <Col md="5">
                              <label htmlFor="subenunciado4">Sub-Enunciado4</label>
                              <input
                                type="text"
                                className="form-control"
                                id="subenunciado4"
                                required
                                defaultValue={currentPregunta.subenunciado4}
                                onChange={this.onChangeSubenunciado12}
                                name="subenunciado4"
                                disabled
                              />
                            </Col>
                          </Form.Row>

                          <Form.Row hidden>
                            <Col md="8">
                              <label htmlFor="titulo">Titulo</label>
                              <input
                                type="text"
                                className="form-control"
                                id="titulo"
                                required
                                defaultValue={currentPregunta.titulo}
                                onChange={this.onChangeTitulo2}
                                name="titulo"
                                disabled
                              />
                            </Col>

                            <Form.Group as={Col} md="4 " controlId="formGridState">
                              <Form.Label>Tipo</Form.Label>
                              <Form.Control as="select" defaultValue={currentPregunta.tipo}
                                className="form-control"
                                id="tipo"
                                required
                                onChange={this.onChangeTipo2}
                                name="tipo"
                                disabled
                              >
                                <option disabled>...</option>
                                <option>Verdadero o Falso</option>
                                <option>Alternativas</option>
                                <option>Opcion Multiple</option>
                              </Form.Control>
                            </Form.Group>
                          </Form.Row>
                          <Form.Row hidden>
                            <Col md="3">
                              <label htmlFor="tiempoRespuesta">Tiempo de Respuesta</label>
                              <input
                                type="text"
                                className="form-control"
                                id="tiempoRespuesta"
                                required
                                defaultValue={currentPregunta.tiempoRespuesta}
                                onChange={this.onChangeTiempoRespuesta2}
                                name="tiempoRespuesta"
                                disabled
                              />
                            </Col>
                            <Col md="3">
                              <label htmlFor="puntaje">Puntaje</label>
                              <input
                                type="text"
                                className="form-control"
                                id="puntaje"
                                required
                                defaultValue={currentPregunta.puntaje}
                                onChange={this.onChangePuntaje2}
                                name="puntaje"
                                disabled
                              />
                            </Col>

                            <Col md="1" align="center">

                              <label htmlFor="user">Random</label>
                              <input defaultChecked={currentPregunta.random} type="checkbox" class="make-switch" id="price_check"
                                name="pricing" data-on-color="primary" data-off-color="info" value="true" size="10"
                                onChange={this.onChangeRandom}
                                disabled
                              ></input>
                            </Col>

                            <Col md="5">
                              <label htmlFor="user">Id del Usuario</label>
                              <input
                                type="text"
                                className="form-control"
                                id="user"
                                required
                                defaultValue={currentPregunta.user}
                                onChange={this.onChangeUserid2}
                                name="user"
                                disabled />
                            </Col>
                          </Form.Row>

                          <Form.Row hidden>
                            <label htmlFor="enunciado">Enunciado</label>
                            <Form.Control as="textarea" rows={3}
                              className="form-control"
                              id="enunciado"
                              required
                              defaultValue={currentPregunta.enunciado}
                              onChange={this.onChangeEnunciado2}
                              name="enunciado"
                              disabled
                            >
                            </Form.Control>
                          </Form.Row>
                        </div>
                      )}
                    </Form>
                  </Modal.Body>
                ) : (
                  <div>
                    <br />
                  </div>
                )}
                <Modal.Footer>
                  {currentPregunta.tipo == "Arrastrable" && (
                    <div>
                      {input == true ? (
                        <div>
                          <Button variant="secondary" onClick={() => this.closeModalOpciones()} >
                            Cerrar
                      </Button>
                      &nbsp;
                          <Button variant="primary" onClick={this.updatePregunta2}>
                            Editar
                      </Button>
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  )}

                  {currentPregunta.tipo != "Arrastrable" && (
                    <div>
                      <Button variant="secondary" onClick={() => this.closeModalOpciones()} >
                        Cerrar
                      </Button>
                      &nbsp;
                      <Button variant="primary" onClick={this.updatePregunta}>
                        Editar
                      </Button>
                    </div>
                  )}
                </Modal.Footer>
              </Modal>
            </div>
          ))}

          {showUserBoard && (
            <h3>Usted no tiene el permiso para acceder a esta zona.</h3>
          )}
        </header>
        <br></br>
      </div>
    );
  }
}