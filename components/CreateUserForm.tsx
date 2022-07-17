import React, { useState } from "react";
import { Box, Button, Typography, Stack, TextField } from "@mui/material";
import { trpc } from "../utils/trpc";

const CreateUserForm = () => {
  const [input, setInput] = useState<{
    name: string;
    password: string;
    email: string;
  }>({
    name: "",
    password: "",
    email: "",
  });
  const createUser = trpc.useMutation(["Users.createUser"]);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createUser.mutate(input);
  };
  const handleChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInput({ ...input, [field as keyof typeof input]: e.target.value });
    };
  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack gap={3}>
        <TextField
          required
          label="Username"
          value={input.name}
          onChange={handleChange("name")}
        ></TextField>
        <TextField
          required
          label="Password"
          value={input.password}
          onChange={handleChange("password")}
        ></TextField>
        <TextField
          required
          label="Email"
          value={input.email}
          onChange={handleChange("email")}
        ></TextField>
        <Button type="submit" variant="contained">
          Create User
        </Button>
      </Stack>
    </Box>
  );
};

export default CreateUserForm;
