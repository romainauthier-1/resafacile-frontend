import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  restaurant: {},
  isConnected: false,
};

const connectedRestaurantSlice = createSlice({
  name: "connectedRestaurant",
  initialState,
  reducers: {
    login: (state, action) => {
      state.restaurant = action.payload;
      state.isConnected = true;
    },
    logout: (state) => {
      state.restaurant = null;
      state.isConnected = false;
    },
  },
});

export const { login, logout } = connectedRestaurantSlice.actions;
export default connectedRestaurantSlice.reducer;
