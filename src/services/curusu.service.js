import http from "../http-common";

class CurUsuDataService {
  getAll() {
    return http.get("/curusus/all");
  }

  get(id) {
    return http.get(`/curusus/${id}`);
  }

  create(data) {
    return http.post("/curusus/add", data);
  }

  update(id, data) {
    return http.put(`/curusus/${id}`, data);
  }

  delete(id) {
    return http.delete(`/curusus/${id}`);
  }
}

export default new CurUsuDataService();