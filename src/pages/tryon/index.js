import { useState, useEffect, useRef } from 'react';
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Tryon.module.css";

import { PrismaClient } from '@prisma/client';
import Webcam from 'react-webcam';
import { saveCapturedImage } from '@/pages/tryon/prismaClient'; // Import saveCapturedImage from prismaClient.js


const prisma = new PrismaClient();
let faceLandmarker;

async function createFaceLandmarker() {
    const filesetResolver = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );
    faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
        delegate: "GPU"
      },
      outputFaceBlendshapes: true,
      runningMode: "IMAGE", // Set runningMode to 'IMAGE'
      numFaces: 1
    });
}

export async function getStaticProps() {
    const colors = await prisma.ProductDetail.findMany();
    return {
        props: { colors },
    };
}

function ImageUploader({ colors }) {
    const [imageSrc, setImageSrc] = useState(null);
    const [lipColor, setLipColor] = useState(colors[0]?.color || "#ffffff");

    useEffect(() => {
        const reader = new FileReader();
        const fileInput = document.getElementById("file");

        reader.onload = e => {
            setImageSrc(e.target.result);
        };

        const handleChange = (e) => {
            const file = e.target.files[0];
            reader.readAsDataURL(file);
        };

        fileInput.addEventListener('change', handleChange);

        return () => {
            fileInput.removeEventListener('change', handleChange);
        };
    }, []);

    useEffect(() => {
        createFaceLandmarker();
    }, []);

    async function applyLipFilter() {
      if (imageSrc) {
        const img = document.getElementById("img");
    
        try {
          // Ensure image is loaded and has valid dimensions
          if (!img.complete || img.width === 0 || img.height === 0) {
            throw new Error("Image is not fully loaded or has invalid dimensions.");
          }
    
          const faceLandmarks = await FaceLandmarker.detect(img);
    
          // Validate landmark indices and data
          if (!faceLandmarks || !faceLandmarks[51] || !faceLandmarks[57]) {
            throw new Error("Missing or invalid face landmarks.");
          }
    
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
    
          ctx.drawImage(img, 0, 0, img.width, img.height);
    
          // Set line width and fill style
          ctx.lineWidth = 2;
          ctx.fillStyle = lipColor;
    
          // Draw lip line segment between valid landmarks
          ctx.beginPath();
          ctx.moveTo(faceLandmarks[51].x, faceLandmarks[51].y);
          ctx.lineTo(faceLandmarks[57].x, faceLandmarks[57].y);
          ctx.closePath();
          ctx.stroke();
    
          setImageSrc(canvas.toDataURL()); // Assuming base64 encoding is desired
        } catch (error) {
          console.error("Error in applying lip filter:", error);
          // Handle error gracefully, e.g., display a message to the user
        }
      }
    }

    const handleEditPhoto = () => {
        const fileInput = document.getElementById("file");
        fileInput.click();
    };

    return (
        <div className={styles.insertImage}>
          
            <input id="file" type="file" accept="image/*" style={{ display: 'none' }} />
            
            {imageSrc && <img id="img" src={imageSrc} alt="Uploaded Image" />}
            <select value={lipColor} onChange={(e) => setLipColor(e.target.value)}>
                {colors.map((color) => (
                    <option key={color.productID} value={color.color}>{color.color}</option>
                ))}
            </select>
            <button onClick={handleEditPhoto}>Edit Photo</button>
            <button onClick={applyLipFilter}>Apply Lip Filter</button>
            <div className={styles.colorBox} style={{ backgroundColor: lipColor }}></div>
        </div>
    );
}

function CapturePic({ colors }) {
    const [imageSrc, setImageSrc] = useState(); // Define image state variable
    const [cldData, setCldData] = useState(null); // Define cldData state variable
    const [lipColor, setLipColor] = useState(colors[0]?.color || ""); // Set default lip color
    const webcamRef = useRef(null); // Initialize webcamRef using useRef

    const videoConstraints = {
        width: 500,
        height: 500,
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
                    height={400}
                    screenshotFormat="image/jpeg"
                    width={400}
                    videoConstraints={videoConstraints}
                    ref={webcamRef} // Assign webcamRef to the ref prop
                />}
                
                <select value={lipColor} onChange={(e) => setLipColor(e.target.value)}>
                    {colors.map((color) => (
                        <option key={color.productID} value={color.color}>{color.color}</option>
                    ))}
                </select>
                {/* <button onClick={applyLipFilter}>Apply Lip Filter</button> */}
                <div className={styles.colorBox} style={{ backgroundColor: lipColor }}></div>
                <button onClick={() => { setImageSrc(null); setCldData(null); }} color="red"> {/* Fix setting image state to null */}
                    Reset
                </button>
            </div>
            <div className={styles.insertbotton}>
                    <button onClick={handleCaptureScreenshot}><img src="/CameraTryon.png"
                    width={50} height={50} alt="not found"/></button>
                 
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




