import http from "../http-common";

class CarreRamoDataService {
  getAll() {
    return http.get("/carreramos/all");
  }

  create(data) {
    return http.post("/carreramos/add", data);
  }

  update(id, data) {
    return http.put(`/carreramos/${id}`, data);
  }

  delete(id) {
    return http.delete(`/carreramos/${id}`);
  }
}

export default new CarreRamoDataService();