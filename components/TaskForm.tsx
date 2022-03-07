import React from "react";
import { Formik, Form } from "formik";
import { Stack, Button, Heading } from "@chakra-ui/react";
import { object, string, date } from "yup";
import { TextField, TextAreaField, DateTimeField } from "components";

interface TaskFormProps {
  id?: number;
  listId: number;
  onSuccess: () => void;
  cancel: () => void;
  method: "POST" | "PUT";
  initialValues?: TaskFormValues;
}

export interface TaskFormValues {
  name: string;
  description: string;
  deadline: string;
}

const schema = object().shape({
  name: string()
    .min(2, "Too short")
    .max(50, "Too long")
    .required("Must have name"),
  description: string()
    .min(2, "Too short")
    .max(200, "Max 200 characters")
    .required("Must have a description"),
  deadline: date()
    .required("Must supply a deadline")
    .min(new Date(), "Must be a time in the future"),
});

export const TaskForm = ({
  onSuccess,
  cancel,
  listId,
  method,
  initialValues,
  id,
}: TaskFormProps) => {
  const handleSubmit = async (values: TaskFormValues) => {
    const response = await fetch("/api/task", {
      method: method,
      body: JSON.stringify({ ...values, listId, id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      onSuccess();
    }
  };
  return (
    <Formik
      initialValues={
        initialValues
          ? initialValues
          : { name: "", description: "", deadline: "" }
      }
      onSubmit={handleSubmit}
      validationSchema={schema}
    >
      <Form>
        <Stack>
          <Heading fontWeight="medium" size="lg">
            {method === "POST" ? "Create New Task" : "Edit task"}
          </Heading>
          <TextField type="text" name="name" label="Name" />
          <TextAreaField label="Description" name="description" />
          <DateTimeField label="Deadline" name="deadline" />
          <Stack direction="row-reverse">
            <Button type="submit" colorScheme="blue">
              Submit
            </Button>
            <Button variant="outline1" colorScheme="blue" onClick={cancel}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Form>
    </Formik>
  );
};
