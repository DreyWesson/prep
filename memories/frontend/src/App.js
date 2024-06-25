import { Container } from "@material-ui/core";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import useStyles from "./styles";
import { Home, Navbar } from "./components";
import { ResetForm } from "./components/Auth/ResetPassword/Index";
import { ForgotPasswordForm } from "./components/Auth/ForgotPassword/Index";
import { Snackbar as Snack } from "react-redux-snackbar";
import { AuthForm } from "./components/Auth/Index";

function App() {
  const classes = useStyles();

  return (
    <Router>
      <Container maxWidth="lg" className={classes.root}>
        <Snack />
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/auth" exact component={AuthForm} />
          <Route path="/forgotpassword" exact component={ForgotPasswordForm} />
          <Route
            path="/resetpassword/:resetToken"
            // exact
            component={ResetForm}
          />
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
