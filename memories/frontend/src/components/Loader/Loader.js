import React from "react";
import useStyles from "./styles";

export const Loader = () => {
  const classes = useStyles();
  return (
    <div className={classes.loaderContainer}>
      <div className={classes.loader}></div>
    </div>
  );
};
