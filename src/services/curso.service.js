import http from "../http-common";

class CursoDataService {
  getAll() {
    return http.get("/cursos/all");
  }

  get(id) {
    return http.get(`/cursos/${id}`);
  }

  create(data) {
    return http.post("/cursos/add", data);
  }

  update(id, data) {
    return http.put(`/cursos/${id}`, data);
  }

  delete(id) {
    return http.delete(`/cursos/${id}`);
  }

  findByCodigo(codigo) {
    return http.get(`/cursos/all?codigo=${codigo}`);
  }
}

export default new CursoDataService();