import api from "./api";

export const login = async (username, password) => {
  try {
    const formData = new URLSearchParams();

    formData.append("username", username);
    formData.append("password", password);

    const res = await api.post("/api/auth/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    console.log("LOGIN SUCCESS:", res.data);

    const { access_token } = res.data;

    localStorage.setItem("access_token", access_token);

    return access_token;
  } catch (err) {
    console.log("LOGIN ERROR:", err.response?.data);
    console.log("STATUS:", err.response?.status);
    throw err;
  }
};

export const telegramLogin = async (initData) => {
  const res = await api.post("/api/telegram/login", {
    initData,
  });

  const { access_token } = res.data;

  localStorage.setItem("access_token", access_token);

  return access_token;
};

export const logout = () => {
  localStorage.removeItem("access_token");
};
