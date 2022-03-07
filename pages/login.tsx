import type { NextPage } from "next";
import {
  Button,
  Stack,
  Box,
  Center,
  Heading,
  Text,
  Link,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { useState } from "react";
import { TextField } from "components/FormFields";
import { ServerMessage } from "components/ServerMessage";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "lib/sessionConfig";
import NextLink from "next/link";
import { useRouter } from "next/router";

interface LoginFormValues {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup.string().email().required("Email address missing"),
  password: yup.string().required("Must enter password"),
});

const Login: NextPage = () => {
  const router = useRouter();
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
    } else {
      router.push("/");
    }
  };
  return (
    <Center h="100vh">
      <Box boxShadow="lg" p={4} bgColor="white">
        <Heading textAlign="center" size="lg" fontWeight="semibold">
          Task List Login
        </Heading>
        <Box p={4}>
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
                <Text>
                  Need an account? Register{" "}
                  <NextLink href="/register" passHref>
                    <Link textDecor="underline" textColor="blue">
                      here
                    </Link>
                  </NextLink>
                </Text>
              </Stack>
            </Form>
          </Formik>
        </Box>
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

export default Login;
