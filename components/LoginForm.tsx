import React, { FC, useState } from "react";
import { Box, Button, Stack, TextField, InputAdornment } from "@mui/material";
import { useSession, signIn } from "next-auth/react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const LoginForm: FC<any> = () => {
  const [input, setInput] = useState<{
    password: string;
    email: string;
    showPassword: boolean;
  }>({
    password: "",
    email: "",
    showPassword: false,
  });
  const { data: session } = useSession();
  console.log(session);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email: input.email,
      password: input.password,
      callbackUrl: `${window.location.origin}`,
    });
    console.log(res);
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
          type={input.showPassword ? "text" : "password"}
          label="Password"
          value={input.password}
          style={{ minHeight: "80px" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {input.showPassword ? (
                  <Visibility
                    cursor={"pointer"}
                    onClick={() =>
                      setInput((state) => ({
                        ...state,
                        showPassword: !state.showPassword,
                      }))
                    }
                  />
                ) : (
                  <VisibilityOff
                    cursor={"pointer"}
                    onClick={() =>
                      setInput((state) => ({
                        ...state,
                        showPassword: !state.showPassword,
                      }))
                    }
                  />
                )}
              </InputAdornment>
            ),
          }}
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
