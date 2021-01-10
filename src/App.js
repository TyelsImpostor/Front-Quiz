import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

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

import QuizPreList from "./components/quizpre/quizpre-list.component";

import PreRecur from "./components/prerecur/add-prerecur.component";

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
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <a href="/" className="navbar-brand">
            <img src="./logo-UCM.png" width="150" height="50" />
          </a>
          <div className="navbar-nav mr-auto">

            {showModeratorBoard && (
              <li className="nav-item">
                <Link to={"/mod"} className="nav-link">
                  Moderator Board
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link to={"/file/add"} className="nav-link">
                Upload Files
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/pregunta/list"} className="nav-link">
                Preguntas
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/quiz/list"} className="nav-link">
                Quiz
              </Link>
            </li>

            {showTeacherBoard && (
              <li className="nav-item">
                <Link to={"/teacher"} className="nav-link">
                  Teacher Board
                </Link>
              </li>
            )}

            {currentUser && (
              <li className="nav-item">
                <Link to={"/user"} className="nav-link">
                  User
                </Link>
              </li>
            )}

            {showModeratorBoard && (
              <li className="nav-item">
                <Link to={"/users"} className="nav-link">
                  Users
              </Link>
              </li>
            )}

            {showModeratorBoard && (
              <li className="nav-item">
                <Link to={"/add"} className="nav-link">
                  Add
              </Link>
              </li>
            )}

          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/login"} className="nav-link">
                    Login
                </Link>
                </li>

                <li className="nav-item">
                  <Link to={"/register"} className="nav-link">
                    Sign Up
                </Link>
                </li>
              </div>
            )}
        </nav>

        <div className="container mt-3">
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

            <Route exact path="/pregunta/add" component={Pregunta} />
            <Route exact path="/pregunta/list" component={PreguntaList} />
            <Route exact path="/pregunta/:id" component={PreguntaView} />

            <Route exact path="/pregunta/opcion/add/:id" component={Opcion} />
            <Route exact path="/pregunta/opcion/list/:id" component={OpcionList} />
            <Route exact path="/opcion/:id" component={OpcionView} />

            <Route exact path="/quiz/add" component={Quiz} />
            <Route exact path="/quiz/list" component={QuizList} />
            <Route exact path="/quiz/:id" component={QuizView} />

            <Route exact path="/quiz/pregunta/list/:id" component={QuizPreList} />

            <Route exact path="/prerecur/add/:id" component={PreRecur} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
