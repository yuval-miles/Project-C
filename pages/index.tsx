import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  Input,
} from "@mui/material";
import { trpc } from "../utils/trpc";
import AddIcon from "@mui/icons-material/Add";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  setUserCollections,
  changeCollectionName,
  deleteCollection,
} from "../store/slices/userCollectionsSlice";
import SendIcon from "@mui/icons-material/Send";
import TransitionModal from "../components/Modal";

const UserProfile = () => {
  const [input, setInput] = useState("");
  const [editName, setEditName] = useState({
    showInput: false,
    input: "",
    editingId: "",
  });
  const [modalState, setModalState] = useState({
    open: false,
    collectionId: "",
    name: "",
  });
  const collections = useSelector(
    (state: RootState) => state.userCollections,
    shallowEqual
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login");
    },
  });
  const { data, refetch, isSuccess, isFetching } = trpc.useQuery(
    ["Users.getCollections", session?.user?.name as string],
    { enabled: false, refetchOnWindowFocus: false }
  );
  const changeName = trpc.useMutation(["Collections.updateCollectionName"]);
  const createCollection = trpc.useMutation(["Collections.createCollection"]);
  const removeCollection = trpc.useMutation(["Collections.deleteCollection"]);
  const handleCreateCollection = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const data = await createCollection.mutateAsync(input);
    if (data.message === "success" && typeof data.response === "object")
      router.push(`/collection/${data.response.id}`);
  };
  useEffect(() => {
    if (status === "authenticated") {
      refetch();
    }
  }, [status, refetch]);
  useEffect(() => {
    if (isSuccess && !isFetching) {
      dispatch(setUserCollections(data.response));
    }
  }, [isSuccess, isFetching, dispatch, data?.response]);
  const handleEditName = (collectionId: string) => {
    dispatch(changeCollectionName({ collectionId, newName: editName.input }));
    setEditName({
      showInput: false,
      input: "",
      editingId: "",
    });
    changeName.mutate({ collectionID: collectionId, newName: editName.input });
  };
  const handleDeleteCollection = (collectionID: string) => {
    dispatch(deleteCollection(collectionID));
    removeCollection.mutate(collectionID);
  };
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
          flexDirection: "column",
          padding: "50px",
        }}
        gap={3}
      >
        <Typography variant="h3">My Collections:</Typography>
        <Stack
          direction={"row"}
          gap={1}
          component={"form"}
          onSubmit={handleCreateCollection}
        >
          <TextField
            required
            label="Name"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></TextField>
          <Button
            type="submit"
            variant="contained"
            endIcon={<AddIcon fontSize="large" />}
          >
            Add Collection
          </Button>
        </Stack>
        <Stack direction={"row"} gap={3}>
          {collections.map((el) => (
            <Card key={el.id} variant="outlined" sx={{ minWidth: "250px" }}>
              <CardContent sx={{ minHeight: "80px" }}>
                {editName.showInput && editName.editingId === el.id ? (
                  <Stack direction={"row"} gap={1}>
                    <Input
                      sx={{ maxWidth: "150px" }}
                      onChange={(e) =>
                        setEditName((state) => ({
                          ...state,
                          input: e.target.value,
                        }))
                      }
                      value={editName.input}
                    />
                    <IconButton onClick={() => handleEditName(el.id)}>
                      <SendIcon color="primary" />
                    </IconButton>
                  </Stack>
                ) : (
                  <Typography>{el.name}</Typography>
                )}
              </CardContent>
              <CardActions>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  width="100%"
                >
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => router.push(`/collection/${el.id}`)}
                  >
                    View
                  </Button>
                  <Stack direction={"row"}>
                    <Tooltip title="Edit name">
                      <IconButton
                        onClick={() =>
                          setEditName((state) => ({
                            ...state,
                            showInput: !state.showInput,
                            editingId: el.id,
                            input: el.name,
                          }))
                        }
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() =>
                          setModalState({
                            open: true,
                            name: el.name,
                            collectionId: el.id,
                          })
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              </CardActions>
            </Card>
          ))}
        </Stack>
        <TransitionModal
          modalState={modalState}
          setModalState={setModalState}
          handleDeleteCollection={handleDeleteCollection}
        />
      </Box>
    );
};

export default UserProfile;
