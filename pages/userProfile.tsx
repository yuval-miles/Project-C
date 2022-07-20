import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const UserProfile = () => {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login");
    },
  });
  if (status === "loading")
    return (
      <Box
        width={"100vw"}
        height={"100vh"}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );

  return <div>TESTING</div>;
};

export default UserProfile;
