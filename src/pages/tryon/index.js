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
    const product = await prisma.ProductDetail.findMany();
    return {
        props: { product },
    };
}

function CapturePic({ product }) {
    const [imageSrc, setImageSrc] = useState();
    const [lipColor, setLipColor] = useState(product?.color || "");
    const [selectedProductId, setSelectedProductId] = useState(product?.productID || "");
    const [pictureTaken, setPictureTaken] = useState(false);
    const [faceDetected, setFaceDetected] = useState(false);
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    
    const videoConstraints = {
        
        width: 1280,
        height: 1280,
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

                    ctx.fillStyle = lipColor;
                    ctx.beginPath();
                    ctx.moveTo(mouth[0].x, mouth[0].y);
                    for (let i = 1; i < mouth.length; i++) {
                        ctx.lineTo(mouth[i].x, mouth[i].y);
                    }
                    ctx.closePath();
                    ctx.fill();
    
                    const updatedImageSrc = canvas.toDataURL('image/jpeg');
                    setImageSrc(updatedImageSrc);
                }
            };
            // Set the src attribute of the image to the imageSrc
            nextImage.src = imageSrc;
        }
    };
    
    const filterColorsByProduct = () => {
        const selectedProduct = product.find(product => product.id === selectedProductId);
        return selectedProduct ? selectedProduct.colors : [];
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
                const ctx = canvas.getContext('2d');

                // Draw mouth shape
                ctx.beginPath();
                ctx.moveTo(mouth[0].x, mouth[0].y);
                for (let i = 1; i < mouth.length; i++) {
                    ctx.lineTo(mouth[i].x, mouth[i].y);
                }
                ctx.closePath();
            });
            
            setFaceDetected(resizedDetections.length > 0); // Update face detection status
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
            <div className={styles.insertImage}>
                <input id="file" type="file" accept="image/*" style={{ display: 'none' }} />
                {imageSrc && <img src={imageSrc} alt="Captured Image" />}
                {!imageSrc && <Webcam
                    audio={false}
                    height={380}
                    screenshotFormat="image/jpeg"
                    width={600}
                    videoConstraints={videoConstraints}
                    ref={webcamRef}
                />}

                

                {pictureTaken && (
                    <div className={styles.colorSelection}>
                        <p className='styles.Detect'>{faceDetected ? 'We found you' : 'No face detected. Please try again'}</p>
                {product && (
                    <div className='style.colorbox'>
                        {product.map((productItem) => (
                            <button
                                key={productItem.productID}
                                style={{ backgroundColor: productItem.color, width: '30px', height: '30px', margin: '5px' }}
                                onClick={() => setLipColor(productItem.color)}
                            ></button>
                            
                        ))}
                    </div>
                )}
                    </div>
                )}

                <canvas ref={canvasRef} style={{ display: 'none' }} />
                
            </div>
            <div className={styles.insertreset}>
            <button onClick={() => { setImageSrc(null); setPictureTaken(false); }} color="red">
                <img src="/reset.png"
                    width={5} height={5} alt="not found"/>
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