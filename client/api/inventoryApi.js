import axios from "./axiosConfig";

const BASE_URL = "/inventory";

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

class InventoryApi {
 
  static async list() {
    try {
      const response = await axios.get(`${BASE_URL}`);
      return extractDataOrThrow(response);
    } catch (err) {
      throw new Error(toReadableError(err, "Could not fetch inventory"));
    }
  }

  static async mine() {
    try {
      const response = await axios.get(`${BASE_URL}/mine`);
      return extractDataOrThrow(response);
    } catch (err) {
      throw new Error(toReadableError(err, "Could not fetch user inventory"));
    }
  }

  static async add(payload) {
    try {
      const response = await axios.post(`${BASE_URL}/add`, payload);
      const res = response?.data;
      if (res?.data !== undefined && res?.code >= 200 && res?.code < 300) {
        return { data: res.data, display: res.display || 'Guardado correctamente' };
      }
      const msg = res?.display || res?.message || 'Request failed';
      throw new Error(msg);
    } catch (err) {
      throw new Error(toReadableError(err, "Could not add inventory item"));
    }
  }

}

export default InventoryApi;