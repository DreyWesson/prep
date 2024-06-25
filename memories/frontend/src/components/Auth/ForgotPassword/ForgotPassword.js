import React, { useState } from "react";
import { Input } from "../Input";
import {
  Avatar,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import { LockOutlined } from "@material-ui/icons";
import { sm } from "../../../utils/screenSize";
import useStyles from "../styles";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../../../features/authSlice";

export const ForgotPassword = ({
  values: { email },
  errors,
  touched,
  handleChange,
  isValid,
  setFieldTouched,
}) => {
  const [emailData, setEmailData] = useState(""),
    classes = useStyles(),
    dispatch = useDispatch();

  const change = (name, e) => {
    e.persist();
    handleChange(e);
    setFieldTouched(name, true, false);
    setEmailData(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { email: emailData };
    try {
      dispatch(forgotPassword(data));
    } catch (error) {
      setEmailData("");
    }
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
          Forgot Password
        </Typography>
        <Typography align="center">
          Please enter the email address you register your account with. We will
          send you reset password confirmation to this email
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Input
              name="email"
              label="Email Address"
              handleChange={(e) => change("email", e)}
              type="email"
              helperText={helperText("email")}
              error={err("email")}
              value={email}
            />
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={!isValid}
          >
            Send Mail
          </Button>
        </form>
      </Paper>
    </Container>
  );
};
