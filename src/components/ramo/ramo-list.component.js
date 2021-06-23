import React, { Component } from "react";
import RamoDataService from "../../services/ramo.service";
import CarreRamoDataService from "../../services/carreramo.service";
import CarreraDataService from "../../services/carrera.service";
import CursoDataService from "../../services/curso.service";
import { Link } from "react-router-dom";

import {
  Table, Alert, Button, Modal, Form, Col, Row, OverlayTrigger, Tooltip, Nav, Tab, Card, Accordion, Tabs, Pagination, Spinner
} from 'react-bootstrap';

import AuthService from "../../services/auth.service";

export default class RamosList extends Component {
  constructor(props) {
    super(props);
    this.searchMalla2 = this.searchMalla2.bind(this);
    this.retrieveCarreras2 = this.retrieveCarreras2.bind(this);
    this.setActiveCarrera2 = this.setActiveCarrera2.bind(this);

    this.retrieveRamos = this.retrieveRamos.bind(this);
    this.setActiveRamo = this.setActiveRamo.bind(this);
    this.searchNombre = this.searchNombre.bind(this);
    this.onChangeCodigo = this.onChangeCodigo.bind(this);
    this.onChangeNombre = this.onChangeNombre.bind(this);
    this.onChangeSemestre = this.onChangeSemestre.bind(this);
    this.onChangeDescripcion = this.onChangeDescripcion.bind(this);

    this.onChangeCodigoCreateCurso = this.onChangeCodigoCreateCurso.bind(this);
    this.onChangeSemestreCreateCurso = this.onChangeSemestreCreateCurso.bind(this);
    this.onChangeAñoCreateCurso = this.onChangeAñoCreateCurso.bind(this);
    this.onChangeDescripcionCreateCurso = this.onChangeDescripcionCreateCurso.bind(this);
    this.onChangePasswordCreateCurso = this.onChangePasswordCreateCurso.bind(this);
    this.onChangeActivoCreateCurso = this.onChangeActivoCreateCurso.bind(this);
    this.onChangeRamoidCreateCurso = this.onChangeRamoidCreateCurso.bind(this);

    //EDIT
    this.onChangeCodigo2 = this.onChangeCodigo2.bind(this);
    this.onChangeNombre2 = this.onChangeNombre2.bind(this);
    this.onChangeSemestre2 = this.onChangeSemestre2.bind(this);
    this.onChangeDescripcion2 = this.onChangeDescripcion2.bind(this);

    this.saveRamo = this.saveRamo.bind(this);
    this.updateRamo = this.updateRamo.bind(this);
    this.deleteRamo = this.deleteRamo.bind(this);

    this.deleteCarreRamo = this.deleteCarreRamo.bind(this);
    this.saveCarreRam = this.saveCarreRamo.bind(this);

    this.state = {
      currentRamo: null,
      id: null,
      codigo: "",
      nombre: "",
      semestre: "",
      descripcion: "",
      año: "",
      password: "",
      activo: "",
      ramoid: "",
      carreras: [],
      carreraid: "",
      query: '',
      //Curso
      codigoCurso: "",
      semestreCurso: "",
      añoCurso: "",
      passwordCurso: "",
      activoCurso: "",
      descripcionCurso: "",
      ramoid: "",
      currentRamo: {
        id: null,
        codigo: "",
        nombre: "",
        semestre: "",
        descripcion: "",
        año: "",
        password: "",
        activo: "",
        ramoid: ""
      },
      message: "",
      ramos: [],
      carreramos: [],
      filtrocarreras: [],
      filtrocarrerasañadidas: [],
      visibleedit: false,
      visibleañadir: false,
      visiblecurso: false,
      currentIndex: -1,
      searchNombre: "",
      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: undefined,
      //Botones
      visualRamo: true,
      showAlert: false,
      menssageAlert: "",
      typeAlert: "",
      visualRamoEdit: true,
      showAlertEditRamo: false,
      menssageAlertEdit: "",
      typeAlertEditRamo: "",
      carreras2: [],
      currentCarrera2: null,
      currentIndex2: -1,
      searchMalla2: "",
      query2: '',
      spinner: true,
      //--------PAGINACION------------
      postsPerPage: 5,
      //--------------
      paginacionAñadidas: [],
      listapaginacionAñadidas: [],
      paginateAñadidas: 1,

      paginacionNoAñadidas: [],
      listapaginacionNoAñadidas: [],
      paginateNoAñadidas: 1,

      paginacionRamos: [],
      listapaginacionRamos: [],
      paginateRamos: 1,

      paginacionCarreras: [],
      listapaginacionCarreras: [],
      paginateCarreras: 1,
    };
  }

  async componentDidMount() {
    this.setState({
      usuario: AuthService.getCurrentUser()
    });
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showUserBoard: user.roles.includes("user"),
        showModeratorBoard: user.roles.includes("moderator"),
        showTeacherBoard: user.roles.includes("teacher"),
      });
    }
    await this.retrievePre();
    await this.setState({ spinner: false });
  }
  async retrieveCarreras() {
    await CarreraDataService.getAll()
      .then(response => {
        // console.log(response.data)
        this.setState({
          carreras: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  async retrieveRamos() {
    await RamoDataService.getAll()
      .then(response => {
        // console.log(response.data)
        this.setState({
          ramos: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }
  async retrieveRamoCarreras() {
    await CarreRamoDataService.getAll()
      .then(response => {
        //console.log(response.data)
        this.setState({
          carreramos: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  async retrievePre() {
    try {
      await Promise.all([this.retrieveCarreras(), this.retrieveRamos(), this.retrieveRamoCarreras(), this.retrieveCarreras2()]);
      const listaRamos = await this.state.ramos.slice();
      const respuesta = await this.retrieveFiltroPorPagina(listaRamos);
      await this.setState({
        listapaginacionRamos: respuesta[0],
        paginacionRamos: respuesta[1]
      });
    } catch (error) {
      console.log(error);
    }
  }

  async retrieveRamoCarrerasNoAñadidos() {
    const listacarreras = this.state.carreras.slice();
    const listacarreramos = this.state.carreramos.slice();
    const listafiltroramocarrerasñadidos = [];
    listacarreramos && listacarreramos.map((carreramo) => {
      if (carreramo.ramoid == this.state.currentRamo.id) {
        listafiltroramocarrerasñadidos.push({
          idramocarrera: carreramo.id,
          idramo: carreramo.ramoid,
          idcarrera: carreramo.carreraid
        })
      };
    });
    var contador = 0;
    listafiltroramocarrerasñadidos && listafiltroramocarrerasñadidos.map((carreramo) => {
      listacarreras && listacarreras.map((carreras, index) => {
        if (carreras.id == carreramo.idcarrera) {
          listacarreras.splice(index, 1);
        };
      });
    });

    this.setState({ filtrocarreras: listacarreras });

    const respuesta = await this.retrieveFiltroPorPagina(listacarreras);
    this.setState({
      listapaginacionNoAñadidas: respuesta[0],
      paginacionNoAñadidas: respuesta[1]
    });
  }

  async retrieveRamoCarreraAñadidos() {
    const listacarreras = this.state.carreras.slice();
    const listacarreramos = this.state.carreramos.slice();
    const listafiltroramocarrerasñadidos = [];
    listacarreramos && listacarreramos.map((carreramo) => {
      if (carreramo.ramoid == this.state.currentRamo.id) {
        listacarreras && listacarreras.map((carrera) => {
          if (carreramo.carreraid == carrera.id) {
            listafiltroramocarrerasñadidos.push({
              malla: carrera.malla,
              idcarrera: carrera.id,
              idcarreramo: carreramo.id
            })
          };
        });
      };
    });
    this.setState({ filtrocarrerasañadidas: listafiltroramocarrerasñadidos });
    const respuesta = await this.retrieveFiltroPorPagina(listafiltroramocarrerasñadidos);
    this.setState({
      listapaginacionAñadidas: respuesta[0],
      paginacionAñadidas: respuesta[1]
    });
  }

  newRamo() {
    this.setState({
      id: null,
      codigo: "",
      nombre: "",
      semestre: "",
      descripcion: "",
      año: "",
      password: "",
      activo: "",
      ramoid: "",
      currentRamo: null,
      currentIndex: -1
    });
  }

  openModal(id) {
    this.setState({
      visible: true,
      carreraid: id
    });
  }

  closeModal() {
    this.setState({
      visible: false
    });
  }
  openModalEdit() {
    this.setState({
      visibleedit: true
    });
  }

  closeModalEdit() {
    this.setState({
      visibleedit: false
    });
  }

  openModalAñadir() {
    this.setState({
      visibleañadir: true
    });
  }

  closeModalAñadir() {
    this.setState({
      showAlert: false,
      visibleañadir: false,
    });
  }

  openModalCurso() {
    this.setState({
      visiblecurso: true
    });
  }

  closeModalCurso() {
    this.setState({
      visiblecurso: false
    });
  }

  async searchNombre(e) {
    const searchNombre = await e.target.value;

    this.setState({
      searchNombre: searchNombre
    });
    await RamoDataService.findByNombre(this.state.searchNombre)
      .then(response => {
        this.setState({
          ramos: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    // await this.refreshFiltroPorPagina(1, this.state.ramos, "ramo")
    const listaRamos = await this.state.ramos.slice();
    const respuesta = await this.retrieveFiltroPorPagina(listaRamos);
    await this.setState({
      listapaginacionRamos: respuesta[0],
      paginacionRamos: respuesta[1]
    });
  }

  async setActiveRamo(ramo, index) {
    await this.setState({
      currentRamo: ramo,
      currentIndex: index,
      ramoid: ramo.id
    });
    //await this.retrievePre();
    await this.retrieveRamoCarrerasNoAñadidos();
    await this.retrieveRamoCarreraAñadidos();
  }

  //----------------------------ADD/RAMO+CARRERA---------------------------

  async onChangeCodigo(e) {
    await this.setState({
      codigo: e.target.value
    });
    await this.handleVerificar();
  }
  async onChangeNombre(e) {
    await this.setState({
      nombre: e.target.value
    });
    await this.handleVerificar();
  }
  async onChangeSemestre(e) {
    await this.setState({
      semestre: e.target.value
    });
    await this.handleVerificar();
  }

  async onChangeDescripcion(e) {
    await this.setState({
      descripcion: e.target.value
    });
    await this.handleVerificar();
  }

  async handleVerificar() {
    console.log(this.state.semestre.length)
    if ((3 > this.state.codigo.length && this.state.codigo.length > 0) || (5 > this.state.nombre.length && this.state.nombre.length > 0)) {
      this.setState({
        visualRamo: true,
        menssageAlert: "Los campos deben tener un minimo de caracteres.",
        showAlert: true,
        typeAlert: "warning"
      })
    } else if (this.state.nombre.length == 0) {
      this.setState({
        visualRamo: true,
        menssageAlert: "El campo 'Nombre' no puede estar vacío.",
        showAlert: true,
        typeAlert: "danger"
      })
    } else if (this.state.semestre.length == 0) {
      this.setState({
        visualRamo: true,
        menssageAlert: "El campo 'Semestre' no puede estar vacío.",
        showAlert: true,
        typeAlert: "danger"
      })
    } else
      if (this.state.codigo.length == 0) {
        this.setState({
          visualRamo: true,
          menssageAlert: "El campo 'Codigo' no puede estar vacío.",
          showAlert: true,
          typeAlert: "danger"
        })
      }else if (this.state.nombre.length > 30) {
        this.setState({
          visualRamo: true,
          menssageAlert: "El campo 'Nombre' no puede tener tantos caracteres.",
          showAlert: true,
          typeAlert: "danger"
        })
      } else if (this.state.descripcion.length > 400) {
        this.setState({
          visualRamo: true,
          menssageAlert: "El campo 'Descripcion' no puede tener tantos caracteres.",
          showAlert: true,
          typeAlert: "danger"
        })
      } else
        if (this.state.codigo.length > 30) {
          this.setState({
            visualRamo: true,
            menssageAlert: "El campo 'Codigo' no puede tener tantos caracteres.",
            showAlert: true,
            typeAlert: "danger"
          })
        }  else {
        this.setState({
          visualRamo: true,
          menssageAlert: "",
          showAlert: false,
          typeAlert: "",
          visualRamo: false
        })
      }
  }

  async saveRamo() {
    var data = {
      codigo: this.state.codigo,
      nombre: this.state.nombre,
      semestre: this.state.semestre,
      descripcion: this.state.descripcion
    };

    await RamoDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          codigo: response.data.codigo,
          nombre: response.data.nombre,
          semestre: response.data.semestre,
          descripcion: response.data.descripcion,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    await this.retrievePre();
    this.closeModalAñadir();
    this.newRamo();
  }

  async saveCarreRamo() {
    var data = {
      carreraid: this.state.carreraid,
      ramoid: this.state.currentRamo.id
    };

    await CarreRamoDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          carreraid: response.data.carreraid,
          ramoid: response.data.ramoid,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    await this.retrievePre();
    this.closeModal();
  }

  //----------------------------EDIT/RAMO---------------------------
  async onChangeCodigo2(e) {
    const codigo = await e.target.value;
    await this.setState(prevState => ({
      currentRamo: {
        ...prevState.currentRamo,
        codigo: codigo
      }
    }));
    await this.handleVerificarEditRamo();
  }
  async onChangeNombre2(e) {
    const nombre = await e.target.value;
    await this.setState(prevState => ({
      currentRamo: {
        ...prevState.currentRamo,
        nombre: nombre
      }
    }));
    await this.handleVerificarEditRamo();
  }
  async onChangeSemestre2(e) {
    const semestre = await e.target.value;
    this.setState(prevState => ({
      currentRamo: {
        ...prevState.currentRamo,
        semestre: semestre
      }
    }))
    await this.handleVerificarEditRamo();
  }
  async onChangeDescripcion2(e) {
    const descripcion = await e.target.value;
    await this.setState(prevState => ({
      currentRamo: {
        ...prevState.currentRamo,
        descripcion: descripcion
      }
    }));
    await this.handleVerificarEditRamo();
  }
  async handleVerificarEditRamo() {
    if ((3 > this.state.currentRamo.codigo.length && this.state.currentRamo.codigo.length > 0) ||
      (5 > this.state.currentRamo.nombre.length && this.state.currentRamo.nombre.length > 0)) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "Los campos deben tener un minimo de caracteres.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "warning"
      })
    }
    else if (this.state.currentRamo.nombre.length == 0) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo 'Nombre' no puede estar vacío.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "danger"
      })
    } else if (this.state.currentRamo.semestre.length == 0) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo 'Semestre' no puede estar vacío.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "danger"
      })
    } else
      if (this.state.currentRamo.codigo.length == 0) {
        this.setState({
          visualRamoEdit: true,
          menssageAlertEdit: "El campo 'Codigo' no puede estar vacío.",
          showAlertEditRamo: true,
          typeAlertEditRamo: "danger"
        })
      } else if (this.state.currentRamo.nombre.length > 30) {
        this.setState({
          visualRamoEdit: true,
          menssageAlertEdit: "El campo 'Nombre' no puede tener tantos caracteres.",
          showAlertEditRamo: true,
          typeAlertEditRamo: "danger"
        })
      } else if (this.state.currentRamo.descripcion.length > 400) {
        this.setState({
          visualRamoEdit: true,
          menssageAlertEdit: "El campo 'Descripcion' no puede tener tantos caracteres.",
          showAlertEditRamo: true,
          typeAlertEditRamo: "danger"
        })
      } else
        if (this.state.currentRamo.codigo.length > 30) {
          this.setState({
            visualRamoEdit: true,
            menssageAlertEdit: "El campo 'Codigo' no puede tener tantos caracteres.",
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

  async updateRamo() {
    console.log(this.state.currentRamo.id);
    console.log(this.state.currentRamo.codigo);
    await RamoDataService.update(
      this.state.currentRamo.id,
      this.state.currentRamo
    )
      .then(response => {
        //console.log(response.data);
        this.setState({
          message: "The pregunta was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });

    //------------------------
    await this.retrievePre();
    this.closeModalEdit();
    this.newRamo();

  }

  async deleteRamo(id) {
    await RamoDataService.delete(id)
      .then(response => {
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      })
    await this.retrievePre();
  }

  //----------------------------ADD/CURSO---------------------------

  async onChangeCodigoCreateCurso(e) {
    await this.setState({
      codigoCurso: e.target.value
    });
    await this.handleVerificarCurso();
  }
  async onChangeSemestreCreateCurso(e) {
    await this.setState({
      semestreCurso: e.target.value
    });
    await this.handleVerificarCurso();
  }
  async onChangeAñoCreateCurso(e) {
    await this.setState({
      añoCurso: e.target.value
    });
    await this.handleVerificarCurso();
  }
  async onChangePasswordCreateCurso(e) {
    await this.setState({
      passwordCurso: e.target.value
    });
    await this.handleVerificarCurso();
  }
  async onChangeActivoCreateCurso(e) {
    await this.setState({
      activoCurso: e.target.value
    });
    await this.handleVerificarCurso();
  }
  async onChangeDescripcionCreateCurso(e) {
    await this.setState({
      descripcionCurso: e.target.value
    });
    await this.handleVerificarCurso();
  }
  onChangeRamoidCreateCurso(e) {
    this.setState({
      ramoid: e.target.value
    });
  }

  async handleVerificarCurso() {
    if ((3 > this.state.codigoCurso.length && this.state.codigoCurso.length > 0) ||
      (4 > this.state.añoCurso.length && this.state.añoCurso.length > 0) ||
      (3 > this.state.passwordCurso.length && this.state.passwordCurso.length > 0) ||
      (3 > this.state.activoCurso.length && this.state.activoCurso.length > 0)
    ) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "Los campos deben tener un minimo de caracteres.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "warning"
      })
    } else if (this.state.añoCurso.length == 0) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo 'Año' no puede estar vacío.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "danger"
      })
    } else if (this.state.añoCurso.length > 30) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo 'Año' no puede tener tantos caracteres.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "danger"
      })
    } else if (this.state.semestreCurso.length == 0) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo 'Semestre' no puede estar vacío.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "danger"
      })
    } else if (this.state.codigoCurso.length == 0) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo 'Codigo' no puede estar vacío.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "danger"
      })
    } else if (this.state.codigoCurso.length > 100) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo 'Codigo' no puede tener tantos caracteres.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "danger"
      })
    } else if (this.state.passwordCurso.length == 0) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo 'Contraseña' no puede estar vacío.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "danger"
      })
    } else if (this.state.passwordCurso.length > 30) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo 'Contraseña' no puede tener tantos caracteres.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "danger"
      })
    } else if (this.state.descripcionCurso.length > 400) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo 'Descripcion' no puede tener tantos caracteres.",
        showAlertEditRamo: true,
        typeAlertEditRamo: "danger"
      })
    }else if (this.state.activoCurso.length == 0) {
      this.setState({
        visualRamoEdit: true,
        menssageAlertEdit: "El campo 'Activo' no puede estar vacío.",
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

  async saveCurso() {
    var data = {
      codigo: this.state.codigo,
      semestre: this.state.semestre,
      año: this.state.año,
      descripcion: this.state.descripcion,
      password: this.state.password,
      activo: this.state.activo,
      ramoid: this.state.ramoid
    };

    await CursoDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          codigo: response.data.codigo,
          semestre: response.data.semestre,
          año: response.data.año,
          descripcion: response.data.descripcion,
          password: response.data.password,
          activo: response.data.activo,
          ramoid: response.data.ramoid,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    await this.retrievePre();
    this.closeModalCurso();

  }
  async deleteCarreRamo(id) {
    await CarreRamoDataService.delete(id)
      .then(response => {
        console.log(response.data)
      })
      .catch(e => {
        console.log(e);
      });
    await this.retrievePre();
  }

  async retrieveCarreras2() {
    await CarreraDataService.getAll()
      .then(response => {
        this.setState({
          carreras2: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    const respuesta = await this.retrieveFiltroPorPagina(this.state.carreras2);
    await this.setState({
      listapaginacionCarreras: respuesta[0],
      paginacionCarreras: respuesta[1]
    });
  }

  setActiveCarrera2(carrera, index) {
    this.setState({
      currentCarrera2: carrera,
      currentIndex2: index
    });
  }

  async searchMalla2(e) {
    await CarreraDataService.findByMalla(e.target.value)
      .then(response => {
        this.setState({
          carreras2: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
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

    if (tipo == "añadida") {
      this.setState({
        listapaginacionAñadidas: currentPosts,
        paginateAñadidas: pag
      });
    }
    if (tipo == "noañadida") {
      this.setState({
        listapaginacionNoAñadidas: currentPosts,
        paginateNoAñadidas: pag
      });
    }
    if (tipo == "ramo") {
      this.setState({
        listapaginacionRamos: currentPosts,
        paginateRamos: pag
      });
    }
    if (tipo == "carrera") {
      this.setState({
        listapaginacionCarreras: currentPosts,
        paginateCarreras: pag
      });
    }
  }
  //==========================================
  render() {
    const { searchNombre, ramos, currentRamo, currentIndex, currentUser,
      showUserBoard, showModeratorBoard, showTeacherBoard, carreras, filtrocarreras,
      filtrocarrerasañadidas, query, searchMalla2, carreras2, currentCarrera2,
      currentIndex2, query2, listapaginacionRamos, paginacionRamos,
      paginacionAñadidas, paginacionNoAñadidas, listapaginacionNoAñadidas, listapaginacionAñadidas,
      paginateAñadidas, paginateNoAñadidas, paginateRamos, listapaginacionCarreras, paginacionCarreras, paginateCarreras, spinner } = this.state;

    return (
      <div>
        <header>
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
              <div class="img-center">
                <h2 class="center">Control Ramo/Carrera</h2>
                <p>
                  Pagina a la que solo tiene acceso un Admin, control Ramos/Carreras.
                </p>
              </div>

              <Tabs justify variant="tabs" defaultActiveKey="Ramospanel">
                <Tab eventKey="Ramospanel" title="Ramos">
                  <div class="center">
                    <h3 class="img-center">Panel de Ramos</h3>
                    <p class="center">Revisa los ramos en el sistema, agrega, edita o elimina.</p>
                  </div>

                  <br></br>

                  <div className="list row">

                    <div className="col-md-7">
                      <div align="center">
                        <img src="../../../Organigrama2.png" width="300" height="250" />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <Table striped bordered hover>
                        <h3 class="img-center">Preguntas Frecuentes</h3>
                        <Accordion defaultActiveKey="0">
                          <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                              ¿Que refleja esta interfaz?
                            </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="0">
                            <Card.Body>En esta interfaz el administrador podrá visualizar los Ramos dentro del sistema y su respectivo detalle.</Card.Body>
                          </Accordion.Collapse>
                          <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="1">
                              ¿Qué ocurre si elimino un Ramo?
                            </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="1">
                            <Card.Body>Si eliminas un Ramo la eliminará automáticamente cualquier referencia dentro del sistema, es por eso que CUIDADO al eliminar.</Card.Body>
                          </Accordion.Collapse>
                        </Accordion>
                      </Table>
                    </div>
                  </div>

                  <br></br>
                  <br></br>
                  <Nav className="justify-content-end">
                    <Nav.Item>
                      <Button onClick={() => this.openModalAñadir()} > Agregar Ramo </Button>
                    </Nav.Item>
                  </Nav>
                  <hr></hr>
                  <br></br>
                  <div>
                    <div className="col-md-12">
                      <div className="input-group mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Buscar"
                          value={this.props.query}
                          onChange={this.searchNombre}
                        />
                      </div>
                    </div>
                    <div className="list row">
                      <div className="col-md-5">
                        <h4>Lista de Ramos</h4>
                        {(spinner) ? (
                          <div class="img-center">
                            <Spinner class="center" variant="primary" animation="border" />
                          </div>
                        ) : (
                          <>
                            <Table striped bordered hover>
                              <tbody>
                              {listapaginacionRamos.length > 0 && (
                                <tr>
                                  <td>
                                    {listapaginacionRamos.map((ramo, index) => (
                                      <li className={"list-group-item " + (index === currentIndex ? "active" : "")} onClick={() => this.setActiveRamo(ramo, index)} key={index}>
                                        <Row>
                                          <Col md="8" >
                                            {ramo.nombre}
                                          </Col>
                                          <Col md="auto">
                                            {' '}
                                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Editar</Tooltip>}>
                                              <Button size="sm" variant="info" onClick={() => (this.setActiveRamo(ramo, index), this.openModalEdit())} key={index}>
                                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                  <path fill-rule="evenodd" d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                                </svg>
                                              </Button>
                                            </OverlayTrigger>
                                            {' '}
                                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Borrar</Tooltip>}>
                                              <Button size="sm" variant="danger" onClick={() => (this.deleteRamo(ramo.id))} >
                                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                </svg>
                                              </Button>
                                            </OverlayTrigger>
                                            {' '}
                                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Agregar Curso</Tooltip>}>
                                              <Button size="sm" variant="warning" onClick={() => (this.setActiveRamo(ramo, index), this.openModalCurso())} key={index}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                                                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                                </svg>
                                              </Button>
                                            </OverlayTrigger>
                                          </Col>
                                        </Row>
                                      </li>
                                    ))}
                                  </td>
                                </tr>
                              )}
                                {paginacionRamos.length > 1 && (
                                  <nav>
                                    <Pagination>
                                      {paginacionRamos.map(number => (
                                        <Pagination.Item key={number} active={paginateRamos == number} onClick={() => this.refreshFiltroPorPagina(number, ramos, "ramo")} >
                                          {number}
                                        </Pagination.Item>
                                      ))}
                                    </Pagination>
                                  </nav>
                                )}
                              </tbody>
                            </Table>
                          </>
                        )}
                      </div>

                      <div className="col-md-2">
                        {currentRamo ? (
                          <>
                            <h4>Detalles</h4>
                            <div>
                              <label>
                                <strong>Nombre:</strong>
                              </label>{" "}
                              {currentRamo.nombre}
                            </div>
                            <div>
                              <label>
                                <strong>Codigo:</strong>
                              </label>{" "}
                              {currentRamo.codigo}
                            </div>
                            <div>
                              <label>
                                <strong>Descripcion:</strong>
                              </label>{" "}
                              {currentRamo.descripcion}
                            </div>

                          </>
                        ) : (
                          <>
                            <div>
                              <br />
                              <br />
                              <br />
                              <br />
                              <p>Haz click en un Ramo por favor...</p>
                            </div>

                          </>
                        )}
                      </div>

                      {(showModeratorBoard) ? (
                        <>
                          {((filtrocarreras.length != 0)) ? (
                            <div className="col-md-5">
                              <h4>Lista de Carreras</h4>

                              <Table striped bordered hover>
                                <tbody>
                                  <tr>
                                    <td>
                                      {listapaginacionNoAñadidas.map((carrera) => (
                                        <li className="list-group-item ">
                                          <Row>
                                            <Col md="8" >
                                              {carrera.malla}
                                            </Col>
                                            <Col md="auto">
                                              <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Asignar Carrera</Tooltip>}>
                                                <Button size="sm" variant="warning" onClick={() => this.openModal(carrera.id)}>
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                                  </svg>
                                                </Button>
                                              </OverlayTrigger>
                                            </Col>
                                          </Row>
                                        </li>
                                      ))}
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                              {paginacionNoAñadidas.length > 1 && (
                                <nav>
                                  <Pagination>
                                    {paginacionNoAñadidas.map(number => (
                                      <Pagination.Item key={number} active={paginateNoAñadidas == number} onClick={() => this.refreshFiltroPorPagina(number, filtrocarreras, "noañadida")} >
                                        {number}
                                      </Pagination.Item>
                                    ))}
                                  </Pagination>
                                </nav>
                              )}
                            </div>
                          ) : (
                            <div>
                              {/* <h4>Lista de Carreras</h4>
                      <br/>
                     <p>Please click on a Ramo...</p> */}
                            </div>
                          )}

                          {((filtrocarreras.length == 0) && (filtrocarrerasañadidas.length > 0)) ? (
                            <div className="col-md-5">
                              <h4>Lista de Carreras</h4>
                              <br />
                              <p>No existen mas Carreras que puedan ser añadidas...</p>

                            </div>
                          ) : (
                            <div>
                              {/* <h4>Lista de Carreras</h4>
                      <br/>
                     <p>Please click on a Ramo...</p> */}
                            </div>
                          )}

                        </>
                      ) : (
                        <></>
                      )}

                      {(showModeratorBoard) ? (
                        <>
                          {(filtrocarrerasañadidas.length != 0) ? (
                            <div className="col-md-5">
                              <h4>Lista de Carreras Añadidas</h4>
                              <Table striped bordered hover>
                                <tbody>
                                  <tr>
                                    <td>
                                      {listapaginacionAñadidas.map((carrera) => (
                                        <li className="list-group-item ">
                                          <Row>
                                            <Col md="8" >
                                              {carrera.malla}
                                            </Col>
                                            <Col md="auto">
                                              <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Desvincular Carrera</Tooltip>}>
                                                <Button size="sm" variant="danger" onClick={() => this.deleteCarreRamo(carrera.idcarreramo)}>
                                                  <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                  </svg>
                                                </Button>
                                              </OverlayTrigger>
                                            </Col>
                                          </Row>
                                        </li>
                                      ))}
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                              {paginacionAñadidas.length > 1 && (
                                <nav>
                                  <Pagination>
                                    {paginacionAñadidas.map(number => (
                                      <Pagination.Item key={number} active={paginateAñadidas == number} onClick={() => this.refreshFiltroPorPagina(number, filtrocarrerasañadidas, "añadida")} >
                                        {number}
                                      </Pagination.Item>
                                    ))}
                                  </Pagination>
                                </nav>
                              )}
                            </div>
                          ) : (
                            <></>
                          )}
                          {((filtrocarrerasañadidas.length == 0) && (filtrocarreras.length > 0)) ? (
                            <div className="col-md-5">
                              <h4>Lista de Carreras Añadidas</h4>
                              <br />
                              <p>No tienes ninguna Carrera asignada a este Ramo...</p>

                            </div>
                          ) : (
                            <></>
                          )}
                        </>
                      ) : (
                        <></>
                      )}

                      <Modal show={this.state.visibleedit} size="xl" >
                        <Modal.Header closeButton onClick={() => this.closeModalEdit()} >
                          <Modal.Title>Editar Ramo</Modal.Title>
                        </Modal.Header>
                        {currentRamo ? (
                          <Modal.Body>
                            <Form>
                              <Form.Row>
                                <Col md="4">
                                  <label htmlFor="codigo">Codigo</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="codigo"
                                    required
                                    defaultValue={currentRamo.codigo}
                                    onChange={this.onChangeCodigo2}
                                    name="codigo"
                                  />
                                </Col>
                                <Col md="4">
                                  <label htmlFor="nombre">Nombre</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="nombre"
                                    required
                                    defaultValue={currentRamo.nombre}
                                    onChange={this.onChangeNombre2}
                                    name="nombre"
                                  />
                                </Col>
                                <Col md="4">
                                  <label htmlFor="semestre">Semestre</label>
                                  <Form.Control as="select"
                                    className="form-control"
                                    id="semestre"
                                    required
                                    defaultValue={currentRamo.semestre}
                                    onChange={this.onChangeSemestre}
                                    name="semestre"
                                  >
                                    <option disabled>...</option>
                                    <option >1</option>
                                    <option >2</option>
                                    <option >3</option>
                                    <option >4</option>
                                  </Form.Control>
                                </Col>
                              </Form.Row>
                              <Form.Row>
                                <Col >
                                  <label htmlFor="descripcion">Descripcion</label>
                                  <Form.Control
                                    as="textarea" rows={3}
                                    className="form-control"
                                    id="descripcion"
                                    required
                                    defaultValue={currentRamo.descripcion}
                                    onChange={this.onChangeDescripcion2}
                                    name="descripcion"
                                  />
                                </Col>
                              </Form.Row>
                            </Form>
                            <br />
                            <Alert show={this.state.showAlertEditRamo} variant={this.state.typeAlertEditRamo}>
                              {this.state.menssageAlertEdit}
                            </Alert>
                          </Modal.Body>
                        ) : (
                          <div>
                            <br />
                          </div>
                        )}
                        <Modal.Footer>
                          <Button variant="primary" disabled={this.state.visualRamoEdit} onClick={() => this.updateRamo()}>
                            Editar
                          </Button>
                        </Modal.Footer>
                      </Modal>

                      <Modal show={this.state.visible} width="1000" height="500" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                        <Modal.Header>
                          <Modal.Title align="center">¿Deséa asignar esta Carrera?</Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                          <button className="btn btn-warning" onClick={() => this.closeModal()}>
                            Cerrar
                          </button>
                          <button className="btn btn-success" onClick={() => (this.saveCarreRamo())}>
                            Agregar
                          </button>
                        </Modal.Footer>
                      </Modal>

                      <Modal show={this.state.visibleañadir} size="xl" >
                        <Modal.Header closeButton onClick={() => this.closeModalAñadir()} >
                          <Modal.Title>Crear Ramo</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Form>
                            <Form.Row>
                              <Col md="4">
                                <label htmlFor="codigo">Codigo</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="codigo"
                                  required
                                  value={this.state.codigo}
                                  onChange={this.onChangeCodigo}
                                  name="codigo"
                                />
                              </Col>
                              <Col md="4">
                                <label htmlFor="nombre">Nombre</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="nombre"
                                  required
                                  value={this.state.nombre}
                                  onChange={this.onChangeNombre}
                                  name="nombre"
                                />
                              </Col>
                              <Col md="4">
                                <label htmlFor="semestre">Semestre</label>
                                <Form.Control as="select"
                                  className="form-control"
                                  id="semestre"
                                  required
                                  defaultValue="..."
                                  onChange={this.onChangeSemestre}
                                  name="semestre"
                                >
                                  <option disabled>...</option>
                                  <option >1</option>
                                  <option >2</option>
                                  <option >3</option>
                                  <option >4</option>
                                </Form.Control>
                              </Col>
                              {/* <input
                                  type="text"
                                  className="form-control"
                                  id="semestre"
                                  required
                                  value={this.state.semestre}
                                  onChange={this.onChangeSemestre}
                                  name="semestre"
                                /> */}

                              <Col>
                                <label htmlFor="descripcion">Descripcion</label>
                                <Form.Control as="textarea" rows={3}
                                  className="form-control"
                                  id="descripcion"
                                  value={this.state.descripcion}
                                  onChange={this.onChangeDescripcion}
                                  name="descripcion"
                                />
                              </Col>
                            </Form.Row>
                          </Form>
                          <br />
                          <Alert show={this.state.showAlert} variant={this.state.typeAlert}>
                            {this.state.menssageAlert}
                          </Alert>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button justify variant="primary" disabled={this.state.visualRamo} onClick={() => this.saveRamo()}>
                            Agregar
                          </Button>
                        </Modal.Footer>
                      </Modal>

                      <Modal show={this.state.visiblecurso} size="xl" >
                        <Modal.Header closeButton onClick={() => this.closeModalCurso()} >
                          <Modal.Title>Nuevo Curso</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Form>
                            <Form.Row>
                              <Col>
                                <label htmlFor="codigo">Codigo</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="codigo"
                                  required
                                  value={this.state.codigoCurso}
                                  onChange={this.onChangeCodigoCreateCurso}
                                  name="codigo"
                                />
                              </Col>
                            </Form.Row>
                            <Form.Row>
                              {/* <Col md="3">
                                <label htmlFor="semestre">Semestre</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="semestre"
                                  required
                                  value={this.state.semestreCurso}
                                  onChange={this.onChangeSemestreCreateCurso}
                                  name="semestre"
                                />
                              </Col> */}

                              <Col md="3">
                                <label htmlFor="semestre">Semestre</label>
                                <Form.Control as="select"
                                  className="form-control"
                                  id="semestre"
                                  required
                                  defaultValue="..."
                                  onChange={this.onChangeSemestreCreateCurso}
                                  name="semestre"
                                >
                                  <option disabled>...</option>
                                  <option >1</option>
                                  <option >2</option>
                                  <option >3</option>
                                  <option >4</option>
                                </Form.Control>
                              </Col>
                              <Col md="3">
                                <label htmlFor="año">Año</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="año"
                                  required
                                  value={this.state.añoCurso}
                                  onChange={this.onChangeAñoCreateCurso}
                                  name="año"
                                />
                              </Col>
                              <Col md="3">
                                <label htmlFor="password">Contraseña</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="password"
                                  required
                                  value={this.state.passwordCurso}
                                  onChange={this.onChangePasswordCreateCurso}
                                  name="password"
                                />
                              </Col>
                              <Col md="3">
                                <label htmlFor="activo">Activo:</label>
                                <select
                                  type="text"
                                  className="form-control"
                                  id="activo"
                                  required
                                  onChange={this.onChangeActivoCreateCurso}
                                  name="activo"
                                  defaultValue="...">
                                  <option disabled>...</option>
                                  <option value="true">activo</option>
                                  <option value="false">desactivado</option>
                                </select>
                              </Col>
                              <Col md="5" hidden>
                                <label htmlFor="ramoid">ID del Ramo</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="ramoid"
                                  required
                                  value={this.state.ramoid}
                                  onChange={this.onChangeRamoidCreateCurso}
                                  name="ramoid"
                                  disabled
                                />
                              </Col>
                            </Form.Row>
                            <Form.Row>
                              <Col>
                                <label htmlFor="descripcion">Descripcion</label>
                                <Form.Control as="textarea" rows={3}
                                  value={this.state.descripcionCurso}
                                  onChange={this.onChangeDescripcionCreateCurso}
                                />
                              </Col>
                            </Form.Row>
                          </Form>
                          <br />
                          <Alert show={this.state.showAlertEditRamo} variant={this.state.typeAlertEditRamo}>
                            {this.state.menssageAlertEdit}
                          </Alert>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="primary" disabled={this.state.visualRamoEdit} onClick={() => this.saveCurso()}>
                            Crear
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                  </div>
                </Tab>

                <Tab eventKey="Carrerapanel" title="Carreras">
                  <div class="center">
                    <h3 class="img-center">Panel de Carreras</h3>
                    <p class="center">Revisa las carreras en el sistema, agrega, edita o elimina.</p>
                  </div>

                  <br></br>

                  <div className="list row">

                    <div className="col-md-7">
                      <div align="center">
                        <img src="../../../Organigrama.png" width="300" height="250" />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <Table striped bordered hover>
                        <h3 class="img-center">Preguntas Frecuentes</h3>
                        <Accordion defaultActiveKey="0">
                          <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                              ¿Que refleja esta interfaz?
                            </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="0">
                            <Card.Body>En esta interfaz el administrador podrá visualizar las Carreras dentro del sistema y su respectivo detalle.</Card.Body>
                          </Accordion.Collapse>
                          <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="1">
                              ¿Qué ocurre si elimino una Carrera?
                            </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="1">
                            <Card.Body>Si eliminas una Carrera la eliminará automáticamente cualquier referencia dentro del sistema, es por eso que CUIDADO al eliminar.</Card.Body>
                          </Accordion.Collapse>
                        </Accordion>
                      </Table>
                    </div>
                  </div>

                  <br></br>
                  <br></br>
                  <Nav className="justify-content-end">
                    <Nav.Item>
                      <Button href="/carrera/add"> Agregar Carrera </Button>
                    </Nav.Item>
                  </Nav>
                  <hr></hr>
                  <br></br>

                  <div>
                    <div className="col-md-12">
                      <div className="input-group mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Buscar"
                          value={this.props.query2}
                          onChange={this.searchMalla2}
                        />
                      </div>
                    </div>
                    <div className="list row">
                      <div className="col-md-6">
                        <h4>Carreras List</h4>

                        <br></br>
                        <br></br>

                        <ul className="list-group">
                          {listapaginacionCarreras.map((carrera, index) => (
                            <li
                              className={
                                "list-group-item " +
                                (index === currentIndex2 ? "active" : "")
                              }
                              onClick={() => this.setActiveCarrera2(carrera, index)}
                              key={index}
                            >
                              {carrera.malla}
                            </li>
                          ))}
                        </ul>
                        <br></br>
                        {paginacionCarreras.length > 1 && (
                          <nav>
                            <Pagination>
                              {paginacionCarreras.map(number => (
                                <Pagination.Item key={number} active={paginateCarreras == number} onClick={() => this.refreshFiltroPorPagina(number, carreras2, "carrera")} >
                                  {number}
                                </Pagination.Item>
                              ))}
                            </Pagination>
                          </nav>
                        )}
                      </div>
                      <div className="col-md-6">
                        {currentCarrera2 ? (
                          <div>
                            <h4>Carrera</h4>
                            <div>
                              <label>
                                <strong>Malla:</strong>
                              </label>{" "}
                              {currentCarrera2.malla}
                            </div>
                            <Link
                              to={"/carrera/" + currentCarrera2.id}
                              className="badge badge-warning"
                            >
                              Edit
                            </Link>
                          </div>
                        ) : (
                          <div>
                            <br />
                            <p>Please click on a Carrera...</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </div>
          ))}

          {showUserBoard && (
            <h3>Usted no tiene el permiso para acceder a esta zonaa.</h3>
          )}
        </header>
      </div>
    );
  }
}