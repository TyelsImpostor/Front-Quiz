import http from "../http-common";

class RetroalimentacionService {

  getAll() {
    return http.get("/retroalimentacions/all");
  }

  get(id) {
    return http.get(`/retroalimentacions/${id}`);
  }

  create(data) {
    return http.post("/retroalimentacions/add", data);
  }

  update(id, data) {
    return http.put(`/retroalimentacions/${id}`, data);
  }

  delete(id) {
    return http.delete(`/retroalimentacions/${id}`);
  }

  findByEnunciado(enunciado) {
    return http.get(`/retroalimentacions/all?enunciado=${enunciado}`);
  }
}

export default new RetroalimentacionService();