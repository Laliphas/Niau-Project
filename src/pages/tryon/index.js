import { useState, useEffect, useRef } from 'react';
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Tryon.module.css";
import { PrismaClient } from '@prisma/client';
import Webcam from 'react-webcam';
import { saveCapturedImage } from '@/pages/tryon/prismaClient'; // Import saveCapturedImage from prismaClient.js

const prisma = new PrismaClient();

export async function getStaticProps() {
    const colors = await prisma.ProductDetail.findMany();
    return {
        props: { colors },
    };
}

function CapturePic({ colors }) {
    const [imageSrc, setImageSrc] = useState(); // Define image state variable
    const [cldData, setCldData] = useState(null); // Define cldData state variable
    const [lipColor, setLipColor] = useState(colors[0]?.color || ""); // Set default lip color
    const webcamRef = useRef(null); // Initialize webcamRef using useRef

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    };

    useEffect(() => {
        if (!imageSrc) return;

        const fetchData = async () => {
            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: JSON.stringify({
                        image: imageSrc // Correct variable name
                    })
                });
                const data = await response.json();
                setCldData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [imageSrc]);

    const handleCaptureScreenshot = async () => {
        const image = webcamRef.current?.getScreenshot(); // Use optional chaining to avoid errors if webcamRef.current is null
        setImageSrc(image);
        console.log('image', image);
        if (image) {
            try {
                await saveCapturedImage(image); // Save captured image to Prisma database
            } catch (error) {
                console.error('Error saving captured image:', error);
            }
        }
    };

    return (
        <div>
            <Head>
                <title>TryOn | niau</title>
            </Head>
            <div className={styles.insertImage}>
                <input id="file" type="file" accept="image/*" style={{ display: 'none' }} />
                {imageSrc && <img src={imageSrc} alt="Uploaded Image" />}
                {!imageSrc && <Webcam
                    audio={false}
                    height={500}
                    screenshotFormat="image/jpeg"
                    width={500}
                    videoConstraints={videoConstraints}
                    ref={webcamRef} // Assign webcamRef to the ref prop
                />}
                <button onClick={handleCaptureScreenshot}>Capture photo</button>
                <button onClick={() => { setImageSrc(null); setCldData(null); }} color="red"> {/* Fix setting image state to null */}
                    Reset
                </button>
                <select value={lipColor} onChange={(e) => setLipColor(e.target.value)}>
                    {colors.map((color) => (
                        <option key={color.productID} value={color.color}>{color.color}</option>
                    ))}
                </select>
                {/* <button onClick={applyLipFilter}>Apply Lip Filter</button> */}
                <div className={styles.colorBox} style={{ backgroundColor: lipColor }}></div>
            </div>
        </div>
    );
}

export default function Tryon({ colors }) {
    return (
        <div>
            <Head>
                <title>TryOn | niau</title>
            </Head>
            <CapturePic colors={colors} />
        </div>
    );
}
