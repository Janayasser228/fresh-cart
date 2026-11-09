import axios from "axios";

export const BASE = "https://ecommerce.routemisr.com/api/v1";

const api = axios.create({ baseURL: BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.token = token;
  return config;
});

export default api;

export function errMsg(e) {
  return (
    e?.response?.data?.message ||
    e?.response?.data?.errors?.msg ||
    e?.message ||
    "Something went wrong"
  );
}

export function decodeToken(token) {
  try {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(part));
  } catch {
    return null;
  }
}

export const priceOf = (p) => p.priceAfterDiscount ?? p.price;
