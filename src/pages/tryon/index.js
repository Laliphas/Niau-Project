import { useState, useEffect, useRef } from 'react';
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Tryon.module.css";
import { PrismaClient } from '@prisma/client';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

const prisma = new PrismaClient();

export async function getStaticProps() {
    const colors = await prisma.ProductDetail.findMany();
    return {
        props: { colors },
    };
}

function CapturePic({ colors }) {
    const [imageSrc, setImageSrc] = useState();
    const [lipColor, setLipColor] = useState(colors[0]?.color || "");
    const [pictureTaken, setPictureTaken] = useState(false);
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    };

    useEffect(() => {
        loadModels();
    }, []);

    const loadModels = async () => {
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
            faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
            faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
            faceapi.nets.faceExpressionNet.loadFromUri("/models")
        ]);
    };

    const applyLipFilter = async () => {
        if (imageSrc) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
    
            // Create a new HTML image element
            const nextImage = document.createElement('img');
    
            // Set up an event listener for the image load event
            nextImage.onload = async () => {
                canvas.width = nextImage.width;
                canvas.height = nextImage.height;
                ctx.drawImage(nextImage, 0, 0);
    
                // Fetch the image asynchronously using faceapi
                const img = await faceapi.fetchImage(imageSrc);
    
                // Detect faces in the image
                const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceDescriptors();
    
                if (detections.length > 0) {
                    const mouth = detections[0].landmarks.getMouth();
    
                    // Draw a rectangle representing lipstick on the lips
                    ctx.fillStyle = lipColor;
                    ctx.fillRect(mouth[0].x, mouth[0].y, mouth[6].x - mouth[0].x, mouth[10].y - mouth[6].y);
    
                    const updatedImageSrc = canvas.toDataURL('image/jpeg');
                    setImageSrc(updatedImageSrc);
                }
            };
            // Set the src attribute of the image to the imageSrc
            nextImage.src = imageSrc;
        }
    };
    
    const faceMyDetect = async (imageSrc) => {
        if (imageSrc) {
            const img = await faceapi.fetchImage(imageSrc);
            const detections = await faceapi.detectAllFaces(img,
                new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
            
            console.log("Detected faces:", detections.length);
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
    
            canvas.width = img.width;
            canvas.height = img.height;
    
            faceapi.matchDimensions(canvas, {
                width: img.width,
                height: img.height
            });
    
            const resizedDetections = faceapi.resizeResults(detections, {
                width: img.width,
                height: img.height
            });

            resizedDetections.forEach(detection => {
                const mouth = detection.landmarks.getMouth();
        
                // Draw a rectangle around the mouth
                const mouthRect = new faceapi.Rect(mouth[0].x, mouth[0].y, mouth[6].x - mouth[0].x, mouth[10].y - mouth[6].y);
                faceapi.draw.drawDetections(canvas, [mouthRect]);
              });
    
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        }
    };
    
    const handleCaptureScreenshot = async () => {
        const image = webcamRef.current.getScreenshot();
        setImageSrc(image);
        setPictureTaken(true);
        faceMyDetect(image);
    };
    
    
    

    return (
        <div>
            <Head>
                <title>TryOn | niau</title>
            </Head>
            <div className={styles.insertImage}>
                <input id="file" type="file" accept="image/*" style={{ display: 'none' }} />
                {imageSrc && <img src={imageSrc} alt="Captured Image" />}
                {!imageSrc && <Webcam
                    audio={false}
                    height={500}
                    screenshotFormat="image/jpeg"
                    width={500}
                    videoConstraints={videoConstraints}
                    ref={webcamRef}
                />}
                <button onClick={handleCaptureScreenshot}>Capture photo</button>
                <button onClick={() => { setImageSrc(null); setPictureTaken(false); }} color="red">
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

                <canvas ref={canvasRef} style={{ display: 'none' }} />
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
