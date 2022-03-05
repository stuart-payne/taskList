import type { NextPage } from "next";
import { Button, Stack, Box, Center } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { useState } from "react";
import { TextField } from "components/FormFields";
import { ServerMessage } from "components/ServerMessage";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "lib/sessionConfig";

interface LoginFormValues {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup.string().email().required("Email address missing"),
  password: yup.string().required("Must enter password"),
});

const Login: NextPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const onSubmit = async (values: LoginFormValues) => {
    setErrorMessage("");
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      setErrorMessage((await response.json()).message);
    }
  };
  return (
    <Center h="100vh">
      <Box borderWidth="2px" p={4} boxShadow="md">
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={onSubmit}
          validationSchema={schema}
        >
          <Form>
            <Stack>
              <TextField label="Email" name="email" type="email" />
              <TextField label="Password" name="password" type="password" />
              <Button type="submit" colorScheme="blue">
                Login
              </Button>
              {errorMessage && (
                <ServerMessage message={errorMessage} type="error" />
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

export default Login;
