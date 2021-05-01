import React, { Component } from "react";
import axios from "axios";
import UploadService from "../../services/recurso.service";
import { Form } from "react-bootstrap";



// const imagenessisi = async (title, type, inicialmin, finalmin, privado, link,users,selectedFiles) =>  {
//   const data2 = new FormData();
//   data2.append("title", title);
//   data2.append("type", type);
//   data2.append("inicialmin", inicialmin);
//   data2.append("finalmin", finalmin);
//   data2.append("privado", privado);
//   data2.append("link", link);
//   data2.append("users", users);
//   data2.append("resource", selectedFiles);

//   var data = {
//     title: title,
//     type: type,
//     inicialmin: inicialmin,
//     finalmin: finalmin,
//     privado: privado,
//     link: link,
//     users: users,
//     selectedFiles: selectedFiles
//   }
//   console.log(data);
//   await axios.post("https://spring-boot-back.herokuapp.com/api/recursos/add", data)
//   .then(response => {
//     console.log(response.data);
//   }).catch( error => {
//     console.log(error);
//   })
// }

export default class Example6 extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitulo = this.onChangeTitulo.bind(this);
    this.onChangeTipo = this.onChangeTipo.bind(this);
    this.onChangeInicialmin = this.onChangeInicialmin.bind(this);
    this.onChangeFinalmin = this.onChangeFinalmin.bind(this);
    this.onChangePrivado = this.onChangePrivado.bind(this);
    this.onChangeLink = this.onChangeLink.bind(this);
    this.onChangeUsers = this.onChangeUsers.bind(this);
    this.selectFile = this.selectFile.bind(this);
    // this.upload = this.upload.bind(this);
    this.subirArchivos = this.subirArchivos.bind(this);
    // this.imagenessisi = this.imagenessisi.bind(this);
    // this.insertarFetch = this.insertarFetch.bind(this);
    // this.insertHtml = this.insertHtml.bind(this);
    this.insertarArchivos = this.insertarArchivos.bind(this);
    this.state = {
      id: null,
      title: "",
      type: "",
      inicialmin: "",
      finalmin: "",
      privado: "",
      link: "",
      users: "",
      selectedFiles: null,
      message: "",
      query: ''
    };
  }

  onChangeTitulo(e) {
    this.setState({
      title: e.target.value
    });
  }

  onChangeTipo(e) {
    this.setState({
      type: e.target.value
    });
  }

  onChangeInicialmin(e) {
    this.setState({
      inicialmin: e.target.value
    });
  }

  onChangeFinalmin(e) {
    this.setState({
      finalmin: e.target.value
    });
  }

  onChangePrivado(e) {
    this.setState({
      privado: e.target.value
    });
  }

  onChangeLink(e) {
    this.setState({
      link: e.target.value
    });
  }

  onChangeUsers(e) {
    this.setState({
      users: e.target.value
    });
  }

  selectFile(e) {
    const query = e.target.files;
    this.setState({
      selectedFiles: query,
    });
     console.log(query);
  }

  subirArchivos = (e) => {
    console.log(e);
    this.setState({
      selectedFiles: e.target.files,
    })
    console.log(this.state.selectedFiles);
  }


  insertarArchivos() {
    // const f = new FormData();
    // f.append(this.state.selectedFiles);
    var data  = {
      title: this.state.title,
      type: this.state.type,
      inicialmin: this.state.inicialmin,
      finalmin: this.state.finalmin,
      privado: this.state.privado,
      link: this.state.link,
      users: this.state.users,
      resource: this.state.selectedFiles
    }
    axios({
      method: 'post',
      url: 'https://spring-boot-back.herokuapp.com/api/recursos/add',
      data: JSON.stringify(data)
    })
      .then(res => this.setState({ recipes: res.data }));

    this.setState({
      selectedFiles: null,
    });

  }

  insertarFetch() {

    const data2 = new FormData();
    data2.append("title", this.state.title);
    data2.append("type", this.state.type);
    data2.append("inicialmin", this.state.inicialmin);
    data2.append("finalmin", this.state.finalmin);
    data2.append("privado", this.state.privado);
    data2.append("link", this.state.link);
    data2.append("users", this.state.users);
    data2.append("resource", this.state.selectedFiles);

    var data = {
      title: this.state.title,
      type: this.state.type,
      inicialmin: this.state.inicialmin,
      finalmin: this.state.finalmin,
      privado: this.state.privado,
      link: this.state.link,
      users: this.state.users,
      selectedFiles: this.state.selectedFiles
    }

    fetch('https://spring-boot-back.herokuapp.com/api/recursos/add', {
      method: 'POST',
      body: JSON.stringify(data2)
    })
    .then( res => res.text())
    .then( res => console.log(res))
    .catch(err => {
      console.error(err)
    })


  }

  // insertHtml(){


    // (
    //   <form method="post" action="https://spring-boot-back.herokuapp.com/api/recursos/add" enctype="multipart/form-data">
      
    //   </form>
    //   )
  // }


  // const imagenessisi = async (title, type, inicialmin, finalmin, privado, link,users,selectedFiles) =>  {
  //   const data = new FormData();
  //   data.append("title", this.state.title);
  //   data.append("type", this.state.type);
  //   data.append("inicialmin", this.state.inicialmin);
  //   data.append("finalmin", this.state.finalmin);
  //   data.append("privado", this.state.privado);
  //   data.append("link", this.state.link);
  //   data.append("users", this.state.users);
  //   data.append("resource", this.state.selectedFiles);
  
  //   await axios.post("https://spring-boot-back.herokuapp.com/api/recursos/add", data)
  //   .then(response => {
  //     console.log(response.data);
  //   }).catch( error => {
  //     console.log(error);
  //   })

  // upload() {
  //   var currentFile = this.state.selectedFiles[0];

  //   this.setState({
  //     currentFile: currentFile,
  //   });

  //   axios({
  //     method: 'post',
  //     url: 'https://spring-boot-back.herokuapp.com/api/recursos/add',
  //     data: {
  //       title: this.state.title,
  //       type: this.state.type,
  //       inicialmin: this.state.inicialmin,
  //       finalmin: this.state.finalmin,
  //       privado: this.state.privado,
  //       link: this.state.link,
  //       users: this.state.users,
  //       resource: currentFile
  //     }
  //   })
  //     .then(res => this.setState({ recipes: res.data }));

  //   this.setState({
  //     selectedFiles: null,
  //   });
  // }

  render() {
    const {  message ,e ,subirArchivos, title, type, inicialmin,
      finalmin, privado, link, users, selectedFiles  } = this.state;

    return (
      <div>
        <label htmlFor="title">Titulo</label>
        <input
          type="text"
          className="form-control"
          id="title"
          onChange={this.onChangeTitulo}
          name="title"
        />

        <label htmlFor="type">Tipo</label>
        <select
          className="form-control"
          id="type"
          defaultValue="..."
          onChange={this.onChangeTipo}
          name="type">
          <option value="..." disabled>...</option>
          <option value="documento">Documento</option>
          <option value="link">Link</option>
          <option value="imagen">Imagen</option>
        </select>

        <label htmlFor="inicialmin">inicialmin</label>
        <input
          type="text"
          className="form-control"
          id="inicialmin"
          onChange={this.onChangeInicialmin}
          name="inicialmin"
        />

        <label htmlFor="finalmin">finalmin</label>
        <input
          type="text"
          className="form-control"
          id="finalmin"
          onChange={this.onChangeFinalmin}
          name="finalmin"
        />

        <label htmlFor="type">Privado</label>
        <select
          className="form-control"
          id="privado"
          defaultValue="..."
          onChange={this.onChangePrivado}
          name="privado">
          <option value="..." disabled>...</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>

        <label htmlFor="link">link</label>
        <input
          type="text"
          className="form-control"
          id="link"
          onChange={this.onChangeLink}
          name="link"
        />

        <label htmlFor="users">users</label>
        <input
          type="text"
          className="form-control"
          id="users"
          onChange={this.onChangeUsers}
          name="users"
        />

        {/* <label className="btn btn-default"> */}
          <input 
            type="file" 
            name="files" 
            multiple 
            onChange={this.selectFile}
            value={this.props.query}
            />
        {/* </label> */}

        <button
          className="btn btn-success"
          onClick={() => this.insertarArchivos() }
        >
          Upload
        </button>

        <div className="alert alert-light" role="alert">
          {message}
        </div>
      </div>
    );
  }
}