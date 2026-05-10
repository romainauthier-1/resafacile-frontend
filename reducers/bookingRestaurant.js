import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  restaurant: null,
};

const bookingRestaurantSlice = createSlice({
  name: "bookingRestaurant",
  initialState,
  reducers: {
    setBookingRestaurant: (state, action) => {
      state.restaurant = action.payload;
    },
  },
});

export const { setBookingRestaurant } = bookingRestaurantSlice.actions;
export default bookingRestaurantSlice.reducer;
