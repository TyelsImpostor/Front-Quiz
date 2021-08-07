import React, { Component } from "react";
import CarreraDataService from "../../services/carrera.service";
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";
import {
  Table, Alert, Button, Modal, Form, Col, Row, OverlayTrigger, Tooltip, Nav, Tab, Card, Accordion, Tabs, Pagination
} from 'react-bootstrap';

export default class Carrera extends Component {
  constructor(props) {
    super(props);
    this.onChangeMalla = this.onChangeMalla.bind(this);
    this.getCarrera = this.getCarrera.bind(this);
    this.updateCarrera = this.updateCarrera.bind(this);
    this.deleteCarrera = this.deleteCarrera.bind(this);

    this.state = {
      currentCarrera: {
        id: null,
        malla: ""

      },
      message: "",
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
      visualRamoEdit: true,
      showAlertEditRamo: false,
      menssageAlertEdit: "",
      typeAlertEditRamo: "",
    };
  }

  componentDidMount() {
    this.getCarrera(this.props.match.params.id);
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

  async onChangeMalla(e) {
    await this.setState(function (prevState) {
      return {
        currentCarrera: {
          ...prevState.currentCarrera,
          malla: e.target.value
        }
      };
    });
    await this.handleVerificar();
  }
  async handleVerificar() {
    if ((3 > this.state.currentCarrera.malla.length && this.state.currentCarrera.malla.length > 0)
    ) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo debe tener un minimo de caracteres.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "warning"
      })
    } else if (this.state.currentCarrera.malla.length == 0) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo 'Malla' no puede estar vacío.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "danger"
      })
    } else if (this.state.currentCarrera.malla.length > 100) {
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
  getCarrera(id) {
    CarreraDataService.get(id)
      .then(response => {
        this.setState({
          currentCarrera: response.data
        });
        //console.log(response.data);
      })
      .catch(e => {
        //console.log(e);
      });
  }

  updateCarrera() {
    CarreraDataService.update(
      this.state.currentCarrera.id,
      this.state.currentCarrera
    )
      .then(response => {
        //console.log(response.data);
        this.setState({
          message: "The carrera was updated successfully!"
        });
      })
      .catch(e => {
        //console.log(e);
      });
  }

  deleteCarrera() {
    CarreraDataService.delete(this.state.currentCarrera.id)
      .then(response => {
        //console.log(response.data);
        this.props.history.push('/controlramo&carrera')
      })
      .catch(e => {
        //console.log(e);
      });
  }

  render() {
    const { currentCarrera, currentUser, showUserBoard, showModeratorBoard, showTeacherBoard } = this.state;

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
              {currentCarrera ? (
                <div className="edit-form">
                  <h4>Editar Carrera</h4>
                  <form>
                    <div className="form-group">
                      <label htmlFor="malla">Malla</label>
                      <input
                        type="text"
                        className="form-control"
                        id="malla"
                        value={currentCarrera.malla}
                        onChange={this.onChangeMalla}
                      />
                    </div>
                  </form>

                  <button
                    className="badge badge-danger mr-2"
                    onClick={this.deleteCarrera}
                  >
                    Borrar
                  </button>

                  <button className="badge badge-warning mr-2" disabled={this.state.visualRamoEdit} onClick={this.updateCarrera}>
                    Actualizar
                  </button>

                  <Alert show={this.state.showAlertEditRamo} variant={this.state.typeAlertEditRamo}>
                    {this.state.menssageAlertEdit}
                  </Alert>

                  <p>{this.state.message}</p>
                </div>
              ) : (
                <div>
                  <br />
                  <p>Please click on a Carrera...</p>
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