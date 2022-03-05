import type { NextPage } from "next";
import { Button, Stack, Box, Center } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { object, string } from "yup";
import { useState } from "react";
import { TextField, ServerMessage } from "components/";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "lib/sessionConfig";

interface RegisterFormValues {
  email: string;
  emailConfirmation: string;
  password: string;
  passwordConfirmation: string;
}

const schema = object().shape({
  email: string().email().required("Required"),
  emailConfirmation: string()
    .required("Required")
    .when("email", (email) => {
      return string().matches(email, "Email does not match confirmation");
    }),
  password: string()
    .min(8, "Password must be 8 or more characters")
    .max(50, "Password cannot be more than 50 characters long")
    .required("Required"),
  passwordConfimation: string()
    .min(8, "Password must be 8 or more characters")
    .max(50, "Password cannot be more than 50 characters long")
    .required("Required"),
});

const Register: NextPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const onSubmit = async ({ email, password }: RegisterFormValues) => {
    console.log("hi");
    const response = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response);
    if (!response.ok) {
      setErrorMessage((await response.json()).message);
    }
  };
  return (
    <Center h="100vh">
      <Box boxShadow="lg" p={8}>
        <Formik
          initialValues={{
            email: "",
            emailConfirmation: "",
            password: "",
            passwordConfirmation: "",
          }}
          onSubmit={onSubmit}
        >
          <Form>
            <Stack>
              <TextField label="Email" name="email" type="email" />
              <TextField
                label="Email Confirmation"
                name="emailConfirmation"
                type="email"
              />
              <TextField label="Password" name="password" type="password" />
              <TextField
                label="Password Confirmation"
                name="passwordConfirmation"
                type="password"
              />
              <Button colorScheme="blue" type="submit">
                Register
              </Button>
              {errorMessage && (
                <ServerMessage type="error" message={errorMessage} />
              )}
            </Stack>
          </Form>
        </Formik>
      </Box>
    </Center>
  );
};

export const getServerSideProps = withIronSessionSsr(
  async ({ req }) => {
    const user = req.session.user;
    if (user) {
      return {
        redirect: {
          permanent: false,
          destination: "/"
        }
      }
    } else {
      return {
        props: {}
      };
    }
  }, ironOptions
)

export default Register;
