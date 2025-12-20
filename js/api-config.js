// API Configuration
const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "/api";

// API Helper Functions
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Add auth token if available
  const token = sessionStorage.getItem("admin_token");
  if (token) {
    defaultOptions.headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.error || "An error occurred";
      const errorDetails = data.details ? ` - ${data.details}` : "";
      const errorHint = data.hint ? `\n\nSuggestion: ${data.hint}` : "";

      console.error("API Error:", {
        status: response.status,
        error: errorMessage,
        details: data.details,
        hint: data.hint,
        message: data.message,
      });

      const fullError = new Error(errorMessage + errorDetails + errorHint);
      fullError.status = response.status;
      fullError.details = data.details;
      fullError.hint = data.hint;
      fullError.serverMessage = data.message;
      throw fullError;
    }

    return data;
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      console.error(
        "API Connection Error: Cannot connect to server. Make sure the server is running on",
        API_BASE_URL
      );
      const connectionError = new Error(
        "Cannot connect to server. Please make sure the backend is running."
      );
      connectionError.hint = "Run 'npm run dev' to start the server";
      throw connectionError;
    }
    console.error("API Error:", error);
    throw error;
  }
}

// Export for use in other files
window.API = {
  baseUrl: API_BASE_URL,
  request: apiRequest,
};
