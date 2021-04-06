import http from "../http-common";

class PreguntaDataService {
  getAll() {
    return http.get("/preguntas/all");
  }

  get(id) {
    return http.get(`/preguntas/${id}`);
  }

  getChart(id) {
    return http.get(`/preguntas/preguntas-chart/${id}`);
  }

  create(data) {
    return http.post("/preguntas/add", data);
  }

  update(id, data) {
    return http.put(`/preguntas/${id}`, data);
  }

  delete(id) {
    return http.delete(`/preguntas/${id}`);
  }

  findByTitulo(titulo) {
    return http.get(`/preguntas/all?titulo=${titulo}`);
  }
}

export default new PreguntaDataService();
