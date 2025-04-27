const API_URL = "http://localhost:5000/api"; // Base URL of the backend

export const checkBackendConnection = async () => {
  try {
    const response = await fetch(`${API_URL}/hello`);
    if (!response.ok) {
      throw new Error("Failed to connect to the backend");
    }
    const data = await response.json();
    console.log("Backend Response:", data); // Log the response
  } catch (error) {
    console.error("Error connecting to backend:", error);
  }
};
