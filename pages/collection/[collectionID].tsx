import type { NextPage } from "next";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import SideBar from "../../components/SideBar";
import Collection from "../../components/Collection";
import styles from "../../styles/createCol.module.css";
import { createNewGrid } from "../../functions/createNewGrid";
import { createGrid } from "../../store/slices/collectionSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

let initialLoad = true;

const Home: NextPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login");
    },
  });
  if (initialLoad && status === "authenticated") {
    dispatch(createGrid(createNewGrid("top40")));
    initialLoad = false;
  }
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
  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.mainContainer}>
        <SideBar />
        <Collection />
      </div>
    </DndProvider>
  );
};

export default Home;
