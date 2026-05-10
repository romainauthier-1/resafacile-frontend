import { createSlice } from "@reduxjs/toolkit";

const initialState = [];
const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    setBookings: (state, action) => {
      return action.payload;
    },
    bookATable: (state, action) => {
      state.push(action.payload);
    },
    cancelATable: (state, action) => {
      return state.filter((resa) => resa._id !== action.payload);
    },
  },
});

export const { setBookings, bookATable, cancelATable } = bookingSlice.actions;
export default bookingSlice.reducer;
