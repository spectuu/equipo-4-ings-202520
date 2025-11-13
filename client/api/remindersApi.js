import axiosInstance from "./axiosConfig";

function extractDataOrThrow(response) {
  const res = response?.data;
  if (!res) throw new Error("No response from server");
  
  // Si la respuesta tiene estructura { code, data, message/display }
  // El backend usa code: 0 para éxito, o code >= 200 para éxito HTTP
  if (res?.data !== undefined && (res?.code === 0 || (res?.code >= 200 && res?.code < 300))) {
    return res.data;
  }
  
  // Si la respuesta es directamente un array u objeto (sin wrapper)
  if (Array.isArray(res) || (typeof res === 'object' && res !== null && !res.code)) {
    return res;
  }
  
  // Si hay un código de error
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

const ReminderApi = {
  async mine() {
    try {
      const response = await axiosInstance.get("/reminders/mine");
      return extractDataOrThrow(response);
    } catch (err) {
      throw new Error(toReadableError(err, "Could not fetch reminders"));
    }
  },

  async create(payload) {
    try {
      const response = await axiosInstance.post("/reminders", payload);
      return extractDataOrThrow(response);
    } catch (err) {
      throw new Error(toReadableError(err, "Could not create reminder"));
    }
  },

  async update(id, payload) {
    try {
      // Convertir el ID a número entero, manejando diferentes formatos
      let numericId;
      const originalId = id;
      
      // Si el ID es un objeto con propiedades (como ULong serializado de JOOQ)
      if (id && typeof id === 'object' && id !== null) {
        // Intentar obtener el valor numérico del objeto
        if (id.value !== undefined) {
          numericId = parseInt(String(id.value), 10);
        } else if (id.longValue !== undefined) {
          numericId = parseInt(String(id.longValue), 10);
        } else if (id.toString) {
          numericId = parseInt(String(id).trim(), 10);
        } else {
          numericId = parseInt(JSON.stringify(id), 10);
        }
      } else if (typeof id === 'string') {
        // Si es string, remover espacios y convertir
        numericId = parseInt(id.trim(), 10);
      } else if (typeof id === 'number') {
        // Si ya es número, asegurar que sea entero
        numericId = Math.floor(id);
      } else {
        numericId = parseInt(id, 10);
      }
      
      if (isNaN(numericId) || numericId <= 0 || !Number.isInteger(numericId)) {
        console.error("Invalid reminder ID:", { original: originalId, type: typeof originalId, converted: numericId });
        throw new Error("Invalid reminder ID: " + originalId);
      }
      
      console.log("Updating reminder with ID:", { original: originalId, numeric: numericId, url: `/reminders/${numericId}` });
      
      // Enviar el ID como número en la URL (se convertirá a string automáticamente)
      // Spring debería poder parsearlo a ULong si tiene el convertidor correcto
      const response = await axiosInstance.put(`/reminders/${numericId}`, payload);
      return extractDataOrThrow(response);
    } catch (err) {
      console.error("Error updating reminder:", err);
      throw new Error(toReadableError(err, "Could not update reminder"));
    }
  },

  async remove(id) {
    try {
      // Convertir el ID a número entero, manejando diferentes formatos
      let numericId;
      if (typeof id === 'string') {
        numericId = parseInt(id.trim(), 10);
      } else if (typeof id === 'number') {
        numericId = Math.floor(id);
      } else if (id && typeof id === 'object' && id.toString) {
        numericId = parseInt(String(id).trim(), 10);
      } else {
        numericId = parseInt(id, 10);
      }
      
      if (isNaN(numericId) || numericId <= 0 || !Number.isInteger(numericId)) {
        throw new Error("Invalid reminder ID: " + id);
      }
      
      // Enviar el ID como string numérico en la URL
      const response = await axiosInstance.delete(`/reminders/${numericId}`);
      return extractDataOrThrow(response);
    } catch (err) {
      throw new Error(toReadableError(err, "Could not remove reminder"));
    }
  },
};

export default ReminderApi;
