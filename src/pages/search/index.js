import styles from "@/styles/Home.module.css";
import React from "react";
import Navigator from "../../../components/NavigatorBar";
import SearchBar from "../../../components/Searchbar";
import { useState,useEffect } from "react";
import axios from "axios";
export default function Product() {

  const [productsData, setProductsData] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/productDetails`);
        setProductsData(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    fetchData();
  }, []);

  return (

    <div className={styles.body}>
      <Navigator />
      <SearchBar />
      <div className={styles.sug}>
        <h4>Suggestions</h4>
      </div>
    </div>
  )
}
