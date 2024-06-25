import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
  name: "modal",
  initialState: {
    open: false,
  },
  reducers: {
    setModal: (state) => {
      state.open ? (state.open = false) : (state.open = true);
    },
  },
});

export const { setModal } = modalSlice.actions;

export const selectModal = (state) => state.modal;
export default modalSlice.reducer;
