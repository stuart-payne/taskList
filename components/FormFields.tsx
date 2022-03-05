import React from "react";
import { useField } from "formik";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Text,
} from "@chakra-ui/react";

interface CustomFieldProps {
  label: string;
  name: string;
}

interface TextFieldProps extends CustomFieldProps {
  type: "text" | "password" | "email";
}

export const TextField = ({ label, ...props }: TextFieldProps) => {
  const [field, { error, touched }, helpers] = useField(props);
  console.log(error);
  return (
    <FormControl isInvalid={touched && error !== undefined}>
      <FormLabel>{label}</FormLabel>
      <Input {...field} {...props} />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export const TextAreaField = ({ label, ...props }: CustomFieldProps) => {
  const [field, { touched, error }, helpers] = useField(props);
  return (
    <FormControl isInvalid={touched && error !== undefined}>
      <FormLabel>label</FormLabel>
      <Textarea {...field} {...props} />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};
