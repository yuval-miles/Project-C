import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import { trpc } from "../utils/trpc";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { debounce } from "../functions/debounce";

const emailValidator: RegExp =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const regexArr: RegExp[] = [/([^A-Za-z_.])/, /^([_.])/, /([_.]{2})/, /([_.])$/];
const passwordValidator: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const checkUsername = (value: string): string => {
  if (value.length < 5) return "Username is less than 5 characters long";
  if (regexArr[0].test(value))
    return "Username can only contain letters or _ .";
  if (regexArr[1].test(value)) return "Username can not start with a _ or .";
  if (regexArr[2].test(value)) return ". or _ can not repeat";
  if (regexArr[3].test(value)) return "Username can not end with a _ or .";
  return "";
};

const CreateUserForm = () => {
  const [input, setInput] = useState<{
    name: string;
    password: string;
    email: string;
    emailValid: boolean;
    showPassword: boolean;
    confirmPassword: string;
    nameValid: string;
    passwordValid: boolean;
    passwordsMatch: boolean;
  }>({
    name: "",
    password: "",
    confirmPassword: "",
    email: "",
    emailValid: true,
    nameValid: "",
    passwordValid: true,
    showPassword: false,
    passwordsMatch: true,
  });
  const createUser = trpc.useMutation(["Users.createUser"]);
  const { data: isUserValid, refetch } = trpc.useQuery(
    ["Users.userExists", { email: input.email, userName: input.name }],
    { enabled: false, refetchOnWindowFocus: false }
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getIsUserValid = useCallback(
    debounce(() => {
      refetch();
    }, 300),
    []
  );
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !input.name ||
      !input.password ||
      !input.email ||
      !input.emailValid ||
      !input.passwordValid ||
      input.nameValid ||
      !input.passwordsMatch ||
      (typeof isUserValid?.response !== "string" &&
        isUserValid?.response.emailExists &&
        isUserValid?.response.usernameExists)
    )
      return;
    createUser.mutate({
      name: input.name,
      email: input.email,
      password: input.password,
    });
  };
  const handleChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (field === "email" && e.target.value)
        setInput({
          ...input,
          email: e.target.value,
          emailValid: emailValidator.test(e.target.value),
        });
      else if (field === "name" && e.target.value)
        setInput({
          ...input,
          name: e.target.value,
          nameValid: checkUsername(e.target.value),
        });
      else if (field === "password" && e.target.value)
        setInput({
          ...input,
          password: e.target.value,
          passwordValid: passwordValidator.test(e.target.value),
        });
      else if (field === "confirmPassword")
        setInput({
          ...input,
          confirmPassword: e.target.value,
          passwordsMatch: input.password === e.target.value,
        });
      else
        setInput({ ...input, [field as keyof typeof input]: e.target.value });

      getIsUserValid();
    };
  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack gap={1} style={{ minWidth: "400px" }}>
        <TextField
          required
          error={input.nameValid !== "" && input.name !== ""}
          label="Username"
          value={input.name}
          helperText={input.name ? input.nameValid : ""}
          style={{ minHeight: "80px" }}
          onChange={handleChange("name")}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {input.name &&
                typeof isUserValid?.response !== "string" &&
                !input.nameValid ? (
                  !isUserValid?.response.usernameExists ? (
                    <DoneIcon color="success" />
                  ) : (
                    <CloseIcon color="error" />
                  )
                ) : (
                  <></>
                )}
              </InputAdornment>
            ),
          }}
        ></TextField>
        <TextField
          required
          type={input.showPassword ? "text" : "password"}
          label="Password"
          value={input.password}
          style={{ minHeight: "80px" }}
          error={!input.passwordValid && input.password !== ""}
          helperText={
            !input.passwordValid && input.password !== ""
              ? "Minimum eight characters, at least one letter and one number"
              : ""
          }
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
        <TextField
          required
          error={!input.passwordsMatch && input.confirmPassword !== ""}
          helperText={
            !input.passwordsMatch && input.confirmPassword
              ? "Passwords don't match"
              : ""
          }
          type={input.showPassword ? "text" : "password"}
          style={{ minHeight: "80px" }}
          label="Confirm password"
          value={input.confirmPassword}
          onChange={handleChange("confirmPassword")}
        ></TextField>
        <TextField
          error={!input.emailValid}
          required
          label="Email"
          style={{ minHeight: "80px" }}
          value={input.email}
          onChange={handleChange("email")}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {input.email && typeof isUserValid?.response !== "string" ? (
                  !isUserValid?.response.emailExists && input.emailValid ? (
                    <DoneIcon color="success" />
                  ) : (
                    <CloseIcon color="error" />
                  )
                ) : (
                  <></>
                )}
              </InputAdornment>
            ),
          }}
        ></TextField>
        <Button type="submit" variant="contained">
          Create User
        </Button>
      </Stack>
    </Box>
  );
};

export default CreateUserForm;
