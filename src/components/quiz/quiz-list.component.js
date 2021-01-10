import React, { Component } from "react";
import QuizDataService from "../../services/quiz.service";
import { striped, bordered, hover, Table, Button, Text, View , Overview, Modal, 
  InputGroup, FormControl, Form, Col, Jumbotron, Container, Badge, Row, OverlayTrigger, Overlay, Tooltip} from 'react-bootstrap';
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";

export default class QuizsList extends Component {
  constructor(props) {
    super(props);
    
    this.onChangeSearchTitulo = this.onChangeSearchTitulo.bind(this);
    this.retrieveQuizs = this.retrieveQuizs.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveQuiz = this.setActiveQuiz.bind(this);
    this.searchTitulo = this.searchTitulo.bind(this);
    //CREATE
    this.onChangeTitulo = this.onChangeTitulo.bind(this);
    this.onChangeDescripcion = this.onChangeDescripcion.bind(this);
    this.onChangeActivo = this.onChangeActivo.bind(this);
    this.onChangeTiempodisponible = this.onChangeTiempodisponible.bind(this);
    this.onChangeFechacreacion = this.onChangeFechacreacion.bind(this);
    this.onChangeRandom = this.onChangeRandom.bind(this);
    this.onChangeFechatermino = this.onChangeFechatermino.bind(this);
    this.saveQuiz = this.saveQuiz.bind(this);
    this.newQuiz = this.newQuiz.bind(this);
    //UPDATE
    this.updateQuiz = this.updateQuiz.bind(this);

    this.onChangeTitulo2 = this.onChangeTitulo2.bind(this);
    this.onChangeDescripcion2 = this.onChangeDescripcion2.bind(this);
    this.onChangeActivo2 = this.onChangeActivo2.bind(this);
    this.onChangeTiempodisponible2 = this.onChangeTiempodisponible2.bind(this);
    this.onChangeFechacreacion2 = this.onChangeFechacreacion2.bind(this);
    this.onChangeRandom2 = this.onChangeRandom2.bind(this);
    this.onChangeFechatermino2 = this.onChangeFechatermino2.bind(this);
    //DELETE
    this.deleteQuiz = this.deleteQuiz.bind(this);

    //Edit
    this.state = {
      quizs: [],
      currentQuiz: null,
      currentIndex: -1,
      searchTitulo: "",
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
      currentUser2: AuthService.getCurrentUser(),
      
      //Edit
      currentQuiz: {
        id: null,
        titulo: "",
        descripcion: "",
        activo: "",
        tiempodisponible: "",
        random: "",
        fechacreacion: "",
        fechatermino: ""

      },
      message: "",
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,


    };
  }

  componentDidMount() {
    this.retrieveQuizs();
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

  onChangeSearchTitulo(e) {
    const searchTitulo = e.target.value;

    this.setState({
      searchTitulo: searchTitulo
    });
  }

  retrieveQuizs() {
    QuizDataService.getAll()
      .then(response => {
        this.setState({
          quizs: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveQuizs();
    this.setState({
      currentQuiz: null,
      currentIndex: -1
    });
  }

  setActiveQuiz(quiz, index) {
    this.setState({
      currentQuiz: quiz,
      currentIndex: index
    });
  }

  searchTitulo() {
    QuizDataService.findByTitulo(this.state.searchTitulo)
      .then(response => {
        this.setState({
          quizs: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }
  //CREATE----------------------------

  onChangeTitulo(e) {
    this.setState({
      titulo: e.target.value
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

  onChangeRandom(e) {
    this.setState({
      random: e.target.value
    });
  }

  onChangeFechatermino(e) {
    this.setState({
      fechatermino: e.target.value
    });
  }

  saveQuiz() {
    var data = {
      titulo: this.state.titulo,
      descripcion: this.state.descripcion,
      activo: this.state.activo,
      tiempodisponible: this.state.tiempodisponible,
      random: this.state.random,
      fechacreacion: this.state.fechacreacion,
      fechatermino: this.state.fechatermino
    };

    QuizDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          titulo: response.data.titulo,
          descripcion: response.data.descripcion,
          activo: response.data.activo,
          tiempodisponible: response.data.tiempodisponible,
          random: response.data.random,
          fechacreacion: response.data.fechacreacion,
          fechatermino: response.data.fechatermino,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newQuiz() {
    this.setState({
      id: null,
      titulo: "",
      descripcion: "",
      activo: "",
      tiempodisponible: "",
      random: "",
      fechacreacion: "",
      fechatermino: "",

      submitted: false
    });
  }
  //UPDATE

  onChangeTitulo2(e) {
    const titulo = e.target.value;

    this.setState(function (prevState) {
      return {
        currentQuiz: {
          ...prevState.currentQuiz,
          titulo: titulo
        }
      };
    });
  }

  onChangeDescripcion2(e) {
    const descripcion = e.target.value;

    this.setState(prevState => ({
      currentQuiz: {
        ...prevState.currentQuiz,
        descripcion: descripcion
      }
    }));
  }

  onChangeActivo2(e) {
    const activo = e.target.value;

    this.setState(prevState => ({
      currentQuiz: {
        ...prevState.currentQuiz,
        activo: activo
      }
    }));
  }

  onChangeTiempodisponible2(e) {
    const tiempodisponible = e.target.value;

    this.setState(prevState => ({
      currentQuiz: {
        ...prevState.currentQuiz,
        tiempodisponible: tiempodisponible
      }
    }));
  }

  onChangeFechacreacion2(e) {
    const fechacreacion = e.target.value;

    this.setState(prevState => ({
      currentQuiz: {
        ...prevState.currentQuiz,
        fechacreacion: fechacreacion
      }
    }));
  }

  onChangeRandom2(e) {
    const random = e.target.value;

    this.setState(prevState => ({
      currentQuiz: {
        ...prevState.currentQuiz,
        random: random
      }
    }));
  }

  onChangeFechatermino2(e) {
    const fechatermino = e.target.value;

    this.setState(prevState => ({
      currentQuiz: {
        ...prevState.currentQuiz,
        fechatermino: fechatermino
      }
    }));
  }
  updateQuiz() {
    QuizDataService.update(
      this.state.currentQuiz.id,
      this.state.currentQuiz
    )
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "The quiz was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteQuiz(id) {
    QuizDataService.delete(id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/quizs')
      })
      .catch(e => {
        console.log(e);
      });
  }

 //MODALLS

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

  render() {
    const { searchTitulo, quizs, currentQuiz, currentIndex, currentUser, showUserBoard, showModeratorBoard, showTeacherBoard, currentUser2} = this.state;

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

              

              <Jumbotron fluid="md">
                <Container >
                  <h1 class="display-5">Lista de Pruebas</h1>
                </Container>
              </Jumbotron>

              <Table striped bordered hover>
                <tbody>
                  <tr>
                    <td>
                    {quizs && quizs.map((quiz, index) => (
                      <li className= {"list-group-item " +  (index === currentIndex ? "active" : "")}  >      
                        <Row>
                          <Col md="8" >
                            {quiz.titulo}
                          </Col>
                          <Col md="auto">
                            {' '}
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Editar</Tooltip>}>
                              <Button size="sm" variant="info" onClick={() => (this.setActiveQuiz(quiz, index),this.openModalEdit())} key={index}>
                              <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-pencil" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                              </svg>
                              </Button>
                            </OverlayTrigger>
                            {' '}
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Borrar</Tooltip>}>
                              <Button size="sm" variant="danger"  onClick={() => (this.deleteQuiz(quiz.id),window.location.reload())}> 
                                <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                </svg>                   
                              </Button>
                            </OverlayTrigger>
                            {' '}
                            
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Agregar Opciones</Tooltip>}>
                              <Button size="sm" variant="warning" href={"/quiz/pregunta/list/" + quiz.id}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
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


                <Link
                  to="/quiz/add"
                  className="badge badge-blue">
                  Agregar
                </Link>
                  <div>
                    <Button onClick={() => this.openModalCreate()} > Agregar Quiz </Button>
                  </div>
                  <Modal show={this.state.visible} size="xl" >
                    <Modal.Header closeButton onClick={() => this.closeModal()} >
                      <Modal.Title>Agregar Quiz</Modal.Title>
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
                            <Col md="4">
                              <label htmlFor="user">Id del Usuario</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="user"
                                  required
                                  //value={currentUser2.id}
                                  //onChange={this.onChangeUserid}
                                  name="user"
                                  disabled
                                />
                            </Col>

                          </Form.Row>
                          <Form.Row>
                            <Col md="3">
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
                            <Col md= "3">
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
                            <Col md= "3">
                              <label htmlFor="fechatermino">fechatermino</label>
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
                              <label htmlFor="user">Random</label>
                                <input defaultChecked={false} type="checkbox" class="make-switch" id="price_check" 
                                name="pricing" data-on-color="primary" data-off-color="info" value="true" size="10"
                                onChange={this.onChangeRandom}></input>
                            </Col>
          
                          </Form.Row>
                          
                          <Form.Row>
                            <label htmlFor="descripcion">Descripcion</label>
                            <Form.Control  as="textarea" rows={3} 
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
                      <Button variant="secondary" onClick={() => this.closeModal()} >
                        Cerrar
                      </Button>
                      
                      <Button variant="primary" onClick={this.saveQuiz} href="/quiz/list">
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
                            <Col md="8">
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
                            <Col md="4">
                              <label htmlFor="user">Id del Usuario</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="user"
                                  required
                                  //value={currentUser2.id}
                                  //onChange={this.onChangeUserid}
                                  name="user"
                                  disabled
                                />
                            </Col>

                          </Form.Row>
                          <Form.Row>
                            <Col md="3">
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
                            <Col md= "3">
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
                            <Col md= "3">
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
                            
                            <Col md="1" align="center">
                              <label htmlFor="user">Activo</label>
                                <input defaultChecked={currentQuiz.activo} type="checkbox" class="make-switch" id="price_check" 
                                name="pricing" data-on-color="primary" data-off-color="info" value="true" size="10"
                                onChange={this.onChangeActivo2}></input>
                            </Col>
                                
                            <Col md="1" align="center">
                              <label htmlFor="user">Random</label>
                                <input defaultChecked={currentQuiz.random} type="checkbox" class="make-switch" id="price_check" 
                                name="pricing" data-on-color="primary" data-off-color="info" value="true" size="10"
                                onChange={this.onChangeRandom2}></input>
                            </Col>

                          </Form.Row>
                          
                          <Form.Row>
                            <label htmlFor="descripcion">Descripcion</label>
                            <Form.Control  as="textarea" rows={3} 
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
                      <Button variant="secondary" onClick={() => this.closeModal()} >
                        Cerrar
                      </Button>
                      
                      <Button variant="primary" onClick={this.updateQuiz} href="/quiz/list">
                        Agregar
                      </Button>
                    </Modal.Footer>
                      
                  </Modal>


              {/*          
              <div className="col-md-6">
                {currentQuiz ? (
                  <div>
                    <h4>Quiz</h4>
                    <div>
                      <label>
                        <strong>Titulo:</strong>
                      </label>{" "}
                      {currentQuiz.titulo}
                    </div>
                    <div>
                      <label>
                        <strong>Descripcion:</strong>
                      </label>{" "}
                      {currentQuiz.descripcion}
                    </div>
                    <div>
                      <label>
                        <strong>Activo:</strong>
                      </label>{" "}
                      {currentQuiz.activo ? "Activo" : "Desactivado"}
                    </div>
                    <div>
                      <label>
                        <strong>Tiempo disponible:</strong>
                      </label>{" "}
                      {currentQuiz.tiempodisponible}
                    </div>
                    <div>
                      <label>
                        <strong>Quiz Random:</strong>
                      </label>{" "}
                      {currentQuiz.random ? "Activo" : "Desactivado"}
                    </div>
                    <div>
                      <label>
                        <strong>Fecha de Creacion:</strong>
                      </label>{" "}
                      {currentQuiz.fechacreacion}
                    </div>
                    <div>
                      <label>
                        <strong>Fecha de Termino:</strong>
                      </label>{" "}
                      {currentQuiz.fechatermino}
                    </div>

                    <Link
                        to={"/quiz/" + currentQuiz.id}
                        className="badge badge-warning"
                      >
                        Edit
                    </Link>

                    <Link
                        to={"/quiz/pregunta/list/" + currentQuiz.id}
                        className="badge badge-blue"
                      >
                        Agregar Preguntas
                    </Link>

                  </div>
                ) : (
                    <div>
                      <br />
                      <p>Please click on a Quiz...</p>
                    </div>
                  )}
              </div>
                */}



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