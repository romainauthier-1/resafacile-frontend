import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {
    customer: {
      firstName: null,
      lastName: null,
      email: null,
      phoneNumber: null,
    },
    dateTime: null,
    nbPax: null,
    occasion: null,
    restaurant: null,
  },
];
const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    setBookings: (state, action) => {
      state = action.payload;
    },
    bookATable: (state, action) => {
      state.push(action.payload);
    },
    cancelATable: (state, action) => {
      state = state.filter((resa) => resa._id !== action.payload);
    },
  },
});

export const { setBookings, bookATable, cancelATable } = bookingSlice.actions;
export default bookingSlice.reducer;
