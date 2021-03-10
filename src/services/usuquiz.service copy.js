import http from "../http-common";

class UsuQuizDataService {
  getAll() {
    return http.get("/usuquizs/all");
  }

  create(data) {
    return http.post("/usuquizs/add", data);
  }

  update(id, data) {
    return http.put(`/usuquizs/${id}`, data);
  }

  delete(id) {
    return http.delete(`/usuquizs/${id}`);
  }
  getChart(id) {
    return http.get(`/usuquizs/usuquizs-chart/${id}`);
  }
}

export default new UsuQuizDataService();