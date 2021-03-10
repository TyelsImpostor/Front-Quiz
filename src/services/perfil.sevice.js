import http from "../http-common";

class PerfilDataService {
  getAll() {
    return http.get("/perfils/all");
  }

  get(id) {
    return http.get(`/perfils/${id}`);
  }

  create(data) {
    return http.post("/perfils/add", data);
  }

  update(id, data) {
    return http.put(`/perfils/${id}`, data);
  }

  delete(id) {
    return http.delete(`/perfils/${id}`);
  }
}

export default new PerfilDataService();