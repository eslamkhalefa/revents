import { Formik } from "formik";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Form, Header, Label, Segment } from "semantic-ui-react";
import * as Yup from "yup";
import TextInput from "../../app/common/form/TextInput";
import { updateUserPassword } from "../../app/firestore/firebaseService";
export default function AccountPage() {
  const { currentUser } = useSelector((state) => state.auth);
  return (
    <Segment>
      <Header dividing size="large" content="Account" />
      {currentUser.providerId === "password" && (
        <>
          <Header color="teal" sub content="Change Password" />
          <p>Use this form to Change your Password</p>
          <Formik
            initialValues={{ newPassword1: "", newPassword2: "" }}
            validationSchema={Yup.object({
              newPassword1: Yup.string().required("Password is required"),
              newPassword2: Yup.string().oneOf(
                [Yup.ref("newPassword1"), null],
                "Passwords do not match"
              ),
            })}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
              try {
                await updateUserPassword(values);
              } catch (error) {
                setErrors({ auth: error.message });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, isSubmitting, isValid, dirty }) => (
              <Form className="ui form">
                <TextInput
                  name="newPassword1"
                  type="password"
                  placeholder="New Password"
                />
                <TextInput
                  name="newPassword2"
                  type="password"
                  placeholder="Confirm Password"
                />
                {errors.auth && (
                  <Label
                    basic
                    color="red"
                    style={{ marginBottom: 10 }}
                    content={errors.auth}
                  />
                )}
                <Button
                  style={{ display: "block" }}
                  type="submit"
                  disabled={!isValid || isSubmitting || !dirty}
                  loading={isSubmitting}
                  size="large"
                  positive
                  content="Update password"
                />
              </Form>
            )}
          </Formik>
        </>
      )}
      {currentUser.providerId === "facebook.com" && (
        <>
          <Header color="teal" sub content="Facebook account" />
          <p>PLease visit Facebook to update your account</p>
          <Button
            icon="facebook"
            color="facebook"
            as={Link}
            to="https://facebook.com"
            content="Go to Facebook"
          />
        </>
      )}
      {currentUser.providerId === "google.com" && (
        <>
          <Header color="teal" sub content="Google account" />
          <p>PLease visit Google to update your account</p>
          <Button
            icon="google"
            color="google plus"
            as={Link}
            to="https://google.com"
            content="Go to Google"
          />
        </>
      )}
    </Segment>
  );
}
