import http from "../http-common";

class TagPreDataService {
  getAll() {
    return http.get("/tagpres/all");
  }

  create(data) {
    return http.post("/tagpres/add", data);
  }

  update(id, data) {
    return http.put(`/tagpres/${id}`, data);
  }

  delete(id) {
    return http.delete(`/tagpres/${id}`);
  }
}

export default new TagPreDataService();