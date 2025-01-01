import axios from "axios";

export const nestApi = axios.create({
    baseURL: "http://localhost:3001/api/v1",
    timeout: 30000,
  });