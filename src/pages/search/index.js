import styles from "@/styles/Home.module.css";
import React from "react";
import Navigator from "../../components/NavigatorBar";
import SearchBar from "../../components/Searchbar";
import { useState,useEffect } from "react";
import axios from "axios";
export default function Product() {

  const [productsData, setProductsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredProducts = productsData.filter((product) => {
    return (
      product.brand.toLowerCase().includes(searchQuery) ||
      product.model.toLowerCase().includes(searchQuery) ||
      product.color.toLowerCase().includes(searchQuery)
     );
  });

  return (
   
   <div className={styles.body}>
    <Navigator/>
      <SearchBar onChange={handleSearch} />
      <div className={styles.sug}>
        <h4>Suggestions</h4>
        {isLoading ? (
          <p>Loading products...</p>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className={styles.product}>
              {/* <img src={product.image} alt={product.brand} /> */}
              <div className={styles.productInfo}>
                <h5>{product.brand}</h5>
                <h6>{product.model}</h6>
                <p>฿{product.price}</p>
              
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};