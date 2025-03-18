import { createSlice } from "@reduxjs/toolkit";

// Load user from localStorage
const persistedUser = JSON.parse(localStorage.getItem("user")) || null;
const persistedToken = localStorage.getItem("token") || null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: persistedUser ? true : false,
    role: persistedUser?.role || "user",
    user: persistedUser,
    token: persistedToken,
  },
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.token = action.payload.token; // Assuming API returns token

      // Store user & token in localStorage
      localStorage.setItem("user", JSON.stringify(action.payload));
      localStorage.setItem("token", action.payload.token);
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    changeRole(state, action) {
      const role = action.payload;
      state.role = role;
    },
    updateUser(state, action) {
      state.user = action.payload;

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;


