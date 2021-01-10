import React, { Component } from "react";
import QuizPreDataService from "../../services/quizid.service";
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";

export default class AddQuizPre extends Component {
  constructor(props) {
    super(props);
    this.onChangeQuizid = this.onChangeQuizid.bind(this);
    this.onChangePreguntaid = this.onChangePreguntaid.bind(this);
    this.saveQuizPre = this.saveQuizPre.bind(this);
    this.newQuizPre = this.newQuizPre.bind(this);

    this.state = {
      id: null,
      quizid: "",
      preguntaid: "",
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,

      submitted: false
    };
  }

  componentDidMount() {
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

  onChangeQuizid(e) {
    this.setState({
      quizid: e.target.value
    });
  }

  onChangePreguntaid(e) {
    this.setState({
      preguntaid: e.target.value
    });
  }

  saveQuizPre() {
    var data = {
      quizid: this.state.quizid,
      preguntaid: this.state.preguntaid
    };

    QuizPreDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          quizid: response.data.quizid,
          preguntaid: response.data.preguntaid,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newQuizPre() {
    this.setState({
      id: null,
      quizid: "",
      preguntaid: "",

      submitted: false
    });
  }

  render() {
    const { currentUser, showUserBoard, showModeratorBoard, showTeacherBoard } = this.state;

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
                  <button className="btn btn-success" onClick={this.newQuizPre}>
                    Add
                </button>
                </div>
              ) : (
                  <div>
                    <div className="form-group">
                      <label htmlFor="quizid">Quizid</label>
                      <input
                        type="text"
                        className="form-control"
                        id="quizid"
                        required
                        value={this.state.quizid}
                        onChange={this.onChangeQuizid}
                        name="quizid"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="preguntaid">Preguntaid</label>
                      <input
                        type="checkbox"
                        className="form-control"
                        id="preguntaid"
                        value="true"
                        onChange={this.onChangePreguntaid}
                        name="preguntaid">
                      </input>
                    </div>

                    <button onClick={this.saveQuizPre} className="btn btn-success">
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