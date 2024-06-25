import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api";
import { showSnack } from "react-redux-snackbar";
import { snackMessages } from "../snackMessages";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    authData: null,
    authFormData: null,
    // forgotPassword: null,
    reset: null,
  },
  reducers: {
    setGoogleAuth: (state, { payload }) => {
      localStorage.setItem("profile", JSON.stringify({ ...payload }));
      state.authData = payload;
    },
    setLogout: (state, { payload }) => {
      localStorage.clear();
      state.authData = null;
    },
    authFormData: (state, { payload }) => {
      localStorage.setItem("profile", JSON.stringify({ ...payload }));
      state.authFormData = payload;
    },
    // forgotPasswordReducer: (state, { payload }) => {
    //   console.log(payload);
    //   state.forgotPassword = payload;
    // },
    resetPasswordReducer: (state, { payload }) => {
      state.reset = payload;
    },
  },
});

const formSignin = createAsyncThunk(
  "auth/formSignin",
  async ({ formData, history }, { dispatch }) => {
    try {
      const { data } = await api.signin(formData);
      dispatch(authFormData(data));
      history.push("/");
      dispatch(
        showSnack("formSignIn", {
          label: snackMessages.signin,
          timeout: 6000,
        })
      );
    } catch (error) {
      console.log("Invalid credentials");
      dispatch(
        showSnack("formSignInFail", {
          label: snackMessages.signinFail,
          timeout: 6000,
        })
      );
    }
  }
);
const formSignup = createAsyncThunk(
  "auth/formSignup",
  async ({ formData, history }, { dispatch }) => {
    try {
      const { data } = await api.signup(formData);
      dispatch(authFormData(data));
      history.push("/");
      dispatch(
        showSnack("formSignUp", {
          label: snackMessages.signup,
          timeout: 6000,
        })
      );
    } catch (error) {
      console.log("Invalid credentials");
      dispatch(
        showSnack("formSignUpFail", {
          label: snackMessages.signupFail,
          timeout: 6000,
        })
      );
    }
  }
);
const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data, { dispatch }) => {
    try {
      console.log(data);
      // const { data } =
      await api.forgotpassword(data);
      // console.log("DATA", data);
      // dispatch(forgotPasswordReducer(data));
      dispatch(
        showSnack("forgotPassword", {
          label: snackMessages.forgotPasswordSuccess,
          timeout: 6000,
        })
      );
    } catch (error) {
      console.log(error);
      dispatch(
        showSnack("forgotPasswordFail", {
          label: snackMessages.forgotPasswordFail,
          timeout: 6000,
        })
      );
    }
  }
);

const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ passwordDetails, match, history }, { dispatch }) => {
    try {
      const { data } = await api.resetpassword(passwordDetails, match);
      dispatch(resetPasswordReducer(data));
      history.push("/auth");
      dispatch(
        showSnack("resetPassword", {
          label: snackMessages.resetPasswordSuccess,
          timeout: 6000,
        })
      );
    } catch (error) {
      dispatch(
        showSnack("resetPasswordFail", {
          label: snackMessages.resetPasswordError,
          timeout: 6000,
        })
      );
    }
  }
);
export { formSignin, formSignup, forgotPassword, resetPassword };
export const {
  setGoogleAuth,
  setLogout,
  authFormData,
  // forgotPasswordReducer,
  resetPasswordReducer,
} = authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
