// import axios from "axios";

// const localAPI = axios.create({
//   baseURL: import.meta.env.VITE_LOCAL_API_BASE_URL,
// });

// export default localAPI;


import axios from "axios";

const localAPI = axios.create({
  baseURL: import.meta.env.VITE_LOCAL_TEMU_BASE_URL,
});

// ✅ Attach EXISTING token
localAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default localAPI;