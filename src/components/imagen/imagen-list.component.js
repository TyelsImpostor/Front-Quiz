import React, { Component } from "react";
import RecursoDataService from "../../services/imagen.service";

export default class RecursosList extends Component {
  constructor(props) {
    super(props);
    this.retrievePhotos = this.retrievePhotos.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActivePhoto = this.setActivePhoto.bind(this);

    this.state = {
      photos: [],
      currentPhoto: null,
      currentIndex: -1
    };
  }

  componentDidMount() {
    this.retrievePhotos();
  }

  retrievePhotos() {
    RecursoDataService.getAll()
      .then(response => {
        this.setState({
          photos: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrievePhotos();
    this.setState({
      currentPhoto: null,
      currentIndex: -1
    });
  }

  setActivePhoto(photo, index) {
    this.setState({
      currentPhoto: photo,
      currentIndex: index
    });
  }

  render() {
    const { photos, currentPhoto, currentIndex } = this.state;

    return (
      <div className="list row">
        <div className="col-md-6">
          <h4>Photo List</h4>

          <ul className="list-group">
            {photos &&
              photos.map((photo, index) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActivePhoto(photo, index)}
                  key={index}
                >
                  {photo.title}
                </li>
              ))}
          </ul>
        </div>
        <div className="col-md-6">
          {currentPhoto ? (
            <div>
              <h4>Photo</h4>
              <div>
                <label>
                  <strong>ID:</strong>
                </label>{" "}
                {currentPhoto.id}
              </div>
              <div>
                <label>
                  <strong>Titulo:</strong>
                </label>{" "}
                {currentPhoto.title}
              </div>
              <div>
                <label>
                  <strong>Photo:</strong>
                </label>{" "}
                <img src={"http://localhost:8080/api/imagens/" + currentPhoto.id} width="250" height="100"></img>
              </div>          
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Photo...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}