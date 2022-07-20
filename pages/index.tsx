import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Button, Stack, Typography } from "@mui/material";
import { trpc } from "../utils/trpc";

const UserProfile = () => {
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login");
    },
  });
  const { data, refetch } = trpc.useQuery(
    ["Users.getCollections", session?.user?.name as string],
    { enabled: false, refetchOnWindowFocus: false }
  );
  const createCollection = trpc.useMutation(["Collections.createCollection"]);
  useEffect(() => {
    if (status === "authenticated") {
      refetch();
    }
  }, [status, refetch]);
  if (createCollection.isSuccess && session)
    router.push(`/collection/${session.id}`);
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
  else if (status === "authenticated")
    return (
      <Box
        width={"100vw"}
        height={"100vh"}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h1">My Collections</Typography>
        <Stack direction={"row"}>
          <Button onClick={() => createCollection.mutate()}>
            Create new collection
          </Button>
          {data?.response.map((el) => (
            <div key={el.id}>{el.name}</div>
          ))}
        </Stack>
      </Box>
    );
};

export default UserProfile;
