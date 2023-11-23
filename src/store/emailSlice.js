// emailSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const emailSlice = createSlice({
  name: 'email',
  initialState: {
    latestEmail: null,
  },
  reducers: {
    setLatestEmail: (state, action) => {
      state.latestEmail = action.payload;
    },
  },
});

export const { setLatestEmail } = emailSlice.actions;

export const selectLatestEmail = (state) => state.email.latestEmail;

export default emailSlice.reducer;
