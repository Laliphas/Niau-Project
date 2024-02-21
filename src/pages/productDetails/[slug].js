import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Navigator2 from "@/components/NavigatorBar";
import styles from "./productDetails.module.css";
import Link from "next/link";
import axios from 'axios';

export default function ProductDetails() {
    const router = useRouter();
    const { slug } = router.query;
    const [product, setProduct] = useState(null);
    const mock = [
        {
            "productID": 5,
            "brand": "Kate",
            "image": "kate103",
            "model": "Lip Monster",
            "color": "#EC9598",
            "colorNumber": "103",
            "colorName": "Flame in My Heart",
            "glowy": 4,
            "matte": 0,
            "longLasting": 5,
            "price": 436,
            "amout": 3,
            "whereToBuy": "watsons",
            "skinTone": "neutral",
            "productType": "Lipstick"
        },
        {
            "productID": 6,
            "brand": "Kate",
            "image": "kate13",
            "model": "Lip Monster",
            "color": "#ED8BAD",
            "colorNumber": "13",
            "colorName": "Tipsy at 3:00",
            "glowy": 4,
            "matte": 0,
            "longLasting": 5,
            "price": 436,
            "amout": 3,
            "whereToBuy": "watsons",
            "skinTone": "cool",
            "productType": "Lipstick"
        },
        {
            "productID": 4,
            "brand": "Kate",
            "image": "kate05",
            "model": "Lip Monster",
            "color": "#B45D59",
            "colorNumber": "05",
            "colorName": "Dark Fig",
            "glowy": 4,
            "matte": 0,
            "longLasting": 5,
            "price": 436,
            "amout": 3,
            "whereToBuy": "watsons",
            "skinTone": "warm",
            "productType": "Lipstick"
        }
    ]
    useEffect(() => {
        if (slug) {
            fetchProduct(slug);
        }
    }, [slug]);

    const fetchProduct = async (slug) => {
        try {
            const encodedSlug = decodeURIComponent(slug);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/productDetailsByProduct?model=${encodedSlug}`);
            setProduct(response.data || mock);
        } catch (error) {
            // setProduct(mock);
            console.error('Error fetching product:', error);
        }
    };
    if (!product) {
        // setProduct(mock);
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <Link href="/" className={styles.back}>
                    Back
                </Link>
                <div className={styles.header}>
                    <h1>{product[0]?.model}</h1>
                </div>
                <div className={styles.container}>
                    <div className={styles.boximg}>
                        <img className={styles.img} src={`${process.env.NEXT_PUBLIC_API_BASE_URL_IMAGE}/${product[0]?.image}.png`} alt="image" />
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <div>{product[0]?.model} {product[0]?.amout} g</div>
                        <div><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402m5.726-20.583c-2.203 0-4.446 1.042-5.726 3.238-1.285-2.206-3.522-3.248-5.719-3.248-3.183 0-6.281 2.187-6.281 6.191 0 4.661 5.571 9.429 12 15.809 6.43-6.38 12-11.148 12-15.809 0-4.011-3.095-6.181-6.274-6.181" /></svg></div>
                    </div>
                    <div>
                        Price : {product[0]?.price} baht
                    </div>
                    <div>
                        Brand : {product[0]?.brand}
                    </div>
                    <div>
                        Color : {product[0]?.colorNumber} {product[0]?.colorName} {product[0]?.color}
                    </div>
                    <div>
                        Tone : {product[0]?.skinTone}
                    </div>
                    <div>
                        Glowy : {product[0]?.glowy}/5
                    </div>
                    <div>
                        Matte : {product[0]?.matte}/5
                    </div>
                    <div>
                        Long Lasting : {product[0]?.longLasting}/5
                    </div>
                    <div className={styles.subheader}>
                        SHADE
                    </div>
                    <div className={styles.colorCode}>
                        {product.map(productItem => (
                            <div key={productItem.id}>
                                {productItem.colorNumber} - {productItem.colorName} ({productItem.skinTone} Tone)<br />
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.colorContainer}>
                    {product.map(productItem => (
                        <div className={styles.colorBox} key={productItem.id}>
                            <div className={styles.color} style={{ background: productItem.color }}></div>
                            <div className={styles.text}>{productItem.colorNumber}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
