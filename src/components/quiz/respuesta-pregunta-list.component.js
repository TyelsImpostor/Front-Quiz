import React, { Component } from "react";
import QuizPreDataService from "../../services/quizpre.service";
import PreguntaDataService from "../../services/pregunta.service";
import RespuestaDataService from "../../services/respuesta.service";
import PreRecurDataService from "../../services/prerecur.service";
import RecursoDataService from "../../services/recurso.service";
import UsuQuizDataService from "../../services/usuquiz.service";
import RetroalimentacionDataService from "../../services/retroalimentacion.service";
import QuizDataService from "../../services/quiz.service";
import { Link } from "react-router-dom";

import {
  Accordion, Button, Form, Modal, Card, Table, OverlayTrigger, Tooltip, Col, Row
} from 'react-bootstrap';

import AuthService from "../../services/auth.service";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
//Video
import ResponsivePlayer from '../example/ResponsivePlayer';

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

export default class PreguntasList extends Component {
  constructor(props) {
    super(props);
    this.setActivePregunta = this.setActivePregunta.bind(this);
    this.setActiveRetro = this.setActiveRetro.bind(this);
    this.onChangeRespuesta1 = this.onChangeRespuesta1.bind(this);
    this.onChangeRespuesta2 = this.onChangeRespuesta2.bind(this);
    this.onChangeRespuesta3 = this.onChangeRespuesta3.bind(this);
    this.onChangeRespuesta4 = this.onChangeRespuesta4.bind(this);
    this.onChangePreguntaid = this.onChangePreguntaid.bind(this);
    this.onChangeQuizid = this.onChangeQuizid.bind(this);
    this.onChangeUserid = this.onChangeUserid.bind(this);
    this.saveRespuesta = this.saveRespuesta.bind(this);
    this.saveRespuesta2 = this.saveRespuesta2.bind(this);
    this.saveUsuQuiz = this.saveUsuQuiz.bind(this);
    //Video
    this.handleWatchComplete = this.handleWatchComplete.bind(this);
    //Retrieve
    this.retrievePreguntas = this.retrievePreguntas.bind(this);

    this.state = {
      pregunta: null,
      retroalimentacion: null,
      respuesta: null,
      id: null,
      respuesta1: "0",
      respuesta2: "0",
      respuesta3: "0",
      respuesta4: "0",
      tiemporespuesta: "",
      puntaje: "0",
      usuarioid: "",
      preguntaid: "",
      quizid: "",
      puntajetotal: "0",
      resultado: "0",
      quizs: [],
      preguntas: [],
      retroalimentacions: [],
      respuestas: [],
      respuestausers: [],
      prerecurs: [],
      recursos: [],
      recursoimages: [],
      recursodocumentos: [],
      recursolinks: [],
      currentIndex: -1,
      visible: false,
      visible2: false,
      seconds: 0,
      opcions: [],
      selected1: [],
      selected2: [],
      selected3: [],
      selected4: [],
      retro: false,
      block: false,
      progressquiz: false,
      progresspregunta: false,
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
      //Video
      stop: true,
      mininicial: '',
      type: 0,
      tiempoquiz: 0,
      minutes: 0,
      visibleseguro: false
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
    await this.retrievePreguntas();
    // await this.cargaQuiz();

    await QuizDataService.get(this.props.match.params.id)
      .then(response => {
        var minutes = (parseInt(response.data.tiempodisponible, 10)) / 60;
        this.setState({
          currentQuiz: response.data,
          minutes: minutes
        });
        //console.log(response.data);
      })
      .catch(e => {
        //console.log(e);
      });

    this.myInterval = setInterval(() => {
      const { tiempoquiz, minutes } = this.state

      if (tiempoquiz > 0) {
        this.setState(({ tiempoquiz }) => ({
          tiempoquiz: tiempoquiz - 1
        }))
      }
      if (tiempoquiz === 0) {
        if (minutes === 0) {
          clearInterval(this.myInterval)
        } else {
          this.setState(({ minutes }) => ({
            minutes: minutes - 1,
            tiempoquiz: 59
          }))
        }
      }
    }, 1000)
  }

  openModal() {
    this.setState({
      opcions: [],
      selected1: [],
      selected2: [],
      selected3: [],
      selected4: [],
      visible: true,
      id: null,
      respuesta1: "0",
      respuesta2: "0",
      respuesta3: "0",
      respuesta4: "0",
      tiemporespuesta: "",
      puntaje: "0",
      usuarioid: "",
      preguntaid: "",
      quizid: "",
      visiblevideo: false,
      stop: true
    });
    this.myInterval = setInterval(() => {
      const { seconds } = this.state

      if (seconds > 0) {
        this.setState(({ seconds }) => ({
          seconds: seconds - 1
        }))
      }
      if (seconds === 0) {
        clearInterval(this.myInterval)
      }
    }, 1000)
  }

  closeModal() {
    this.openModalSeguro();
  }

  openModalSeguro() {
    this.setState({
      visibleseguro: true
    });
  }

  closeModalSeguro() {
    this.setState({
      visibleseguro: false,
      opcions: [],
      selected1: [],
      selected2: [],
      selected3: [],
      selected4: [],
      visible: false,
      id: null,
      respuesta1: "0",
      respuesta2: "0",
      respuesta3: "0",
      respuesta4: "0",
      tiemporespuesta: "",
      puntaje: "0",
      usuarioid: "",
      preguntaid: "",
      quizid: "",
      progresspregunta: false,
      retro: false,
      seconds: 0,
      stop: true
    });
  }

  openModalResultado() {
    this.setState({
      visible2: true
    });
  }

  closeModalResultado() {
    this.setState({
      visible2: false
    });
  }

  closeModalSeguro2() {
    this.setState({
      visibleseguro: false,
    });
  }

  //=================================
  //=================================

  async retrievePreguntas() {
    var quizs = [], preguntas = [], retroalimentacions = [], recursos = [], prerecurs = [], recursoimages = [], recursodocumentos = [], recursolinks = [];

    await RespuestaDataService.getAll()
      .then(response => {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].usuarioid == this.state.currentUser.id) {
            if (response.data[i].quizid == this.props.match.params.id) {
              this.setState({ block: true });
            }
          }
        }
      })
      .catch(e => {
        console.log(e);
      });

    await QuizPreDataService.getAll()
      .then(response => {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].quizid == this.props.match.params.id) {
            quizs.push(response.data[i]);
          }
        }
        this.setState({ quizs: quizs });
        console.log(quizs);

        for (var i = 0; i < quizs.length; i++) {
          PreguntaDataService.get(quizs[i].preguntaid)
            .then(response => {
              preguntas.push(response.data);
            })
            .catch(e => {
              console.log(e);
            });
        }
        this.setState({ preguntas: preguntas });
        console.log(preguntas);

      })
      .catch(e => {
        console.log(e);
      });

    await RetroalimentacionDataService.getAll()
      .then(response => {
        for (var j = 0; j < response.data.length; j++) {
          retroalimentacions.push(response.data[j]);
        }
      })
      .catch(e => {
        console.log(e);
      });
    this.setState({ retroalimentacions: retroalimentacions });
    console.log(retroalimentacions);

    await RecursoDataService.getAll()
      .then(response => {
        for (var i = 0; i < response.data.length; i++) {
          recursos.push(response.data[i]);
        }
        this.setState({ recursos: recursos });
      })
      .catch(e => {
        console.log(e);
      });

    await PreRecurDataService.getAll()
      .then(response => {
        for (var i = 0; i < response.data.length; i++) {
          prerecurs.push(response.data[i]);
        }
        this.setState({ prerecurs: prerecurs });

        for (var i = 0; i < prerecurs.length; i++) {
          for (var j = 0; j < recursos.length; j++) {
            if (prerecurs[i].recursoid == recursos[j].id) {
              if (recursos[j].type == "imagen") {
                recursoimages.push(prerecurs[i]);
              }
              if (recursos[j].type == "documento") {
                recursodocumentos.push(prerecurs[i]);
              }
              if (recursos[j].type == "link") {
                var id, link, inicialmin, finalmin, hora, min, seg, final, hora2, min2, seg2, final2;
                id = prerecurs[i].preguntaid;
                link = recursos[j].link;
                final = recursos[j].inicialmin;
                final2 = recursos[j].finalmin;

                hora = (final.substring(0, 2)) * 3600;
                min = (final.substring(3, 5)) * 60;
                seg = (final.substring(6, 8)) * 1;

                hora2 = (final2.substring(0, 2)) * 3600;
                min2 = (final2.substring(3, 5)) * 60;
                seg2 = (final2.substring(6, 8)) * 1;
                inicialmin = hora + min + seg;
                finalmin = Number.parseInt(hora2 + min2 + seg2);
                recursolinks.push({ link: link, id: id, inicialmin: inicialmin, finalmin: finalmin });
              }
            }
          }
        }
        this.setState({ recursoimages: recursoimages, recursodocumentos: recursodocumentos, recursolinks: recursolinks, progressquiz: true });

      })
      .catch(e => {
        console.log(e);
      });
  }

  setActivePregunta(pregunta, index, type) {
    var opcions = [];
    opcions.push(pregunta.opcion1)
    opcions.push(pregunta.opcion2)
    opcions.push(pregunta.opcion3)
    opcions.push(pregunta.opcion4)
    var segundos = parseInt(pregunta.tiempoRespuesta, 10);
    if (type == 'link') {
      this.openModalVideo();
    } else {
      this.openModal();
    }
    this.setState({
      pregunta: pregunta,
      currentIndex: index,
      opcions: opcions,
      seconds: segundos
    });
  }

  onChangeRespuesta1(e) {
    this.setState({
      respuesta1: e.target.value
    });
  }

  onChangeRespuesta2(e) {
    this.setState({
      respuesta2: e.target.value
    });
  }

  onChangeRespuesta3(e) {
    this.setState({
      respuesta3: e.target.value
    });
  }

  onChangeRespuesta4(e) {
    this.setState({
      respuesta4: e.target.value
    });
  }

  onChangePreguntaid(e) {
    this.setState({
      preguntaid: e.target.value
    });
  }

  onChangeQuizid(e) {
    this.setState({
      quizid: e.target.value
    });
  }

  onChangeUserid(e) {
    this.setState({
      usuarioid: e.target.value
    });
  }

  saveRespuesta() {
    if (this.state.respuesta1 == this.state.pregunta.respuesta1) {
      if (this.state.respuesta2 == this.state.pregunta.respuesta2) {
        if (this.state.respuesta3 == this.state.pregunta.respuesta3) {
          if (this.state.respuesta4 == this.state.pregunta.respuesta4) {
            var data = {
              respuesta1: this.state.respuesta1,
              respuesta2: this.state.respuesta2,
              respuesta3: this.state.respuesta3,
              respuesta4: this.state.respuesta4,
              tiemporespuesta: this.state.seconds,
              puntaje: this.state.pregunta.puntaje,
              usuarioid: this.state.currentUser.id,
              preguntaid: this.state.pregunta.id,
              quizid: this.props.match.params.id
            };
          } else {
            var data = {
              respuesta1: this.state.respuesta1,
              respuesta2: this.state.respuesta2,
              respuesta3: this.state.respuesta3,
              respuesta4: this.state.respuesta4,
              tiemporespuesta: this.state.seconds,
              puntaje: this.state.puntaje,
              usuarioid: this.state.currentUser.id,
              preguntaid: this.state.pregunta.id,
              quizid: this.props.match.params.id
            };
          }
        } else {
          var data = {
            respuesta1: this.state.respuesta1,
            respuesta2: this.state.respuesta2,
            respuesta3: this.state.respuesta3,
            respuesta4: this.state.respuesta4,
            tiemporespuesta: this.state.seconds,
            puntaje: this.state.puntaje,
            usuarioid: this.state.currentUser.id,
            preguntaid: this.state.pregunta.id,
            quizid: this.props.match.params.id
          };
        }
      } else {
        var data = {
          respuesta1: this.state.respuesta1,
          respuesta2: this.state.respuesta2,
          respuesta3: this.state.respuesta3,
          respuesta4: this.state.respuesta4,
          tiemporespuesta: this.state.seconds,
          puntaje: this.state.puntaje,
          usuarioid: this.state.currentUser.id,
          preguntaid: this.state.pregunta.id,
          quizid: this.props.match.params.id
        };
      }
    } else {
      var data = {
        respuesta1: this.state.respuesta1,
        respuesta2: this.state.respuesta2,
        respuesta3: this.state.respuesta3,
        respuesta4: this.state.respuesta4,
        tiemporespuesta: this.state.seconds,
        puntaje: this.state.puntaje,
        usuarioid: this.state.currentUser.id,
        preguntaid: this.state.pregunta.id,
        quizid: this.props.match.params.id
      };
    }

    if (this.state.respuesta1 == this.state.pregunta.respuesta1) {
      if (this.state.respuesta2 == this.state.pregunta.respuesta2) {
        if (this.state.respuesta3 == this.state.pregunta.respuesta3) {
          if (this.state.respuesta4 == this.state.pregunta.respuesta4) {
            RespuestaDataService.create(data)
              .then(response => {
                this.setState({
                  id: response.data.id,
                  tiemporespuesta: response.data.tiemporespuesta,
                  respuesta1: response.data.respuesta1,
                  respuesta2: response.data.respuesta2,
                  respuesta3: response.data.respuesta3,
                  respuesta4: response.data.respuesta4,
                  puntaje: response.data.pregunta.puntaje,
                  usuarioid: this.state.currentUser.id,
                  preguntaid: this.state.pregunta.id,
                  quizid: this.props.match.params.id
                });
                console.log(response.data);
              })
              .catch(e => {
                console.log(e);
              });
          } else {
            RespuestaDataService.create(data)
              .then(response => {
                this.setState({
                  id: response.data.id,
                  tiemporespuesta: response.data.tiemporespuesta,
                  respuesta1: response.data.respuesta1,
                  respuesta2: response.data.respuesta2,
                  respuesta3: response.data.respuesta3,
                  respuesta4: response.data.respuesta4,
                  puntaje: response.data.puntaje,
                  usuarioid: this.state.currentUser.id,
                  preguntaid: this.state.pregunta.id,
                  quizid: this.props.match.params.id
                });
                console.log(response.data);
              })
              .catch(e => {
                console.log(e);
              });
          }
        } else {
          RespuestaDataService.create(data)
            .then(response => {
              this.setState({
                id: response.data.id,
                tiemporespuesta: response.data.tiemporespuesta,
                respuesta1: response.data.respuesta1,
                respuesta2: response.data.respuesta2,
                respuesta3: response.data.respuesta3,
                respuesta4: response.data.respuesta4,
                puntaje: response.data.puntaje,
                usuarioid: this.state.currentUser.id,
                preguntaid: this.state.pregunta.id,
                quizid: this.props.match.params.id
              });
              console.log(response.data);
            })
            .catch(e => {
              console.log(e);
            });
        }
      } else {
        RespuestaDataService.create(data)
          .then(response => {
            this.setState({
              id: response.data.id,
              tiemporespuesta: response.data.tiemporespuesta,
              respuesta1: response.data.respuesta1,
              respuesta2: response.data.respuesta2,
              respuesta3: response.data.respuesta3,
              respuesta4: response.data.respuesta4,
              puntaje: response.data.puntaje,
              usuarioid: this.state.currentUser.id,
              preguntaid: this.state.pregunta.id,
              quizid: this.props.match.params.id
            });
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
      }
    } else {
      RespuestaDataService.create(data)
        .then(response => {
          this.setState({
            id: response.data.id,
            tiemporespuesta: response.data.tiemporespuesta,
            respuesta1: response.data.respuesta1,
            respuesta2: response.data.respuesta2,
            respuesta3: response.data.respuesta3,
            respuesta4: response.data.respuesta4,
            puntaje: response.data.puntaje,
            usuarioid: this.state.currentUser.id,
            preguntaid: this.state.pregunta.id,
            quizid: this.props.match.params.id
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
    this.closeModal();
  }

  saveUsuQuiz() {
    var puntajeTotal = 0;
    var respuestausers = [];
    RespuestaDataService.getAll()
      .then(response => {
        console.log(response.data);
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].quizid == this.props.match.params.id) {
            if (response.data[i].usuarioid == this.state.currentUser.id) {
              puntajeTotal = parseInt(puntajeTotal, 10) + parseInt(response.data[i].puntaje, 10)
              respuestausers.push(response.data[i])
            }
          }
        }
        this.setState({ respuestausers: respuestausers, resultado: puntajeTotal });

        var data = {
          usuarioid: this.state.currentUser.id,
          quizid: this.props.match.params.id,
          puntajetotal: puntajeTotal,
        };

        UsuQuizDataService.create(data)
          .then(response => {
            this.setState({
              id: response.data.id,
              usuarioid: this.state.currentUser.id,
              quizid: this.props.match.params.id,
              puntajetotal: puntajeTotal
            });
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
      })
      .catch(e => {
        console.log(e);
      });

    this.openModalResultado();
  }

  handleClick() {
    this.setState({
      progresspregunta: true
    });
  }

  setActiveRetro(retroalimentacion) {
    this.setState({
      retroalimentacion: retroalimentacion,
      retro: true
    });
  }

  handleClickRetro() {
    this.setState({
      retro: false
    });
  }

  setActiveRespuesta(respuesta) {
    PreguntaDataService.get(respuesta)
      .then(response => {
        this.setState({
          respuesta: response.data
        });
      })
      .catch(e => {
        console.log(e);
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

  saveRespuesta2() {
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

    if (respuesta1 == this.state.pregunta.respuesta1) {
      if (respuesta2 == this.state.pregunta.respuesta2) {
        if (respuesta3 == this.state.pregunta.respuesta3) {
          if (respuesta4 == this.state.pregunta.respuesta4) {
            var data = {
              respuesta1: respuesta1,
              respuesta2: respuesta2,
              respuesta3: respuesta3,
              respuesta4: respuesta4,
              tiemporespuesta: this.state.seconds,
              puntaje: this.state.pregunta.puntaje,
              usuarioid: this.state.currentUser.id,
              preguntaid: this.state.pregunta.id,
              quizid: this.props.match.params.id
            };
          } else {
            var data = {
              respuesta1: respuesta1,
              respuesta2: respuesta2,
              respuesta3: respuesta3,
              respuesta4: respuesta4,
              tiemporespuesta: this.state.seconds,
              puntaje: this.state.puntaje,
              usuarioid: this.state.currentUser.id,
              preguntaid: this.state.pregunta.id,
              quizid: this.props.match.params.id
            };
          }
        } else {
          var data = {
            respuesta1: respuesta1,
            respuesta2: respuesta2,
            respuesta3: respuesta3,
            respuesta4: respuesta4,
            tiemporespuesta: this.state.seconds,
            puntaje: this.state.puntaje,
            usuarioid: this.state.currentUser.id,
            preguntaid: this.state.pregunta.id,
            quizid: this.props.match.params.id
          };
        }
      } else {
        var data = {
          respuesta1: respuesta1,
          respuesta2: respuesta2,
          respuesta3: respuesta3,
          respuesta4: respuesta4,
          tiemporespuesta: this.state.seconds,
          puntaje: this.state.puntaje,
          usuarioid: this.state.currentUser.id,
          preguntaid: this.state.pregunta.id,
          quizid: this.props.match.params.id
        };
      }
    } else {
      var data = {
        respuesta1: respuesta1,
        respuesta2: respuesta2,
        respuesta3: respuesta3,
        respuesta4: respuesta4,
        tiemporespuesta: this.state.seconds,
        puntaje: this.state.puntaje,
        usuarioid: this.state.currentUser.id,
        preguntaid: this.state.pregunta.id,
        quizid: this.props.match.params.id
      };
    }

    if (respuesta1 == this.state.pregunta.respuesta1) {
      if (respuesta2 == this.state.pregunta.respuesta2) {
        if (respuesta3 == this.state.pregunta.respuesta3) {
          if (respuesta4 == this.state.pregunta.respuesta4) {
            RespuestaDataService.create(data)
              .then(response => {
                this.setState({
                  id: response.data.id,
                  tiemporespuesta: response.data.tiemporespuesta,
                  respuesta1: response.data.respuesta1,
                  respuesta2: response.data.respuesta2,
                  respuesta3: response.data.respuesta3,
                  respuesta4: response.data.respuesta4,
                  puntaje: response.data.pregunta.puntaje,
                  usuarioid: this.state.currentUser.id,
                  preguntaid: this.state.pregunta.id,
                  quizid: this.props.match.params.id
                });
                console.log(response.data);
              })
              .catch(e => {
                console.log(e);
              });
          } else {
            RespuestaDataService.create(data)
              .then(response => {
                this.setState({
                  id: response.data.id,
                  tiemporespuesta: response.data.tiemporespuesta,
                  respuesta1: response.data.respuesta1,
                  respuesta2: response.data.respuesta2,
                  respuesta3: response.data.respuesta3,
                  respuesta4: response.data.respuesta4,
                  puntaje: response.data.puntaje,
                  usuarioid: this.state.currentUser.id,
                  preguntaid: this.state.pregunta.id,
                  quizid: this.props.match.params.id
                });
                console.log(response.data);
              })
              .catch(e => {
                console.log(e);
              });
          }
        } else {
          RespuestaDataService.create(data)
            .then(response => {
              this.setState({
                id: response.data.id,
                tiemporespuesta: response.data.tiemporespuesta,
                respuesta1: response.data.respuesta1,
                respuesta2: response.data.respuesta2,
                respuesta3: response.data.respuesta3,
                respuesta4: response.data.respuesta4,
                puntaje: response.data.puntaje,
                usuarioid: this.state.currentUser.id,
                preguntaid: this.state.pregunta.id,
                quizid: this.props.match.params.id
              });
              console.log(response.data);
            })
            .catch(e => {
              console.log(e);
            });
        }
      } else {
        RespuestaDataService.create(data)
          .then(response => {
            this.setState({
              id: response.data.id,
              tiemporespuesta: response.data.tiemporespuesta,
              respuesta1: response.data.respuesta1,
              respuesta2: response.data.respuesta2,
              respuesta3: response.data.respuesta3,
              respuesta4: response.data.respuesta4,
              puntaje: response.data.puntaje,
              usuarioid: this.state.currentUser.id,
              preguntaid: this.state.pregunta.id,
              quizid: this.props.match.params.id
            });
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
      }
    } else {
      RespuestaDataService.create(data)
        .then(response => {
          this.setState({
            id: response.data.id,
            tiemporespuesta: response.data.tiemporespuesta,
            respuesta1: response.data.respuesta1,
            respuesta2: response.data.respuesta2,
            respuesta3: response.data.respuesta3,
            respuesta4: response.data.respuesta4,
            puntaje: response.data.puntaje,
            usuarioid: this.state.currentUser.id,
            preguntaid: this.state.pregunta.id,
            quizid: this.props.match.params.id
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
    this.closeModal();
  }
  //Video
  handleWatchComplete(e) {
    //console.log(e);
    if (((e.playedSeconds) > (this.state.finalmin))) {
      this.playStop();
    }
  }
  pauseStop() {
    this.setState({
      stop: true
    });
  }
  playStop() {
    this.setState({
      stop: false
    });
  }
  openModalVideo() {
    this.setState({
      visiblevideo: true,
      stop: true
    });
  }

  closeModalVideo() {
    this.setState({
      visiblevideo: false,
      stop: true
    });
  }

  volverVideo() {
    this.closeModal();

    this.setState({
      visiblevideo: true
    });
  }
  render() {
    const { block, progressquiz, progresspregunta, preguntas, currentIndex,
      pregunta, recursoimages, recursodocumentos, recursolinks, retroalimentacions,
      retroalimentacion, retro, respuestausers, respuesta, showTeacherBoard,
      showModeratorBoard, showUserBoard, selected1, selected2, selected3, selected4,
      opcions, seconds, tiempoquiz, minutes } = this.state;

    return (
      <div>
        {progressquiz == false ? (
          <div align="center">
            <img src="../../../progress-quiz.gif" width="400" height="350" />
            <div align="center">
              <h3 class="center">Cargando Test</h3>
            </div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
          </div>
        ) : (
          <div>
            {showUserBoard && (
              <div className="list row">
                <div className="col-md-8">
                </div>
                <div className="col-md-4">
                  <br></br>
                  Tiempo Limite: {minutes} minutos : {tiempoquiz < 10 ? `0${tiempoquiz}` : tiempoquiz} segundos
                </div>
              </div>
            )}
            <div className="list row">
              <div className="col-md-6">
                <h1 id='title'>Lista de Preguntas</h1>
                <ul className="list-group">

                  {preguntas &&
                    preguntas.map((pregunta, index) => (
                      <>
                        {recursolinks.map((recursolink) => (
                          <>
                            {recursolink.id == pregunta.id && (
                              <>
                                {currentIndex + 1 == index ? (
                                  <>
                                    <li className={"list-group-item " + (index === currentIndex ? "active" : "")} onClick={() => this.setActivePregunta(pregunta, index, 'link')} key={index}>
                                      <Row>
                                        <Col md="8" >
                                          <div className="list row">
                                            <div className="col-md-9">
                                              <div>
                                                {pregunta.titulo}
                                              </div>

                                              <div>
                                                {pregunta.tipo}
                                              </div>

                                              <div>
                                                {pregunta.puntaje}
                                              </div>
                                            </div>
                                            <div className="col-md-3">
                                              <br></br>
                                              <h6><small>Disponible</small></h6>
                                            </div>
                                          </div>
                                        </Col>
                                      </Row>
                                    </li>
                                    <div hidden>
                                      {this.state.type = 1}
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <li className={"list-group-item " + (index === currentIndex ? "active" : "")} key={index} disabled>
                                      <Row>
                                        <Col md="8" >
                                          <div className="list row">
                                            <div className="col-md-9">
                                              <div>
                                                {pregunta.titulo}
                                              </div>

                                              <div>
                                                {pregunta.tipo}
                                              </div>

                                              <div>
                                                {pregunta.puntaje}
                                              </div>
                                            </div>
                                            <div className="col-md-3">
                                              <br></br>
                                              <h6><small>No Disponible</small></h6>
                                            </div>
                                          </div>
                                        </Col>
                                      </Row>
                                    </li>
                                    <div hidden>
                                      {this.state.type = 1}
                                    </div>
                                  </>
                                )}
                              </>
                            )}
                          </>
                        ))}

                        {currentIndex + 1 == index ? (
                          <>
                            {(this.state.type == 0) && (
                              <>
                                <li className={"list-group-item " + (index === currentIndex ? "active" : "")} onClick={() => this.setActivePregunta(pregunta, index, 'otro')} key={index}>
                                  <Row>
                                    <Col md="8" >
                                      <div className="list row">
                                        <div className="col-md-9">
                                          <div>
                                            {pregunta.titulo}
                                          </div>

                                          <div>
                                            {pregunta.tipo}
                                          </div>

                                          <div>
                                            {pregunta.puntaje}
                                          </div>
                                        </div>
                                        <div className="col-md-3">
                                          <br></br>
                                          <h6><small>Disponible</small></h6>
                                        </div>
                                      </div>
                                    </Col>
                                  </Row>
                                </li>
                              </>
                            )}
                            <div hidden>
                              {this.state.type = 0}
                            </div>
                          </>
                        ) : (
                          <>
                            {(this.state.type == 0) && (
                              <>
                                <li className={"list-group-item " + (index === currentIndex ? "active" : "")} key={index} disabled>
                                  <Row>
                                    <Col md="8" >
                                      <div className="list row">
                                        <div className="col-md-9">
                                          <div>
                                            {pregunta.titulo}
                                          </div>

                                          <div>
                                            {pregunta.tipo}
                                          </div>

                                          <div>
                                            {pregunta.puntaje}
                                          </div>
                                        </div>
                                        <div className="col-md-3">
                                          <br></br>
                                          <h6><small>No Disponible</small></h6>
                                        </div>
                                      </div>
                                    </Col>
                                  </Row>
                                </li>
                              </>
                            )}
                            <div hidden>
                              {this.state.type = 0}
                            </div>
                          </>
                        )}
                      </>
                    ))}
                </ul>
              </div>

              <div className="col-md-6">
                <br></br>
                <br></br>
                <Table striped bordered hover>
                  <h3 class="center">Preguntas Frecuentes</h3>
                  <Accordion defaultActiveKey="0">
                    <Card.Header>
                      <Accordion.Toggle as={Button} variant="link" eventKey="0">
                        ¿Puedo repetir el Quiz?
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                      <Card.Body>El Quiz solo se responde una vez, una vez finalizado el intento el sistema guarda tus respuestas y no se puede volver a resolver.</Card.Body>
                    </Accordion.Collapse>
                    <Card.Header>
                      <Accordion.Toggle as={Button} variant="link" eventKey="1">
                        ¿Puedo ver mi puntaje?
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="1">
                      <Card.Body>Si ya respondiste las preguntas, puedes terminar el intento para enviar tus respuestas (OJO, revisa bien tus respuestas antes de terminar), una ventana se abrirá qué te mostrará tu puntaje y si tus respuestas fueron correctas o no.</Card.Body>
                    </Accordion.Collapse>
                    <Card.Header>
                      <Accordion.Toggle as={Button} variant="link" eventKey="2">
                        ¿Pueden mis compañeros ver mis resultados?
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="2">
                      <Card.Body>Solo tu puedes ver tus resultados, una vez finalizado el intento, podrás ver tus respuestas y solo los tuyos, tu desempeño se verá reflejado en tu perfil.</Card.Body>
                    </Accordion.Collapse>
                  </Accordion>
                </Table>
              </div>
            </div>

            <br></br>
            {(showTeacherBoard || showModeratorBoard) && (
              <div class="img-center">
                <div className="list row">
                  <div className="col-md-4">
                    {block == false ? (
                      <button type="button" class="btn btn-primary btn-sm" onClick={this.saveUsuQuiz}>
                        Terminar Intento
                      </button>
                    ) : (
                      <button type="button" class="btn btn-primary btn-sm" onClick={this.saveUsuQuiz}>
                        Ver Resultados
                      </button>
                    )}
                  </div>

                  <div className="col-md-4"></div>

                  <div className="col-md-4">
                    <Link
                      to={"/usuquiz/" + this.props.match.params.id}
                      class="btn btn-primary btn-sm"
                    >
                      Calificaciones
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {showUserBoard && (
              <>
                {(minutes == 0) && (tiempoquiz == 0) ? (
                  <></>
                ) : (
                  <div align="center">
                    {block == false ? (
                      <button type="button" class="btn btn-primary btn-lg" onClick={this.saveUsuQuiz}>
                        Terminar Intento
                      </button>
                    ) : (
                      <button type="button" class="btn btn-primary btn-lg" onClick={this.saveUsuQuiz}>
                        Ver Resultados
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
            <br></br>
            <br></br>
          </div>
        )}

        <Modal show={this.state.visible} size="xl" >
          <Modal.Header closeButton onClick={() => this.closeModal()} >
            {progresspregunta == false ? (
              <Modal.Title>Cargando Pregunta</Modal.Title>
            ) : (
              <Modal.Title>Pregunta</Modal.Title>
            )}
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div>
                {progresspregunta == false ? (
                  <div class="img-center">
                    <img src="../../../progress.gif" width="400" height="350" />
                    <h2 class="img-center">Construyendo</h2>
                    <br></br>
                    <button id="box" class="img-center" class="btn btn-primary btn-lg btn-block" onClick={() => this.handleClick()}>
                      Comenzar
                    </button>
                  </div>
                ) : (
                  <div>
                    Tiempo Restante: {seconds < 10 ? `0${seconds}` : seconds}
                    {seconds != 0 ? (
                      <div>
                        {retro == false ? (
                          <div>
                            {pregunta && (
                              <div>
                                {pregunta.tipo != "Arrastrable" ? (
                                  <div className="list row">
                                    <div className="col-md-6">
                                      {retroalimentacions &&
                                        retroalimentacions.map((retroalimentacion) => (
                                          <div>
                                            {retroalimentacion.preguntaid == pregunta.id && (
                                              <div>
                                                {retroalimentacion.activo == true && (
                                                  <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">¿Una Ayudadita?</Tooltip>}>
                                                    <Button size="sm" variant="light" onClick={() => this.setActiveRetro(retroalimentacion)}>
                                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-index-thumb" viewBox="0 0 16 16">
                                                        <path d="M6.75 1a.75.75 0 0 1 .75.75V8a.5.5 0 0 0 1 0V5.467l.086-.004c.317-.012.637-.008.816.027.134.027.294.096.448.182.077.042.15.147.15.314V8a.5.5 0 0 0 1 0V6.435l.106-.01c.316-.024.584-.01.708.04.118.046.3.207.486.43.081.096.15.19.2.259V8.5a.5.5 0 1 0 1 0v-1h.342a1 1 0 0 1 .995 1.1l-.271 2.715a2.5 2.5 0 0 1-.317.991l-1.395 2.442a.5.5 0 0 1-.434.252H6.118a.5.5 0 0 1-.447-.276l-1.232-2.465-2.512-4.185a.517.517 0 0 1 .809-.631l2.41 2.41A.5.5 0 0 0 6 9.5V1.75A.75.75 0 0 1 6.75 1zM8.5 4.466V1.75a1.75 1.75 0 1 0-3.5 0v6.543L3.443 6.736A1.517 1.517 0 0 0 1.07 8.588l2.491 4.153 1.215 2.43A1.5 1.5 0 0 0 6.118 16h6.302a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.271-2.715a2 2 0 0 0-1.99-2.199h-.581a5.114 5.114 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.632 2.632 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046l-.048.002zm2.094 2.025z" />
                                                      </svg>
                                                    </Button>
                                                  </OverlayTrigger>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        ))}

                                      {retroalimentacions ? (
                                        <div></div>
                                      ) : (
                                        <div>
                                          {(showTeacherBoard || showModeratorBoard) && (
                                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Agregar Retroalimentación</Tooltip>}>
                                              <Button size="sm" variant="light" href={"/retroalimentacion/add/" + pregunta.id}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-plus" viewBox="0 0 16 16">
                                                  <path d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5z" />
                                                  <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z" />
                                                </svg>
                                              </Button>
                                            </OverlayTrigger>
                                          )}
                                        </div>
                                      )}

                                      <div>
                                        <br></br>
                                        <strong>Enunciado: </strong>
                                        {pregunta.enunciado.substring(0, 50)}{" "}
                                        {pregunta.enunciado.substr(50, 50)}{" "}
                                        {pregunta.enunciado.substr(50, 50)}{" "}
                                        {pregunta.enunciado.substr(200, pregunta.enunciado.length)}
                                      </div>

                                      <div>
                                        <br></br>
                                        <div>
                                          <input
                                            type="checkbox"
                                            id="respuesta1"
                                            value="1"
                                            defaultValue="0"
                                            onChange={this.onChangeRespuesta1}
                                            name="respuesta1"
                                          />&nbsp;&nbsp;&nbsp;
                                          {pregunta.opcion1}
                                        </div>

                                        <div>
                                          <input
                                            type="checkbox"
                                            id="respuesta2"
                                            value="1"
                                            defaultValue="0"
                                            onChange={this.onChangeRespuesta2}
                                            name="respuesta2"
                                          />&nbsp;&nbsp;&nbsp;
                                          {pregunta.opcion2}
                                        </div>

                                        <div>
                                          <input
                                            type="checkbox"
                                            id="respuesta3"
                                            value="1"
                                            defaultValue="0"
                                            onChange={this.onChangeRespuesta3}
                                            name="respuesta3"
                                          />&nbsp;&nbsp;&nbsp;
                                          {pregunta.opcion3}
                                        </div>

                                        <div>
                                          <input
                                            type="checkbox"
                                            id="respuesta4"
                                            value="1"
                                            defaultValue="0"
                                            onChange={this.onChangeRespuesta4}
                                            name="respuesta4"
                                          />&nbsp;&nbsp;&nbsp;
                                          {pregunta.opcion4}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="col-md-6">
                                      <div>
                                        {recursoimages &&
                                          recursoimages.map((recursoimage) => (
                                            <div>
                                              {recursoimage.preguntaid == pregunta.id && (
                                                <div>
                                                  <br></br>
                                                  <img src={"https://spring-boot-back.herokuapp.com/api/recursos/resource/" + recursoimage.recursoid} width="500" height="280"></img>
                                                </div>
                                              )}
                                            </div>
                                          ))}

                                        {recursodocumentos &&
                                          recursodocumentos.map((recursodocumento) => (
                                            <div>
                                              {recursodocumento.preguntaid == pregunta.id && (
                                                <div>
                                                  <br></br>
                                                  <div class="center">
                                                    <object data={"https://spring-boot-back.herokuapp.com/api/recursos/resource/" + recursodocumento.recursoid} type="application/pdf" width="100%" height="100%">

                                                      <img src="../../../documento.png" href={"https://spring-boot-back.herokuapp.com/api/recursos/resource/" + recursodocumento.recursoid} width="200" height="200" />
                                                      <p>Puedes descargarte el archivo desde <a href={"https://spring-boot-back.herokuapp.com/api/recursos/resource/" + recursodocumento.recursoid}>aquí</a></p>
                                                    </object>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          ))}

                                        {recursolinks &&
                                          recursolinks.map((recursolink) => (
                                            <div>
                                              {recursolink.id == pregunta.id && (
                                                <>
                                                  <br></br>
                                                  <ResponsivePlayer
                                                    url={"https://youtu.be/" + recursolink.link + "'?t=" + recursolink.inicialmin + "?autoplay=0"}
                                                    onProgress={this.handleWatchComplete}
                                                    playing={this.state.playing}
                                                  />
                                                  <br></br>
                                                  <Button onClick={() => this.openModalVideo()} >
                                                    Volver a Ver el Video
                                                  </Button>
                                                </>
                                              )}
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <DragDropContext onDragEnd={this.onDragEnd}>
                                    {retroalimentacions &&
                                      retroalimentacions.map((retroalimentacion) => (
                                        <div>
                                          {retroalimentacion.preguntaid == pregunta.id && (
                                            <div>
                                              {retroalimentacion.activo == true && (
                                                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">¿Una Ayudadita?</Tooltip>}>
                                                  <Button size="sm" variant="light" onClick={() => this.setActiveRetro(retroalimentacion)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-index-thumb" viewBox="0 0 16 16">
                                                      <path d="M6.75 1a.75.75 0 0 1 .75.75V8a.5.5 0 0 0 1 0V5.467l.086-.004c.317-.012.637-.008.816.027.134.027.294.096.448.182.077.042.15.147.15.314V8a.5.5 0 0 0 1 0V6.435l.106-.01c.316-.024.584-.01.708.04.118.046.3.207.486.43.081.096.15.19.2.259V8.5a.5.5 0 1 0 1 0v-1h.342a1 1 0 0 1 .995 1.1l-.271 2.715a2.5 2.5 0 0 1-.317.991l-1.395 2.442a.5.5 0 0 1-.434.252H6.118a.5.5 0 0 1-.447-.276l-1.232-2.465-2.512-4.185a.517.517 0 0 1 .809-.631l2.41 2.41A.5.5 0 0 0 6 9.5V1.75A.75.75 0 0 1 6.75 1zM8.5 4.466V1.75a1.75 1.75 0 1 0-3.5 0v6.543L3.443 6.736A1.517 1.517 0 0 0 1.07 8.588l2.491 4.153 1.215 2.43A1.5 1.5 0 0 0 6.118 16h6.302a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.271-2.715a2 2 0 0 0-1.99-2.199h-.581a5.114 5.114 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.632 2.632 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046l-.048.002zm2.094 2.025z" />
                                                    </svg>
                                                  </Button>
                                                </OverlayTrigger>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      ))}

                                    <div>
                                      <br></br>
                                      <strong>Enunciado: </strong>
                                      {pregunta.enunciado}
                                    </div>

                                    <br></br>

                                    <div className="list row">
                                      <div className="col-md-2">
                                        <Droppable droppableId="droppable1">
                                          {(provided, snapshot) => (
                                            <div
                                              ref={provided.innerRef}
                                              style={getListStyle(snapshot.isDraggingOver)}>
                                              <p>Opciones para Arrastrar</p>
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

                                      {pregunta.template == "0" && (
                                        <div className="col-md-2">
                                          {pregunta.subenunciado1}
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

                                      {pregunta.template == "1" && (
                                        <div className="col-md-10">
                                          <div className="list row">
                                            <div className="col-md-2">
                                              {pregunta.subenunciado1}
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
                                              {pregunta.subenunciado2}
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

                                      {pregunta.template == "2" && (
                                        <div className="col-md-10">
                                          <div className="list row">
                                            <div className="col-md-2">
                                              {pregunta.subenunciado1}
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
                                              {pregunta.subenunciado2}
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
                                              {pregunta.subenunciado3}
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

                                      {pregunta.template == "3" && (
                                        <div className="col-md-10">
                                          <div className="list row">
                                            <div className="col-md-2">
                                              {pregunta.subenunciado1}
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
                                              {pregunta.subenunciado2}
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
                                              {pregunta.subenunciado3}
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
                                              {pregunta.subenunciado4}
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

                                      {pregunta.template == "4" && (
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
                                                {pregunta.subenunciado1}{"..."}
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

                                      {pregunta.template == "5" && (
                                        <div className="col-md-10">
                                          <br></br>
                                          <br></br>
                                          <br></br>
                                          <Droppable droppableId="droppable2">
                                            {(provided, snapshot) => (
                                              <div
                                                ref={provided.innerRef}
                                                style={getListStyle2(snapshot.isDraggingOver)}>
                                                {pregunta.subenunciado1}{"..."}
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
                                                {pregunta.subenunciado2}{"..."}
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

                                      {pregunta.template == "6" && (
                                        <div className="col-md-10">
                                          <br></br>
                                          <br></br>
                                          <Droppable droppableId="droppable2">
                                            {(provided, snapshot) => (
                                              <div
                                                ref={provided.innerRef}
                                                style={getListStyle2(snapshot.isDraggingOver)}>
                                                {pregunta.subenunciado1}{"..."}
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
                                                {pregunta.subenunciado2}{"..."}
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
                                                {pregunta.subenunciado3}{"..."}
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

                                      {pregunta.template == "7" && (
                                        <div className="col-md-10">
                                          <br></br>
                                          <Droppable droppableId="droppable2">
                                            {(provided, snapshot) => (
                                              <div
                                                ref={provided.innerRef}
                                                style={getListStyle2(snapshot.isDraggingOver)}>
                                                {pregunta.subenunciado1}{"..."}
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
                                                {pregunta.subenunciado2}{"..."}
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
                                                {pregunta.subenunciado3}{"..."}
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
                                                {pregunta.subenunciado4}{"..."}
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
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            {retroalimentacion && (
                              <div className="list row">

                                <div className="col-md-6">
                                  <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Regresar</Tooltip>}>
                                    <Button size="sm" variant="light" onClick={() => this.handleClickRetro()}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-reply" viewBox="0 0 16 16">
                                        <path d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822.984.624 1.99 1.76 2.595 3.876-1.02-.983-2.185-1.516-3.205-1.799a8.74 8.74 0 0 0-1.921-.306 7.404 7.404 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254a.503.503 0 0 0-.042-.028.147.147 0 0 1 0-.252.499.499 0 0 0 .042-.028l3.984-2.933zM7.8 10.386c.068 0 .143.003.223.006.434.02 1.034.086 1.7.271 1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96v-.667z" />
                                      </svg>
                                    </Button>
                                  </OverlayTrigger>

                                  {(showTeacherBoard || showModeratorBoard) && (
                                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Editar Retroalimentación</Tooltip>}>
                                      <Button size="sm" variant="light" href={"/retroalimentacion/add/" + pregunta.id}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-wrench" viewBox="0 0 16 16">
                                          <path d="M.102 2.223A3.004 3.004 0 0 0 3.78 5.897l6.341 6.252A3.003 3.003 0 0 0 13 16a3 3 0 1 0-.851-5.878L5.897 3.781A3.004 3.004 0 0 0 2.223.1l2.141 2.142L4 4l-1.757.364L.102 2.223zm13.37 9.019l.528.026.287.445.445.287.026.529L15 13l-.242.471-.026.529-.445.287-.287.445-.529.026L13 15l-.471-.242-.529-.026-.287-.445-.445-.287-.026-.529L11 13l.242-.471.026-.529.445-.287.287-.445.529-.026L13 11l.471.242z" />
                                        </svg>
                                      </Button>
                                    </OverlayTrigger>
                                  )}
                                  <label>
                                    <br></br>
                                    <strong>Enunciado:</strong>
                                  </label>{" "}
                                  {retroalimentacion.enunciado.substring(0, 50)}{" "}
                                  {retroalimentacion.enunciado.substr(50, 50)}{" "}
                                  {retroalimentacion.enunciado.substr(50, 50)}{" "}
                                  {retroalimentacion.enunciado.substr(200, retroalimentacion.enunciado.length)}
                                </div>
                                <div className="col-md-6">
                                  <Table striped bordered hover>
                                    <h3 class="center">Preguntas Frecuentes</h3>
                                    <Accordion defaultActiveKey="0">
                                      <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                          ¿Qué es una Retroalimentación?
                                        </Accordion.Toggle>
                                      </Card.Header>
                                      <Accordion.Collapse eventKey="0">
                                        <Card.Body>Una Retroalimentación es establecida por el Profesor, esta es una ayuda para poder responder una pregunta en específica.</Card.Body>
                                      </Accordion.Collapse>
                                      <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                          ¿Pierdo el puntaje si uso la Retroalimentación?
                                        </Accordion.Toggle>
                                      </Card.Header>
                                      <Accordion.Collapse eventKey="1">
                                        <Card.Body>No pierdes el puntaje de la pregunta al usar la Retroalimentación, su objetivo es ayudar, NO PERJUDICAR.</Card.Body>
                                      </Accordion.Collapse>
                                    </Accordion>
                                  </Table>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div class="img-center">
                        <img src="../../../TimeOut.gif" width="300" height="250" />
                        <h2 aling="center">Se Acabo el Tiempo!!!</h2>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {seconds != 0 ? (
              <div>
                {pregunta && (
                  <div>
                    {pregunta.tipo == "Arrastrable" ? (
                      <div>
                        {progresspregunta == false ? (
                          <div></div>
                        ) : (
                          <div>
                            {block == false ? (
                              <Button variant="primary" onClick={this.saveRespuesta2}>
                                Responder
                              </Button>
                            ) : (
                              <Button variant="primary" onClick={() => this.closeModalSeguro()}>
                                Cerrar
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        {progresspregunta == false ? (
                          <div></div>
                        ) : (
                          <div>
                            {block == false ? (
                              <Button variant="primary" onClick={this.saveRespuesta}>
                                Responder
                              </Button>
                            ) : (
                              <Button variant="primary" onClick={() => this.closeModalSeguro()}>
                                Cerrar
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <Button variant="primary" onClick={this.saveRespuesta}>
                  Salir
                </Button>
              </div>
            )}
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.visiblevideo} size="xl" >
          <Modal.Header closeButton onClick={() => this.closeModalVideo()} >
            <Modal.Title>Reproductor Pre-Pregunta</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {pregunta && (

                <>
                  {recursolinks.map((recursolink) => (
                    <div>
                      {recursolink.id == pregunta.id && (
                        <>
                          <br></br>
                          <ResponsivePlayer
                            url={"https://youtu.be/" + recursolink.link + "'?t=" + recursolink.inicialmin}
                            onProgress={this.handleWatchComplete}
                            playing={this.state.stop} />
                          <div hidden>
                            {this.state.finalmin = recursolink.finalmin}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {this.state.stop == false ? (
              <Button variant="primary" onClick={() => this.openModal()}>
                Responder Pregunta
              </Button>
            ) : (
              <Button variant="primary" disabled>
                Reproduciendo Video
              </Button>
            )}
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.visible2} size="xl" >
          <Modal.Header closeButton onClick={() => this.closeModalResultado()} >
            <Modal.Title>Resultados</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div class="center">
                <h3 class="center">Puntaje: {this.state.resultado} Puntos!!!</h3>
                <br></br>
              </div>

              <div className="list row">
                <div className="col-md-6">
                  <Table striped bordered hover>
                    <h3 class="center">Preguntas</h3>
                    {respuestausers &&
                      respuestausers.map((respuesta) => (
                        <div>
                          {respuesta.puntaje == "0" ? (
                            <li className="list-group-item" onClick={() => this.setActiveRespuesta(respuesta.preguntaid)}>
                              {respuesta.preguntaid}:
                              <img src={"https://images.emojiterra.com/twitter/512px/274c.png"} width="25" height="25"></img>
                            </li>
                          ) : (
                            <li className="list-group-item" onClick={() => this.setActiveRespuesta(respuesta.preguntaid)}>
                              {respuesta.preguntaid}:
                              <img src={"https://cdn.pixabay.com/photo/2012/04/24/13/49/tick-40143_640.png"} width="25" height="25"></img>
                            </li>
                          )}
                        </div>
                      ))}
                  </Table>
                </div>

                <div className="col-md-6">
                  {respuesta ? (
                    <div>
                      <div>
                        <label>
                          <strong>Titulo:</strong>
                        </label>{" "}
                        {respuesta.titulo}
                      </div>
                      <div>
                        <label>
                          <strong>Enunciado:</strong>
                        </label>{" "}
                        {respuesta.enunciado}
                      </div>
                      <div>
                        <label>
                          <strong>Respuesta Correcta:</strong>
                        </label>{" "}
                        {respuesta.respuesta1 == 1 ? (
                          <div>
                            {respuesta.opcion1}
                          </div>
                        ) : (
                          <div></div>
                        )}

                        {respuesta.respuesta2 == 1 ? (
                          <div>
                            {respuesta.opcion2}
                          </div>
                        ) : (
                          <div></div>
                        )}

                        {respuesta.respuesta3 == 1 ? (
                          <div>
                            {respuesta.opcion3}
                          </div>
                        ) : (
                          <div></div>
                        )}

                        {respuesta.respuesta4 == 1 ? (
                          <div>
                            {respuesta.opcion4}
                          </div>
                        ) : (
                          <div></div>
                        )}

                        {respuesta.respuesta5 == 1 ? (
                          <div>
                            {respuesta.opcion5}
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <br />
                      <p>Please click on a Pregunta...</p>
                    </div>
                  )}
                </div>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" href="/">
              Inicio
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.visibleseguro} width="1000" height="500" effect="fadeInUp">
          <Modal.Header closeButton onClick={() => this.closeModalSeguro2()} >
            <Modal.Title align="center">Asegurate antes de responder o cerrar la pregunta.</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <button className="btn btn-warning" onClick={() => this.closeModalSeguro()} >
              Responder y Cerrar
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}