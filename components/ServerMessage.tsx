import { Alert, AlertIcon } from "@chakra-ui/react";

interface ServerMessageProps {
  type: "success" | "error";
  message: string;
}

export const ServerMessage = ({ type, message }: ServerMessageProps) => {
  return (
    <Alert status={type}>
      <AlertIcon />
      {message}
    </Alert>
  );
};
