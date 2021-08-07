import React, { Component, useEffect, useState } from "react";
import RecursoDataService from "../../services/recurso.service";
import { Link } from "react-router-dom";

import {
  striped, bordered, hover, Table, Button, Text, View, Overview, Modal,
  InputGroup, FormControl, Form, Col, Jumbotron, Container, Badge, Row, OverlayTrigger, Overlay, Tooltip
} from 'react-bootstrap';
import AuthService from "../../services/auth.service";

export default class RecursosList extends Component {
  constructor(props) {
    super(props);
    this.retrieveRecursos = this.retrieveRecursos.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveRecurso = this.setActiveRecurso.bind(this);

    this.state = {
      recursos: [],
      currentRecurso: null,
      currentIndex: -1,
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined
    };
  }

  componentDidMount() {
    this.retrieveRecursos();
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

  retrieveRecursos() {
    RecursoDataService.getAll()
      .then(response => {
        this.setState({
          recursos: response.data
        });
        //console.log(response.data);
      })
      .catch(e => {
        //console.log(e);
      });
  }

  refreshList() {
    this.retrieveRecursos();
    this.setState({
      currentRecurso: null,
      currentIndex: -1
    });
  }

  setActiveRecurso(recurso, index) {
    this.setState({
      currentRecurso: recurso,
      currentIndex: index
    });
  }

  render() {
    const { recursos, currentRecurso, currentIndex, currentUser, showUserBoard, showModeratorBoard, showTeacherBoard } = this.state;

    return (
      <div className="container-fluid">
        <div>
          <Jumbotron>
            <title >Lista de Recursos</title>
          </Jumbotron>
        </div>
        <header className="jumbotron">
          {currentUser ? (
            <p></p>
          ) : (
            <div>
              <h3 class="text-muted">Debes iniciar sesión</h3>
              <Link to={"/login"}>
                Inicia Sesión
                </Link>
            </div>
          )}
          {(showTeacherBoard || showModeratorBoard) && (
            <div className="list row">
              {recursos && recursos.map((recurso, index) => (
                <div class="col-md-2 mb-5 col-lg-2 col-md-3 col-sm-6 col-xs-12">
                  <div class="card h-100">

                    {recurso.type == "documento" && (
                      <img src="https://image.flaticon.com/icons/png/512/32/32329.png" width="auto" height="200"></img>

                    )}
                    {recurso.type == "link" && (
                      <iframe src={"https://www.youtube.com/embed/" + recurso.link + "?autoplay=1&loop=1"} width="auto" height="200"></iframe>
                    )}
                    {recurso.type == "imagen" && (
                      <img src={"https://spring-boot-back.herokuapp.com/api/recursos/" + recurso.id} width="auto" height="200"></img>
                    )}


                    <div class="card-body">
                      <h4 class="card-title">
                        {recurso.title}
                      </h4>
                      <p class="card-text">{recurso.type}</p>
                    </div>
                    <div class="card-footer">
                      <a href="#" class="btn btn-primary">Detalles</a>
                    </div>
                  </div>
                </div>
              ))}
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