import type { NextPage } from "next";
import SideBar from "../components/SideBar";
import Collection from "../components/Collection";
import styles from "../styles/createCol.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.mainContainer}>
      <SideBar />
      <Collection />
    </div>
  );
};

export default Home;
