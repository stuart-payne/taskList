import React, { ChangeEvent, useState } from "react";
import {
  Box,
  Checkbox,
  Button,
  Text,
  Stack,
  IconButton,
} from "@chakra-ui/react";
import { TiTick } from "react-icons/ti";
import { AiFillEdit } from "react-icons/ai";
import dayjs from "dayjs";
import RelativeTime from "dayjs/plugin/relativeTime";
import { TaskFormValues } from "components";

dayjs.extend(RelativeTime);

interface TaskCardProps {
  onSelectChanged: (id: number, selected: boolean) => void;
  onComplete: () => void;
  editCb: (id: number, editFormValues: TaskFormValues) => void;
  id: number;
  name: string;
  description: string;
  deadline: Date;
  completed: boolean;
  failed: boolean;
}

export const TaskCard = ({
  onSelectChanged,
  id,
  name,
  description,
  deadline,
  completed,
  onComplete,
  editCb,
  failed
}: TaskCardProps) => {
  const [truncated, setTruncated] = useState(true);
  const completeTask = async () => {
    const response = await fetch("/api/complete", {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      onComplete();
    }
  };
  const checkboxHandler = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.currentTarget.checked);
    onSelectChanged(id, event.currentTarget.checked);
  };

  const onClick = () => {
    setTruncated((oldState) => {
      return !oldState;
    });
  };
  return (
    <Box w="full" p={4} borderWidth={2}>
      <Stack direction="row" spacing={8}>
        <Checkbox name="selected" onChange={checkboxHandler} />
        <Stack ml={2} direction="column">
          <Text fontWeight="semibold">{name}</Text>
          <Text w="14rem" isTruncated={truncated}>
            {description}
          </Text>
        </Stack>
        <Stack
          justify="space-around"
          spacing={8}
          onClick={onClick}
          direction="row"
          w="full"
          align="center"
        >
          <Text minW={16} fontWeight="semibold">
            {failed ? "Failed" : completed ? "Completed" : dayjs(deadline).fromNow()}
          </Text>
          {!failed && !completed && (
            <Stack direction="row">
              <IconButton
                icon={<AiFillEdit />}
                aria-label="edit"
                variant="outline"
                colorScheme="purple"
                onClick={() =>
                  editCb(id, {
                    name,
                    description,
                    deadline: deadline.toString(),
                  })
                }
              />
              <IconButton
                onClick={completeTask}
                variant="outline"
                colorScheme="green"
                aria-label="complete"
                icon={<TiTick />}
              />
            </Stack>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};
