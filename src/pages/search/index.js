import styles from "@/styles/Home.module.css";
import React from "react";
import Navigator from "../../../components/NavigatorBar";
import SearchBar from "../../../components/Searchbar";
export default function Product() {
  return (

    <div className={styles.body}>
      <Navigator/>
      <SearchBar/>
          <div className={styles.sug}>
          <h4>Suggestions</h4>
          </div>
    </div>
  )
}
