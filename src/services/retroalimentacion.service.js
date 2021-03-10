import http from "../http-common";

class RetroalimentacionService {

  getAll() {
    return http.get("/retroalimentacions/all");
  }

  get(id) {
    return http.get(`/retroalimentacions/${id}`);
  }

  delete(id) {
    return http.delete(`/retroalimentacions/${id}`);
  }
}

export default new RetroalimentacionService();