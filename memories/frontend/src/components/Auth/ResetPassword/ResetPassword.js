import {
  Avatar,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import { LockOutlined } from "@material-ui/icons";
import { useState } from "react";
import { useDispatch } from "react-redux";
// import { Link } from "react-router-dom";
import { Input } from "../..";
import { resetPassword } from "../../../features/authSlice";
import { sm } from "../../../utils/screenSize";
import useStyles from "../styles";
import { useHistory } from "react-router-dom";

const initialState = {
  password: "",
  confirmPassword: "",
};

export const ResetPassword = ({
  values: { password, confirmPassword },
  errors,
  touched,
  handleChange,
  isValid,
  setFieldTouched,
  match,
}) => {
  const [formData, setFormData] = useState(initialState),
    classes = useStyles(),
    [showPassword, setShowPassword] = useState(false),
    handleShowPassword = () => setShowPassword(!showPassword),
    dispatch = useDispatch(),
    history = useHistory();

  const change = (name, e) => {
    e.persist();
    handleChange(e);
    setFieldTouched(name, true, false);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setFormData("");
    }

    const passwordDetails = {
      password: formData.password,
    };
    try {
      dispatch(resetPassword({ passwordDetails, match, history }));
    } catch (error) {
      console.log(error);
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
          Reset Password
        </Typography>
        <Typography align="center">
          Please enter a new password to access your account
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
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
            <Input
              name="confirmPassword"
              label="Repeat Password"
              handleChange={(e) => change("confirmPassword", e)}
              type={showPassword ? "text" : "password"}
              handleShowPassword={handleShowPassword}
              helperText={helperText("confirmPassword")}
              error={err("confirmPassword")}
              value={confirmPassword}
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
            Reset Password
          </Button>
        </form>
      </Paper>
    </Container>
  );
};
