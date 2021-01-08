import React, { Component } from 'react';
import { Link } from "react-router-dom";

class AddRecurso extends Component {

  render() {
    return (

      <html>
        <body>
          <h1>Upload new Photo</h1>
              <Link
                to={"/file/list"}
                class="btn btn-link"
              >
                File List
              </Link>
          <form method="POST" action="http://localhost:8080/api/photos/add" enctype="multipart/form-data">
            Title:<input type="text" name="title" />
            Image:<input type="file" name="image" accept="image/*" />
            <input href="/" type="submit" value="Upload" />
          </form>
        </body>
      </html>


    );
  }
}

export default AddRecurso;