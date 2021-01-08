import http from "../http-common";

class UploadFilesService {

  getAll() {
    return http.get("/photos/all");
  }

  get(id) {
    return http.get(`/photos/${id}`);
  }
}

export default new UploadFilesService();