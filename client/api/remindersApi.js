import axios from "./axiosConfig";

const BASE_URL = "/reminders";

function extractDataOrThrow(response) {
  const res = response?.data;
  if (!res) throw new Error("No response from server");
  if (res?.data !== undefined && res?.code >= 200 && res?.code < 300) {
    return res.data;
  }
  const msg = res?.display || res?.message || "Request failed";
  throw new Error(msg);
}

function toReadableError(err, fallback = "Request failed") {
  return (
    err?.response?.data?.display ||
    err?.response?.data?.message ||
    err?.message ||
    fallback
  );
}

class RemindersApi {
  static async mine() {
    try {
      const response = await axios.get(`${BASE_URL}/mine`);
      return extractDataOrThrow(response);
    } catch (err) {
      throw new Error(toReadableError(err, "No se pudo cargar los recordatorios"));
    }
  }

  static async add(payload) {
    try {
      const response = await axios.post(`${BASE_URL}/add`, payload);
      const res = response?.data;
      if (res?.data !== undefined && res?.code >= 200 && res?.code < 300) {
        return { data: res.data, display: res.display || "Recordatorio creado" };
      }
      const msg = res?.display || res?.message || "Request failed";
      throw new Error(msg);
    } catch (err) {
      throw new Error(toReadableError(err, "No se pudo crear el recordatorio"));
    }
  }

  static async update(reminderId, payload) {
    try {
      const response = await axios.put(`${BASE_URL}/${reminderId}`, payload);
      return extractDataOrThrow(response);
    } catch (err) {
      throw new Error(toReadableError(err, "No se pudo actualizar el recordatorio"));
    }
  }
}

export default RemindersApi;
