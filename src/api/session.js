import axios from "axios";

export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "access-token";
const USER_KEY = "resell-user";

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const syncSession = async (firebaseUser, name) => {
  if (!firebaseUser) {
    clearSession();
    return false;
  }

  try {
    const idToken = await firebaseUser.getIdToken();

    const { data } = await axios.post(
      `${API_URL}/users/sync`,
      {
        name: name || firebaseUser.displayName || "",
        photo: firebaseUser.photoURL || "",
      },
      { headers: { Authorization: `Bearer ${idToken}` } },
    );

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return true;
  } catch (error) {
    clearSession();
    console.error(
      "User sync failed:",
      error.response?.data?.message || error.message,
    );
    return false;
  }
};

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
};
