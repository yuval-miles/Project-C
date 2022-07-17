import React, { useState } from "react";
import { Box, Button, Typography, Stack, TextField } from "@mui/material";
import { trpc } from "../utils/trpc";

const LoginForm = () => {
  const [input, setInput] = useState<{
    password: string;
    email: string;
  }>({
    password: "",
    email: "",
  });
  const { data, refetch } = trpc.useQuery(["Users.getUser", input], {
    enabled: false,
    refetchOnWindowFocus: false,
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refetch();
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
          label="Email"
          value={input.email}
          onChange={handleChange("email")}
        ></TextField>
        <TextField
          required
          label="Password"
          value={input.password}
          onChange={handleChange("password")}
        ></TextField>
        <Button type="submit" variant="contained">
          Login
        </Button>
      </Stack>
    </Box>
  );
};

export default LoginForm;
