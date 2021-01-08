import http from "../http-common";

class PreguntaDataService {
  getAll() {
    return http.get("/preguntas");
  }

  get(id) {
    return http.get(`/preguntas/${id}`);
  }

  create(data) {
    return http.post("/preguntas", data);
  }

  update(id, data) {
    return http.put(`/preguntas/${id}`, data);
  }

  delete(id) {
    return http.delete(`/preguntas/${id}`);
  }

  deleteAll() {
    return http.delete(`/preguntas`);
  }

  findByTitle(titulo) {
    return http.get(`/preguntas?titulo=${titulo}`);
  }
}

export default new PreguntaDataService();
