import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Avatar,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { GoogleLogin } from "react-google-login";

import Icon from "./icon";
import useStyles from "./styles";
import { LockOutlined } from "@material-ui/icons";
import { Input } from "..";
import {
  formSignin,
  formSignup,
  setGoogleAuth,
} from "../../features/authSlice";
import { sm } from "../../utils/screenSize";
import { snackMessages } from "../../snackMessages";
import { showSnack } from "react-redux-snackbar";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const Auth = ({
  values: { firstName, lastName, email, password, confirmPassword },
  errors,
  touched,
  handleChange,
  isValid,
  setFieldTouched,
}) => {
  const [formData, setFormData] = useState(initialState);
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);

  const switchMode = () => {
    // setForm(initialState);
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { formData, history };
    if (isSignup) {
      dispatch(formSignup(data));
    } else {
      dispatch(formSignin(data));
    }
  };

  const googleSuccess = async (res) => {
    const result = await res?.profileObj;
    const token = await res?.tokenId;
    try {
      const data = { result, token };
      dispatch(setGoogleAuth(data));
      history.push("/");
      dispatch(
        showSnack("googleSuccess", {
          label: snackMessages.googleSuccess,
          timeout: 6000,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const googleError = () => {
    dispatch(
      showSnack("googleError", {
        label: snackMessages.googleError,
        timeout: 6000,
      })
    );
  };

  const change = (name, e) => {
    e.persist();
    handleChange(e);
    setFieldTouched(name, true, false);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const helperText = (name) => (touched[name] ? errors[name] : "");
  const err = (name) => touched[name] && Boolean(errors[name]);

  return (
    <Container component="main" maxWidth="xs" disableGutters={sm && true}>
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          {isSignup ? "Sign up" : "Sign in"}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignup && (
              <>
                <Input
                  name="firstName"
                  label="First Name"
                  handleChange={(e) => change("firstName", e)}
                  autoFocus
                  half
                  helperText={helperText("firstName")}
                  error={err("firstName")}
                  value={firstName}
                />
                <Input
                  name="lastName"
                  label="Last Name"
                  handleChange={(e) => change("lastName", e)}
                  half
                  helperText={helperText("lastName")}
                  error={err("lastName")}
                  value={lastName}
                />
              </>
            )}
            <Input
              name="email"
              label="Email Address"
              handleChange={(e) => change("email", e)}
              type="email"
              helperText={helperText("email")}
              error={err("email")}
              value={email}
            />
            <Input
              name="password"
              label="Password"
              handleChange={(e) => change("password", e)}
              type={showPassword ? "text" : "password"}
              handleShowPassword={handleShowPassword}
              helperText={helperText("password")}
              error={err("password")}
              value={password}
            />
            {!isSignup && (
              <label htmlFor="password" style={{ marginLeft: "10px" }}>
                <Link to="/forgotpassword">Forgot Password?</Link>
              </label>
            )}
            {isSignup && (
              <Input
                name="confirmPassword"
                label="Repeat Password"
                handleChange={(e) => change("confirmPassword", e)}
                type="password"
                helperText={helperText("confirmPassword")}
                error={err("confirmPassword")}
                value={confirmPassword}
              />
            )}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={isSignup && !isValid}
          >
            {isSignup ? "Sign Up" : "Sign In"}
          </Button>
          <GoogleLogin
            clientId="564842978452-tm3hgg3ff5m9k2olbtmvap0m2skag09e.apps.googleusercontent.com"
            onSuccess={googleSuccess}
            onFailure={googleError}
            cookiePolicy="single_host_origin"
            uxMode="popup"
            render={(renderProps) => (
              <Button
                className={classes.googleButton}
                color="primary"
                fullWidth
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                startIcon={<Icon />}
                variant="contained"
              >
                Google Sign In
              </Button>
            )}
          />
          <Grid container justify="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                {isSignup
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};
