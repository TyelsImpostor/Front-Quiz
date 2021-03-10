import http from "../http-common";

class RespuestaDataService {
  getAll() {
    return http.get("/respuestas/all");
  }

  get(id) {
    return http.get(`/respuestas/${id}`);
  }

  create(data) {
    return http.post("/respuestas/add", data);
  }

  update(id, data) {
    return http.put(`/respuestas/${id}`, data);
  }

  delete(id) {
    return http.delete(`/respuestas/${id}`);
  }
}

export default new RespuestaDataService();
