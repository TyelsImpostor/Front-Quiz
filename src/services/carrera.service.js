import http from "../http-common";

class CarreraDataService {
  getAll() {
    return http.get("/carreras/all");
  }

  get(id) {
    return http.get(`/carreras/${id}`);
  }

  create(data) {
    return http.post("/carreras/add", data);
  }

  update(id, data) {
    return http.put(`/carreras/${id}`, data);
  }

  delete(id) {
    return http.delete(`/carreras/${id}`);
  }
}

export default new CarreraDataService();