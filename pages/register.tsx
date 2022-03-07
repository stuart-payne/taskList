import type { NextPage } from "next";
import { Button, Stack, Box, Center, Link, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { useState } from "react";
import { TextField, ServerMessage } from "components/";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "lib/sessionConfig";
import NextLink from "next/link";
import { useRouter } from "next/router";

interface RegisterFormValues {
  email: string;
  password: string;
  passwordConfirmation: string;
}

const schema = yup.object().shape({
  email: yup.string().email().required("Required"),
  password: yup
    .string()
    .min(8, "Password must be 8 or more characters")
    .max(50, "Password cannot be more than 50 characters long")
    .required("Required"),
  passwordConfirmation: yup
    .string()
    .min(8, "Password must be 8 or more characters")
    .max(50, "Password cannot be more than 50 characters long")
    .required("Required"),
});

const Register: NextPage = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const onSubmit = async ({ email, password }: RegisterFormValues) => {
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
    } else {
      router.push("/");
    }
  };
  const validate = ({ password, passwordConfirmation }: RegisterFormValues) => {
    const error = {};
    if (password !== passwordConfirmation) {
      // @ts-ignore
      error.passwordConfirmation = "Password mismatch";
    }
    return error;
  };
  return (
    <Center h="100vh">
      <Box boxShadow="lg" p={8} bgColor="white">
        <Formik
          initialValues={{
            email: "",
            password: "",
            passwordConfirmation: "",
          }}
          onSubmit={onSubmit}
          validate={validate}
          validationSchema={schema}
        >
          <Form>
            <Stack>
              <TextField label="Email" name="email" type="email" />
              {/* <TextField
                label="Email Confirmation"
                name="emailConfirmation"
                type="email"
              /> */}
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
              <Text>
                Already have an account? Click
                <NextLink href="/login" passHref>
                  <Link textDecor="underline" textColor="blue">
                    here
                  </Link>
                </NextLink>
              </Text>
            </Stack>
          </Form>
        </Formik>
      </Box>
    </Center>
  );
};

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
  const user = req.session.user;
  if (user) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  } else {
    return {
      props: {},
    };
  }
}, ironOptions);

export default Register;
