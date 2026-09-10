import api from "../service/api";

let csrfToken = null;

export async function getCsrfToken() {
  if (csrfToken) return csrfToken;

  const { data } = await api.get("/csrf/get");

  csrfToken = data.csrfToken;

  return csrfToken;
}