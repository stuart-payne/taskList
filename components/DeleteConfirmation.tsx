import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalFooter,
  ModalContent,
  Center,
  Text,
  Button,
} from "@chakra-ui/react";

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  deleteCb: () => void;
}

export const DeleteConfirmation = ({
  isOpen,
  onClose,
  message,
  deleteCb,
}: DeleteConfirmationProps) => {
  const confirmationHandler = () => {
    onClose();
    deleteCb();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <Center p={4}>
          <Text>{message}</Text>
        </Center>
        <ModalFooter>
          <Button mr={4} variant="outline" colorScheme="blue" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={confirmationHandler}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
