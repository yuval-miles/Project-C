import type { NextPage } from "next";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import SideBar from "../components/SideBar";
import Collection from "../components/Collection";
import styles from "../styles/createCol.module.css";
import { createNewGrid } from "../functions/createNewGrid";
import { createGrid } from "../store/slices/collectionSlice";
import { useDispatch } from "react-redux";
import { trpc } from "../utils/trpc";
import { useEffect } from "react";

const Home: NextPage = () => {
  const dispatch = useDispatch();
  dispatch(createGrid(createNewGrid("top40")));
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
