import http from "../http-common";

class TagQuizDataService {
  getAll() {
    return http.get("/tagquizs/all");
  }

  create(data) {
    return http.post("/tagquizs/add", data);
  }

  update(id, data) {
    return http.put(`/tagquizs/${id}`, data);
  }

  delete(id) {
    return http.delete(`/tagquizs/${id}`);
  }
}

export default new TagQuizDataService();