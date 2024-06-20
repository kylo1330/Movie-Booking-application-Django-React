import { createSlice } from "@reduxjs/toolkit";

// Function to generate a random user ID
const generateRandomUserId = () => {
  // Generate a random ID (e.g., using Math.random() or a library like uuid)
  return Math.random().toString(36).substring(7);
};

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isSuperuser: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.isSuperuser = action.payload.isSuperuser;
      const userData = {
        user: action.payload.user,
        isSuperuser: action.payload.isSuperuser,
      };
      window.localStorage.setItem("user", JSON.stringify(userData));
    },
    removeUser: (state) => {
      state.user = null;
      state.isSuperuser = false;
      window.localStorage.removeItem("user");
    },
    setUserFromLocalStorage: (state) => {
      try {
        const userData = window.localStorage.getItem("user");
        if (userData) {
          const { user, isSuperuser } = JSON.parse(userData);
          state.user = user;
          state.isSuperuser = isSuperuser;
        } else {
          // If user data is not available, generate a random user ID
          state.user = { userId: generateRandomUserId() };
          state.isSuperuser = false;
        }
      } catch (error) {
        console.error("Failed to parse user data from local storage", error);
        state.user = null;
        state.isSuperuser = false;
      }
    },
  },
});

export const { setUser, removeUser, setUserFromLocalStorage } = authSlice.actions;

export default authSlice.reducer;
