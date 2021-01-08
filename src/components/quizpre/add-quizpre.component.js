import React, { Component } from "react";
import QuizPreDataService from "../../services/quizid.service";

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

      submitted: false
    };
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
    return (
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
    );
  }
}