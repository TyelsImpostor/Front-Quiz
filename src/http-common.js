import axios from "axios";

export default axios.create({
  baseURL: "https://spring-boot-back.herokuapp.com/api",
  headers: {
    "Content-type": "application/json"
  }
});