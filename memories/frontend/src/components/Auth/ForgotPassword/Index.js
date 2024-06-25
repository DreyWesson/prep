import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { ForgotPassword } from "../..";

const validationSchema = Yup.object({
  email: Yup.string("Enter your email")
    .email("Invalid email format")
    .required("Email is required"),
});

export const ForgotPasswordForm = () => {
  const values = {
    email: "",
  };

  return (
    <Formik
      initialValues={values}
      validationSchema={validationSchema}
      validateOnMount={true}
    >
      {(props) => <ForgotPassword {...props} />}
    </Formik>
  );
};
