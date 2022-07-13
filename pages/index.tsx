import type { NextPage } from "next";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import SideBar from "../components/SideBar";
import Collection from "../components/Collection";
import styles from "../styles/createCol.module.css";

const Home: NextPage = () => {
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
