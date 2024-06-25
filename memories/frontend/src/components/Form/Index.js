import React from "react";
import { Formik } from "formik";
import { Form } from "./Form";
import * as Yup from "yup";

const validationSchema = Yup.object({
  title: Yup.string("Enter a Title")
    .min(2, "Minimum 2 characters")
    .required("Title is required"),
  message: Yup.string("Type a message")
    .min(8, "Minimum 8 characters")
    .required("Please, type a message"),
  tags: Yup.string("Put a tag")
    .min(3, "Minimum 3 characters")
    .required("Please, tag your post"),
});

export const InputForm = () => {
  const values = {
    title: "",
    message: "",
    tags: "",
  };

  return (
    <Formik
      initialValues={values}
      validationSchema={validationSchema}
      validateOnMount={true}
    >
      {(props) => <Form {...props} />}
    </Formik>
  );
};
