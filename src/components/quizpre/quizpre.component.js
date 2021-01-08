import React, { Component } from "react";
import QuizPreDataService from "../../services/quizpre.service";

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
      message: ""
    };
  }

  componentDidMount() {
    this.getQuizPre(this.props.match.params.id);
  }

  onChangeQuizid(e) {
    const quizid = e.target.value;

    this.setState(function(prevState) {
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
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateQuizPre() {
    QuizPreDataService.update(
      this.state.currentQuizPre.id,
      this.state.currentQuizPre
    )
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "The preguntaid was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteQuizPre() {    
    QuizPreDataService.delete(this.state.currentQuizPre.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/preguntaid')
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { currentQuizPre } = this.state;

    return (
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
    );
  }
}