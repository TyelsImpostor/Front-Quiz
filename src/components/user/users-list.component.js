import React, { Component } from "react";
import UserDataService from "../../services/user.service";
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";

export default class UsersList extends Component {
  constructor(props) {
    super(props);
    this.retrieveUsers = this.retrieveUsers.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveUser = this.setActiveUser.bind(this);

    this.state = {
      users: [],
      currentUser: null,
      showModeratorBoard: false,
      showTeacherBoard: false,
      currentUser2: undefined,
      currentIndex: -1
    };
  }

  componentDidMount() {
    this.retrieveUsers();
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser2: user,
        showUserBoard: user.roles.includes("user"),
        showModeratorBoard: user.roles.includes("moderator"),
        showTeacherBoard: user.roles.includes("teacher"),
      });
    }
  }

  retrieveUsers() {
    UserDataService.getAll()
      .then(response => {
        this.setState({
          users: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveUsers();
    this.setState({
      currentUser: null,
      currentIndex: -1
    });
  }

  setActiveUser(user, index) {
    this.setState({
      currentUser: user,
      currentIndex: index
    });
  }

  render() {
    const { currentUser2, showUserBoard, showModeratorBoard, showTeacherBoard, users, currentUser, currentIndex } = this.state;

    return (
      <div className="submit-form">
        {currentUser2 ? (
          <h3></h3>
        ) : (
            <div className="container">
              <header className="jumbotron">
                <h3 class="text-muted">Debes iniciar sesión</h3>
                <Link to={"/login"}>
                  Inicia Sesión
                    </Link>
              </header>
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
          <div className="list row">
            <div className="col-md-6">
              <h4>Users List</h4>

              <ul className="list-group">
                {users &&
                  users.map((user, index) => (
                    <li
                      className={
                        "list-group-item " +
                        (index === currentIndex ? "active" : "")
                      }
                      onClick={() => this.setActiveUser(user, index)}
                      key={index}
                    >
                      {user.username}
                    </li>
                  ))}
              </ul>

            </div>
            <div className="col-md-6">
              {currentUser ? (
                <div>
                  <h4>User</h4>
                  <div>
                    <label>
                      <strong>Id:</strong>
                    </label>{" "}
                    {currentUser.id}
                  </div>
                  <div>
                    <label>
                      <strong>Username:</strong>
                    </label>{" "}
                    {currentUser.username}
                  </div>
                  <div>
                    <label>
                      <strong>Email:</strong>
                    </label>{" "}
                    {currentUser.email}
                  </div>
                </div>
              ) : (
                  <div>
                    <br />
                    <p>Please click on a User...</p>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    );
  }
}