import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  firstName: null,
  lastName: null,
  token: null,
  isConnected: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.token = action.payload.token;
      state.isConnected = true;
      state.notifActivated = action.payload.subscription;
    },
    logout: (state) => {
      state.name = null;
      state.token = null;
      state.isConnected = false;
      state.notifActivated = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
