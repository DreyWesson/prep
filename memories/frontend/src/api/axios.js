import axios from "axios";

export const instance = axios.create({
  // baseURL: "http://localhost:5000",
  baseURL: "https://insta-memories.herokuapp.com",
});

export default instance;
