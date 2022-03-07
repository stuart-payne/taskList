import React, { useState } from "react";
import { object, string } from "yup";
import { Formik, Form } from "formik";
import { TextField, ServerMessage } from "components";
import { Button, Stack, Heading } from "@chakra-ui/react";

interface AddListFormProps {
  onSuccess: () => void;
  cancel: () => void;
}

interface FormValues {
  name: string;
}

const schema = object().shape({
  name: string()
    .min(2, "Must be longer than two character")
    .max(50, "Too long")
    .required("Must give the list a name"),
});

export const AddListForm = ({ onSuccess, cancel }: AddListFormProps) => {
  const [serverMessage, setServerMessage] = useState("");
  const handleSubmit = async (values: FormValues) => {
    const response = await fetch("/api/list", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      onSuccess();
    } else {
      setServerMessage(await response.json());
    }
  };

  return (
    <Formik
      onSubmit={handleSubmit}
      validationSchema={schema}
      initialValues={{ name: "" }}
    >
      <Form>
        <Heading size="md" fontWeight="semibold">
          Create New List
        </Heading>
        <Stack direction="row" align="end" mt={2} borderTopWidth="1px" pt={4}>
          <TextField type="text" name="name" label="Name" />
          <Button variant="outline" colorScheme="blue" onClick={cancel}>
            Cancel
          </Button>
          <Button type="submit" colorScheme="blue">
            Add
          </Button>
        </Stack>
        {serverMessage && (
          <ServerMessage type="error" message={serverMessage} />
        )}
      </Form>
    </Formik>
  );
};
