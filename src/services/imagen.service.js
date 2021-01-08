import http from "../http-common";

class UploadFilesService {

  getAll() {
    return http.get("/imagens/all");
  }

  get(id) {
    return http.get(`/imagens/${id}`);
  }
}

export default new UploadFilesService();