import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Select, Stack, Button } from "@chakra-ui/react";
import { List } from "@prisma/client";

interface MoveListFormProps {
  ids: number[];
  currentListId: number;
  onSuccess: () => void;
}

export const MoveListForm = ({
  ids,
  onSuccess,
  currentListId,
}: MoveListFormProps) => {
  const [lists, setLists] = useState<List[]>([]);
  const [selectedListId, setSelectedListId] = useState(0);

  const getLists = useCallback(async () => {
    const response = await fetch("/api/list");
    if (response.ok) {
      const resLists = await response.json();
      const filteredLists = resLists.filter((list: List) => {
        return list.id !== currentListId;
      });
      setLists(filteredLists);
      setSelectedListId(filteredLists[0].id);
    }
  }, [setLists, currentListId]);

  useEffect(() => {
    getLists();
  }, [getLists]);

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedListId(parseInt(event.currentTarget.value));
  };

  const moveSelected = async () => {
    const response = await fetch("/api/task", {
      method: "PATCH",
      body: JSON.stringify({ batch: ids, listId: selectedListId }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      onSuccess();
    }
  };
  return (
    <Stack direction="row">
      <Select onChange={handleSelectChange}>
        {lists.map((list, ind) => (
          <option key={ind} value={list.id}>
            {list.name}
          </option>
        ))}
      </Select>
      <Button onClick={moveSelected}>Confirm</Button>
    </Stack>
  );
};
