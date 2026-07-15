import { useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  FaceLandmarker,
} from "@mediapipe/tasks-vision";

const FaceExpression = () => {
  const videoRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const [expression, setExpression] = useState("Loading...");

  useEffect(() => {
    let animationId;

    const initialize = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
        );

        faceLandmarkerRef.current =
          await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            },
            runningMode: "VIDEO",
            outputFaceBlendshapes: true,
            numFaces: 1,
          });

        detect();
      } catch (err) {
        console.error(err);
        setExpression("Camera Permission Denied");
      }
    };

    const detect = () => {
      if (!faceLandmarkerRef.current || !videoRef.current) {
        animationId = requestAnimationFrame(detect);
        return;
      }

      const results = faceLandmarkerRef.current.detectForVideo(
        videoRef.current,
        performance.now()
      );

      if (results.faceBlendshapes.length > 0) {
        const shapes = results.faceBlendshapes[0].categories;

        const getScore = (name) =>
          shapes.find((s) => s.categoryName === name)?.score || 0;

        const smile =
          (getScore("mouthSmileLeft") +
            getScore("mouthSmileRight")) / 2;

        const frown =
          (getScore("mouthFrownLeft") +
            getScore("mouthFrownRight")) / 2;

        const jawOpen = getScore("jawOpen");

        const browUp = getScore("browInnerUp");

        const browDown =
          (getScore("browDownLeft") +
            getScore("browDownRight")) / 2;

        console.clear();
        console.table({
          Smile: smile.toFixed(2),
          Frown: frown.toFixed(2),
          JawOpen: jawOpen.toFixed(2),
          BrowUp: browUp.toFixed(2),
          BrowDown: browDown.toFixed(2),
        });

        if (smile > 0.50) {
          setExpression("😊 Happy");
        } else if (jawOpen > 0.35 && browUp > 0.20) {
          setExpression("😲 Surprised");
        } else if (frown > 0.20 || browDown > 0.20) {
          setExpression("😔 Sad");
        } else {
          setExpression("😐 Neutral");
        }
      } else {
        setExpression("No Face Detected");
      }

      animationId = requestAnimationFrame(detect);
    };

    initialize();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Face Expression Detection</h2>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        width={640}
        height={480}
        style={{
          borderRadius: "12px",
          border: "2px solid black",
        }}
      />

      <h1 style={{ marginTop: "20px" }}>{expression}</h1>
    </div>
  );
};

export default FaceExpression;