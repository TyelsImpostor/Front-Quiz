import http from "../http-common";

class UploadFilesService {

  getAll() {
    return http.get("/recursos/all");
  }

  get(id) {
    return http.get(`/recursos/${id}`);
  }

  delete(id) {
    return http.delete(`/recursos/${id}`);
  }
}

export default new UploadFilesService();