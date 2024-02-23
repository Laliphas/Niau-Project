import styles from "./recom.module.css";
import Link from "next/link";
import Navigator from "@/components/NavigatorBar";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Warm() {
  const [productsData, setProductsData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [tone, setTone] = useState('warm');
  const [dropdown, setDropdown] = useState(false);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/productDetails`
        );
        setProductsData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchData();
  }, []);

  const handleChange = (tone) => {
    setTone(tone);
    setDropdown(false)
  };
  const handleClick = () => {
    setDropdown(true);
  };

  useEffect(() => {
    setFilterData(productsData.filter((item) => item.skinTone === tone));
  }, [tone, productsData]);

  return (
    <>
      <Navigator />
      <div className={styles.body}>
        <div className={styles.header}>
          <h1>Recommended</h1>
        </div>
        <div className={styles.head}>
          <div className={styles.headBox}>
            for&nbsp;<a className={styles.select} onClick={handleClick}>{tone} tone
            </a>
            {
              dropdown ?
                <div className={styles.option}>
                  <button onClick={() => handleChange('warm')}>Warm Tone</button>
                  <button onClick={() => handleChange('neutral')}>Natural Tone</button>
                  <button onClick={() => handleChange('cool')}>Cool Tone</button>
                </div> : null
            }
          </div>

        </div>



        <div className={styles.products}>
          {filterData.map((product) => (

            <Link key={product.id} href={`/productDetails/${product?.model}`} className={styles.box}>
              <div className={styles.boximg}>
                <img className={styles.img} loading='lazy' src={`${process.env.NEXT_PUBLIC_API_BASE_URL_IMAGE}/${product?.image}.png`} alt="image" />
              </div>
              <div className={styles.content}>
                <div>
                  {product?.brand}
                </div>
                <div>
                  Model : {product?.model}
                </div>
                <div>
                  $ {product?.price} / pc
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>

  );
}
