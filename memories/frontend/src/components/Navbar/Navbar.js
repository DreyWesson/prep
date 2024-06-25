import React from "react";
import { AppBar, Typography } from "@material-ui/core";
import useStyles from "./styles";
import memories from "../../images/memories.png";
import { Link } from "react-router-dom";
import { SnackBar } from "..";
import { sm } from "../../utils/screenSize";

export const Navbar = () => {
  const classes = useStyles();

  return (
    <AppBar
      className={`${classes.appBar} ${classes.root}`}
      position="sticky"
      color="inherit"
    >
      <div className={classes.brandContainer}>
        <img src={memories} alt="memories" height={45} />
        <Typography
          component={Link}
          to="/"
          className={classes.heading}
          variant={sm ? "h4" : "h3"}
          align="center"
          style={{ textDecoration: "none" }}
        >
          Mem
          <span className={classes.capsule}>ories</span>
        </Typography>
      </div>
      <div className={classes.snackbar}>
        <SnackBar />
      </div>
    </AppBar>
  );
};
