import http from "../http-common";

class QuizCurDataService {
  getAll() {
    return http.get("/quizcurs/all");
  }

  create(data) {
    return http.post("/quizcurs/add", data);
  }

  update(id, data) {
    return http.put(`/quizcurs/${id}`, data);
  }

  delete(id) {
    return http.delete(`/quizcurs/${id}`);
  }
}

export default new QuizCurDataService();