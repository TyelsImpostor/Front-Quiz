import React, { Component } from "react";
import TagDataService from "../../services/tag.service";
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";

import {
  Button, Modal, Nav, Tab, Card, ListGroup, Table, Accordion, OverlayTrigger, Tooltip, Pagination
} from 'react-bootstrap';

export default class TagList extends Component {
  constructor(props) {
    super(props);
    this.retrieveTags = this.retrieveTags.bind(this);
    this.setActiveUser = this.setActiveUser.bind(this);
    this.searchNombre = this.searchNombre.bind(this);

    this.state = {
      tags: [],
      currentTag: null,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser2: undefined,
      currentIndex: -1,
      visibleeliminar: false,
      deleteid: "",
      searchNombre: "",

      //--------PAGINACION------------
      postsPerPage: 5,
      //--------------
      paginacionTag: [],
      listapaginacionTag: [],
      paginateTag: 1,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser2: user,
        showUserBoard: user.roles.includes("user"),
        showModeratorBoard: user.roles.includes("moderator"),
        showTeacherBoard: user.roles.includes("teacher"),
      });
    }
    this.retrieveTags();
  }

  async retrieveTags() {
    await TagDataService.getAll()
      .then(response => {
        this.setState({
          tags: response.data
        });
        //console.log(response.data);
      })
      .catch(e => {
        //console.log(e);
      });

    const respuesta = await this.retrieveFiltroPorPagina(this.state.tags);
    await this.setState({
      listapaginacionTag: respuesta[0],
      paginacionTag: respuesta[1]
    })
  }

  setActiveUser(tag, index) {
    this.setState({
      currentTag: tag,
      currentIndex: index
    });
  }

  async deleteTag(id) {
    await TagDataService.delete(id)
      .then(response => {
        //console.log(response.data);
        this.setState({
          visibleeliminar: false,
        });
      })
      .catch(e => {
        //console.log(e);
      })
    await this.retrieveTags();
  }

  closeModaleliminar() {
    this.setState({
      visibleeliminar: false,
      deleteid: "",
    });
  }
  openModaleliminar(id) {
    this.setState({
      visibleeliminar: true,
      deleteid: id,
    });
  }

  async searchNombre(e) {
    const searchNombre = await e.target.value;

    this.setState({
      searchNombre: searchNombre
    });
    await TagDataService.findByNombre(this.state.searchNombre)
      .then(response => {
        this.setState({
          tags: response.data
        });
      })
      .catch(e => {
        //console.log(e);
      });
    // await this.refreshFiltroPorPagina(1, this.state.ramos, "ramo")
    const listaRamos = await this.state.tags.slice();
    const respuesta = await this.retrieveFiltroPorPagina(listaRamos);
    await this.setState({
      listapaginacionTag: respuesta[0],
      paginacionTag: respuesta[1]
    })
  }

  //================================================
  //==================PAGINACION====================
  async retrieveFiltroPorPagina(listaporpaginar) {
    const listapageNumbers = [];
    for (let i = 1; i <= Math.ceil(listaporpaginar.length / this.state.postsPerPage); i++) {
      listapageNumbers.push(i);
    };
    const indexOfLastPost = 1 * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
    const currentPosts = listaporpaginar.slice(indexOfFirstPost, indexOfLastPost);

    return [currentPosts, listapageNumbers];
  }
  //-------------------------------------------------

  async refreshFiltroPorPagina(pag, lista, tipo) {
    const indexOfLastPost = pag * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
    const currentPosts = lista.slice(indexOfFirstPost, indexOfLastPost);

    if (tipo == "tag") {
      this.setState({
        listapaginacionTag: currentPosts,
        paginateTag: pag
      });
    }
  }

  render() {
    const { currentUser2, showUserBoard, showModeratorBoard, showTeacherBoard, tags, currentTag, currentIndex, deleteid, query, paginacionTag, listapaginacionTag, paginateTag } = this.state;

    return (
      <div>
        <header>
          {currentUser2 ? (
            <h3></h3>
          ) : (
            <div>
              <h3 class="text-muted">Debes iniciar sesión</h3>
              <Link to={"/login"}>
                Inicia Sesión
              </Link>
            </div>
          )}

          {showTeacherBoard || (showUserBoard && (
            <div className="container">
              <header className="jumbotron">
                <h3>Usted no tiene el permiso para acceder a esta zona.</h3>
              </header>
            </div>
          ))}

          {showModeratorBoard && (
            <div>
              <div class="img-center">
                <h2 class="center">Panel de Tags</h2>
                <p>
                  Regista o elimina los tags dentro del sistema.
                </p>
              </div>

              <div className="list row">

                <div className="col-md-7">
                  <div align="center">
                    <img src="../../../tag.png" width="400" height="350" />
                  </div>
                </div>

                <div className="col-md-5">
                  <br></br>
                  <Table striped bordered hover>
                    <h3 class="img-center">Preguntas Frecuentes</h3>
                    <Accordion defaultActiveKey="0">
                      <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                          ¿De qué me sirve esta interfaz?
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>En esta interfaz, podrás crear nuevos tags que podrás vincular a tus preguntas y quiz, también podrás eliminar los tags que consideres no necesarios.</Card.Body>
                      </Accordion.Collapse>
                      <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                          Cuidado al eliminar a un Tag
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="1">
                        <Card.Body>Muchas de las preguntas y quiz usan los tags para buscar más rápido, al eliminar un tag, esa facilidad no estará disponible.</Card.Body>
                      </Accordion.Collapse>
                    </Accordion>
                  </Table>
                </div>
              </div>

              <br></br>
              <br></br>
              <Nav className="justify-content-end">
                <Nav.Item>
                  <Button
                    href="/tag/add">
                    Nuevo Tag
                  </Button>
                </Nav.Item>
              </Nav>
              <hr></hr>
              <br></br>

              <div center>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar"
                    value={this.props.query}
                    onChange={this.searchNombre}
                  ></input>
                </div>
              </div>

              <div className="list row">
                <div className="col-md-6">
                  <h4>Listado de Tags</h4>

                  <ul className="list-group">
                    {listapaginacionTag &&
                      listapaginacionTag.map((tag, index) => (
                        <li
                          className={
                            "list-group-item " +
                            (index === currentIndex ? "active" : "")
                          }
                          onClick={() => this.setActiveUser(tag, index)}
                          key={index}
                        >
                          {tag.nombre}
                        </li>
                      ))}
                  </ul>
                  <br></br>
                  {paginacionTag.length > 1 && (
                    <nav>
                      <Pagination>
                        {paginacionTag.map(number => (
                          <Pagination.Item key={number} active={paginateTag == number} onClick={() => this.refreshFiltroPorPagina(number, tags, "tag")} >
                            {number}
                          </Pagination.Item>
                        ))}
                      </Pagination>
                    </nav>
                  )}
                </div>

                <div className="col-md-6">
                  {currentTag ? (
                    <div>
                      <h4>Tag</h4>
                      <div>
                        <label>
                          <strong>Id:</strong>
                        </label>{" "}
                        {currentTag.id}
                      </div>
                      <div>
                        <label>
                          <strong>Nombre:</strong>
                        </label>{" "}
                        {currentTag.nombre}
                      </div>
                      <button
                        className="badge badge-danger mr-2"
                        onClick={() => this.openModaleliminar(currentTag.id)}
                      >
                        Borrar
                      </button>

                      <Link
                        to={"/tag/" + currentTag.id}
                        className="badge badge-warning"
                      >
                        Editar
                      </Link>
                    </div>
                  ) : (
                    <div>
                      <br />
                      <p>Selecciona a un tag</p>
                    </div>
                  )}
                </div>
              </div>

              <br></br>

              <Modal show={this.state.visibleeliminar} width="1000" height="500" effect="fadeInUp" onClickAway={() => this.closeModaleliminar()}>
                <Modal.Header>
                  <Modal.Title align="center">¿Deséa eliminar?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                  <button className="btn btn-warning" onClick={() => this.closeModaleliminar()}>
                    Close
                  </button>
                  <button className="btn btn-success" onClick={() => this.deleteTag(deleteid)}>
                    Eliminar
                  </button>
                </Modal.Footer>
              </Modal>
            </div>
          )}

        </header>
      </div>
    );
  }
}