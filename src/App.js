import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import PerfilService from "./services/perfil.sevice";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Avatar from '@material-ui/core/Avatar';

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
import TagList from "./components/tag/tag-list.component";
import TagView from "./components/tag/tag.component";

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

import Example from "./components/example/example";
import Example2 from "./components/example/example2";
import Example3 from "./components/example/example3";
import ExampleVideo from "./components/example/examplevideo";

import Example6 from "./components/example/example6";

import { Dropdown } from 'react-bootstrap';


class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
      perfilid: ""
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
    this.Imagen();
  }

  logOut() {
    AuthService.logout();
  }

  Imagen() {
    PerfilService.getAll()
      .then(response => {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].user == this.state.currentUser.id) {
            if (response.data[i].activo == true) {
              this.setState({ perfilid: response.data[i].id });
            }
          }
        }
      })
      .catch(e => {
        //console.log(e);
      });
  }

  render() {
    const { currentUser, showModeratorBoard, showTeacherBoard, perfilid } = this.state;

    return (
      <div>
        {/* className="navbar navbar-expand navbar-dark " */}
        <nav className="navbar navbar-expand navbar-dark bg-primary" >
          <a href="/" className="navbar-brand">
            <img src={"https://spring-boot-back.herokuapp.com/api/perfils/resource/60ebcfc0ea07c80a2be54d3a"} width="150" height="50" />
          </a>
          <div className="navbar-nav mr-auto">

            {currentUser && (
              <>
                <li className="nav-item">
                  <Link to={"/miscursos/"} className="nav-link text-light">
                    Mis Cursos
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to={"/respuesta/list"} className="nav-link text-light">
                    Quick-Test
                  </Link>
                </li>

                {/*
                <li className="nav-item">
                  <Link to={"/example"} className="nav-link text-light">
                    Prueba
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/example2"} className="nav-link text-light">
                    Prueba2
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/example3"} className="nav-link text-light">
                    Prueba3
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/examplevideo"} className="nav-link text-light">
                    Example Video
                  </Link>
                </li>
                */}
              </>
            )}

            {showModeratorBoard && (
              <>
                <Dropdown>
                  <Dropdown.Toggle className="nav-link text-light" id="dropdown-basic">
                    Panel de Control
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item href={"/controlramo&carrera"}>Control de Ramos y Carrera</Dropdown.Item>
                    <Dropdown.Item href={"/admincontrol"}>Control de Preguntas y Quiz</Dropdown.Item>
                    <Dropdown.Item href={"/tag"}>Control de Tag</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <li className="nav-item">
                  <Link to={"/users"} className="nav-link text-light">
                    Panel de Usuarios
                  </Link>
                </li>
              </>
            )}
          </div>

          {(currentUser) && (
            <div className="navbar-nav ml-auto">

              <div className="list row">

                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <div className="col-md-3">
                  <li className="nav-item">
                    <Avatar src={"https://spring-boot-back.herokuapp.com/api/perfils/resource/" + perfilid} />
                  </li>
                </div>

                <div className="col-md-1">
                  <li className="nav-item">
                    <Link to={"/profile"} className="nav-link text-light">
                      {currentUser.username}
                    </Link>
                  </li>
                </div>
              </div>
              <li className="nav-item">
                <a href="http://localhost:8081/" className="nav-link text-light" onClick={this.logOut}>
                  Cerrar Sesión
                </a>
              </li>
            </div>
          )}

          {currentUser ? (
            <div></div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link text-light">
                  Iniciar Sesion
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link text-light">
                  Registrar
                </Link>
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
            <Route exact path="/user/add" component={AddUser} />

            <Route exact path="/file/add" component={UploadFiles} />
            <Route exact path="/file/list" component={FilesList} />

            <Route exact path="/pregunta/add/:id" component={Pregunta} />
            <Route exact path="/admincontrol" component={PreguntaList} />
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

            <Route exact path="/tag/add" component={Tag} />
            <Route exact path="/tag" component={TagList} />
            <Route exact path="/tag/:id" component={TagView} />

            <Route exact path="/respuesta/list" component={PreguntaList2} />
            <Route exact path="/respuesta/:id" component={Respuesta} />

            <Route exact path="/retroalimentacion/add/:id" component={Retroalimentacion} />

            <Route exact path="/ramo/add" component={Ramo} />
            <Route exact path="/controlramo&carrera" component={RamoList} />
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

            <Route exact path="/example" component={Example} />

            <Route exact path="/example2" component={Example2} />

            <Route exact path="/example3" component={Example3} />

            <Route exact path="/examplevideo" component={ExampleVideo} />
            <Route exact path="/example6" component={Example6} />


          </Switch>
        </div>
        <br />
        <br />
        <br />
        <footer align="center">
          <br />
          <div class="img-center">
            <h5 class="img-center">Sistema de Quiz UCM</h5>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;