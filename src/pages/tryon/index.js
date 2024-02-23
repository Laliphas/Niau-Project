import { useState, useEffect, useRef } from 'react';
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Tryon.module.css";

import { PrismaClient } from '@prisma/client';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';


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
    const [imageSrc, setImageSrc] = useState();
    const [lipColor, setLipColor] = useState(colors[0]?.color || "");
    const [pictureTaken, setPictureTaken] = useState(false);
    const [faceDetected, setFaceDetected] = useState(false);
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    const videoConstraints = {
        width: 500,
        height: 500,
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
<<<<<<< HEAD
            <Head>
                <title>TryOn | niau</title>
            </Head>
        
=======
>>>>>>> dedc6c882fa1fb0016c94540192ed820075b9203
            <div className={styles.insertImage}>
                <input id="file" type="file" accept="image/*" style={{ display: 'none' }} />
                {imageSrc && <img src={imageSrc} alt="Captured Image" />}
                {!imageSrc && <Webcam
                    audio={false}
                    height={400}
                    screenshotFormat="image/jpeg"
                    width={400}
                    videoConstraints={videoConstraints}
                    ref={webcamRef}
                />}
<<<<<<< HEAD
                
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
=======
                <button onClick={handleCaptureScreenshot}>Capture photo</button>
                <button onClick={() => { setImageSrc(null); setPictureTaken(false); }} color="red">
                    Reset
                </button>

                {pictureTaken && (
                    <div className={styles.colorSelection}>
                        <p className='styles.Detect'>{faceDetected ? 'We found you' : 'No face detected. Please try again'}</p>
                        <select value={lipColor} onChange={(e) => setLipColor(e.target.value)}>
                            {colors.map((color) => (
                                <option key={color.productID} value={color.color}>{color.color}</option>
                            ))}
                        </select>
                        <button onClick={applyLipFilter}>Apply Lip Filter</button>
                    </div>
                )}

                <canvas ref={canvasRef} style={{ display: 'none' }} />
>>>>>>> dedc6c882fa1fb0016c94540192ed820075b9203
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
<<<<<<< HEAD
}




=======
}
>>>>>>> dedc6c882fa1fb0016c94540192ed820075b9203
