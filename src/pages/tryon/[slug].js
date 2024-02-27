import { useState, useEffect, useRef } from 'react';
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Tryon.module.css";
import { PrismaClient } from '@prisma/client';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import { useRouter } from 'next/router';
import Detect from '@/components/Detect';

function CapturePic({ product }) {
    const [imageSrc, setImageSrc] = useState();
    const [lipColor, setLipColor] = useState(product[0]?.color || "");
    const [pictureTaken, setPictureTaken] = useState(false);
    const [faceDetected, setFaceDetected] = useState(false);
    const [showAllColors, setShowAllColors] = useState(false); // State to manage whether to show all colors or not
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
        console.log("Applying lip filter with color:", lipColor);
        if (imageSrc) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
    
            const nextImage = document.createElement('img');
    
            nextImage.onload = async () => {
                canvas.width = nextImage.width;
                canvas.height = nextImage.height;
                ctx.drawImage(nextImage, 0, 0);
    
                const img = await faceapi.fetchImage(imageSrc);
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
                    console.log("Updated image source:", updatedImageSrc);
                    setImageSrc(updatedImageSrc);
                }
            };
    
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
                const ctx = canvas.getContext('2d');

                ctx.beginPath();
                ctx.moveTo(mouth[0].x, mouth[0].y);
                for (let i = 1; i < mouth.length; i++) {
                    ctx.lineTo(mouth[i].x, mouth[i].y);
                }
                ctx.closePath();
            });

            setFaceDetected(resizedDetections.length > 0);
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
        
        <div className={styles.container}>
            <Detect/>
            <div>
            
              
                <input id="file" type="file" accept="image/*" style={{ display: 'none' }} />
                {imageSrc && <img src={imageSrc} alt="Captured Image" />}
                {!imageSrc && <Webcam
                    audio={false}
                    height={360}
                    screenshotFormat="image/jpeg"
                    width={600}
                    videoConstraints={videoConstraints}
                    ref={webcamRef}
                />}
                
                {pictureTaken && (
                    <div >
                        <div className={styles.colorimg} >
                        <img src="/color.png" width={60} height={60} alt="not found"/>
                        </div>
                     
                        <p className={styles.Detect}
                            
                        >{faceDetected ? 'We found you' : 'Please try again'}</p>
                        {product && (
                            <div className={styles.insertcolor} style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {showAllColors ? (
                                <div className={styles.colorbox}>
                                    {product.map((productItem) => (
                                        <button
                                            key={productItem.productID}
                                            style={{ backgroundColor: productItem.color, width: '40px', height: '40px', margin: '5px' }}
                                            onClick={() => {
                                                setLipColor(productItem.color);
                                                applyLipFilter(); // Call applyLipFilter function here
                                            }}
                                        ></button>
                                    ))}
                                </div>
                            ) : (
                                
                                <div className={styles.colorbox}>

                                    {product.slice(0, 3).map((productItem) => (
                                        <button
                                            key={productItem.productID}
                                            style={{ backgroundColor: productItem.color, width: '50px', height: '50px', margin: '5px' }}
                                            onClick={() => {
                                                setLipColor(productItem.color);
                                                applyLipFilter(); // Call applyLipFilter function here
                                            }}
                                        ></button>
                                    ))}
                                </div>
                            )}

                            {product.length > 3 && (
                                <>  
                                <br/>
                                    <button onClick={() => setShowAllColors(!showAllColors)}
                                     className={styles.showlesscolor}
                                    >
                                        {showAllColors ? 'Show less colors' : `Show ${product.length - 3} more colors`}
                                    </button>
                                    
                                </>
                            )}

                        </div>
                        
                        )}
                    </div>
                )}
                
                <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
            
            <div className={styles.insertreset}>
                <button onClick={() => { setImageSrc(null); setPictureTaken(false); }} color="red">
                    <img src="/reset.png" width={5} height={5} alt="not found"/>
                </button>
            </div>
            <div className={styles.insertbotton}>
                <button onClick={handleCaptureScreenshot}>
                    <img src="/CameraTryon.png" width={50} height={50} alt="not found"/>
                </button>
            </div>
            
        </div>
        
    );
}

export default function Tryon() {
    const router = useRouter();
    const { slug } = router.query;
    

    useEffect(() => {
        if (slug) {
            const fetchData = async () => {
                try {
                    const encodedSlug = decodeURIComponent(slug);
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/productDetailsByProduct?model=${encodedSlug}`);
                    setProduct(response.data);
                } catch (error) {
                    console.error('Error fetching product details:', error);
                    // Handle error as needed
                }
            };

            fetchData();
        }
    }, [slug]);

    const [product, setProduct] = useState(null);

    return (
        <>
        
        <div>
        <Head>
            <title>TryOn | niau</title>
        </Head>
        {product && <CapturePic product={product} />}
       </div>
       </>
    );
}
