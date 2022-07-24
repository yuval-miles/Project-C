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
import { useEffect, useRef } from "react";
import AppBarComp from "../../components/AppBarComp";

const Home: NextPage<{ collectionID: string }> = ({ collectionID }) => {
  const initialLoad = useRef(true);
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, isLoading, isSuccess, isFetching } = trpc.useQuery(
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
  useEffect(() => {
    return () => {
      initialLoad.current = true;
    };
  }, []);
  if (
    initialLoad.current &&
    status === "authenticated" &&
    isSuccess &&
    !isFetching
  ) {
    if (typeof data.response === "string") return <div>{data.response}</div>;
    const settings = data.response.collectionSetting as {
      collectionType: string;
      gridRows: number;
      gridColumns: number;
      checkboxArr: string[];
      padding: number;
    };
    console.log(settings);
    console.log(Object.keys(settings).length);
    dispatch(updateCollectionId(collectionID));
    dispatch(updateAddedItems(data.response.addedItems as AddedItemsType));
    Object.keys(settings).length !== 0
      ? dispatch(updateOptions(settings))
      : dispatch(
          updateOptions({
            collectionType: "top40",
            gridRows: 5,
            gridColumns: 7,
            itemPadding: 0,
            checkboxArr: [],
            padding: 5,
            showOptions: false,
          })
        );
    Object.assign(addedItemsObj, data.response.addedItems as AddedItemsType);
    dispatch(
      createGrid(
        Object.keys(settings).length !== 0
          ? createNewGrid(
              settings.collectionType,
              data.response.addedItems as AddedItemsType,
              settings.gridRows,
              settings.gridColumns
            )
          : createNewGrid("top40", data.response.addedItems as AddedItemsType)
      )
    );
    initialLoad.current = false;
  }
  if (status === "loading" || isLoading || isFetching)
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

Home.getLayout = function getLayout(page: React.ReactNode) {
  return <AppBarComp>{page}</AppBarComp>;
};

export default Home;
