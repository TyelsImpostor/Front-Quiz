import http from "../http-common";

class OpcionDataService {
  getAll() {
    return http.get("/opcions/all");
  }

  get(id) {
    return http.get(`/opcions/${id}`);
  }

  create(data) {
    return http.post("/opcions/add", data);
  }

  update(id, data) {
    return http.put(`/opcions/${id}`, data);
  }

  delete(id) {
    return http.delete(`/opcions/${id}`);
  }

  findByOpcion(opcion) {
    return http.get(`/opcion?opcion=${opcion}`);
  }
}

export default new OpcionDataService();