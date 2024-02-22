import { useState, useEffect, useRef } from 'react';
import Head from "next/head";
import Iamge from "next/image";
import Link from "next/link";
import styles from "@/styles/Tryon.module.css";
import { PrismaClient } from '@prisma/client';
import Webcam from 'react-webcam';

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
    const [pictureTaken, setPictureTaken] = useState(false); // Track if a picture has been taken
    const webcamRef = useRef(null); // Initialize webcamRef using useRef

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    };

    // Function to apply lip color filter
    const applyLipFilter = () => {
        if (imageSrc) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                ctx.fillStyle = lipColor;
                // Adjust these coordinates based on the position of the lips in the image
                ctx.fillRect(100, 100, 50, 20); // Example: Draw a rectangle representing lipstick on the lips
                const updatedImageSrc = canvas.toDataURL('image/jpeg');
                setImageSrc(updatedImageSrc);
            };
            img.src = imageSrc;
        }        
    };

    // index.js
    const handleCaptureScreenshot = async () => {
        const image = webcamRef.current?.getScreenshot(); // Use optional chaining to avoid errors if webcamRef.current is null
        setImageSrc(image);
        setPictureTaken(true); // Indicate that a picture has been taken
    };

    return (
        <div>
            <Head>
                <title>TryOn | niau</title>
            </Head>
            <div className={styles.insertImage}>
                <input id="file" type="file" accept="image/*" style={{ display: 'none' }} />
                {imageSrc && <img src={imageSrc} alt="Cap Image" />}
                {!imageSrc && <Webcam
                    audio={false}
                    height={500}
                    screenshotFormat="image/jpeg"
                    width={500}
                    videoConstraints={videoConstraints}
                    ref={webcamRef} // Assign webcamRef to the ref prop
                />}
                <button onClick={handleCaptureScreenshot}>Capture photo</button>
                <button onClick={() => { setImageSrc(null); setCldData(null); setPictureTaken(false); }} color="red"> {/* Fix setting image state to null */}
                    Reset
                </button>
                {pictureTaken && (
                    <div className={styles.colorSelection}>
                        <select value={lipColor} onChange={(e) => setLipColor(e.target.value)}>
                            {colors.map((color) => (
                                <option key={color.productID} value={color.color}>{color.color}</option>
                            ))}
                        </select>
                        <button onClick={applyLipFilter}>Apply Lip Filter</button>
                    </div>
                )}
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
