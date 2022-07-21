import type { NextPage } from "next";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import SideBar from "../../components/SideBar";
import Collection from "../../components/Collection";
import styles from "../../styles/createCol.module.css";
import { AddedItemsType, createNewGrid } from "../../functions/createNewGrid";
import {
  createGrid,
  updateAddedItems,
  updateCollectionId,
} from "../../store/slices/collectionSlice";
import { updateOptions } from "../../store/slices/optionsSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { trpc } from "../../utils/trpc";
import { GetServerSideProps } from "next";
import { addedItemsObj } from "../../hooks/useSetGrid";

let initialLoad = true;

const Home: NextPage<{ collectionID: string }> = ({ collectionID }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, isLoading, isSuccess } = trpc.useQuery(
    ["Collections.getCollection", collectionID],
    {
      enabled: true,
      refetchOnWindowFocus: false,
    }
  );
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login");
    },
  });

  if (initialLoad && status === "authenticated" && isSuccess) {
    if (typeof data.response === "string") return <div>{data.response}</div>;
    const settings = data.response.collectionSetting as {
      collectionType: string;
      gridRows: number;
      gridColumns: number;
      checkboxArr: string[];
      padding: number;
    };
    dispatch(updateCollectionId(collectionID));
    dispatch(updateAddedItems(data.response.addedItems as AddedItemsType));
    dispatch(updateOptions(settings));
    Object.assign(addedItemsObj, data.response.addedItems as AddedItemsType);
    dispatch(
      createGrid(
        createNewGrid(
          settings.collectionType,
          data.response.addedItems as AddedItemsType,
          settings.gridRows,
          settings.gridColumns
        )
      )
    );
    initialLoad = false;
  }
  if (status === "loading" || isLoading)
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!context.params) return { props: { collectionID: "" } };
  return {
    props: {
      collectionID: context.params.collectionID,
    },
  };
};

export default Home;
