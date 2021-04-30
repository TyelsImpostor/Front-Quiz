import http from "../http-common";

class UploadFilesService {

  getAll() {
    return http.get("/recursos/all");
  }
  
  create(data) {
    return http.post("/recursos/add", data);
  }

  get(id) {
    return http.get(`/recursos/${id}`);
  }

  delete(id) {
    return http.delete(`/recursos/${id}`);
  }
}

export default new UploadFilesService();