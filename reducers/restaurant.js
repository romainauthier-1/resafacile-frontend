import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: null,
  _id: null,
  isConnected: false,
};

const restaurantSlice = createSlice({
  name: "restaurants",
  initialState,
  reducers: {
    login: (state, action) => {
      state.name = action.payload.name;
      state._id = action.payload._id;
      state.isConnected = true;
    },
    logout: (state) => {
      state.name = null;
      state._id = null;
      state.isConnected = false;
    },
  },
});

export const { login, logout } = restaurantSlice.actions;
export default restaurantSlice.reducer;
