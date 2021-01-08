import React, { Component } from "react";
import PreguntaDataService from "../../services/pregunta.service";
import QuizDataService from "../../services/quiz.service";
import { Link } from "react-router-dom";

export default class QuizPreList extends Component {
  constructor(props) {
    super(props);
    this.retrieveOpcions = this.retrieveOpcions.bind(this);
    this.refreshList = this.refreshList.bind(this);

    this.state = {
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
      preguntas: []
    };
  }

  componentDidMount() {
    this.retrieveOpcions();
    this.getQuiz(this.props.match.params.id);
  }

  retrieveOpcions() {
    PreguntaDataService.getAll()
      .then(response => {
        this.setState({
          preguntas: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveOpcions();
    this.setState({
    });
  }

  getQuiz(id) {
    QuizDataService.get(id)
      .then(response => {
        this.setState({
          currentQuiz: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { preguntas, currentQuiz } = this.state;

    return (
      <div className="list row">
        <div className="col-md-6">
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
                <strong>Tiempo Disponible:</strong>
              </label>{" "}
              {currentQuiz.tiempodisponible}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <h4>Preguntas List</h4>

          <Link
            to={"/pregunta/add"}
            className="badge badge-blue"
          >
            Agregar
          </Link>

          <ul className="list-group">
            {preguntas &&
              preguntas.map((pregunta, index) => (
                <li
                  className="list-group-item ">
                  {pregunta.titulo}
                </li>
              ))}
          </ul>

        </div>
      </div>
    );
  }
}