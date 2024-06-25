import React from "react";
import useStyles from "./styles";
import errorPage from "../../images/errorPage.jpg";

export const ErrorPage = () => {
  const classes = useStyles();
  return (
    <div className={classes.errorPage}>
      <img src={errorPage} alt="errorPage" />;
    </div>
  );
};
