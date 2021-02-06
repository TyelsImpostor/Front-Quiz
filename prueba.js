export default class Pregunta extends Component {
    constructor(props) {
      super(props);
      this.onChangeTitulo2 = this.onChangeTitulo2.bind(this);
      this.onChangeTipo2 = this.onChangeTipo2.bind(this);
      this.onChangeEnunciado2 = this.onChangeEnunciado2.bind(this);
      this.onChangeTiempoRespuesta2 = this.onChangeTiempoRespuesta2.bind(this);
      this.onChangePuntaje2 = this.onChangePuntaje2.bind(this);
      this.onChangeRandom2 = this.onChangeRandom2.bind(this);
      this.onChangeUserid2 = this.onChangeUserid2.bind(this);

  
      this.state = {
        currentPregunta: {
          id: null,
          titulo: "",
          tipo: "",
          enunciado: "",
          tiemporespuesta: "",
          puntaje: "",
          random: "",
          users: ""
  
        },
        message: "",
        showUserBoard: false,
        showModeratorBoard: false,
        showTeacherBoard: false,
        currentUser: undefined,
      };
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
      const tiemporespuesta = e.target.value;
  
      this.setState(prevState => ({
        currentPregunta: {
          ...prevState.currentPregunta,
          tiemporespuesta: tiemporespuesta
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
  
    updateRandom(status) {
      var data = {
        id: this.state.currentPregunta.id,
        titulo: this.state.currentPregunta.titulo,
        tipo: this.state.currentPregunta.tipo,
        enunciado: this.state.currentPregunta.enunciado,
        tiemporespuesta: this.state.currentPregunta.tiemporespuesta,
        puntaje: this.state.currentPregunta.puntaje,
        random: this.state.currentPregunta.random,
        users: this.state.currentPregunta.users,
      };
  
      PreguntaDataService.update(this.state.currentPregunta.id, data)
        .then(response => {
          this.setState(prevState => ({
            currentPregunta: {
              ...prevState.currentPregunta,
              random: status
            }
          }));
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
  
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
    }
  
    deletePregunta() {
      PreguntaDataService.delete(this.state.currentPregunta.id)
        .then(response => {
          console.log(response.data);
          this.props.history.push('/preguntas')
        })
        .catch(e => {
          console.log(e);
        });
    }



    <label htmlFor="opcion">Random</label>
    <Form.Check 
      type="switch"
      id="random"
      name="random"
      data-off="false"
      data-on="true" 
      onChange={this.onChangeRandom}

    />


   
    to={"/prerecur/add/" + pregunta.id}

    <link
    to={"/prerecur/add/" + currentPregunta.id}
    className="badge badge-blue"
    >agregar recurso</link>


    <div class="card col-md-2 mb-5 col-lg-2 col-md-3 col-sm-6 col-xs-12"> 
    this.props.history.push('/pregunta/list')



    <div className="list row">
    {recursos && recursos.map((recurso, index) => (



    <Col md="8">
    {prerecur.id}
    </Col>

    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Borrar</Tooltip>}>
    <Button size="sm" variant="danger" onClick={() => (this.deletePrerecurso(prerecur.id),window.location.reload())}  > 
      <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
          <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
      </svg>                    
    </Button>
</OverlayTrigger>

{prerecurs &&
  prerecurs.map((prerecur) => (
    <div>
      {prerecur.preguntaid == currentPregunta.id ? (
      <Row>
        {prerecur.type}

      </Row>  
      ) : (
        <h5></h5>
        )}

    </div>
  ))}

  <div className="list row">
    {recursos &&
      recursos.map((recurso) => (
        {recurso.id == currentPregunta.id ? (

          <Card style={{ width: '18rem' }}>
          {recurso.type == "documento" && (
            <Card.Img variant="top" src="https://image.flaticon.com/icons/png/512/32/32329.png" width="auto" height="200" />
          )}
          {recurso.type == "link" && (
            <iframe src={"https://www.youtube.com/embed/" + recurso.link + "?autoplay=1&loop=1"} width="auto" height="200"></iframe>
          )}
          {recurso.type == "imagen" && (
            <Card.Img variant="top" src={"https://spring-boot-back.herokuapp.com/api/recursos/" + recurso.id} width="auto" height="200" />
          )}
          <Card.Body>
            <Card.Title>{recurso.title}</Card.Title>
          </Card.Body>
          <ListGroup className="list-group-flush"></ListGroup>
          <Card.Body align="center">
            <Button onClick={() => this.savePreRecur(recurso.id, currentPregunta.id)} class="btn btn-primary">Agregar Recurso</Button>
          </Card.Body>
        </Card>

      ) : (
        <h5></h5>
      )}
      ))}
      </div>




      <div className="list row">
      {recursos &&
        recursos.map((recurso) => (
          <div>
            {recurso.id == currentPregunta.id ? (
              
              <Card style={{ width: '18rem' }}>
              {recurso.type == "documento" && (
                <Card.Img variant="top" src="https://image.flaticon.com/icons/png/512/32/32329.png" width="auto" height="200" />
              )}
              {recurso.type == "link" && (
                <iframe src={"https://www.youtube.com/embed/" + recurso.link + "?autoplay=1&loop=1"} width="auto" height="200"></iframe>
              )}
              {recurso.type == "imagen" && (
                <Card.Img variant="top" src={"https://spring-boot-back.herokuapp.com/api/recursos/" + recurso.id} width="auto" height="200" />
              )}
              <Card.Body>
                <Card.Title>{recurso.title}</Card.Title>
              </Card.Body>
              <ListGroup className="list-group-flush"></ListGroup>
              <Card.Body align="center">
                <Button onClick={() => this.savePreRecur(recurso.id, currentPregunta.id)} class="btn btn-primary">Agregar Recurso</Button>
              </Card.Body>
            </Card>

          ) : (
            <h5></h5>
          )}
        </div>
        ))}
      </div>


<Row>
{prerecur.recursoid} - {recurso.id} - {prerecur.preguntaid} - {currentPregunta.id}
</Row> 





//
onClick={() => (this.setActivePregunta(pregunta, index),this.openModalShow())}

---------------------------------------------


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
          
                                <Form.Group as={Col} md="4 "controlId="formGridState">
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
                                <Col md= "3">
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
                                      disabled/>
                                </Col>
                              </Form.Row>
                              
                              <Form.Row>
                                <label htmlFor="enunciado">Enunciado</label>
                                <Form.Control  as="textarea" rows={3} 
                                  className="form-control"
                                  id="enunciado"
                                  required
                                  defaultValue={currentPregunta.enunciado}
                                  onChange={this.onChangeEnunciado2}
                                  name="enunciado"
                                >
                                </Form.Control>
                              </Form.Row>
          








          <div className="col-md-6">
          <h4>Preguntas Añadidas</h4>

          <ul className="list-group">
            {quizpres && quizpres.map((quizpre) => (
                <div>
                  {quizpre.quizid == currentQuiz.id ? (
                    <li className="list-group-item">
                      {quizpre.preguntaid}
                    </li>
                  ) : (
                      <h5></h5>
                    )}

                </div>
              ))}
          </ul>
        </div>





             {/*
              <div className="col-md-6">
                <h4>Lista de Preguntas</h4>
                <ul className="list-group">
                  {preguntas &&
                    preguntas.map((pregunta) => (
                      <li
                        className="list-group-item" >
                        {pregunta.titulo}
                        
                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Agregar Opciones</Tooltip>}>
                          <Button size="sm" variant="warning" onClick={() => this.openModalañadir(pregunta.id)}  >
                              <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                            </svg>
                          </Button>
                        </OverlayTrigger>
                      </li>
                    ))}
                </ul>
              </div>
              */}

//prueba TAG

import React, { Component } from "react";
import PreguntaDataService from "../../services/pregunta.service";
import TagPreDataService from "../../services/tagpre.service";
import TagDataService from "../../services/tag.service";
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";

export default class AddPregunta extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitulo = this.onChangeTitulo.bind(this);
    this.onChangeTipo = this.onChangeTipo.bind(this);
    this.onChangeEnunciado = this.onChangeEnunciado.bind(this);
    this.onChangeTiempoRespuesta = this.onChangeTiempoRespuesta.bind(this);
    this.onChangePuntaje = this.onChangePuntaje.bind(this);
    this.onChangeRandom = this.onChangeRandom.bind(this);
    this.onChangeUserid = this.onChangeUserid.bind(this);
    this.onChangeTagid = this.onChangeTagid.bind(this);
    this.savePregunta = this.savePregunta.bind(this);
    this.newPregunta = this.newPregunta.bind(this);
    this.newTagPre = this.newTagPre.bind(this);
    this.retrieveTags = this.retrieveTags.bind(this);

    this.state = {
      id: null,
      titulo: "",
      tipo: "",
      enunciado: "",
      tiemporespuesta: "",
      puntaje: "",
      random: "",
      users: "",
      tagid: "",
      preguntaid: "",
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
      tags: [],

      submitted: false
    };
  }

  componentDidMount() {
    this.retrieveTags();
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

  retrieveTags() {
    TagDataService.getAll()
      .then(response => {
        this.setState({
          tags: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

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
      tiemporespuesta: e.target.value
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
      users: e.target.value
    });
  }

  onChangeTagid(e) {
    this.setState({
      tagid: e.target.value
    });
  }

  savePregunta() {
    var data = {
      titulo: this.state.titulo,
      tipo: this.state.tipo,
      enunciado: this.state.enunciado,
      tiemporespuesta: this.state.tiemporespuesta,
      puntaje: this.state.puntaje,
      random: this.state.random,
      users: this.state.users
    };

    PreguntaDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          titulo: response.data.titulo,
          tipo: response.data.tipo,
          enunciado: response.data.enunciado,
          tiemporespuesta: response.data.tiemporespuesta,
          puntaje: response.data.puntaje,
          random: response.data.random,
          users: response.data.users,

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
      })
      .catch(e => {
        console.log(e);
      });
  }

  newPregunta() {
    this.setState({
      id: null,
      titulo: "",
      tipo: "",
      enunciado: "",
      tiemporespuesta: "",
      puntaje: "",
      random: "",
      users: "",

      submitted: false
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

  render() {
    const { currentUser, tags, showUserBoard, showModeratorBoard, showTeacherBoard } = this.state;

    return (
      <div className="container">
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
          {showTeacherBoard || (showModeratorBoard && (
            <div className="submit-form">
              {this.state.submitted ? (
                <div>
                  <h4>You submitted successfully!</h4>
                  <button className="btn btn-success" onClick={this.newPregunta, this.newTagPre}>
                    Add
                </button>
                </div>
              ) : (
                  <div>
                    <div className="form-group">
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
                    </div>

                    <div className="form-group">
                      <label htmlFor="tipo">Tipo</label>
                      <input
                        type="text"
                        className="form-control"
                        id="tipo"
                        required
                        value={this.state.tipo}
                        onChange={this.onChangeTipo}
                        name="tipo"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="enunciado">Enunciado</label>
                      <input
                        type="text"
                        className="form-control"
                        id="enunciado"
                        required
                        value={this.state.enunciado}
                        onChange={this.onChangeEnunciado}
                        name="enunciado"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="tiemporespuesta">Tiempo de Respuesta</label>
                      <input
                        type="text"
                        className="form-control"
                        id="tiemporespuesta"
                        required
                        value={this.state.tiemporespuesta}
                        onChange={this.onChangeTiempoRespuesta}
                        name="tiemporespuesta"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="puntaje">Puntaje</label>
                      <input
                        type="text"
                        className="form-control"
                        id="puntaje"
                        required
                        value={this.state.puntaje}
                        onChange={this.onChangePuntaje}
                        name="puntaje"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="opcion">Random:</label>
                      <input
                        type="checkbox"
                        className="form-control"
                        id="random"
                        value="true"
                        onChange={this.onChangeRandom}
                        name="random">
                      </input>
                    </div>

                    <div className="form-group">
                      <label htmlFor="users">Id del Usuario</label>
                      <input
                        type="text"
                        className="form-control"
                        id="users"
                        required
                        value={this.state.users}
                        onChange={this.onChangeUserid}
                        name="users"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="tags">Tag:</label>
                      <select
                        type="text"
                        className="form-control"
                        id="tags"
                        required
                        onChange={this.onChangeTagid}
                        name="tags"
                        defaultValue="...">
                        <option disabled>...</option>
                        {tags &&
                          tags.map((tag) => (
                            <option value={tag.id}>{tag.nombre}</option>
                          ))}
                      </select>
                    </div>

                    <button onClick={this.savePregunta} className="btn btn-success">
                      Submit
                    </button>

                  </div>
                )}
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



ListaPrueba() {
  const gente   = [{name: 'Rushabh',age: 27},{name: 'Lolito',age: 16}];
  console.log(gente);
  gente.push({name: 'Rushabh2',age: 27},{name: 'Lolito2',age: 16},{name: this.state.titulo, age: 88});
}