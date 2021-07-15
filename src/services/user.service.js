import axios from 'axios';
import authHeader from './auth-header';
import http from "../http-common";

const API_URL = 'https://spring-boot-back.herokuapp.com/api/users/';

class UserService {

  getAll() {
    return axios.get(API_URL + 'all');
  }

  create(username, email, password) {
    return axios.post(API_URL + 'teacher-add', {
      username,
      email,
      password
    });
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + 'mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'teacher', { headers: authHeader() });
  }

  getChart(id) {
    return http.get(`/users/users-chart/${id}`);
  }

  update(id, data) {
    return http.put(`/users/${id}`, data);
  }
  
  delete(id) {
    return http.delete(`/users/${id}`);
  }

  findByUsername(username) {
    return http.get(`/users/all?username=${username}`);
  }
}

export default new UserService();