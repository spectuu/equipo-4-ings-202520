export function extractDataOrThrow(response) {
    if (!response || !response.data) {
      throw new Error("Invalid server response");
    }
  
    const { code, message, data } = response.data;
  
    if (code !== 200) {
      throw new Error(message || "Unexpected error");
    }
  
    return data;
  }
  