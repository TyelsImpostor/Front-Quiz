import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { striped, bordered, hover, Table, Button, Text, View , Overview, Modal, 
  InputGroup, FormControl, Form, Col, Jumbotron, Container, Badge, Row, OverlayTrigger, Overlay, Tooltip} from 'react-bootstrap';
import AuthService from "./services/auth.service";

import Login from "./components/auth/login.component";
import Register from "./components/auth/register.component";
import Profile from "./components/auth/profile.component";

import Home from "./components/home.component";

import BoardUser from "./components/board/board-user.component";
import BoardModerator from "./components/board/board-moderator.component";
import BoardAdmin from "./components/board/board-teacher.component";

import AddUser from "./components/user/add-user.component";
import UsersList from "./components/user/users-list.component";

import UploadFiles from "./components/recurso/add-recurso.component";
import FilesList from "./components/recurso/recurso-list.component";

import Pregunta from "./components/pregunta/add-pregunta.component";
import PreguntaList from "./components/pregunta/pregunta-list.component";
import PreguntaView from "./components/pregunta/pregunta.component";

import Opcion from "./components/opcion/add-opcion.component";
import OpcionList from "./components/opcion/opcion-list.component";
import OpcionView from "./components/opcion/opcion.component";

import Quiz from "./components/quiz/add-quiz.component";
import QuizList from "./components/quiz/quiz-list.component";
import QuizView from "./components/quiz/quiz.component";
import RespuestaQuiz from "./components/quiz/respuesta-pregunta-list.component";

import QuizPreList from "./components/quizpre/quizpre-list.component";

import PreRecur from "./components/prerecur/add-prerecur.component";

import Chart from "./components/chart/chart.component";

import Tag from "./components/tag/add-tag.component";

import PreguntaList2 from "./components/respuesta/pregunta-list2.component";
import Respuesta from "./components/respuesta/add-respuesta.component";

import Retroalimentacion from "./components/retroalimentacion/add-retroalimentacion.component";

import Profe from "./components/pregunta/pregunta.component";

import Ramo from "./components/ramo/add-ramo.component";
import RamoList from "./components/ramo/ramo-list.component";
import RamoView from "./components/ramo/ramo.component";

import Carrera from "./components/carrera/add-carrera.component";
import CarreraList from "./components/carrera/carrera-list.component";
import CarreraView from "./components/carrera/carrera.component";

import Curso from "./components/curso/add-curso.component";
import MisCursos from "./components/curso/miscursos.component";
import CursoView from "./components/curso/curso.component";
import CursoList from "./components/curso/curso-list.component";

import QuizCurList from "./components/quizcur/quizcur-list.component";

import UsuQuiz from "./components/usuquiz/usuquiz.component";

import QuizdelCurso from "./components/quiz/quizdelcurso.component";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.roles.includes("moderator"),
        showTeacherBoard: user.roles.includes("teacher"),
      });
    }
  }

  logOut() {
    AuthService.logout();
  }

  render() {
    const { currentUser, showModeratorBoard, showTeacherBoard } = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-primary">
          <a href="/" className="navbar-brand">
            <img src="./logo-UCM.png" width="150" height="50" />
          </a>
          <div className="navbar-nav mr-auto">

            {showModeratorBoard && (
              <li className="nav-item">
                <Link to={"/mod"} className="nav-link text-light">
                  Moderator Board
                </Link>
              </li>
            )}
            {showModeratorBoard && (
              <li className="nav-item">
                <Link to={"/file/add"} className="nav-link text-light">
                  Upload Files
                </Link>
              </li>
            )}
            {showModeratorBoard && (
              <li className="nav-item">
                <Link to={"/pregunta/list"} className="nav-link text-light">
                  Preguntas
                </Link>
              </li>
            )}
            {showModeratorBoard && (
              <li className="nav-item">
                <Link to={"/quiz/list"} className="nav-link text-light">
                  Quiz
                </Link>
              </li>
              )}
            {showModeratorBoard && (
              <li className="nav-item">
              <Link to={"/chart"} className="nav-link text-light">
                Chart
              </Link>
            </li>
            )}
            {showModeratorBoard && (
            <li className="nav-item">
              <Link to={"/respuesta/list"} className="nav-link text-light">
                Responder preguntas
              </Link>
            </li>
            )}
            {showModeratorBoard && (
            <li className="nav-item">
              <Link to={"/pregunta/Profe"} className="nav-link text-light">
                Profe
              </Link>
            </li>
            )}


            {showTeacherBoard && (
              <li className="nav-item">
                <Link to={"/teacher"} className="nav-link text-light">
                  Teacher Board
                </Link>
              </li>
            )}

            {/* {currentUser && (
              <li className="nav-item">
                <Link to={"/user"} className="nav-link text-light">
                  User
                </Link>
              </li>
            )} */}


            {showModeratorBoard && (
              <li className="nav-item">
                <Link to={"/users"} className="nav-link text-light">
                  Users
              </Link>
              </li>
            )}

            {showModeratorBoard && (
              <li className="nav-item">
                <Link to={"/add"} className="nav-link text-light">
                  Add
              </Link>
              </li>
            )}

            {showModeratorBoard && (
              <li className="nav-item">
                <Link to={"/tag"} className="nav-link text-light">
                  Tag
              </Link>
              </li>
            )}          
            {showModeratorBoard && (
              <>
                <li className="nav-item">
                  <Link to={"/miscursos"} className="nav-link text-light">
                    Todos los Cursos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/ramo/list"} className="nav-link text-light">
                    Ramos
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to={"/carrera/list"} className="nav-link text-light">
                    Carreras
                  </Link>
                </li>
              </>
            )}  
            {currentUser && (
              <>
              <li className="nav-item">
                <Link to={"/miscursos/"} className="nav-link text-light">
                  Mis Cursos
                </Link>
              </li>
              <li className="nav-item">
                  <Link to={"/curso/list/"} className="nav-link text-light">
                    Todos los Cursos
                  </Link>
                </li>
              </>
            )}


          </div>
      
{/* 
          {!(currentUser) && (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/login"} className="nav-link text-light">
                    Login
                </Link>
                </li>

                <li className="nav-item">
                  <Link to={"/register"} className="nav-link text-light">
                    Sign Up
                </Link>
                </li>
              </div>
            )} */}

          {(currentUser) && (
            <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/profile"} className="nav-link text-light">
                    {currentUser.username}
                  </Link>
                </li>
                <li className="nav-item">
                  <a href="http://localhost:8081/" className="nav-link text-light" onClick={this.logOut}>
                    Cerrar Sesión
                  </a>
                </li>
              </div>
          )}

        </nav>

        <div className="container-fluid">
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />

            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />

            <Route exact path="/user" component={BoardUser} />
            <Route exact path="/mod" component={BoardModerator} />
            <Route exact path="/teacher" component={BoardAdmin} />

            <Route exact path={["/", "/users"]} component={UsersList} />
            <Route exact path="/add" component={AddUser} />

            <Route exact path="/file/add" component={UploadFiles} />
            <Route exact path="/file/list" component={FilesList} />

            <Route exact path="/pregunta/add/:id" component={Pregunta} />
            <Route exact path="/pregunta/list" component={PreguntaList} />
            <Route exact path="/pregunta/:id" component={PreguntaView} />

            <Route exact path="/pregunta/opcion/add/:id" component={Opcion} />
            <Route exact path="/pregunta/opcion/list/:id" component={OpcionList} />
            <Route exact path="/opcion/:id" component={OpcionView} />

            <Route exact path="/quiz/add" component={Quiz} />
            <Route exact path="/quiz/list" component={QuizList} />
            <Route exact path="/quiz/:id" component={QuizView} />
            <Route exact path="/respuesta/pregunta/list/:id" component={RespuestaQuiz} />

            <Route exact path="/quiz/pregunta/list/:id" component={QuizPreList} />

            <Route exact path="/prerecur/add/:id" component={PreRecur} />

            <Route exact path="/chart" component={Chart} />

            <Route exact path="/tag" component={Tag} />

            <Route exact path="/respuesta/list" component={PreguntaList2} />
            <Route exact path="/respuesta/:id" component={Respuesta} />

            <Route exact path="/retroalimentacion/add/:id" component={Retroalimentacion} />


            <Route exact path="/pregunta/list" component={PreguntaList} />

            <Route exact path="/ramo/add" component={Ramo} />
            <Route exact path="/ramo/list" component={RamoList} />
            <Route exact path="/ramo/:id" component={RamoView} />

            <Route exact path="/carrera/add" component={Carrera} />
            <Route exact path="/carrera/list" component={CarreraList} />
            <Route exact path="/carrera/:id" component={CarreraView} />

            <Route exact path="/curso/add/:id" component={Curso} />
            <Route exact path="/curso/list/" component={CursoList} />
            <Route exact path="/curso/:id" component={CursoView} />

            <Route exact path="/quizcur/:id" component={QuizCurList} />

            <Route exact path="/usuquiz/:id" component={UsuQuiz} />

            <Route exact path="/miscursos/" component={MisCursos} />



            <Route exact path="/pregunta/profe" component={Profe} />
            
          </Switch>
        </div>
        <footer class="fixed-bottom position-sticky mx-auto fixed-bottom p-3 bg-primary text-white" align="center">

                <p>
                  Sistema de Quiz UCM
                </p>                 

        </footer>
      </div>
    );
  }
}

export default App;
