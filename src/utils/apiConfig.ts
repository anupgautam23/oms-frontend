export const API_CONFIG = {
  AUTH_SERVICE:
    import.meta.env.VITE_AUTH_SERVICE_URL || "http://localhost:8081",
  ORDER_SERVICE:
    import.meta.env.VITE_ORDER_SERVICE_URL || "http://localhost:8082",
  NOTIFICATION_SERVICE:
    import.meta.env.VITE_NOTIFICATION_SERVICE_URL || "http://localhost:8083",
};

export const getAuthToken = () => {
  return localStorage.getItem("oms_token");
};

export const makeAuthenticatedRequest = async (
  url: string,
  options: RequestInit = {}
) => {
  const token = getAuthToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("oms_token");
      localStorage.removeItem("oms_user");
      window.location.href = "/login";
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
};
