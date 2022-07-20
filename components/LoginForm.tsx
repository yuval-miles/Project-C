import React, { useState } from "react";
import { Box, Button, Stack, TextField, InputAdornment } from "@mui/material";
import { useSession, signIn, signOut } from "next-auth/react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";

const LoginForm = () => {
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
    await signIn("credentials", {
      email: input.email,
      password: input.password,
      callbackUrl: `/`,
    });
  };
  const handleChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInput({ ...input, [field as keyof typeof input]: e.target.value });
    };
  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack gap={2}>
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
        <Button
          onClick={() => signIn("google", { callbackUrl: "/userProfile" })}
          variant="outlined"
          startIcon={<GoogleIcon />}
          sx={{ textTransform: "unset" }}
        >
          Login With Google
        </Button>
        <Button
          onClick={() => signIn("github", { callbackUrl: "/userProfile" })}
          variant="outlined"
          startIcon={<GitHubIcon />}
          sx={{ textTransform: "unset" }}
        >
          Login with github
        </Button>
        <Button onClick={() => signOut()}>logout</Button>
      </Stack>
    </Box>
  );
};

// export async function getServerSideProps(context: any) {
//   const providers = await getProviders();
//   return {
//     props: { providers },
//   };
// }

export default LoginForm;
