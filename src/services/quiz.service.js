import http from "../http-common";

class QuizDataService {
  getAll() {
    return http.get("/quizs/all");
  }

  get(id) {
    return http.get(`/quizs/${id}`);
  }

  create(data) {
    return http.post("/quizs/add", data);
  }

  update(id, data) {
    return http.put(`/quizs/${id}`, data);
  }

  delete(id) {
    return http.delete(`/quizs/${id}`);
  }

  findByTitulo(titulo) {
    return http.get(`/quizs/all?titulo=${titulo}`);
  }
}

export default new QuizDataService();