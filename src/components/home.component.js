import React, { Component } from "react";
import CheckButton from "react-validation/build/button";

import { striped, bordered, hover, Table, Button, Text, View , Overview, Modal, 
  InputGroup, FormControl, Form, Col, Jumbotron, Container, Badge, Row, OverlayTrigger, Overlay, Tooltip} from 'react-bootstrap';

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
      message: ""
    };
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
      AuthService.login(this.state.username, this.state.password).then(
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
    return (
      <body>
        <br></br>
        <br></br>    
            
        <Form
            onSubmit={this.handleLogin}
            ref={c => {
              this.form = c;
            }}
          >
          <Row class="position-fixed">
            <Col>
              <Jumbotron class="col-6">
                <div align="center">
                  <img src="https://pedagogiadialogica.cl/wp-content/uploads/2019/03/Logo-UCM.png" height="auto" width="auto" ></img></div>
                  <div class="row justify-content-center">
                    <div class="col-xl-8 col-lg-9">
                      <form> 
                        <div class="form-group">
                          <label for="emailInput" class="text-gray-600 ">Correo</label>
                          <input   data-cy="emailInput" aria-describedby="emailHelp" 
                          formcontrolname="email" class="form-control form-control-solid ng-untouched ng-pristine ng-invalid"
                          type="email"
                          name="username"
                          value={this.state.username}
                          onChange={this.onChangeUsername}
                          validations={[required]}
                          ></input>
                            <div  class="invalid-feedback">Email required.</div>
                        </div>

                        <div class="form-group">
                          <label for="passwordInput" class="text-gray-600"><p>Contraseña</p></label>
                          <input id="passwordInput" data-cy="passwordInput" formcontrolname="password" 
                          class="form-control form-control-solid ng-untouched ng-pristine ng-invalid"
                          type="password" 
                          name="password"
                          value={this.state.password}
                          onChange={this.onChangePassword}
                          validations={[required]}
                          ></input>
                          <div class="invalid-feedback">Password required.</div>
                        </div>

                        <div class="form-group">
                          <a routerlink="/auth/password-reset-request" 
                          href="/auth/password-reset-request">
                          <p>¿Olvidaste tu contraseña?</p></a>
                        </div>

                        <div class="form-group" align="center">
                          <Button type="submit" size="lg" 
                            disabled={this.state.loading} block>
                            {this.state.loading && (
                            <span className="spinner-border spinner-border-sm"></span>
                            )}
                            <span>Entrar</span>
                          </Button>
                        </div>

                        {this.state.message && (
                          <div className="form-group">
                            <div className="alert alert-danger" role="alert">
                              {this.state.message}
                            </div>
                          </div>
                        )}

                      </form>
                    </div>
                  </div>
                  <div class="card-body px-6 py-5">
                    <div class="small text-center">¿Nuevo Usuario? <a routerlink="../register" href="/auth/register">¡Crea tu Cuenta!</a>
                    </div>
                  </div>  
              </Jumbotron>
            </Col>
            <Col>
              <Jumbotron class="col-6">
              <img src="./Universidad.jpg" class="col-12" />
              </Jumbotron>
            </Col>
          </Row>
          </Form>

      </body>

    );
  }
}