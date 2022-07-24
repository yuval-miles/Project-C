import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Typography, Stack } from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import AccountCircle from "@mui/icons-material/AccountCircle";

export default function AppBarComp({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login");
    },
  });
  if (status === "loading") return <></>;
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" style={{ background: "#fafafa" }}>
          <Toolbar>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
              width={"100%"}
            >
              <Stack direction={"row"} gap={3}>
                <AccountCircle color="primary" />
                <Typography color={"black"}>{session.user?.name}</Typography>
              </Stack>
              <Stack direction={"row"} gap={2}>
                {/^\/collection/.test(router.asPath) && (
                  <Button onClick={() => router.push("/")}>
                    Back to collections
                  </Button>
                )}
                <Button variant="contained" onClick={() => signOut()}>
                  Logout
                </Button>
              </Stack>
            </Stack>
          </Toolbar>
        </AppBar>
      </Box>
      {children}
    </>
  );
}
