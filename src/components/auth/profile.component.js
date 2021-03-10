import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../../services/auth.service";
import UserService from "../../services/user.service";
import PerfilService from "../../services/perfil.sevice";
import { Radar } from "react-chartjs-2";
import Modal from 'react-awesome-modal';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.Datos = this.Datos.bind(this);
    this.setActivePerfil = this.setActivePerfil.bind(this);
    this.updateActivo = this.updateActivo.bind(this);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { username: "" },
      respuesta: [],
      colores: [],
      data: [],
      opciones: [],
      datos: [],
      nombre: [],
      cantidad: [],
      currentPerfil: [],
      currentPerfil2: [],
      perfils: [],
      perfils2: [],
      currentRecurso: null,
      currentIndex: -1,
      currentNew: -1,
    };
  }

  openModal() {
    this.setState({
      visible: true
    });
  }

  closeModal() {
    this.setState({
      visible: false,
      currentNew: -1
    });
  }

  generarCaracter() {
    var caracter = ["a", "b", "c", "d", "e", "f", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    var numero = (Math.random() * 15).toFixed(0);
    return caracter[numero];
  }

  colorHEX() {
    var color = "";
    for (var i = 0; i < 6; i++) {
      color = color + this.generarCaracter();
    }
    return "#" + color;
  }

  generarColores() {
    var colores = [];
    for (var i = 0; i < this.state.respuesta.length; i++) {
      colores.push(this.colorHEX());
    }
    this.setState({ colores: colores });
  }

  configurarGrafica() {
    const data1 = {
      labels: this.state.id,
      datasets: [{
        data: this.state.cant,
        backgroundColor: this.state.colores
      }]
    };
    const opciones1 = {
      responsive: true,
      maintainAspectRatio: false
    }
    this.setState({ data1: data1, opciones1: opciones1 });
  }

  async componentDidMount() {
    await this.generarColores();
    this.configurarGrafica();
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true })
  }

  Datos(id) {
    var nombre = [], cantidad = [];
    UserService.getChart(id)
      .then(response => {
        this.setState({
          datos: response.data
        });
        console.log(response.data);
        for (var i = 0; i < response.data.length; i = i + 2) {
          nombre.push(response.data[i]);
          cantidad.push(response.data[i + 1]);
        }
        this.setState({ nombre: nombre, cantidad: cantidad });
        const data2 = {
          labels: this.state.nombre,
          datasets: [{
            label: "Datos",
            data: this.state.cantidad,
            backgroundColor: this.state.colores
          }]
        };
        const opciones2 = {
          responsive: true,
          maintainAspectRatio: false
        }
        this.setState({ data2: data2, opciones2: opciones2 });
      })
      .catch(e => {
        console.log(e);
      });
  }

  Perfil(id) {
    var perfils = [];
    this.openModal();
    PerfilService.getAll()
      .then(response => {
        this.setState({
          currentPerfil: response.data
        });

        console.log(response.data);
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].user == id) {
            if (response.data[i].activo == false) {
              perfils.push(response.data[i]);
            }
          }
        }
        this.setState({ perfils: perfils });
        console.log(perfils);
      })
      .catch(e => {
        console.log(e);
      });
  }

  setActivePerfil(perfil, index) {
    this.setState({
      currentRecurso: perfil,
      currentIndex: index
    });
  }

  newPerfil() {
    this.setState({
      currentNew: 1
    });
  }

  async updateActivo(status, id, id2) {
    var data = {
      id: this.state.currentRecurso.id,
      activo: status,
      user: this.state.currentRecurso.user,
      resource: this.state.currentRecurso.resource,
    };

    await PerfilService.update(this.state.currentRecurso.id, data)
      .then(response => {
        this.setState(prevState => ({
          currentRecurso: {
            ...prevState.currentRecurso,
            activo: status
          }
        }));
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    var perfils2 = [];
    
    await PerfilService.getAll()
      .then(response => {
        this.setState({
          currentPerfil2: response.data
        });

        console.log(response.data);
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].user == id) {
            if (response.data[i].id != id2) {
              if (response.data[i].activo != false) {
                perfils2.push(response.data[i]);
              }
            }
          }
        }
        this.setState({ perfils2: perfils2 });

        for (var i = 0; i < perfils2.length; i++) {
          var data = {
            id: perfils2[i].id,
            activo: "false",
            user: perfils2[i].user,
            resource: perfils2[i].resource,
          };

          PerfilService.update(perfils2[i].id, data)
        }
        window.location.reload();
      })
      .catch(e => {
        console.log(e);
      });

    this.closeModal();
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    const { currentUser, perfils, currentRecurso, currentIndex, currentNew } = this.state;

    return (
      <div className="container">
        {(this.state.userReady) ?
          <div>
            <header className="jumbotron">
              <h3>
                <strong>{currentUser.username}</strong> Profile
              </h3>
              <button onClick={() => this.Perfil(currentUser.id)}>
                Cambiar foto
              </button>
            </header>
            <p>
              <strong>Token:</strong>{" "}
              {currentUser.accessToken.substring(0, 20)} ...{" "}
              {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
            </p>
            <p>
              <strong>Id:</strong>{" "}
              {currentUser.id}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {currentUser.email}
            </p>
            <strong>Authorities:</strong>
            <ul>
              {currentUser.roles &&
                currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
            </ul>

            <div>
              <button onClick={() => this.Datos(currentUser.id)}>
                Estadisticas
              </button>
              <br></br>
            </div>

          </div> : null}

        <div>
          <h3>Mi Rendimiento</h3>
          <div className="App" style={{ width: "40%", height: "400px" }}>
            <Radar data={this.state.data2} options={this.state.opciones2} />
          </div>
        </div>

        <section>
          <Modal visible={this.state.visible} width="1000" height="500" effect="fadeInUp" onClickAway={() => this.closeModal()}>
            <div>
              <div>
                <div>
                  <h4>Avatar List</h4>

                  <button onClick={() => this.newPerfil()}>
                    Añadir
                  </button>

                  {currentNew == 1 ? (
                    <div>
                      <html>
                        <body>
                          <h4>Añadir una Retroalimentacion</h4>
                          <form method="POST" action="http://localhost:8080/api/perfils/add" enctype="multipart/form-data">
                            Activo:
                            <select name="activo" id="activo">
                              <option value="true">True</option>
                              <option value="false">False</option>
                            </select>
                            ID Usuario:
                              <input type="text" name="users" value={currentUser.id} />
                            Resource:
                              <input type="file" name="resource" multiple />
                            <input href="/" type="submit" value="Upload" onClick={() => window.location.reload()} />
                          </form>
                        </body>
                      </html>
                    </div>
                  ) : (
                      <div>
                        <ul className="list-group">
                          {perfils &&
                            perfils.map((perfil, index) => (
                              <div>
                                <li
                                  className={
                                    "list-group-item " +
                                    (index === currentIndex ? "active" : "")
                                  }
                                  onClick={() => this.setActivePerfil(perfil, index)}
                                  key={index}
                                >
                                  {perfil.id}
                                </li>
                              </div>
                            ))}
                        </ul>
                        <div className="col-md-6">
                          {currentRecurso ? (
                            <div>
                              <h4>Avatar</h4>
                              <div>
                                <label>
                                  <strong>ID:</strong>
                                </label>{" "}
                                {currentRecurso.id}
                              </div>
                              <div>
                                <label>
                                  <strong>Recurso:</strong>
                                </label>{" "}
                                <img src={"http://localhost:8080/api/perfils/resource/" + currentRecurso.id} width="250" height="140"></img>
                              </div>
                              <button
                                className="badge badge-primary mr-2"
                                onClick={() => this.updateActivo(true, currentUser.id, currentRecurso.id)}
                              >
                                Activar
                              </button>
                            </div>
                          ) : (
                              <div>
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </Modal>
        </section>
      </div>
    );
  }
}