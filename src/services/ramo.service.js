import http from "../http-common";

class RamoDataService {
  getAll() {
    return http.get("/ramos/all");
  }

  get(id) {
    return http.get(`/ramos/${id}`);
  }

  create(data) {
    return http.post("/ramos/add", data);
  }

  update(id, data) {
    return http.put(`/ramos/${id}`, data);
  }

  delete(id) {
    return http.delete(`/ramos/${id}`);
  }
}

export default new RamoDataService();