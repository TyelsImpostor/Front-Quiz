import React, { Component } from "react";
import QuizDataService from "../../services/quiz.service";
import { Link } from "react-router-dom";

export default class QuizsList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchTitulo = this.onChangeSearchTitulo.bind(this);
    this.retrieveQuizs = this.retrieveQuizs.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveQuiz = this.setActiveQuiz.bind(this);
    this.searchTitulo = this.searchTitulo.bind(this);

    this.state = {
      quizs: [],
      currentQuiz: null,
      currentIndex: -1,
      searchTitulo: ""
    };
  }

  componentDidMount() {
    this.retrieveQuizs();
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

  render() {
    const { searchTitulo, quizs, currentQuiz, currentIndex } = this.state;

    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by titulo"
              value={searchTitulo}
              onChange={this.onChangeSearchTitulo}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.searchTitulo}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h4>Quizs List</h4>

          <Link
            to="/quiz/add"
            className="badge badge-blue"
          >
            Agregar
          </Link>

          <ul className="list-group">
            {quizs &&
              quizs.map((quiz, index) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActiveQuiz(quiz, index)}
                  key={index}
                >
                  {quiz.titulo}
                </li>
              ))}
          </ul>
          
        </div>
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
      </div>
    );
  }
}