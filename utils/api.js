import Axios from "axios";
import { BACKEND_URL } from "../constants";

const api = Axios.create({
  baseURL: BACKEND_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default api;