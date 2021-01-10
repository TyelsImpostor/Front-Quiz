import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'https://spring-boot-back.herokuapp.com/api/test/';

class UserService {

  getAll() {
    return axios.get(API_URL + 'all');
  }

  create(username, email, password) {
    return axios.post(API_URL + 'users', {
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
}

export default new UserService();