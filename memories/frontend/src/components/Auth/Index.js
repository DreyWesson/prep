import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Auth } from "..";

const validationSchema = Yup.object({
  firstName: Yup.string("Enter your first name").required(
    "First name is required"
  ),
  lastName: Yup.string("Enter your last name").required(
    "Last name is required"
  ),
  email: Yup.string("Enter your email")
    .email("Invalid email format")
    .required("Email is required"),

  password: Yup.string("Enter your new password")
    .min(6, "Minimum 6 characters")
    .required("Please, enter a new password"),

  confirmPassword: Yup.string("Confirm your new password")
    .oneOf([Yup.ref("password")], "Password's not match")
    .required("Please, Confirm your new password"),
});

export const AuthForm = () => {
  const values = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  return (
    <Formik
      initialValues={values}
      validationSchema={validationSchema}
      validateOnMount={true}
    >
      {(props) => <Auth {...props} />}
    </Formik>
  );
};
