import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { ResetPassword } from "../..";

const validationSchema = Yup.object({
  password: Yup.string("Enter your new password")
    .min(8, "Minimum 8 characters")
    .required("Please, enter a new password"),

  confirmPassword: Yup.string("Confirm your new password")
    .oneOf([Yup.ref("password")], "Password's not match")
    .required("Please, Confirm your new password"),
});

export const ResetForm = ({ match }) => {
  const values = {
    password: "",
    confirmPassword: "",
  };

  return (
    <Formik
      initialValues={values}
      validationSchema={validationSchema}
      validateOnMount={true}
    >
      {(props) => <ResetPassword {...props} match={match} />}
    </Formik>
  );
};
