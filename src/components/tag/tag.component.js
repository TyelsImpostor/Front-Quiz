import React, { Component } from "react";
import TagDataService from "../../services/tag.service";
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";
import {
  Table, Alert, Button, Modal, Form, Col, Row, OverlayTrigger, Tooltip, Nav, Tab, Card, Accordion, Tabs, Pagination
} from 'react-bootstrap';

export default class Carrera extends Component {
  constructor(props) {
    super(props);
    this.onChangeMalla = this.onChangeMalla.bind(this);
    this.getTag = this.getTag.bind(this);
    this.updateTag = this.updateTag.bind(this);

    this.state = {
      currentTag: {
        id: null,
        nombre: ""

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
    this.getTag(this.props.match.params.id);
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
        currentTag: {
          ...prevState.currentTag,
          nombre: e.target.value
        }
      };
    });
    await this.handleVerificar();
  }
  async handleVerificar() {
    if ((3 > this.state.currentTag.nombre.length && this.state.currentTag.nombre.length > 0)
    ) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo debe tener un minimo de caracteres.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "warning"
      })
    } else if (this.state.currentTag.nombre.length == 0) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo 'Nombre' no puede estar vacío.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "danger"
      })
    } else if (this.state.currentTag.nombre.length > 100) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo 'Nombre' no puede tener tantos caracteres.",
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
  getTag(id) {
    TagDataService.get(id)
      .then(response => {
        this.setState({
          currentTag: response.data
        });
        //console.log(response.data);
      })
      .catch(e => {
        //console.log(e);
      });
  }

  updateTag() {
    TagDataService.update(
      this.state.currentTag.id,
      this.state.currentTag
    )
      .then(response => {
        //console.log(response.data);
        this.props.history.push('/tag')
        this.setState({
          message: "The carrera was updated successfully!"
        });
      })
      .catch(e => {
        //console.log(e);
      });
  }

  render() {
    const { currentTag, currentUser, showUserBoard, showModeratorBoard, showTeacherBoard } = this.state;

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
            <div>
              {currentTag ? (
                <div className="edit-form">
                  <h4>Editar Tag</h4>
                  <form>
                    <div className="form-group">
                      <label htmlFor="nombre">Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        value={currentTag.nombre}
                        onChange={this.onChangeMalla}
                      />
                    </div>
                  </form>

                  <button className="badge badge-warning mr-2" disabled={this.state.visualRamoEdit} onClick={this.updateTag}>
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
          ))}

          {showUserBoard && (
            <h3>Usted no tiene el permiso para acceder a esta zona.</h3>
          )}
        </header>
      </div>
    );
  }
}