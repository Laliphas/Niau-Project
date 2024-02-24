import styles from "./search.module.css";
import React from "react";
import Navigator from "../../components/NavigatorBar";
import SearchBar from "../../components/Searchbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { faL } from "@fortawesome/free-solid-svg-icons";
import styles_search from "@/components/styles/searchbar.module.css"
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from "next/link";
export default function Product() {

  const [productsData, setProductsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(productsData);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/productDetails`);
        setProductsData(response.data);
        setFilteredProducts(response.data);
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


  useEffect(() => {
    setFilteredProducts(productsData.filter((product) => {
      return (
        product.brand.toLowerCase().includes(searchQuery) ||
        product.model.toLowerCase().includes(searchQuery) ||
        product.color.toLowerCase().includes(searchQuery)
      );
    }))

  }, [searchQuery])
  useEffect(() => {
    if (filteredProducts.length > 0) {
      setIsLoading(false)
    }
  }, [filteredProducts])
  return (
    <>
      <Navigator />
      <div className={styles.overall}>
        <Link href="/" className='back'>
          Back
        </Link>

        <div className={styles_search.all}>
          <div className={styles_search.searchBarContainer}>
            <input onChange={handleSearch} type="text" className={styles_search.searchInput} placeholder="Search for your cosmetics" />
            <button className={styles_search.searchButton}>
              <FontAwesomeIcon icon={faSearch} color='black' />
            </button>
          </div>
        </div>
          {isLoading ? (
            <p>Loading products...</p>
          ) : (
            <>
              <div className={styles.sug}>
              <h4>Suggestions</h4> </div>
              <div className={styles.grid}>

                {filteredProducts.map((product) => (
                 <Link key={product.id} href={`/productDetails/${product?.model}`} className={styles.box}>
                  <div key={product.id} className={styles.product}>
                    <img src={`${process.env.NEXT_PUBLIC_API_BASE_URL_IMAGE}/${product?.image}.png`} alt={product.brand} />
                    <div className={styles.productInfo}>
                      <h5>{product.brand}</h5>
                      <h6>{product.model}</h6>
                      <p>฿{product.price}</p>

                    </div>
                  </div>
                </Link>
                ))}
              </div>
            </>

          )}
        </div>
    </>

  );
};