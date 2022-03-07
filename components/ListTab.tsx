import React, {
  useState,
  useCallback,
  useEffect,
  FormEvent,
  useMemo,
} from "react";
import {
  Box,
  Text,
  Stack,
  Select,
  Button,
  Divider,
  Heading,
  Modal,
  ModalOverlay,
  ModalFooter,
  ModalContent,
  useDisclosure,
  Center,
} from "@chakra-ui/react";
import { List } from "@prisma/client";
import { AddListForm, DeleteConfirmation } from "components";

interface ListTabProps {
  onListChange: (listId: number) => void;
}

export const ListTab = ({ onListChange }: ListTabProps) => {
  const [stale, setStale] = useState(true);
  const [displayForm, setDisplayForm] = useState(false);
  const [lists, setLists] = useState<List[]>([]);
  const [selectedList, setSelectedList] = useState("All");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const deleteList = async () => {
    const id = lists.find((list) => list.name === selectedList)?.id;
    if (id) {
      const response = await fetch("/api/list", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setStale(true);
        setSelectedList("All");
      }
    }
  };

  const getLists = useCallback(async () => {
    const response = await fetch("/api/list");
    if (response.ok) {
      setLists(await response.json());
      setStale(false);
    }
  }, [setLists, setStale]);

  const onAddFormSuccess = () => {
    setStale(true);
    setDisplayForm(false);
  };

  useEffect(() => {
    if (stale) {
      getLists();
    }
  }, [getLists, stale, setSelectedList, lists]);

  const handleSelectChange = (event: FormEvent<HTMLSelectElement>) => {
    setSelectedList(event.currentTarget.value);
    const foundListId = lists.find(
      (list: List) => list.name === event.currentTarget.value
    )?.id;
    onListChange(foundListId ? foundListId : -1);
  };
  return (
    <Box>
      <Stack direction="column">
        <Heading size="lg" fontWeight="semibold">
          Lists
        </Heading>
        <Divider />
        <Stack direction="row">
          <Select value={selectedList} onChange={handleSelectChange}>
            <option value="All">All</option>
            {lists.map(({ name }: List, ind) => (
              <option key={ind} value={name}>
                {name}
              </option>
            ))}
          </Select>
          <Button colorScheme="blue" onClick={() => setDisplayForm(true)}>
            Add
          </Button>
          <Button
            isDisabled={selectedList === "All"}
            colorScheme="red"
            onClick={onOpen}
          >
            Delete
          </Button>
        </Stack>
        {displayForm && (
          <AddListForm
            onSuccess={onAddFormSuccess}
            cancel={() => setDisplayForm(false)}
          />
        )}
      </Stack>
      <DeleteConfirmation
        message="Are you sure you want to delete this list? It will delete all tasks in the list."
        isOpen={isOpen}
        onClose={onClose}
        deleteCb={deleteList}
      />
    </Box>
  );
};
