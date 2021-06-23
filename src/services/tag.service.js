import http from "../http-common";

class TagDataService {
  getAll() {
    return http.get("/tags/all");
  }

  get(id) {
    return http.get(`/tags/${id}`);
  }

  create(data) {
    return http.post("/tags/add", data);
  }

  update(id, data) {
    return http.put(`/tags/${id}`, data);
  }

  delete(id) {
    return http.delete(`/tags/${id}`);
  }
  findByNombre(nombre) {
    return http.get(`/tags/all?nombre=${nombre}`);
  }
}

export default new TagDataService();