import React, { Component } from "react";
import CarreraDataService from "../../services/carrera.service";
import { Link } from "react-router-dom";

import {
  Table, Alert, Button, Modal, Form, Col, Row, OverlayTrigger, Tooltip, Nav, Tab, Card, Accordion, Tabs, Pagination
} from 'react-bootstrap';
import AuthService from "../../services/auth.service";
export default class AddCarrera extends Component {
  constructor(props) {
    super(props);
    this.onChangeMalla = this.onChangeMalla.bind(this);
    this.saveCarrera = this.saveCarrera.bind(this);
    this.newCarrera = this.newCarrera.bind(this);

    this.state = {
      id: null,
      malla: "",
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,

      submitted: false,
      visualRamoEdit: true,
      showAlertEditRamo: false,
      menssageAlertEdit: "",
      typeAlertEditRamo: "",
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
  async handleVerificar() {
    if ((3 > this.state.malla.length && this.state.malla.length > 0)
    ) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo debe tener un minimo de caracteres.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "warning"
      })
    }
    else if (this.state.malla.length == 0) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo 'Malla' no puede estar vacío.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "danger"
      })
    } else if (this.state.malla.length > 100) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo 'Malla' no puede tener tantos caracteres.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "danger"
      })
    } else {
      this.setState({
        menssageAlertEdit: "",
        showAlertEditRamo: false,
        typeAlertEditRamo: "",
        visualRamoEdit: false,
      })
    }

  }
  async onChangeMalla(e) {
    await this.setState({
      malla: e.target.value
    });
    await this.handleVerificar();

  }

  saveCarrera() {
    var data = {
      malla: this.state.malla
    };

    CarreraDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          malla: response.data.malla,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newCarrera() {
    this.setState({
      id: null,
      malla: "",

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
                  <button className="btn btn-success" onClick={this.newCarrera}>
                    Add
                  </button>
                </div>
              ) : (
                <div>
                  <div className="form-group">
                    <label htmlFor="malla">Malla</label>
                    <input
                      type="text"
                      className="form-control"
                      id="malla"
                      required
                      value={this.state.malla}
                      onChange={this.onChangeMalla}
                      name="malla"
                    />
                  </div>

                  <Button variant="primary" disabled={this.state.visualRamoEdit} onClick={this.saveCarrera}>
                    Crear
                  </Button>

                  <Alert show={this.state.showAlertEditRamo} variant={this.state.typeAlertEditRamo}>
                    {this.state.menssageAlertEdit}
                  </Alert>
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