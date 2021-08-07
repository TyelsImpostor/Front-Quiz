import React, { Component } from "react";
import CheckButton from "react-validation/build/button";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CurUsuDataService from "../services/curusu.service";
import QuizCurDataService from "../services/quizcur.service";
import QuizDataService from "../services/quiz.service";
import { Switch, Route, Link } from "react-router-dom";

import AuthService from "../services/auth.service";

import {
  Carousel, Toast, Button, Modal, Col, Row, OverlayTrigger, Tooltip, Nav, Tab, Card, Accordion, Tabs, Pagination
} from 'react-bootstrap';

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        Este campo es Obligatorio!
      </div>
    );
  }
};
export default class Inicio extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      username: "",
      password: "",
      loading: false,
      message: "",
      quiz: [],
      currentDateTime: "",

      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: AuthService.getCurrentUser(),
      user: undefined
    };
  }

  componentDidMount() {
    var today = new Date();
    var año = today.getFullYear();
    const user = AuthService.getCurrentUser();

    if (user) {
      this.getQuiz(user.id);
      this.setState({
        currentDateTime: año,
        currentUser: user,
        showUserBoard: user.roles.includes("user"),
        showModeratorBoard: user.roles.includes("moderator"),
        showTeacherBoard: user.roles.includes("teacher"),
      });
    }
  }

  async getQuiz(id) {
    var curusu = [], quizcur = [], quiz = [];
    await CurUsuDataService.getAll()
      .then(response => {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].usuarioid == id) {
            curusu.push(response.data[i]);
          }
        }
      })
      .catch(e => {
        //console.log(e);
      });

    //console.log(curusu);
    await QuizCurDataService.getAll()
      .then(response => {
        for (var i = 0; i < response.data.length; i++) {
          for (var j = 0; j < curusu.length; j++) {
            if (curusu[j].cursoid == response.data[i].cursoid) {
              quizcur.push(response.data[i]);
            }
          }
        }
      })
      .catch(e => {
        //console.log(e);
      });

    //console.log(quizcur);
    for (var j = 0; j < quizcur.length; j++) {
      await QuizDataService.get(quizcur[j].quizid)
        .then(response => {
          var data = {
            id: response.data.id,
            titulo: response.data.titulo,
            fechatermino: response.data.fechatermino,
            descripcion: response.data.descripcion,
            activo: response.data.activo,
            cursoid: quizcur[j].cursoid,
          };
          quiz.push(data);
        })
        .catch(e => {
          //console.log(e);
        });
    }

    //console.log(quiz);
    this.setState({
      quiz: quiz
    });
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  handleLogin(e) {
    e.preventDefault();

    this.setState({
      message: "",
      loading: true
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.login(this.state.username.toLowerCase(), this.state.password).then(
        () => {
          this.props.history.push("/");
          window.location.reload();
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            loading: false,
            message: resMessage
          });
        }
      );
    } else {
      this.setState({
        loading: false
      });
    }
  }

  render() {
    const { currentUser, showModeratorBoard, showTeacherBoard, quiz, currentDateTime } = this.state;

    return (
      <body>
        {currentUser ? (
          <div>
            <div>
              <div className="list row">
                <div className="col-md-8">
                  <Card>
                    <Carousel>
                      <Carousel.Item>
                        <img
                          className="d-block w-100"
                          src="./Logo-ucm.png" height="300"
                          alt="First slide"
                        />
                      </Carousel.Item>
                      <Carousel.Item>
                        <img
                          className="d-block w-100"
                          src="./Universidad.jpg" height="300"
                          alt="Second slide"
                        />
                      </Carousel.Item>
                      <Carousel.Item>
                        <img
                          className="d-block w-100"
                          src="./Universidad2.jpg" height="300"
                          alt="Third slide"
                        />
                      </Carousel.Item>
                    </Carousel>
                    <Card.Body align="center">
                      <small><p align="center" >
                        El sistema de juegos lúdicos de la UCM es una aplicación desarrollada con la finalidad de brindar a los estudiantes y profesores, una mejor opción para realizar sus evaluaciones.
                      </p></small>
                      <small><p align="center"><Link to={"/curso/list"}>¿Inscribirse a un Curso?</Link></p></small>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-md-4">
                  <br></br>
                  <br></br>
                  <br></br>
                  <h4>Actividades &nbsp;<small>Activas</small></h4>
                  {quiz.length > 0 ? (
                    <>
                      {quiz &&
                        quiz.map((quizs) => (
                          <>
                            {quizs.activo == true && (
                              <>
                                <Toast>
                                  <Toast.Header closeButton={false}>
                                    <img src="./UCM.png" width="20px" className="rounded mr-0" />
                                    <strong className="mr-auto">-{quizs.titulo}</strong>
                                    <small>{quizs.fechatermino}</small>
                                  </Toast.Header>
                                  <Toast.Body>
                                    <small><p>Descripcion: {quizs.descripcion}</p></small>
                                    <p>Ir al <Link to={"/quizcur/" + quizs.cursoid}>Curso</Link></p>
                                  </Toast.Body>
                                </Toast>
                              </>
                            )}
                          </>
                        ))}
                    </>
                  ) : (
                    <div align="center">
                      <br></br>
                      <br></br>
                      <img src="./estudiante-relajado.png" height="100" width="100" ></img>
                      <br></br>
                      <h6>Sin Actividades</h6>
                    </div>
                  )}
                </div>
              </div>

              <br></br>
              <hr></hr>
              <br></br>

              <div id="footer">
                <div class="container text-center">
                  <p class="text-muted credit">© {currentDateTime} Copyright:  Universidad Catolica del Maule - UCM</p>
                </div>
              </div>
            </div>
          </div>

        ) : (
          <div className="list row">
            <div className="col-md-6">
              <br></br>
              <br></br>
              <div class="center">
                <div align="center">
                  <img src="./Logo-ucm2.jpg" height="80" width="230" ></img></div>
                <br></br>
                <div class="row justify-content-center">
                  <div class="col-xl-8 col-lg-9">
                    <Form
                      onSubmit={this.handleLogin}
                      ref={c => {
                        this.form = c;
                      }}
                    >
                      <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <Input
                          type="text"
                          className="form-control"
                          name="username"
                          value={this.state.username}
                          onChange={this.onChangeUsername}
                          validations={[required]}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <Input
                          type="password"
                          className="form-control"
                          name="password"
                          value={this.state.password}
                          onChange={this.onChangePassword}
                          validations={[required]}
                        />
                      </div>

                      <div className="form-group">
                        <button
                          className="btn btn-primary btn-block"
                          disabled={this.state.loading}
                        >
                          {this.state.loading && (
                            <span className="spinner-border spinner-border-sm"></span>
                          )}
                          <span>Login</span>
                        </button>
                      </div>

                      {this.state.message && (
                        <div className="form-group">
                          <div className="alert alert-danger" role="alert">
                            {this.state.message}
                          </div>
                        </div>
                      )}
                      <CheckButton
                        style={{ display: "none" }}
                        ref={c => {
                          this.checkBtn = c;
                        }}
                      />
                    </Form>
                  </div>
                </div>

                <p class="small text-center">¿Nuevo Usuario? <a href="/register">¡Crea tu Cuenta!</a></p>
              </div>
            </div>

            <div className="col-md-6">
              <br></br>
              <div>
                <Card>
                  <Carousel>
                    <Carousel.Item>
                      <img
                        className="d-block w-100"
                        src="./Logo-ucm.png" height="250"
                        alt="First slide"
                      />
                    </Carousel.Item>
                    <Carousel.Item>
                      <img
                        className="d-block w-100"
                        src="./Universidad.jpg" height="250"
                        alt="Second slide"
                      />
                    </Carousel.Item>
                    <Carousel.Item>
                      <img
                        className="d-block w-100"
                        src="./Universidad2.jpg" height="250"
                        alt="Third slide"
                      />
                    </Carousel.Item>
                  </Carousel>
                  <Card.Body align="center">
                    <small>
                      El sistema de juegos lúdicos de la UCM es una aplicación desarrollada con la finalidad de brindar a los estudiantes y profesores, una mejor opción para realizar sus evaluaciones.
                    </small>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>
        )}
      </body>

    );
  }
}