import React, { Component } from "react";
import CheckButton from "react-validation/build/button";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import {
  striped, bordered, hover, Table, Button, Text, View, Overview, Modal,
  InputGroup, FormControl, Col, Jumbotron, Container, Badge, Row, OverlayTrigger, Overlay, Tooltip
} from 'react-bootstrap';

import AuthService from "../services/auth.service";

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};
export default class Inicio extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      username: "",
      password: "",
      loading: false,
      message: "",

      showUserBoard: false,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser: AuthService.getCurrentUser(),
      user: undefined
    };
  }

  componentDidMount() {


    if (this.state.user) {
      this.setState({
        currentUser: this.state.user,
        showUserBoard: this.state.user.roles.includes("user"),
        showModeratorBoard: this.state.user.roles.includes("moderator"),
        showTeacherBoard: this.state.user.roles.includes("teacher")
      });
    }
  }
  
  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  handleLogin(e) {
    e.preventDefault();

    this.setState({
      message: "",
      loading: true
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.login(this.state.username.toLowerCase(), this.state.password).then(
        () => {
          this.props.history.push("/");
          window.location.reload();
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            loading: false,
            message: resMessage
          });
        }
      );
    } else {
      this.setState({
        loading: false
      });
    }
  }


  render() {
    const { currentUser, showModeratorBoard, showTeacherBoard} = this.state;

    return (
      <body>
        <br></br>
        <br></br>

        <div className="list row">
        {currentUser ? (
            <div className="col-md-6 center"> 
              <img class="img-center" src="https://pedagogiadialogica.cl/wp-content/uploads/2019/03/Logo-UCM.png" height="auto" width="auto" ></img>
            </div>
          ) : (
          <div className="col-md-6">
            <div class="center">
              <div align="center">
                <img src="https://pedagogiadialogica.cl/wp-content/uploads/2019/03/Logo-UCM.png" height="auto" width="auto" ></img></div>
              <div class="row justify-content-center">
                <div class="col-xl-8 col-lg-9">
                  <Form
                    onSubmit={this.handleLogin}
                    ref={c => {
                      this.form = c;
                    }}
                  >
                    <div className="form-group">
                      <label htmlFor="username">Username</label>
                      <Input
                        type="text"
                        className="form-control"
                        name="username"
                        value={this.state.username}
                        onChange={this.onChangeUsername}
                        validations={[required]}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="password">Contraseña</label>
                      <Input
                        type="password"
                        className="form-control"
                        name="password"
                        value={this.state.password}
                        onChange={this.onChangePassword}
                        validations={[required]}
                      />
                    </div>

                    <div className="form-group">
                      <button
                        className="btn btn-primary btn-block"
                        disabled={this.state.loading}
                      >
                        {this.state.loading && (
                          <span className="spinner-border spinner-border-sm"></span>
                        )}
                        <span>Login</span>
                      </button>
                    </div>

                    {this.state.message && (
                      <div className="form-group">
                        <div className="alert alert-danger" role="alert">
                          {this.state.message}
                        </div>
                      </div>
                    )}
                    <CheckButton
                      style={{ display: "none" }}
                      ref={c => {
                        this.checkBtn = c;
                      }}
                    />
                  </Form>

                </div>
              </div>

              <div class="card-body px-6 py-5">
                <div class="small text-center">¿Nuevo Usuario? <a href="/register">¡Crea tu Cuenta!</a>
                </div>
              </div>
            </div>
          </div>
          )}
          <div className="col-md-6">
            <br></br>
            <br></br>
            <div class="center">
              <br></br>
              <br></br>
              <img src="./Universidad.jpg" class="col-12" />
            </div>
          </div>
        </div>
      </body>

    );
  }
}