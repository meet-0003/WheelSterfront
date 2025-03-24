import { createSlice } from "@reduxjs/toolkit";

const persistedUser = (() => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    localStorage.removeItem("user"); // Clear invalid data
    return null;
  }
})();

const persistedToken = localStorage.getItem("token") || null;

const auth = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: !!persistedUser,
    role: persistedUser?.role || "user",
    user: persistedUser,
    token: persistedToken,
  },
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.role = action.payload.role;  // ✅ Ensure role updates
      state.token = action.payload.token;

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
      state.role = action.payload;
      state.user.role = action.payload;
      localStorage.setItem("user", JSON.stringify(state.user)); 
    },
    updateUser(state, action) {
      state.user = action.payload;
      state.role = action.payload.role;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    updateToken(state, action) { // ✅ Add this function
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    }
  },
});

export const authActions = auth.actions;
export default auth.reducer;

