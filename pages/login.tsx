import { Button, Stack } from "@mui/material";
import React, { useState } from "react";
import CreateUserForm from "../components/CreateUserForm";
import LoginForm from "../components/LoginForm";
import styles from "../styles/loginPage.module.css";

const LoginPage = () => {
  const [showLogin, setShowLogin] = useState<Boolean>(true);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShowLogin((state) => !state);
  };
  return (
    <div className={styles.loginPageContainer}>
      <Stack gap={3}>
        {showLogin ? (
          <LoginForm />
        ) : (
          <CreateUserForm toggleLogin={setShowLogin} />
        )}
        <Button variant="text" onClick={handleClick}>
          {showLogin ? "Dont have an account?" : "Already have an account?"}
        </Button>
      </Stack>
    </div>
  );
};

export default LoginPage;
