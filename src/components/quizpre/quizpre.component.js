import React, { Component } from "react";
import QuizPreDataService from "../../services/quizpre.service";
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";

export default class QuizPre extends Component {
  constructor(props) {
    super(props);
    this.onChangeQuizid = this.onChangeQuizid.bind(this);
    this.onChangePreguntaid = this.onChangePreguntaid.bind(this);
    this.getQuizPre = this.getQuizPre.bind(this);
    this.updateCoincide = this.updateCoincide.bind(this);
    this.updateQuizPre = this.updateQuizPre.bind(this);
    this.deleteQuizPre = this.deleteQuizPre.bind(this);

    this.state = {
      currentQuizPre: {
        id: null,
        quizid: "",
        preguntaid: ""
      },
      message: "",
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    this.getQuizPre(this.props.match.params.id);
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
    const quizid = e.target.value;

    this.setState(function (prevState) {
      return {
        currentQuizPre: {
          ...prevState.currentQuizPre,
          quizid: quizid
        }
      };
    });
  }

  onChangePreguntaid(e) {
    const preguntaid = e.target.value;

    this.setState(prevState => ({
      currentQuizPre: {
        ...prevState.currentQuizPre,
        preguntaid: preguntaid
      }
    }));
  }

  getQuizPre(id) {
    QuizPreDataService.get(id)
      .then(response => {
        this.setState({
          currentQuizPre: response.data
        });
        //console.log(response.data);
      })
      .catch(e => {
        //console.log(e);
      });
  }

  updateQuizPre() {
    QuizPreDataService.update(
      this.state.currentQuizPre.id,
      this.state.currentQuizPre
    )
      .then(response => {
        //console.log(response.data);
        this.setState({
          message: "The preguntaid was updated successfully!"
        });
      })
      .catch(e => {
        //console.log(e);
      });
  }

  deleteQuizPre() {
    QuizPreDataService.delete(this.state.currentQuizPre.id)
      .then(response => {
        //console.log(response.data);
        this.props.history.push('/preguntaid')
      })
      .catch(e => {
        //console.log(e);
      });
  }

  render() {
    const { currentQuizPre, currentUser, showUserBoard, showModeratorBoard, showTeacherBoard } = this.state;

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
          {(showTeacherBoard || showModeratorBoard) && (
            <div>
              {currentQuizPre ? (
                <div className="edit-form">
                  <h4>Quizid</h4>
                  <form>
                    <div className="form-group">
                      <label htmlFor="quizid">Id del Quiz</label>
                      <input
                        type="text"
                        className="form-control"
                        id="quizid"
                        value={currentQuizPre.quizid}
                        onChange={this.onChangeQuizid}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="preguntaid">Id de la Pregunta</label>
                      <input
                        type="text"
                        className="form-control"
                        id="preguntaid"
                        value={currentQuizPre.preguntaid}
                        onChange={this.onChangePreguntaid}
                      />
                    </div>

                  </form>

                  <button
                    className="badge badge-danger mr-2"
                    onClick={this.deleteQuizPre}
                  >
                    Delete
                </button>

                  <button
                    type="submit"
                    className="badge badge-success"
                    onClick={this.updateQuizPre}
                  >
                    Update
                </button>
                  <p>{this.state.message}</p>
                </div>
              ) : (
                  <div>
                    <br />
                    <p>Please click on a QuizPre...</p>
                  </div>
                )}
            </div>
          )}

          {showUserBoard && (
            <h3>Usted no tiene el permiso para acceder a esta zona.</h3>
          )}
        </header>
      </div>
    );
  }
}