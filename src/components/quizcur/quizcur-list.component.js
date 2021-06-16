import React, { Component } from "react";
import QuizCurDataService from "../../services/quizcur.service";
import QuizDataService from "../../services/quiz.service";
import CursoDataService from "../../services/curso.service";
import RamoDataService from "../../services/ramo.service";
import RecursoDataService from "../../services/recurso.service";
import PreguntaDataService from "../../services/pregunta.service";
import PreRecurDataService from "../../services/prerecur.service";
import QuizPreDataService from "../../services/quizpre.service";
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";
import {
  Accordion, Card, Table, Button, Modal, FormControl,
  Form, Col, OverlayTrigger, Tooltip, Row, Nav, Tab
} from 'react-bootstrap';


export default class QuizCurList extends Component {
  constructor(props) {
    super(props);
    this.retrieveQuizCurs = this.retrieveQuizCurs.bind(this);
    this.retrievePre = this.retrievePre.bind(this);
    //SAVE
    this.saveQuizCur = this.saveQuizCur.bind(this);
    //CREATE
    this.onChangeTitulo = this.onChangeTitulo.bind(this);
    this.onChangeDescripcion = this.onChangeDescripcion.bind(this);
    this.onChangeActivo = this.onChangeActivo.bind(this);
    this.onChangeTiempodisponible = this.onChangeTiempodisponible.bind(this);
    this.onChangeFechacreacion = this.onChangeFechacreacion.bind(this);
    this.onChangeUserid = this.onChangeUserid.bind(this);
    this.onChangeFechatermino = this.onChangeFechatermino.bind(this);
    this.onChangePrivado = this.onChangePrivado.bind(this);
    this.saveQuiz = this.saveQuiz.bind(this);
    this.newQuiz = this.newQuiz.bind(this);
    //Delete
    this.deleteQuizCur = this.deleteQuizCur.bind(this);
    this.setActiveQuiz = this.setActiveQuiz.bind(this);
    //UPDATE
    this.updateQuiz = this.updateQuiz.bind(this);
    this.onChangeTitulo2 = this.onChangeTitulo2.bind(this);
    this.onChangeDescripcion2 = this.onChangeDescripcion2.bind(this);
    this.onChangeActivo2 = this.onChangeActivo2.bind(this);
    this.onChangeTiempodisponible2 = this.onChangeTiempodisponible2.bind(this);
    this.onChangeFechacreacion2 = this.onChangeFechacreacion2.bind(this);
    this.onChangeFechatermino2 = this.onChangeFechatermino2.bind(this);
    this.onChangePrivado2 = this.onChangePrivado2.bind(this);
    this.saveQuizCopia = this.saveQuizCopia.bind(this);
    // this.updateQuizAñadidos = this.updateQuizAñadidos.bind(this);

    this.state = {
      currentQuiz: {
        id: null,
        titulo: "",
        descripcion: "",
        activo: "",
        tiempodisponible: "",
        usuarioid: "",
        fechacreacion: "",
        fechatermino: "",
        privado: "",

      },
      currentCurso: {
        id: null,
        codigo: "",
        semestre: "",
        año: "",
        descripcion: "",
        password: "",
        activo: "",
        ramoid: ""
      },
      currentRamo: {
        id: null,
        codigo: "",
        nombre: "",
        semestre: "",
        descripcion: ""
      },
      //--------------
      id: null,
      titulo: "",
      descripcion: "",
      activo: "",
      tiempodisponible: "",
      usuarioid: "",
      fechacreacion: "",
      fechatermino: "",
      privado: "",
      //..........
      deleteid: "",
      usuario: "",
      quizcurs: [],
      quizs: [],
      recursos: [],
      prerecurs: [],
      preguntas: [],
      quizsPublicos: [],
      quizsPropios: [],
      quizsAñadidos: [],
      quizpres: [],
      preguntasDelQuiz: [],
      visibledelete: false,
      visible: false,
      showUserBoard: false,
      visibleshow: false,
      cargashow: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
      currentQuizCopia: undefined,
      visibleshowpreguntas: false,
      visibleshowpregunta: false,
      visibleshowRecurso: false,
      currentPregunta: "",
      recursoEncontrado: [],
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
      paginateAgre: 1,

      paginacionPreguntas: [],
      listapaginacionPreguntas: [],
      paginatePreguntas: 1

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
    this.getCurso(this.props.match.params.id);
    await this.retrievePre();
  }

  async retrievePre() {
    try {
      await Promise.all([this.retrieveRecursos(), this.retrievePreRecurs(), this.retrievePreguntas(), this.retrieveQuizCurs(), this.retrieveQuizs(), this.retrieveQuizPres()]);
      await this.retrieveFiltro();
    } catch (error) {
      console.log(error);
    }
  }

  //====================================
  async retrieveQuizs() {
    await QuizDataService.getAll()
      .then(response => {
        this.setState({
          quizs: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  async retrieveQuizCurs() {
    await QuizCurDataService.getAll()
      .then(response => {
        this.setState({
          quizcurs: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }
  async retrieveQuizPres() {
    await QuizPreDataService.getAll()
      .then(response => {
        this.setState({
          quizpres: response.data
        });
      })
      .catch(e => {
        console.log(e);
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
        console.log(e);
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
        console.log(e);
      });
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
  //====================================
  async retrieveFiltro() {
    var listaPublicosNoAñadidos = this.state.quizs.slice();
    var listaPropiosNoAñadidos = this.state.quizs.slice();
    var quizs = this.state.quizs.slice();
    var listaQuizCurs = this.state.quizcurs.slice();
    var listaQuizCursNoAñadidas = this.state.quizcurs.slice();
    var quizsAñadido = [], quizSeleccionado = [];

    //Prerecurs Añadidas
    if (listaQuizCurs.length > 0) {
      listaQuizCurs = listaQuizCurs.filter(quizcur => quizcur.cursoid == this.props.match.params.id);
    }
    console.log(this.props.match.params.id)
    console.log(listaQuizCurs)
    if (listaQuizCurs.length > 0) {
      listaQuizCursNoAñadidas = listaQuizCursNoAñadidas.filter((quizcur) => (quizcur.cursoid != this.props.match.params.id));
    }

    //==========AÑADIDA=========
    if (listaQuizCurs.length > 0) {
      listaQuizCurs.forEach(quizcur => {
        quizSeleccionado = quizs.find(quiz => quizcur.quizid == quiz.id);
        if (quizsAñadido) {
          quizsAñadido.push(quizSeleccionado);
        } else {
          quizSeleccionado = [];
        }
      });
    } else {
      quizsAñadido = [];
    }

    //===PUBLICAS NO AÑADIDAS===
    if (listaQuizCurs.length > 0) {
      listaQuizCurs.forEach(quizcur => {
        listaPublicosNoAñadidos = listaPublicosNoAñadidos.filter(quiz => quiz.id != quizcur.quizid && quiz.privado == false && quiz.usuarioid != this.state.currentUser.id);
      });
    } else {
      listaPublicosNoAñadidos = listaPublicosNoAñadidos.filter(quiz => quiz.privado == false && quiz.usuarioid != this.state.currentUser.id);
    }

    //===PROPIAS NO AÑADIDAS====
    if (listaQuizCurs.length > 0) {
      listaQuizCurs.forEach(quizcur => {
        listaPropiosNoAñadidos = listaPropiosNoAñadidos.filter(quiz => quizcur.quizid != quiz.id && quiz.usuarioid == this.state.currentUser.id);
      });
    } else {
      listaPropiosNoAñadidos = listaPropiosNoAñadidos.filter(quiz => quiz.usuarioid == this.state.currentUser.id);
    }


    //===============================================
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
    const respuesta2 = await this.retrieveFiltroPorPagina(quizsAñadido);
    this.setState({
      listapaginacionAgregadas: respuesta2[0],
      paginacionAgregadas: respuesta2[1]
    });
    //================================================
    this.setState({
      quizsPublicos: listaPublicosNoAñadidos,
      quizsPropios: listaPropiosNoAñadidos,
      quizsAñadidos: quizsAñadido
    });
  }
  //====================================================

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
    if (tipo == "preguntas") {
      this.setState({
        listapaginacionPreguntas: currentPosts,
        paginatePreguntas: pag
      });
      console.log("preguntas")
    }
  }
  //================================================
  //================================================

  getCurso(id) {
    CursoDataService.get(id)
      .then(response => {
        this.setState({
          currentCurso: response.data
        });
        RamoDataService.get(response.data.ramoid)
          .then(response => {
            this.setState({
              currentRamo: response.data
            });
            // console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
      })
      .catch(e => {
        console.log(e);
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

  setActiveQuiz(quiz, index) {
    this.setState({
      currentQuiz: quiz,
      currentIndex: index
    });
  }

  setActivePregunta(pregunta, index) {
    this.setState({
      currentPregunta: pregunta,
      currentIndex: index
    });
  }

  async saveQuizCur(currentQuiz, id2) {
    var data = {
      cursoid: id2,
      quizid: currentQuiz.id
    };

    await QuizCurDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          quizid: response.data.quizid,
          cursoid: response.data.cursoid,
          submitted: true
        });
      })
      .catch(e => {
        console.log(e);
      });
    this.closeModal();
    await this.retrievePre();
  }

  async saveQuiz() {
    var data = {
      titulo: this.state.titulo,
      descripcion: this.state.descripcion,
      activo: this.state.activo,
      tiempodisponible: this.state.tiempodisponible,
      usuarioid: this.state.currentUser.id,
      fechacreacion: this.state.fechacreacion,
      fechatermino: this.state.fechatermino,
      privado: this.state.privado
    };

    await QuizDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          titulo: response.data.titulo,
          descripcion: response.data.descripcion,
          activo: response.data.activo,
          tiempodisponible: response.data.tiempodisponible,
          usuarioid: response.data.usuarioid,
          fechacreacion: response.data.fechacreacion,
          fechatermino: response.data.fechatermino,
          privado: response.data.privado,
          submitted: true
        });
        var data = {
          cursoid: this.props.match.params.id,
          quizid: response.data.id
        };

        QuizCurDataService.create(data)
          .then(response => {
            this.setState({
              id: response.data.id,
              quizid: response.data.tagid,
              cursoid: response.data.id,

              submitted: true
            });
            //-------------------------------------------
            //Limpiar DATOS
            this.newQuiz();
            //-------------------------------------------
          })
          .catch(e => {
            console.log(e);
          });
      })
      .catch(e => {
        console.log(e);
      });
    await this.retrievePre();
    this.closeModalCreate()
    this.closeModal();

  }
  //Modal Agregar
  closeModalCreate() {
    this.setState({
      visiblecreate: false
    });
  }
  openModalCreate() {
    this.setState({
      visiblecreate: true
    });
  }

  closeModalDelete() {
    this.setState({
      visibledelete: false,
      deleteid: "",
    });
  }
  openModalDelete(id) {
    this.setState({
      visibledelete: true,
      deleteid: id,
    });
  }

  openModal(id) {
    this.setState({
      visible: true
    });
    this.getQuiz(id);
  }

  closeModal() {
    this.setState({
      visible: false
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
  //Modal Pregunta
  openModalShowPregunta() {
    this.setState({
      visibleshowpregunta: true
    });
  }
  closeModalShowPregunta() {
    this.setState({
      visibleshowpregunta: false
    });
  }
  //Modal Pregunta
  openModalShowRecurso(id) {
    const listaprerecurs = this.state.prerecurs.slice();
    const listarecursos = this.state.recursos.slice();
    const prerecurEncontrado = listaprerecurs.find(prerecur => prerecur.preguntaid == id);
    var recursoEncontrado = [];

    if (prerecurEncontrado) {
      recursoEncontrado = listarecursos.filter(recurso => recurso.id == prerecurEncontrado.recursoid);
    } else {
      recursoEncontrado = [];
    }
    this.setState({
      visibleshowRecurso: true,
      recursoEncontrado: recursoEncontrado
    });
  }
  closeModalShowRecurso() {
    this.setState({
      visibleshowRecurso: false
    });
  }
  //Modal Show
  async openModalShow(quiz) {
    const listaPreguntas = this.state.preguntas.slice();
    const listaQuizPres = this.state.quizpres.slice();
    var filtroPreguntas = [], preguntaEncontrada = [];
    const filtroQuizPres = listaQuizPres.filter(quizpre => quizpre.quizid == quiz.id);

    if (filtroQuizPres) {
      filtroQuizPres.forEach(quizpre => {
        preguntaEncontrada = listaPreguntas.find(pregunta => pregunta.id == quizpre.preguntaid);
        if (preguntaEncontrada) {
          filtroPreguntas.push(preguntaEncontrada);
        } else {
          preguntaEncontrada = [];
        }
      })
    } else {
      filtroPreguntas = [];
    }

    const respuesta = await this.retrieveFiltroPorPagina(filtroPreguntas);
    this.setState({
      listapaginacionPreguntas: respuesta[0],
      paginacionPreguntas: respuesta[1]
    });


    this.setState({
      currentQuiz: quiz,
      visibleshow: true,
      preguntasDelQuiz: filtroPreguntas
    });
  }

  closeModalShow() {
    this.setState({
      visibleshow: false
    });
  }


  openModalShowPreguntas() {
    this.setState({
      visibleshowpreguntas: true,
      visibleshow: false
    });
  }

  volverQuiz() {
    this.setState({
      visibleshowpreguntas: false,
      visibleshow: true
    });
  }

  closeModalShowPreguntas() {
    this.setState({
      visibleshowpreguntas: false
    });
  }
  //CREATE----------------------------

  onChangeTitulo(e) {
    this.setState({
      titulo: e.target.value
    });
  }
  onChangePrivado(e) {
    this.setState({
      privado: e.target.value
    });
  }

  onChangeDescripcion(e) {
    this.setState({
      descripcion: e.target.value
    });
  }

  onChangeActivo(e) {
    this.setState({
      activo: e.target.value
    });
  }

  onChangeTiempodisponible(e) {
    this.setState({
      tiempodisponible: e.target.value
    });
  }

  onChangeFechacreacion(e) {
    this.setState({
      fechacreacion: e.target.value
    });
  }

  onChangeUserid(e) {
    this.setState({
      usuarioid: e.target.value
    });
  }

  onChangeFechatermino(e) {
    this.setState({
      fechatermino: e.target.value
    });
  }
  //=====EDIT============

  onChangeTitulo2(e) {
    this.setState(prevState => ({
      currentQuiz: {
        ...prevState.currentQuiz,
        titulo: e.target.value
      }
    }));
  }
  onChangePrivado2(e) {
    var activo;
    if (this.state.currentQuiz.privado == true) {
      activo = false;
    } else {
      activo = true;
    }
    this.setState(prevState => ({
      currentQuiz: {
        ...prevState.currentQuiz,
        privado: activo
      }
    }));
  }
  onChangeActivo2(e) {
    var activo;
    if (this.state.currentQuiz.activo == true) {
      activo = false;
    } else {
      activo = true;
    }
    this.setState(prevState => ({
      currentQuiz: {
        ...prevState.currentQuiz,
        activo: activo
      }
    }));
  }

  onChangeDescripcion2(e) {
    this.setState(prevState => ({
      currentQuiz: {
        ...prevState.currentQuiz,
        descripcion: e.target.value
      }
    }));
  }


  onChangeTiempodisponible2(e) {
    this.setState(prevState => ({
      currentQuiz: {
        ...prevState.currentQuiz,
        tiempodisponible: e.target.value
      }
    }));
  }

  onChangeFechacreacion2(e) {
    this.setState(prevState => ({
      currentQuiz: {
        ...prevState.currentQuiz,
        fechacreacion: e.target.value
      }
    }));
  }

  onChangeUserid2(e) {
    this.setState(prevState => ({
      currentQuiz: {
        ...prevState.currentQuiz,
        usuarioid: e.target.value
      }
    }));
  }

  onChangeFechatermino2(e) {
    this.setState(prevState => ({
      currentQuiz: {
        ...prevState.currentQuiz,
        fechatermino: e.target.value
      }
    }));
  }
  //=============================


  //Modal Añadir Copia
  closeModalañadirCopia() {
    this.setState({
      currentQuizCopia: "",
      visibleañadircopia: false
    });
  }

  openModalañadirCopia(quiz) {
    this.setState({
      currentQuizCopia: quiz,
      visibleañadircopia: true
    });
  }

  newCopia() {
    this.setState({
      currentQuizCopia: "",
      submitted: false
    });
  }

  newQuiz() {
    this.setState({
      id: null,
      titulo: "",
      descripcion: "",
      activo: "",
      tiempodisponible: "",
      usuarioid: "",
      fechacreacion: "",
      fechatermino: "",
      privado: "",
      submitted: false
    });
  }
  //--------------
  async deleteQuizCur(id) {
    const quizcurs = this.state.quizcurs.slice();
    const quizcurDelete = quizcurs.find(quizcur => quizcur.quizid == id);
    await QuizCurDataService.delete(quizcurDelete.id)
      .then(response => {
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    await this.retrievePre();
    this.closeModalDelete();
  }

  async deleteQuiz(id) {
    await QuizDataService.delete(id)
      .then(response => {
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    await this.retrievePre();
    this.closeModalDelete();
  }

  async updateQuiz() {
    var data = {
      titulo: this.state.titulo,
      descripcion: this.state.descripcion,
      activo: this.state.activo,
      tiempodisponible: this.state.tiempodisponible,
      usuarioid: this.state.currentUser.id,
      fechacreacion: this.state.fechacreacion,
      fechatermino: this.state.fechatermino,
      privado: this.state.privado
    };
    // console.log(this.state.currentQuiz)
    // console.log(data)
    await QuizDataService.update(this.state.currentQuiz.id, this.state.currentQuiz)
      .then(response => {
      })
      .catch(e => {
        console.log(e);
      });
    this.closeModalEdit();
    await this.retrievePre();
  }


  async saveQuizCopia() {
    var preguntas = this.state.preguntas.slice();
    var quizpres = this.state.quizpres.slice();
    var recursos = this.state.recursos.slice();
    var prerecurs = this.state.prerecurs.slice();
    var preEncontrado = [], prerecurEncontrado = [], recursoEncontrado = [];
    // Lista de QuizPres
    var quizpresAñadidos = quizpres.filter(quizpre => quizpre.quizid == this.state.currentQuizCopia.id);

    var dataquiz = {
      titulo: this.state.currentQuizCopia.titulo,
      descripcion: this.state.currentQuizCopia.descripcion,
      activo: false,
      tiempodisponible: this.state.currentQuizCopia.tiempodisponible,
      usuarioid: this.state.currentUser.id,
      fechacreacion: this.state.currentQuizCopia.fechacreacion,
      fechatermino: this.state.currentQuizCopia.fechatermino,
      privado: true
    };
    //600cad5441aa2f2a262e5eb8 prueba calculo 2
    //60bb270d51575f763d92d5c6 prueba copia
    //============================
    // console.log(this.state.currentQuizCopia.id)
    // console.log(dataquiz)
    // if (quizpresAñadidos.length > 0) {
    //   quizpresAñadidos.forEach(quizpre => {
    //     preEncontrado = preguntas.find(pregunta => quizpre.preguntaid == pregunta.id);
    //     // console.log(preEncontrado);
    //     prerecurEncontrado = prerecurs.find(prerecur => preEncontrado.id == prerecur.preguntaid);
    //     if (prerecurEncontrado) {
    //       recursoEncontrado = recursos.find(recurso => recurso.id == prerecurEncontrado.recursoid);
    //       console.log(recursoEncontrado);
    //       console.log("hola");
    //     }
    //   })
    //   console.log("--------------")
    // }

    //=============================

    await QuizDataService.create(dataquiz)
      .then(quizdata => {
        if (quizpresAñadidos.length > 0) {
          //Recorre las QuizPres
          quizpresAñadidos.forEach(quizpre => {
            //Selecciona Pregunta
            preEncontrado = preguntas.find(pregunta => quizpre.preguntaid == pregunta.id);
            var datapregunta = {
              titulo: preEncontrado.titulo,
              tipo: preEncontrado.tipo,
              enunciado: preEncontrado.enunciado,
              subenunciado1: preEncontrado.subenunciado1,
              subenunciado2: preEncontrado.subenunciado2,
              subenunciado3: preEncontrado.subenunciado3,
              subenunciado4: preEncontrado.subenunciado4,
              template: preEncontrado.template,
              opcion1: preEncontrado.opcion1,
              opcion2: preEncontrado.opcion2,
              opcion3: preEncontrado.opcion3,
              opcion4: preEncontrado.opcion4,
              respuesta1: preEncontrado.respuesta1,
              respuesta2: preEncontrado.respuesta2,
              respuesta3: preEncontrado.respuesta3,
              respuesta4: preEncontrado.respuesta4,
              puntaje: preEncontrado.puntaje,
              random: preEncontrado.random,
              privado: true,
              tiempoRespuesta: preEncontrado.tiempoRespuesta,
              user: this.state.currentUser.id,
            };

            PreguntaDataService.create(datapregunta)
              .then(preguntadata => {
                var dataquizpre = {
                  quizid: quizdata.data.id,
                  preguntaid: preguntadata.data.id
                }
                QuizPreDataService.create(dataquizpre)
                  .then(quizpredata => {
                    console.log(quizpredata.data.id)
                  })
                  .catch(e => {
                    console.log(e);
                  });
                //Selecciona Prerecurso
                prerecurEncontrado = prerecurs.find(prerecur => preEncontrado.id == prerecur.preguntaid);
                if (prerecurEncontrado) {
                  recursoEncontrado = recursos.find(recurso => recurso.id == prerecurEncontrado.recursoid);
                  var idrecurso = recursoEncontrado.id.toString();
                  var idpregunta = preguntadata.data.id.toString();
                  var id = idrecurso + idpregunta + this.state.currentUser.id;
                  PreRecurDataService.create2(id)
                    .then(response => {
                      console.log(response.data);
                    })
                    .catch(e => {
                      console.log(e);
                    });
                }//Recurso?
              })//PREGUNTA DATA service
              .catch(e => {
                console.log(e);
              });
          }) // recorre preguntas
        };// IF
      })// QuizDataService
      .catch(e => {
        console.log(e);
      });
    await this.retrievePre();
    this.closeModalañadirCopia();
  }// funcion



  // updateQuizAñadidos() {
  //   QuizDataService.update(
  //     this.state.currentQuiz.id,
  //     this.state.currentQuiz
  //   )
  //     .then(response => {
  //       console.log(response.data);
  //       this.setState({
  //         message: "The quiz was updated successfully!"
  //       });
  //     })
  //     .catch(e => {
  //       console.log(e);
  //     });

  //     //Editar LISTA ---------------------------
  //     var contador=0;
  //     var lista=this.state.filtroquizsañadidas;
  //     lista.map((registro)=>{
  //       if(this.state.currentQuiz.id==registro.id){

  //         lista[contador].titulo = this.state.currentQuiz.titulo;
  //         lista[contador].descripcion = this.state.currentQuiz.descripcion;
  //         lista[contador].activo = this.state.currentQuiz.activo;
  //         lista[contador].tiempodisponible = this.state.currentQuiz.tiempodisponible;
  //         lista[contador].random = this.state.currentQuiz.random;
  //         lista[contador].fechacreacion = this.state.currentQuiz.fechacreacion;
  //         lista[contador].fechatermino = this.state.currentQuiz.fechatermino;


  //       }
  //       contador++;
  //     });
  //     console.log(this.state.filtroquizsañadidas);

  //     console.log(this.state.currentQuiz.id);

  //     this.setState({filtroquizsañadidas: lista});
  //     //-------------------------
  //     this.closeModalEdit();
  //   }

  render() {
    const {
      tags, filtroquizs, currentQuiz, currentUser, showModeratorBoard,
      showTeacherBoard, currentCurso, currentRamo, deleteid, quizsAñadidos,
      quizsPropios, quizsPublicos, quizcur, preguntasDelQuiz, currentPregunta, recursoEncontrado
    } = this.state;

    return (
      <div >
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
                <h2 class="center">Curso {currentCurso.codigo}</h2>
                <p>
                  Revisa el contenido en tu curso, resuelve los Quiz disponibles.
                </p>
              </div>

              <div className="list row">

                <div className="col-md-8">
                  <br></br>
                  <h4>Informacion del curso:</h4>
                  <ul className="list-group">
                    <li className="list-group-item">
                      Codigo del curso: {currentCurso.codigo}
                    </li>
                    <li className="list-group-item">
                      El curso se imparte en: {currentCurso.semestre} en el año {currentCurso.año}
                    </li>
                    <li className="list-group-item">
                      Descripcion del curso: {currentCurso.descripcion}
                    </li>
                    <li className="list-group-item">
                      Este curso pertenece al ramo: {currentRamo.nombre}
                    </li>
                    <li className="list-group-item">
                      El ramo consiste en: {currentRamo.descripcion}
                    </li>
                  </ul>
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
                        <Card.Body>Usa esta interfaz para revisar la descripción de tu curso, también podrás ver los Quiz disponibles en tu curso.</Card.Body>
                      </Accordion.Collapse>
                      <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                          ¿Que pasa si entro al Quiz?
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="1">
                        <Card.Body>Si entras al Quiz, la pagina te redireccionará a la vista para responder el Quiz, CUIDADO, si no estás listo para responder el Quiz, no respondas nada.</Card.Body>
                      </Accordion.Collapse>
                    </Accordion>
                  </Table>
                </div>
              </div>

              <br></br>
              <hr></hr>
              <br></br>

              <div className="list row">

                <div className="col-md-8">
                  <h4>Quiz disponibles</h4>

                  <ul className="list-group">
                    {quizsAñadidos.map((quizañadido, index) => (
                      <div>
                        <li className="list-group-item">
                          <Row>
                            <Col md="8" >
                              {quizañadido.titulo}
                            </Col>
                            <Col md="auto">
                              {' '}
                              <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Resolver</Tooltip>}>
                                <Button size="sm" variant="primary" href={"/respuesta/pregunta/list/" + quizañadido.id} key={index}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
                                    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                                    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
                                  </svg>
                                </Button>
                              </OverlayTrigger>
                              {showTeacherBoard || showModeratorBoard && (
                                <>
                                  {' '}
                                  <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Agregar Preguntas</Tooltip>}>
                                    <Button size="sm" variant="success" href={"/quiz/pregunta/list/" + quizañadido.id}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor" class="bi bi-clipboard-plus" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7z" />
                                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                                        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
                                      </svg>
                                    </Button>
                                  </OverlayTrigger>
                                  {' '}
                                  <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Editar</Tooltip>}>
                                    <Button size="sm" variant="info" onClick={() => (this.setActiveQuiz(quizañadido, index), this.openModalEdit())} key={index}>
                                      <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-pencil" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                      </svg>
                                    </Button>
                                  </OverlayTrigger>
                                  {' '}
                                  <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Quitar Quiz</Tooltip>}>
                                    <Button size="sm" variant="danger" onClick={() => this.openModalDelete(quizañadido.id)}>
                                      <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                      </svg>
                                    </Button>
                                  </OverlayTrigger>
                                </>
                              )}
                            </Col>
                          </Row>
                        </li>
                      </div>
                    ))}
                  </ul>
                </div>

                {(showTeacherBoard || showModeratorBoard) && (

                  <div className="col-md-4">
                    <h4>Quiz para Añadir</h4>
                    <Tab.Container defaultActiveKey="misrecursos">
                      <div>
                        <Nav fill variant="pills">
                          <Nav.Item>
                            <Nav.Link eventKey="misrecursos">Mis Quizs</Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link eventKey="listarecursos">Quizs Públicos</Nav.Link>
                          </Nav.Item>
                        </Nav>
                      </div>
                      <div class="tabdiv">
                        <Tab.Content justify variant="tabs" defaultActiveKey="misrecursos">
                          <Tab.Pane eventKey="misrecursos">
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


                            {quizsPropios.map((quizcur, index) => (
                              <li className="list-group-item" >
                                <Row>
                                  <Col md="8" >
                                    {quizcur.titulo}
                                  </Col>
                                  <Col md="auto">
                                    {' '}
                                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Agregar Quiz</Tooltip>}>
                                      <Button size="sm" variant="warning" onClick={() => this.openModal(quizcur.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                        </svg>
                                      </Button>
                                    </OverlayTrigger>
                                    {' '}
                                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Mostrar Quiz</Tooltip>}>
                                      <Button size="sm" variant="info" onClick={() => this.openModalShow(quizcur)} key={index}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                        </svg>
                                      </Button>
                                    </OverlayTrigger>
                                  </Col>
                                </Row>
                              </li>
                            ))}
                            {/* <div>
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
                            </div> */}
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

                            {quizsPublicos.map((quiz, index) => (
                              <li className="list-group-item" >
                                <Row>
                                  <Col md="8" >
                                    {quiz.titulo}
                                  </Col>
                                  <Col md="auto">
                                    {' '}
                                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Mostrar Quiz</Tooltip>}>
                                      <Button size="sm" variant="warning" onClick={() => this.openModalañadirCopia(quiz)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                        </svg>
                                      </Button>
                                    </OverlayTrigger>
                                    {' '}
                                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Mostrar Quiz</Tooltip>}>
                                      <Button size="sm" variant="info" onClick={() => this.openModalShow(quiz)} key={index}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                        </svg>
                                      </Button>
                                    </OverlayTrigger>
                                  </Col>
                                </Row>
                              </li>
                            ))}


                            {/* <div>
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
                            </div> */}
                          </Tab.Pane>
                        </Tab.Content>
                        <br />
                      </div>
                    </Tab.Container>
                  </div>
                )}
              </div>

              <Modal show={this.state.visible} width="1000" height="500" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                <Modal.Header>
                  <Modal.Title align="center">¿Deséa añadir este Quiz?</Modal.Title>
                </Modal.Header>

                <Modal.Footer>
                  <button className="btn btn-warning" onClick={() => this.closeModal()}>
                    Cerrar
                  </button>
                  <button className="btn btn-success" onClick={() => this.saveQuizCur(currentQuiz, this.props.match.params.id)}>
                    Agregar
                  </button>
                </Modal.Footer>
              </Modal>

              <Modal show={this.state.visibledelete} width="1000" height="500" effect="fadeInUp" onClickAway={() => this.closeModalDelete()}>
                <Modal.Header>
                  <Modal.Title align="center">¿Deséa eliminar este Quiz?</Modal.Title>
                </Modal.Header>

                <Modal.Footer>
                  <button className="btn btn-secondary" onClick={() => this.closeModalDelete()}>
                    Cerrar
                  </button>
                  <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Se quita del Quiz, pero se mantiene en su lista de preguntas.</Tooltip>}>
                    <Button className="btn btn-warning" onClick={() => this.deleteQuizCur(deleteid)}>
                      Desvincular
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Eliminar definitivamente el Quiz.</Tooltip>}>
                    <Button className="btn btn-danger" onClick={() => this.deleteQuiz(deleteid)}>
                      Borrar Quiz
                    </Button>
                  </OverlayTrigger>
                </Modal.Footer>
              </Modal>

              <Modal show={this.state.visibleañadircopia} width="1000" height="500" effect="fadeInUp" onClickAway={() => this.closeModalañadirCopia()}>
                <Modal.Header>
                  <Modal.Title align="center">Se agregará una copia de este Quiz a su lista y se vinculará a este Curso. ¿Deséa realizar esta operació?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                  <button className="btn btn-success" onClick={() => this.saveQuizCopia()}>
                    Si
                  </button>
                  <button className="btn btn-secondary" onClick={() => this.closeModalañadirCopia()}>
                    No
                  </button>
                </Modal.Footer>
              </Modal>

              <Modal show={this.state.visiblecreate} size="xl" >
                <Modal.Header closeButton onClick={() => this.closeModalCreate()} >
                  <Modal.Title>Agregar Quiz</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Row>
                      <Col md="12">
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
                    </Form.Row>
                    <Form.Row>
                      <Col md="2">
                        <label htmlFor="tiempodisponible">Tiempo de Respuesta</label>
                        <input
                          type="text"
                          className="form-control"
                          id="tiempodisponible"
                          required
                          value={this.state.tiempodisponible}
                          onChange={this.onChangeTiempodisponible}
                          name="tiempodisponible"
                        />
                      </Col>
                      <Col md="2">
                        <label htmlFor="fechacreacion">fechacreacion</label>
                        <FormControl
                          type="date"
                          className="form-control"
                          id="fechacreacion"
                          required
                          value={this.state.fechacreacion}
                          onChange={this.onChangeFechacreacion}
                          name="fechacreacion"
                        />
                      </Col>
                      <Col md="2">
                        <label htmlFor="fechatermino">Fecha de Termino</label>
                        <FormControl
                          type="date"
                          className="form-control"
                          id="fechatermino"
                          required
                          value={this.state.fechatermino}
                          onChange={this.onChangeFechatermino}
                          name="fechatermino"
                        />
                      </Col>

                      <Col md="1" align="center">
                        <label htmlFor="user">Activo</label>
                        <input defaultChecked={false} type="checkbox" class="make-switch" id="price_check"
                          name="pricing" data-on-color="primary" data-off-color="info" value="true" size="10"
                          onChange={this.onChangeActivo}></input>
                      </Col>
                      <Col md="1" align="center">
                        <label htmlFor="user">Privado</label>
                        <input defaultChecked={false} type="checkbox" class="make-switch" id="price_check"
                          name="pricing" data-on-color="primary" data-off-color="info" value="true" size="10"
                          onChange={this.onChangePrivado}></input>
                      </Col>
                      {/* usuarioid */}
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
                      <label htmlFor="descripcion">Descripcion</label>
                      <Form.Control as="textarea" rows={3}
                        className="form-control"
                        id="descripcion"
                        required
                        value={this.state.descripcion}
                        onChange={this.onChangeDescripcion}
                        name="descripcion"
                      >
                      </Form.Control>
                    </Form.Row>
                  </Form>

                </Modal.Body>

                <Modal.Footer>
                  <Button variant="secondary" onClick={() => this.closeModalCreate()} >
                    Cerrar
                  </Button>

                  <Button variant="primary" onClick={() => this.saveQuiz()} >
                    Agregar
                  </Button>
                </Modal.Footer>
              </Modal>

              <Modal show={this.state.visibleedit} size="xl" >
                <Modal.Header closeButton onClick={() => this.closeModalEdit()} >
                  <Modal.Title>Editar Quiz</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Row>
                      <Col md="12">
                        <label htmlFor="titulo">Titulo</label>
                        <input
                          type="text"
                          className="form-control"
                          id="titulo"
                          required
                          defaultValue={currentQuiz.titulo}
                          onChange={this.onChangeTitulo2}
                          name="titulo"
                        />
                      </Col>

                    </Form.Row>
                    <Form.Row>
                      <Col md="2">
                        <label htmlFor="tiempodisponible">Tiempo de Respuesta</label>
                        <input
                          type="text"
                          className="form-control"
                          id="tiempodisponible"
                          required
                          defaultValue={currentQuiz.tiempodisponible}
                          onChange={this.onChangeTiempodisponible2}
                          name="tiempodisponible"
                        />
                      </Col>
                      <Col md="3">
                        <label htmlFor="fechacreacion">fechacreacion</label>
                        <FormControl
                          type="date"
                          className="form-control"
                          id="fechacreacion"
                          required
                          defaultValue={currentQuiz.fechacreacion}
                          onChange={this.onChangeFechacreacion2}
                          name="fechacreacion"
                        />
                      </Col>
                      <Col md="3">
                        <label htmlFor="fechatermino">fechatermino</label>
                        <FormControl
                          type="date"
                          className="form-control"
                          id="fechatermino"
                          required
                          defaultValue={currentQuiz.fechatermino}
                          onChange={this.onChangeFechatermino2}
                          name="fechatermino"
                        />
                      </Col>

                      <Col md="2" align="center">
                        <label htmlFor="user">Activo</label>
                        <input type="checkbox" defaultChecked={currentQuiz.activo} onChange={this.onChangeActivo2} />
                        {/* <input defaultChecked={currentQuiz.activo} type="checkbox" class="make-switch" id="price_check"
                          name="pricing" data-on-color="primary" data-off-color="info" value="true" size="10"
                          onChange={this.onChangeActivo2}></input> */}
                      </Col>

                      <Col md="2" align="center">
                        <label htmlFor="user">Privado</label>
                        <input type="checkbox" defaultChecked={currentQuiz.privado} onChange={this.onChangePrivado2} />
                        {/* <input defaultChecked={currentQuiz.privado} type="checkbox" class="make-switch" id="price_check"
                          name="pricing" data-on-color="primary" data-off-color="info" value="true" size="10"
                          onChange={this.onChangePrivado2}></input> */}
                      </Col>
                    </Form.Row>

                    <Form.Row>
                      <label htmlFor="descripcion">Descripcion</label>
                      <Form.Control as="textarea" rows={3}
                        className="form-control"
                        id="descripcion"
                        required
                        defaultValue={currentQuiz.descripcion}
                        onChange={this.onChangeDescripcion2}
                        name="descripcion"
                      >
                      </Form.Control>
                    </Form.Row>
                  </Form>

                </Modal.Body>

                <Modal.Footer>
                  <Button variant="secondary" onClick={() => this.closeModalEdit()} >
                    Cerrar
                  </Button>

                  <Button variant="primary" onClick={() => this.updateQuiz()}>
                    Editar
                  </Button>
                </Modal.Footer>

              </Modal>
              <Modal show={this.state.visibleshow} size="xl" >
                <Modal.Header closeButton onClick={() => this.closeModalShow()} >
                  <Modal.Title>Quiz</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form >
                    <Form.Row>
                      <Col md="12">
                        <label htmlFor="titulo">Titulo</label>
                        <input disabled
                          type="text"
                          className="form-control"
                          id="titulo"
                          required
                          defaultValue={currentQuiz.titulo}
                          onChange={this.onChangeTitulo2}
                          name="titulo"
                        />
                      </Col>

                    </Form.Row>
                    <Form.Row>
                      <Col md="3">
                        <label htmlFor="tiempodisponible">Tiempo de Respuesta</label>
                        <input disabled
                          type="text"
                          className="form-control"
                          id="tiempodisponible"
                          required
                          defaultValue={currentQuiz.tiempodisponible}
                          onChange={this.onChangeTiempodisponible2}
                          name="tiempodisponible"
                        />
                      </Col>
                      <Col md="3">
                        <label htmlFor="fechacreacion">fechacreacion</label>
                        <FormControl disabled
                          type="date"
                          className="form-control"
                          id="fechacreacion"
                          required
                          defaultValue={currentQuiz.fechacreacion}
                          onChange={this.onChangeFechacreacion2}
                          name="fechacreacion"
                        />
                      </Col>
                      <Col md="3">
                        <label htmlFor="fechatermino">fechatermino</label>
                        <FormControl disabled
                          type="date"
                          className="form-control"
                          id="fechatermino"
                          required
                          defaultValue={currentQuiz.fechatermino}
                          onChange={this.onChangeFechatermino2}
                          name="fechatermino"
                        />
                      </Col>

                      <Col md="2" align="center">
                        <label htmlFor="user">Activo</label>
                        <input disabled defaultChecked={currentQuiz.activo} type="checkbox" class="make-switch" id="price_check"
                          name="pricing" data-on-color="primary" data-off-color="info" value="true" size="10"
                          onChange={this.onChangeActivo2}></input>
                      </Col>


                    </Form.Row>

                    <Form.Row>
                      <label htmlFor="descripcion">Descripcion</label>
                      <Form.Control as="textarea" rows={3} disabled
                        className="form-control"
                        id="descripcion"
                        required
                        defaultValue={currentQuiz.descripcion}
                        onChange={this.onChangeDescripcion2}
                        name="descripcion"
                      >
                      </Form.Control>
                    </Form.Row>
                  </Form>

                </Modal.Body>

                <Modal.Footer>
                  <Button variant="secondary" onClick={() => this.closeModalShow()} >
                    Cerrar
                  </Button>
                  <Button className="mb-2" onClick={() => this.openModalShowPreguntas()} > Ver Preguntas </Button>

                </Modal.Footer>

              </Modal>
              <Modal show={this.state.visibleshowpreguntas} size="xl" >
                <Modal.Header closeButton onClick={() => this.closeModalShowPreguntas()} >
                  <Modal.Title>Preguntas del Quiz</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form >
                    {preguntasDelQuiz.length >= 1 ? (
                      <>
                        {preguntasDelQuiz.map((pregunta, index) => (
                          <li className="list-group-item" >
                            <Row>
                              <Col md="8" >
                                {pregunta.titulo}
                              </Col>
                              <Col md="auto">
                                {' '}
                                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Ver Pregunta</Tooltip>}>
                                  <Button size="sm" variant="info" onClick={() => (this.setActivePregunta(pregunta, index), this.openModalShowPregunta())} key={index}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                    </svg>
                                  </Button>
                                </OverlayTrigger>
                                {' '}
                                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Ver Recurso de la Pregunta</Tooltip>}>
                                  <Button size="sm" variant="success" onClick={() => this.openModalShowRecurso(pregunta.id)} key={index}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-image" viewBox="0 0 16 16">
                                      <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                      <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
                                    </svg>
                                  </Button>
                                </OverlayTrigger>
                              </Col>
                            </Row>
                          </li>
                        ))}
                      </>
                    ) : (
                      <div>
                        <h3> No hay preguntas asignadas a este Quiz.</h3>
                      </div>

                    )}


                  </Form>

                </Modal.Body>

                <Modal.Footer>
                  <Button variant="secondary" onClick={() => this.closeModalShowPreguntas()} >
                    Cerrar
                  </Button>
                  <Button className="mb-2" onClick={() => this.volverQuiz()} > Volver al Quiz </Button>
                </Modal.Footer>

              </Modal>

              <Modal show={this.state.visibleshowRecurso} size="xl" >
                <Modal.Header closeButton onClick={() => this.closeModalShowRecurso()} >
                  <Modal.Title>Recurso de la Pregunta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form >
                    {recursoEncontrado.length > 0 ? (
                      <>
                        {recursoEncontrado.map((recurso) => (
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
                            </Card>
                          </>
                        ))}
                      </>
                    ) : (
                      <div>
                        <h3> No hay un recurso asignado a esta Pregunta.</h3>
                      </div>
                    )}
                  </Form>

                </Modal.Body>

                <Modal.Footer>
                  <Button variant="secondary" onClick={() => this.closeModalShowRecurso()} >
                    Cerrar
                  </Button>
                </Modal.Footer>
              </Modal>

              <Modal show={this.state.visibleshowpregunta} size="xl" >
                <Modal.Header closeButton onClick={() => this.closeModalShowPregunta()} >
                  <Modal.Title>Pregunta</Modal.Title>
                </Modal.Header>
                {currentPregunta ? (
                  <Modal.Body>
                    <Form >
                      <Form.Row>
                        <Col md="8">
                          <label htmlFor="titulo">Titulo</label>
                          <input disabled
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
                            disabled>
                            <option disabled>...</option>
                            <option>Verdadero o Falso</option>
                            <option>Alternativas</option>
                            <option>Opcion Multiple</option>
                            <option>Arrastrable</option>
                          </Form.Control>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Col md="6">
                          <label htmlFor="tiempoRespuesta">Tiempo de Respuesta</label>
                          <input disabled
                            type="text"
                            className="form-control"
                            id="tiempoRespuesta"
                            required
                            defaultValue={currentPregunta.tiempoRespuesta}
                            onChange={this.onChangeTiempoRespuesta2}
                            name="tiempoRespuesta"
                          />
                        </Col>
                        <Col md="5">
                          <label htmlFor="puntaje">Puntaje</label>
                          <input disabled
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
                          <input disabled defaultChecked={currentPregunta.random} type="checkbox" class="make-switch" id="price_check"
                            name="pricing" data-on-color="primary" data-off-color="info" value="true" size="10"
                            onChange={this.onChangeRandom}></input>
                        </Col>
                      </Form.Row>

                      <Form.Row>
                        <label htmlFor="enunciado">Enunciado</label>
                        <Form.Control as="textarea" rows={3} disabled
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
                  <Button variant="secondary" onClick={() => this.closeModalShowPregunta()} >
                    Cerrar
                  </Button>
                </Modal.Footer>
              </Modal>

              <br />
              <br />
              <div>
                <Button onClick={() => this.openModalCreate()} > Agregar Quiz </Button>
              </div>
              <br></br>
            </div>
          )}
        </header>
      </div >
    );
  }
}