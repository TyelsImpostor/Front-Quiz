import React, { Component } from "react";
import RecursoDataService from "../../services/recurso.service";
import { Link } from "react-router-dom";

export default class RecursosList extends Component {
  constructor(props) {
    super(props);
    this.getPhoto = this.getPhoto.bind(this);

    this.state = {
      currentPhoto: {
        id: null,
        title: "",
        image: ""
      }
    };
  }

  componentDidMount() {
    this.getPhoto(this.props.match.params.id);
  }

  getPhoto(id) {
    RecursoDataService.get(id)
      .then(response => {
        this.setState({
          currentPhoto: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { currentPhoto } = this.state;

    return (
        <div>
            {currentPhoto ? (
            <div className="edit-form">
                <h4>Photo</h4>
                <html>
                    <body>
                        <img src="*{'data:image/png;base64,'+http://localhost:8080/api/photos/5fac63403852bf6dac4cfa89}" />
                        <img src={'data:image/png;base64,http://localhost:8080/api/photos/5fac63403852bf6dac4cfa89'} />
                        <img src='data:image/png;base64,http://localhost:8080/api/photos/5fac63403852bf6dac4cfa89' />
                    </body>
                </html>
            </div>
            ) : (
            <div>
                <br />
                <p>Please click on a Photo...</p>
            </div>
            )}
        </div>
    );
  }
}