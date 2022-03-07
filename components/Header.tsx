import React from "react";
import { Flex, Box, Heading, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

export const Header = () => {
  const router = useRouter();
  const logout = async () => {
    const response = await fetch("/api/logout", {
      method: "POST",
    });
    if (response.ok) {
      router.push("/login");
    }
  };
  return (
    <Flex
      boxShadow="lg"
      px={4}
      bg="white"
      h={16}
      w="full"
      justifyContent="center"
    >
      <Flex
        justify="space-between"
        align="center"
        direction="row"
        maxW="600px"
        w="full"
      >
        <Heading size="lg" fontWeight="semibold">
          Task List
        </Heading>
        <Button onClick={logout}>Logout</Button>
      </Flex>
    </Flex>
  );
};
