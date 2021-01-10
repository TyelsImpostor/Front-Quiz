import http from "../http-common";

class UploadFilesService {

  getAll() {
    return http.get("/recursos/all");
  }

  get(id) {
    return http.get(`/recursos/${id}`);
  }
}

export default new UploadFilesService();